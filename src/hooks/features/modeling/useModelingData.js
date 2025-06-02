import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const MODELING_DATA_CACHE_KEY = "modelingData";
const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;

const initialModelingData = {
    category: {},
    selected_file: [],
    image_id: null,
    inference_id: null,
    is_deep: false,
    errorMessage: "",
    is_final: false,
};

export function useModelingData() {
    const queryClient = useQueryClient();

    const { data: cachedModelingData } = useQuery({
        queryKey: [MODELING_DATA_CACHE_KEY],
        queryFn: () => initialModelingData,
        staleTime: ONE_DAY_IN_MS,
        cacheTime: ONE_DAY_IN_MS,
    });

    const [modelingData, setModelingData] = useState(
        cachedModelingData || initialModelingData
    );

    useEffect(() => {
        queryClient.setQueryData([MODELING_DATA_CACHE_KEY], modelingData);
    }, [modelingData, queryClient]);

    const clearModelingCache = () => {
        queryClient.removeQueries([MODELING_DATA_CACHE_KEY]);
        setModelingData(initialModelingData);
    };

    return {
        modelingData,
        setModelingData,
        clearModelingCache,
    };
}