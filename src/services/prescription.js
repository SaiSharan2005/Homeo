/**
 * Prescription Service
 * Handles all prescription-related API calls
 */

import { api } from './api';

/**
 * Get all prescriptions with pagination
 * @param {number} page - Page number (0-based)
 * @param {number} size - Page size
 * @returns {Promise<Object>} Paginated prescriptions
 */
export const getPrescriptions = async (page = 0, size = 10) => {
  return await api.get(`/prescriptions?page=${page}&size=${size}`);
};

/**
 * Get prescription by ID
 * @param {string|number} id - Prescription ID
 * @returns {Promise<Object>} Prescription data
 */
export const getPrescriptionById = async (id) => {
  return await api.get(`/prescriptions/${id}`);
};

/**
 * Create new prescription
 * @param {Object} prescriptionData - Prescription data
 * @returns {Promise<Object>} Created prescription
 */
export const createPrescription = async (prescriptionData) => {
  return await api.post('/prescriptions', prescriptionData);
};

/**
 * Update prescription
 * @param {string|number} id - Prescription ID
 * @param {Object} prescriptionData - Updated prescription data
 * @returns {Promise<Object>} Updated prescription
 */
export const updatePrescription = async (id, prescriptionData) => {
  return await api.put(`/prescriptions/${id}`, prescriptionData);
};

/**
 * Delete prescription
 * @param {string|number} id - Prescription ID
 * @returns {Promise<null>} Success response
 */
export const deletePrescription = async (id) => {
  return await api.delete(`/prescriptions/${id}`);
};

/**
 * Get prescription items by prescription ID
 * @param {string|number} prescriptionId - Prescription ID
 * @param {number} page - Page number (0-based)
 * @param {number} size - Page size
 * @returns {Promise<Object>} Paginated prescription items
 */
export const getPrescriptionItems = async (prescriptionId, page = 0, size = 10) => {
  return await api.get(`/prescriptions/${prescriptionId}/items?page=${page}&size=${size}`);
};

/**
 * Add prescription item
 * @param {string|number} prescriptionId - Prescription ID
 * @param {Object} itemData - Prescription item data
 * @returns {Promise<Object>} Created prescription item
 */
export const addPrescriptionItem = async (prescriptionId, itemData) => {
  return await api.post(`/prescriptions/${prescriptionId}/items`, itemData);
};

/**
 * Get prescriptions by patient ID with pagination
 * @param {string|number} patientId - Patient ID
 * @param {number} page - Page number (0-based)
 * @param {number} size - Page size
 * @returns {Promise<Object>} Paginated prescriptions for patient
 */
export const getPrescriptionsByPatient = async (patientId, page = 0, size = 10) => {
  return await api.get(`/prescriptions/patient/${patientId}?page=${page}&size=${size}`);
};

/**
 * Get prescriptions by doctor ID with pagination
 * @param {string|number} doctorId - Doctor ID
 * @param {number} page - Page number (0-based)
 * @param {number} size - Page size
 * @returns {Promise<Object>} Paginated prescriptions for doctor
 */
export const getPrescriptionsByDoctor = async (doctorId, page = 0, size = 10) => {
  return await api.get(`/prescriptions/doctor/${doctorId}?page=${page}&size=${size}`);
}; 