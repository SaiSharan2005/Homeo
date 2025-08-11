import { api } from '../api';

// Payment Terms CRUD operations
export const createPaymentTerms = async (paymentTermsData) => {
  return api.post('/payment-terms', paymentTermsData);
};

export const getAllPaymentTerms = async (page = 0, size = 10) => {
  return api.get(`/payment-terms?page=${page}&size=${size}`);
};

export const getPaymentTermsById = async (id) => {
  return api.get(`/payment-terms/${id}`);
};

export const updatePaymentTerms = async (id, paymentTermsData) => {
  return api.put(`/payment-terms/${id}`, paymentTermsData);
};

export const deletePaymentTerms = async (id) => {
  return api.delete(`/payment-terms/${id}`);
};

export const getPaymentTermsByType = async (type, page = 0, size = 10) => {
  return api.get(`/payment-terms/type/${type}?page=${page}&size=${size}`);
};

export const getActivePaymentTerms = async (page = 0, size = 10) => {
  return api.get(`/payment-terms/active?page=${page}&size=${size}`);
};

export const getPaymentTermsCount = async () => {
  return api.get('/payment-terms/count');
};
