import React, { useEffect, useMemo, useState, useRef } from "react";
import Fuse from "fuse.js";
import { useQuery } from "@tanstack/react-query";
import { fetchDiseaseById, fetchDiseases } from "../../../api/diseaseAPI";
import { useTranslation } from "react-i18next";
import { usePlantByDiseases } from "../../../hooks/usePlants";
import { FiChevronDown, FiX } from "react-icons/fi";

const CustomDropdown = ({
  options,
  value,
  onChange,
  onInputChange,
  isLoading,
  formatOptionLabel,
  inputValue,
  setInputValue,
  t,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const optionsRef = useRef([]);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onInputChange(newValue);
    setIsOpen(true);
    setFocusedIndex(-1);
    if (value && newValue !== value.label) {
      onChange(null);
    }
  };

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
    setInputValue(option.label);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    setFocusedIndex(-1);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
      setFocusedIndex(-1);
    }
  };

  const handleKeyDown = (e) => {
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setFocusedIndex((prev) =>
          prev < options.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocusedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case "Enter":
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < options.length) {
          handleSelect(options[focusedIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        setFocusedIndex(-1);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (focusedIndex >= 0 && optionsRef.current[focusedIndex]) {
      optionsRef.current[focusedIndex].scrollIntoView({
        block: "nearest",
      });
    }
  }, [focusedIndex]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full">
      <div className="w-full cardIt">
        <label
          htmlFor="search"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {t("type_to_search_key")}
        </label>
        <div className="relative" ref={dropdownRef}>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => {
              setIsOpen(true);
              setFocusedIndex(-1);
            }}
            onKeyDown={handleKeyDown}
            placeholder={t("search_diseases_placeholder_key")}
            className="custom-input"
          />
          <div className="absolute end-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
            <button
              type="button"
              onClick={toggleDropdown}
              className="text-gray-500 hover:text-gray-700"
            >
              <FiChevronDown
                className={`w-4 h-4 transition-transform cursor-pointer ${
                  isOpen ? "transform rotate-180" : ""
                }`}
              />
            </button>
          </div>
          {isOpen && (
            <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
              {isLoading ? (
                <li className="px-4 py-2 text-gray-500">Loading...</li>
              ) : options.length === 0 ? (
                <li className="px-4 py-2 text-gray-500">
                  {inputValue
                    ? t("no_matching_diseases_key")
                    : t("search_diseases_placeholder_key")}
                </li>
              ) : (
                options.map((option, index) => (
                  <li
                    key={option.value}
                    ref={(el) => (optionsRef.current[index] = el)}
                    onClick={() => handleSelect(option)}
                    className={`px-4 py-2 cursor-pointer hover:bg-primary-20 ${
                      value?.value === option.value ? "bg-primary-50" : ""
                    } ${
                      focusedIndex === index
                        ? "bg-primary-20 ring-2 ring-primary-100"
                        : ""
                    }`}
                  >
                    {formatOptionLabel(option)}
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

const DiseaseSearchDropdown = ({ handleDiseaseChange, handlePlantChange }) => {
  const { t, i18n } = useTranslation();
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [inputValue, setInputValue] = useState("");

  const { data: response = {}, isLoading: isDiseasesLoading } = useQuery({
    queryKey: ["diseases"],
    queryFn: fetchDiseases,
    staleTime: 60 * 1000,
  });
  const diseases = response?.items || [];

  const { data: plantsData, isFetching: isPlantsLoading } = usePlantByDiseases(
    selectedDisease?.value
  );

  useEffect(() => {
    let isActive = true;
    const fetchAndUpdate = async () => {
      if (selectedDisease?.value && plantsData) {
        try {
          const diseaseData = await fetchDiseaseById(selectedDisease.value);
          if (isActive) {
            handleDiseaseChange(diseaseData);
            handlePlantChange(plantsData?.items?.[0]?.id);
          }
        } catch (error) {
          console.error("Error fetching disease details:", error);
          if (isActive) {
            handleDiseaseChange(null);
            handlePlantChange(null);
          }
        }
      }
    };

    fetchAndUpdate();

    return () => {
      isActive = false;
    };
  }, [plantsData, selectedDisease, handleDiseaseChange, handlePlantChange]);

  const fuse = useMemo(() => {
    return new Fuse(diseases, {
      keys: [
        "arabic_name",
        "english_name",
        "scientific_name",
        "description",
        "symptoms",
      ],
      threshold: 0.4,
    });
  }, [diseases]);

  const filteredOptions = useMemo(() => {
    if (!inputValue) return diseases;
    return fuse.search(inputValue).map((result) => result.item);
  }, [inputValue, diseases, fuse]);

  const selectOptions = useMemo(() => {
    return filteredOptions.map((disease) => ({
      value: disease.id,
      label:
        i18n.language === "ar"
          ? disease.arabic_name
          : disease.english_name || "Unnamed Disease",
      scientificName: disease.scientific_name,
      arabicName: disease.arabic_name,
      englishName: disease.english_name,
      symptoms: disease.symptoms,
      description: disease.description,
    }));
  }, [filteredOptions, i18n.language]);

  const formatOptionLabel = ({ label, scientificName, arabicName }) => {
    return (
      <div className="disease-option">
        <div className="font-medium">{label}</div>
        {scientificName && (
          <div className="text-sm">
            {t("scientific_name_key")}: {scientificName}
          </div>
        )}
        {arabicName && (
          <div className="text-sm">
            {t("arabic_name_key")}: {arabicName}
          </div>
        )}
      </div>
    );
  };

  const handleInputChange = (newValue) => {
    setInputValue(newValue);
  };

  const handleChange = (selectedOption) => {
    const selectedLang = i18n.language;
    const label =
      selectedLang === "ar"
        ? selectedOption.arabicName
        : selectedOption.englishName;

    setSelectedDisease({ ...selectedOption, label });
    if (!selectedOption) {
      handleDiseaseChange(null);
      handlePlantChange(null);
    }
  };

  return (
    <CustomDropdown
      t={t}
      inputValue={inputValue}
      setInputValue={setInputValue}
      options={selectOptions}
      value={selectedDisease}
      onChange={handleChange}
      onInputChange={handleInputChange}
      isLoading={isDiseasesLoading || isPlantsLoading}
      formatOptionLabel={formatOptionLabel}
    />
  );
};

export default DiseaseSearchDropdown;
