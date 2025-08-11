/**
 * Stock Adjustment Service
 * Handles all stock adjustment-related API calls
 */

import { api } from '../api';

/**
 * Get all stock adjustments with pagination
 * @param {number} page - Page number (0-based)
 * @param {number} size - Page size
 * @returns {Promise<Object>} Paginated stock adjustments
 */
export const getStockAdjustments = async (page = 0, size = 10) => {
  return await api.get(`/stock-adjustments?page=${page}&size=${size}`);
};

/**
 * Get stock adjustment by ID
 * @param {string|number} id - Stock adjustment ID
 * @returns {Promise<Object>} Stock adjustment data
 */
export const getStockAdjustmentById = async (id) => {
  return await api.get(`/stock-adjustments/${id}`);
};

/**
 * Create new stock adjustment
 * @param {Object} adjustmentData - Stock adjustment data
 * @returns {Promise<Object>} Created stock adjustment
 */
export const createStockAdjustment = async (adjustmentData) => {
  return await api.post('/stock-adjustments', adjustmentData);
};

/**
 * Update stock adjustment
 * @param {string|number} id - Stock adjustment ID
 * @param {Object} adjustmentData - Updated stock adjustment data
 * @returns {Promise<Object>} Updated stock adjustment
 */
export const updateStockAdjustment = async (id, adjustmentData) => {
  return await api.put(`/stock-adjustments/${id}`, adjustmentData);
};

/**
 * Delete stock adjustment
 * @param {string|number} id - Stock adjustment ID
 * @returns {Promise<null>} Success response
 */
export const deleteStockAdjustment = async (id) => {
  return await api.delete(`/stock-adjustments/${id}`);
};

/**
 * Get stock adjustments by item ID with pagination
 * @param {string|number} itemId - Inventory item ID
 * @param {number} page - Page number (0-based)
 * @param {number} size - Page size
 * @returns {Promise<Object>} Paginated stock adjustments for item
 */
export const getStockAdjustmentsByItem = async (itemId, page = 0, size = 10) => {
  return await api.get(`/stock-adjustments/item/${itemId}?page=${page}&size=${size}`);
};

/**
 * Get stock adjustments by warehouse ID with pagination
 * @param {string|number} warehouseId - Warehouse ID
 * @param {number} page - Page number (0-based)
 * @param {number} size - Page size
 * @returns {Promise<Object>} Paginated stock adjustments for warehouse
 */
export const getStockAdjustmentsByWarehouse = async (warehouseId, page = 0, size = 10) => {
  return await api.get(`/stock-adjustments/warehouse/${warehouseId}?page=${page}&size=${size}`);
};

/**
 * Get stock adjustments by date range with pagination
 * @param {string} startDate - Start date in YYYY-MM-DD format
 * @param {string} endDate - End date in YYYY-MM-DD format
 * @param {number} page - Page number (0-based)
 * @param {number} size - Page size
 * @returns {Promise<Object>} Paginated stock adjustments for date range
 */
export const getStockAdjustmentsByDateRange = async (startDate, endDate, page = 0, size = 10) => {
  const params = `?startDate=${startDate}&endDate=${endDate}&page=${page}&size=${size}`;
  return await api.get(`/stock-adjustments/date-range${params}`);
};

/**
 * Get stock adjustment count
 * @returns {Promise<Object>} Stock adjustment count
 */
export const getStockAdjustmentCount = async () => {
  return await api.get('/stock-adjustments/count');
};
