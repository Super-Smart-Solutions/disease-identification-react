import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    uploadReport,
    fetchReports,
    fetchReportById,
    deleteReport,
} from "../api/reportsApi";


export const useReports = ({ page = 1, pageSize = 10 } = {}) => {
    return useQuery({
        queryKey: ["reports", page, pageSize],
        queryFn: () => fetchReports(page, pageSize),
        keepPreviousData: true,
        staleTime: 1000 * 60 * 5, 
    });
};


export const useReportById = (reportId) => {
    return useQuery({
        queryKey: ["report", reportId],
        queryFn: () => fetchReportById(reportId),
        enabled: !!reportId,
    });
};


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


export const useDeleteReport = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteReport,
        onSuccess: () => {
            queryClient.invalidateQueries(["reports"]);
        },
    });
};