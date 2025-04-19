import React, { useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronCircleUp } from "react-icons/fa";

export default function ExpandedStep({
  title,
  expandedContent,
  disabled,
  isExpanded,
  onToggleExpand,
  stepId,
}) {
  const contentRef = useRef(null);

  const toggleExpand = useCallback(() => {
    if (!disabled) {
      onToggleExpand(stepId);
    }
  }, [disabled, onToggleExpand, stepId]);

  useEffect(() => {
    if (isExpanded && contentRef.current) {
      // Check if the element is not in the viewport
      const rect = contentRef.current.getBoundingClientRect();
      const isInViewport =
        rect.top >= 0 &&
        rect.bottom <=
          (window.innerHeight || document.documentElement.clientHeight);

      if (!isInViewport) {
        contentRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  }, [isExpanded]);

  return (
    <div ref={contentRef}>
      {/* Header */}
      <motion.div
        onClick={toggleExpand}
        className={`p-4 flex justify-between items-center rounded-xl bg-[#758F4C] transition-colors text-white ${
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        }`}
        whileHover={!disabled ? { scale: 1.02 } : {}}
        whileTap={!disabled ? { scale: 0.98 } : {}}
      >
        <h3 className="font-semibold text-lg">{title}</h3>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <FaChevronCircleUp size={22} />
        </motion.div>
      </motion.div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={`px-4 rounded-xl shadow-xl border text-black border-slate-300 mt-1 ${
              disabled ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            <div className="py-4">{expandedContent}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
