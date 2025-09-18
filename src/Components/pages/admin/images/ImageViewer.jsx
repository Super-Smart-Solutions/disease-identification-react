import React, { useState, useEffect, useCallback } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const ImageViewer = ({
  t,
  currentImage,
  isLoading,
  handleBack,
  handleNext,
  images,
  currentIndex,
  globalIndex,
  page,
  totalPages,
  totalItems,
  hasNextPage,
}) => {
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [preloadedImages, setPreloadedImages] = useState(new Set());
  const minSwipeDistance = 50;

  useEffect(() => {
    if (images && images.length > 0) {
      const preloadImage = (url) => {
        if (!preloadedImages.has(url)) {
          const img = new Image();
          img.src = url;
          img.onload = () => {
            setPreloadedImages((prev) => new Set([...prev, url]));
          };
        }
      };

      const currentImg = images[currentIndex];
      const nextImg = images[currentIndex + 1];
      const prevImg = images[currentIndex - 1];

      if (currentImg) preloadImage(currentImg.url);
      if (nextImg) preloadImage(nextImg.url);
      if (prevImg) preloadImage(prevImg.url);
    }
  }, [images, currentIndex, preloadedImages]);

  const onTouchStart = useCallback((e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  }, []);

  const onTouchMove = useCallback((e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  }, []);

  const onTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handleBack();
    }
  }, [touchStart, touchEnd, handleNext, handleBack]);

  const transition = {
    x: { type: "spring", stiffness: 300, damping: 30 },
    opacity: { duration: 0.2 },
    scale: { duration: 0.2 },
  };

  return (
    <div className="relative w-full h-[40vh] rounded-lg overflow-hidden space-y-4 ">
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center h-full"
        >
          <div className="flex flex-col items-center space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-gray-600">{t("loading_key")}</p>
          </div>
        </motion.div>
      )}

      <AnimatePresence mode="wait" custom={0}>
        {!isLoading && currentImage && (
          <motion.div
            key={currentImage.id}
            custom={0}
            initial="enter"
            animate="center"
            exit="exit"
            className="flex items-center justify-center mx-auto h-full"
            transition={transition}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <LazyLoadImage
              src={currentImage.url}
              alt={currentImage.name}
              effect="blur"
              className="h-72 rounded-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {!isLoading && !currentImage && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center justify-center h-full"
        >
          <div className="text-center">
            <p className="text-gray-500">{t("no_images_found_key")}</p>
          </div>
        </motion.div>
      )}

      {/* Navigation Controls */}
      {!isLoading && currentImage && (
        <>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleBack}
            className="absolute start-4 top-1/3 -translate-y-1/2 bg-black/60 text-white p-3 rounded-full hover:bg-black/80 transition-colors disabled:opacity-50 z-10"
            disabled={globalIndex === 0}
          >
            <FiChevronLeft size={20} className="rtl:rotate-180" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleNext}
            className="absolute end-4 top-1/3 -translate-y-1/2 bg-black/60 text-white p-3 rounded-full hover:bg-black/80 transition-colors disabled:opacity-50 z-10"
            disabled={!hasNextPage && currentIndex === images.length - 1}
          >
            <FiChevronRight size={20} className="rtl:rotate-180" />
          </motion.button>

          {/* Image Counter */}
          <div className="flex flex-col items-center space-y-1 absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="text-white text-sm bg-black/80 px-3 py-1 rounded-full">
              {globalIndex + 1} / {totalItems || 0}
            </div>
            {totalPages > 1 && (
              <div className="text-white text-xs bg-black/60 px-2 py-1 rounded-full">
                {t("page_key") || "Page"} {page} / {totalPages}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ImageViewer;
