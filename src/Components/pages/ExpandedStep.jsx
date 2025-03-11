import React, { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai"; // Icons for expand/collapse
import { FaChevronCircleUp } from "react-icons/fa";

export default function ExpandedStep({ title, expandedContent, disabled }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = useCallback(() => {
    if (!disabled) {
      setIsExpanded((prev) => !prev);
    }
  }, [disabled]);

  return (
    <div className={``}>
      {/* Header */}
      <div
        onClick={toggleExpand}
        className={`p-4 flex justify-between items-center rounded-xl bg-[#758F4C]  transition-colors text-white ${
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        }`}
      >
        <h3 className="font-semibold text-lg">{title}</h3>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <FaChevronCircleUp size={22} />{" "}
        </motion.div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`px-4  rounded-xl shadow-xl border text-black border-slate-300 mt-1 ${
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
