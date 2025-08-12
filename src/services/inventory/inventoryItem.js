/**
 * Inventory Item Service
 * Handles all inventory item-related API calls
 */

import { api } from '../api';

/**
 * Get all inventory items with pagination
 * @param {number} page - Page number (0-based)
 * @param {number} size - Page size
 * @returns {Promise<Object>} Paginated inventory items
 */
export const getInventoryItems = async (page = 0, size = 10) => {
  return await api.get(`/inventory-items?page=${page}&size=${size}`);
};

/**
 * Get inventory item by ID
 * @param {string|number} id - Inventory item ID
 * @returns {Promise<Object>} Inventory item data
 */
export const getInventoryItemById = async (id) => {
  return await api.get(`/inventory-items/${id}`);
};

/**
 * Create new inventory item (multipart/form-data)
 * Backend expects @RequestPart("inventoryItem") JSON and optional @RequestPart("image") file
 * @param {Object} itemData - Inventory item data
 * @param {File|undefined} imageFile - Optional image file
 * @returns {Promise<Object>} Created inventory item
 */
export const createInventoryItem = async (itemData, imageFile) => {
  const formData = new FormData();
  formData.append('inventoryItem', new Blob([JSON.stringify(itemData)], { type: 'application/json' }));
  if (imageFile) {
    formData.append('image', imageFile);
  }
  return await api.post('/inventory-items', formData);
};

/**
 * Update inventory item (multipart/form-data)
 * Backend expects @RequestPart("inventoryItem") JSON and optional @RequestPart("image") file
 * @param {string|number} id - Inventory item ID
 * @param {Object} itemData - Updated inventory item data
 * @param {File|undefined} imageFile - Optional image file
 * @returns {Promise<Object>} Updated inventory item
 */
export const updateInventoryItem = async (id, itemData, imageFile) => {
  const formData = new FormData();
  formData.append('inventoryItem', new Blob([JSON.stringify(itemData)], { type: 'application/json' }));
  if (imageFile) {
    formData.append('image', imageFile);
  }
  return await api.put(`/inventory-items/${id}`, formData);
};

/**
 * Delete inventory item
 * @param {string|number} id - Inventory item ID
 * @returns {Promise<null>} Success response
 */
export const deleteInventoryItem = async (id) => {
  return await api.delete(`/inventory-items/${id}`);
};

/**
 * Get inventory items by category with pagination
 * @param {string|number} categoryId - Category ID
 * @param {number} page - Page number (0-based)
 * @param {number} size - Page size
 * @returns {Promise<Object>} Paginated inventory items for category
 */
export const getInventoryItemsByCategory = async (categoryId, page = 0, size = 10) => {
  return await api.get(`/inventory-items/category/${categoryId}?page=${page}&size=${size}`);
};

/**
 * Search inventory items by name or description
 * @param {string} searchTerm - Search term
 * @param {number} page - Page number (0-based)
 * @param {number} size - Page size
 * @returns {Promise<Object>} Paginated search results
 */
export const searchInventoryItems = async (searchTerm, page = 0, size = 10) => {
  return await api.get(`/inventory-items/search?q=${encodeURIComponent(searchTerm)}&page=${page}&size=${size}`);
};

/**
 * Upload inventory item image
 * @param {string|number} id - Inventory item ID
 * @param {File} imageFile - Image file
 * @returns {Promise<Object>} Upload response
 */
// Note: image is uploaded alongside create/update via multipart; separate endpoint not used

/**
 * Get inventory item count
 * @returns {Promise<Object>} Inventory item count
 */
export const getInventoryItemCount = async () => {
  return await api.get('/inventory-items/count');
};

// Legacy alias used by UI
export const fetchInventoryItems = (page = 0, size = 10) => getInventoryItems(page, size);