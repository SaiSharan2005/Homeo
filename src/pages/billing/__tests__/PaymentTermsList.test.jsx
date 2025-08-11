import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import PaymentTermsList from '../PaymentTermsList';
import * as paymentTermsService from '../../../services/billing/paymentTerms';

// Mock the services
jest.mock('../../../services/billing/paymentTerms');
jest.mock('react-toastify');

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock data
const mockPaymentTerms = [
  {
    id: 1,
    name: 'Net 30',
    description: 'Payment due in 30 days',
    days: 30,
    active: true
  },
  {
    id: 2,
    name: 'Net 60',
    description: 'Payment due in 60 days',
    days: 60,
    active: false
  }
];

const mockPaginationResponse = {
  content: mockPaymentTerms,
  totalPages: 2,
  totalElements: 15,
  number: 0,
  size: 10,
  first: true,
  last: false
};

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('PaymentTermsList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    paymentTermsService.getAllPaymentTerms.mockResolvedValue(mockPaginationResponse);
    paymentTermsService.deletePaymentTerms.mockResolvedValue({});
    paymentTermsService.getPaymentTermsCount.mockResolvedValue({ count: 15 });
  });

  describe('Initial Rendering', () => {
    test('renders loading state initially', () => {
      renderWithRouter(<PaymentTermsList />);
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    test('renders payment terms table after loading', async () => {
      renderWithRouter(<PaymentTermsList />);
      
      await waitFor(() => {
        expect(screen.getByText('Payment Terms')).toBeInTheDocument();
        expect(screen.getByText('Net 30')).toBeInTheDocument();
        expect(screen.getByText('Net 60')).toBeInTheDocument();
      });
    });

    test('renders create button', async () => {
      renderWithRouter(<PaymentTermsList />);
      
      await waitFor(() => {
        expect(screen.getByText('Create New Payment Term')).toBeInTheDocument();
      });
    });
  });

  describe('Data Loading', () => {
    test('calls getAllPaymentTerms on mount', async () => {
      renderWithRouter(<PaymentTermsList />);
      
      await waitFor(() => {
        expect(paymentTermsService.getAllPaymentTerms).toHaveBeenCalledWith(0, 10);
      });
    });

    test('handles API error gracefully', async () => {
      const errorMessage = 'Failed to fetch payment terms';
      paymentTermsService.getAllPaymentTerms.mockRejectedValue(new Error(errorMessage));
      
      renderWithRouter(<PaymentTermsList />);
      
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Failed to load payment terms: ' + errorMessage);
      });
    });
  });

  describe('Pagination', () => {
    test('displays pagination controls when multiple pages exist', async () => {
      renderWithRouter(<PaymentTermsList />);
      
      await waitFor(() => {
        expect(screen.getByText('Previous')).toBeInTheDocument();
        expect(screen.getByText('Next')).toBeInTheDocument();
        expect(screen.getByText('1')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();
      });
    });

    test('changes page when pagination buttons are clicked', async () => {
      renderWithRouter(<PaymentTermsList />);
      
      await waitFor(() => {
        const nextButton = screen.getByText('Next');
        fireEvent.click(nextButton);
      });

      await waitFor(() => {
        expect(paymentTermsService.getAllPaymentTerms).toHaveBeenCalledWith(1, 10);
      });
    });

    test('changes page size when dropdown is changed', async () => {
      renderWithRouter(<PaymentTermsList />);
      
      await waitFor(() => {
        const pageSizeSelect = screen.getByDisplayValue('10 per page');
        fireEvent.change(pageSizeSelect, { target: { value: '20' } });
      });

      await waitFor(() => {
        expect(paymentTermsService.getAllPaymentTerms).toHaveBeenCalledWith(0, 20);
      });
    });

    test('displays correct pagination info', async () => {
      renderWithRouter(<PaymentTermsList />);
      
      await waitFor(() => {
        expect(screen.getByText('Showing 1 to 10 of 15 results')).toBeInTheDocument();
      });
    });
  });

  describe('Search Functionality', () => {
    test('filters payment terms based on search term', async () => {
      renderWithRouter(<PaymentTermsList />);
      
      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText('Search payment terms...');
        fireEvent.change(searchInput, { target: { value: 'Net 30' } });
      });

      expect(screen.getByText('Net 30')).toBeInTheDocument();
      expect(screen.queryByText('Net 60')).not.toBeInTheDocument();
    });

    test('filters by name and description', async () => {
      renderWithRouter(<PaymentTermsList />);
      
      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText('Search payment terms...');
        fireEvent.change(searchInput, { target: { value: '60 days' } });
      });

      expect(screen.getByText('Net 60')).toBeInTheDocument();
      expect(screen.queryByText('Net 30')).not.toBeInTheDocument();
    });
  });

  describe('CRUD Operations', () => {
    test('deletes payment term when delete button is clicked', async () => {
      global.confirm = jest.fn(() => true);
      
      renderWithRouter(<PaymentTermsList />);
      
      await waitFor(() => {
        const deleteButtons = screen.getAllByText('Delete');
        fireEvent.click(deleteButtons[0]);
      });

      expect(global.confirm).toHaveBeenCalledWith('Are you sure you want to delete this payment term?');
      
      await waitFor(() => {
        expect(paymentTermsService.deletePaymentTerms).toHaveBeenCalledWith(1);
        expect(toast.success).toHaveBeenCalledWith('Payment term deleted successfully');
      });
    });

    test('handles delete error gracefully', async () => {
      global.confirm = jest.fn(() => true);
      const errorMessage = 'Delete failed';
      paymentTermsService.deletePaymentTerms.mockRejectedValue(new Error(errorMessage));
      
      renderWithRouter(<PaymentTermsList />);
      
      await waitFor(() => {
        const deleteButtons = screen.getAllByText('Delete');
        fireEvent.click(deleteButtons[0]);
      });

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Failed to delete payment term: ' + errorMessage);
      });
    });

    test('does not delete when user cancels confirmation', async () => {
      global.confirm = jest.fn(() => false);
      
      renderWithRouter(<PaymentTermsList />);
      
      await waitFor(() => {
        const deleteButtons = screen.getAllByText('Delete');
        fireEvent.click(deleteButtons[0]);
      });

      expect(global.confirm).toHaveBeenCalled();
      expect(paymentTermsService.deletePaymentTerms).not.toHaveBeenCalled();
    });
  });

  describe('Navigation', () => {
    test('create button links to create page', async () => {
      renderWithRouter(<PaymentTermsList />);
      
      await waitFor(() => {
        const createButton = screen.getByText('Create New Payment Term');
        expect(createButton.closest('a')).toHaveAttribute('href', '/billing/payment-terms/create');
      });
    });

    test('view links navigate to detail page', async () => {
      renderWithRouter(<PaymentTermsList />);
      
      await waitFor(() => {
        const viewLinks = screen.getAllByText('View');
        expect(viewLinks[0].closest('a')).toHaveAttribute('href', '/billing/payment-terms/1');
      });
    });

    test('edit links navigate to edit page', async () => {
      renderWithRouter(<PaymentTermsList />);
      
      await waitFor(() => {
        const editLinks = screen.getAllByText('Edit');
        expect(editLinks[0].closest('a')).toHaveAttribute('href', '/billing/payment-terms/1/edit');
      });
    });
  });

  describe('Status Display', () => {
    test('displays active status correctly', async () => {
      renderWithRouter(<PaymentTermsList />);
      
      await waitFor(() => {
        const activeStatus = screen.getByText('Active');
        expect(activeStatus).toHaveClass('bg-green-100', 'text-green-800');
      });
    });

    test('displays inactive status correctly', async () => {
      renderWithRouter(<PaymentTermsList />);
      
      await waitFor(() => {
        const inactiveStatus = screen.getByText('Inactive');
        expect(inactiveStatus).toHaveClass('bg-red-100', 'text-red-800');
      });
    });
  });

  describe('Table Structure', () => {
    test('renders all required table headers', async () => {
      renderWithRouter(<PaymentTermsList />);
      
      await waitFor(() => {
        expect(screen.getByText('Name')).toBeInTheDocument();
        expect(screen.getByText('Description')).toBeInTheDocument();
        expect(screen.getByText('Days')).toBeInTheDocument();
        expect(screen.getByText('Status')).toBeInTheDocument();
        expect(screen.getByText('Actions')).toBeInTheDocument();
      });
    });

    test('displays payment term data in correct columns', async () => {
      renderWithRouter(<PaymentTermsList />);
      
      await waitFor(() => {
        expect(screen.getByText('Net 30')).toBeInTheDocument();
        expect(screen.getByText('Payment due in 30 days')).toBeInTheDocument();
        expect(screen.getByText('30 days')).toBeInTheDocument();
      });
    });
  });
});
