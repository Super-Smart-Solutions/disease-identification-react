import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Button from "../../Button";
import { fetchDiseaseById } from "../../../api/diseaseAPI";
import {
  analyzeInference,
  visualizeInference,
} from "../../../api/inferenceAPI";
import { RiImageEditLine } from "react-icons/ri";
import { GiNotebook } from "react-icons/gi";
import { useDispatch } from "react-redux";
import { useReviewForm } from "../../../hooks/features/rating/useReviewForm";
import { useUserData } from "../../../hooks/useUserData";

export default function DeepAnalysisStep({ modelingData, setModelingData }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useUserData();
  const dispatch = useDispatch();
  const { handleOpenModal: openReviewModal } = useReviewForm({
    user,
    dispatch,
    navigate,
  });

  const [analysisResponse, setAnalysisResponse] = useState(null);
  const [diseaseData, setDiseaseData] = useState(null);
  const [confidenceScore, setConfidenceScore] = useState(null);
  const [predictionFailed, setPredictionFailed] = useState(false);
  const [visualizationUrl, setVisualizationUrl] = useState(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        if (!modelingData?.inference_id) return;

        setAnalysisResponse(null);
        setDiseaseData(null);
        setConfidenceScore(null);
        setPredictionFailed(false);
        setVisualizationUrl(null);

        const response = await analyzeInference(modelingData.inference_id);

        setAnalysisResponse(response);

        if (response?.status === 3) {
          setConfidenceScore(
            typeof response.confidence_level === "number"
              ? response.confidence_level * 100
              : null
          );
          setPredictionFailed(false);

          if (response.disease_id) {
            try {
              const diseaseDetails = await fetchDiseaseById(response.disease_id);
              setDiseaseData(diseaseDetails);
            } catch (err) {
              console.error("Failed to fetch disease details:", err);
            }
          }
        } else {
          console.warn("analysis Failed:", response);
          setPredictionFailed(true);
          setModelingData((prev) => ({
            ...prev,
            is_deep: true,
          }));
        }

        try {
          const visualizationResponse = await visualizeInference(
            modelingData.inference_id
          );
          if (visualizationResponse?.attention_map_url) {
            setVisualizationUrl(visualizationResponse.attention_map_url);
          }
        } catch (err) {
          console.warn("Failed to fetch visualization:", err);
        }

        if (response) {
          timeoutRef.current = setTimeout(() => {
            openReviewModal();
          }, 2000);
        }
      } catch (error) {
        console.error("Error in analysis request:", error);
      }
    };

    fetchPrediction();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelingData?.inference_id]); // intentionally minimal deps; reviewForm/openReviewModal assumed stable

  const isAnalyzing =
    analysisResponse === null && !!modelingData?.inference_id && !predictionFailed;
  const isHealthy = analysisResponse?.status === 3 && !analysisResponse?.disease_id;
  const isSuccess = analysisResponse?.status === 3;

  const diseaseLabel = (() => {
    if (isAnalyzing) return t("loading_key");
    if (isHealthy) return t("Healthy");
    if (diseaseData?.english_name) {
      return t(`diseases.${diseaseData.english_name}`, {
        defaultValue: diseaseData.english_name,
      });
    }
    return t("loading_key");
  })();

  const navigateToDatabase = () => {
    const diseaseId = diseaseData?.id;
    const plantId = modelingData?.category?.value;

    if (!diseaseId) {
      console.warn("Disease ID is missing. Navigation cancelled.");
      return;
    }

    const query = new URLSearchParams();
    query.set("disease_id", diseaseId);
    if (plantId) query.set("plant_id", plantId);

    navigate(`/database?${query.toString()}`);
  };

  const handleTryDifferentImage = () => {
    setModelingData((prev) => ({
      category: prev.category,
      selected_file: [],
      category: {},
    }));
  };

  return (
    <div>
      {modelingData?.selected_file?.map((file, index) => (
        <div
          key={index}
          className="flex items-center p-2 border rounded-lg bg-gray-50 flex-col gap-4"
        >
          {visualizationUrl ? (
            <>
              <img
                src={visualizationUrl}
                alt={file.name}
                className="w-300 h-80 object-cover rounded-md"
              />
              <span>{t("uploaded_image_key")}</span>
            </>
          ) : (
            <span>{t("loading image.")}</span>
          )}

          <div className="flex flex-col p-4 rounded-2xl">
            <span>{`${t("category_key")} : ${
              modelingData?.category?.label ?? ""
            }`}</span>

            {predictionFailed ? (
              <>
                <span className="text-red-500">
                  {t("detection_inconclusive_message")}
                </span>
                <Button
                  onClick={() => {
                    setModelingData((prev) => ({
                      ...prev,
                      is_deep: true,
                    }));
                  }}
                >
                  {t("go_to_deep_analysis_key")}
                </Button>
              </>
            ) : (
              <>
                <span>
                  {`${t("selected_disease")} : ${diseaseLabel}`}
                </span>

                <span>{`${t("confidence_level")} : ${
                  analysisResponse
                    ? confidenceScore !== null
                      ? `${confidenceScore.toFixed(2)}%`
                      : t("loading_key")
                    : t("loading_key")
                }`}</span>

                {isSuccess &&
                  analysisResponse?.disease_id &&
                  diseaseData?.id && (
                    <Button
                      className="flex items-center gap-2 mx-auto mt-2"
                      onClick={navigateToDatabase}
                    >
                      <GiNotebook size={22} />
                      {t("read_more_about_disease_key")}
                    </Button>
                  )}
              </>
            )}
          </div>

          {!predictionFailed && (
            <div>
              <div className="flex gap-2">
                <Button
                  className="flex items-center gap-2"
                  onClick={handleTryDifferentImage}
                >
                  <RiImageEditLine size={22} />
                  {t("try_with_a_different_image_key")}
                </Button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
