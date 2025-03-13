import React, { useState, useEffect } from "react";
import Button from "../../Button";
import { useTranslation } from "react-i18next";
import axiosInstance from "../../../utils/axiosInstance";

export default function ModelingStepThree({ modelingData, setModelingData }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [validationResult, setValidationResult] = useState(null);
  const validateFile = async () => {
    if (modelingData?.selected_file) {
      try {
        const response = await axiosInstance.post("/validate", {
          file: modelingData?.selected_file,
        });
        setTimeout(() => {
          setValidationResult(response.status);
          setLoading(false);
        }, 2000);
      } catch (error) {
        setTimeout(() => {
          setValidationResult(error.response?.status || 500);
          setModelingData((prev) => ({
            ...prev,
            is_final: true,
          }));
          setLoading(false);
        }, 2000);
      }
    }
  };
  useEffect(() => {
    validateFile();
  }, [modelingData?.selected_file, setModelingData]);

  return (
    <div>
      {modelingData?.selected_file.map((file, index) => (
        <div
          key={index}
          className="flex items-center p-2 bg-gray-50 flex-col gap-4"
        >
          {loading ? (
            <div className="flex gap-2 items-center">
              <p>{t("please_wait_validating_key")}</p>
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
          ) : validationResult === 200 ? (
            <Button
              onClick={() =>
                setModelingData((prev) => ({ ...prev, is_final: true }))
              }
            >
              {t("next_key")}
            </Button>
          ) : validationResult ? (
            <Button
              variant="outlined"
              onClick={() => {
                setValidationResult(null);
                setModelingData((prev) => ({
                  ...prev,
                  is_final: false,
                }));
              }}
            >
              {t("reset_key")}
            </Button>
          ) : (
            <Button onClick={() => validateFile()}>
              {t("find_diseases_key")}
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}
