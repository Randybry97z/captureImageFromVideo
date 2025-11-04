"use client";
import { useRef, useState } from "react";
import { CaptureSettings, CapturedImage } from '../types/video';
import VideoPlayer from './video/VideoPlayer';
import CaptureSettingsForm from './video/CaptureSettingsForm';
import CapturedImagesGallery from './video/CapturedImagesGallery';
import ProgressBar from './ui/ProgressBar';
import LicenseManager from './ui/LicenseManager';
import { captureMultipleImages } from '../services/captureService';
import VideoFileUpload from './video/VideoFileUpload';
import VideoUrlInput from './video/VideoUrlInput';
import { VideoUrlInfo, getVideoEmbedUrl } from '../services/videoUrlService';
import { LicenseService } from '../services/licenseService';
import { LicenseInfo } from '../types/license';

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

type InputMethod = 'file' | 'url';

type UrlPlatform = 'youtube' | 'vimeo' | 'dailymotion' | 'other';
interface BackendProcessRequest {
  url: string;
  interval: number;
  startTime: number;
  endTime?: number;
  licenseKey?: string;
}

interface BackendProcessResponse {
  success: boolean;
  images?: string[];
  error?: string;
  message?: string;
}

export default function VideoCapture() {
  const [inputMethod, setInputMethod] = useState<InputMethod>('file');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);
  const [videoPlatform, setVideoPlatform] = useState<UrlPlatform>('other');
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const [captureSettings, setCaptureSettings] = useState<CaptureSettings>({
    interval: 1,
    intervalType: 'seconds',
    startTime: 0 });
  const [capturedImages, setCapturedImages] = useState<CapturedImage[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureProgress, setCaptureProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [currentLicense, setCurrentLicense] = useState<LicenseInfo | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const licenseService = LicenseService.getInstance();

  // Handle file upload
  const handleFileSelect = (file: File) => {
    const url = URL.createObjectURL(file);
    setVideoUrl(url);
    setEmbedUrl(null);
    setVideoPlatform('other');
    setCapturedImages([]);
    setCaptureProgress(0);
    setError(null);
  };

  // Handle video URL
  const handleUrlSubmit = (urlInfo: VideoUrlInfo) => {
    const embed = getVideoEmbedUrl(urlInfo);
    setEmbedUrl(embed);
    setVideoPlatform(urlInfo.platform);
    setCapturedImages([]);
    setCaptureProgress(0);
    setError(null);
    if (urlInfo.platform === 'other') {
      setVideoUrl(urlInfo.url);
    } else {
      setVideoUrl(null);
    }
  };

  const handleLoadedMetadata = (duration: number) => {
    setVideoDuration(duration);
    setCaptureSettings(prev => ({
      ...prev,
      endTime: Math.floor(duration)
    }));
  };

  const handleSettingChange = (field: keyof CaptureSettings, value: any) => {
    setCaptureSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Process video with backend for YouTube/Vimeo/Dailymotion
  const processVideoWithBackend = async (url: string, settings: CaptureSettings): Promise<CapturedImage[]> => {
    const requestData: BackendProcessRequest = {
      url,
      interval: settings.intervalType === 'minutes' ? settings.interval * 60 : settings.interval,
      startTime: settings.startTime,
      endTime: settings.endTime,
      licenseKey: currentLicense?.key,
    };

    try {
      // Simulate progress for better UX
      setCaptureProgress(10); // Starting
      setTimeout(() => setCaptureProgress(30), 1000); // Downloading
      setTimeout(() => setCaptureProgress(60), 2000); // Processing
      setTimeout(() => setCaptureProgress(90), 3000); // Finalizing

      const response = await fetch('/api/process-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data: BackendProcessResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      if (!data.success || !data.images) {
        throw new Error(data.error || 'Backend processing failed');
      }

      // Convert base64 images to CapturedImage format
      const images: CapturedImage[] = data.images.map((base64mage, index) => {
        const timestamp = settings.startTime + (index * (settings.intervalType === 'minutes' ? settings.interval * 60 : settings.interval));
        return {
          id: `backend-capture-${timestamp}-${Date.now()}`,
          url: base64mage,
          timestamp: timestamp,
          timeString: formatTime(timestamp),
        };
      });

      setCaptureProgress(100); // Complete
      return images;
    } catch (error) {
      console.error('Backend video processing failed:', error);
      throw error;
    }
  };

  const handleCaptureMultiple = async () => {
    // Check license limits before starting
    const estimatedImages = Math.ceil((captureSettings.endTime || videoDuration) / 
      (captureSettings.intervalType === 'minutes' ? captureSettings.interval * 60 : captureSettings.interval));
    
    if (!licenseService.canGenerateImages(estimatedImages)) {
      setError(`You've reached your monthly limit of 100 images. Upgrade to Premium for unlimited usage.`);
      return;
    }

    setIsCapturing(true);
    setCapturedImages([]);
    setCaptureProgress(0);
    setError(null);

    try {
      let images: CapturedImage[] = [];

      if (videoPlatform !== 'other' && embedUrl) {
        // Use backend for YouTube/Vimeo/Dailymotion
        const originalUrl = embedUrl.includes('youtube.com/embed/')
          ? `https://www.youtube.com/watch?v=${embedUrl.split('/embed/')[1]}`
          : embedUrl.includes('vimeo.com/video/')
          ? `https://vimeo.com/${embedUrl.split('/video/')[1]}`
          : embedUrl.includes('dailymotion.com/embed/video/')
          ? `https://www.dailymotion.com/video/${embedUrl.split('/embed/video/')[1]}`
          : embedUrl;
        
        images = await processVideoWithBackend(originalUrl, captureSettings);
      } else if (videoRef.current) {
        // Use frontend capture for uploaded files or direct video URLs
        const intervalInSeconds = captureSettings.intervalType === 'minutes' ? captureSettings.interval * 60 : captureSettings.interval;
        const endTime = captureSettings.endTime || videoDuration;
        const captureTimes: number[] = [];
        for (let time = captureSettings.startTime; time <= endTime; time += intervalInSeconds) {
          captureTimes.push(time);
        }
        images = await captureMultipleImages(
          videoRef.current,
          captureTimes,
          formatTime,
          setCaptureProgress
        );
      }

      // Track usage after successful capture
      if (images.length > 0) {
        const success = licenseService.incrementUsage(images.length);
        if (!success) {
          setError('Usage limit exceeded. Some images may not have been saved.');
        }
      }

      setCapturedImages(images);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred during capture');
      console.error('Capture failed:', error);
    } finally {
      setIsCapturing(false);
      setCaptureProgress(0);
    }
  };

  const downloadAllImages = () => {
    capturedImages.forEach((image) => {
      const link = document.createElement("a");
      link.href = image.url;
      link.download = `capture-${image.timeString.replace(':', '-')}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  const downloadImage = (image: CapturedImage) => {
    const link = document.createElement('a');
    link.href = image.url;
    link.download = `capture-${image.timeString.replace(':', '-')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLicenseChange = (license: LicenseInfo) => {
    setCurrentLicense(license);
  };

  const isDirectVideoUrl = inputMethod === 'file' || (inputMethod === 'url' && videoPlatform === 'other' && videoUrl);
  const isEmbedOnly = inputMethod === 'url' && videoPlatform !== 'other';

  return (
    <div className="w-full max-w-4xl space-y-6">
      {/* License Manager */}
      <LicenseManager onLicenseChange={handleLicenseChange} />
      
      {/* Input Method Toggle */}
      <div className="flex justify-center gap-4 mb-4">
        <button
          className={`px-4 py-2 rounded font-semibold border transition ${inputMethod === 'file' ? 'bg-[#00FFB0] text-black border-[#00FFB0]' : 'bg-[#23262F] text-[#00FFB0] border-[#353945]'}`}
          onClick={() => setInputMethod('file')}
          disabled={isCapturing}
        >
          Subir Archivo
        </button>
        <button
          className={`px-4 py-2 rounded font-semibold border transition ${inputMethod === 'url' ? 'bg-[#00FFB0] text-black border-[#00FFB0]' : 'bg-[#23262F] text-[#00FFB0] border-[#353945]'}`}
          onClick={() => setInputMethod('url')}
          disabled={isCapturing}
        >
          Pegar Enlace de Video
        </button>
      </div>
      
      {/* File Upload or URL Input */}
      {inputMethod === 'file' ? (
        <VideoFileUpload onFileSelect={handleFileSelect} disabled={isCapturing} />
      ) : (
        <VideoUrlInput onUrlSubmit={handleUrlSubmit} disabled={isCapturing} />
      )}
      
      {/* Video Preview */}
      {(videoUrl || embedUrl) && (
        <div className="bg-[#23262F] p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-white">Vista Previa del Video</h2>
          {isDirectVideoUrl && videoUrl && (
            <VideoPlayer
              src={videoUrl}
              videoRef={videoRef}
              onLoadedMetadata={handleLoadedMetadata}
              className="w-full rounded shadow mb-4 bg-black"
            />
          )}
          {isEmbedOnly && embedUrl && (
            <iframe
              src={embedUrl}
              className="w-full rounded shadow mb-4 bg-black"
              style={{ maxHeight: 300 }}
              allow="autoplay; encrypted-media"
              allowFullScreen
              title="Embedded Video"
            />
          )}
          {videoDuration > 0 && isDirectVideoUrl && (
            <p className="text-sm text-gray-400">
              Duración: {formatTime(videoDuration)}
            </p>
          )}
        </div>
      )}
      
      {/* Error Display */}
      {error && (
        <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {/* Capture Settings */}
      {(isDirectVideoUrl || isEmbedOnly) && (
        <CaptureSettingsForm
          settings={captureSettings}
          videoDuration={videoDuration}
          onChange={handleSettingChange}
          onStart={handleCaptureMultiple}
          disabled={isCapturing}
        />
      )}
      
      {isCapturing && (
        <div className="mt-4">
          <ProgressBar percentage={captureProgress} />
          <p className="text-sm text-gray-400 mt-2">
            Progreso: {Math.round(captureProgress)}%
          </p>
        </div>
      )}
      
      {/* Captured Images */}
      {capturedImages.length > 0 && (
        <CapturedImagesGallery
          images={capturedImages}
          onDownload={downloadImage}
          onDownloadAll={downloadAllImages}
        />
      )}
    </div>
  );
} 