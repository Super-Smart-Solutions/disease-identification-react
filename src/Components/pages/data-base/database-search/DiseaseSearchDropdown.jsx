import React, { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { CustomDropdown } from "./CustomDropdown";
import { DiseaseOptionLabel } from "./DiseaseOptionLabel";
import { useDiseases } from "../../../../hooks/useDiseases";
import { usePlantByDiseases } from "./../../../../hooks/usePlants";
import { useDiseaseOptions } from "../../../../hooks/useDiseaseOptions";
import { useDiseaseSearch } from "./../../../../hooks/useDiseaseSearch";

const DiseaseSearchDropdown = ({
  handleDiseaseChange,
  handlePlantChange,
  selectedDisease = null,
  selectedPlant = null,
}) => {
  const { t, i18n } = useTranslation();
  const [inputValue, setInputValue] = useState("");
  const [currentDiseaseId, setCurrentDiseaseId] = useState(selectedDisease);

  // Fetch diseases
  const { data: response = {}, isLoading: isDiseasesLoading } = useDiseases({
    pageSize: 50,
  });
  const diseases = response?.items || [];

  // Fetch plants for selected disease
  const { data: plantsData, isFetching: isPlantsLoading } =
    usePlantByDiseases(currentDiseaseId);

  // Get filtered options based on search
  const filteredOptions = useDiseaseSearch(diseases, inputValue);

  // Transform diseases to select options
  const selectOptions = useDiseaseOptions(filteredOptions, i18n.language);

  // Format option display
  const formatOptionLabel = useCallback(
    ({ label, scientificName, arabicName }) => (
      <DiseaseOptionLabel
        label={label}
        scientificName={scientificName}
        arabicName={arabicName}
        t={t}
        language={i18n.language}
      />
    ),
    [t, i18n.language]
  );

  // Initialize component with selected disease
  useEffect(() => {
    if (selectedDisease && diseases.length > 0) {
      const disease = diseases.find((d) => d.id === Number(selectedDisease));

      if (disease) {
        const label =
          i18n.language === "ar"
            ? disease.arabic_name
            : disease.english_name || "Unnamed Disease";
        setInputValue(label);
        setCurrentDiseaseId(selectedDisease);
      }
    }
  }, [selectedDisease, diseases, i18n.language]);

  // Handle plant selection when plants data changes
  useEffect(() => {
    if (currentDiseaseId && plantsData?.items?.length > 0) {
      const targetPlantId =
        selectedPlant &&
        plantsData.items.some((plant) => plant.id === selectedPlant)
          ? selectedPlant
          : plantsData.items[0].id;

      handlePlantChange(targetPlantId);
    } else if (currentDiseaseId && plantsData?.items?.length === 0) {
      handlePlantChange(null);
    }
  }, [plantsData, currentDiseaseId, selectedPlant, handlePlantChange]);

  // Handle disease selection
  const handleSelect = useCallback(
    (selectedOption) => {
      const label =
        i18n.language === "ar"
          ? selectedOption.arabicName
          : selectedOption.englishName || "Unnamed Disease";

      setInputValue(label);
      setCurrentDiseaseId(selectedOption.value);
      handleDiseaseChange(selectedOption.value);
    },
    [i18n.language, handleDiseaseChange]
  );

  // Handle reset - clear both disease and plant selections
  const handleReset = useCallback(() => {
    setInputValue("");
    setCurrentDiseaseId(null);
    handleDiseaseChange(null);
    handlePlantChange(null);
  }, [handleDiseaseChange, handlePlantChange]);

  // Handle input change for search
  const handleInputChange = useCallback(
    (newValue) => {
      setInputValue(newValue);

      // If input is cleared, clear selections
      if (!newValue) {
        setCurrentDiseaseId(null);
        handleDiseaseChange(null);
        handlePlantChange(null);
      }
    },
    [handleDiseaseChange, handlePlantChange]
  );

  return (
    <CustomDropdown
      t={t}
      inputValue={inputValue}
      selectedValue={currentDiseaseId}
      options={selectOptions}
      onInputChange={handleInputChange}
      onSelect={handleSelect}
      onReset={handleReset}
      isLoading={isDiseasesLoading || isPlantsLoading}
      formatOptionLabel={formatOptionLabel}
    />
  );
};

export default DiseaseSearchDropdown;
