import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    uploadReport,
    fetchReports,
    fetchReportById,
    deleteReport,
} from "../api/reportsApi";

// Fetch all reports
export const useReports = () => {
    return useQuery({
        queryKey: ["reports"],
        queryFn: fetchReports,
        keepPreviousData: true,
    });
};

// Fetch a report by ID
export const useReportById = (reportId) => {
    return useQuery({
        queryKey: ["report", reportId],
        queryFn: () => fetchReportById(reportId),
        enabled: !!reportId,
    });
};

// Upload a new report
export const useUploadReport = ({ whenSucces }) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: uploadReport,
        onSuccess: () => {
            queryClient.invalidateQueries(["reports"]);
            whenSucces();
        },
    });
};

// Delete a report
export const useDeleteReport = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteReport,
        onSuccess: () => {
            queryClient.invalidateQueries(["reports"]);
        },
    });
};
