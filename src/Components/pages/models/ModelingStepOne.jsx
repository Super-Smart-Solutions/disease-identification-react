import React, { useState, useMemo } from "react";
import SelectInput from "../../Formik/SelectInput";
import { useTranslation } from "react-i18next";
import Button from "../../Button";
import { useQuery } from "@tanstack/react-query";
import { fetchPlants } from "../../../api/plantAPI";


export default function ModelingStepOne({ modelingData, setModelingData }) {
  const { t } = useTranslation();

  const CATEGORY_MAP = {
    Plants: ["Roses", "Citrus", "Grape", "Pomegranate", "Coffee"],
    Animal: ["Honey Bees", "Animals"],
    Fish: ["Fish"],
  };

  const CATEGORY_OPTIONS = [
    { value: "Plants", label: t("Plants_key") },
    { value: "Animal", label: t("Animals_key") },
    { value: "Fish", label: t("Fish_key") },
  ];

  // const [tempData, setTempData] = useState(modelingData);
  const [tempData, setTempData] = useState({
  categoryGroup: null,
  category: null,
  ...modelingData,
});


  const { data: plants = [], isLoading } = useQuery({
    queryKey: ["plants"],
    queryFn: async () => {
      const response = await fetchPlants();
      return response.items.map((plant) => ({
        value: plant.id,
        label: t(`plants.${plant.english_name}`, {
          defaultValue: plant.english_name,
        }),
        english_name: plant.english_name,
      }));
    },
  });

  // Derived filtered list based on selected category
  const filteredOptions = useMemo(() => {
    if (!tempData.categoryGroup) return [];
    const allowed = CATEGORY_MAP[tempData.categoryGroup.value] || [];
    return plants.filter((plant) =>
      allowed.includes(plant.english_name)
    );
  }, [plants, tempData.categoryGroup]);

  const handleSave = () => {
    setModelingData(tempData);
  };

  const handleReset = () => {
    setTempData({
      ...tempData,
      categoryGroup: null,
      category: null,
    });
    setModelingData((prev) => ({
      ...prev,
      category: null,
    }));
  };

  console.log("temp:", tempData?.category?.label);

  return (
    <div className="flex flex-col gap-4">
      <SelectInput
        isClearable={true}
        label={t("select_category_group_key")}
        options={CATEGORY_OPTIONS}
        value={tempData?.categoryGroup?.value || null}
        onChange={(selectedGroup) =>
          setTempData((prev) => ({
            ...prev,
            categoryGroup: selectedGroup,
            category: null, // Reset category when group changes
          }))
        }
        placeholder={t("select_category_group_key")}
      />

      {tempData.categoryGroup && (
        <SelectInput
          isClearable={true}
          label={t("select_category_key")}
          options={filteredOptions}
          isLoading={isLoading}
          value={tempData?.category?.value || null}
          onChange={(selectedOption) =>
            setTempData((prev) => ({
              ...prev,
              category: selectedOption,
            }))
          }
          placeholder={t("select_category_key")}
        />
      )}

      <div className="flex gap-4">
        <Button onClick={handleSave}>{t("next_key")}</Button>
        <Button variant="outlined" onClick={handleReset}>
          {t("reset_key")}
        </Button>
      </div>
    </div>
  );
}
