import axiosInstance from "../utils/axiosInstance";

const REPORTS_ENDPOINT = "/reports";

export const uploadReport = async ({ reportType, file, report_origin }) => {
    const formData = new FormData();
    formData.append("file", file);

    const params = {
        report_type: reportType,
        report_origin: report_origin
    };

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
