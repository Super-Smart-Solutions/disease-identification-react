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
export const startInference = async (imageId) => {
  const response = await axiosInstance.post(`${INFERENCE_ENDPOINT}?image_id=${imageId}`);
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

// Get deep analysis results for inference
export const analyzeInference = async (inferenceId) => {
  const response = await axiosInstance.post(`${INFERENCE_ENDPOINT}/${inferenceId}/deep-analysis`);
  return response.data;
};
// Get aggregates
export const getAggregates = async (start_date, end_date) => {
  const response = await axiosInstance.post(`${INFERENCE_ENDPOINT}/aggregates`, {
    start_date,
    end_date,
  });
  return response.data;
};
