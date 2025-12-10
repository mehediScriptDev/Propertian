import axios from "axios";
import Cookies from "js-cookie";

/**
 * Create a configured axios instance with base URL and interceptors
 */
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 30000, // 30 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request Interceptor
 * Automatically attach authentication token to requests
 */
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from cookies
    if (typeof window !== "undefined") {
      const token = Cookies.get("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handle common response scenarios and errors
 */
axiosInstance.interceptors.response.use(
  (response) => {
    // Return response data directly
    return response;
  },
  (error) => {
    // Handle common error scenarios
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Unauthorized - clear cookies and redirect to login
          if (typeof window !== "undefined") {
            Cookies.remove("token");
            Cookies.remove("refreshToken");
            Cookies.remove("user");

            // Only redirect if not already on login page
            if (!window.location.pathname.includes("/login")) {
              const locale = window.location.pathname.split("/")[1] || "en";
              window.location.href = `/${locale}/login`;
            }
          }
          break;
        case 403:
          // Forbidden - user doesn't have permission
          console.error("Access forbidden:", data.message);
          break;
        case 404:
          // Not found
          console.error("Resource not found:", data.message);
          break;
        case 500:
          // Server error
          console.error("Server error:", data.message);
          break;
        default:
          console.error("API Error:", data.message);
      }

      // Return formatted error
      return Promise.reject({
        message: data.message || "An error occurred",
        status: status,
        data: data,
      });
    } else if (error.request) {
      // Request was made but no response received
      console.error("No response received:", error.request);
      return Promise.reject({
        message: "Network error. Please check your connection.",
        status: null,
      });
    } else {
        // Error in request setup or request was cancelled/aborted
        const isCanceled =
          error?.code === 'ERR_CANCELED' ||
          error?.message === 'canceled' ||
          (axios && axios.isCancel && axios.isCancel(error));

        if (isCanceled) {
          // Expected cancellation (component unmount, manual abort). Don't spam console.
          return Promise.reject({
            message: 'canceled',
            status: null,
            canceled: true,
          });
        }

        console.error("Request error:", error.message);
        return Promise.reject({
          message: error.message || "An unexpected error occurred",
          status: null,
        });
    }
  }
);

export default axiosInstance;
