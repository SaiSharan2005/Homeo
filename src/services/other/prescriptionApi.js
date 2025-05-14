// src/services/prescriptionApi.js

import { getData } from '../api';

// … your existing exports

/**
 * Fetch the patient’s instructions (latest → oldest)
 */
export const fetchInstructionsByPatient = async (patientId) => {
  return await getData(`/prescriptions/patient/${patientId}/instructions`);
};
