import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom"; // Import for navigation
import Button from "../../Button";
import { fetchDiseaseById } from "../../../api/diseaseAPI";
import {
  analyzeInference,
  visualizeInference,
} from "../../../api/inferenceAPI";
import { RiImageEditLine } from "react-icons/ri";
import { GiNotebook } from "react-icons/gi";

export default function DeepAnalysisStep({ modelingData, setModelingData }) {
  const { t } = useTranslation();
  const navigate = useNavigate(); // Navigation function

  const [diseaseData, setDiseaseData] = useState(null);
  const [confidenceScore, setConfidenceScore] = useState(null);
  const [predictionFailed, setPredictionFailed] = useState(false);
  const [visualizationUrl, setVisualizationUrl] = useState(null); // Visualization image URL

  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        if (!modelingData?.inference_id) return;

        const response = await analyzeInference(modelingData.inference_id);

        if (response?.status === 3) {
          setConfidenceScore(response.confidence_level * 100);
          setPredictionFailed(false);

          // Fetch disease details
          if (response.disease_id) {
            const diseaseDetails = await fetchDiseaseById(response.disease_id);
            setDiseaseData(diseaseDetails); // Store full disease data
          }
        } else {
          console.warn("analysis Failed:", response);
          setPredictionFailed(true);
          setModelingData((prev) => ({
            ...prev,
            is_deep: true,
          }));
        }

        // Fetch visualization (attention map)
        const visualizationResponse = await visualizeInference(
          modelingData.inference_id
        );
        if (visualizationResponse?.attention_map_url) {
          setVisualizationUrl(visualizationResponse.attention_map_url);
        }
      } catch (error) {
        console.error("Error in analysis request:", error);
      }
    };

    fetchPrediction();
  }, [modelingData?.inference_id]);
  const navigateToDatabase = () => {
    navigate("/database", {
      state: {
        selectedPlantName: modelingData?.category,
        selectedDisease: diseaseData,
      },
    });
  };
  const handleTryDifferentImage = () => {
    setModelingData((prev) => ({
      category: prev.category,
      selected_file: [],
    }));
  };

  return (
    <div>
      {modelingData?.selected_file.map((file, index) => (
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
            <>
              <span>{t("loading image.")}</span>
            </>
          )}

          <div className="flex flex-col  p-4 rounded-2xl">
            <span>{`${t("category_key")} : ${
              modelingData?.category?.label
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
                  {`${t("selected_disease")} : ${t(
                    `diseases.${diseaseData?.english_name}`,
                    {
                      defaultValue:
                        diseaseData?.english_name || t("loading_key"),
                    }
                  )}`}
                </span>

                <span>{`${t("confidence_level")} : ${
                  confidenceScore !== null
                    ? `${confidenceScore.toFixed(2)}%`
                    : t("loading_key")
                }`}</span>
                <Button
                  className="flex items-center gap-2 mx-auto mt-2"
                  onClick={navigateToDatabase}
                  variant="outlined"
                >
                  <GiNotebook size={22} />
                  {t("read_more_about_disease_key")}
                </Button>
              </>
            )}
          </div>

          {predictionFailed ? (
            <></>
          ) : (
            <>
              <div>
                <div className="flex gap-2">
                  <Button
                    className="flex items-center gap-2"
                    onClick={handleTryDifferentImage}
                    variant="outlined"
                  >
                    <RiImageEditLine size={22} />
                    {t("try_with_a_different_image_key")}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
