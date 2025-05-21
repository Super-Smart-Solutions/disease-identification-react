import axiosInstance from "../utils/axiosInstance";

// Base endpoint for plants
// const PLANT_ENDPOINT = "/plants"; // Ensure this matches your API structure

const PLANT_ENDPOINT = import.meta.env.VITE_PLANT_ENDPOINT;

// Fetch all plants
export const fetchPlants = async (page = 1, pageSize = 10) => {
  const response = await axiosInstance.get(PLANT_ENDPOINT, {
    params: {
      page,
      size: pageSize
    }
  });
  return response.data;
};

// Fetch a single plant by ID
export const fetchPlantById = async (plantId) => {
  const response = await axiosInstance.get(`${PLANT_ENDPOINT}/${plantId}`);
  return response.data;
};

// Fetch a plant by name
export const fetchPlantByName = async (name) => {
  const response = await axiosInstance.get(PLANT_ENDPOINT, {
    params: { name },
  });
  return response.data;
};

// Add a new plant
export const addPlant = async (plantData) => {
  const response = await axiosInstance.post(PLANT_ENDPOINT, plantData);
  return response.data;
};

// Update an existing plant
export const updatePlant = async (plantId, plantData) => {
  const response = await axiosInstance.put(`${PLANT_ENDPOINT}/${plantId}`, plantData);
  return response.data;
};

export const deletePlant = async (plantId) => {
  const response = await axiosInstance.delete(`${PLANT_ENDPOINT}/${plantId}`);
  return response.data;
};
// Fetch diseases associated with a plant
export const fetchDiseasesByPlant = async (plantId) => {
  const response = await axiosInstance.get(`${PLANT_ENDPOINT}/${plantId}/diseases`);
  return response.data;
};
