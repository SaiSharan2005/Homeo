/**
 * Payment Service
 * Handles all payment-related API calls
 */

import { api } from '../api';

/**
 * Get all payments with pagination
 * @param {number} page - Page number (0-based)
 * @param {number} size - Page size
 * @returns {Promise<Object>} Paginated payments
 */
export const getPayments = async (page = 0, size = 10) => {
  return await api.get(`/payments?page=${page}&size=${size}`);
};

/**
 * Get payment by ID
 * @param {string|number} id - Payment ID
 * @returns {Promise<Object>} Payment data
 */
export const getPaymentById = async (id) => {
  return await api.get(`/payments/${id}`);
};

/**
 * Create new payment
 * @param {Object} paymentData - Payment data
 * @returns {Promise<Object>} Created payment
 */
export const createPayment = async (paymentData) => {
  return await api.post('/payments', paymentData);
};

/**
 * Update payment
 * @param {string|number} id - Payment ID
 * @param {Object} paymentData - Updated payment data
 * @returns {Promise<Object>} Updated payment
 */
export const updatePayment = async (id, paymentData) => {
  return await api.put(`/payments/${id}`, paymentData);
};

/**
 * Delete payment
 * @param {string|number} id - Payment ID
 * @returns {Promise<null>} Success response
 */
export const deletePayment = async (id) => {
  return await api.delete(`/payments/${id}`);
};

/**
 * Get payments by invoice ID with pagination
 * @param {string|number} invoiceId - Invoice ID
 * @param {number} page - Page number (0-based)
 * @param {number} size - Page size
 * @returns {Promise<Object>} Paginated payments for invoice
 */
export const getPaymentsByInvoice = async (invoiceId, page = 0, size = 10) => {
  return await api.get(`/payments/invoice/${invoiceId}?page=${page}&size=${size}`);
};

/**
 * Get payments by patient ID with pagination
 * @param {string|number} patientId - Patient ID
 * @param {number} page - Page number (0-based)
 * @param {number} size - Page size
 * @returns {Promise<Object>} Paginated payments for patient
 */
export const getPaymentsByPatient = async (patientId, page = 0, size = 10) => {
  return await api.get(`/payments/patient/${patientId}?page=${page}&size=${size}`);
};

/**
 * Get payment count
 * @returns {Promise<Object>} Payment count
 */
export const getPaymentCount = async () => {
  return await api.get('/payments/count');
};

/**
 * Upload payment proof
 * @param {string|number} id - Payment ID
 * @param {File} proofFile - Payment proof file
 * @returns {Promise<Object>} Upload response
 */
export const uploadPaymentProof = async (id, proofFile) => {
  const formData = new FormData();
  formData.append('proof', proofFile);
  return await api.post(`/payments/${id}/proof`, formData);
};

/**
 * Get payment for a prescription
 * @param {string|number} prescriptionId - Prescription ID
 * @returns {Promise<Object>} Payment data associated with the prescription
 */
export const getPaymentByPrescription = async (prescriptionId) => {
  return await api.get(`/payments/prescription/${prescriptionId}`);
};