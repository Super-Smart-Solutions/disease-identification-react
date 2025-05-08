import React from "react";
import { useModelingData } from "../hooks/features/modeling/useModelingData";
import { useModelingSteps } from "../hooks/features/modeling/useModelingSteps";
import { useModelingStepsConfig } from "../hooks/features/modeling/useModelingStepsConfig";
import VerticalSteps from "../Components/VerticalSteps";
import ExpandedStep from "../Components/pages/ExpandedStep";
import InstructionModal from "../Components/pages/models/InstructionModal";

export default function Models() {
  const { modelingData, setModelingData } = useModelingData();
  const {
    expandedSteps,
    activeStep,
    getStepDisabledState,
    handleToggleExpand,
  } = useModelingSteps(modelingData);
  const stepsConfig = useModelingStepsConfig(getStepDisabledState);

  return (
    <div className="flex gap-4 justify-start items-start">
      <VerticalSteps activeStep={activeStep} steps={stepsConfig} />

      <div className="flex-1 space-y-6">
        {stepsConfig.map((step) => (
          <StepWrapper
            key={step.id}
            step={step}
            modelingData={modelingData}
            setModelingData={setModelingData}
            isExpanded={expandedSteps[step.id]}
            onToggleExpand={handleToggleExpand}
            showInstruction={step.id === 1}
          />
        ))}
      </div>
    </div>
  );
}

function StepWrapper({
  step,
  modelingData,
  setModelingData,
  isExpanded,
  onToggleExpand,
  showInstruction,
}) {
  const StepComponent = step.component;

  return (
    <div
      className={showInstruction ? "flex gap-4 justify-end items-start" : ""}
    >
      <div className={showInstruction ? "grow" : ""}>
        <ExpandedStep
          title={step.title}
          expandedContent={
            <StepComponent
              modelingData={modelingData}
              setModelingData={setModelingData}
            />
          }
          disabled={step.disabled}
          isExpanded={isExpanded}
          onToggleExpand={() => onToggleExpand(step.id)}
          stepId={step.id}
        />
      </div>
      {showInstruction && <InstructionModal />}
    </div>
  );
}
