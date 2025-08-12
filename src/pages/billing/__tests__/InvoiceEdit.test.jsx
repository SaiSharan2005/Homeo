import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import InvoiceEdit from '../InvoiceEdit';
import { getInvoiceById, updateInvoice } from '../../../services/billing/invoice';
import { getAllPaymentTerms } from '../../../services/billing/paymentTerms';

// Mock the services
jest.mock('../../../services/billing/invoice');
jest.mock('../../../services/billing/paymentTerms');
jest.mock('react-toastify');

// Mock react-router-dom
const mockNavigate = jest.fn();
const mockParams = { id: '1' };
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => mockParams,
  useNavigate: () => mockNavigate,
}));

const mockInvoice = {
  id: 1,
  invoiceNumber: 'INV-001',
  customerName: 'John Doe',
  customerEmail: 'john@example.com',
  customerPhone: '123-456-7890',
  customerAddress: '123 Main St',
  invoiceDate: '2024-01-01',
  dueDate: '2024-01-31',
  paymentTermsId: 1,
  subtotal: 100.00,
  taxRate: 10.00,
  taxAmount: 10.00,
  total: 110.00,
  notes: 'Test invoice',
  status: 'DRAFT'
};

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

describe('InvoiceEdit', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getInvoiceById.mockResolvedValue(mockInvoice);
    getAllPaymentTerms.mockResolvedValue({ content: mockPaymentTerms });
    updateInvoice.mockResolvedValue({ id: 1 });
    toast.success = jest.fn();
    toast.error = jest.fn();
  });

  it('renders the edit invoice form', async () => {
    renderWithRouter(<InvoiceEdit />);
    
    await waitFor(() => {
      expect(screen.getByText('Edit Invoice')).toBeInTheDocument();
      expect(screen.getByText('Update the invoice details below.')).toBeInTheDocument();
    });
  });

  it('loads invoice data and payment terms on component mount', async () => {
    renderWithRouter(<InvoiceEdit />);
    
    await waitFor(() => {
      expect(getInvoiceById).toHaveBeenCalledWith('1');
      expect(getAllPaymentTerms).toHaveBeenCalledWith(0, 100);
    });
  });

  it('displays loading spinner while loading data', () => {
    getInvoiceById.mockImplementation(() => new Promise(() => {}));
    
    renderWithRouter(<InvoiceEdit />);
    
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('populates form fields with existing invoice data', async () => {
    renderWithRouter(<InvoiceEdit />);
    
    await waitFor(() => {
      expect(screen.getByDisplayValue('INV-001')).toBeInTheDocument();
      expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
      expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument();
      expect(screen.getByDisplayValue('123-456-7890')).toBeInTheDocument();
      expect(screen.getByDisplayValue('123 Main St')).toBeInTheDocument();
      expect(screen.getByDisplayValue('2024-01-01')).toBeInTheDocument();
      expect(screen.getByDisplayValue('2024-01-31')).toBeInTheDocument();
      expect(screen.getByDisplayValue('100')).toBeInTheDocument();
      // Avoid ambiguity: assert tax rate and tax amount via their labels
      expect(screen.getByLabelText('Tax Rate (%)')).toHaveValue(10);
      expect(screen.getByLabelText('Tax Amount')).toHaveValue(10);
      expect(screen.getByDisplayValue('Test invoice')).toBeInTheDocument();
    });
  });

  it('shows error toast when invoice loading fails', async () => {
    const errorMessage = 'Invoice not found';
    getInvoiceById.mockRejectedValue(new Error(errorMessage));
    
    renderWithRouter(<InvoiceEdit />);
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to load invoice: ' + errorMessage);
      expect(mockNavigate).toHaveBeenCalledWith('/billing/invoices');
    });
  });

  it('shows error toast when payment terms loading fails', async () => {
    const errorMessage = 'Failed to load payment terms';
    getAllPaymentTerms.mockRejectedValue(new Error(errorMessage));
    
    renderWithRouter(<InvoiceEdit />);
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to load payment terms: ' + errorMessage);
    });
  });

  it('validates required fields on form submission', async () => {
    renderWithRouter(<InvoiceEdit />);
    
    await waitFor(() => {
      expect(screen.getByText('Edit Invoice')).toBeInTheDocument();
    });

    // Clear required fields
    fireEvent.change(screen.getByLabelText('Invoice Number *'), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText('Customer Name *'), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText('Customer Email *'), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText('Invoice Date *'), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText('Due Date *'), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText('Subtotal *'), { target: { value: '' } });

    const submitButton = screen.getByText('Update Invoice');
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
    renderWithRouter(<InvoiceEdit />);
    
    await waitFor(() => {
      expect(screen.getByText('Edit Invoice')).toBeInTheDocument();
    });

    const emailInput = screen.getByLabelText('Customer Email *');
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);

    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
    });
  });

  it('validates due date is after invoice date', async () => {
    renderWithRouter(<InvoiceEdit />);
    
    await waitFor(() => {
      expect(screen.getByText('Edit Invoice')).toBeInTheDocument();
    });

    const dueDateInput = screen.getByLabelText('Due Date *');
    // Set due date to a date before the invoice date (2024-01-01)
    const dateBefore = '2023-12-31';
    
    fireEvent.change(dueDateInput, { target: { value: dateBefore } });
    
    const submitButton = screen.getByText('Update Invoice');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Due date must be after invoice date')).toBeInTheDocument();
    });
  });

  it('validates subtotal is a positive number', async () => {
    renderWithRouter(<InvoiceEdit />);
    
    await waitFor(() => {
      expect(screen.getByText('Edit Invoice')).toBeInTheDocument();
    });

    const subtotalInput = screen.getByLabelText('Subtotal *');
    fireEvent.change(subtotalInput, { target: { value: '-100' } });
    fireEvent.blur(subtotalInput);

    await waitFor(() => {
      expect(screen.getByText('Subtotal must be a positive number')).toBeInTheDocument();
    });
  });

  it('auto-calculates tax amount and total when subtotal and tax rate change', async () => {
    renderWithRouter(<InvoiceEdit />);
    
    await waitFor(() => {
      expect(screen.getByText('Edit Invoice')).toBeInTheDocument();
    });

    const subtotalInput = screen.getByLabelText('Subtotal *');
    const taxRateInput = screen.getByLabelText('Tax Rate (%)');
    
    fireEvent.change(subtotalInput, { target: { value: '200' } });
    fireEvent.change(taxRateInput, { target: { value: '15' } });

    await waitFor(() => {
      expect(screen.getByDisplayValue('30.00')).toBeInTheDocument(); // tax amount
      expect(screen.getByDisplayValue('230.00')).toBeInTheDocument(); // total
    });
  });

  it('clears field errors when user starts typing', async () => {
    renderWithRouter(<InvoiceEdit />);
    
    await waitFor(() => {
      expect(screen.getByText('Edit Invoice')).toBeInTheDocument();
    });

    // Trigger validation error
    fireEvent.change(screen.getByLabelText('Invoice Number *'), { target: { value: '' } });
    const submitButton = screen.getByText('Update Invoice');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Invoice number is required')).toBeInTheDocument();
    });

    // Start typing to clear error
    fireEvent.change(screen.getByLabelText('Invoice Number *'), { target: { value: 'INV-002' } });

    await waitFor(() => {
      expect(screen.queryByText('Invoice number is required')).not.toBeInTheDocument();
    });
  });

  it('submits form successfully with updated data', async () => {
    renderWithRouter(<InvoiceEdit />);
    
    await waitFor(() => {
      expect(screen.getByText('Edit Invoice')).toBeInTheDocument();
    });

    // Update some fields
    fireEvent.change(screen.getByLabelText('Customer Name *'), { target: { value: 'Jane Smith' } });
    fireEvent.change(screen.getByLabelText('Customer Email *'), { target: { value: 'jane@example.com' } });
    fireEvent.change(screen.getByLabelText('Subtotal *'), { target: { value: '150' } });
    fireEvent.change(screen.getByLabelText('Notes'), { target: { value: 'Updated invoice' } });

    const submitButton = screen.getByText('Update Invoice');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(updateInvoice).toHaveBeenCalledWith(1, {
        ...mockInvoice,
        customerName: 'Jane Smith',
        customerEmail: 'jane@example.com',
        subtotal: 150,
        taxAmount: 15,
        total: 165,
        notes: 'Updated invoice'
      });
      expect(toast.success).toHaveBeenCalledWith('Invoice updated successfully');
      expect(mockNavigate).toHaveBeenCalledWith('/billing/invoices/1');
    });
  });

  it('shows error toast when invoice update fails', async () => {
    const errorMessage = 'Failed to update invoice';
    updateInvoice.mockRejectedValue(new Error(errorMessage));
    
    renderWithRouter(<InvoiceEdit />);
    
    await waitFor(() => {
      expect(screen.getByText('Edit Invoice')).toBeInTheDocument();
    });

    const submitButton = screen.getByText('Update Invoice');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to update invoice: ' + errorMessage);
    });
  });

  it('displays payment terms in dropdown', async () => {
    renderWithRouter(<InvoiceEdit />);
    
    await waitFor(() => {
      expect(screen.getByText('Edit Invoice')).toBeInTheDocument();
    });

    const paymentTermsSelect = screen.getByLabelText('Payment Terms');
    expect(paymentTermsSelect).toBeInTheDocument();
    
    // Check if payment terms are populated - use more flexible text matching
    expect(screen.getByText(/Net 30/)).toBeInTheDocument();
    expect(screen.getByText(/Net 60/)).toBeInTheDocument();
    expect(screen.getByText(/Due on Receipt/)).toBeInTheDocument();
  });

  it('handles form submission with loading state', async () => {
    updateInvoice.mockImplementation(() => new Promise(() => {}));
    
    renderWithRouter(<InvoiceEdit />);
    
    await waitFor(() => {
      expect(screen.getByText('Edit Invoice')).toBeInTheDocument();
    });

    const submitButton = screen.getByText('Update Invoice');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Updating...')).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
    });
  });

  it('navigates back to invoice list on cancel', async () => {
    renderWithRouter(<InvoiceEdit />);
    
    await waitFor(() => {
      expect(screen.getByText('Edit Invoice')).toBeInTheDocument();
    });

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(mockNavigate).toHaveBeenCalledWith('/billing/invoices');
  });

  it('handles zero tax rate correctly', async () => {
    renderWithRouter(<InvoiceEdit />);
    
    await waitFor(() => {
      expect(screen.getByText('Edit Invoice')).toBeInTheDocument();
    });

    const taxRateInput = screen.getByLabelText('Tax Rate (%)');
    fireEvent.change(taxRateInput, { target: { value: '0' } });

    await waitFor(() => {
      expect(screen.getByDisplayValue('0.00')).toBeInTheDocument(); // tax amount
      expect(screen.getByDisplayValue('100.00')).toBeInTheDocument(); // total (same as subtotal)
    });
  });

  it('preserves existing values when only some fields are updated', async () => {
    renderWithRouter(<InvoiceEdit />);
    
    await waitFor(() => {
      expect(screen.getByText('Edit Invoice')).toBeInTheDocument();
    });

    // Only update customer name
    fireEvent.change(screen.getByLabelText('Customer Name *'), { target: { value: 'Jane Smith' } });

    const submitButton = screen.getByText('Update Invoice');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(updateInvoice).toHaveBeenCalledWith(1, {
        ...mockInvoice,
        customerName: 'Jane Smith'
      });
    });
  });
});
