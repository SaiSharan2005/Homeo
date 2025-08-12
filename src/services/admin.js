import api from './api';

// Admin authentication and management operations
// Note: Admin login uses the general auth endpoint
export const adminLogin = async (credentials) => {
  return api.post('/auth/login', credentials);
};

export const adminLogout = async () => {
  return api.post('/auth/logout');
};

export const getAdminProfile = async () => {
  return api.get('/admin/me');
};

export const updateAdminProfile = async (profileData) => {
  return api.put('/admin/updateMyProfile', profileData);
};

export const changeAdminPassword = async (passwordData) => {
  return api.put('/admin/change-password', passwordData);
};

// User management operations
export const getAllUsers = async (page = 0, size = 10) => {
  return api.get(`/admin/all?page=${page}&size=${size}`);
};

export const getUserById = async (id) => {
  return api.get(`/admin/${id}`);
};

export const createUser = async (userData) => {
  return api.post('/admin/register', userData);
};

export const updateUser = async (id, userData) => {
  return api.put(`/admin/updateProfileById/${id}`, userData);
};

export const deleteUser = async (id) => {
  return api.delete(`/admin/delete/${id}`);
};

export const activateUser = async (id) => {
  return api.put(`/admin/${id}/activate`);
};

export const deactivateUser = async (id) => {
  return api.put(`/admin/${id}/deactivate`);
};

// Role management operations
export const getUserRoles = async (userId) => {
  return api.get(`/admin/${userId}/roles`);
};

export const updateUserRoles = async (userId, roles) => {
  return api.put(`/admin/${userId}/roles`, roles);
};

export const removeUserRole = async (userId, roleName) => {
  return api.delete(`/admin/${userId}/roles?roleName=${roleName}`);
};

export const getUsersByRole = async (roleName) => {
  return api.get(`/admin/role/${roleName}/users`);
};

export const getAllStaffUsers = async () => {
  return api.get('/admin/staff-roles');
};

// System operations
export const getSystemStats = async () => {
  return api.get('/admin/system/stats');
};

export const getActivityLogs = async (page = 0, size = 10) => {
  return api.get(`/activity-log?page=${page}&size=${size}`);
};
