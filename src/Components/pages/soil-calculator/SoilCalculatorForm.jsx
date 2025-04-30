import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import Button from "../../Button";
import { ResultsCard } from "./ResultsCard";

export const SoilCalculatorForm = ({
  isSubmitting,
  searchError,
  assessmentResult,
}) => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = React.useState(1);
  const totalSteps = assessmentResult
    ? Object.keys(assessmentResult.assessment.results).length + 1 // +1 for recommendations
    : 0;

  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <Form className="space-y-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row justify-between w-full gap-4"
      >
        <div className="space-y-4 w-full md:w-6/12">
          {/* Crop Field */}
          <div className="form-group">
            <label
              htmlFor="crop_name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("crop_key")}
            </label>
            <Field
              placeholder={t("type_crop_key")}
              type="text"
              name="crop_name"
              id="crop_name"
              className="custom-input w-full p-2 border rounded"
            />
            <ErrorMessage
              name="crop_name"
              component="div"
              className="text-red-500 text-xs mt-1"
            />
          </div>

          {/* pH Field */}
          <div className="form-group">
            <label
              htmlFor="ph"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("ph_key")}
            </label>
            <Field
              placeholder="(0-14)"
              type="text"
              name="ph"
              id="ph"
              className="custom-input w-full p-2 border rounded"
            />
            <ErrorMessage
              name="ph"
              component="div"
              className="text-red-500 text-xs mt-1"
            />
          </div>

          {/* Salinity Field */}
          <div className="form-group">
            <label
              htmlFor="salinity"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("salinity_key")}
            </label>
            <Field
              placeholder="(5-18)"
              type="text"
              name="salinity"
              id="salinity"
              className="custom-input w-full p-2 border rounded"
            />
            <ErrorMessage
              name="salinity"
              component="div"
              className="text-red-500 text-xs mt-1"
            />
          </div>

          {/* Temperature Field */}
          <div className="form-group">
            <label
              htmlFor="temperature"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("temperature_key")}
            </label>
            <Field
              placeholder="°C"
              type="text"
              name="temperature"
              id="temperature"
              className="custom-input w-full p-2 border rounded"
            />
            <ErrorMessage
              name="temperature"
              component="div"
              className="text-red-500 text-xs mt-1"
            />
          </div>
        </div>

        <div className="w-full md:w-6/12">
          <ResultsCard
            isSubmitting={isSubmitting}
            assessmentResult={assessmentResult}
            searchError={searchError}
            onNextStep={handleNextStep}
            onPrevStep={handlePrevStep}
            currentStep={currentStep}
            totalSteps={totalSteps}
          />
        </div>
      </motion.div>

      <Button
        type="submit"
        width="full"
        className="mt-4"
        loading={isSubmitting}
      >
        {t("get_data_key")}
      </Button>
    </Form>
  );
};
