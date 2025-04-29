import axiosInstance from "../utils/axiosInstance";

const SOIL_ENDPOINT = import.meta.env.VITE_SOIL_ENDPOINT;

// 🌾 Crops

// Fetch crops with optional query parameters
export const fetchCrops = async (params = {}) => {
  const response = await axiosInstance.get('/api/soil/crops', {
    params,
  });
  return response.data;
};


// Fetch a single crop by ID
export const fetchCropById = async (cropId) => {
    const response = await axiosInstance.get(`${SOIL_ENDPOINT}/crops/${cropId}`);
    return response.data;
};

// Create a new crop
export const createCrop = async (cropData) => {
    const response = await axiosInstance.post(`${SOIL_ENDPOINT}/crops`, cropData);
    return response.data;
};

// Update a crop
export const updateCrop = async (cropId, cropData) => {
    const response = await axiosInstance.put(`${SOIL_ENDPOINT}/crops/${cropId}`, cropData);
    return response.data;
};

// Delete a crop
export const deleteCrop = async (cropId) => {
    const response = await axiosInstance.delete(`${SOIL_ENDPOINT}/crops/${cropId}`);
    return response.data;
};

// 🧪 Soil Assessments

// Assess soil
export const assessSoil = async (assessmentData) => {
    const response = await axiosInstance.post(`${SOIL_ENDPOINT}/assess`, assessmentData);
    return response.data;
};

// Get all soil assessments
export const fetchSoilAssessments = async () => {
    const response = await axiosInstance.get(`${SOIL_ENDPOINT}/assessments`);
    return response.data;
};
