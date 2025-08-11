/**
 * Purchase Order Service
 * Handles all purchase order-related API calls
 */

import api from '../api';

// Purchase Order CRUD operations
export const createPurchaseOrder = async (purchaseOrderData) => {
  return api.post('/purchase-orders', purchaseOrderData);
};

export const getAllPurchaseOrders = async (page = 0, size = 10) => {
  return api.get(`/purchase-orders?page=${page}&size=${size}`);
};

export const getPurchaseOrderById = async (id) => {
  return api.get(`/purchase-orders/${id}`);
};

export const updatePurchaseOrder = async (id, purchaseOrderData) => {
  return api.put(`/purchase-orders/${id}`, purchaseOrderData);
};

export const deletePurchaseOrder = async (id) => {
  return api.delete(`/purchase-orders/${id}`);
};

export const getPurchaseOrdersBySupplier = async (supplierId, page = 0, size = 10) => {
  return api.get(`/purchase-orders/supplier/${supplierId}?page=${page}&size=${size}`);
};

export const getPurchaseOrdersByStatus = async (status, page = 0, size = 10) => {
  return api.get(`/purchase-orders/status/${status}?page=${page}&size=${size}`);
};

/**
 * Get purchase orders by date range with pagination
 * @param {string} startDate - Start date in YYYY-MM-DD format
 * @param {string} endDate - End date in YYYY-MM-DD format
 * @param {number} page - Page number (0-based)
 * @param {number} size - Page size
 * @returns {Promise<Object>} Paginated purchase orders for date range
 */
export const getPurchaseOrdersByDateRange = async (startDate, endDate, page = 0, size = 10) => {
  const params = `?startDate=${startDate}&endDate=${endDate}&page=${page}&size=${size}`;
  return await api.get(`/purchase-orders/date-range${params}`);
};

/**
 * Approve purchase order
 * @param {string|number} id - Purchase order ID
 * @returns {Promise<Object>} Approval response
 */
export const approvePurchaseOrder = async (id) => {
  return await api.put(`/purchase-orders/${id}/approve`);
};

/**
 * Reject purchase order
 * @param {string|number} id - Purchase order ID
 * @param {Object} rejectionData - Rejection reason
 * @returns {Promise<Object>} Rejection response
 */
export const rejectPurchaseOrder = async (id, rejectionData) => {
  return await api.put(`/purchase-orders/${id}/reject`, rejectionData);
};

/**
 * Get purchase order count
 * @returns {Promise<Object>} Purchase order count
 */
export const getPurchaseOrderCount = async () => {
  return await api.get('/purchase-orders/count');
};
