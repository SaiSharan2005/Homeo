/**
 * Batch Service
 * Handles all batch-related API calls
 */

import { api } from '../api';

/**
 * Get all batches with pagination
 * @param {number} page - Page number (0-based)
 * @param {number} size - Page size
 * @returns {Promise<Object>} Paginated batches
 */
export const getBatches = async (page = 0, size = 10) => {
  return await api.get(`/batches?page=${page}&size=${size}`);
};

/**
 * Get batch by ID
 * @param {string|number} id - Batch ID
 * @returns {Promise<Object>} Batch data
 */
export const getBatchById = async (id) => {
  return await api.get(`/batches/${id}`);
};

/**
 * Create new batch
 * @param {Object} batchData - Batch data
 * @returns {Promise<Object>} Created batch
 */
export const createBatch = async (batchData) => {
  return await api.post('/batches', batchData);
};

/**
 * Update batch
 * @param {string|number} id - Batch ID
 * @param {Object} batchData - Updated batch data
 * @returns {Promise<Object>} Updated batch
 */
export const updateBatch = async (id, batchData) => {
  return await api.put(`/batches/${id}`, batchData);
};

/**
 * Delete batch
 * @param {string|number} id - Batch ID
 * @returns {Promise<null>} Success response
 */
export const deleteBatch = async (id) => {
  return await api.delete(`/batches/${id}`);
};

/**
 * Get batches by item ID with pagination
 * @param {string|number} itemId - Inventory item ID
 * @param {number} page - Page number (0-based)
 * @param {number} size - Page size
 * @returns {Promise<Object>} Paginated batches for item
 */
export const getBatchesByItem = async (itemId, page = 0, size = 10) => {
  return await api.get(`/batches/item/${itemId}?page=${page}&size=${size}`);
};

/**
 * Get batches by supplier ID with pagination
 * @param {string|number} supplierId - Supplier ID
 * @param {number} page - Page number (0-based)
 * @param {number} size - Page size
 * @returns {Promise<Object>} Paginated batches for supplier
 */
export const getBatchesBySupplier = async (supplierId, page = 0, size = 10) => {
  return await api.get(`/batches/supplier/${supplierId}?page=${page}&size=${size}`);
};

/**
 * Get batches by expiry date range with pagination
 * @param {string} startDate - Start date in YYYY-MM-DD format
 * @param {string} endDate - End date in YYYY-MM-DD format
 * @param {number} page - Page number (0-based)
 * @param {number} size - Page size
 * @returns {Promise<Object>} Paginated batches for expiry date range
 */
export const getBatchesByExpiryDateRange = async (startDate, endDate, page = 0, size = 10) => {
  const params = `?startDate=${startDate}&endDate=${endDate}&page=${page}&size=${size}`;
  return await api.get(`/batches/expiry-date-range${params}`);
};

/**
 * Get batch count
 * @returns {Promise<Object>} Batch count
 */
export const getBatchCount = async () => {
  return await api.get('/batches/count');
};
