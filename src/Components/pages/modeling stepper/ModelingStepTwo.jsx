import React, { useState } from "react";
import FileUpload from "../../FileUpload";
import Button from "../../Button";
import { useTranslation } from "react-i18next";

export default function ModelingStepTwo({ modelingData, setModelingData }) {
  const { t } = useTranslation();
  const [tempFile, setTempFile] = useState(modelingData?.selected_file || []);

  const handleSelectFile = (selectedFile) => {
    setTempFile(Array.isArray(selectedFile) ? selectedFile : []);
  };

  const handleSave = () => {
    setModelingData((prev) => ({
      ...prev,
      selected_file: tempFile,
    }));
  };

  const handleReset = () => {
    setModelingData((prev) => ({
      ...prev,
      selected_file: [],
      is_final: false,
    }));
    setTempFile([]);
  };

  return (
    <div className="flex items-center gap-4 flex-col">
      <FileUpload
        accept="image/*"
        multiple={false}
        selectedFile={tempFile}
        setSelectedFile={handleSelectFile}
      />
      <div className=" flex gap-2 items-center justify-end mt-4">
        <Button onClick={handleSave}>{t("start_detection_key")}</Button>
        <Button variant="outlined" onClick={handleReset}>
          {t("reset_key")}
        </Button>
      </div>
    </div>
  );
}
