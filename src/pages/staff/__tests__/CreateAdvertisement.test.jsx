import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import CreateAdvertisement from '../Advertisement/CreateAdvertisement';
import * as adsService from '../../../services/advertisement';

jest.mock('react-toastify', () => ({ toast: { error: jest.fn(), success: jest.fn() } }));
jest.mock('../../../services/advertisement');

const renderWithRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>);

describe('CreateAdvertisement', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    adsService.getAdvertisements.mockResolvedValue({ content: [] });
  });

  it('validates required fields', async () => {
    renderWithRouter(<CreateAdvertisement />);
    fireEvent.click(screen.getByRole('button', { name: /Create Advertisement/i }));
    expect(toast.error).toHaveBeenCalled();
  });

  it('submits FormData with image', async () => {
    adsService.createAdvertisement.mockResolvedValue({ id: 1 });
    renderWithRouter(<CreateAdvertisement />);

    fireEvent.change(screen.getByLabelText(/Advertisement Title/i), { target: { value: 'Title' } });
    fireEvent.change(screen.getByLabelText(/Advertisement Description/i), { target: { value: 'Desc' } });
    fireEvent.change(screen.getByLabelText(/Target Page/i), { target: { value: 'doctor-search-bottom' } });
    fireEvent.change(screen.getByLabelText(/End Date/i), { target: { value: '2099-01-01' } });

    const file = new File(['data'], 'ad.png', { type: 'image/png' });
    const fileInput = screen.getByLabelText(/Advertisement Image/i);
    fireEvent.change(fileInput, { target: { files: [file] } });

    fireEvent.click(screen.getByRole('button', { name: /Create Advertisement/i }));

    await waitFor(() => {
      expect(adsService.createAdvertisement).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalled();
    });
  });
});


