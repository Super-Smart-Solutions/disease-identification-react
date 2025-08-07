import axiosInstance from "../utils/axiosInstance";

const REPORT_ENDPOINT = "/reports"


export const fetchReports = async (params = {}) => {
    const response = await axiosInstance.get(REPORT_ENDPOINT, { params });
    return response.data;
};


export const fetchReportById = async (reportId) => {
    const response = await axiosInstance.get(`${REPORT_ENDPOINT}/${reportId}`);
    return response.data;
};


export const updateReport = async (reportId, reportData) => {
    const response = await axiosInstance.put(`${REPORT_ENDPOINT}/${reportId}`, reportData);
    return response.data;
};


export const deleteReport = async (reportId) => {
    const response = await axiosInstance.delete(`${REPORT_ENDPOINT}/${reportId}`);
    return response.data;
};
