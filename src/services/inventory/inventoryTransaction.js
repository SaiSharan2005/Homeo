import { getData, postData, putData, deleteData } from '../api';

// Fetch all inventory transactions
export const fetchInventoryTransactions = async () => {
  return await getData('/inventory-transactions');
};

// Fetch a single transaction by ID
export const fetchInventoryTransactionById = async (id) => {
  return await getData(`/inventory-transactions/${id}`);
};

// Fetch all transactions for a given inventory item
export const fetchTransactionsByInventoryItemId = async (inventoryItemId) => {
  return await getData(`/inventory-transactions/item/${inventoryItemId}`);
};

// Create a new transaction
export const createInventoryTransaction = async (transactionDto) => {
  return await postData('/inventory-transactions', transactionDto);
};

// Update an existing transaction
export const updateInventoryTransaction = async (id, transactionDto) => {
  return await putData(`/inventory-transactions/${id}`, transactionDto);
};

// Delete a transaction
export const deleteInventoryTransaction = async (id) => {
  return await deleteData(`/inventory-transactions/${id}`);
};
