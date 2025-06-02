import React from "react";
import { useDropzone } from "react-dropzone";
import { useTranslation } from "react-i18next";
import { FiUploadCloud, FiX } from "react-icons/fi";

const FileUpload = ({
  accept = { "image/*": [".jpeg", ".jpg", ".png", ".gif"] }, // Corrected accept format
  multiple = false,
  selectedFile = [],
  setSelectedFile,
  allowRemove = false,
}) => {
  const { t } = useTranslation();

  const { getRootProps, getInputProps } = useDropzone({
    accept, // Use object format for accept
    multiple,
    maxSize: 4 * 1024 * 1024, // 4MB in bytes
    onDrop: (acceptedFiles, fileRejections) => {
      setSelectedFile(acceptedFiles);
      if (fileRejections.length > 0) {
        alert(
          t("file_rejected_key", {
            reasons: fileRejections
              .map((rej) =>
                rej.errors.map((err) =>
                  err.code === "file-too-large"
                    ? t("file_too_large_key", { maxSize: "4MB" })
                    : t("file_type_invalid_key")
                )
              )
              .join(", "),
          })
        );
      }
    },
  });

  const removeFile = (index) => {
    setSelectedFile((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4 grow">
      {/* Dropzone Area */}
      {selectedFile.length === 0 ? (
        <div
          {...getRootProps()}
          className="p-6 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-primary transition-colors"
        >
          <input {...getInputProps()} />
          <FiUploadCloud className="mx-auto text-3xl text-gray-400" />
          <p className="mt-2 text-gray-600">{t("drag_drop_key")}</p>
          <p className="text-sm text-gray-500">
            {t("accepted_types_key")}: {Object.keys(accept).join(", ")} (Max
            4MB)
          </p>
        </div>
      ) : (
        <div className="mt-4">
          <div className="space-y-2">
            {selectedFile.map((file, index) => (
              <div key={index} className="relative group">
                <div className="flex items-center p-2 bg-gray-50">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="max-w-120 max-h-80 object-cover rounded-md"
                  />
                </div>
                {allowRemove && (
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="absolute top-6 right-6 p-1 bg-gray-300 rounded-full text-black opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
                  >
                    <FiX className="text-lg" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
