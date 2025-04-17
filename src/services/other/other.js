import { getData, postData } from '../api';

// Existing functions...
export const fetchAboutMe = async () => {
  return await getData('/auth/me');
};

export const fetchPaymentList = async () => {
  return await getData('/payments');
};
export const fetchPaymentDetail = async (id) => {
  return await getData(`/payments/${id}`);
};



export const fetchPatientPayments = async () => {
  return await getData("/payments/patient");
};

export const fetchDoctorPayments = async () => {
  return await getData("/payments/doctor");
};

