import apiClient from "./apiClient";

// Start inference process
export const startInference = async (imageId) => {
  try {
    const response = await apiClient.post("/inference/", { image_id: imageId });
    return response.data;
  } catch (error) {
    console.error("Error starting inference:", error);
    throw error;
  }
};

// Validate inference progress
export const validateInference = async (inferenceId) => {
  try {
    const response = await apiClient.get(`/inference/${inferenceId}/validate`);
    return response.data;
  } catch (error) {
    console.error("Error validating inference:", error);
    throw error;
  }
};

// Run detection
export const runDetection = async (inferenceId) => {
  try {
    const response = await apiClient.get(`/inference/${inferenceId}/detect`);
    return response.data;
  } catch (error) {
    console.error("Error running detection:", error);
    throw error;
  }
};

// Get attention map visualization
export const getVisualization = async (inferenceId) => {
  try {
    const response = await apiClient.get(`/inference/${inferenceId}/visualize`);
    return response.data;
  } catch (error) {
    console.error("Error fetching visualization:", error);
    throw error;
  }
};

// Get detailed analysis
export const getAnalysis = async (inferenceId) => {
  try {
    const response = await apiClient.get(`/inference/${inferenceId}/analysis`);
    return response.data;
  } catch (error) {
    console.error("Error fetching analysis:", error);
    throw error;
  }
};
