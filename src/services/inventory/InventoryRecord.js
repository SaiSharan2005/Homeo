/**
 * Inventory Record Service
 * Handles all inventory record-related API calls
 */

import { api } from '../api';

/**
 * Get all inventory records with pagination
 * @param {number} page - Page number (0-based)
 * @param {number} size - Page size
 * @returns {Promise<Object>} Paginated inventory records
 */
export const getInventoryRecords = async (page = 0, size = 10) => {
  return await api.get(`/inventory-records?page=${page}&size=${size}`);
};

/**
 * Get inventory record by ID
 * @param {string|number} id - Inventory record ID
 * @returns {Promise<Object>} Inventory record data
 */
export const getInventoryRecordById = async (id) => {
  return await api.get(`/inventory-records/${id}`);
};

/**
 * Create new inventory record
 * @param {Object} recordData - Inventory record data
 * @returns {Promise<Object>} Created inventory record
 */
export const createInventoryRecord = async (recordData) => {
  return await api.post('/inventory-records', recordData);
};

/**
 * Update inventory record
 * @param {string|number} id - Inventory record ID
 * @param {Object} recordData - Updated inventory record data
 * @returns {Promise<Object>} Updated inventory record
 */
export const updateInventoryRecord = async (id, recordData) => {
  return await api.put(`/inventory-records/${id}`, recordData);
};

/**
 * Delete inventory record
 * @param {string|number} id - Inventory record ID
 * @returns {Promise<null>} Success response
 */
export const deleteInventoryRecord = async (id) => {
  return await api.delete(`/inventory-records/${id}`);
};

/**
 * Get inventory records by item ID with pagination
 * @param {string|number} itemId - Inventory item ID
 * @param {number} page - Page number (0-based)
 * @param {number} size - Page size
 * @returns {Promise<Object>} Paginated inventory records for item
 */
export const getInventoryRecordsByItem = async (itemId, page = 0, size = 10) => {
  return await api.get(`/inventory-records/item/${itemId}?page=${page}&size=${size}`);
};

/**
 * Get inventory records by warehouse ID with pagination
 * @param {string|number} warehouseId - Warehouse ID
 * @param {number} page - Page number (0-based)
 * @param {number} size - Page size
 * @returns {Promise<Object>} Paginated inventory records for warehouse
 */
export const getInventoryRecordsByWarehouse = async (warehouseId, page = 0, size = 10) => {
  return await api.get(`/inventory-records/warehouse/${warehouseId}?page=${page}&size=${size}`);
};

/**
 * Get inventory record count
 * @returns {Promise<Object>} Inventory record count
 */
export const getInventoryRecordCount = async () => {
  return await api.get('/inventory-records/count');
};

// Legacy aliases used by UI
export const fetchInventoryRecords = (page = 0, size = 10) => getInventoryRecords(page, size);
export const fetchInventoryRecordById = (id) => getInventoryRecordById(id);