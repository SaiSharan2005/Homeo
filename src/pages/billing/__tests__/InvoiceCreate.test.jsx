import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import InvoiceCreate from '../InvoiceCreate';
import { createInvoice } from '../../../services/billing/invoice';
import { getAllPaymentTerms } from '../../../services/billing/paymentTerms';

// Mock the services
jest.mock('../../../services/billing/invoice');
jest.mock('../../../services/billing/paymentTerms');
jest.mock('react-toastify');

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const mockPaymentTerms = [
  { id: 1, name: 'Net 30', days: 30 },
  { id: 2, name: 'Net 60', days: 60 },
  { id: 3, name: 'Due on Receipt', days: 0 }
];

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('InvoiceCreate', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getAllPaymentTerms.mockResolvedValue({ content: mockPaymentTerms });
    createInvoice.mockResolvedValue({ id: 1 });
    toast.success = jest.fn();
    toast.error = jest.fn();
  });

  it('renders the create invoice form', async () => {
    renderWithRouter(<InvoiceCreate />);
    
    await waitFor(() => {
      expect(screen.getByText('Create New Invoice')).toBeInTheDocument();
      expect(screen.getByText('Fill in the details to create a new invoice.')).toBeInTheDocument();
    });
  });

  it('loads payment terms on component mount', async () => {
    renderWithRouter(<InvoiceCreate />);
    
    await waitFor(() => {
      expect(getAllPaymentTerms).toHaveBeenCalledWith(0, 100);
    });
  });

  it('displays loading spinner while loading payment terms', () => {
    getAllPaymentTerms.mockImplementation(() => new Promise(() => {}));
    
    renderWithRouter(<InvoiceCreate />);
    
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('shows error toast when payment terms fail to load', async () => {
    const errorMessage = 'Failed to load payment terms';
    getAllPaymentTerms.mockRejectedValue(new Error(errorMessage));
    
    renderWithRouter(<InvoiceCreate />);
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to load payment terms: ' + errorMessage);
    });
  });

  it('validates required fields on form submission', async () => {
    renderWithRouter(<InvoiceCreate />);
    
    await waitFor(() => {
      expect(screen.getByText('Create New Invoice')).toBeInTheDocument();
    });

    const submitButton = screen.getByText('Create Invoice');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Invoice number is required')).toBeInTheDocument();
      expect(screen.getByText('Customer name is required')).toBeInTheDocument();
      expect(screen.getByText('Customer email is required')).toBeInTheDocument();
      expect(screen.getByText('Invoice date is required')).toBeInTheDocument();
      expect(screen.getByText('Due date is required')).toBeInTheDocument();
      expect(screen.getByText('Subtotal must be a positive number')).toBeInTheDocument();
    });
  });

  it('validates email format', async () => {
    renderWithRouter(<InvoiceCreate />);
    
    await waitFor(() => {
      expect(screen.getByText('Create New Invoice')).toBeInTheDocument();
    });

    const emailInput = screen.getByLabelText('Customer Email *');
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);

    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
    });
  });

  it('validates due date is after invoice date', async () => {
    renderWithRouter(<InvoiceCreate />);
    
    await waitFor(() => {
      expect(screen.getByText('Create New Invoice')).toBeInTheDocument();
    });

    const invoiceDateInput = screen.getByLabelText('Invoice Date *');
    const dueDateInput = screen.getByLabelText('Due Date *');
    
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    fireEvent.change(invoiceDateInput, { target: { value: today } });
    fireEvent.change(dueDateInput, { target: { value: yesterday } });
    
    const submitButton = screen.getByText('Create Invoice');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Due date must be after invoice date')).toBeInTheDocument();
    });
  });

  it('validates subtotal is a positive number', async () => {
    renderWithRouter(<InvoiceCreate />);
    
    await waitFor(() => {
      expect(screen.getByText('Create New Invoice')).toBeInTheDocument();
    });

    const subtotalInput = screen.getByLabelText('Subtotal *');
    fireEvent.change(subtotalInput, { target: { value: '-100' } });
    
    const submitButton = screen.getByText('Create Invoice');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Subtotal must be a positive number')).toBeInTheDocument();
    });
  });

  it('auto-calculates tax amount and total when subtotal and tax rate change', async () => {
    renderWithRouter(<InvoiceCreate />);
    
    await waitFor(() => {
      expect(screen.getByText('Create New Invoice')).toBeInTheDocument();
    });

    const subtotalInput = screen.getByLabelText('Subtotal *');
    const taxRateInput = screen.getByLabelText('Tax Rate (%)');
    
    fireEvent.change(subtotalInput, { target: { value: '100' } });
    fireEvent.change(taxRateInput, { target: { value: '10' } });

    await waitFor(() => {
      expect(screen.getByDisplayValue('10.00')).toBeInTheDocument(); // tax amount
      expect(screen.getByDisplayValue('110.00')).toBeInTheDocument(); // total
    });
  });

  it('clears field errors when user starts typing', async () => {
    renderWithRouter(<InvoiceCreate />);
    
    await waitFor(() => {
      expect(screen.getByText('Create New Invoice')).toBeInTheDocument();
    });

    const submitButton = screen.getByText('Create Invoice');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Invoice number is required')).toBeInTheDocument();
    });

    const invoiceNumberInput = screen.getByLabelText('Invoice Number *');
    fireEvent.change(invoiceNumberInput, { target: { value: 'INV-001' } });

    await waitFor(() => {
      expect(screen.queryByText('Invoice number is required')).not.toBeInTheDocument();
    });
  });

  it('submits form successfully with valid data', async () => {
    renderWithRouter(<InvoiceCreate />);
    
    await waitFor(() => {
      expect(screen.getByText('Create New Invoice')).toBeInTheDocument();
    });

    // Fill in required fields
    fireEvent.change(screen.getByLabelText('Invoice Number *'), { target: { value: 'INV-001' } });
    fireEvent.change(screen.getByLabelText('Customer Name *'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText('Customer Email *'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText('Customer Phone'), { target: { value: '123-456-7890' } });
    fireEvent.change(screen.getByLabelText('Customer Address'), { target: { value: '123 Main St' } });
    fireEvent.change(screen.getByLabelText('Invoice Date *'), { target: { value: '2024-01-01' } });
    fireEvent.change(screen.getByLabelText('Due Date *'), { target: { value: '2024-01-31' } });
    fireEvent.change(screen.getByLabelText('Subtotal *'), { target: { value: '100' } });
    fireEvent.change(screen.getByLabelText('Tax Rate (%)'), { target: { value: '10' } });
    fireEvent.change(screen.getByLabelText('Notes'), { target: { value: 'Test invoice' } });

    const submitButton = screen.getByText('Create Invoice');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(createInvoice).toHaveBeenCalledWith({
        invoiceNumber: 'INV-001',
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        customerPhone: '123-456-7890',
        customerAddress: '123 Main St',
        invoiceDate: '2024-01-01',
        dueDate: '2024-01-31',
        paymentTermsId: '',
        subtotal: 100,
        taxRate: 10,
        taxAmount: 10,
        total: 110,
        notes: 'Test invoice',
        status: 'DRAFT'
      });
      expect(toast.success).toHaveBeenCalledWith('Invoice created successfully');
      expect(mockNavigate).toHaveBeenCalledWith('/billing/invoices');
    });
  });

  it('shows error toast when invoice creation fails', async () => {
    const errorMessage = 'Failed to create invoice';
    createInvoice.mockRejectedValue(new Error(errorMessage));
    
    renderWithRouter(<InvoiceCreate />);
    
    await waitFor(() => {
      expect(screen.getByText('Create New Invoice')).toBeInTheDocument();
    });

    // Fill in required fields
    fireEvent.change(screen.getByLabelText('Invoice Number *'), { target: { value: 'INV-001' } });
    fireEvent.change(screen.getByLabelText('Customer Name *'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText('Customer Email *'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText('Invoice Date *'), { target: { value: '2024-01-01' } });
    fireEvent.change(screen.getByLabelText('Due Date *'), { target: { value: '2024-01-31' } });
    fireEvent.change(screen.getByLabelText('Subtotal *'), { target: { value: '100' } });

    const submitButton = screen.getByText('Create Invoice');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to create invoice: ' + errorMessage);
    });
  });

  it('displays payment terms in dropdown', async () => {
    renderWithRouter(<InvoiceCreate />);
    
    await waitFor(() => {
      expect(screen.getByText('Create New Invoice')).toBeInTheDocument();
    });

    const paymentTermsSelect = screen.getByLabelText('Payment Terms');
    expect(paymentTermsSelect).toBeInTheDocument();
    
    // Check if payment terms are populated - use more flexible text matching
    expect(screen.getByText(/Net 30/)).toBeInTheDocument();
    expect(screen.getByText(/Net 60/)).toBeInTheDocument();
    expect(screen.getByText(/Due on Receipt/)).toBeInTheDocument();
  });
});
