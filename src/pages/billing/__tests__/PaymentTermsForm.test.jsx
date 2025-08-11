import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import PaymentTermsForm from '../PaymentTermsForm';
import * as paymentTermsService from '../../../services/billing/paymentTerms';

jest.mock('../../../services/billing/paymentTerms');
jest.mock('react-toastify');

const mockNavigate = jest.fn();
const mockParams = { id: undefined };
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => mockParams,
}));

const mockPaymentTerm = {
  id: 1,
  name: 'Net 30',
  description: 'Payment due in 30 days',
  days: 30,
  active: true
};

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('PaymentTermsForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockParams.id = undefined;
    paymentTermsService.createPaymentTerms.mockResolvedValue({});
    paymentTermsService.updatePaymentTerms.mockResolvedValue({});
    paymentTermsService.getPaymentTermsById.mockResolvedValue(mockPaymentTerm);
  });

  describe('Create Mode', () => {
    test('renders create form with correct title', () => {
      renderWithRouter(<PaymentTermsForm />);
      expect(screen.getByText('Create New Payment Term')).toBeInTheDocument();
    });

    test('renders all form fields', () => {
      renderWithRouter(<PaymentTermsForm />);
      expect(screen.getByLabelText('Name *')).toBeInTheDocument();
      expect(screen.getByLabelText('Days *')).toBeInTheDocument();
      expect(screen.getByLabelText('Active')).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    test('shows error for empty name field', async () => {
      renderWithRouter(<PaymentTermsForm />);
      const submitButton = screen.getByText('Create Payment Term');
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Name is required')).toBeInTheDocument();
      });
    });

    test('shows error for empty days field', async () => {
      renderWithRouter(<PaymentTermsForm />);
      const nameInput = screen.getByLabelText('Name *');
      fireEvent.change(nameInput, { target: { value: 'Net 30' } });
      
      const submitButton = screen.getByText('Create Payment Term');
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Days is required')).toBeInTheDocument();
      });
    });
  });

  describe('Form Submission', () => {
    test('creates new payment term successfully', async () => {
      renderWithRouter(<PaymentTermsForm />);
      
      const nameInput = screen.getByLabelText('Name *');
      const daysInput = screen.getByLabelText('Days *');
      
      fireEvent.change(nameInput, { target: { value: 'Net 45' } });
      fireEvent.change(daysInput, { target: { value: '45' } });
      
      const submitButton = screen.getByText('Create Payment Term');
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(paymentTermsService.createPaymentTerms).toHaveBeenCalledWith({
          name: 'Net 45',
          description: '',
          days: '45',
          active: true
        });
        expect(toast.success).toHaveBeenCalledWith('Payment term created successfully');
      });
    });
  });
});
