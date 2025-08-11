/**
 * Stock Level Service
 * Handles all stock level-related API calls
 */

import { api } from '../api';

/**
 * Get all stock levels with pagination
 * @param {number} page - Page number (0-based)
 * @param {number} size - Page size
 * @returns {Promise<Object>} Paginated stock levels
 */
export const getStockLevels = async (page = 0, size = 10) => {
  return await api.get(`/stock-levels?page=${page}&size=${size}`);
};

/**
 * Get stock level by ID
 * @param {string|number} id - Stock level ID
 * @returns {Promise<Object>} Stock level data
 */
export const getStockLevelById = async (id) => {
  return await api.get(`/stock-levels/${id}`);
};

/**
 * Create new stock level
 * @param {Object} stockLevelData - Stock level data
 * @returns {Promise<Object>} Created stock level
 */
export const createStockLevel = async (stockLevelData) => {
  return await api.post('/stock-levels', stockLevelData);
};

/**
 * Update stock level
 * @param {string|number} id - Stock level ID
 * @param {Object} stockLevelData - Updated stock level data
 * @returns {Promise<Object>} Updated stock level
 */
export const updateStockLevel = async (id, stockLevelData) => {
  return await api.put(`/stock-levels/${id}`, stockLevelData);
};

/**
 * Delete stock level
 * @param {string|number} id - Stock level ID
 * @returns {Promise<null>} Success response
 */
export const deleteStockLevel = async (id) => {
  return await api.delete(`/stock-levels/${id}`);
};

/**
 * Get stock level by item ID
 * @param {string|number} itemId - Inventory item ID
 * @returns {Promise<Object>} Stock level for item
 */
// Note: backend exposes /stock-levels/batch/{batchId} and /stock-levels/warehouse/{warehouseId}
// getStockLevelByItem is not supported by backend; keeping here only if backend adds it later
export const getStockLevelByItem = async (itemId) => {
  return await api.get(`/stock-levels/item/${itemId}`);
};

/**
 * Get stock level by warehouse ID with pagination
 * @param {string|number} warehouseId - Warehouse ID
 * @param {number} page - Page number (0-based)
 * @param {number} size - Page size
 * @returns {Promise<Object>} Paginated stock levels for warehouse
 */
export const getStockLevelsByWarehouse = async (warehouseId, page = 0, size = 10) => {
  return await api.get(`/stock-levels/warehouse/${warehouseId}?page=${page}&size=${size}`);
};

/**
 * Get low stock items
 * @param {number} threshold - Stock threshold
 * @param {number} page - Page number (0-based)
 * @param {number} size - Page size
 * @returns {Promise<Object>} Paginated low stock items
 */
export const getLowStockItems = async (threshold = 10, page = 0, size = 10) => {
  return await api.get(`/stock-levels/low-stock?threshold=${threshold}&page=${page}&size=${size}`);
};

/**
 * Get stock level count
 * @returns {Promise<Object>} Stock level count
 */
export const getStockLevelCount = async () => {
  return await api.get('/stock-levels/count');
};
