import api from '../api';

// Purchase Order Item CRUD operations
export const createPurchaseOrderItem = async (purchaseOrderItemData) => {
  return api.post('/purchase-order-items', purchaseOrderItemData);
};

export const getAllPurchaseOrderItems = async (page = 0, size = 10) => {
  return api.get(`/purchase-order-items?page=${page}&size=${size}`);
};

export const getPurchaseOrderItemById = async (id) => {
  return api.get(`/purchase-order-items/${id}`);
};

export const updatePurchaseOrderItem = async (id, purchaseOrderItemData) => {
  return api.put(`/purchase-order-items/${id}`, purchaseOrderItemData);
};

export const deletePurchaseOrderItem = async (id) => {
  return api.delete(`/purchase-order-items/${id}`);
};

export const getPurchaseOrderItemsByPurchaseOrder = async (purchaseOrderId, page = 0, size = 10) => {
  return api.get(`/purchase-order-items/purchase-order/${purchaseOrderId}?page=${page}&size=${size}`);
};

export const getPurchaseOrderItemsByProduct = async (productId, page = 0, size = 10) => {
  return api.get(`/purchase-order-items/product/${productId}?page=${page}&size=${size}`);
};
