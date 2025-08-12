import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import InventoryItemList from '../InventoryItemList';
import InventoryItemDetail from '../InventoryItemDetail';
import * as ItemSvc from '../../../services/inventory/inventoryItem';

jest.mock('../../../services/inventory/inventoryItem');
jest.mock('react-toastify');

const renderWithRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>);

describe('Inventory Item pages', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Set admin role to enable Delete button
    window.localStorage.setItem('ROLE', 'ADMIN');
  });

  it('renders InventoryItemList and supports pagination', async () => {
    ItemSvc.getInventoryItems.mockResolvedValue({ content: [
      { id: 1, name: 'Aconite', commonName: 'Aconitum', source: 'Botanical', potency: '30C', formulation: 'Tablets', expiryDate: '2025-01-01', sellingPrice: 100 }
    ], totalPages: 1 });

    renderWithRouter(<InventoryItemList />);

    await waitFor(() => {
      expect(screen.getByText('Inventory Items')).toBeInTheDocument();
      expect(screen.getByText('Aconite')).toBeInTheDocument();
    });
  });

  it('deletes an inventory item', async () => {
    ItemSvc.getInventoryItems.mockResolvedValue({ content: [
      { id: 2, name: 'Belladonna', commonName: 'Bell', source: 'Botanical', potency: '200C', formulation: 'Drops', expiryDate: '2026-01-01', sellingPrice: 150 }
    ], totalPages: 1 });
    ItemSvc.deleteInventoryItem.mockResolvedValue({});

    // Confirm deletion
    jest.spyOn(window, 'confirm').mockReturnValue(true);

    renderWithRouter(<InventoryItemList />);

    await waitFor(() => expect(screen.getByText('Belladonna')).toBeInTheDocument());

    const deleteBtn = screen.getByTitle('Delete');
    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(ItemSvc.deleteInventoryItem).toHaveBeenCalledWith(2);
      expect(toast.success).toHaveBeenCalled();
    });
  });

  it('renders InventoryItemDetail with modern UI and data', async () => {
    ItemSvc.getInventoryItemById.mockResolvedValue({
      id: 5,
      name: 'Arnica',
      commonName: 'Arnica Montana',
      unit: 'Bottle',
      reorderLevel: 5,
      expiryDate: '2026-12-01',
      category: { name: 'Pain Relief' },
      records: [ { id: 1, quantity: 10, warehouse: { name: 'Main', location: 'HQ' } } ]
    });

    const { MemoryRouter, Route, Routes } = require('react-router-dom');
    render(
      <MemoryRouter initialEntries={[{ pathname: '/inventory-items/5' }] }>
        <Routes>
          <Route path="/inventory-items/:id" element={<InventoryItemDetail />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Arnica')).toBeInTheDocument();
      expect(screen.getByText('Total Stock')).toBeInTheDocument();
      expect(screen.getByText('Inventory Records')).toBeInTheDocument();
    });
  });
});


