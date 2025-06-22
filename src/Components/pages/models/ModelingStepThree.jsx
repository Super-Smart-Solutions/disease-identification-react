import React, { useEffect, useState } from "react";
import Button from "../../Button";
import { useTranslation } from "react-i18next";
import { startInference, validateInference } from "../../../api/inferenceAPI";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RiImageEditLine } from "react-icons/ri";

export default function ModelingStepThree({ modelingData, setModelingData }) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [locationError, setLocationError] = useState(null);

  // Get user's geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          setLocationError(error.message);
          console.error("Geolocation error:", error);
        }
      );
    } else {
      setLocationError(t("geolocation_not_supported"));
    }
  }, [t]);

  // Mutation for starting inference
  const startInferenceMutation = useMutation({
    mutationFn: ({ imageId, lat, lng }) =>
      startInference({ imageId, lat, lng }),
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
    if (
      modelingData?.image_id &&
      !modelingData?.inference_id &&
      location.lat &&
      location.lng
    ) {
      startInferenceMutation.mutate({
        imageId: modelingData.image_id,
        lat: location.lat,
        lng: location.lng,
      });
    }
  }, [modelingData?.image_id, location.lat, location.lng]);

  // Combined loading state
  const isLoading =
    startInferenceMutation.isPending || validateInferenceMutation.isPending;
  // Combined error state
  const error =
    startInferenceMutation.error ||
    validateInferenceMutation.error ||
    locationError;

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
            {typeof error === "string"
              ? error
              : error.response?.data?.detail || t("something_went_wrong")}
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
          disabled={
            !modelingData.inference_id || !location.lat || !location.lng
          }
        >
          {t("next_key")}
        </Button>
      )}
    </div>
  );
}
