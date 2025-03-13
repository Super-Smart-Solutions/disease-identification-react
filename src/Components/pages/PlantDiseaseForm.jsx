import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useQuery } from "@tanstack/react-query";
import SelectInput from "../Formik/SelectInput";
import Button from "../Button";
import { useTranslation } from "react-i18next";
import { fetchPlants, fetchDiseasesByPlant } from "../../api/plantAPI";
// import { fetchDiseasesByPlant } from "../../api/diseaseAPI";

const PlantDiseaseForm = () => {
  const { t } = useTranslation();
  const [selectedPlant, setSelectedPlant] = useState(null);

  // Fetch plants
  const {
    data: plantOptions = [],
    isLoading: plantsLoading,
    error: plantsError,
  } = useQuery({
    queryKey: ["plants"],
    queryFn: fetchPlants,
  });

  // Fetch diseases based on selected plant
  const {
    data: diseaseOptions = [],
    isLoading: diseasesLoading,
    error: diseasesError,
  } = useQuery({
    queryKey: ["diseases", selectedPlant],
    queryFn: () => fetchDiseasesByPlant(selectedPlant),
    enabled: !!selectedPlant, // Only fetch if a plant is selected
  });

  // Validation schema using Yup
  const validationSchema = Yup.object().shape({
    plant: Yup.number().required(t("select_plant_required_key")),
    disease: Yup.number().required(t("select_disease_required_key")),
  });

  // Handle form submission
  const handleSubmit = (values) => {
    console.log("Form Values:", values);
  };

  return (
    <Formik
      enableReinitialize
      initialValues={{ plant: "", disease: "" }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ setFieldValue, errors, touched }) => (
        <Form className="flex items-end justify-between gap-4 w-full cardIt">
          {/* Plant Select Input */}
          <div className="w-[40%]">
            {plantsLoading ? (
              <p>Loading plants...</p>
            ) : plantsError ? (
              <p className="text-red-500">Error loading plants</p>
            ) : (
              <Field name="plant">
                {({ field }) => (
                  <SelectInput
                    label={t("select_plant_key")}
                    options={plantOptions.map((p) => ({
                      value: p.id,
                      label: p.english_name,
                    }))}
                    value={plantOptions.find(
                      (option) => option.value === field.value
                    )}
                    onChange={(selectedOption) => {
                      setFieldValue("plant", selectedOption.value);
                      setSelectedPlant(selectedOption.value);
                      setFieldValue("disease", ""); // Reset disease selection
                    }}
                    placeholder={t("select_plant_key")}
                  />
                )}
              </Field>
            )}
            {errors.plant && touched.plant && (
              <div className="text-red-500 text-sm">{errors.plant}</div>
            )}
          </div>

          {/* Disease Select Input */}
          <div className="w-[40%]">
            {selectedPlant && diseasesLoading ? (
              <p>Loading diseases...</p>
            ) : diseasesError ? (
              <p className="text-red-500">Error loading diseases</p>
            ) : (
              <Field name="disease">
                {({ field }) => (
                  <SelectInput
                    label={t("select_disease_key")}
                    options={diseaseOptions.map((d) => ({
                      value: d.id,
                      label: d.label || d.english_name,
                    }))}
                    value={diseaseOptions.find(
                      (option) => option.value === field.value
                    )}
                    onChange={(selectedOption) =>
                      setFieldValue("disease", selectedOption.value)
                    }
                    placeholder={t("select_disease_key")}
                    isDisabled={!selectedPlant} // Disable if no plant is selected
                  />
                )}
              </Field>
            )}
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
