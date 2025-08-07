import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchReports, deleteReport } from "../api/reportsApi";

// Query key constant
const REPORTS_QUERY_KEY = ["reports"];

// In useReports.js

export const useReports = ({ page = 1, pageSize = 10 } = {}) => {
    const queryClient = useQueryClient();

    const {
        data,
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery({
        queryKey: ["reports", page, pageSize],
        queryFn: () => fetchReports({ pageNumber: page, pageSize }),
        placeholderData: {
            items: [
                {
                    id: 1,
                    status: "Detected",
                    report_type: "Daily",
                    file_link: "https://example.com/file1.pdf",
                    date: new Date().toISOString(),
                },
                {
                    id: 2,
                    status: "Pending",
                    report_type: "Weekly",
                    file_link: "https://example.com/file2.pdf",
                    date: new Date().toISOString(),
                },
            ],
            total: 2,
            pages: 1,
        }
        ,
        keepPreviousData: true,
    });

    const { mutate: removeReport, isLoading: isDeleting } = useMutation({
        mutationFn: deleteReport,
        onSuccess: () => {
            queryClient.invalidateQueries(["reports"]);
        },
    });

    return {
        data,
        isLoading,
        isError,
        error,
        refetch,
        removeReport,
        isDeleting,
    };
};

