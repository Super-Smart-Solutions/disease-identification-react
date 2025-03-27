import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import SelectInput from "../Formik/SelectInput";
import Button from "../Button";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { fetchPlants, fetchDiseasesByPlant } from "../../api/plantAPI";
import { fetchDiseaseById } from "../../api/diseaseAPI";

const PlantDiseaseForm = ({ onSelectDisease, onSelectPlant }) => {
  const { t, i18n } = useTranslation();
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [translatedPlants, setTranslatedPlants] = useState([]);
  const [translatedDiseases, setTranslatedDiseases] = useState([]);

  // Fetch plants
  const { data: plantOptions = [], isLoading: plantsLoading } = useQuery({
    queryKey: ["plants"],
    queryFn: async () => {
      const plants = await fetchPlants();
      return plants.items;
    },
  });

  // Fetch diseases based on selected plant
  const { data: diseaseOptions = [], isLoading: diseasesLoading } = useQuery({
    queryKey: ["diseases", selectedPlant],
    queryFn: async () => {
      if (!selectedPlant) return [];
      const diseases = await fetchDiseasesByPlant(selectedPlant);
      return diseases.items;
    },
    enabled: !!selectedPlant,
  });

  // Translate plant names on language change
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

  // Translate disease names on language change
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
    } catch (error) {
      console.error("Failed to fetch disease details:", error);
    }
  };

  return (
    <Formik
      enableReinitialize
      initialValues={{ plant: "", disease: "" }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ setFieldValue, values, errors, touched }) => (
        <Form className="flex items-end justify-between gap-4 w-full cardIt">
          {/* Plant Select Input */}
          <div className="w-[40%]">
            <Field name="plant">
              {({ field }) => (
                <SelectInput
                  label={t("select_plant_key")}
                  options={translatedPlants}
                  value={translatedPlants.find(
                    (option) => option.value === field.value
                  )}
                  onChange={(selectedOption) => {
                    setFieldValue("plant", selectedOption.value);
                    setSelectedPlant(selectedOption.value);
                  }}
                  placeholder={
                    plantsLoading ? t("loading_key") : t("select_plant_key")
                  }
                  isLoading={plantsLoading}
                />
              )}
            </Field>
            {errors.plant && touched.plant && (
              <div className="text-red-500 text-sm">{errors.plant}</div>
            )}
          </div>

          {/* Disease Select Input */}
          <div className="w-[40%]">
            <Field name="disease">
              {({ field }) => (
                <SelectInput
                  label={t("select_disease_key")}
                  options={translatedDiseases}
                  value={translatedDiseases.find(
                    (option) => option.value === field.value
                  )}
                  onChange={(selectedOption) =>
                    setFieldValue("disease", selectedOption.value)
                  }
                  placeholder={
                    diseasesLoading ? t("loading_key") : t("select_disease_key")
                  }
                  isLoading={diseasesLoading}
                  isDisabled={!selectedPlant}
                />
              )}
            </Field>
            {errors.disease && touched.disease && (
              <div className="text-red-500 text-sm">{errors.disease}</div>
            )}
          </div>

          {/* Get Data Button */}
          <Button type="submit" className="w-full">
            {t("get_data_key")}
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default PlantDiseaseForm;
