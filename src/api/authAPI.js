import axiosInstance from "../utils/axiosInstance";

const AUTH_ENDPOINT = import.meta.env.VITE_AUTH_ENDPOINT;

// Register a new user
export const registerUser = async (userData) => {
    const response = await axiosInstance.post(`${AUTH_ENDPOINT}/register`, userData);
    return response.data;
};

// Login user with JWT
export const loginUser = async (credentials) => {
    const formData = new URLSearchParams();
    Object.entries(credentials).forEach(([key, value]) => {
        formData.append(key, value);
    });

    const response = await axiosInstance.post(`${AUTH_ENDPOINT}/jwt/login`, formData, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });

    return response.data;
};

// Logout user
export const logoutUser = async () => {
    const response = await axiosInstance.post(`${AUTH_ENDPOINT}/jwt/logout`);
    return response.data;
};

// Forgot password
export const forgotPassword = async (email) => {
    const response = await axiosInstance.post(`${AUTH_ENDPOINT}/forgot-password`, { email });
    return response.data;
};

// Reset password
export const resetPassword = async (resetData) => {
    const response = await axiosInstance.post(`${AUTH_ENDPOINT}/reset-password`, resetData);
    return response.data;
};

// Request email verification token
export const requestVerifyToken = async (email) => {
    const response = await axiosInstance.post(`${AUTH_ENDPOINT}/request-verify-token`, { email });
    return response.data;
};

// Verify email
export const verifyEmail = async (token) => {
    const response = await axiosInstance.post(`${AUTH_ENDPOINT}/verify`, { token });
    return response.data;
};
