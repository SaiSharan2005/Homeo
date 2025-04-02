import { getData, postData } from '../api';

// Existing functions...
export const fetchAboutMe = async () => {
  return await getData('/auth/me');
};