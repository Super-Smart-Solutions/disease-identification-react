import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import Button from "../../Button";
import { FaChevronUp } from "react-icons/fa"; // Arrow icons
import farm from "../../../assets/farm.jpg";
import { ArticleSkeleton } from "../../skeltons/ArticleSkeleton";
import ExportPdf from "./ExportPdf";

export default function ExpandableArticle({
  plant_id,
  article,
  loading,
  diseaseId,
}) {
  const [expanded, setExpanded] = useState(false);
  const { t } = useTranslation();

  const formatKey = (str) => str?.replace(/\s+/g, "_").toLowerCase();

  if (loading) {
    return <ArticleSkeleton />;
  }

  return (
    <motion.div className="w-full p-6 cardIt space-y-4">
      <div className="flex items-start justify-between space-x-4">
        {/* Static image beside the English name */}

        <div className=" space-y-6">
          <div className="flex justify-between">
            <h2 className="text-3xl font-bold me-2 text-gray-900">
              {article?.arabic_name || t("no_disease_selected_key")}
            </h2>
            <ExportPdf
              plant_id={plant_id}
              diseaseId={diseaseId}
              article={article}
              t={t}
            />
          </div>
          {article?.english_name && (
            <h3 className="text-xl font-bold me-2 text-gray-900">
              {t("english_name_key")}: {article?.english_name}
            </h3>
          )}

          {article?.scientific_name && (
            <h4 className="text-lg font-bold me-2 text-gray-900">
              {t("scientific_name_key")}: {article?.scientific_name}
            </h4>
          )}
          <motion.p className="text-base text-gray-700 leading-relaxed">
            <span className="font-bold me-2">{t("description_key")}:</span>
            {t(`${formatKey(article?.english_name)}_description`) ||
              t("no_description_key")}
          </motion.p>
        </div>

        <img
          src={plant_id ? `${plant_id}.jpg` : farm}
          alt="Disease"
          className="w-64 h-64 object-cover relative bottom-10 rounded-2xl  shadow-2xl hidden md:block "
        />
      </div>

      <motion.div
        initial={{ height: 0 }}
        animate={{ height: expanded ? "auto" : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        {expanded && (
          <div className="space-y-3 mt-4">
            <div>
              <h4 className="text-lg font-bold me-2 text-gray-800">
                {t("Symptoms")}
              </h4>
              <p className="text-gray-700 text-base leading-relaxed whitespace-pre-wrap">
                {t(`${formatKey(article?.english_name)}_symptoms`) ||
                  t("no_symptoms_key")}
              </p>
            </div>

            <div>
              <h4 className="text-lg font-bold me-2 text-gray-800">
                {t("Control Methods:")}
              </h4>
              <p className="text-gray-700 text-base leading-relaxed whitespace-pre-wrap">
                {t(`${formatKey(article?.english_name)}_treatments`) ||
                  t("no_treatment_key")}
              </p>
            </div>
          </div>
        )}
      </motion.div>

      <div className="pt-2 flex items-center space-x-2">
        <Button
          className="flex gap-2 items-center"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? t("close_key") : t("read_more_key")}
          <FaChevronUp
            className={`${expanded ? "" : "rotate-180 duration-300 transform"}`}
          />
        </Button>
      </div>
    </motion.div>
  );
}
