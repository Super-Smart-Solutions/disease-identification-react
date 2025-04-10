import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

const Carousel = ({
  cards,
  cardsPerRow = 3, // Default for large screens
  className = "",
  cardMinHeight = "300px",
  autoSlide = false,
  autoSlideInterval = 3000,
}) => {
  const { i18n } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [containerHeight, setContainerHeight] = useState("auto");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const containerRef = useRef(null);
  const intervalRef = useRef(null);

  const isRTL = i18n.dir() === "rtl";
  const totalItems = cards.length;
  const isMobile = windowWidth < 1024; // lg breakpoint
  const effectiveCardsPerRow = isMobile ? 1 : cardsPerRow;
  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex + effectiveCardsPerRow < totalItems;

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      // Reset index when switching between mobile/desktop to avoid empty space
      setCurrentIndex(0);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Calculate and set container height
  useEffect(() => {
    if (containerRef.current) {
      const height = containerRef.current.offsetHeight;
      setContainerHeight(`${height}px`);
    }
  }, [currentIndex, effectiveCardsPerRow]);

  // Auto-slide functionality
  useEffect(() => {
    if (autoSlide) {
      intervalRef.current = setInterval(() => {
        if (canGoNext) {
          handleNext();
        } else {
          // If at the end, loop back to start
          setDirection(1);
          setCurrentIndex(0);
        }
      }, autoSlideInterval);

      return () => clearInterval(intervalRef.current);
    }
  }, [
    autoSlide,
    autoSlideInterval,
    currentIndex,
    canGoNext,
    effectiveCardsPerRow,
  ]);

  const handleNext = () => {
    if (canGoNext) {
      setDirection(isRTL ? -1 : 1);
      setCurrentIndex((prev) =>
        Math.min(prev + 1, totalItems - effectiveCardsPerRow)
      );
    } else if (autoSlide) {
      // Loop back to start if autoSlide is enabled
      setDirection(isRTL ? -1 : 1);
      setCurrentIndex(0);
    }
  };

  const handlePrev = () => {
    if (canGoPrev) {
      setDirection(isRTL ? 1 : -1);
      setCurrentIndex((prev) => Math.max(prev - 1, 0));
    } else if (autoSlide) {
      // Loop to end if autoSlide is enabled
      setDirection(isRTL ? 1 : -1);
      setCurrentIndex(totalItems - effectiveCardsPerRow);
    }
  };

  const goToPage = (pageIndex) => {
    const newIndex = Math.min(
      pageIndex * effectiveCardsPerRow,
      totalItems - effectiveCardsPerRow
    );
    setDirection(newIndex > currentIndex ? (isRTL ? -1 : 1) : isRTL ? 1 : -1);
    setCurrentIndex(newIndex);

    if (autoSlide) {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        if (canGoNext) {
          handleNext();
        } else {
          setDirection(isRTL ? -1 : 1);
          setCurrentIndex(0);
        }
      }, autoSlideInterval);
    }
  };

  const visibleCards = cards.slice(
    currentIndex,
    currentIndex + effectiveCardsPerRow
  );

  const containerVariants = {
    hidden: (direction) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0.5,
    }),
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.3 },
    },
    exit: (direction) => ({
      x: direction > 0 ? "-100%" : "100%",
      opacity: 0.5,
      transition: { duration: 0.3 },
    }),
  };

  // Arrow icons based on direction
  const ArrowIcon = ({ isPrev }) => {
    const path = isPrev
      ? isRTL
        ? "M9 5l7 7-7 7"
        : "M15 19l-7-7 7-7"
      : isRTL
      ? "M15 19l-7-7 7-7"
      : "M9 5l7 7-7 7";

    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d={path}
        />
      </svg>
    );
  };

  return (
    <div
      className={`relative w-full overflow-hidden ${className} p-6`}
      onMouseEnter={() => autoSlide && clearInterval(intervalRef.current)}
      onMouseLeave={() => {
        if (autoSlide) {
          intervalRef.current = setInterval(() => {
            if (canGoNext) {
              handleNext();
            } else {
              setDirection(isRTL ? -1 : 1);
              setCurrentIndex(0);
            }
          }, autoSlideInterval);
        }
      }}
      dir={i18n.dir()}
    >
      <div className="flex items-center justify-between w-full gap-4">
        {/* Previous button */}
        <button
          onClick={handlePrev}
          disabled={!autoSlide && !canGoPrev}
          className={`p-2 rounded-full ${
            autoSlide || canGoPrev
              ? "bg-gray-200 hover:bg-gray-300"
              : "bg-gray-100 cursor-not-allowed"
          }`}
          aria-label="Previous"
        >
          <ArrowIcon isPrev={true} />
        </button>

        {/* Carousel content - fixed height container */}
        <div
          className="flex-1 mx-4 relative"
          style={{ height: containerHeight, minHeight: cardMinHeight }}
        >
          <AnimatePresence custom={direction} initial={false}>
            <motion.div
              key={currentIndex}
              custom={direction}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={containerVariants}
              className="absolute top-0 left-0 right-0 flex justify-center items-center gap-4 flex-nowrap"
              ref={containerRef}
            >
              {visibleCards.map((card, index) => (
                <div
                  key={`${card.title}-${currentIndex + index}`}
                  className="flex-shrink-0"
                  style={{
                    width: `${100 / effectiveCardsPerRow}%`,
                    minWidth: `${100 / effectiveCardsPerRow}%`,
                    minHeight: cardMinHeight,
                  }}
                >
                  <div
                    onClick={card.onClick}
                    className={`cardIt h-full ${
                      card.onClick
                        ? "cursor-pointer hover:shadow-lg transition-shadow duration-200"
                        : ""
                    }`}
                    style={{ minHeight: cardMinHeight }}
                  >
                    <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
                    <div>{card.component}</div>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Next button */}
        <button
          onClick={handleNext}
          disabled={!autoSlide && !canGoNext}
          className={`p-2 rounded-full ${
            autoSlide || canGoNext
              ? "bg-gray-200 hover:bg-gray-300"
              : "bg-gray-100 cursor-not-allowed"
          }`}
          aria-label="Next"
        >
          <ArrowIcon isPrev={false} />
        </button>
      </div>

      {/* Indicators */}
      {totalItems > effectiveCardsPerRow && (
        <div className="flex justify-center mt-4 gap-2">
          {Array.from({
            length: Math.ceil(totalItems / effectiveCardsPerRow),
          }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToPage(index)}
              className={`w-3 h-3 rounded-full transition-colors cursor-pointer ${
                currentIndex >= index * effectiveCardsPerRow &&
                currentIndex < (index + 1) * effectiveCardsPerRow
                  ? "bg-gray-700"
                  : "bg-gray-300 hover:bg-gray-500"
              }`}
              aria-label={`Go to page ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Carousel;
