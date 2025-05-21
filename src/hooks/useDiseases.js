import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    fetchDiseases,
    fetchDiseaseById,
    fetchDiseaseByName,
    addDisease,
    updateDisease,
    deleteDisease
} from "../api/diseaseAPI";


export const useDiseases = (page = 1, pageSize = 10) => {
    return useQuery({
        queryKey: ["diseases", page, pageSize],
        queryFn: () => fetchDiseases(page, pageSize),
        keepPreviousData: true
    });
};


export const useDiseaseById = (diseaseId) => {
    return useQuery({
        queryKey: ["disease", diseaseId],
        queryFn: () => fetchDiseaseById(diseaseId),
        enabled: !!diseaseId,
    });
};


export const useDiseaseByName = (name) => {
    return useQuery({
        queryKey: ["diseaseByName", name],
        queryFn: () => fetchDiseaseByName(name),
        enabled: !!name,
    });
};


export const useAddDisease = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: addDisease,
        onSuccess: () => {
            queryClient.invalidateQueries(["diseases"]);
        }
    });
};


export const useUpdateDisease = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...data }) => updateDisease(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(["diseases"]);
        }
    });
};


export const useDeleteDisease = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => deleteDisease(id),
        onSuccess: () => {
            queryClient.invalidateQueries(["diseases"]);
        },
    });
};

