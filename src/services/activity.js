/**
 * Activity Service - Handles all activity-related API calls
 * Replaces direct fetch calls in activity components
 */

import { api } from './api';

/**
 * Get all activity logs
 * @param {Object} filters - Optional filters for activity data
 * @returns {Promise<Object>} Paginated activity data
 */
export const getAllActivity = async (filters = {}) => {
  const queryParams = new URLSearchParams();
  
  if (filters.startDate) queryParams.append('startDate', filters.startDate);
  if (filters.endDate) queryParams.append('endDate', filters.endDate);
  if (filters.userType) queryParams.append('userType', filters.userType);
  if (filters.action) queryParams.append('action', filters.action);
  
  const endpoint = `/api/activity-logs${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  return api.get(endpoint);
};

/**
 * Get appointment activity logs
 * @param {Object} filters - Optional filters for appointment activity
 * @returns {Promise<Object>} Paginated appointment activity data
 */
export const getAppointmentActivity = async (filters = {}) => {
  const queryParams = new URLSearchParams();
  
  if (filters.startDate) queryParams.append('startDate', filters.startDate);
  if (filters.endDate) queryParams.append('endDate', filters.endDate);
  if (filters.doctorId) queryParams.append('doctorId', filters.doctorId);
  if (filters.patientId) queryParams.append('patientId', filters.patientId);
  if (filters.status) queryParams.append('status', filters.status);
  
  const endpoint = `/api/activity-logs/appointments${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  return api.get(endpoint);
};

/**
 * Get advertisement activity logs
 * @param {Object} filters - Optional filters for advertisement activity
 * @returns {Promise<Object>} Paginated advertisement activity data
 */
export const getAdvertisementActivity = async (filters = {}) => {
  const queryParams = new URLSearchParams();
  
  if (filters.startDate) queryParams.append('startDate', filters.startDate);
  if (filters.endDate) queryParams.append('endDate', filters.endDate);
  if (filters.status) queryParams.append('status', filters.status);
  if (filters.type) queryParams.append('type', filters.type);
  
  const endpoint = `/api/activity-logs/advertisements${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  return api.get(endpoint);
};

/**
 * Get patient activity logs
 * @param {Object} filters - Optional filters for patient activity
 * @returns {Promise<Object>} Paginated patient activity data
 */
export const getPatientActivity = async (filters = {}) => {
  const queryParams = new URLSearchParams();
  
  if (filters.startDate) queryParams.append('startDate', filters.startDate);
  if (filters.endDate) queryParams.append('endDate', filters.endDate);
  if (filters.patientId) queryParams.append('patientId', filters.patientId);
  if (filters.action) queryParams.append('action', filters.action);
  
  const endpoint = `/api/activity-logs/patients${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  return api.get(endpoint);
};

/**
 * Get doctor activity logs
 * @param {Object} filters - Optional filters for doctor activity
 * @returns {Promise<Object>} Paginated doctor activity data
 */
export const getDoctorActivity = async (filters = {}) => {
  const queryParams = new URLSearchParams();
  
  if (filters.startDate) queryParams.append('startDate', filters.startDate);
  if (filters.endDate) queryParams.append('endDate', filters.endDate);
  if (filters.doctorId) queryParams.append('doctorId', filters.doctorId);
  if (filters.action) queryParams.append('action', filters.action);
  
  const endpoint = `/api/activity-logs/doctors${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  return api.get(endpoint);
};

/**
 * Get user activity logs by user ID
 * @param {string} userId - User ID to get activity for
 * @param {Object} filters - Optional filters
 * @returns {Promise<Object>} Paginated user activity data
 */
export const getUserActivity = async (userId, filters = {}) => {
  const queryParams = new URLSearchParams();
  
  if (filters.startDate) queryParams.append('startDate', filters.startDate);
  if (filters.endDate) queryParams.append('endDate', filters.endDate);
  if (filters.action) queryParams.append('action', filters.action);
  
  const endpoint = `/api/activity-logs/users/${userId}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  return api.get(endpoint);
};
