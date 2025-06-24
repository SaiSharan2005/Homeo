import { getData, postData, putData, deleteData } from '../api';

// Fetch all purchase orders
export const fetchPurchaseOrders = async () => {
  return await getData('/purchase-orders');
};

// Fetch a single purchase order by ID
export const fetchPurchaseOrderById = async (id) => {
  return await getData(`/purchase-orders/${id}`);
};

// Create a new purchase order
export const createPurchaseOrder = async (orderDto) => {
  return await postData('/purchase-orders', orderDto);
};

// Update an existing purchase order
export const updatePurchaseOrder = async (id, orderDto) => {
  return await putData(`/purchase-orders/${id}`, orderDto);
};

// Delete a purchase order
export const deletePurchaseOrder = async (id) => {
  return await deleteData(`/purchase-orders/${id}`);
};

// Recalculate total for a purchase order
export const recalculatePurchaseOrder = async (id) => {
  return await putData(`/purchase-orders/${id}/recalculate`, {});
};
