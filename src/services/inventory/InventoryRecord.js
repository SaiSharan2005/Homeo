import { getData, postData, putData, deleteData } from '../api';

// Fetch all inventory records
export const fetchInventoryRecords = async () => {
  return await getData('/inventory-records');
};

// Fetch a single inventory record by ID
export const fetchInventoryRecordById = async (id) => {
  return await getData(`/inventory-records/${id}`);
};

// Fetch all records for a given inventory item
export const fetchRecordsByInventoryItemId = async (inventoryItemId) => {
  return await getData(`/inventory-records/item/${inventoryItemId}`);
};

// Create a new inventory record
export const createInventoryRecord = async (recordDto) => {
  return await postData('/inventory-records', recordDto);
};

// Update an existing inventory record
export const updateInventoryRecord = async (id, recordDto) => {
  return await putData(`/inventory-records/${id}`, recordDto);
};

// Delete an inventory record
export const deleteInventoryRecord = async (id) => {
  return await deleteData(`/inventory-records/${id}`);
};

// Increase the quantity of a record by a specified amount
export const increaseInventoryRecord = async (id, amount) => {
  return await putData(`/inventory-records/${id}/increase?amount=${amount}`, {});
};

// Decrease the quantity of a record by a specified amount
export const decreaseInventoryRecord = async (id, amount) => {
  return await putData(`/inventory-records/${id}/decrease?amount=${amount}`, {});
};
