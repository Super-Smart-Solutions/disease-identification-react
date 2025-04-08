import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowLeft, FaArrowRight, FaTimes } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { getImages } from "../../api/imagesAPI";
import Pagination from "../Pagination";

const ImageGrid = ({ plantId, diseaseId }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [loadedImages, setLoadedImages] = useState({});

  // Memoize the query function to prevent unnecessary re-renders
  const fetchImages = useCallback(
    () => getImages({ plantId, diseaseId, size: pageSize, page }),
    [plantId, diseaseId, pageSize, page]
  );

  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ["images", plantId, diseaseId, page, pageSize],
    queryFn: fetchImages,
    enabled: !!plantId || !!diseaseId,
    staleTime: 1000 * 60 * 5,
    // 5 minutes stale time
  });

  const images = data?.items || [];
  const totalItems = data?.total || 0;
  const totalPages = data?.pages || 1;

  // Skeleton loading array
  const skeletonItems = Array(6).fill(null);

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

  // Track loaded images
  const handleImageLoad = (id) => {
    setLoadedImages((prev) => ({ ...prev, [id]: true }));
  };

  // Keyboard navigation handler
  const handleKeyDown = useCallback(
    (e) => {
      if (selectedImage !== null) {
        if (e.key === "ArrowLeft") prevImage();
        else if (e.key === "ArrowRight") nextImage();
        else if (e.key === "Escape") closeModal();
      }
    },
    [selectedImage]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Reset to page 1 when plantId or diseaseId changes
  useEffect(() => {
    setPage(1);
    setLoadedImages({});
    // Reset loaded images when filters change
  }, [plantId, diseaseId]);

  if (error) {
    return <p className="text-red-500">Error fetching images.</p>;
  }

  return (
    <div>
      <div className="flex justify-center flex-wrap gap-8 w-full">
        {/* Skeleton loading */}
        {(isLoading || isFetching) &&
          skeletonItems.map((_, index) => (
            <div
              key={`skeleton-${index}`}
              className="bg-gray-200 animate-pulse rounded-lg h-60 w-3/12"
            />
          ))}

        {/* Actual images with progressive loading */}
        {!isLoading && !isFetching && images.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 w-10/12">
            {images.map((img, index) => (
              <motion.div
                key={img.id}
                className="relative overflow-hidden rounded-lg"
                whileHover={{ scale: 1.02 }}
                onClick={() => openModal(index)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {/* Low quality placeholder */}
                {!loadedImages[img.id] && (
                  <img
                    src={img.url}
                    alt=""
                    className="h-60 w-full object-cover rounded-lg cursor-pointer transition-opacity duration-300"
                    loading="lazy"
                  />
                )}

                {/* Full quality image */}
                <img
                  src={img.url}
                  alt={img.name}
                  className={`h-60 w-full object-cover rounded-lg cursor-pointer transition-opacity duration-300 ${
                    loadedImages[img.id] ? "opacity-100" : "opacity-0"
                  }`}
                  loading="lazy"
                  onLoad={() => handleImageLoad(img.id)}
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !isFetching && images.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">No images available.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="w-10/12 mx-auto">
        {totalItems > 0 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={totalItems}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        )}
      </div>
      {/* Image modal with enhanced loading */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={closeModal}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-full max-w-4xl"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Blurred low-quality background */}
              {isImageLoading && (
                <div className="absolute inset-0 overflow-hidden">
                  <img
                    src={images[selectedImage]?.url}
                    alt=""
                    className="w-full h-full object-contain blur-xl opacity-50"
                  />
                </div>
              )}

              {/* Loading indicator */}
              {isImageLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                </div>
              )}

              {/* Main image */}
              <img
                src={images[selectedImage]?.url}
                alt={images[selectedImage]?.name}
                className={`w-full h-auto max-h-[80vh] object-contain transition-opacity duration-300 ${
                  isImageLoading ? "opacity-0" : "opacity-100"
                }`}
                onLoad={() => setIsImageLoading(false)}
              />

              {/* Navigation controls */}
              <button
                className="absolute top-4 right-4 text-white text-2xl bg-black/50 rounded-full p-2 hover:bg-black/75 transition-colors"
                onClick={closeModal}
              >
                <FaTimes />
              </button>
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-2xl bg-black/50 rounded-full p-2 hover:bg-black/75 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
              >
                <FaArrowLeft />
              </button>
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-2xl bg-black/50 rounded-full p-2 hover:bg-black/75 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
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
