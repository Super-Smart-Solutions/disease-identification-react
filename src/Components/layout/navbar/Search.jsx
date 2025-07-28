import React from "react";
import { useSearchParams } from "react-router-dom";
import DiseaseSearchDropdown from "../../pages/data-base/database-search/DiseaseSearchDropdown";
import { useSearchHandlers } from "../../../hooks/useSearchHandlers";

const Search = () => {
  const [searchParams] = useSearchParams();
  const diseaseId = searchParams.get("disease_id");
  const plantId = searchParams.get("plant_id");
  const { handleDiseaseChange, handlePlantChange, handleReset } =
    useSearchHandlers();

  return (
    <DiseaseSearchDropdown
      handleReset={handleReset}
      selectedDisease={diseaseId}
      selectedPlant={plantId}
      handleDiseaseChange={handleDiseaseChange}
      handlePlantChange={handlePlantChange}
    />
  );
};

export default Search;
