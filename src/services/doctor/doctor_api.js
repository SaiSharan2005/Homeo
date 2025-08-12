import api, { getData, postData, putData } from '../api';

// Doctor authentication and profile operations
// Note: Doctor login uses the general auth endpoint
export const doctorLogin = async (credentials) => api.post('/auth/login', credentials);

export const doctorLogout = async () => api.post('/auth/logout');

export const getDoctorProfile = async () => api.get('/doctor/me');

export const updateDoctorProfile = async (profileData) => api.put('/doctor/updateMyProfile', profileData);

export const changeDoctorPassword = async (passwordData) => api.put('/doctor/change-password', passwordData);

// Doctor schedule operations
export const getDoctorSchedule = async (date) => api.get(`/schedule/doctor/date/${date}`);

export const createDoctorSchedule = async (scheduleData) => api.post(`/schedule/create/${scheduleData}`);

export const updateDoctorSchedule = async (id, scheduleData) => api.put(`/schedule/${id}`, scheduleData);

export const deleteDoctorSchedule = async (id) => api.delete(`/schedule/${id}`);

// Doctor availability operations
export const getDoctorAvailability = async (startDate, endDate) => api.get(`/doctor/availability?startDate=${startDate}&endDate=${endDate}`);

export const updateDoctorAvailability = async (availabilityData) => api.put('/doctor/availability', availabilityData);

// Doctor search and listing
export const searchDoctors = async (query, page = 0, size = 10) => api.get(`/doctor/search?q=${encodeURIComponent(query)}&page=${page}&size=${size}`);

export const getDoctorsBySpecialization = async (specialization, page = 0, size = 10) => api.get(`/doctor/specialization/${specialization}?page=${page}&size=${size}`);

export const getAllDoctors = async (page = 0, size = 10) => api.get(`/doctor/availableDoctors?page=${page}&size=${size}`);

export const getDoctorById = async (id) => api.get(`/doctor/byId/${id}`);

// Doctor timings (slots) management
export const resetDoctorTimings = async () => {
  return api.post('/doctor-timings/set-in-use-false');
};

export const createDoctorTimings = async (timings) => {
  return api.post('/doctor-timings/multi', timings);
};

// Legacy aliases expected by components
export const fetchCurrentDoctor = () => getDoctorProfile();
export const fetchDoctorById = (id) => getDoctorById(id);
export const fetchAvailableDoctors = (page = 0, size = 10) => getAllDoctors(page, size);

// Schedule by date helpers used in Doctor views
export const fetchDoctorScheduleByDate = async (date) => api.get(`/schedule/doctor/date/${date}`);
export const createDoctorScheduleByDate = async (date) => api.post(`/schedule/create/${date}`);

// Doctor appointment lists used in components
export const fetchDoctorAppointments = async (page = 0, size = 10) => getData(`/bookingAppointments/doctor/my-appointments?page=${page}&size=${size}`);

// Doctor profile creation used by admin/staff flows
export const addDoctorProfile = async (profileData) => postData('/doctor/addProfile', profileData);

