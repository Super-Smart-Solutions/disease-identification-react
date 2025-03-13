import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowLeft, FaArrowRight, FaTimes } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { getImages } from "../../api/imagesAPI";

const ImageGrid = ({ plantId, diseaseId }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isImageLoading, setIsImageLoading] = useState(true);

  // Fetch images using React Query
  const { data, isLoading, error } = useQuery({
    queryKey: ["images", plantId, diseaseId],
    queryFn: () => getImages({ plantId, diseaseId, limit: 50, offset: 0 }),
    enabled: !!plantId || !!diseaseId, // Fetch only if plantId or diseaseId is selected
  });

  // Extract images if available
  const images = data?.data || [];

  const openModal = (index) => {
    setSelectedImage(index);
    setIsImageLoading(true);
  };

  const closeModal = () => setSelectedImage(null);

  const prevImage = () => {
    setSelectedImage((prev) => (prev > 0 ? prev - 1 : images.length - 1));
    setIsImageLoading(true);
  };

  const nextImage = () => {
    setSelectedImage((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    setIsImageLoading(true);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedImage !== null) {
        if (e.key === "ArrowLeft") prevImage();
        else if (e.key === "ArrowRight") nextImage();
        else if (e.key === "Escape") closeModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage]);

  if (isLoading) {
    return <p className="text-gray-500">Loading images...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error fetching images.</p>;
  }

  return (
    <div className="flex flex-wrap justify-between gap-y-8">
      {images.length > 0 ? (
        images.map((img, index) => (
          <motion.div
            key={img.id}
            className="cursor-pointer overflow-hidden rounded-lg"
            whileHover={{ scale: 1.02 }}
            onClick={() => openModal(index)}
          >
            <img
              src={img.url}
              alt={img.name}
              className="h-60 object-cover rounded-lg"
              loading="lazy"
            />
          </motion.div>
        ))
      ) : (
        <p className="text-gray-500">No images available.</p>
      )}

      {/* Modal */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            className="overlay flex items-center justify-center p-4"
            onClick={closeModal}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-full max-w-3xl"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              {isImageLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse rounded-lg">
                  <p className="text-gray-500">Loading...</p>
                </div>
              )}
              <img
                src={images[selectedImage]?.url}
                alt={images[selectedImage]?.name}
                className="w-full h-auto max-h-[80vh] object-contain"
                onLoad={() => setIsImageLoading(false)}
              />
              <button
                className="absolute top-4 right-4 text-white text-2xl"
                onClick={closeModal}
              >
                <FaTimes />
              </button>
              <button
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-2xl"
                onClick={prevImage}
              >
                <FaArrowLeft />
              </button>
              <button
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-2xl"
                onClick={nextImage}
              >
                <FaArrowRight />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImageGrid;
