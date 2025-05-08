import React, { useEffect } from "react";
import Button from "../../Button";
import { useTranslation } from "react-i18next";
import { startInference, validateInference } from "../../../api/inferenceAPI";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RiImageEditLine } from "react-icons/ri";

export default function ModelingStepThree({ modelingData, setModelingData }) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  // Mutation for starting inference
  const startInferenceMutation = useMutation({
    mutationFn: (imageId) => startInference(imageId),
    onSuccess: (data) => {
      if (data?.id) {
        setModelingData((prev) => ({ ...prev, inference_id: data.id }));
        // Automatically trigger validation after starting inference
        validateInferenceMutation.mutate(data.id);
      }
    },
  });

  // Mutation for validating inference
  const validateInferenceMutation = useMutation({
    mutationFn: (inferenceId) => validateInference(inferenceId),
    onSuccess: (data) => {
      if (data?.status === 1) {
        setModelingData((prev) => ({ ...prev, is_final: true }));
      } else {
        setModelingData((prev) => ({ ...prev, is_final: false }));
      }
    },
  });

  // Effect to trigger inference when image_id changes
  useEffect(() => {
    if (modelingData?.image_id && !modelingData?.inference_id) {
      startInferenceMutation.mutate(modelingData.image_id);
    }
  }, [modelingData?.image_id]);

  // Combined loading state
  const isLoading =
    startInferenceMutation.isPending || validateInferenceMutation.isPending;
  // Combined error state
  const error = startInferenceMutation.error || validateInferenceMutation.error;

  const handleReset = () => {
    queryClient.invalidateQueries(["inference"]);
    setModelingData((prev) => ({
      ...prev,
      inference_id: null,
      image_id: null,
      is_final: false,
    }));
  };

  const handleTryDifferentImage = () => {
    setModelingData((prev) => ({
      category: prev.category,
      selected_file: [],
      category: {},
    }));
  };

  return (
    <div className="flex items-center p-2 bg-gray-50 flex-col gap-4">
      {isLoading ? (
        <div className="flex gap-2 items-center">
          <p>{t("please_wait_validating_key")}</p>
        </div>
      ) : error ? (
        <>
          <p className="text-red-500">
            {error.response?.data?.detail || t("something_went_wrong")}
          </p>
          <Button variant="outlined" onClick={handleReset}>
            {t("reset_key")}
          </Button>
        </>
      ) : modelingData.inference_id && !modelingData.is_final ? (
        <>
          <span>{t("inValid-message")}</span>
          <div className="flex gap-2">
            <Button
              className="flex items-center gap-2"
              onClick={handleTryDifferentImage}
            >
              <RiImageEditLine size={22} />
              {t("try_with_a_different_image_key")}
            </Button>
          </div>
        </>
      ) : (
        <Button
          onClick={() =>
            setModelingData((prev) => ({ ...prev, is_final: true }))
          }
          disabled={!modelingData.inference_id}
        >
          {t("next_key")}
        </Button>
      )}
    </div>
  );
}
