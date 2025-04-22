import React, { useEffect, useMemo, useState } from "react";
import Select from "react-select";
import Fuse from "fuse.js";
import { useQuery } from "@tanstack/react-query";
import {
  fetchDiseaseById,
  fetchDiseases,
  fetchPlantsByDisease,
} from "../../api/diseaseAPI";
import { useTranslation } from "react-i18next";
import { usePlantByDiseases } from "../../hooks/usePlants";

const DiseaseSearchDropdown = ({ onSelectDisease, onSelectPlant }) => {
  const { t, i18n } = useTranslation();
  const [inputValue, setInputValue] = useState("");
  const [selectedDisease, setSelectedDisease] = useState(null);

  const { data: response = {}, isLoading: isDiseasesLoading } = useQuery({
    queryKey: ["diseases"],
    queryFn: fetchDiseases,
    staleTime: 60 * 1000,
  });
  const diseases = response?.items || [];

  // Use the custom hook for fetching plants by disease
  const { data: plantsData, isFetching: isPlantsLoading } = usePlantByDiseases(
    selectedDisease?.value
  );

  // Handle plant selection when plants data is loaded
  useEffect(() => {
    let isActive = true;

    const fetchAndUpdate = async () => {
      if (selectedDisease?.value && plantsData) {
        try {
          const diseaseData = await fetchDiseaseById(selectedDisease.value);
          if (isActive) {
            onSelectDisease(diseaseData);
            onSelectPlant(plantsData?.items?.[0]?.id);
          }
        } catch (error) {
          console.error("Error fetching disease details:", error);
          if (isActive) {
            onSelectDisease(null);
            onSelectPlant(null);
          }
        }
      }
    };

    fetchAndUpdate();

    return () => {
      isActive = false;
    };
  }, [plantsData, selectedDisease, onSelectDisease, onSelectPlant]);
  const fuse = useMemo(() => {
    const isArabic = i18n.language === "ar";

    return new Fuse(diseases, {
      keys: [
        {
          name: isArabic ? "arabic_name" : "english_name",
          weight: 0.4,
        },
        { name: "scientific_name", weight: 0.3 },
        { name: isArabic ? "english_name" : "arabic_name", weight: 0.2 },
        { name: "description", weight: 0.1 },
        { name: "symptoms", weight: 0.1 },
      ],
      includeScore: true,
      threshold: 0.4,
      minMatchCharLength: 2,
      ignoreLocation: true,
      shouldSort: true,
    });
  }, [diseases, i18n.language]);

  const filteredOptions = useMemo(() => {
    if (!inputValue.trim()) return diseases;
    return fuse.search(inputValue).map((result) => result.item);
  }, [inputValue, diseases, fuse]);

  const selectOptions = filteredOptions.map((disease) => {
    const isArabic = i18n.language === "ar";
    return {
      value: disease.id,
      label: isArabic
        ? disease.arabic_name || disease.english_name
        : disease.english_name,
      scientificName: disease.scientific_name,
      arabicName: disease.arabic_name,
      englishName: disease.english_name,
      symptoms: disease.symptoms,
      description: disease.description,
    };
  });

  const formatOptionLabel = ({
    label,
    scientificName,
    arabicName,
    englishName,
  }) => {
    const isArabic = i18n.language === "ar";

    return (
      <div className="disease-option">
        <div className="font-medium">{label}</div>
        {scientificName && (
          <div className="text-sm ">
            {t("scientific_name_key")}: {scientificName}
          </div>
        )}
        {!isArabic && arabicName && (
          <div className="text-sm ">
            {t("arabic_name_key")}: {arabicName}
          </div>
        )}
        {isArabic && englishName && (
          <div className="text-sm ">
            {t("english_name_key")}: {englishName}
          </div>
        )}
      </div>
    );
  };

  const handleInputChange = (newValue) => setInputValue(newValue);

  const handleChange = (selectedOption) => {
    setSelectedDisease(selectedOption);
    if (!selectedOption) onPlantsFetched([]);
  };

  return (
    <Select
      options={selectOptions}
      isLoading={isDiseasesLoading || isPlantsLoading}
      onInputChange={handleInputChange}
      onChange={handleChange}
      value={selectedDisease}
      placeholder={t("search_diseases_placeholder_key")}
      noOptionsMessage={() =>
        inputValue ? t("no_matching_diseases_key") : t("type_to_search_key")
      }
      formatOptionLabel={formatOptionLabel}
      isClearable
      isSearchable
      styles={{
        control: (base, { isFocused }) => ({
          ...base,
          borderColor: isFocused ? "#416a00" : "#e5e7eb",
          boxShadow: isFocused ? "0 0 0 1px #416a00" : "none",
          "&:hover": { borderColor: "#416a00" },
          minHeight: "44px",
        }),
        option: (base, { isFocused, isSelected }) => ({
          ...base,
          backgroundColor: isSelected
            ? "#416a00"
            : isFocused
            ? "#416a0020"
            : "white",
          color: isSelected ? "white" : "black",
          padding: "8px 12px",
        }),
        menu: (base) => ({
          ...base,
          borderColor: "#416a00",
          zIndex: 9999,
        }),
        input: (base) => ({
          ...base,
          padding: "8px 0",
        }),
        singleValue: (base) => ({
          ...base,
          fontWeight: "500",
        }),
      }}
    />
  );
};

export default DiseaseSearchDropdown;
