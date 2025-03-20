import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; // Import for retrieving state
import ImageGrid from "../Components/pages/ImageGrid";
import ExpandableArticle from "../Components/pages/ExpandableArticle";
import PlantDiseaseForm from "../Components/pages/PlantDiseaseForm";
import Breadcrumbs from "../Components/layout/BreadCrumbs";
import { useTranslation } from "react-i18next";

export default function DataBase() {
  const { state } = useLocation(); // Get the state from navigation
  const { t } = useTranslation();

  const [selectedDisease, setSelectedDisease] = useState(state?.selectedDisease || null);
  const [selectedPlant, setSelectedPlant] = useState(state?.selectedPlant || null);

  useEffect(() => {
    if (state?.selectedDisease) {
      setSelectedDisease(state.selectedDisease);
    }
    if (state?.selectedPlant) {
      setSelectedPlant(state.selectedPlant);
    }
  }, [state]);

  return (
    <div>
      <div className="space-y-8">
        <PlantDiseaseForm
          onSelectDisease={setSelectedDisease}
          onSelectPlant={setSelectedPlant}
          initialPlant={selectedPlant}
          initialDisease={selectedDisease}
        />
        <ExpandableArticle
          article={selectedDisease || { english_name: t("select_disease_message") }}
          loading={!selectedDisease}
        />
        <ImageGrid plantId={selectedPlant?.id} diseaseId={selectedDisease?.id} />
      </div>
    </div>
  );
}
