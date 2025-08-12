/**
 * Doctor Service - Handles all doctor-related API calls
 * Replaces direct fetch calls in doctor components
 */

import { api } from './api';

/**
 * Get doctor profile by ID
 * @param {string} doctorId - Doctor ID
 * @returns {Promise<Object>} Doctor profile data
 */
export const getDoctorProfile = async (doctorId) => {
  return api.get(`/api/doctors/${doctorId}`);
};

/**
 * Update doctor profile
 * @param {string} doctorId - Doctor ID
 * @param {Object} profileData - Updated profile data
 * @returns {Promise<Object>} Updated profile response
 */
export const updateDoctorProfile = async (doctorId, profileData) => {
  return api.put(`/api/doctors/${doctorId}`, profileData);
};

/**
 * Get doctor schedule
 * @param {string} doctorId - Doctor ID
 * @param {Object} filters - Optional date filters
 * @returns {Promise<Object>} Doctor schedule data
 */
export const getDoctorSchedule = async (doctorId, filters = {}) => {
  const queryParams = new URLSearchParams();
  
  if (filters.startDate) queryParams.append('startDate', filters.startDate);
  if (filters.endDate) queryParams.append('endDate', filters.endDate);
  if (filters.status) queryParams.append('status', filters.status);
  
  const endpoint = `/api/schedule/doctor/${doctorId}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  return api.get(endpoint);
};

/**
 * Create doctor schedule slots
 * @param {string} doctorId - Doctor ID
 * @param {Object} scheduleData - Schedule creation data
 * @returns {Promise<Object>} Schedule creation response
 */
export const createDoctorSchedule = async (doctorId, scheduleData) => {
  return api.post(`/api/schedule/doctor/${doctorId}/slots`, scheduleData);
};

/**
 * Update doctor schedule slot
 * @param {string} slotId - Schedule slot ID
 * @param {Object} slotData - Updated slot data
 * @returns {Promise<Object>} Updated slot response
 */
export const updateDoctorScheduleSlot = async (slotId, slotData) => {
  return api.put(`/api/schedule/slots/${slotId}`, slotData);
};

/**
 * Delete doctor schedule slot
 * @param {string} slotId - Schedule slot ID
 * @returns {Promise<Object>} Deletion response
 */
export const deleteDoctorScheduleSlot = async (slotId) => {
  return api.delete(`/api/schedule/slots/${slotId}`);
};

/**
 * Get doctor appointments
 * @param {string} doctorId - Doctor ID
 * @param {Object} filters - Optional filters
 * @returns {Promise<Object>} Paginated appointments data
 */
export const getDoctorAppointments = async (doctorId, filters = {}) => {
  const queryParams = new URLSearchParams();
  
  if (filters.startDate) queryParams.append('startDate', filters.startDate);
  if (filters.endDate) queryParams.append('endDate', filters.endDate);
  if (filters.status) queryParams.append('status', filters.status);
  if (filters.patientId) queryParams.append('patientId', filters.patientId);
  
  const endpoint = `/api/appointments/doctor/${doctorId}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  return api.get(endpoint);
};

/**
 * Get doctor history
 * @param {string} doctorId - Doctor ID
 * @param {Object} filters - Optional filters
 * @returns {Promise<Object>} Doctor history data
 */
export const getDoctorHistory = async (doctorId, filters = {}) => {
  const queryParams = new URLSearchParams();
  
  if (filters.startDate) queryParams.append('startDate', filters.startDate);
  if (filters.endDate) queryParams.append('endDate', filters.endDate);
  if (filters.type) queryParams.append('type', filters.type);
  
  const endpoint = `/api/doctors/${doctorId}/history${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  return api.get(endpoint);
};

/**
 * Get doctor timings
 * @param {string} doctorId - Doctor ID
 * @returns {Promise<Object>} Doctor timings data
 */
export const getDoctorTimings = async (doctorId) => {
  return api.get(`/api/doctor-timings/${doctorId}`);
};

/**
 * Update doctor timings
 * @param {string} doctorId - Doctor ID
 * @param {Object} timingsData - Updated timings data
 * @returns {Promise<Object>} Updated timings response
 */
export const updateDoctorTimings = async (doctorId, timingsData) => {
  return api.put(`/api/doctor-timings/${doctorId}`, timingsData);
};

/**
 * Search doctors with filters
 * @param {Object} filters - Search filters
 * @returns {Promise<Object>} Paginated doctors data
 */
export const searchDoctors = async (filters = {}) => {
  const queryParams = new URLSearchParams();
  
  if (filters.specialization) queryParams.append('specialization', filters.specialization);
  if (filters.location) queryParams.append('location', filters.location);
  if (filters.availability) queryParams.append('availability', filters.availability);
  if (filters.rating) queryParams.append('rating', filters.rating);
  
  const endpoint = `/api/doctors/search${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  return api.get(endpoint);
};

/**
 * Get all doctors (admin function)
 * @param {Object} filters - Optional filters
 * @returns {Promise<Object>} Paginated doctors data
 */
export const getAllDoctors = async (filters = {}) => {
  const queryParams = new URLSearchParams();
  
  if (filters.status) queryParams.append('status', filters.status);
  if (filters.specialization) queryParams.append('specialization', filters.specialization);
  if (filters.verified) queryParams.append('verified', filters.verified);
  
  const endpoint = `/api/admin/doctors${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  return api.get(endpoint);
};
