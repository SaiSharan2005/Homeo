import api from '../api';

// Goods Receipt CRUD operations
export const createGoodsReceipt = async (goodsReceiptData) => {
  return api.post('/goods-receipts', goodsReceiptData);
};

export const getAllGoodsReceipts = async (page = 0, size = 10) => {
  return api.get(`/goods-receipts?page=${page}&size=${size}`);
};

export const getGoodsReceiptById = async (id) => {
  return api.get(`/goods-receipts/${id}`);
};

export const updateGoodsReceipt = async (id, goodsReceiptData) => {
  return api.put(`/goods-receipts/${id}`, goodsReceiptData);
};

export const deleteGoodsReceipt = async (id) => {
  return api.delete(`/goods-receipts/${id}`);
};

export const getGoodsReceiptsByPurchaseOrder = async (purchaseOrderId) => {
  // Backend returns a List for this endpoint (no pagination)
  return api.get(`/goods-receipts/by-purchase-order/${purchaseOrderId}`);
};

export const getGoodsReceiptsBySupplier = async (supplierId, page = 0, size = 10) => {
  return api.get(`/goods-receipts/supplier/${supplierId}?page=${page}&size=${size}`);
};

export const getGoodsReceiptsByDateRange = async (startDate, endDate, page = 0, size = 10) => {
  return api.get(`/goods-receipts/date-range?startDate=${startDate}&endDate=${endDate}&page=${page}&size=${size}`);
};
