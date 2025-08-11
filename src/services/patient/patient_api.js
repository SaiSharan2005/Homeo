import api from '../api';

// Patient authentication and profile operations
// Note: Patient login uses the general auth endpoint
export const patientLogin = async (credentials) => {
  return api.post('/auth/login', credentials);
};

export const patientLogout = async () => {
  return api.post('/auth/logout');
};

export const getPatientProfile = async () => {
  return api.get('/patient/me');
};

export const updatePatientProfile = async (profileData) => {
  return api.put('/patient/updateMyProfile', profileData);
};

export const changePatientPassword = async (passwordData) => {
  return api.put('/patient/change-password', passwordData);
};

// Patient registration
export const patientRegistration = async (registrationData) => {
  return api.post('/patient/register', registrationData);
};

export const verifyPatientEmail = async (token) => {
  return api.post('/verify/confirm', { token });
};

// Patient medical history
export const getPatientMedicalHistory = async (page = 0, size = 10) => {
  return api.get(`/patient/medical-history?page=${page}&size=${size}`);
};

export const getPatientAppointments = async (page = 0, size = 10) => {
  return api.get(`/bookingAppointments/patient/my-appointments?page=${page}&size=${size}`);
};

export const getPatientPrescriptions = async (page = 0, size = 10) => {
  return api.get(`/prescriptions/patient/my-prescriptions?page=${page}&size=${size}`);
};

// Patient search and listing
export const searchPatients = async (query, page = 0, size = 10) => {
  return api.get(`/patient/search?q=${encodeURIComponent(query)}&page=${page}&size=${size}`);
};

export const getAllPatients = async (page = 0, size = 10) => {
  return api.get(`/patient/all?page=${page}&size=${size}`);
};

export const getPatientById = async (id) => {
  return api.get(`/patient/${id}`);
};

// Legacy aliases expected by UI
export { getPatientProfile as fetchCurrentPatient };
export { getPatientById as fetchPatientById };
export { updatePatientProfile as savePatientProfile };
export { patientRegistration as Signup };
export { patientLogin as Login };