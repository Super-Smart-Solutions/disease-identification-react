import React, { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch, FaLeaf } from "react-icons/fa";
import ImageGrid from "../Components/pages/data-base/ImageGrid";
import ExpandableArticle from "../Components/pages/data-base/ExpandableArticle";
import PlantDiseaseForm from "../Components/pages/data-base/PlantDiseaseForm";
import { useTranslation } from "react-i18next";
import DiseaseSearchDropdown from "../Components/pages/data-base/DiseaseSearchDropdown";
import { useSearchParams } from "react-router-dom";
import { useDiseaseById } from "../hooks/useDiseases";

const DataBase = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const diseaseId = searchParams.get("disease_id");
  const plantId = searchParams.get("plant_id");
  const [searchMethod, setSearchMethod] = useState("plant");

  const { data: selectedDisease, isLoading } = useDiseaseById(diseaseId);

  const containerVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: { duration: 0.3, ease: "easeInOut" },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: { duration: 0.2, ease: "easeInOut" },
    },
  };

  // Handle disease change and update URL params
  const handleDiseaseChange = useCallback(
    (diseaseId) => {
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev);
        if (diseaseId) {
          params.set("disease_id", diseaseId);
        } else {
          params.delete("disease_id");
        }
        if (params.get("plant_id") && diseaseId) {
          params.set("plant_id", params.get("plant_id"));
        }
        return params;
      });
    },
    [setSearchParams]
  );

  // Handle plant change and update URL params
  const handlePlantChange = useCallback(
    (plantId) => {
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev);
        if (plantId) {
          params.set("plant_id", plantId);
        } else {
          params.delete("plant_id");
        }
        if (params.get("disease_id") && plantId) {
          params.set("disease_id", params.get("disease_id"));
        }
        return params;
      });
    },
    [setSearchParams]
  );

  return (
    <div className="space-y-6">
      {/* Search Method Selection */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div
          className={`flex items-center justify-between px-6 py-4 rounded-lg w-full md:w-6/12 cursor-pointer ${
            searchMethod === "plant"
              ? "border-1 border-primary bg-primary-10"
              : "border-1 border-slate-300"
          }`}
          onClick={() => setSearchMethod("plant")}
        >
          <div className="flex items-center gap-3">
            <FaLeaf className="text-primary text-xl" />
            <span className="font-medium">{t("select_by_plant_key")}</span>
          </div>
        </div>
        <div
          className={`flex items-center justify-between px-6 py-4 rounded-lg w-full md:w-6/12 cursor-pointer ${
            searchMethod === "database"
              ? "border-1 border-primary bg-primary-10"
              : "border-1 border-slate-300"
          }`}
          onClick={() => setSearchMethod("database")}
        >
          <div className="flex items-center gap-3">
            <FaSearch className="text-primary text-xl" />
            <span className="font-medium">{t("search_in_database_key")}</span>
          </div>
        </div>
      </div>

      {/* Animated Sections */}
      <AnimatePresence>
        {searchMethod === "database" && (
          <motion.div
            key="database-search"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="mb-6"
          >
            <DiseaseSearchDropdown
              handleDiseaseChange={handleDiseaseChange}
              handlePlantChange={handlePlantChange}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {searchMethod === "plant" && (
          <motion.div
            key="plant-search"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="mb-6"
          >
            <PlantDiseaseForm
              selectedDisease={diseaseId}
              selectedPlant={plantId}
              handleDiseaseChange={handleDiseaseChange}
              handlePlantChange={handlePlantChange}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Section */}
      {selectedDisease && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-8 mt-10"
        >
          <ExpandableArticle
            plant_id={plantId}
            article={selectedDisease}
            loading={isLoading}
            diseaseId={diseaseId}
          />
          <ImageGrid plant_id={plantId} diseaseId={diseaseId} />
        </motion.div>
      )}
    </div>
  );
};

export default React.memo(DataBase);
