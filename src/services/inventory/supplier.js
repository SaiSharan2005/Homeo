import { getData, postData, putData, deleteData } from '../api';

// Fetch all suppliers
export const fetchSuppliers = async () => {
  return await getData('/suppliers');
};

// Fetch a single supplier by ID
export const fetchSupplierById = async (id) => {
  return await getData(`/suppliers/${id}`);
};

// Create a new supplier
export const createSupplier = async (supplierDto) => {
  return await postData('/suppliers', supplierDto);
};

// Update an existing supplier
export const updateSupplier = async (id, supplierDto) => {
  return await putData(`/suppliers/${id}`, supplierDto);
};

// Delete a supplier
export const deleteSupplier = async (id) => {
  return await deleteData(`/suppliers/${id}`);
};
