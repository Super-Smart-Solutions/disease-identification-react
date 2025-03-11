import React from "react";
import { useDropzone } from "react-dropzone";
import { useTranslation } from "react-i18next"; // Import useTranslation hook
import { FiUploadCloud, FiX } from "react-icons/fi"; // Import icons

const FileUpload = ({
  accept = "image/*",
  multiple = false,
  selectedFile = [],
  setSelectedFile,
}) => {
  const { t } = useTranslation(); // Initialize translation

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
    <div className="space-y-4">
      {/* Dropzone Area */}
      {selectedFile.length === 0 ? (
        <div
          {...getRootProps()}
          className="p-6 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-blue-500 transition-colors"
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
              <div
                key={index}
                className="flex items-center p-2 border rounded-lg bg-gray-50"
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="w-12 h-12 object-cover rounded-md"
                />
                <div className="ml-3">
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
                <FiX
                  onClick={() => removeFile(index)}
                  className="ms-auto cursor-pointer text-gray-500 hover:text-red-500"
                  title={t("remove_file_key")}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
