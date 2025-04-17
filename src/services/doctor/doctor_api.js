import { getData, postData } from '../api';

// Existing functions...
export const fetchDoctorProfile = async () => {
  return await getData('/doctor/me');
};

export const fetchDoctorAppointments = async () => {
  return await getData('/bookingAppointments/doctor/my-appointments');
};

export const fetchDoctorScheduleByDate = async (date) => {
  return await getData(`/schedule/doctor/date/${date}`);
};

export const createDoctorSchedule = async (date) => {
  return await postData(`/create-appointment-slots/date/${date}`, {});
};

export const fetchAppointmentByToken = async (tokenId) => {
  return await getData(`/bookingAppointments/token/${tokenId}`);
};

export const fetchPrescriptionByBooking = async (bookingId) => {
  return await getData(`/prescriptions/booking/${bookingId}`);
};

export const markAppointmentCompleted = async (tokenId) => {
  return await postData(`/bookingAppointments/completed-appointment/${tokenId}`, {});
};

export const resetDoctorTimings = async () => {
  return await postData(`/doctor-timings/set-in-use-false`, {});
};

export const createDoctorTimings = async (data) => {
  return await postData(`/doctor-timings/multi`, data);
};

// NEW: Add doctor profile
export const addDoctorProfile = async (formData) => {
  // This function calls your endpoint to add/update the doctor's profile
  return await postData(`/doctor/addProfile/${formData.username}`, formData);
};


export const createDoctor = async (doctorData) => {
  return await postData('/doctor/register', doctorData);
};

