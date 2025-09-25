import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Button from "../../Button";
import { fetchDiseaseById } from "../../../api/diseaseAPI";
import { detectDisease, visualizeInference } from "../../../api/inferenceAPI";
import { GiNotebook } from "react-icons/gi";
import { RiImageEditLine } from "react-icons/ri";
import { useUserData } from "../../../hooks/useUserData";
import { useDispatch } from "react-redux";
import { useReviewForm } from "../../../hooks/features/rating/useReviewForm";

export default function ModelingStepFour({ modelingData, setModelingData }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useUserData();
  const dispatch = useDispatch();
  const { handleOpenModal: openReviewModal } = useReviewForm({
    user,
    dispatch,
    navigate,
  });
  // Fetch disease prediction
  const { data: prediction, isError: isPredictionError } = useQuery({
    queryKey: ["diseasePrediction", modelingData.inference_id],
    queryFn: () => detectDisease(modelingData.inference_id),
    enabled: !!modelingData?.inference_id,
    retry: false,
    staleTime: Infinity,
  });

  // Fetch disease details if prediction is successful
  const { data: diseaseData, isLoading: isDiseaseLoading } = useQuery({
    queryKey: ["diseaseDetails", prediction?.disease_id],
    queryFn: () => fetchDiseaseById(prediction.disease_id),
    enabled: !!prediction?.disease_id,
    staleTime: 60 * 60 * 1000,
    retry: false,
  });

  // Fetch visualization if prediction is successful
  const { data: visualization } = useQuery({
    queryKey: ["visualization", modelingData.inference_id],
    queryFn: async () => {
      const result = await visualizeInference(modelingData.inference_id);

      if (result && !(prediction?.status < 0)) {
        setTimeout(() => {
          openReviewModal();
        }, 6000);
      }
      return result;
    },
    enabled: !!modelingData?.inference_id && !!prediction?.disease_id,
    staleTime: 60 * 60 * 1000,
    retry: false,
  });

  const isHealthy = prediction?.status === 2 && !prediction?.disease_id;
  const predictionFailed =
    prediction !== undefined && (prediction?.status !== 2 || isPredictionError);
  const confidenceScore = prediction?.confidence_level * 100;
  const visualizationUrl = visualization?.attention_map_url;

  const handleTryDifferentImage = () => {
    setModelingData((prev) => ({
      ...prev,
      selected_file: [],
      image_id: null,
      inference_id: null,
      is_final: false,
      is_deep: false,
      deep_analysis_result: null,
    }));
  };

  const handleDeepAnalysis = () => {
    setModelingData((prev) => ({ ...prev, is_deep: true, disease_id: prediction?.disease_id ?? null, }));
  };

  const navigateToDatabase = () => {
    const diseaseId = diseaseData?.id;
    const plantId = modelingData?.category?.value;

    if (!diseaseId) {
      console.warn("Disease ID is missing. Navigation cancelled.");
      return; // Stop navigation if disease ID is not valid
    }

    const query = new URLSearchParams();

    query.set("disease_id", diseaseId);
    if (plantId) query.set("plant_id", plantId);

    navigate(`/database?${query.toString()}`);
  };

  if (!modelingData?.selected_file?.length) {
    return <div>{t("no_image_selected")}</div>;
  }

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
          {prediction?.status !== -2 && (
            <div className="p-4 bg-gray-100 rounded-lg flex flex-col  gap-4 items-center ">
              <div className="font-medium">
                {t("category_key")}: {modelingData?.category?.label}
              </div>

              {isDiseaseLoading || !prediction ? (
                <div className="space-y-3">
                  <div className="h-4 w-40 bg-gray-300 rounded animate-pulse" />
                  <div className="h-4 w-48 bg-gray-300 rounded animate-pulse" />
                  <div className="h-10 w-56 bg-gray-300 rounded animate-pulse mx-auto" />
                </div>
              ) : (
                <div className="space-y-3">
                  {t("selected_disease")}:{" "}
                  {isHealthy
                    ? t("healthy_key")
                    : t(`diseases.${diseaseData?.english_name}`, {
                        defaultValue: diseaseData?.english_name || t("loading"),
                      })}
                  <span className=" block">{`${t("confidence_level")} : ${
                    confidenceScore !== null && `${confidenceScore.toFixed(2)}%`
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
          )}


          {/* Action Buttons */}
          {predictionFailed ? (
            <div className="flec flex-col items-center ">
{/*              <div className="text-red-500 text-center mb-2">
                {t("detection_inconclusive_message")}
              </div>*/}
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
