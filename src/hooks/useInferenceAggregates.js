import { useCallback, useMemo } from "react";
import { useInferences } from "./useInferences";

export const useInferenceAggregates = () => {
  const { getInferenceAggregates } = useInferences();

  const formatDate = useCallback((date) => {
    return date ? date.toISOString().split("T")[0] : "";
  }, []);

  const processData = useCallback((data) => {
    if (!Array.isArray(data)) return null;
    return data
      ?.map((item) => ({
        date: item.date.split("T")[0],
        count: item.total_inferences,
        successful: item.successful_inferences,
        failed: item.failed_inferences,
        unique_diseases: item.unique_diseases_count,
        average_confidence: item.average_confidence,
        status_breakdown: item.status_breakdown,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, []);

  const calculateMetrics = useCallback((processedData) => {
    if (!processedData) return null;
    return processedData.reduce(
      (acc, day) => ({
        total: acc.total + day.count,
        successful: acc.successful + day.successful,
        failed: acc.failed + day.failed,
        diseases: acc.diseases + day.unique_diseases,
      }),
      { total: 0, successful: 0, failed: 0, diseases: 0 }
    );
  }, []);

  return {
    formatDate,
    processData,
    calculateMetrics,
    getInferenceAggregates,
  };
};