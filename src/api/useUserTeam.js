// hooks/useUserTeam.js
import { useQuery } from "@tanstack/react-query";
import { getOrganizationById } from "./organizationsApi";

export const useUserTeam = (organizationId, options = {}) => {
    return useQuery({
        queryKey: ["organization", organizationId],
        queryFn: () => getOrganizationById(organizationId),
        enabled: !!organizationId, // Only run if ID exists
        staleTime: 1000 * 60 * 5, // Optional: cache for 5 minutes
        ...options,
    });
};
