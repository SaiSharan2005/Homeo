/**
 * Inventory Transaction Service
 * Handles all inventory transaction-related API calls
 */

import { api } from '../api';

/**
 * Get all inventory transactions with pagination
 * @param {number} page - Page number (0-based)
 * @param {number} size - Page size
 * @returns {Promise<Object>} Paginated inventory transactions
 */
export const getInventoryTransactions = async (page = 0, size = 10) => {
  return await api.get(`/inventory-transactions?page=${page}&size=${size}`);
};

/**
 * Get inventory transaction by ID
 * @param {string|number} id - Inventory transaction ID
 * @returns {Promise<Object>} Inventory transaction data
 */
export const getInventoryTransactionById = async (id) => {
  return await api.get(`/inventory-transactions/${id}`);
};

/**
 * Create new inventory transaction
 * @param {Object} transactionData - Inventory transaction data
 * @returns {Promise<Object>} Created inventory transaction
 */
export const createInventoryTransaction = async (transactionData) => {
  return await api.post('/inventory-transactions', transactionData);
};

/**
 * Update inventory transaction
 * @param {string|number} id - Inventory transaction ID
 * @param {Object} transactionData - Updated inventory transaction data
 * @returns {Promise<Object>} Updated inventory transaction
 */
export const updateInventoryTransaction = async (id, transactionData) => {
  return await api.put(`/inventory-transactions/${id}`, transactionData);
};

/**
 * Delete inventory transaction
 * @param {string|number} id - Inventory transaction ID
 * @returns {Promise<null>} Success response
 */
export const deleteInventoryTransaction = async (id) => {
  return await api.delete(`/inventory-transactions/${id}`);
};

/**
 * Get inventory transactions by item ID with pagination
 * @param {string|number} itemId - Inventory item ID
 * @param {number} page - Page number (0-based)
 * @param {number} size - Page size
 * @returns {Promise<Object>} Paginated inventory transactions for item
 */
export const getInventoryTransactionsByItem = async (itemId, page = 0, size = 10) => {
  return await api.get(`/inventory-transactions/item/${itemId}?page=${page}&size=${size}`);
};

/**
 * Get inventory transactions by warehouse ID with pagination
 * @param {string|number} warehouseId - Warehouse ID
 * @param {number} page - Page number (0-based)
 * @param {number} size - Page size
 * @returns {Promise<Object>} Paginated inventory transactions for warehouse
 */
export const getInventoryTransactionsByWarehouse = async (warehouseId, page = 0, size = 10) => {
  return await api.get(`/inventory-transactions/warehouse/${warehouseId}?page=${page}&size=${size}`);
};

/**
 * Get inventory transactions by date range with pagination
 * @param {string} startDate - Start date in YYYY-MM-DD format
 * @param {string} endDate - End date in YYYY-MM-DD format
 * @param {number} page - Page number (0-based)
 * @param {number} size - Page size
 * @returns {Promise<Object>} Paginated inventory transactions for date range
 */
export const getInventoryTransactionsByDateRange = async (startDate, endDate, page = 0, size = 10) => {
  const params = `?startDate=${startDate}&endDate=${endDate}&page=${page}&size=${size}`;
  return await api.get(`/inventory-transactions/date-range${params}`);
};

/**
 * Get inventory transaction count
 * @returns {Promise<Object>} Inventory transaction count
 */
export const getInventoryTransactionCount = async () => {
  return await api.get('/inventory-transactions/count');
};

// Legacy alias used by UI
export const fetchInventoryTransactions = (page = 0, size = 10) => getInventoryTransactions(page, size);