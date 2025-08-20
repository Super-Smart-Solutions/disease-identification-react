import axiosInstance from "../utils/axiosInstance";

const REPORTS_ENDPOINT = "/reports";

export const uploadReport = async ({ reportType, file, report_origin, data }) => {
    const formData = new FormData();
    formData.append("file", file);

    let params = {};

    if (reportType && typeof reportType === "string") {
        params.report_type = reportType;
    }

    if (report_origin && typeof report_origin === "string") {
        params.report_origin = report_origin;
    }

    if (data && Array.isArray(data) && data.length > 0) {
        params.data = data;
    }

    const response = await axiosInstance.post(
        `${REPORTS_ENDPOINT}/upload`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            params,
        }
    );

    return response.data;
};

export const fetchReports = async () => {
    const response = await axiosInstance.get(REPORTS_ENDPOINT);
    return response.data;
};


export const fetchReportById = async (reportId) => {
    const response = await axiosInstance.get(`${REPORTS_ENDPOINT}/${reportId}`);
    return response.data;
};


export const deleteReport = async (reportId) => {
    const response = await axiosInstance.delete(`${REPORTS_ENDPOINT}/${reportId}`);
    return response.data;
};
