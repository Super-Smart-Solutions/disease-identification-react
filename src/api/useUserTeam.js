// hooks/useUserTeam.js
import { useQuery } from "@tanstack/react-query";
import { getMyOrganization } from "./organizationsApi";

export const useUserTeam = (organizationId) => {
    return useQuery({
        queryKey: ["organizations"],
        queryFn: getMyOrganization,

        enabled: !!organizationId, // Only run if ID exists
        staleTime: 1000 * 60 * 5, // cache for 5 minutes
    });
};
