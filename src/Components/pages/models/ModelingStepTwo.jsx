import React, { useState } from "react";
import FileUpload from "../../FileUpload";
import Button from "../../Button";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import { uploadImage } from "../../../api/imagesAPI";

export default function ModelingStepTwo({ modelingData, setModelingData }) {
  const { t } = useTranslation();
  const [tempFile, setTempFile] = useState(modelingData?.selected_file || []);
  const [isUploading, setIsUploading] = useState(false);

  // Mutation for uploading the image
  const uploadMutation = useMutation({
    mutationFn: uploadImage,
    onSuccess: (data) => {
      setModelingData((prev) => ({
        ...prev,
        selected_file: tempFile,
        image_id: data.id, // Save image ID from response
      }));
    },
    onError: (error) => {
      console.error("Upload failed:", error);
    },
    onSettled: () => {
      setIsUploading(false);
    },
  });

  const handleSelectFile = (selectedFile) => {
    setTempFile(Array.isArray(selectedFile) ? selectedFile : []);
  };

  const handleSave = () => {
    if (!tempFile.length) return;
    if (!modelingData?.category?.value) {
      console.error("No plant selected!");
      return;
    }

    const file = tempFile[0];
    const selectedPlant = modelingData.category.label.toLowerCase(); // Convert plant name to lowercase
    const timestamp = Date.now();
    const formattedName = `uploads/${selectedPlant}/${timestamp}_${file.name}`;

    // Upload image with metadata
    setIsUploading(true);
    uploadMutation.mutate({
      name: formattedName,
      plantId: modelingData.category.value,
      farmId: 1,
      imageFile: file,
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
        accept="image/*"
        multiple={false}
        selectedFile={tempFile}
        setSelectedFile={handleSelectFile}
      />
      <div className="flex gap-2 items-center justify-end mt-4">
        <Button onClick={handleSave} disabled={isUploading}>
          {isUploading ? t("loading_key") : t("start_detection_key")}
        </Button>
        <Button variant="outlined" onClick={handleReset} disabled={isUploading}>
          {t("reset_key")}
        </Button>
      </div>
    </div>
  );
}
