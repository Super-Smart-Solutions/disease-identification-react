import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    fetchFarms,
    fetchFarmById,
    addFarm,
    updateFarm,
    deleteFarm,
} from "../api/farmAPI";

// Fetch paginated farms
export const useFarms = (page = 1, pageSize = 10) => {
    return useQuery({
        queryKey: ["farms", page, pageSize],
        queryFn: () => fetchFarms(page, pageSize),
        keepPreviousData: true,
    });
};

// Fetch farm by ID
export const useFarmById = (farmId) => {
    return useQuery({
        queryKey: ["farm", farmId],
        queryFn: () => fetchFarmById(farmId),
        enabled: !!farmId,
    });
};

// Add a new farm
export const useAddFarm = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: addFarm,
        onSuccess: () => {
            queryClient.invalidateQueries(["farms"]);
        },
    });
};

// Update an existing farm
export const useUpdateFarm = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...data }) => updateFarm(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(["farms"]);
        },
    });
};

// Delete a farm
export const useDeleteFarm = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => deleteFarm(id),
        onSuccess: () => {
            queryClient.invalidateQueries(["farms"]);
        },
    });
};
