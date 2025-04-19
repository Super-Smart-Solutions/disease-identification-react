// hooks/useUserTeam.js
import { useQuery } from "@tanstack/react-query";
import { getOrganizations } from "./organizationsApi";

export const useUserTeam = (organizationId, options = {}) => {
    return useQuery({
        queryKey: ["organizations"],
        queryFn: getOrganizations,
        select: (data) => data?.items?.find(org => org.id === organizationId),
        enabled: !!organizationId, // Only run if ID exists
        staleTime: 1000 * 60 * 5, // cache for 5 minutes
        ...options,
    });
};
