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

// New Deep Analysis flow - posts answers and returns plain text
export const postDeepAnalysis = async ({ answer_1, answer_2, answer_3, locale, inference_id }) => {
  const payload = { answer_1, answer_2, answer_3, locale };
  const response = await axiosInstance.post(`/inferences/${inference_id}/deep-analysis`, payload, {
    responseType: "text",
    headers: { Accept: "text/plain, */*" },
  });
  return response.data; // plain text string
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
