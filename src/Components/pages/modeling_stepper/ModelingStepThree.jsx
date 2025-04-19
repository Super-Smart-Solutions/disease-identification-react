import React, { useState, useEffect, useRef } from "react";
import Button from "../../Button";
import { useTranslation } from "react-i18next";
import { startInference, validateInference } from "../../../api/inferenceAPI";

export default function ModelingStepThree({ modelingData, setModelingData }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notValid, setNotValid] = useState(false);
  const inferenceStarted = useRef(false); // Prevents duplicate API calls

  useEffect(() => {
    // Prevent API calls if:
    // - No image_id is available
    // - Inference has already started (inference_id exists)
    // - API request has already been initiated
    if (
      !modelingData?.image_id ||
      modelingData?.inference_id ||
      inferenceStarted.current
    ) {
      return;
    }

    inferenceStarted.current = true; // Mark inference as started
    setLoading(true);
    setError(null);
    const controller = new AbortController(); // To handle cleanup

    const runInference = async () => {
      try {
        // Step 1: Start inference by sending image_id to API
        const inferenceResponse = await startInference(modelingData.image_id, {
          signal: controller.signal,
        });

        // Extract inference ID from API response
        const inferenceId = inferenceResponse?.id;
        if (!inferenceId) throw new Error("Failed to start inference");

        // Update state with new inference ID
        setModelingData((prev) => ({
          ...prev,
          inference_id: inferenceId,
        }));

        // Step 2: Validate inference by checking its status
        const validationResponse = await validateInference(inferenceId, {
          signal: controller.signal,
        });

        // If validation is successful (status === 1), mark modeling as final
        if (validationResponse?.status === 1) {
          setModelingData((prev) => ({
            ...prev,
            is_final: true,
          }));
          setLoading(false);
        } else {
          // If validation fails, mark as not valid
          setNotValid(true);
          setLoading(false);
        }
      } catch (err) {
        // Handle API errors
        setError(err.response?.data?.detail || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    runInference();

    return () => {
      controller.abort(); // Cleanup: Cancel API request if component unmounts
    };
  }, [modelingData?.image_id, modelingData?.inference_id, setModelingData]);

  return (
    <div className="flex items-center p-2 bg-gray-50 flex-col gap-4">
      {/* Show loading spinner while inference is in progress */}
      {loading === true && !error ? (
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
      ) : error ? (
        // Show error message and reset button if an error occurs
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
                image_id: null,
                is_final: false,
              }));
            }}
          >
            {t("reset_key")}
          </Button>
        </>
      ) : notValid === true ? (
        // Show validation failure message and retry button
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
        // Show "Next" button when inference is successful
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
