import { useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getInferences, getAggregates, deleteInference, updateInferenceVerify } from "../api/inferenceAPI";
import { fetchDiseases } from "../api/diseaseAPI";
import { fetchPlants } from "../api/plantAPI";
import { getStatusTranslation } from "../utils/statusTranslations";
import { useTranslation } from "react-i18next";

export const useInferences = () => {
    const { i18n, t } = useTranslation();


    const fetchLogs = useCallback(async (page, pageSize) => {
        const [inferencesData, diseasesData, plantsData] = await Promise.all([
            getInferences({ page, size: pageSize }),
            fetchDiseases({ pageSize: 100 }),
            fetchPlants({ pageSize: 100 }),
        ]);

        const currentLang = i18n.language;

        const enrichedInferences = inferencesData?.items?.map((inference) => {
            const plant = plantsData?.items?.find((p) => p.id === inference.plant_id);
            const disease = diseasesData?.items?.find((d) => d.id === inference.disease_id);

            return {
                ...inference,
                plant_name: plant
                    ? currentLang === "ar"
                        ? plant.arabic_name
                        : plant.english_name
                    : "----",
                disease_name: disease
                    ? currentLang === "ar"
                        ? disease.arabic_name
                        : disease.english_name
                    : "----",
                status_text: getStatusTranslation(inference.status, t),
            };
        });

        return {
            items: enrichedInferences || [],
            total: inferencesData.total,
            pages: inferencesData.pages,
        };
    }, [i18n.language, t]);

    const getInferencesData = (page, pageSize) => {
        return useQuery({
            queryKey: ["inferences", page, pageSize, i18n.language],
            queryFn: () => fetchLogs(page, pageSize),
        });
    };


    const getInferenceAggregates = useCallback((start_date, end_date) => {

        return useQuery({
            queryKey: ["inferenceAggregates", start_date, end_date],
            queryFn: async () => getAggregates(start_date, end_date),
            enabled: !!end_date,
            keepPreviousData: true

        });
    }, []);

    const updateInferenceVerifyMutation = () => {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: (id) => updateInferenceVerify(id),
            onSuccess: (updatedInference) => {
                queryClient.setQueryData(
                    ["inferences"],
                    (oldData) => {
                        if (!oldData) return oldData;
                        return {
                            ...oldData,
                            items: oldData.items.map((item) =>
                                item.id === updatedInference.id
                                    ? { ...item, approved: updatedInference.approved }
                                    : item
                            ),
                        };
                    }
                );
                queryClient.invalidateQueries(["inferences"]);
            },

        });
    };

    const deleteInferenceMutation = () => {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: (inferenceId) => deleteInference(inferenceId),
            onSuccess: () => {
                queryClient.invalidateQueries(["inferences"]);
                queryClient.invalidateQueries(["inferenceAggregates"]);
            },
        });
    };
    return {
        getInferencesData,
        getInferenceAggregates,
        updateInferenceVerifyMutation,
        deleteInferenceMutation
    };
};