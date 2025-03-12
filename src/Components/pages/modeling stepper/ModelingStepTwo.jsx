import React from "react";
import FileUpload from "../../FileUpload";

export default function ModelingStepTwo({ modelingData, setModelingData }) {
  const handleSelectFile = (selectedFile) => {
    setModelingData((prev) => ({
      ...prev,
      selected_file: Array.isArray(selectedFile) ? selectedFile : [],
    }));
  };
  return (
    <div>
      <FileUpload
        accept="image/*"
        multiple={false}
        selectedFile={modelingData?.selected_file}
        setSelectedFile={handleSelectFile}
      />
    </div>
  );
}
