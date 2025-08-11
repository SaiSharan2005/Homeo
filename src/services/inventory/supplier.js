/**
 * Supplier Service
 * Handles all supplier-related API calls
 */

import { api } from '../api';

/**
 * Get all suppliers with pagination
 * @param {number} page - Page number (0-based)
 * @param {number} size - Page size
 * @returns {Promise<Object>} Paginated suppliers
 */
export const getSuppliers = async (page = 0, size = 10) => {
  return await api.get(`/suppliers?page=${page}&size=${size}`);
};

/**
 * Get supplier by ID
 * @param {string|number} id - Supplier ID
 * @returns {Promise<Object>} Supplier data
 */
export const getSupplierById = async (id) => {
  return await api.get(`/suppliers/${id}`);
};

/**
 * Create new supplier
 * @param {Object} supplierData - Supplier data
 * @returns {Promise<Object>} Created supplier
 */
export const createSupplier = async (supplierData) => {
  return await api.post('/suppliers', supplierData);
};

/**
 * Update supplier
 * @param {string|number} id - Supplier ID
 * @param {Object} supplierData - Updated supplier data
 * @returns {Promise<Object>} Updated supplier
 */
export const updateSupplier = async (id, supplierData) => {
  return await api.put(`/suppliers/${id}`, supplierData);
};

/**
 * Delete supplier
 * @param {string|number} id - Supplier ID
 * @returns {Promise<null>} Success response
 */
export const deleteSupplier = async (id) => {
  return await api.delete(`/suppliers/${id}`);
};

/**
 * Get all suppliers without pagination (for dropdowns)
 * @returns {Promise<Array>} All suppliers
 */
export const getAllSuppliers = async () => {
  return await api.get('/suppliers');
};

/**
 * Search suppliers by name or contact
 * @param {string} searchTerm - Search term
 * @param {number} page - Page number (0-based)
 * @param {number} size - Page size
 * @returns {Promise<Object>} Paginated search results
 */
export const searchSuppliers = async (searchTerm, page = 0, size = 10) => {
  return await api.get(`/suppliers/search?q=${encodeURIComponent(searchTerm)}&page=${page}&size=${size}`);
};

/**
 * Get supplier count
 * @returns {Promise<Object>} Supplier count
 */
export const getSupplierCount = async () => {
  return await api.get('/suppliers/count');
};

// Legacy alias used by UI
export const fetchSuppliers = (page = 0, size = 10) => getSuppliers(page, size);