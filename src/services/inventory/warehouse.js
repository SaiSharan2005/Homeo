import { getData, postData, putData, deleteData } from '../api';

// Fetch all warehouses
export const fetchWarehouses = async () => {
  return await getData('/warehouses');
};

// Fetch a single warehouse by ID
export const fetchWarehouseById = async (id) => {
  return await getData(`/warehouses/${id}`);
};

// Create a new warehouse
export const createWarehouse = async (warehouseDto) => {
  return await postData('/warehouses', warehouseDto);
};

// Update an existing warehouse
export const updateWarehouse = async (id, warehouseDto) => {
  return await putData(`/warehouses/${id}`, warehouseDto);
};

// Delete a warehouse
export const deleteWarehouse = async (id) => {
  return await deleteData(`/warehouses/${id}`);
};