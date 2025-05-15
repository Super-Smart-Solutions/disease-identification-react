import axiosInstance from "../utils/axiosInstance";

const FARM_ENDPOINT = import.meta.env.VITE_FARM_ENDPOINT;

// Fetch all farms (with pagination if supported)
export const fetchFarms = async ({ page = 1, pageSize = 10 }) => {
    const response = await axiosInstance.get(FARM_ENDPOINT, {
        params: {
            page,
            size: pageSize,
        },
    });
    return response.data;
};

// Fetch a single farm by ID
export const fetchFarmById = async (farmId) => {
    const response = await axiosInstance.get(`${FARM_ENDPOINT}/${farmId}`);
    return response.data;
};

// Create a new farm
export const addFarm = async (farmData) => {
    const response = await axiosInstance.post(FARM_ENDPOINT, farmData);
    return response.data;
};

// Update an existing farm
export const updateFarm = async (farmId, farmData) => {
    const response = await axiosInstance.put(`${FARM_ENDPOINT}/${farmId}`, farmData);
    return response.data;
};

// Delete a farm
export const deleteFarm = async (farmId) => {
    const response = await axiosInstance.delete(`${FARM_ENDPOINT}/${farmId}`);
    return response.data;
};
