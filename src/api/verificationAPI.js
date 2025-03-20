import axiosInstance from "../utils/axiosInstance";

// Base endpoint for verification
const VERIFICATION_ENDPOINT = "/api/verification";

// Generate a verification code
export const generateVerificationCode = async (data) => {
    const response = await axiosInstance.post(`${VERIFICATION_ENDPOINT}/generate`, data);
    return response.data;
};

// Verify a given code
export const verifyCode = async (data) => {
    const response = await axiosInstance.post(`${VERIFICATION_ENDPOINT}/verify`, data);
    return response.data;
};

// Check verification status
export const checkVerificationStatus = async () => {
    const response = await axiosInstance.get(`${VERIFICATION_ENDPOINT}/status`);
    return response.data;
};