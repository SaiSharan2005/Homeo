/**
 * Invoice Service
 * Handles all invoice-related API calls
 */

import { api } from '../api';

/**
 * Get all invoices with pagination
 * @param {number} page - Page number (0-based)
 * @param {number} size - Page size
 * @returns {Promise<Object>} Paginated invoices
 */
export const getInvoices = async (page = 0, size = 10) => {
  return await api.get(`/invoices?page=${page}&size=${size}`);
};

/**
 * Get invoice by ID
 * @param {string|number} id - Invoice ID
 * @returns {Promise<Object>} Invoice data
 */
export const getInvoiceById = async (id) => {
  return await api.get(`/invoices/${id}`);
};

/**
 * Create new invoice
 * @param {Object} invoiceData - Invoice data
 * @returns {Promise<Object>} Created invoice
 */
export const createInvoice = async (invoiceData) => {
  return await api.post('/invoices', invoiceData);
};

/**
 * Update invoice
 * @param {string|number} id - Invoice ID
 * @param {Object} invoiceData - Updated invoice data
 * @returns {Promise<Object>} Updated invoice
 */
export const updateInvoice = async (id, invoiceData) => {
  return await api.put(`/invoices/${id}`, invoiceData);
};

/**
 * Delete invoice
 * @param {string|number} id - Invoice ID
 * @returns {Promise<null>} Success response
 */
export const deleteInvoice = async (id) => {
  return await api.delete(`/invoices/${id}`);
};

/**
 * Get invoices by patient ID with pagination
 * @param {string|number} patientId - Patient ID
 * @param {number} page - Page number (0-based)
 * @param {number} size - Page size
 * @returns {Promise<Object>} Paginated invoices for patient
 */
export const getInvoicesByPatient = async (patientId, page = 0, size = 10) => {
  return await api.get(`/invoices/patient/${patientId}?page=${page}&size=${size}`);
};

/**
 * Get invoices by doctor ID with pagination
 * @param {string|number} doctorId - Doctor ID
 * @param {number} page - Page number (0-based)
 * @param {number} size - Page size
 * @returns {Promise<Object>} Paginated invoices for doctor
 */
export const getInvoicesByDoctor = async (doctorId, page = 0, size = 10) => {
  return await api.get(`/invoices/doctor/${doctorId}?page=${page}&size=${size}`);
};

/**
 * Get invoice count
 * @returns {Promise<Object>} Invoice count
 */
export const getInvoiceCount = async () => {
  return await api.get('/invoices/count');
};
