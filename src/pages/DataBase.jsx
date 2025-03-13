import React, { useState } from "react";
import ImageGrid from "../Components/pages/ImageGrid";
import ExpandableArticle from "../Components/pages/ExpandableArticle";
import PlantDiseaseForm from "../Components/pages/PlantDiseaseForm";
import Breadcrumbs from "../Components/layout/BreadCrumbs";
import { useTranslation } from "react-i18next";

export default function DataBase() {
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [selectedPlant, setSelectedPlant] = useState(null);

  return (
    <div>
      <div className="space-y-8">
        <PlantDiseaseForm
          onSelectDisease={setSelectedDisease}
          onSelectPlant={setSelectedPlant}
        />
        <ExpandableArticle
          article={selectedDisease || { english_name: "Select a disease to see details" }}
          loading={!selectedDisease}
        />
        <ImageGrid plantId={selectedPlant} diseaseId={selectedDisease?.id} />
      </div>
    </div>
  );
}
