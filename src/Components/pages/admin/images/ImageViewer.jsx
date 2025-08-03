import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const ImageViewer = ({ t, currentImage, isLoading, handleBack, handleNext }) => {
  return (
    <div className="relative w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
      {isLoading && <p>{t('loading_key')}</p>}
      {!isLoading && currentImage && (
        <>
          <img
            src={currentImage.url}
            alt={currentImage.name}
            className="max-h-full max-w-full object-contain"
          />
          <button
            onClick={handleBack}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-opacity"
          >
            <FiChevronLeft size={24} />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-opacity"
          >
            <FiChevronRight size={24} />
          </button>
        </>
      )}
      {!isLoading && !currentImage && <p>{t('no_images_found_key')}</p>}
    </div>
  );
};

export default ImageViewer;
