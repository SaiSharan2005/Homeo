import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { toast } from 'react-toastify';
import AppointmentBooking from '../AppointmentBooking';
import * as doctorApi from '../../../services/doctor/doctor_api';
import * as appointmentService from '../../../services/appointment';

jest.mock('react-toastify', () => ({ toast: { error: jest.fn(), success: jest.fn() } }));
jest.mock('../../../services/doctor/doctor_api');
jest.mock('../../../services/appointment');

const renderWithRoute = (path = '/patient/appointment/book/1') => {
  window.history.pushState({}, '', path);
  return render(
    <BrowserRouter>
      <Routes>
        <Route path="/patient/appointment/book/:doctorId" element={<AppointmentBooking />} />
        <Route path="/patient/appointment/token/:token" element={<div>Token Page</div>} />
      </Routes>
    </BrowserRouter>
  );
};

describe('AppointmentBooking', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    doctorApi.getDoctorById.mockResolvedValue({ id: 1, doctorName: 'Dr. A', doctorDetails: {}, phoneNumber: '1' });
    appointmentService.getDoctorSchedule.mockResolvedValue([
      { scheduleId: 10, date: '2024-01-01', startTime: '09:00', endTime: '10:00', booked: false },
    ]);
  });

  it('loads doctor and schedules', async () => {
    renderWithRoute();
    await waitFor(() => {
      expect(screen.getByText('Dr. A')).toBeInTheDocument();
      expect(screen.getByText('Select a time')).toBeInTheDocument();
    });
  });

  it('requires slot selection before booking', async () => {
    renderWithRoute();
    await waitFor(() => screen.getByText('Select a time'));
    fireEvent.click(screen.getByText('Book an appointment'));
    expect(toast.error).toHaveBeenCalled();
  });

  it('books appointment via service and navigates', async () => {
    appointmentService.createAppointment.mockResolvedValue({ token: 'abc' });
    renderWithRoute();

    await waitFor(() => screen.getByText('Select a time'));
    // select slot
    fireEvent.click(screen.getAllByRole('button', { name: /:/ })[0]);
    fireEvent.click(screen.getByText('Book an appointment'));

    await waitFor(() => {
      expect(appointmentService.createAppointment).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalled();
    });
  });
});


