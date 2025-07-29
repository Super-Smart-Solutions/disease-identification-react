import React, { useMemo, useCallback } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import SelectInput from "../../Formik/SelectInput";
import Button from "../../Button";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { fetchPlants, fetchDiseasesByPlant } from "../../../api/plantAPI";

const PlantDiseaseForm = ({
  selectedDisease,
  selectedPlant,
  handleDiseaseChange,
  handlePlantChange,
  handleReset,
}) => {
  const { t, i18n } = useTranslation();

  const { data: plantOptions = [], isLoading: plantsLoading } = useQuery({
    queryKey: ["plants"],
    queryFn: async () => {
      const plants = await fetchPlants();
      return plants.items || [];
    },
  });

  const { data: diseaseOptions = [], isLoading: diseasesLoading } = useQuery({
    queryKey: ["diseases", selectedPlant],
    queryFn: async () => {
      if (!selectedPlant) return [];
      const diseases = await fetchDiseasesByPlant(selectedPlant);
      return diseases?.items || [];
    },
    enabled: !!selectedPlant,
  });

  const translatedPlants = useMemo(
    () =>
      plantOptions.map((plant) => ({
        value: plant.id,
        label: t(`plants.${plant.english_name}`, {
          defaultValue: plant.english_name,
        }),
        english_name: plant.english_name,
      })),
    [plantOptions, i18n.language, t]
  );

  const translatedDiseases = useMemo(
    () =>
      diseaseOptions.map((disease) => ({
        value: disease.id,
        label: t(`diseases.${disease.english_name}`, {
          defaultValue: disease.english_name,
        }),
        english_name: disease.english_name,
      })),
    [diseaseOptions, i18n.language, t]
  );

  const validationSchema = Yup.object().shape({
    plant: Yup.string().required(t("required_field_key")),
    disease: Yup.string().required(t("required_field_key")),
  });

  const onReset = (resetForm) => {
    handleReset();
    resetForm();
  };

  const onPlantSelect = useCallback(
    (selectedOption, setFieldValue) => {
      const id = selectedOption.value;
      setFieldValue("plant", id);
      setFieldValue("disease", "");
      handlePlantChange(id);
    },
    [handlePlantChange]
  );

  const onDiseaseSelect = useCallback(
    (selectedOption, setFieldValue) => {
      const id = selectedOption.value;
      setFieldValue("disease", id);
      handleDiseaseChange(id);
    },
    [handleDiseaseChange]
  );

  return (
    <Formik
      enableReinitialize
      initialValues={{
        plant: selectedPlant,
        disease: selectedDisease,
      }}
      validationSchema={validationSchema}
    >
      {({
        setFieldValue,
        errors,
        touched,
        resetForm,
        isSubmitting,
        values,
      }) => (
        <Form className="w-full cardIt">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div className="md:col-span-2">
              <SelectInput
                name="plant"
                label={t("select_plant_key")}
                options={translatedPlants}
                value={Number(values.plant) || null}
                onChange={(opt) => onPlantSelect(opt, setFieldValue)}
                placeholder={t("select_plant_key")}
                isLoading={plantsLoading}
              />
              {errors.plant && touched.plant && (
                <div className="text-red-500 text-sm">{errors.plant}</div>
              )}
            </div>

            <div className="md:col-span-2">
              <SelectInput
                name="disease"
                label={t("select_disease_key")}
                options={translatedDiseases}
                value={Number(values.disease) || null}
                onChange={(opt) => onDiseaseSelect(opt, setFieldValue)}
                placeholder={
                  diseasesLoading ? t("loading_key") : t("select_disease_key")
                }
                isLoading={diseasesLoading}
                isDisabled={!values.plant}
              />
              {errors.disease && touched.disease && (
                <div className="text-red-500 text-sm">{errors.disease}</div>
              )}
            </div>

            <div className="md:col-span-1">
              <Button
                type="button"
                onClick={() => onReset(resetForm)}
                width="full"
                disabled={isSubmitting}
              >
                {t("reset_key")}
              </Button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default PlantDiseaseForm;
