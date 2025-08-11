import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import StockLevels from '../StockLevels';
import StockAdjustments from '../StockAdjustments';
import { getStockLevels, getLowStockItems } from '../../../services/inventory/stockLevel';
import { getStockAdjustments } from '../../../services/inventory/stockAdjustment';

jest.mock('../../../services/inventory/stockLevel');
jest.mock('../../../services/inventory/stockAdjustment');
jest.mock('react-toastify');

const renderWithRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>);

describe('Stock pages', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders StockLevels with pagination and low stock filter', async () => {
    getStockLevels.mockResolvedValue({ content: [{ id: 1, itemName: 'Item A', sku: 'A001', warehouseName: 'Main', quantity: 5, reorderLevel: 10 }], totalPages: 1 });
    getLowStockItems.mockResolvedValue({ content: [{ id: 2, itemName: 'Item B', sku: 'B001', warehouseName: 'Main', quantity: 2, reorderLevel: 5 }], totalPages: 1 });

    renderWithRouter(<StockLevels />);

    await waitFor(() => {
      expect(screen.getByText('Stock Levels')).toBeInTheDocument();
      expect(screen.getByText('Item A')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByLabelText('Show low stock only'));

    await waitFor(() => {
      expect(getLowStockItems).toHaveBeenCalled();
    });
  });

  it('renders StockAdjustments with pagination', async () => {
    getStockAdjustments.mockResolvedValue({ content: [{ id: 10, itemName: 'Item A', warehouseName: 'Main', quantity: -3, adjustmentDate: '2024-01-01T00:00:00Z', reason: 'Damaged' }], totalPages: 1 });

    renderWithRouter(<StockAdjustments />);

    await waitFor(() => {
      expect(screen.getByText('Stock Adjustments')).toBeInTheDocument();
      expect(screen.getByText('#10')).toBeInTheDocument();
      expect(screen.getByText('Damaged')).toBeInTheDocument();
    });
  });
});


