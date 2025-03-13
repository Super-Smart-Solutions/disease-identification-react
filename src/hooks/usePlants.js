import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchPlants, fetchPlantById, fetchPlantByName, addPlant, fetchDiseasesByPlant } from "../api/plantAPI";

// Hook to get all plants
export const usePlants = () => {
  return useQuery({
    queryKey: ["plants"],
    queryFn: fetchPlants,
  });
};

// Hook to get a plant by ID
export const usePlantById = (plantId) => {
  return useQuery({
    queryKey: ["plant", plantId],
    queryFn: () => fetchPlantById(plantId),
    enabled: !!plantId, // Only run if plantId is available
  });
};

// Hook to get a plant by name
export const usePlantByName = (name) => {
  return useQuery({
    queryKey: ["plantByName", name],
    queryFn: () => fetchPlantByName(name),
    enabled: !!name, // Only run if name is provided
  });
};

// Hook to add a new plant
export const useAddPlant = () => {
  return useMutation({
    mutationFn: addPlant,
  });
};

// Hook to get diseases for a specific plant
export const useDiseasesByPlant = (plantId) => {
  return useQuery({
    queryKey: ["plantDiseases", plantId],
    queryFn: () => fetchDiseasesByPlant(plantId),
    enabled: !!plantId, // Only run if plantId is available
  });
};
