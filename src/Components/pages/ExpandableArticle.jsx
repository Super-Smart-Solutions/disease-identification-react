import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { FaChevronDown, FaChevronUp } from "react-icons/fa"; // Import arrow icons
import Button from "../Button";

export default function ExpandableArticle({
  article = {
    english_name: "Pomegranate",
    arabic_name: "الرمان",
    scientific_name: "Punica granatum",
    symptoms: "Leaf discoloration, fruit rot",
    description:
      "Lorem ipsum dolor sit amet consectetur. Tincidunt sit arcu sit in at mauris lectus ac. Enim pellentesque orci sed elementum amet nec sem placerat. In amet tellus cursus ac aenean magna. em placerat. In amet tellus cursus ac aenean magna.",
    treatments: "Prune damaged branches, use organic pesticides.",
    id: 52,
    created_at: "2025-01-20T20:06:25.928617",
    updated_at: "2025-01-20T20:06:25.928621",
  },
  loading,
}) {
  const [expanded, setExpanded] = useState(false);
  const { t } = useTranslation(); // Translation hook

  if (loading) {
    return (
      <div className="w-full p-6 cardIt animate-pulse">
        <div className="h-6 bg-gray-300 rounded w-60  mb-4"></div>
        <div className="h-4 bg-gray-300 rounded w-60  mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-60  mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-60  mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-60 "></div>
      </div>
    );
  }

  return (
    <motion.div
      className="w-full p-6 cardIt"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Title */}
      <h2 className="text-2xl font-bold text-gray-900">
        {article.english_name}
      </h2>

      {/* Subtitle */}
      <h3 className="text-lg font-semibold text-gray-700 mt-2">
        {article.arabic_name || t("no_arabic_name_key")}
      </h3>

      <div className=" flex justify-between items-end">
        {/* Description */}
        <motion.p
          className="text-gray-600 mt-3 max-w-60"
          animate={{ height: expanded ? "auto" : "3rem", overflow: "hidden" }}
        >
          {article.description || t("no_description_key")}
        </motion.p>
        {/* Expand Button */}
        <div className="mt-4">
          <Button onClick={() => setExpanded(!expanded)}>
            {expanded ? (
              <>
                {t("close_key")} <FaChevronUp className="inline ms-2 " />{" "}
                {/* Flip for RTL */}
              </>
            ) : (
              <>
                {t("read_more_key")} <FaChevronDown className="inline ms-2 " />{" "}
                {/* Flip for RTL */}
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
