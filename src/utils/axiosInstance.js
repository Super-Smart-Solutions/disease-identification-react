// axiosInstance.js
import axios from "axios";
import { toast } from "sonner";
import tokenManager from "../Components/helpers/tokenManager";

// Base API URL from environment variables
const BASE_URL = import.meta.env.VITE_API_URL;

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
    "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT",
    "Accept-Language": "ar",
  },
});

// Request Interceptor (Attach Token Automatically)
axiosInstance.interceptors.request.use(
  (config) => {
    const token = tokenManager.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    toast.error("Request failed. Please try again.");
    return Promise.reject(error);
  }
);

// Response Interceptor (Handle Errors and Token Refresh)
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response) {
      const { status, data } = error.response;
      const errorMessage = data?.detail || "An unexpected error occurred.";

      // Handle unauthorized error (try to refresh token)
      if (status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          // Attempt to refresh the access token
          const newAccessToken = await tokenManager.refreshAccessToken();

          if (newAccessToken) {
            // Update the original request with new token
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            // Retry the original request
            return axiosInstance(originalRequest);
          }
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
          tokenManager.redirectToLogin();
          return Promise.reject(refreshError);
        }
      } else if (status !== 401) {
        // Show error message for non-auth errors
        toast.error(errorMessage);
      }
    } else {
      toast.error("Network error. Please check your connection.");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;