import React, { useState, useMemo } from "react";
import ExpandedStep from "../Components/pages/ExpandedStep";
import ModelingStepOne from "../Components/pages/modeling stepper/ModelingStepOne";
import { useTranslation } from "react-i18next";
import ModelingStepTwo from "../Components/pages/modeling stepper/ModelingStepTwo";
import ModelingStepThree from "../Components/pages/modeling stepper/ModelingStepThree";
import ModelingStepFour from "../Components/pages/modeling stepper/ModelingStepFour";
import VerticalSteps from "../Components/VerticalSteps"; // Import the reusable component

export default function Models() {
  const { t } = useTranslation();
  const [modelingData, setModelingData] = useState({
    category: {},
    selected_file: [],
    is_final: false,
  });

  // Determine the active step based on modelingData
  const activeStep = useMemo(() => {
    if (!modelingData?.category?.value) return 1; // Step 1: Select Model
    if (modelingData?.selected_file?.length === 0) return 2; // Step 2: Select Image
    if (!modelingData?.is_final) return 3; // Step 3: Processing Image
    return 4; // Step 4: Result
  }, [modelingData]);

  const memoizedModelingData = useMemo(() => modelingData, [modelingData]);

  const isStepTwoDisabled = useMemo(
    () => !modelingData?.category?.value,
    [modelingData?.category?.value]
  );

  const isStepThreeDisabled = useMemo(
    () => modelingData?.selected_file?.length === 0,
    [modelingData?.selected_file]
  );

  const isStepFourDisabled = useMemo(
    () =>
      !modelingData?.is_final ||
      modelingData?.selected_file?.length === 0 ||
      !modelingData?.category?.value,
    [
      modelingData?.is_final,
      modelingData?.selected_file,
      modelingData?.category?.value,
    ]
  );

  const STEP_TITLES = {
    SELECT_MODEL: t("select_model_key"),
    SELECT_IMAGE: t("select_image_key"),
    PROCESSING_IMAGE: t("processing_image_key"),
    RESULT: t("result_key"),
  };

  // Define the steps for the VerticalSteps component
  const steps = new Array(4).fill(null); // Creates an array of 4 empty values

  return (
    <div className="flex gap-4 justify-start items-start">
      {/* Vertical Steps */}
      <VerticalSteps activeStep={activeStep} steps={steps} />

      {/* Expanded Steps */}
      <div className="flex-1 space-y-6">
        <ExpandedStep
          title={STEP_TITLES.SELECT_MODEL}
          expandedContent={
            <ModelingStepOne
              modelingData={memoizedModelingData}
              setModelingData={setModelingData}
            />
          }
        />
        <ExpandedStep
          title={STEP_TITLES.SELECT_IMAGE}
          expandedContent={
            <ModelingStepTwo
              modelingData={memoizedModelingData}
              setModelingData={setModelingData}
            />
          }
          disabled={isStepTwoDisabled}
        />
        <ExpandedStep
          title={STEP_TITLES.PROCESSING_IMAGE}
          expandedContent={
            <ModelingStepThree
              modelingData={memoizedModelingData}
              setModelingData={setModelingData}
            />
          }
          disabled={isStepThreeDisabled}
        />
        <ExpandedStep
          title={STEP_TITLES.RESULT}
          expandedContent={
            <ModelingStepFour
              modelingData={memoizedModelingData}
              setModelingData={setModelingData}
            />
          }
          disabled={isStepFourDisabled}
        />
      </div>
    </div>
  );
}
