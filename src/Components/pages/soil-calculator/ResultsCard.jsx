import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import Button from "../../Button";

const stepVariants = {
  hidden: { x: 50, opacity: 0 },
  visible: { x: 0, opacity: 1 },
  exit: { x: -50, opacity: 0 },
};

export const ResultsCard = ({
  assessmentResult,
  searchError,
  onNextStep,
  onPrevStep,
  currentStep,
  totalSteps,
}) => {
  const { t } = useTranslation();

  if (searchError) {
    return (
      <div className="p-4 border rounded shadow-md text-red-500">
        {searchError}
      </div>
    );
  }

  if (!assessmentResult) {
    return (
      <div className="cardIt h-full">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const steps = [
    ...Object.entries(assessmentResult.assessment.results).map(
      ([parameter]) => parameter
    ),
    "recommendations",
  ];

  const currentParam = steps[currentStep - 1];
  const isLastStep = currentStep === totalSteps;
  const isFirstStep = currentStep === 1;

  return (
    <div className="cardIt h-full flex  flex-col justify-between ">
      <div>
        <div className="text-sm text-gray-500 mb-2">
          {t("step")} {currentStep} {t("of")} {totalSteps}
        </div>
        {/* Current step content */}
        <motion.div
          key={currentStep}
          variants={stepVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.3 }}
        >
          {currentParam !== "recommendations" ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 justify-between">
                <div className="font-semibold capitalize text-nowrap">
                  {t(`${currentParam}_key`)}
                </div>
                <span
                  className={`badge ${
                    assessmentResult.assessment.results[
                      currentParam
                    ].status.toLowerCase() === "optimal"
                      ? "badge-success"
                      : "badge-error"
                  }`}
                >
                  {t(
                    `status.${assessmentResult.assessment.results[
                      currentParam
                    ].status
                      .toLowerCase()
                      .replace(/\s+/g, "_")}`
                  )}
                </span>
              </div>
              <div className="text-sm flex flex-col">
                <span>
                  {t("your_value_key")}:{" "}
                  {assessmentResult.assessment.results[currentParam].user_value}
                </span>
                <span>
                  {t("optimal_value_key")}:{" "}
                  {assessmentResult.assessment.results[currentParam].range[0]}–
                  {assessmentResult.assessment.results[currentParam].range[1]}{" "}
                </span>
              </div>
            </div>
          ) : (
            <div className="">
              <h4 className="font-semibold mb-2">
                {t("recommendations_key")}:
              </h4>
              <ul className="list-disc list-inside space-y-1">
                {assessmentResult.assessment.recommendations.map(
                  (rec, index) => (
                    <li key={index} className="text-sm">
                      {rec}
                    </li>
                  )
                )}
              </ul>
            </div>
          )}
        </motion.div>
      </div>
      <div className="flex gap-2 justify-between items-center w-full mt-2">
        {!isFirstStep && (
          <span
            type="button"
            onClick={onPrevStep}
            className="text-sm text-primary hover:underline cursor-pointer "
          >
            {t("previous_key")}
          </span>
        )}
        {!isLastStep && (
          <span
            type="button"
            onClick={onNextStep}
            className="text-sm text-primary hover:underline  ms-auto cursor-pointer"
          >
            {t("next_key")}
          </span>
        )}
      </div>
    </div>
  );
};
