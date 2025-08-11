import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import InvoiceDetail from '../InvoiceDetail';
import { getInvoiceById } from '../../../services/billing/invoice';

// Mock the services
jest.mock('../../../services/billing/invoice');
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
  subtotal: 100.00,
  taxRate: 10.00,
  taxAmount: 10.00,
  total: 110.00,
  notes: 'Test invoice',
  status: 'DRAFT'
};

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('InvoiceDetail', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getInvoiceById.mockResolvedValue(mockInvoice);
    toast.error = jest.fn();
  });

  it('renders loading spinner initially', () => {
    getInvoiceById.mockImplementation(() => new Promise(() => {}));
    
    renderWithRouter(<InvoiceDetail />);
    
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('loads invoice data on component mount', async () => {
    renderWithRouter(<InvoiceDetail />);
    
    await waitFor(() => {
      expect(getInvoiceById).toHaveBeenCalledWith('1');
    });
  });

  it('displays invoice details after loading', async () => {
    renderWithRouter(<InvoiceDetail />);
    
    await waitFor(() => {
      expect(screen.getByText('Invoice #INV-001')).toBeInTheDocument();
      expect(screen.getByText('Invoice Details')).toBeInTheDocument();
    });

    // Check customer information
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('123-456-7890')).toBeInTheDocument();
    expect(screen.getByText('123 Main St')).toBeInTheDocument();

    // Check invoice details
    expect(screen.getByText('INV-001')).toBeInTheDocument();
    expect(screen.getByText('January 1, 2024')).toBeInTheDocument();
    expect(screen.getByText('January 31, 2024')).toBeInTheDocument();
    expect(screen.getByText('$100.00')).toBeInTheDocument();
    expect(screen.getByText('10%')).toBeInTheDocument();
    expect(screen.getByText('$10.00')).toBeInTheDocument();
    expect(screen.getByText('$110.00')).toBeInTheDocument();
    expect(screen.getByText('Test invoice')).toBeInTheDocument();
  });

  it('displays correct status badge for DRAFT status', async () => {
    renderWithRouter(<InvoiceDetail />);
    
    await waitFor(() => {
      expect(screen.getByText('DRAFT')).toBeInTheDocument();
    });

    const statusBadge = screen.getByText('DRAFT');
    expect(statusBadge).toHaveClass('bg-gray-100', 'text-gray-800');
  });

  it('displays correct status badge for PAID status', async () => {
    const paidInvoice = { ...mockInvoice, status: 'PAID' };
    getInvoiceById.mockResolvedValue(paidInvoice);
    
    renderWithRouter(<InvoiceDetail />);
    
    await waitFor(() => {
      expect(screen.getByText('PAID')).toBeInTheDocument();
    });

    const statusBadge = screen.getByText('PAID');
    expect(statusBadge).toHaveClass('bg-green-100', 'text-green-800');
  });

  it('displays correct status badge for OVERDUE status', async () => {
    const overdueInvoice = { ...mockInvoice, status: 'OVERDUE' };
    getInvoiceById.mockResolvedValue(overdueInvoice);
    
    renderWithRouter(<InvoiceDetail />);
    
    await waitFor(() => {
      expect(screen.getByText('OVERDUE')).toBeInTheDocument();
    });

    const statusBadge = screen.getByText('OVERDUE');
    expect(statusBadge).toHaveClass('bg-red-100', 'text-red-800');
  });

  it('displays correct status badge for SENT status', async () => {
    const sentInvoice = { ...mockInvoice, status: 'SENT' };
    getInvoiceById.mockResolvedValue(sentInvoice);
    
    renderWithRouter(<InvoiceDetail />);
    
    await waitFor(() => {
      expect(screen.getByText('SENT')).toBeInTheDocument();
    });

    const statusBadge = screen.getByText('SENT');
    expect(statusBadge).toHaveClass('bg-blue-100', 'text-blue-800');
  });

  it('displays correct status badge for CANCELLED status', async () => {
    const cancelledInvoice = { ...mockInvoice, status: 'CANCELLED' };
    getInvoiceById.mockResolvedValue(cancelledInvoice);
    
    renderWithRouter(<InvoiceDetail />);
    
    await waitFor(() => {
      expect(screen.getByText('CANCELLED')).toBeInTheDocument();
    });

    const statusBadge = screen.getByText('CANCELLED');
    expect(statusBadge).toHaveClass('bg-yellow-100', 'text-yellow-800');
  });

  it('displays Edit Invoice button', async () => {
    renderWithRouter(<InvoiceDetail />);
    
    await waitFor(() => {
      // Link in header
      expect(screen.getByRole('link', { name: 'Edit Invoice' })).toBeInTheDocument();
    });

    const editButton = screen.getByRole('link', { name: 'Edit Invoice' });
    expect(editButton).toHaveAttribute('href', '/billing/invoices/1/edit');
  });

  it('formats currency amounts correctly', async () => {
    const invoiceWithDecimals = { ...mockInvoice, subtotal: 99.99, taxAmount: 9.99, total: 109.98 };
    getInvoiceById.mockResolvedValue(invoiceWithDecimals);
    
    renderWithRouter(<InvoiceDetail />);
    
    await waitFor(() => {
      expect(screen.getByText('$99.99')).toBeInTheDocument();
      expect(screen.getByText('$9.99')).toBeInTheDocument();
      expect(screen.getByText('$109.98')).toBeInTheDocument();
    });
  });

  it('formats dates correctly', async () => {
    const invoiceWithDifferentDate = { ...mockInvoice, invoiceDate: '2024-12-25', dueDate: '2025-01-25' };
    getInvoiceById.mockResolvedValue(invoiceWithDifferentDate);
    
    renderWithRouter(<InvoiceDetail />);
    
    await waitFor(() => {
      expect(screen.getByText('December 25, 2024')).toBeInTheDocument();
      expect(screen.getByText('January 25, 2025')).toBeInTheDocument();
    });
  });

  it('handles missing optional fields gracefully', async () => {
    const invoiceWithMissingFields = {
      ...mockInvoice,
      customerPhone: null,
      customerAddress: null,
      notes: null
    };
    getInvoiceById.mockResolvedValue(invoiceWithMissingFields);
    
    renderWithRouter(<InvoiceDetail />);
    
    await waitFor(() => {
      expect(screen.getByText('Invoice #INV-001')).toBeInTheDocument();
    });

    // Check that N/A is displayed for missing fields (at least one occurrence)
    expect(screen.getAllByText('N/A').length).toBeGreaterThan(0);
  });

  it('shows error toast and navigates back when invoice loading fails', async () => {
    const errorMessage = 'Invoice not found';
    getInvoiceById.mockRejectedValue(new Error(errorMessage));
    
    renderWithRouter(<InvoiceDetail />);
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to load invoice: ' + errorMessage);
      expect(mockNavigate).toHaveBeenCalledWith('/billing/invoices');
    });
  });

  it('displays invoice not found message when invoice is null', async () => {
    getInvoiceById.mockResolvedValue(null);
    
    renderWithRouter(<InvoiceDetail />);
    
    await waitFor(() => {
      expect(screen.getByText('Invoice Not Found')).toBeInTheDocument();
      expect(screen.getByText("The invoice you're looking for doesn't exist.")).toBeInTheDocument();
    });

    const backButton = screen.getByText('Back to Invoices');
    expect(backButton).toHaveAttribute('href', '/billing/invoices');
  });

  it('handles zero amounts correctly', async () => {
    const invoiceWithZeroAmounts = { ...mockInvoice, taxRate: 0, taxAmount: 0 };
    getInvoiceById.mockResolvedValue(invoiceWithZeroAmounts);
    
    renderWithRouter(<InvoiceDetail />);
    
    await waitFor(() => {
      expect(screen.getByText('0%')).toBeInTheDocument();
      expect(screen.getByText('$0.00')).toBeInTheDocument();
    });
  });

  it('displays tax rate as percentage', async () => {
    renderWithRouter(<InvoiceDetail />);
    
    await waitFor(() => {
      expect(screen.getByText('10%')).toBeInTheDocument();
    });
  });

  it('shows loading state while fetching data', () => {
    getInvoiceById.mockImplementation(() => new Promise(() => {}));
    
    renderWithRouter(<InvoiceDetail />);
    
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
