import api from "@/lib/api";

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

/**
 * Login user
 * @param {object} credentials - { email, password }
 * @returns {Promise} User data with token
 */
export const login = async (credentials) => {
  try {
    const response = await api.post("/auth/login", credentials);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Register new user
 * @param {object} userData - { name, email, password, role }
 * @returns {Promise} User data
 */
export const register = async (userData) => {
  try {
    const response = await api.post("/auth/register", userData);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Logout user
 * @returns {Promise}
 */
export const logout = async () => {
  try {
    const response = await api.post("/auth/logout");
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Get current user profile
 * @returns {Promise} User data
 */
export const getCurrentUser = async () => {
  try {
    const response = await api.get("/auth/profile");
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Refresh authentication token
 * @param {string} refreshToken
 * @returns {Promise} New token data
 */
export const refreshToken = async (refreshToken) => {
  try {
    const response = await api.post("/auth/refresh", { refreshToken });
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Verify email
 * @param {string} token - Verification token
 * @returns {Promise}
 */
export const verifyEmail = async (token) => {
  try {
    const response = await api.post("/auth/verify-email", { token });
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Request password reset
 * @param {string} email
 * @returns {Promise}
 */
export const forgotPassword = async (email) => {
  try {
    const response = await api.post("/auth/forgot-password", { email });
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Reset password
 * @param {object} data - { token, newPassword }
 * @returns {Promise}
 */
export const resetPassword = async (data) => {
  try {
    const response = await api.post("/auth/reset-password", data);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Change password
 * @param {object} data - { currentPassword, newPassword }
 * @returns {Promise}
 */
export const changePassword = async (data) => {
  try {
    const response = await api.put("/auth/change-password", data);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Update user profile
 * @param {object} userData - User data to update
 * @returns {Promise} Updated user data
 */
export const updateProfile = async (userData) => {
  try {
    const response = await api.put("/auth/profile", userData);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Social authentication (Google, Facebook, etc.)
 * @param {string} provider - Social provider name
 * @param {string} token - Social provider token
 * @returns {Promise} User data with token
 */
export const socialAuth = async (provider, token) => {
  try {
    const response = await api.post(`/auth/social/${provider}`, { token });
    return response;
  } catch (error) {
    throw error;
  }
};

const authService = {
  login,
  register,
  logout,
  getCurrentUser,
  refreshToken,
  verifyEmail,
  forgotPassword,
  resetPassword,
  changePassword,
  updateProfile,
  socialAuth,
};

export default authService;
