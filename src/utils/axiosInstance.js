import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";

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
    const token = Cookies.get("token"); // Retrieve token from cookies
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

// Response Interceptor (Handle Errors)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      // Show error message from API response
      const errorMessage = data?.detail || "An unexpected error occurred.";

      // Handle unauthorized error (redirect to login)
      if (status === 401) {
        console.warn("Unauthorized! Redirecting to login...");
      } else {
        toast.error(errorMessage);
      }
    } else {
      toast.error("Network error. Please check your connection.");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
