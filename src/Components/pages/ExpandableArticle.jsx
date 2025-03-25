import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { FaChevronDown, FaChevronUp } from "react-icons/fa"; // Import arrow icons
import Button from "../Button";

export default function ExpandableArticle({ article, loading }) {
  const [expanded, setExpanded] = useState(false);
  const { t } = useTranslation();

  if (loading) {
    return <div className="p-6 cardIt animate-pulse">Loading...</div>;
  }

  return (
    <motion.div className="w-full p-6 cardIt">
      <h2 className="text-2xl font-bold text-gray-900">
        {article.english_name || "No disease selected"}
      </h2>

      <h3 className="text-lg font-semibold text-gray-700 mt-2">
        {article.arabic_name || t("no_arabic_name_key")}
      </h3>

      <h4 className="text-lg font-semibold text-gray-700 mt-2">
        {article.scientific_name || ""}
      </h4>

      <motion.p className="text-gray-600 mt-3">
        {t(`${article.english_name.replace(/\s+/g, '_').toLowerCase()}_description`) || t("no_description_key")}
      </motion.p>

      {expanded && (
        <div className="mt-4">
          <h4 className="font-bold">{t("Symptoms")}:</h4>
          <p>{t(`${article.english_name.replace(/\s+/g, '_').toLowerCase()}_symptoms`) || "N/A"}</p>

          <h4 className="font-bold mt-2">{t("Control Methods:")}:</h4>
          <p>{t(`${article.english_name.replace(/\s+/g, '_').toLowerCase()}_treatments`) || "N/A"}</p>
        </div>
      )}

      <Button onClick={() => setExpanded(!expanded)}>
        {expanded ? t("close_key") : t("read_more_key")}
      </Button>
    </motion.div>
  );
}
