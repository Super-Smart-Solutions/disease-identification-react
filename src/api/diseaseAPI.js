import axiosInstance from "../utils/axiosInstance";

const DISEASE_ENDPOINT = import.meta.env.VITE_DISEASE_ENDPOINT;

// Fetch all diseases
export const fetchDiseases = async ({ page = 1, pageSize = 10 }) => {
  const response = await axiosInstance.get(DISEASE_ENDPOINT, {
    params: {
      pageNumber: page,
      pageSize: pageSize
    }
  });
  return response.data;
};

// Fetch a disease by ID
export const fetchDiseaseById = async (diseaseId) => {
  const response = await axiosInstance.get(`${DISEASE_ENDPOINT}/${diseaseId}`);
  return response.data;
};

// Fetch a disease by name
export const fetchDiseaseByName = async (name) => {
  const response = await axiosInstance.get(DISEASE_ENDPOINT, {
    params: { name },
  });
  return response.data;
};

// Add a new disease
export const addDisease = async (diseaseData) => {
  const response = await axiosInstance.post(DISEASE_ENDPOINT, diseaseData);
  return response.data;
};

export const fetchPlantsByDisease = async (diseaseId) => {
  const response = await axiosInstance.get(`${DISEASE_ENDPOINT}/${diseaseId}/plants`);
  return response.data;
};
export const updateDisease = async (diseaseId, updatedData) => {
  const response = await axiosInstance.put(`${DISEASE_ENDPOINT}/${diseaseId}`, updatedData);
  return response.data;
};

// Delete a disease by ID
export const deleteDisease = async (diseaseId) => {
  const response = await axiosInstance.delete(`${DISEASE_ENDPOINT}/${diseaseId}`);
  return response.data;
};
