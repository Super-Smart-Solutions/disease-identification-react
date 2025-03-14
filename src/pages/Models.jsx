import React, { useState, useMemo, useEffect } from "react";
import ExpandedStep from "../Components/pages/ExpandedStep";
import ModelingStepOne from "../Components/pages/modeling_stepper/ModelingStepOne";
import { useTranslation } from "react-i18next";
import ModelingStepTwo from "../Components/pages/modeling_stepper/ModelingStepTwo";
import ModelingStepThree from "../Components/pages/modeling_stepper/ModelingStepThree";
import ModelingStepFour from "../Components/pages/modeling_stepper/ModelingStepFour";
import VerticalSteps from "../Components/VerticalSteps";
import DeepAnalysisStep from "../Components/pages/modeling_stepper/DeepAnalysisStep";
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchPlants } from "../api/plantAPI";
import { uploadImage } from "../api/imagesAPI";
import {
  startInference,
  validateInference,
  detectDisease,
  visualizeInference,
  analyzeInference,
} from "../api/inferenceAPI";


export default function Models() {
  const { t } = useTranslation();
  const [modelingData, setModelingData] = useState({
    category: {},
    selected_file: [],
    image_id: null,
    inference_id: null,
    is_deep: false,
    errorMessage: "",
    is_final: false,
  });

  const [expandedSteps, setExpandedSteps] = useState({
    1: true,
    2: false,
    3: false,
    4: false,
    5: false,
  });

  const activeStep = useMemo(() => {
    if (!modelingData?.category?.value) return 1;
    if (!modelingData?.image_id) return 2;
    if (!modelingData?.inference_id || !modelingData?.is_final) return 3;
    if (!modelingData?.is_deep) return 4;
    if (modelingData?.is_deep) return 5;
    return 5;
  }, [modelingData]);

  useEffect(() => {
    setExpandedSteps((prev) => {
      const newExpandedSteps = { ...prev };
      Object.keys(newExpandedSteps).forEach((key) => {
        newExpandedSteps[key] = parseInt(key) === activeStep;
      });
      return newExpandedSteps;
    });
  }, [activeStep]);

  const isStepTwoDisabled = useMemo(
    () => !modelingData?.category?.value,
    [modelingData?.category?.value]
  );

  const isStepThreeDisabled = useMemo(
    () =>
      modelingData?.selected_file?.length === 0 ||
      !modelingData?.category?.value,
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

  const isStepFiveDisabled = useMemo(
    () =>
      !modelingData?.is_deep ||
      !modelingData?.is_final ||
      modelingData?.selected_file?.length === 0 ||
      !modelingData?.category?.value,
    [
      modelingData?.is_deep,
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
    DEEB: t("deep_analytics_key"),
  };

  const handleToggleExpand = (stepId) => {
    setExpandedSteps((prev) => ({
      ...prev,
      [stepId]: !prev[stepId],
    }));
  };

  const steps = new Array(4).fill(null);

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
              modelingData={modelingData}
              setModelingData={setModelingData}
            />
          }
          disabled={false}
          isExpanded={expandedSteps[1]}
          onToggleExpand={handleToggleExpand}
          stepId={1}
        />
        <ExpandedStep
          title={STEP_TITLES.SELECT_IMAGE}
          expandedContent={
            <ModelingStepTwo
              modelingData={modelingData}
              setModelingData={setModelingData}
            />
          }
          disabled={isStepTwoDisabled}
          isExpanded={expandedSteps[2]}
          onToggleExpand={handleToggleExpand}
          stepId={2}
        />
        <ExpandedStep
          title={STEP_TITLES.PROCESSING_IMAGE}
          expandedContent={
            <ModelingStepThree
              modelingData={modelingData}
              setModelingData={setModelingData}
            />
          }
          disabled={isStepThreeDisabled}
          isExpanded={expandedSteps[3]}
          onToggleExpand={handleToggleExpand}
          stepId={3}
        />
        <ExpandedStep
          title={STEP_TITLES.RESULT}
          expandedContent={
            <ModelingStepFour
              modelingData={modelingData}
              setModelingData={setModelingData}
            />
          }
          disabled={isStepFourDisabled}
          isExpanded={expandedSteps[4]}
          onToggleExpand={handleToggleExpand}
          stepId={4}
        />
        <ExpandedStep
          title={STEP_TITLES.DEEB}
          expandedContent={
            <DeepAnalysisStep
              modelingData={modelingData}
              setModelingData={setModelingData}
            />
          }
          disabled={isStepFiveDisabled}
          isExpanded={expandedSteps[5]}
          onToggleExpand={handleToggleExpand}
          stepId={5}
        />
      </div>
    </div>
  );
}
