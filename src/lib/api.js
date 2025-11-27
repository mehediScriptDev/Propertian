import axiosInstance from "./axios";

/**
 * Common API Service
 * Provides CRUD operations for all API endpoints
 */

/**
 * GET Request
 * @param {string} url - API endpoint
 * @param {object} config - Additional axios config (params, headers, etc.)
 * @returns {Promise} Response data
 */
export const get = async (url, config = {}) => {
  try {
    const response = await axiosInstance.get(url, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * POST Request
 * @param {string} url - API endpoint
 * @param {object} data - Request body data
 * @param {object} config - Additional axios config
 * @returns {Promise} Response data
 */
export const post = async (url, data = {}, config = {}) => {
  try {
    const response = await axiosInstance.post(url, data, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * PUT Request
 * @param {string} url - API endpoint
 * @param {object} data - Request body data
 * @param {object} config - Additional axios config
 * @returns {Promise} Response data
 */
export const put = async (url, data = {}, config = {}) => {
  try {
    const response = await axiosInstance.put(url, data, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * PATCH Request
 * @param {string} url - API endpoint
 * @param {object} data - Request body data
 * @param {object} config - Additional axios config
 * @returns {Promise} Response data
 */
export const patch = async (url, data = {}, config = {}) => {
  try {
    const response = await axiosInstance.patch(url, data, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * DELETE Request
 * @param {string} url - API endpoint
 * @param {object} config - Additional axios config
 * @returns {Promise} Response data
 */
export const del = async (url, config = {}) => {
  try {
    const response = await axiosInstance.delete(url, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Upload File
 * @param {string} url - API endpoint
 * @param {FormData} formData - Form data containing file
 * @param {function} onUploadProgress - Progress callback
 * @returns {Promise} Response data
 */
export const uploadFile = async (url, formData, onUploadProgress = null) => {
  try {
    // Don't set Content-Type manually - let axios/browser set it with proper boundary
    const config = {};

    if (onUploadProgress) {
      config.onUploadProgress = onUploadProgress;
    }

    console.log("Uploading to:", url);
    const response = await axiosInstance.post(url, formData, config);
    console.log("Upload response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Upload error:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Download File
 * @param {string} url - API endpoint
 * @param {string} filename - Name for downloaded file
 * @returns {Promise}
 */
export const downloadFile = async (url, filename) => {
  try {
    const response = await axiosInstance.get(url, {
      responseType: "blob",
    });

    // Create blob link to download
    const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = urlBlob;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();

    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Generic API call with custom method
 * @param {object} options - Axios request options
 * @returns {Promise} Response data
 */
export const apiCall = async (options) => {
  try {
    const response = await axiosInstance(options);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Export default object with all methods
const api = {
  get,
  post,
  put,
  patch,
  delete: del,
  uploadFile,
  downloadFile,
  apiCall,
};

export default api;
