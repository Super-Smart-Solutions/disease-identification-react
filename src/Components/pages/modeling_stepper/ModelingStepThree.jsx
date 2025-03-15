import React, { useState, useEffect, useRef } from "react";
import Button from "../../Button";
import { useTranslation } from "react-i18next";
import { startInference, validateInference } from "../../../api/inferenceAPI";

export default function ModelingStepThree({ modelingData, setModelingData }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notValid, setNotValid] = useState(false);
  const inferenceStarted = useRef(false); // Prevents duplicate calls

  useEffect(() => {
    if (!modelingData?.image_id || modelingData?.inference_id || inferenceStarted.current) {
      return;
    }

    inferenceStarted.current = true; // Mark inference as started
    setLoading(true);
    setError("");

    const controller = new AbortController(); // To handle cleanup

    const runInference = async () => {
      try {
        // Start inference
        const inferenceResponse = await startInference(modelingData.image_id, { signal: controller.signal });
        const inferenceId = inferenceResponse?.id;

        if (!inferenceId) throw new Error("Failed to start inference");

        setModelingData((prev) => ({
          ...prev,
          inference_id: inferenceId,
        }));

        // Validate inference
        const validationResponse = await validateInference(inferenceId, { signal: controller.signal });
        console.log("val res: ", validationResponse.status);
        if (validationResponse?.status === 1) {
          setModelingData((prev) => ({
            ...prev,
            is_final: true,
          }));
          setLoading(false);
        } 
        else {
          setNotValid(true);
          setLoading(false);
          console.log(notValid);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err.message || "Something went wrong");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    runInference();

    return () => {
      controller.abort(); // Cleanup API requests on unmount
    };
  }, [modelingData?.image_id, modelingData?.inference_id, setModelingData]);

  return (
    <div className="flex items-center p-2 bg-gray-50 flex-col gap-4">
      {loading===true ? (
        <div className="flex gap-2 items-center">
          <p>{t("please_wait_validating_key")}</p>
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      ) : error ? (
        <>
          <p className="text-red-500">{error}</p>
          <Button
            variant="outlined"
            onClick={() => {
              setError("");
              inferenceStarted.current = false; // Allow retry
              setModelingData((prev) => ({
                ...prev,
                inference_id: null,
                is_final: false,
              }));
            }}
          >
            {t("reset_key")}
          </Button>
        </>
      ) : notValid===true ? (
        <>
          <span>{`${t("inValid-message")}`}</span>
          <div>
            <Button
              onClick={() => {
                setModelingData((prev) => ({
                  ...prev,
                  category: {},
                  selected_file: [],
                  image_id: null,
                  inference_id: null,
                  is_deep: false,
                  errorMessage: "",
                  is_final: false,
                }));
              }}
            >
              {t("try with a different image")}
            </Button>
          </div>
        </>
      ) : (
        <Button
          onClick={() =>
            setModelingData((prev) => ({
              ...prev,
              is_final: true,
            }))
          }
        >
          {t("next_key")}
        </Button>
      )}
    </div>
  );
}
