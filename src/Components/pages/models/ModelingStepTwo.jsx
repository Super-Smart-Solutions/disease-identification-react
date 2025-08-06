import React, { useState } from "react";
import FileUpload from "../../FileUpload";
import Button from "../../Button";
import { useTranslation } from "react-i18next";
import { useUploadImage } from "../../../hooks/useImages";

export default function ModelingStepTwo({ modelingData, setModelingData }) {
  const { t } = useTranslation();
  const [tempFile, setTempFile] = useState(modelingData?.selected_file || []);

  const { upload, isUploading } = useUploadImage({
    onSuccess: (data) => {
      setModelingData((prev) => ({
        ...prev,
        selected_file: tempFile,
        image_id: data?.id,
      }));
    },
  });

  const handleSelectFile = (selectedFile) => {
    setTempFile(Array.isArray(selectedFile) ? selectedFile : []);
  };

  const handleSave = () => {
    if (!tempFile.length || !modelingData?.category?.value) return;

    const file = tempFile[0];

    upload({
      file,
      category: modelingData.category,
      farmId: 1,
    });
  };

  const handleReset = () => {
    setModelingData((prev) => ({
      ...prev,
      selected_file: [],
      image_id: null,
      is_final: false,
    }));
    setTempFile([]);
  };

  return (
    <div className="flex items-center gap-4 flex-col">
      <FileUpload
        multiple={false}
        selectedFile={tempFile}
        setSelectedFile={handleSelectFile}
      />
      <div className="flex gap-2 items-center justify-end mt-4">
        <Button
          onClick={() => {
            handleSave();
          }}
          loading={isUploading}
        >
          {t("start_detection_key")}
        </Button>
        <Button variant="outlined" onClick={handleReset} disabled={isUploading}>
          {t("reset_key")}
        </Button>
      </div>
    </div>
  );
}
