import React from 'react';
import { CapturedImage } from '../../types/video';

interface CapturedImagesGalleryProps {
  images: CapturedImage[];
  onDownload: (image: CapturedImage) => void;
  onDownloadAll: () => void;
}

const CapturedImagesGallery: React.FC<CapturedImagesGalleryProps> = ({ images, onDownload, onDownloadAll }) => (
  <div className="bg-[#23262F] p-6 rounded-lg shadow-md mt-4">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold text-white">
        Imágenes Capturadas ({images.length})
      </h2>
      <button
        onClick={onDownloadAll}
        className="bg-[#00FFB0] text-black px-4 py-2 rounded font-semibold hover:bg-[#00e6a0]"
      >
        Descargar Todas
      </button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {images.map((image) => (
        <div key={image.id} className="border border-[#353945] rounded-lg overflow-hidden bg-[#181A20]">
          <img
            src={image.url}
            alt={`Captura en ${image.timeString}`}
            className="w-full h-32 object-cover bg-black"
          />
          <div className="p-3">
            <p className="text-sm font-medium text-gray-200 mb-2">
              {image.timeString}
            </p>
            <button
              onClick={() => onDownload(image)}
              className="w-full bg-[#00FFB0] text-black px-3 py-1 rounded text-sm font-semibold hover:bg-[#00e6a0]"
            >
              Descargar
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default CapturedImagesGallery; 