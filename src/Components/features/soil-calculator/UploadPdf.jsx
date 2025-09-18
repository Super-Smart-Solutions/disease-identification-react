import React from "react";
import { useField } from "formik";
import { useTranslation } from "react-i18next";
import FileUpload from "../../FileUpload";

export default function UploadPdf({ name, assessmentResult }) {
  const { t } = useTranslation();
  const [field, , helpers] = useField(name);

  const handleFileChange = (files) => {
    helpers.setValue(files[0] || null);
    helpers.setTouched(true);
  };

  return (
    <div className="space-y-2">
      <span className=" text-muted text-sm block mb-2">
        {" "}
        {t("optional_key")}
      </span>
      <FileUpload
        accept={{ "application/pdf": [".pdf"] }}
        multiple={false}
        selectedFile={field.value ? [field.value] : []}
        setSelectedFile={handleFileChange}
        allowRemove={!assessmentResult}
      />
      {field.value && (
        <div className="text-sm text-gray-600">
          {t("selected_file_key")}: {field.value.name} (
          {(field.value.size / 1024 / 1024).toFixed(2)} MB)
        </div>
      )}
    </div>
  );
}
