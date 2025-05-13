import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import SelectInput from "../../Formik/SelectInput";
import Button from "../../Button";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { fetchPlants, fetchDiseasesByPlant } from "../../../api/plantAPI";
import { fetchDiseaseById } from "../../../api/diseaseAPI";

const PlantDiseaseForm = ({ onSelectDisease, onSelectPlant }) => {
  const { t, i18n } = useTranslation();
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [translatedPlants, setTranslatedPlants] = useState([]);
  const [translatedDiseases, setTranslatedDiseases] = useState([]);
  const [hasData, setHasData] = useState(false);

  const { data: plantOptions = [], isLoading: plantsLoading } = useQuery({
    queryKey: ["plants"],
    queryFn: async () => {
      const plants = await fetchPlants();
      return plants.items;
    },
  });

  const { data: diseaseOptions = [], isLoading: diseasesLoading } = useQuery({
    queryKey: ["diseases", selectedPlant],
    queryFn: async () => {
      if (!selectedPlant) return [];
      const diseases = await fetchDiseasesByPlant(selectedPlant);
      return diseases?.items;
    },
    enabled: !!selectedPlant,
  });

  useEffect(() => {
    if (plantOptions.length > 0) {
      setTranslatedPlants(
        plantOptions.map((plant) => ({
          value: plant.id,
          label: t(`plants.${plant.english_name}`, {
            defaultValue: plant.english_name,
          }),
          english_name: plant.english_name,
        }))
      );
    }
  }, [plantOptions, i18n.language]);

  useEffect(() => {
    if (diseaseOptions.length > 0) {
      setTranslatedDiseases(
        diseaseOptions.map((disease) => ({
          value: disease.id,
          label: t(`diseases.${disease.english_name}`, {
            defaultValue: disease.english_name,
          }),
          english_name: disease.english_name,
        }))
      );
    }
  }, [diseaseOptions, i18n.language]);

  const validationSchema = Yup.object().shape({
    plant: Yup.string().required(t("select_plant_required_key")),
    disease: Yup.string().required(t("select_disease_required_key")),
  });

  const handleSubmit = async (values) => {
    try {
      const diseaseData = await fetchDiseaseById(values.disease);
      onSelectDisease(diseaseData);
      onSelectPlant(values.plant);
      setHasData(true);
    } catch (error) {
      console.error("Failed to fetch disease details:", error);
    }
  };

  const handleReset = (resetForm) => {
    resetForm();
    setSelectedPlant(null);
    onSelectDisease(null);
    onSelectPlant(null);
    setHasData(false);
  };

  return (
    <Formik
      enableReinitialize
      initialValues={{ plant: "", disease: "" }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ setFieldValue, values, errors, touched, resetForm }) => (
        <Form className="w-full cardIt">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            {/* Plant Select Input */}
            <div className="md:col-span-2">
              <Field name="plant">
                {({ field }) => (
                  <SelectInput
                    label={t("select_plant_key")}
                    options={translatedPlants}
                    value={field?.value}
                    onChange={(selectedOption) => {
                      setFieldValue("plant", selectedOption.value);
                      setSelectedPlant(selectedOption.value);
                      setFieldValue("disease", null);
                      setHasData(false);
                    }}
                    placeholder={t("select_plant_key")}
                    isLoading={plantsLoading}
                  />
                )}
              </Field>
              {errors.plant && touched.plant && (
                <div className="text-red-500 text-sm">{errors.plant}</div>
              )}
            </div>

            {/* Disease Select Input */}
            <div className="md:col-span-2">
              <Field name="disease">
                {({ field }) => (
                  <SelectInput
                    label={t("select_disease_key")}
                    options={translatedDiseases}
                    value={field?.value || null}
                    onChange={(selectedOption) => {
                      setFieldValue("disease", selectedOption.value);
                      setHasData(false);
                    }}
                    placeholder={
                      diseasesLoading
                        ? t("loading_key")
                        : t("select_disease_key")
                    }
                    isLoading={diseasesLoading}
                  />
                )}
              </Field>
              {errors.disease && touched.disease && (
                <div className="text-red-500 text-sm">{errors.disease}</div>
              )}
            </div>

            {/* Conditional Button */}
            <div className="md:col-span-1">
              {hasData ? (
                <Button
                  type="button"
                  onClick={() => handleReset(resetForm)}
                  width="full"
                >
                  {t("reset_key")}
                </Button>
              ) : (
                <Button type="submit" width="full">
                  {t("get_data_key")}
                </Button>
              )}
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default PlantDiseaseForm;
