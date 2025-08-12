import { getData, postData, putData, deleteData } from './api';

class AppointmentAPI {
  // Create appointment
  async createAppointment(appointmentData) {
    return await postData('/api/bookingAppointments', appointmentData);
  }

  // Create appointment by staff
  async createAppointmentByStaff(appointmentData) {
    return await postData('/api/bookingAppointments/byStaff', appointmentData);
  }

  // Update appointment
  async updateAppointment(id, appointmentData) {
    return await putData(`/api/bookingAppointments/${id}`, appointmentData);
  }

  // Cancel appointment
  async cancelAppointment(id) {
    return await deleteData(`/api/bookingAppointments/${id}`);
  }

  // Complete appointment
  async completeAppointment(token) {
    return await postData(`/api/bookingAppointments/completed-appointment/${token}`);
  }

  // Get all appointments (paginated)
  async getAllAppointments(page = 0, size = 10) {
    return await getData(`/api/bookingAppointments?page=${page}&size=${size}`);
  }

  // Get appointment by ID
  async getAppointmentById(id) {
    return await getData(`/api/bookingAppointments/${id}`);
  }

  // Get appointments by doctor
  async getAppointmentsByDoctor(doctorId, page = 0, size = 10) {
    return await getData(`/api/bookingAppointments/doctor/${doctorId}?page=${page}&size=${size}`);
  }

  // Get my appointments as doctor
  async getMyAppointmentsAsDoctor(page = 0, size = 10) {
    return await getData(`/api/bookingAppointments/my-doctor?page=${page}&size=${size}`);
  }

  // Get appointments by patient
  async getAppointmentsByPatient(patientId, page = 0, size = 10) {
    return await getData(`/api/bookingAppointments/patient/${patientId}?page=${page}&size=${size}`);
  }

  // Get my appointments as patient
  async getMyAppointmentsAsPatient(page = 0, size = 10) {
    return await getData(`/api/bookingAppointments/my-patient?page=${page}&size=${size}`);
  }

  // Get appointments by schedule
  async getAppointmentsBySchedule(scheduleId, page = 0, size = 10) {
    return await getData(`/api/bookingAppointments/schedule/${scheduleId}?page=${page}&size=${size}`);
  }

  // Get appointment by token
  async getAppointmentByToken(token) {
    return await getData(`/api/bookingAppointments/token/${token}`);
  }

  // Get appointment count
  async getAppointmentCount() {
    return await getData('/api/bookingAppointments/count');
  }

  // Update prescription image
  async updatePrescriptionImage(bookingId, file) {
    const formData = new FormData();
    formData.append('file', file);
    return await postData(`/api/bookingAppointments/${bookingId}/prescription-image`, formData);
  }
}

export default new AppointmentAPI(); 