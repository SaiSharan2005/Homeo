// src/services/paymentApi.js

import { getData, postData, putData } from '../api';

/**
 * Create a new payment record (initializes pending or paid for cash)
 * payload = { prescriptionId, method, totalAmount }
 */
export const createPayment = async (payload) => {
  return await postData('/payments', payload);
};

/**
 * Complete an online payment by uploading screenshot
 * file: File object
 */
export const completePayment = async (paymentId, file) => {
  const formData = new FormData();
  formData.append('file', file);
  return await putData(`/payments/${paymentId}/complete-payment`, formData);
};

/**
 * Mark a payment as unpaid/failed
 */
export const markUnpaid = async (paymentId) => {
  return await putData(`/payments/${paymentId}/mark-unpaid`);
};

/**
 * Fetch all payments (paged or not)
 */
export const fetchAllPayments = async () => {
  return await getData('/payments');
};

/**
 * Fetch a payment by its ID
 */
export const fetchPaymentById = async (paymentId) => {
  return await getData(`/payments/${paymentId}`);
};

/**
 * Pay by cash for a payment
 */
export const payCash = async (paymentId) => {
  return await putData(`/payments/${paymentId}/cash-payment`);
};

/**
 * Fetch payment by prescription ID
 */
export const fetchPaymentByPrescriptionId = async (prescriptionId) => {
  return await getData(`/payments/prescription/${prescriptionId}`);
};

/**
 * Fetch payments for the current authenticated patient
 */
export const fetchPaymentsForPatient = async () => {
  return await getData('/payments/patient');
};

/**
 * Fetch payments for the current authenticated doctor
 */
export const fetchPaymentsForDoctor = async () => {
  return await getData('/payments/doctor');
};

/**
 * Fetch the current pending payment (first in queue)
 */
export const fetchCurrentPendingPayment = async () => {
  return await getData('/payments/current');
};

/**
 * Fetch the next pending payment in queue
 */
export const fetchNextPendingPayment = async () => {
  return await getData('/payments/next');
};

/**
 * Fetch the last pending payment in queue
 */
export const fetchLastPendingPayment = async () => {
  return await getData('/payments/last');
};

/**
 * Fetch the previous pending payment before given ID
 */
export const fetchPreviousPendingPayment = async (paymentId) => {
  return await getData(`/payments/${paymentId}/previous`);
};

/**
 * Fetch the next pending payment after given ID
 */
export const fetchNextAfterPayment = async (paymentId) => {
  return await getData(`/payments/${paymentId}/next`);
};

/**
 * Set delivery status for a payment
 */
export const setDeliveryStatus = async (paymentId, delivered) => {
  return await putData(`/payments/${paymentId}/delivery?delivered=${delivered}`);
};

/**
 * Record a partial or full payment amount toward total
 */
export const recordPaymentAmount = async (paymentId, amount) => {
  return await putData(`/payments/${paymentId}/pay?amount=${amount}`);
};

/**
 * Fetch all due payments for a specific patient by ID
 */
export const fetchDuesForPatient = async (patientId) => {
  return await getData(`/payments/dues/${patientId}`);
};



// PUT /api/payments/{id}/status?status=DUE
export const setPaymentStatus = async (id, status) =>{
  await putData(`/payments/${id}/status?status=${status}`);
}

