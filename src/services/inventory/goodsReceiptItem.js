import api from '../api';

// Goods Receipt Item CRUD operations
export const createGoodsReceiptItem = async (goodsReceiptItemData) => {
  return api.post('/goods-receipt-items', goodsReceiptItemData);
};

export const getAllGoodsReceiptItems = async (page = 0, size = 10) => {
  return api.get(`/goods-receipt-items?page=${page}&size=${size}`);
};

export const getGoodsReceiptItemById = async (id) => {
  return api.get(`/goods-receipt-items/${id}`);
};

export const updateGoodsReceiptItem = async (id, goodsReceiptItemData) => {
  return api.put(`/goods-receipt-items/${id}`, goodsReceiptItemData);
};

export const deleteGoodsReceiptItem = async (id) => {
  return api.delete(`/goods-receipt-items/${id}`);
};

export const getGoodsReceiptItemsByGoodsReceipt = async (goodsReceiptId, page = 0, size = 10) => {
  return api.get(`/goods-receipt-items/goods-receipt/${goodsReceiptId}?page=${page}&size=${size}`);
};

export const getGoodsReceiptItemsByProduct = async (productId, page = 0, size = 10) => {
  return api.get(`/goods-receipt-items/product/${productId}?page=${page}&size=${size}`);
};

export const getGoodsReceiptItemsByBatch = async (batchId, page = 0, size = 10) => {
  return api.get(`/goods-receipt-items/batch/${batchId}?page=${page}&size=${size}`);
};
