/**
 * Appointment Service
 * Handles all appointment-related API calls
 */

import { getData, postData, putData, deleteData } from './api';

/**
 * Get all booking appointments with pagination
 * @param {number} page - Page number (0-based)
 * @param {number} size - Page size
 * @returns {Promise<Object>} Paginated appointments
 */
export const getBookingAppointments = async (page = 0, size = 10) => {
  return await getData(`/bookingAppointments?page=${page}&size=${size}`);
};

/**
 * Get appointment by ID
 * @param {string|number} id - Appointment ID
 * @returns {Promise<Object>} Appointment data
 */
export const getAppointmentById = async (id) => {
  return await getData(`/bookingAppointments/${id}`);
};

/**
 * Create new appointment
 * @param {Object} appointmentData - Appointment data
 * @returns {Promise<Object>} Created appointment
 */
export const createAppointment = async (appointmentData) => {
  return await postData('/bookingAppointments', appointmentData);
};

/**
 * Update appointment
 * @param {string|number} id - Appointment ID
 * @param {Object} appointmentData - Updated appointment data
 * @returns {Promise<Object>} Updated appointment
 */
export const updateAppointment = async (id, appointmentData) => {
  return await putData(`/bookingAppointments/${id}`, appointmentData);
};

/**
 * Delete appointment
 * @param {string|number} id - Appointment ID
 * @returns {Promise<null>} Success response
 */
export const deleteAppointment = async (id) => {
  return await deleteData(`/bookingAppointments/${id}`);
};

/**
 * Get doctor schedule
 * @param {string|number} doctorId - Doctor ID
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Promise<Object>} Doctor schedule
 */
export const getDoctorSchedule = async (doctorId, date) => {
  if (date) {
    return await getData(`/schedule/doctor/${doctorId}/date/${date}`);
  }
  return await getData(`/schedule/doctor/${doctorId}`);
};

/**
 * Get appointment by token
 * @param {string} token - appointment token
 */
export const getAppointmentByToken = async (token) => {
  return await getData(`/bookingAppointments/token/${token}`);
};

/**
 * Get doctor timings
 * @param {string|number} doctorId - Doctor ID
 * @returns {Promise<Object>} Doctor timings
 */
export const getDoctorTimings = async (doctorId) => {
  return await getData(`/doctor-timings/${doctorId}`);
};

/**
 * Create appointment slots
 * @param {Object} slotData - Slot creation data
 * @returns {Promise<Object>} Created slots
 */
export const createAppointmentSlots = async (slotData) => {
  return await postData('/create-appointment-slots', slotData);
}; 

// Legacy aliases used by pages
export const fetchAppointments = (page = 0, size = 10) => getBookingAppointments(page, size);
export const getAppointmentsByDoctorSchedule = (doctorId, date) => getDoctorSchedule(doctorId, date);
export const fetchAppointmentsByDoctorId = (doctorId, page = 0, size = 10) => getData(`/bookingAppointments/doctor/${doctorId}?page=${page}&size=${size}`);
export const fetchMyDoctorAppointments = (page = 0, size = 10) => getData(`/bookingAppointments/doctor/my-appointments?page=${page}&size=${size}`);
export const fetchAppointmentsByPatientId = (patientId, page = 0, size = 10) => getData(`/bookingAppointments/patient/${patientId}?page=${page}&size=${size}`);
export const fetchMyPatientAppointments = (page = 0, size = 10) => getData(`/bookingAppointments/patient/my-appointments?page=${page}&size=${size}`);
export const getAppointmentCount = (doctorId) => getData(`/bookingAppointments/doctor/${doctorId}/count`);