import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowLeft, FaArrowRight, FaTimes } from "react-icons/fa";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import Pagination from "../../Pagination";
import { useImages } from "../../../hooks/useImages";

const ImageGrid = React.memo(({ plant_id, diseaseId }) => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const { data, isLoading, error, isFetching } = useImages({
    plant_id,
    diseaseId,
    page,
    pageSize,
  });

  const images = data?.items || [];
  const totalPages = data?.pages || 1;
  const totalItems = data?.total || 0;

  // Reset state when filters change
  useEffect(() => {
    setPage(1);
    setSelectedIndex(null);
  }, [plant_id, diseaseId]);

  const openModal = useCallback((i) => {
    setSelectedIndex(i);
    setIsImageLoading(true);
  }, []);

  const closeModal = useCallback(() => setSelectedIndex(null), []);

  const prevImage = useCallback(() => {
    setSelectedIndex((i) => (i > 0 ? i - 1 : images.length - 1));
    setIsImageLoading(true);
  }, [images.length]);

  const nextImage = useCallback(() => {
    setSelectedIndex((i) => (i < images.length - 1 ? i + 1 : 0));
    setIsImageLoading(true);
  }, [images.length]);

  // ✅ Keyboard navigation
  const handleKeyDown = useCallback(
    (e) => {
      if (selectedIndex !== null) {
        if (e.key === "ArrowLeft") prevImage();
        else if (e.key === "ArrowRight") nextImage();
        else if (e.key === "Escape") closeModal();
      }
    },
    [selectedIndex, prevImage, nextImage, closeModal]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  if (error) return <p className="text-red-500">Error loading images.</p>;

  return (
    <div className="space-y-6 relative">
      {/* Pagination */}
      {totalItems > 0 && (
        <div className="sticky top-20 bg-slate-50 py-2 z-10">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={totalItems}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        </div>
      )}

      {/* Image Grid */}
      {isLoading || isFetching ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array(8)
            .fill(null)
            .map((_, i) => (
              <div
                key={i}
                className="h-60 bg-gray-200 animate-pulse rounded-lg"
              />
            ))}
        </div>
      ) : images.length > 0 ? (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img, i) => (
            <LazyLoadImage
              key={img.id}
              onClick={() => openModal(i)}
              src={img.url}
              alt={img.name}
              effect="blur"
              className="h-60 w-full object-cover block rounded-lg cursor-pointer"
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 py-12">No images available.</p>
      )}

      {/* Modal Viewer */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="relative w-full max-w-4xl flex justify-center"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <LazyLoadImage
                src={images[selectedIndex]?.url}
                alt={images[selectedIndex]?.name}
                effect="blur"
                className={`w-full max-h-[80vh] object-contain transition-opacity duration-300 ${
                  isImageLoading ? "opacity-0" : "opacity-100"
                }`}
              />

              {/* Controls */}
              <button
                className="absolute top-4 right-4 text-white p-2"
                onClick={closeModal}
              >
                <FaTimes />
              </button>
              <button
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white p-2"
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
              >
                <FaArrowLeft />
              </button>
              <button
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white p-2"
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
});

export default ImageGrid;
