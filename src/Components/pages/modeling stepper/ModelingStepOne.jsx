import React, { useState } from "react";
import SelectInput from "../../Formik/SelectInput";
import { useTranslation } from "react-i18next";
import Button from "../../Button";

export default function ModelingStepOne({ modelingData, setModelingData }) {
  const { t } = useTranslation();
  const [tempData, setTempData] = useState(modelingData);

  const categoryOptions = [
    { value: "crops", label: "Crops" },
    { value: "flowers", label: "Flowers" },
    { value: "fruits", label: "Fruits" },
    { value: "vegetables", label: "Vegetables" },
    { value: "herbs", label: "Herbs" },
    { value: "grains", label: "Grains" },
    { value: "fish_farming", label: "Fish Farming" },
    { value: "livestock", label: "Livestock" },
    { value: "poultry", label: "Poultry" },
    { value: "beekeeping", label: "Beekeeping" },
    { value: "forestry", label: "Forestry" },
    { value: "organic_farming", label: "Organic Farming" },
    { value: "hydroponics", label: "Hydroponics" },
    { value: "aquaponics", label: "Aquaponics" },
    { value: "soil_management", label: "Soil Management" },
    { value: "greenhouses", label: "Greenhouses" },
    { value: "agroforestry", label: "Agroforestry" },
    { value: "sustainable_farming", label: "Sustainable Farming" },
  ];

  const handleSave = () => {
    setModelingData(tempData);
  };

  const handleReset = () => {
    setModelingData((prev) => ({
      ...prev,
      category: null,
    }));
  };

  return (
    <div className="flex items-end gap-4">
      <SelectInput
        isClearable={true}
        label={t("select_category_key")}
        options={categoryOptions}
        value={modelingData?.category?.value || null}
        onChange={(selectedOption) =>
          setTempData((prev) => ({
            ...prev,
            category: selectedOption,
          }))
        }
        placeholder={t("select_category_key")}
      />
      <Button onClick={handleSave}>{t("next_key")}</Button>
      <Button variant="outlined" onClick={handleReset}>
        {t("reset_key")}
      </Button>
    </div>
  );
}
