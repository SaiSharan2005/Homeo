/**
 * Doctor Appointment Service
 * Handles doctor-specific appointment operations
 */

import { api } from '../api';

/**
 * Get appointments by doctor ID with pagination
 * @param {string|number} doctorId - Doctor ID
 * @param {number} page - Page number (0-based)
 * @param {number} size - Page size
 * @returns {Promise<Object>} Paginated appointments for doctor
 */
export const getAppointmentsByDoctor = async (doctorId, page = 0, size = 10) => {
  return await api.get(`/bookingAppointments/doctor/${doctorId}?page=${page}&size=${size}`);
};

/**
 * Get my appointments (for logged-in doctor) with pagination
 * @param {number} page - Page number (0-based)
 * @param {number} size - Page size
 * @returns {Promise<Object>} Paginated appointments for current doctor
 */
export const getMyAppointments = async (page = 0, size = 10) => {
  return await api.get(`/bookingAppointments/doctor/my-appointments?page=${page}&size=${size}`);
};

/**
 * Complete appointment
 * @param {string} token - Appointment completion token
 * @returns {Promise<Object>} Completion response
 */
export const completeAppointment = async (token) => {
  return await api.post(`/bookingAppointments/completed-appointment/${token}`, {});
};

/**
 * Update prescription image for appointment
 * @param {string|number} bookingId - Booking appointment ID
 * @param {File} file - Prescription image file
 * @returns {Promise<Object>} Update response
 */
export const updatePrescriptionImage = async (bookingId, file) => {
  const formData = new FormData();
  formData.append('file', file);
  return await api.put(`/bookingAppointments/${bookingId}/prescription`, formData);
};

/**
 * Get appointment count for doctor
 * @param {string|number} doctorId - Doctor ID
 * @returns {Promise<Object>} Appointment count
 */
export const getAppointmentCount = async (doctorId) => {
  return await api.get(`/bookingAppointments/doctor/${doctorId}/count`);
};

/**
 * Get appointments by schedule ID with pagination
 * @param {string|number} scheduleId - Schedule ID
 * @param {number} page - Page number (0-based)
 * @param {number} size - Page size
 * @returns {Promise<Object>} Paginated appointments for schedule
 */
export const getAppointmentsBySchedule = async (scheduleId, page = 0, size = 10) => {
  return await api.get(`/bookingAppointments/schedule/${scheduleId}?page=${page}&size=${size}`);
};

// Legacy helper used by doctor Schedule page
export const fetchDoctorTiming = async () => {
  return await api.get(`/doctor-timings/doctor/in-use`);
};