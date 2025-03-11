import React, { useState } from "react";
import ExpandedStep from "../Components/pages/ExpandedStep";
import FileUpload from "../Components/FileUpload";
import ModelingStepOne from "../Components/pages/modeling stepper/ModelingStepOne";
import { useTranslation } from "react-i18next";

export default function Models() {
  const { t } = useTranslation();
  const [modelingData, setModelingData] = useState({
    category: {},
    selected_file: [],
  });

  const handleSelectFile = (selectedFile) => {
    setModelingData((prev) => ({
      ...prev,
      selected_file: Array.isArray(selectedFile) ? selectedFile : [], // Ensure it's an array
    }));
  };
  console.log({ modelingData });

  return (
    <div className=" space-y-6">
      <ExpandedStep
        title={t("select_model_key")}
        expandedContent={
          <ModelingStepOne
            modelingData={modelingData}
            setModelingData={setModelingData}
          />
        }
      />
      <ExpandedStep
        title={t("select_image_key")}
        expandedContent={
          <FileUpload
            accept="image/*"
            multiple={false}
            selectedFile={modelingData?.selected_file}
            setSelectedFile={handleSelectFile}
          />
        }
        disabled={!modelingData?.category?.value}
      />
    </div>
  );
}
