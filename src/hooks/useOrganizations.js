import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getOrganizations,
    getOrganizationById,
    createOrganization,
    updateOrganization,
    deleteOrganization,
} from "../api/organizationsApi";

// Fetch paginated organizations
export const useOrganizations = (page = 1, pageSize = 10) => {
    return useQuery({
        queryKey: ["organizations", page, pageSize],
        queryFn: () => getOrganizations(page, pageSize),
        keepPreviousData: true,
    });
};

// Fetch organization by ID
export const useOrganizationById = (organizationId) => {
    return useQuery({
        queryKey: ["organization", organizationId],
        queryFn: () => getOrganizationById(organizationId),
        enabled: !!organizationId,
    });
};

// Add a new organization
export const useAddOrganization = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createOrganization,
        onSuccess: () => {
            queryClient.invalidateQueries(["organizations"]);
        },
    });
};

// Update an existing organization
export const useUpdateOrganization = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...data }) => updateOrganization(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(["organizations"]);
        },
    });
};

// Delete a organization
export const useDeleteOrganization = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => deleteOrganization(id),
        onSuccess: () => {
            queryClient.invalidateQueries(["organizations"]);
        },
    });
};
