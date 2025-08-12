/**
 * Advertisement Service
 * Handles all advertisement-related API calls
 */

import { api } from './api';

/**
 * Get all advertisements with pagination
 * @param {number} page - Page number (0-based)
 * @param {number} size - Page size
 * @returns {Promise<Object>} Paginated advertisements
 */
export const getAdvertisements = async (page = 0, size = 10) => {
  return await api.get(`/ads?page=${page}&size=${size}`);
};

/**
 * Get advertisement by ID
 * @param {string|number} id - Advertisement ID
 * @returns {Promise<Object>} Advertisement data
 */
export const getAdvertisementById = async (id) => {
  return await api.get(`/ads/${id}`);
};

/**
 * Create new advertisement
 * @param {Object} advertisementData - Advertisement data
 * @returns {Promise<Object>} Created advertisement
 */
export const createAdvertisement = async (advertisementData) => {
  return await api.post('/ads', advertisementData);
};

/**
 * Update advertisement
 * @param {string|number} id - Advertisement ID
 * @param {Object} advertisementData - Updated advertisement data
 * @returns {Promise<Object>} Updated advertisement
 */
export const updateAdvertisement = async (id, advertisementData) => {
  return await api.put(`/ads/${id}`, advertisementData);
};

/**
 * Delete advertisement
 * @param {string|number} id - Advertisement ID
 * @returns {Promise<null>} Success response
 */
export const deleteAdvertisement = async (id) => {
  return await api.delete(`/ads/${id}`);
};

/**
 * Get active advertisements for a specific page
 * @param {string} targetPage - Target page identifier
 * @returns {Promise<Object>} Active advertisements
 */
export const getActiveAdvertisements = async (targetPage) => {
  return await api.get(`/ads/active?targetPage=${targetPage}`);
};

/**
 * Upload advertisement image
 * @param {string|number} id - Advertisement ID
 * @param {FormData} imageData - Image file data
 * @returns {Promise<Object>} Upload response
 */
export const uploadAdvertisementImage = async (id, imageData) => {
  return await api.post(`/ads/${id}/image`, imageData);
};

/**
 * Change advertisement active status
 * Backend uses GET for this toggle: /api/ads/{id}/status?isActive=true|false
 */
export const changeAdvertisementStatus = async (id, isActive) => {
  return await api.get(`/ads/${id}/status?isActive=${isActive}`);
};