import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch, FaLeaf } from "react-icons/fa";
import ImageGrid from "../Components/pages/ImageGrid";
import ExpandableArticle from "../Components/pages/ExpandableArticle";
import PlantDiseaseForm from "../Components/pages/PlantDiseaseForm";
import { useTranslation } from "react-i18next";
import DiseaseSearchDropdown from "../Components/pages/DiseaseSearchDropdown";
import { useLocation } from "react-router-dom";

export default function DataBase() {
  const { t, i18n } = useTranslation();
  const { state } = useLocation();
  const [searchMethod, setSearchMethod] = useState("plant");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDisease, setSelectedDisease] = useState(
    state?.selectedDisease || null
  );
  const [selectedPlant, setSelectedPlant] = useState(null);

  useEffect(() => {
    if (state?.selectedDisease) {
      setSelectedDisease(state.selectedDisease);
    }
  }, [state]);

  const containerVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
  };

  // Handle disease change with loading state
  const handleDiseaseChange = (disease) => {
    if (disease?.id !== selectedDisease?.id) {
      setIsLoading(true);
      setSelectedDisease(disease);
      // Simulate loading for 1-2 seconds
      const loadingTime = Math.random() * 1000 + 1000; // Between 1-2 seconds
      setTimeout(() => {
        setIsLoading(false);
      }, loadingTime);
    }
  };

  return (
    <div className="space-y-6" dir={i18n.language === "ar" ? "rtl" : "ltr"}>
      {/* Search Method Selection */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
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
              onSelectDisease={handleDiseaseChange}
              onSelectPlant={setSelectedPlant}
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
              onSelectDisease={handleDiseaseChange}
              onSelectPlant={setSelectedPlant}
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
            plant_id={selectedPlant}
            article={selectedDisease}
            loading={isLoading}
          />
          <ImageGrid
            plant_id={selectedPlant}
            diseaseId={selectedDisease?.id}
            loading={isLoading}
          />
        </motion.div>
      )}
    </div>
  );
}
