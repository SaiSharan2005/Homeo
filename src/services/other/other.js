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

export const fetchCurrentPayment = async () => {
  try {
    return await getData('/payments/current');
  } catch (err) {
    if (err.response?.status === 204) return null;
    throw err;
  }
};

/**
 * Fetch the “next” pending payment after the given id.
 */
export const fetchNextPayment = async (id) => {
  try {
    return await getData(`/payments/${id}/next`);
  } catch (err) {
    if (err.response?.status === 204) return null;
    throw err;
  }
};

/**
 * Fetch the “previous” pending payment before the given id.
 */
export const fetchLastPayment = async (id) => {
  try {
    return await getData(`/payments/${id}/previous`);
  } catch (err) {
    if (err.response?.status === 204) return null;
    throw err;
  }
};

// Fetch a list of outstanding dues for a patient (legacy helper used by PaymentDetails)
export const fetchDuesForPatient = async (patientId, page = 0, size = 100) => {
  try {
    const res = await getData(`/payments/patient/${patientId}/dues?page=${page}&size=${size}`);
    // Support both paginated and array responses
    return Array.isArray(res) ? res : (res?.content || []);
  } catch (err) {
    if (err.response?.status === 204) return [];
    throw err;
  }
};

// Record a partial payment amount against a payment (legacy helper used by PaymentDetails)
export const recordPaymentAmount = async (paymentId, amount) => {
  return await postData(`/payments/${paymentId}/record-amount`, { amount });
};