import { getData, postData, putData, deleteData } from '../api';

// Fetch a single purchase order item by ID
export const fetchPurchaseOrderItemById = async (id) => {
  return await getData(`/purchase-order-items/${id}`);
};

// Fetch all purchase order items for a given purchase order
export const fetchPurchaseOrderItemsByOrderId = async (orderId) => {
  return await getData(`/purchase-order-items/order/${orderId}`);
};

// Create a new purchase order item
export const createPurchaseOrderItem = async (itemDto) => {
  return await postData('/purchase-order-items', itemDto);
};

// Update an existing purchase order item
export const updatePurchaseOrderItem = async (id, itemDto) => {
  return await putData(`/purchase-order-items/${id}`, itemDto);
};

// Delete a purchase order item
export const deletePurchaseOrderItem = async (id) => {
  return await deleteData(`/purchase-order-items/${id}`);
};
