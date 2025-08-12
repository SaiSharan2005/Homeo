/**
 * Inventory Category Service
 * Handles all inventory category-related API calls
 */

import { api } from '../api';

/**
 * Get all categories with pagination
 * @param {number} page - Page number (0-based)
 * @param {number} size - Page size
 * @returns {Promise<Object>} Paginated categories
 */
export const getCategories = async (page = 0, size = 10) => {
  return await api.get(`/categories?page=${page}&size=${size}`);
};

/**
 * Get category by ID
 * @param {string|number} id - Category ID
 * @returns {Promise<Object>} Category data
 */
export const getCategoryById = async (id) => {
  return await api.get(`/categories/${id}`);
};

/**
 * Create new category
 * @param {Object} categoryData - Category data
 * @returns {Promise<Object>} Created category
 */
export const createCategory = async (categoryData) => {
  return await api.post('/categories', categoryData);
};

/**
 * Update category
 * @param {string|number} id - Category ID
 * @param {Object} categoryData - Updated category data
 * @returns {Promise<Object>} Updated category
 */
export const updateCategory = async (id, categoryData) => {
  return await api.put(`/categories/${id}`, categoryData);
};

/**
 * Delete category
 * @param {string|number} id - Category ID
 * @returns {Promise<null>} Success response
 */
export const deleteCategory = async (id) => {
  return await api.delete(`/categories/${id}`);
};

/**
 * Get all categories without pagination (for dropdowns)
 * @returns {Promise<Array>} All categories
 */
export const getAllCategories = async () => {
  return await api.get('/categories');
};

/**
 * Get category count
 * @returns {Promise<Object>} Category count
 */
export const getCategoryCount = async () => {
  return await api.get('/categories/count');
};
