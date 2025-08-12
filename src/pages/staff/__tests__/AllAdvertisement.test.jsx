import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import AllAdvertisement from '../Advertisement/AllAdvertisement';
import * as adsService from '../../../services/advertisement';

jest.mock('react-toastify', () => ({ toast: { error: jest.fn(), success: jest.fn() } }));
jest.mock('../../../services/advertisement');

const renderWithRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>);

const paged = (content = [], totalPages = 2, totalElements = content.length) => ({ content, totalPages, totalElements });

describe('AllAdvertisement page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders list and pagination controls', async () => {
    adsService.getAdvertisements.mockResolvedValueOnce(paged([
      { id: 1, title: 'Ad 1', description: 'Desc 1', imageUrl: '', targetPage: 'home', endDate: null, isActive: true },
      { id: 2, title: 'Ad 2', description: 'Desc 2', imageUrl: '', targetPage: 'home', endDate: null, isActive: false }
    ], 3, 2));

    renderWithRouter(<AllAdvertisement />);

    await waitFor(() => {
      expect(screen.getByText('Manage Advertisements')).toBeInTheDocument();
      expect(screen.getByText('Ad 1')).toBeInTheDocument();
      expect(screen.getByText('Ad 2')).toBeInTheDocument();
      expect(screen.getByText(/Page 1 of 3/)).toBeInTheDocument();
    });
  });

  it('navigates pages using pagination', async () => {
    adsService.getAdvertisements
      .mockResolvedValueOnce(paged([{ id: 1, title: 'Ad 1' }], 2, 2))
      .mockResolvedValueOnce(paged([{ id: 2, title: 'Ad 2' }], 2, 2));

    renderWithRouter(<AllAdvertisement />);

    await waitFor(() => expect(screen.getByText('Ad 1')).toBeInTheDocument());

    const nextBtn = screen.getByText('Next');
    fireEvent.click(nextBtn);

    await waitFor(() => expect(adsService.getAdvertisements).toHaveBeenLastCalledWith(1, 10));
  });

  it('toggles status using service', async () => {
    adsService.getAdvertisements.mockResolvedValueOnce(paged([{ id: 1, title: 'Ad 1', isActive: true }], 1, 1));
    adsService.changeAdvertisementStatus.mockResolvedValue({});

    renderWithRouter(<AllAdvertisement />);

    await waitFor(() => expect(screen.getByText('Active')).toBeInTheDocument());
    fireEvent.click(screen.getByText('Active'));

    await waitFor(() => expect(adsService.changeAdvertisementStatus).toHaveBeenCalledWith(1, false));
  });
});


