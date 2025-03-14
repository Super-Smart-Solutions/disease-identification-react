import React, { useState } from "react";
import SelectInput from "../../Formik/SelectInput";
import { useTranslation } from "react-i18next";
import Button from "../../Button";
import { useQuery } from "@tanstack/react-query";
import { fetchPlants } from "../../../api/plantAPI";

export default function ModelingStepOne({ modelingData, setModelingData }) {
  const { t } = useTranslation();
  const [tempData, setTempData] = useState(modelingData);

  // Fetch plants from API
  const { data: plants = [], isLoading, error } = useQuery({
    queryKey: ["plants"],
    queryFn: async () => {
      const response = await fetchPlants();
      return response.data.map((plant) => ({
        value: plant.id,
        label: plant.english_name,
      }));
    },
  });

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
        options={plants}
        isLoading={isLoading}
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
