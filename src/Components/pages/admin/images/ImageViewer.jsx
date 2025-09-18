import React, { useState, useEffect, useCallback } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
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

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? -300 : 300,
      opacity: 0,
      scale: 0.9,
    }),
  };

  const transition = {
    x: { type: "spring", stiffness: 300, damping: 30 },
    opacity: { duration: 0.2 },
    scale: { duration: 0.2 },
  };

  return (
    <div className="relative w-full h-[50vh] rounded-lg ">
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
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="flex items-center h-full justify-center mx-auto"
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
            className="absolute start-4 top-1/2 -translate-y-1/2 bg-black/60 text-white p-3 rounded-full hover:bg-black/80 transition-colors disabled:opacity-50 z-10"
            disabled={currentIndex === 0}
          >
            <FiChevronLeft size={20} className="rtl:rotate-180" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleNext}
            className="absolute end-4 top-1/2 -translate-y-1/2 bg-black/60 text-white p-3 rounded-full hover:bg-black/80 transition-colors disabled:opacity-50 z-10"
            disabled={images && currentIndex === images.length - 1}
          >
            <FiChevronRight size={20} className="rtl:rotate-180" />
          </motion.button>

          {/* Image Counter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative bottom-4 text-white text-sm bg-black px-2 rounded-full  w-fit mx-auto"
          >
            {currentIndex + 1} / {images?.length || 0}
          </motion.div>
        </>
      )}
    </div>
  );
};

export default ImageViewer;
