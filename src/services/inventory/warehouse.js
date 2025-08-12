/**
 * Warehouse Service
 * Handles all warehouse-related API calls
 */

import { api } from '../api';

/**
 * Get all warehouses with pagination
 * @param {number} page - Page number (0-based)
 * @param {number} size - Page size
 * @returns {Promise<Object>} Paginated warehouses
 */
export const getWarehouses = async (page = 0, size = 10) => {
  return await api.get(`/warehouses?page=${page}&size=${size}`);
};

/**
 * Get warehouse by ID
 * @param {string|number} id - Warehouse ID
 * @returns {Promise<Object>} Warehouse data
 */
export const getWarehouseById = async (id) => {
  return await api.get(`/warehouses/${id}`);
};

/**
 * Create new warehouse
 * @param {Object} warehouseData - Warehouse data
 * @returns {Promise<Object>} Created warehouse
 */
export const createWarehouse = async (warehouseData) => {
  return await api.post('/warehouses', warehouseData);
};

/**
 * Update warehouse
 * @param {string|number} id - Warehouse ID
 * @param {Object} warehouseData - Updated warehouse data
 * @returns {Promise<Object>} Updated warehouse
 */
export const updateWarehouse = async (id, warehouseData) => {
  return await api.put(`/warehouses/${id}`, warehouseData);
};

/**
 * Delete warehouse
 * @param {string|number} id - Warehouse ID
 * @returns {Promise<null>} Success response
 */
export const deleteWarehouse = async (id) => {
  return await api.delete(`/warehouses/${id}`);
};

/**
 * Get all warehouses without pagination (for dropdowns)
 * @returns {Promise<Array>} All warehouses
 */
export const getAllWarehouses = async () => {
  return await api.get('/warehouses/all');
};

/**
 * Get warehouse count
 * @returns {Promise<Object>} Warehouse count
 */
export const getWarehouseCount = async () => {
  return await api.get('/warehouses/count');
};

// Legacy alias used by UI
export const fetchWarehouses = (page = 0, size = 10) => getWarehouses(page, size);