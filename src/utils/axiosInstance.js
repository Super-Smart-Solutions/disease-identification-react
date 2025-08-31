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
      let errorMessages = data?.detail || "An unexpected error occurred.";

      // Convert errorMessages to array if it's not already
      if (!Array.isArray(errorMessages)) {
        errorMessages = [errorMessages];
      }

      // Map error messages to extract the 'msg' field if it's an object
      errorMessages = errorMessages.map((err) =>
        typeof err === 'object' && err !== null && err.msg ? err.msg : String(err)
      );

      // Handle unauthorized error (try to refresh token)
      if (status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          // Attempt to refresh the access token
          let newAccessToken = await tokenManager.refreshAccessToken();

          // Ensure newAccessToken is a string
          if (Array.isArray(newAccessToken)) {
            newAccessToken = newAccessToken[0]; // Take first token if array
          } else if (typeof newAccessToken === 'object' && newAccessToken !== null) {
            newAccessToken = newAccessToken.token || Object.values(newAccessToken)[0]; // Extract token from object
          }

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
        // Show error messages for non-auth errors
        errorMessages.forEach((message) => {
          toast.error(message);
        });
      }
    } else {
      toast.error("Network error. Please check your connection.");
    }

    return Promise.reject(error);
  }
);
export default axiosInstance;