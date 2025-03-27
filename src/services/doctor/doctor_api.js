import { getData, postData } from '../services/api';

// Fetch the doctor’s profile data
export const fetchDoctorProfile = async () => {
  return await getData('/doctor/me');
};

// Fetch the doctor's appointments
export const fetchDoctorAppointments = async () => {
  return await getData('/bookingAppointments/doctor/my-appointments');
};

// Fetch the doctor's schedule for a given date (formatted as 'YYYY-MM-DD')
export const fetchDoctorScheduleByDate = async (date) => {
  return await getData(`/schedule/doctor/date/${date}`);
};

// Create appointment slots for a given date (if needed, you can also pass a body)
export const createDoctorSchedule = async (date) => {
  // Passing an empty object as body here; adjust if your API expects data
  return await postData(`/create-appointment-slots/date/${date}`, {});
};


export const fetchAppointmentByToken = async (tokenId) => {
    return await getData(`/bookingAppointments/token/${tokenId}`);
  };
  
  // Fetch prescription data by bookingId
  export const fetchPrescriptionByBooking = async (bookingId) => {
    return await getData(`/prescriptions/booking/${bookingId}`);
  };
  
  // Mark an appointment as completed using tokenId
  export const markAppointmentCompleted = async (tokenId) => {
    return await postData(`/bookingAppointments/completed-appointment/${tokenId}`, {});
  };
  

  /**
   * For DoctorScheduleCreation component:
   */
  
  // Reset doctor timings before creating new ones
  export const resetDoctorTimings = async () => {
    return await postData(`/doctor-timings/set-in-use-false`, {});
  };
  
  // Create multiple timing slots for the doctor
  export const createDoctorTimings = async (data) => {
    return await postData(`/doctor-timings/multi`, data);
  };