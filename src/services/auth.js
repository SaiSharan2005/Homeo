/**
 * Request email verification code
 * @param {string} email - User's email address
 * @returns {Promise<Response>} The fetch response
 */
export const requestEmailVerification = async (email) => {
  return fetch(
    `${process.env.REACT_APP_BACKEND_URL}/verify/request?email=${encodeURIComponent(email)}`,
    { method: "POST" }
  );
};
/**
 * Authentication Service - Handles all authentication-related API calls
 * Replaces direct fetch calls in auth components
 */

import { api } from './api';

/**
 * User signup
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} Registration response with token
 */
export const signup = async (userData) => {
  return api.post('/auth/signup', userData);
};

/**
 * User login
 * @param {Object} credentials - Login credentials
 * @returns {Promise<Object>} Login response with token
 */
export const login = async (credentials) => {
  return api.post('/auth/login', credentials);
};

/**
 * Doctor signup
 * @param {Object} doctorData - Doctor registration data
 * @returns {Promise<Object>} Registration response
 */
export const doctorSignup = async (doctorData) => {
  return api.post('/auth/doctor/signup', doctorData);
};

/**
 * Doctor login
 * @param {Object} credentials - Doctor login credentials
 * @returns {Promise<Object>} Login response with token
 */
export const doctorLogin = async (credentials) => {
  return api.post('/auth/doctor/login', credentials);
};

/**
 * Verify email with token
 * @param {string} token - Email verification token
 * @returns {Promise<Object>} Verification response
 */
/**
 * Verify email with code
 * @param {string} email - User's email address
 * @param {string} code - Verification code
 * @returns {Promise<string>} The response message
 */
export const verifyEmail = async (email, code) => {
  const token = localStorage.getItem("Token");
  const res = await fetch(
    `${process.env.REACT_APP_BACKEND_URL}/verify/confirm` +
      `?email=${encodeURIComponent(email)}` +
      `&code=${encodeURIComponent(code)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    }
  );
  const msg = await res.text();
  if (res.ok && msg.includes("success")) {
    return msg;
  } else {
    throw new Error(msg || "Verification failed");
  }
};

/**
 * Send password reset email
 * @param {string} email - User's email address
 * @returns {Promise<Object>} Reset email response
 */
export const sendPasswordReset = async (email) => {
  return api.post('/auth/forgot-password', { email });
};

/**
 * Reset password with token
 * @param {string} token - Password reset token
 * @param {string} newPassword - New password
 * @returns {Promise<Object>} Password reset response
 */
export const resetPassword = async (token, newPassword) => {
  return api.post('/auth/reset-password', { token, newPassword });
};

/**
 * Refresh JWT token
 * @returns {Promise<Object>} New token response
 */
export const refreshToken = async () => {
  return api.post('/auth/refresh-token');
};

/**
 * Logout user (invalidate token on backend)
 * @returns {Promise<Object>} Logout response
 */
export const logout = async () => {
  return api.post('/auth/logout');
};

/**
 * Get current user profile
 * @returns {Promise<Object>} Current user data
 */
export const getCurrentUser = async () => {
  return api.get('/auth/me');
};

/**
 * Update user profile
 * @param {Object} profileData - Updated profile data
 * @returns {Promise<Object>} Updated profile response
 */
export const updateProfile = async (profileData) => {
  return api.put('/auth/profile', profileData);
};

/**
 * Change password
 * @param {Object} passwordData - Current and new password
 * @returns {Promise<Object>} Password change response
 */
export const changePassword = async (passwordData) => {
  return api.post('/auth/change-password', passwordData);
};
