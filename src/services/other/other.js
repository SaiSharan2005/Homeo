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


