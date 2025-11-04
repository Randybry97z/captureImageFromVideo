import React, { useState } from 'react';
import { VideoUrlInfo, validateVideoUrl, getPlatformName } from '../../services/videoUrlService';

interface VideoUrlInputProps {
  onUrlSubmit: (urlInfo: VideoUrlInfo) => void;
  disabled?: boolean;
}

const VideoUrlInput: React.FC<VideoUrlInputProps> = ({ onUrlSubmit, disabled }) => {
  const [url, setUrl] = useState('');
  const [urlInfo, setUrlInfo] = useState<VideoUrlInfo | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
    
    if (newUrl.trim()) {
      setIsValidating(true);
      const info = validateVideoUrl(newUrl);
      setUrlInfo(info);
      setIsValidating(false);
    } else {
      setUrlInfo(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInfo && urlInfo.isValid) {
      onUrlSubmit(urlInfo);
      setUrl('');
      setUrlInfo(null);
    }
  };

  const getStatusColor = () => {
    if (!urlInfo) return 'text-gray-500';
    return urlInfo.isValid ? 'text-[#00FFB0]' : 'text-red-400';
  };

  const getStatusText = () => {
    if (!url) return 'Pega un enlace de video';
    if (isValidating) return 'Validando...';
    if (!urlInfo?.isValid) return 'Enlace no válido';
    return `Enlace válido de ${getPlatformName(urlInfo.platform)}`;
  };

  return (
    <div className="bg-[#23262F] p-6 rounded-lg shadow-md mb-4">
      <h2 className="text-xl font-semibold mb-4 text-white">Enlace de Video</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            URL del Video
          </label>
          <input
            type="url"
            value={url}
            onChange={handleUrlChange}
            placeholder="https://www.youtube.com/watch?v=..."
            disabled={disabled}
            className="w-full border rounded px-3 py-2 text-gray-100 bg-[#181A20] border-[#353945] focus:ring-2 focus:ring-[#00FFB0] focus:border-[#00FFB0] disabled:bg-gray-800"
          />
          <p className={`text-sm mt-1 ${getStatusColor()}`}>
            {getStatusText()}
          </p>
        </div>
        <button
          type="submit"
          disabled={disabled || !urlInfo?.isValid || !url.trim()}
          className="w-full bg-[#00FFB0] text-black px-4 py-2 rounded font-semibold hover:bg-[#00e6a0] disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          Cargar Video
        </button>
      </form>
      <div className="mt-4 text-sm text-gray-400">
        <p className="font-medium mb-2">Plataformas soportadas:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>YouTube (youtube.com, youtu.be)</li>
          <li>Vimeo (vimeo.com)</li>
          <li>Dailymotion (dailymotion.com, dai.ly)</li>
          <li>Otros enlaces de video</li>
        </ul>
      </div>
    </div>
  );
};

export default VideoUrlInput; 