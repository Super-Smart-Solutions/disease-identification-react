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
  selectedDisease,
  selectedPlant,
  handleReset,
}) => {
  const { t, i18n } = useTranslation();
  const [inputValue, setInputValue] = useState("");

  const { data: response = {}, isLoading: isDiseasesLoading } = useDiseases({
    pageSize: 50,
  });
  const diseases = response?.items || [];

  const { data: plantsData, isFetching: isPlantsLoading } =
    usePlantByDiseases(selectedDisease);
  const filteredOptions = useDiseaseSearch(diseases, inputValue);
  const selectOptions = useDiseaseOptions(filteredOptions, i18n.language);

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

  useEffect(() => {
    if (selectedDisease && diseases.length > 0) {
      const disease = diseases.find((d) => d.id === Number(selectedDisease));
      const label =
        i18n.language === "ar"
          ? disease?.arabic_name
          : disease?.english_name || "Unnamed Disease";
      setInputValue(label);
    } else {
      setInputValue("");
    }
  }, [selectedDisease, diseases, i18n.language]);

  useEffect(() => {
    if (selectedDisease && plantsData?.items?.length > 0) {
      const isValid = plantsData.items.some(
        (plant) => plant.id === selectedPlant
      );
      if (!isValid) {
        handlePlantChange(plantsData.items[0].id);
      }
    } else if (selectedDisease && plantsData?.items?.length === 0) {
      handlePlantChange(null);
    }
  }, [plantsData, selectedDisease]);

  const handleSelect = useCallback(
    (selectedOption) => {
      const label =
        i18n.language === "ar"
          ? selectedOption.arabicName
          : selectedOption.englishName || "Unnamed Disease";

      setInputValue(label);
      handleDiseaseChange(selectedOption.value);
    },
    [i18n.language, handleDiseaseChange]
  );

  const onReset = useCallback(() => {
    setInputValue("");
    handleReset();
  }, [handleDiseaseChange, handlePlantChange]);

  const handleInputChange = useCallback(
    (newValue) => {
      setInputValue(newValue);

      if (!newValue) {
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
      selectedValue={selectedDisease}
      options={selectOptions}
      onInputChange={handleInputChange}
      onSelect={handleSelect}
      onReset={onReset}
      isLoading={isDiseasesLoading || isPlantsLoading}
      formatOptionLabel={formatOptionLabel}
    />
  );
};

export default DiseaseSearchDropdown;
