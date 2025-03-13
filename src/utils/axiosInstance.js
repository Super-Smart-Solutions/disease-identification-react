import axios from "axios";
import Cookies from "js-cookie";

// // Base API URL (use environment variable if available)
// const BASE_URL = process.env.REACT_APP_API_URL || "https://staging.plant-backend.ss-solution.org/apiv";

const BASE_URL = import.meta.env.VITE_API_URL;
const TEST_TOKEN = import.meta.env.VITE_TEST_TOKEN;


// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    // "Access-Control-Allow-Origin": "*",
    // "Access-Control-Allow-Credentials": true,
    // "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT",
    // "Accept-Language": "ar",
  },
});

// Request Interceptor (Attach Token Automatically)
axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token") || TEST_TOKEN; // Retrieve token from cookies
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor (Handle Errors)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;

      // Handle unauthorized error (redirect to login)
      if (status === 401 || status === 422) {
        console.warn("Unauthorized! Redirecting to login...");
        window.location.href = "/login"; // Redirect to login page
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
