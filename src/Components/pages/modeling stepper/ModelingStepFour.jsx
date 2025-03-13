import React from "react";
import { useTranslation } from "react-i18next";
import Button from "../../Button";

export default function ModelingStepFour({ modelingData, setModelingData }) {
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
          <span>{t("uploaded_image_key")}</span>

          <div className="flex flex-col bg-primaryGray p-4 rounded-2xl">
            <span>{`${t("category_key")} : ${
              modelingData?.category?.label
            }`}</span>
            <span>{`${t("selected_disease")} varona`}</span>
            <span>{`${t("confidence_level")} : 18%`}</span>
          </div>
          <Button
            onClick={() => {
              setModelingData((prev) => ({
                ...prev,
                is_deep: true,
              }));
            }}
          >
            {" "}
            {t("read_more_about_disease_key")}
          </Button>
        </div>
      ))}
    </div>
  );
}
