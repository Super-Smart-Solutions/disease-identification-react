import React from "react";
import Button from "../../Button";
import { useTranslation } from "react-i18next";

export default function ModelingStepThree({ modelingData, setModelingData }) {
  const { t } = useTranslation();
  return (
    <div>
      {modelingData?.selected_file.map((file, index) => (
        <div
          key={index}
          className="flex items-center p-2 border rounded-lg bg-gray-50 flex-col gap-4"
        >
          <img
            src={URL.createObjectURL(file)}
            alt={file.name}
            className="w-120 h-80 object-cover rounded-md"
          />

          <Button
            onClick={() =>
              setModelingData((prev) => ({
                ...prev,
                is_final: true,
              }))
            }
          >
            {t("find_diseases_key")}
          </Button>
        </div>
      ))}
    </div>
  );
}
