
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    fetchUsers,
    fetchUserById,
    fetchCurrentUser,
    updateUserById,
    updateCurrentUser,
    deleteUserById,
    uploadUserAvatar
} from "../api/userAPI";

export const useUsers = (params = { page: 1, pageSize: 10 }) => {
    return useQuery({
        queryKey: ["users", params],
        queryFn: () => fetchUsers(params),
        keepPreviousData: true
    });
};

export const useUserById = (userId) => {
    return useQuery({
        queryKey: ["user", userId],
        queryFn: () => fetchUserById(userId),
        enabled: !!userId,
    });
};

export const useCurrentUser = () => {
    return useQuery({
        queryKey: ["currentUser"],
        queryFn: fetchCurrentUser,
        staleTime: 1000 * 60 * 5,
    });
};


export const useUpdateUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...data }) => updateUserById(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries(["users"]);
            queryClient.invalidateQueries(["user", variables.id]);
            queryClient.invalidateQueries(["currentUser"]);
        },
    });
};

export const useUpdateCurrentUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateCurrentUser,
        onSuccess: () => {
            queryClient.invalidateQueries(["currentUser"]);
        },
    });
};

export const useDeleteUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (userId) => deleteUserById(userId),
        onSuccess: () => {
            queryClient.invalidateQueries(["users"]);
        },
    });
};

export const useUploadUserAvatar = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (avatarFile) => uploadUserAvatar(avatarFile),
        onSuccess: () => {
            queryClient.invalidateQueries(["currentUser"]);
        },
    });
};