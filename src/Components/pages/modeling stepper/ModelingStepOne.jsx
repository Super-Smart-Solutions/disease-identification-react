import React from "react";
import SelectInput from "../../Formik/SelectInput";
import { useTranslation } from "react-i18next";

export default function ModelingStepOne({ modelingData, setModelingData }) {
  const { t } = useTranslation();
  const categoryOptions = [
    { value: "crops", label: " Crops" },
    { value: "flowers", label: " Flowers" },
    { value: "fruits", label: " Fruits" },
    { value: "vegetables", label: " Vegetables" },
    { value: "herbs", label: " Herbs" },
    { value: "grains", label: " Grains" },
    { value: "fish_farming", label: " Fish Farming" },
    { value: "livestock", label: " Livestock" },
    { value: "poultry", label: " Poultry" },
    { value: "beekeeping", label: " Beekeeping" },
    { value: "forestry", label: " Forestry" },
    { value: "organic_farming", label: " Organic Farming" },
    { value: "hydroponics", label: " Hydroponics" },
    { value: "aquaponics", label: " Aquaponics" },
    { value: "soil_management", label: " Soil Management" },
    { value: "greenhouses", label: " Greenhouses" },
    { value: "agroforestry", label: " Agroforestry" },
    { value: "sustainable_farming", label: " Sustainable Farming" },
  ];
  return (
    <div>
      <SelectInput
        isClearable={true}
        label={t("select_category_key")}
        options={categoryOptions}
        value={modelingData?.category?.value}
        onChange={(selectedOption) =>
          setModelingData((prev) => ({
            ...prev,
            category: selectedOption,
          }))
        }
        placeholder={t("select_category_key")}
      />
    </div>
  );
}
