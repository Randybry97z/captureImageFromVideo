import { CaptureSettings, CapturedImage } from '../types/video';

interface BackendProcessRequest {
  url: string;
  interval: number;
  startTime: number;
  endTime?: number;
}

interface BackendProcessResponse {
  success: boolean;
  images?: string[];
  error?: string;
  message?: string;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export async function processVideoWithBackend(
  url: string,
  settings: CaptureSettings,
  onProgress?: (progress: number) => void
): Promise<CapturedImage[]> {
  const requestData: BackendProcessRequest = {
    url,
    interval: settings.intervalType === 'minutes' ? settings.interval * 60 : settings.interval,
    startTime: settings.startTime,
    endTime: settings.endTime,
  };

  try {
    // Simulate progress for better UX
    if (onProgress) {
      onProgress(10); // Starting
      setTimeout(() => onProgress!(30), 1000); // Downloading
      setTimeout(() => onProgress!(60), 2000); // Processing
      setTimeout(() => onProgress!(90), 3000); // Finalizing
    }

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
    const images: CapturedImage[] = data.images.map((base64Image, index) => {
      const timestamp = settings.startTime + (index * (settings.intervalType === 'minutes' ? settings.interval * 60 : settings.interval));
      return {
        id: `backend-capture-${timestamp}-${Date.now()}`,
        url: base64Image,
        timestamp,
        timeString: formatTime(timestamp),
      };
    });

    if (onProgress) {
      onProgress(100); // Complete
    }

    return images;
  } catch (error) {
    console.error('Backend video processing failed:', error);
    throw error;
  }
}
