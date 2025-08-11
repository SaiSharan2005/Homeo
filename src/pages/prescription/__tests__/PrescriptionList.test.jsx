import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { getPrescriptions } from '../../../services/prescription';
import PrescriptionList from '../PrescriptionList';

jest.mock('../../../services/prescription');

const renderWithRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>);

describe('PrescriptionList', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders prescriptions with pagination', async () => {
    getPrescriptions.mockResolvedValue({
      content: [
        {
          id: 1,
          token: 'TKN-1',
          patient: { name: 'John Doe', phone: '1234567890' },
          doctor: { name: 'Dr. Smith', specialization: 'Homeopathy' },
          diagnosis: 'Flu',
          status: 'ACTIVE',
          createdDate: new Date().toISOString(),
        },
      ],
      totalPages: 1,
      totalElements: 1,
    });

    renderWithRouter(<PrescriptionList />);

    await waitFor(() => {
      expect(screen.getByText('Prescription Management')).toBeInTheDocument();
      expect(screen.getByText('TKN-1')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    expect(getPrescriptions).toHaveBeenCalledWith(0, 10);
  });
});


