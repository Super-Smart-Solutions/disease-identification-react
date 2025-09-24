import axiosInstance from "../utils/axiosInstance";

const INFERENCE_ENDPOINT = "/inferences";

// Get inferences
export const getInferences = async ({ size = 10, page = 1 }) => {
  const params = {
    pageSize: size,
    pageNumber: page,
  };
  const response = await axiosInstance.get(`${INFERENCE_ENDPOINT}`, { params });
  return response.data;
};
export const updateInferenceVerify = async (id) => {
  const response = await axiosInstance.put(
    `${INFERENCE_ENDPOINT}/${id}/toggle-approved`
  );
  return response.data;
};
// Start inference on an uploaded image
export const startInference = async ({ imageId, lat, lng }) => {
  const params = new URLSearchParams();
  params.append("image_id", imageId);

  if (lat != null && lng != null) {
    params.append("lat", lat.toString());
    params.append("lng", lng.toString());
  }

  const response = await axiosInstance.post(
    `${INFERENCE_ENDPOINT}?${params.toString()}`
  );
  return response.data;
};


// Validate inference status
export const validateInference = async (inferenceId) => {
  const response = await axiosInstance.post(`${INFERENCE_ENDPOINT}/${inferenceId}/validate`);
  return response.data;
};

// Run disease detection on an inference result
export const detectDisease = async (inferenceId) => {
  const response = await axiosInstance.post(`${INFERENCE_ENDPOINT}/${inferenceId}/detect`);
  return response.data;
};

// Get visualization (attention map) for inference
export const visualizeInference = async (inferenceId) => {
  const response = await axiosInstance.post(`${INFERENCE_ENDPOINT}/${inferenceId}/attention`);
  return response.data;
};

// Get deep analysis results for inference (legacy endpoint)
export const analyzeInference = async (inferenceId) => {
  const response = await axiosInstance.post(`${INFERENCE_ENDPOINT}/${inferenceId}/deep-analysis`);
  return response.data;
};

// Deep Analysis flow 
export const postDeepAnalysis = async ({ inference_id, locale, questions = [], answers = [] }) => {
  // Create an object mapping questions to their corresponding answers
  const answersMap = questions.reduce((acc, question, index) => {
    acc[question] = answers[index] || null;
    return acc;
  }, {});

  const payload = { 
    locale,
    answers: answersMap
  };

  const response = await axiosInstance.post(
    `/inferences/${inference_id}/deep-analysis`,
    payload,
    {
      responseType: "json",
      headers: { Accept: "application/json" },
    }
  );
  // Expecting JSON with fields like: deep_analysis_reasoning, deep_analysis_visual_indicators, attention_map_url, disease_id
  // Fallback: if server returns text/plain, wrap it into an object
  const data = response?.data;
  if (typeof data === "string") {
    return { deep_analysis_reasoning: data };
  }
  return data;
};

// Get aggregates
export const getAggregates = async (start_date, end_date) => {
  const response = await axiosInstance.post(`${INFERENCE_ENDPOINT}/aggregates`, {
    start_date,
    end_date,
  });
  return response.data;
};

export const deleteInference = async (id) => {
  const response = await axiosInstance.delete(`${INFERENCE_ENDPOINT}/${id}`);
  return response.data;
};
