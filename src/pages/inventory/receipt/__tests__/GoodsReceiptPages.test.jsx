import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import GoodsReceiptList from '../GoodsReceiptList';
import GoodsReceiptCreate from '../GoodsReceiptCreate';
import GoodsReceiptDetail from '../GoodsReceiptDetail';
import { getAllGoodsReceipts, createGoodsReceipt, getGoodsReceiptById } from '../../../../services/inventory/goodsReceipt';
import { getGoodsReceiptItemsByGoodsReceipt } from '../../../../services/inventory/goodsReceiptItem';
import { getAllSuppliers } from '../../../../services/inventory/supplier';
import { getInventoryItems } from '../../../../services/inventory/inventoryItem';

jest.mock('../../../../services/inventory/goodsReceipt');
jest.mock('../../../../services/inventory/goodsReceiptItem');
jest.mock('../../../../services/inventory/supplier');
jest.mock('../../../../services/inventory/inventoryItem');
jest.mock('react-toastify');

const renderWithRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>);

describe('Goods Receipt Pages', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders list with pagination and navigates to create', async () => {
    getAllGoodsReceipts.mockResolvedValue({ content: [{ id: 1, receiptNumber: 'GR-001', receiptDate: '2024-01-01', supplierName: 'ABC', status: 'PENDING', totalItems: 2 }], totalPages: 1 });
    renderWithRouter(<GoodsReceiptList />);

    await waitFor(() => {
      expect(screen.getByText('Goods Receipts')).toBeInTheDocument();
      expect(screen.getByText('GR-001')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('New Goods Receipt'));
  });

  it('shows error toast when list fails to load', async () => {
    getAllGoodsReceipts.mockRejectedValue(new Error('Network error'));
    renderWithRouter(<GoodsReceiptList />);
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });

  it('renders create form and validates fields', async () => {
    getAllSuppliers.mockResolvedValue({ content: [{ id: 1, name: 'ABC' }] });
    getInventoryItems.mockResolvedValue({ content: [{ id: 10, name: 'Item A', sku: 'A001' }] });

    renderWithRouter(<GoodsReceiptCreate />);

    await waitFor(() => {
      expect(screen.getByText('Create Goods Receipt')).toBeInTheDocument();
    });

    // Submit without filling
    fireEvent.click(screen.getByText('Create Receipt'));

    await waitFor(() => {
      expect(screen.getByText('Supplier is required')).toBeInTheDocument();
      expect(screen.getByText('At least one item is required') || screen.getByText('Quantity must be > 0')).toBeInTheDocument();
    });
  });

  it('creates goods receipt successfully', async () => {
    getAllSuppliers.mockResolvedValue({ content: [{ id: 1, name: 'ABC' }] });
    getInventoryItems.mockResolvedValue({ content: [{ id: 10, name: 'Item A', sku: 'A001' }] });
    createGoodsReceipt.mockResolvedValue({ id: 5 });

    renderWithRouter(<GoodsReceiptCreate />);

    await waitFor(() => {
      expect(screen.getByText('Create Goods Receipt')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText('Supplier *'), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText('Item *'), { target: { value: '10' } });
    fireEvent.change(screen.getByLabelText('Qty *'), { target: { value: '2' } });
    fireEvent.change(screen.getByLabelText('Unit Price *'), { target: { value: '3.5' } });

    fireEvent.click(screen.getByText('Create Receipt'));

    await waitFor(() => {
      expect(createGoodsReceipt).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith('Goods receipt created');
    });
  });

  it('renders detail page and shows items', async () => {
    getGoodsReceiptById.mockResolvedValue({ id: 1, receiptNumber: 'GR-001', receiptDate: '2024-01-01', supplierName: 'ABC' });
    getGoodsReceiptItemsByGoodsReceipt.mockResolvedValue({ content: [{ id: 1, inventoryItemName: 'Item A', quantity: 2, unitPrice: 3.5 }] });

    // Override useParams by creating a wrapper that provides location with id param via memory router
    const { MemoryRouter, Route, Routes } = require('react-router-dom');

    render(
      <MemoryRouter initialEntries={[{ pathname: '/inventory/receipt/1' }] }>
        <Routes>
          <Route path="/inventory/receipt/:id" element={<GoodsReceiptDetail />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Goods Receipt #GR-001')).toBeInTheDocument();
      expect(screen.getByText('Item A')).toBeInTheDocument();
      expect(screen.getByText('$3.50')).toBeInTheDocument();
    });
  });
});


