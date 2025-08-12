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
// Legacy completePayment replaced by uploadPaymentProof in billing/payment service
export const completePayment = async () => {
  throw new Error('Deprecated: use services/billing/payment.uploadPaymentProof');
};

/**
 * Mark a payment as unpaid/failed
 */
export const markUnpaid = async () => {
  throw new Error('Deprecated: mark-unpaid is not supported in aligned flow');
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
export const payCash = async () => {
  throw new Error('Deprecated: cash-payment is not supported in aligned flow');
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
export const setDeliveryStatus = async () => {
  throw new Error('Deprecated: delivery status endpoint is not supported in aligned flow');
};

/**
 * Record a partial or full payment amount toward total
 */
export const recordPaymentAmount = async () => {
  throw new Error('Deprecated: record-payment endpoint is not supported in aligned flow');
};

/**
 * Fetch all due payments for a specific patient by ID
 */
export const fetchDuesForPatient = async (patientId) => {
  return await getData(`/payments/dues/${patientId}`);
};



// PUT /api/payments/{id}/status?status=DUE
export const setPaymentStatus = async () =>{
  throw new Error('Deprecated: set status endpoint is not supported in aligned flow');
}

