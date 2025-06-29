import { motion } from "framer-motion";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ExpandableArticle from "../Components/pages/data-base/ExpandableArticle";
import ImageGrid from "../Components/pages/data-base/ImageGrid";
import { useDiseaseById } from "../hooks/useDiseases";

export default function Disease() {
  const { search } = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(search);

  const plantId = params.get("plant_id");
  const diseaseId = params.get("disease_id");

  const { data: article, isLoading, error } = useDiseaseById(diseaseId);

  if (!diseaseId) {
    return null;
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-8 mt-10"
      >
        <ExpandableArticle
          plant_id={plantId}
          article={article}
          loading={isLoading}
          diseaseId={diseaseId}
        />

        <ImageGrid
          plant_id={plantId}
          diseaseId={diseaseId}
          loading={isLoading}
        />
      </motion.div>
    </div>
  );
}
