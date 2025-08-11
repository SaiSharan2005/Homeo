import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import InventoryRecordList from '../InventoryRecordList';
import InventoryTransactionList from '../InventoryTransactionList';
import * as RecordsSvc from '../../../services/inventory/InventoryRecord';
import * as TxnSvc from '../../../services/inventory/inventoryTransaction';

jest.mock('../../../services/inventory/InventoryRecord');
jest.mock('../../../services/inventory/inventoryTransaction');
jest.mock('react-toastify');

const renderWithRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>);

describe('Inventory Records and Transactions pages', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders InventoryRecordList and loads records', async () => {
    RecordsSvc.fetchInventoryRecords = jest.fn().mockResolvedValue({ success: true, data: [{ id: 1, quantity: 5, expiryDate: '2024-01-01', inventoryItem: { name: 'Item A', commonName: 'A' } }] });
    renderWithRouter(<InventoryRecordList />);
    await waitFor(() => {
      expect(screen.getByText('Inventory Records')).toBeInTheDocument();
      expect(screen.getByText('Item A')).toBeInTheDocument();
    });
  });

  it('renders InventoryTransactionList and loads transactions', async () => {
    TxnSvc.fetchInventoryTransactions = jest.fn().mockResolvedValue({ success: true, data: [{ id: 10, transactionType: 'IN', quantity: 3, transactionDate: '2024-01-02', inventoryItem: { name: 'Item A', commonName: 'A' }, inventoryRecord: { batchNumber: 'B1' } }] });
    renderWithRouter(<InventoryTransactionList />);
    await waitFor(() => {
      expect(screen.getByText('Inventory Transactions')).toBeInTheDocument();
      // Ensure at least one "Stock In" appears (dropdown option + summary label). Use getAllByText
      expect(screen.getAllByText('Stock In').length).toBeGreaterThan(0);
    });
  });
});


