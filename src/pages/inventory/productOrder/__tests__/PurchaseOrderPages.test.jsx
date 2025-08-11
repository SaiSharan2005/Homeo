import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import PurchaseOrderCreate from '../PurchaseOrderCreate';
import * as POService from '../../../../services/inventory/purchaseOrder';

jest.mock('../../../../services/inventory/purchaseOrder', () => ({
  createPurchaseOrder: jest.fn(),
}));
jest.mock('react-toastify');

const renderWithRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>);

describe('Purchase Order pages', () => {
  beforeEach(() => jest.clearAllMocks());

  it('creates a purchase order from form submission', async () => {
    POService.createPurchaseOrder.mockResolvedValue({ id: 1 });

    renderWithRouter(<PurchaseOrderCreate />);

    // Fill form fields
    fireEvent.change(screen.getByLabelText('Order Date'), { target: { value: '2025-01-01T10:00' } });
    fireEvent.change(screen.getByLabelText('Status'), { target: { value: 'CREATED' } });
    fireEvent.change(screen.getByLabelText('Total Amount'), { target: { value: '100' } });
    fireEvent.change(screen.getByLabelText('Supplier ID'), { target: { value: '2' } });

    fireEvent.click(screen.getByRole('button', { name: 'Create Order' }));

    await waitFor(() => {
      expect(POService.createPurchaseOrder).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalled();
    });
  });
});


