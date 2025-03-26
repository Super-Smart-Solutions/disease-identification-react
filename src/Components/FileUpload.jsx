import React from "react";
import { useDropzone } from "react-dropzone";
import { useTranslation } from "react-i18next";
import { FiUploadCloud, FiX } from "react-icons/fi";

const FileUpload = ({
  accept = "image/*",
  multiple = false,
  selectedFile = [],
  setSelectedFile,
  allowRemove = false, // New prop with default false
}) => {
  const { t } = useTranslation();

  const { getRootProps, getInputProps } = useDropzone({
    accept,
    multiple,
    onDrop: (acceptedFiles) => {
      setSelectedFile(acceptedFiles);
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
            {t("accepted_types_key")}: {accept}
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
                    className="absolute top-6 right-6 p-1 bg-gray-300 rounded-full text-black opacity-0 group-hover:opacity-100 cursor-pointer   transition-opacity"
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
