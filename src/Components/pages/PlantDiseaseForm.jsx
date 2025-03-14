import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import SelectInput from "../Formik/SelectInput";
import Button from "../Button";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { fetchPlants, fetchDiseasesByPlant } from "../../api/plantAPI";
import { fetchDiseaseById } from "../../api/diseaseAPI";

const PlantDiseaseForm = ({ onSelectDisease, onSelectPlant, initialPlant, initialDisease }) => { 
  const { t } = useTranslation();
  const [selectedPlant, setSelectedPlant] = useState(initialPlant?.value || null);

  useEffect(() => {
    if (initialPlant) {
      setSelectedPlant(initialPlant.value);
    }
  }, [initialPlant]);

  return (
    <Formik
      enableReinitialize
      initialValues={{
        plant: initialPlant?.value || "",
        disease: initialDisease?.id || "",
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ setFieldValue }) => (
        <Form className="flex items-end justify-between gap-4 w-full cardIt">
          <Field name="plant">
            {({ field }) => (
              <SelectInput
                label={t("select_plant_key")}
                options={plantOptions}
                value={plantOptions.find((option) => option.value === field.value)}
                onChange={(selectedOption) => {
                  setFieldValue("plant", selectedOption.value);
                  setSelectedPlant(selectedOption.value);
                }}
              />
            )}
          </Field>

          <Field name="disease">
            {({ field }) => (
              <SelectInput
                label={t("select_disease_key")}
                options={diseaseOptions}
                value={diseaseOptions.find((option) => option.value === field.value)}
                onChange={(selectedOption) => setFieldValue("disease", selectedOption.value)}
                isDisabled={!selectedPlant}
              />
            )}
          </Field>

          <Button type="submit">{t("get_data_key")}</Button>
        </Form>
      )}
    </Formik>
  );
};

export default PlantDiseaseForm;
