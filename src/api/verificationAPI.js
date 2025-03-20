import axiosInstance from "../utils/axiosInstance";

// Base endpoint for verification
const VERIFICATION_ENDPOINT = import.meta.env.VITE_VERIFICATION_ENDPOINT;

// const VERIFICATION_ENDPOINT = "/verification";

// Generate a verification code
export const generateVerificationCode = async (email) => {
    const response = await axiosInstance.post(`${VERIFICATION_ENDPOINT}/generate`, { email });
    return response.data;
};

// Verify a given code
export const verifyCode = async (email, code) => {
    const response = await axiosInstance.post(`verification/verify`, { email, code });
    return response.data;
};


// Check verification status
export const checkVerificationStatus = async () => {
    const response = await axiosInstance.get(`${VERIFICATION_ENDPOINT}/status`);
    return response.data;
};