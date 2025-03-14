import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom"; // Import for navigation
import Button from "../../Button";
import { fetchDiseaseById } from "../../../api/diseaseAPI";
import { detectDisease, visualizeInference } from "../../../api/inferenceAPI";

export default function ModelingStepFour({ modelingData, setModelingData }) {
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

        console.log("Sending prediction request...");
        const response = await detectDisease(modelingData.inference_id);

        if (response?.status === 2) {
          console.log("Prediction Success:", response);
          setConfidenceScore(response.confidence_level * 100);
          setPredictionFailed(false);

          // Fetch disease details
          const diseaseDetails = await fetchDiseaseById(response.disease_id);
          setDiseaseData(diseaseDetails); // Store full disease data

          // Fetch visualization (attention map)
          const visualizationResponse = await visualizeInference(modelingData.inference_id);
          if (visualizationResponse?.attention_map_url) {
            setVisualizationUrl(visualizationResponse.attention_map_url);
          }
        } else {
          console.warn("Prediction Failed:", response);
          setPredictionFailed(true);
          setModelingData((prev) => ({
            ...prev,
            is_deep: true,
          }));
        }
      } catch (error) {
        console.error("Error in prediction request:", error);
      }
    };

    fetchPrediction();
  }, [modelingData?.inference_id]);

  return (
    <div>
      {modelingData?.selected_file.map((file, index) => (
        <div
          key={index}
          className="flex items-center p-2 border rounded-lg bg-gray-50 flex-col gap-4"
        >
          {/* Display Attention Map if available, else show uploaded image */}
          <img
            src={visualizationUrl || URL.createObjectURL(file)}
            alt={file.name}
            className="w-300 h-80 object-cover rounded-md"
          />
          <span>{t("uploaded_image_key")}</span>

          <div className="flex flex-col bg-primaryGray p-4 rounded-2xl">
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
                <span>{`${t("selected_disease")} : ${
                  diseaseData?.english_name || t("loading_key")
                }`}</span>
                <span>{`${t("confidence_level")} : ${
                  confidenceScore !== null ? `${confidenceScore.toFixed(2)}%` : t("loading_key")
                }`}</span>
                <Button
                  onClick={() =>
                    navigate("/database", {
                      state: {
                        selectedPlant: modelingData?.category, // Pass selected plant
                        selectedDisease: diseaseData, // Pass full disease object
                      },
                    })
                  }
                >
                  {t("read_more_about_disease_key")}
                </Button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
