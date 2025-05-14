import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Button from "../../Button";
import { fetchDiseaseById } from "../../../api/diseaseAPI";
import { detectDisease, visualizeInference } from "../../../api/inferenceAPI";
import { GiNotebook } from "react-icons/gi";
import { DiGoogleAnalytics } from "react-icons/di";
import { RiImageEditLine } from "react-icons/ri";

export default function ModelingStepFour({ modelingData, setModelingData }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Fetch disease prediction
  const {
    data: prediction,
    isLoading: isPredicting,
    error: predictionError,
    isError: isPredictionError,
  } = useQuery({
    queryKey: ["diseasePrediction", modelingData.inference_id],
    queryFn: () => detectDisease(modelingData.inference_id),
    enabled: !!modelingData?.inference_id,
    retry: false,
    staleTime: Infinity,
  });

  // Fetch disease details if prediction is successful
  const {
    data: diseaseData,
    isLoading: isDiseaseLoading,
    isError: isDiseaseError,
  } = useQuery({
    queryKey: ["diseaseDetails", prediction?.disease_id],
    queryFn: () => fetchDiseaseById(prediction.disease_id),
    enabled: !!prediction?.disease_id,
    staleTime: 60 * 60 * 1000,
    retry: false,
  });

  // Fetch visualization if prediction is successful
  const {
    data: visualization,
    isLoading: isVisualizing,
    isError: isVisualizationError,
  } = useQuery({
    queryKey: ["visualization", modelingData.inference_id],
    queryFn: () => visualizeInference(modelingData.inference_id),
    enabled: !!modelingData?.inference_id && !!prediction?.disease_id,
    staleTime: 60 * 60 * 1000,
    retry: false,
  });

  const isHealthy = prediction?.status === 2 && !prediction?.disease_id;
  const predictionFailed = prediction?.status !== 2 || isPredictionError;
  const confidenceScore = prediction?.confidence_level * 100;
  const visualizationUrl = visualization?.attention_map_url;

  const handleTryDifferentImage = () => {
    setModelingData((prev) => ({
      category: prev.category,
      selected_file: [],
      category: {},
    }));
  };

  const handleDeepAnalysis = () => {
    setModelingData((prev) => ({ ...prev, is_deep: true }));
  };

  const navigateToDatabase = () => {
    navigate("/database", {
      state: {
        selectedPlantName: modelingData?.category,
        selectedDisease: diseaseData,
      },
    });
  };

  if (!modelingData?.selected_file?.length) {
    return <div>{t("no_image_selected")}</div>;
  }
  console.log(predictionError);

  return (
    <div className="space-y-4">
      {modelingData.selected_file.map((file, index) => (
        <div key={index} className="p-4 border rounded-lg bg-gray-50 space-y-4">
          {/* Image Display */}
          <div className="flex flex-col items-center">
            <img
              loading="lazy"
              src={visualizationUrl || URL.createObjectURL(file)}
              alt={file.name}
              className="h-80 object-contain rounded-md transition duration-300"
            />
            <span className="text-sm text-gray-500 mt-2">
              {t("uploaded_image_key")}
            </span>
          </div>

          {/* Results Panel */}
          <div className="p-4 bg-gray-100 rounded-lg flex flex-col  gap-4 items-center ">
            <div className="font-medium">
              {t("category_key")}: {modelingData?.category?.label}
            </div>

            {isPredicting ? (
              <span>{t("analyzing_image")}</span>
            ) : isPredictionError ? (
              <div className="text-red-500">
                {t("prediction_failed_message_key")}:{" "}
                {predictionError.response?.data?.detail}
              </div>
            ) : (
              <div className="space-y-3">
                {t("selected_disease")}:{" "}
                {isHealthy
                  ? t("healthy")
                  : t(`diseases.${diseaseData?.english_name}`, {
                      defaultValue: diseaseData?.english_name || t("loading"),
                    })}
                <span className=" block">{`${t("confidence_level")} : ${
                  confidenceScore !== null
                    ? `${confidenceScore.toFixed(2)}%`
                    : t("loading_key")
                }`}</span>
                {confidenceScore && !isHealthy && diseaseData && (
                  <Button
                    className="flex items-center gap-2 mx-auto mt-2"
                    onClick={navigateToDatabase}
                  >
                    <GiNotebook size={22} />
                    {t("read_more_about_disease_key")}
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {predictionFailed ? (
            <div className="flec flex-col items-center ">
              <div className="text-red-500 text-center mb-2">
                {t("detection_inconclusive_message")}
              </div>
              <div className=" flex gap-2 justify-center">
                <Button onClick={handleDeepAnalysis}>
                  {t("go_to_deep_analysis_key")}
                </Button>
                <Button
                  className="flex items-center gap-2"
                  onClick={handleTryDifferentImage}
                >
                  <RiImageEditLine size={22} />
                  {t("try_with_a_different_image_key")}
                </Button>
              </div>
            </div>
          ) : (
            <Button
              className="flex items-center gap-2"
              onClick={handleTryDifferentImage}
            >
              <RiImageEditLine size={22} />
              {t("try_with_a_different_image_key")}
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}
