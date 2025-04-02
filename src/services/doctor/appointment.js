import { getData, postData } from '../api';

// Existing functions...
export const fetchDoctorTiming = async () => {
  return await getData('/doctor-timings/doctor/in-use');
};

