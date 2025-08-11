import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import AppointmentList from '../AppointmentList.jsx';
import * as apptService from '../../../services/appointment';

jest.mock('react-toastify', () => ({ toast: { error: jest.fn(), success: jest.fn() } }));
jest.mock('../../../services/appointment');

const paged = (content = [], totalPages = 2, totalElements = content.length) => ({ content, totalPages, totalElements });

const renderWithRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>);

describe('AppointmentList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders paginated appointments', async () => {
    apptService.getBookingAppointments.mockResolvedValueOnce(paged([
      { id: 1, token: 'T1', status: 'scheduled', patient: { username: 'P1' }, doctor: { username: 'D1' } }
    ], 2, 1));

    renderWithRouter(<AppointmentList />);
    await waitFor(() => {
      expect(screen.getByText('Appointment Management')).toBeInTheDocument();
      expect(screen.getByText('T1')).toBeInTheDocument();
      expect(screen.getByText(/Page 1 of 2/)).toBeInTheDocument();
    });
  });

  it('navigates pages via controls', async () => {
    apptService.getBookingAppointments
      .mockResolvedValueOnce(paged([{ id: 1, token: 'T1' }], 2, 2))
      .mockResolvedValueOnce(paged([{ id: 2, token: 'T2' }], 2, 2));

    renderWithRouter(<AppointmentList />);
    await waitFor(() => screen.getByText('T1'));
    fireEvent.click(screen.getByText('Next'));
    await waitFor(() => expect(apptService.getBookingAppointments).toHaveBeenLastCalledWith(1, 10));
  });
});


