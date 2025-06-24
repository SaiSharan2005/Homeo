import { getData, postData, putData, deleteData } from '../api';

// Fetch all inventory items
export const fetchInventoryItems = async () => {
  return await getData('/inventory-items');
};

// Fetch a single inventory item by ID
export const fetchInventoryItemById = async (id) => {
  return await getData(`/inventory-items/${id}`);
};

// Create a new inventory item (with optional image)
export const createInventoryItem = async (itemDto, imageFile) => {
  const formData = new FormData();
  formData.append('inventoryItem', new Blob([JSON.stringify(itemDto)], { type: 'application/json' }));
  if (imageFile) formData.append('image', imageFile);
  return await postData('/inventory-items', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
};

// Update an existing inventory item (with optional image)
export const updateInventoryItem = async (id, itemDto, imageFile) => {
  const formData = new FormData();
  formData.append('inventoryItem', new Blob([JSON.stringify(itemDto)], { type: 'application/json' }));
  if (imageFile) formData.append('image', imageFile);
  return await putData(`/inventory-items/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
};

// Delete an inventory item
export const deleteInventoryItem = async (id) => {
  return await deleteData(`/inventory-items/${id}`);
};

// Update stock for an inventory item by a change amount
export const updateInventoryItemStock = async (id, change) => {
  return await putData(`/inventory-items/${id}/stock?change=${change}`, {});
};
