import React, { useRef } from 'react';

interface VideoFileUploadProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

const VideoFileUpload: React.FC<VideoFileUploadProps> = ({ onFileSelect, disabled }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div className="bg-[#23262F] p-6 rounded-lg shadow-md mb-4">
      <h2 className="text-xl font-semibold mb-4 text-white">Subir Video</h2>
      <input
        type="file"
        accept="video/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        disabled={disabled}
        className="block w-full text-sm text-gray-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#00FFB0] file:text-black hover:file:bg-[#00e6a0] disabled:opacity-50"
      />
      <p className="text-sm text-gray-400 mt-2">
        Formatos soportados: MP4, WebM, OGV y otros formatos compatibles con el navegador
      </p>
    </div>
  );
};

export default VideoFileUpload; 