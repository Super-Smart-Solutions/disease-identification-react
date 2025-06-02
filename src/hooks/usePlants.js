import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchPlants,
  fetchPlantById,
  fetchPlantByName,
  addPlant,
  updatePlant,
  fetchDiseasesByPlant,
  deletePlant
} from "../api/plantAPI";
import { fetchPlantsByDisease } from "../api/diseaseAPI";


export const usePlants = (page = 1, pageSize = 10) => {
  return useQuery({
    queryKey: ["plants", page, pageSize],
    queryFn: () => fetchPlants(page, pageSize),
    keepPreviousData: true
  });
};


export const usePlantById = (plantId) => {
  return useQuery({
    queryKey: ["plant", plantId],
    queryFn: () => fetchPlantById(plantId),
    enabled: !!plantId,
  });
};


export const usePlantByName = (name) => {
  return useQuery({
    queryKey: ["plantByName", name],
    queryFn: () => fetchPlantByName(name),
    enabled: !!name,
  });
};


export const useAddPlant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addPlant,
    onSuccess: () => {
      queryClient.invalidateQueries(["plants"]);
    }
  });
};


export const useUpdatePlant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) => updatePlant(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["plants"]);
    }
  });
};


export const useDeletePlant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deletePlant(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["plants"]);
    },
  });
};


export const useDiseasesByPlant = (plantId) => {
  return useQuery({
    queryKey: ["plantDiseases", plantId],
    queryFn: () => fetchDiseasesByPlant(plantId),
    enabled: !!plantId,
  });
};

export const usePlantByDiseases = (diseaseId) => {
  return useQuery({
    queryKey: ["diseasesPlant", diseaseId],
    queryFn: () => fetchPlantsByDisease(diseaseId),
    enabled: !!diseaseId,
  });
};