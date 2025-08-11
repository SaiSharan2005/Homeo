import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import SupplierCreate from '../SupplierCreate';
import SupplierDetail from '../SupplierDetail';
import SupplierEdit from '../SupplierEdit';
import { createSupplier, getSupplierById, updateSupplier } from '../../../services/inventory/supplier';

jest.mock('../../../services/inventory/supplier');
jest.mock('react-toastify');

const renderWithRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>);

describe('Supplier pages', () => {
  beforeEach(() => jest.clearAllMocks());

  it('validates and creates supplier', async () => {
    renderWithRouter(<SupplierCreate />);
    fireEvent.click(screen.getByRole('button', { name: 'Create Supplier' }));
    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument();
      expect(screen.getByText('Email is required')).toBeInTheDocument();
      expect(screen.getByText('Phone is required')).toBeInTheDocument();
    });
    fireEvent.change(screen.getByLabelText('Name *'), { target: { value: 'ABC' } });
    fireEvent.change(screen.getByLabelText('Email *'), { target: { value: 'abc@example.com' } });
    fireEvent.change(screen.getByLabelText('Phone *'), { target: { value: '9999999999' } });
    createSupplier.mockResolvedValue({ id: 1 });
    fireEvent.click(screen.getByRole('button', { name: 'Create Supplier' }));
    await waitFor(() => {
      expect(createSupplier).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith('Supplier created');
    });
  });

  it('loads supplier detail', async () => {
    getSupplierById.mockResolvedValue({ id: 1, name: 'ABC', email: 'abc@example.com' });
    const { MemoryRouter, Route, Routes } = require('react-router-dom');
    render(
      <MemoryRouter initialEntries={[{ pathname: '/inventory/suppliers/1' }] }>
        <Routes>
          <Route path="/inventory/suppliers/:id" element={<SupplierDetail />} />
        </Routes>
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText('ABC')).toBeInTheDocument();
    });
  });

  it('edits supplier', async () => {
    getSupplierById.mockResolvedValue({ id: 1, name: 'ABC', email: 'abc@example.com', phone: '1' });
    updateSupplier.mockResolvedValue({});
    const { MemoryRouter, Route, Routes } = require('react-router-dom');
    render(
      <MemoryRouter initialEntries={[{ pathname: '/inventory/suppliers/1/edit' }] }>
        <Routes>
          <Route path="/inventory/suppliers/:id/edit" element={<SupplierEdit />} />
        </Routes>
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText('Edit Supplier')).toBeInTheDocument();
    });
    fireEvent.change(screen.getByLabelText('Name *'), { target: { value: 'XYZ' } });
    fireEvent.click(screen.getByText('Update Supplier'));
    await waitFor(() => {
      expect(updateSupplier).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith('Supplier updated');
    });
  });
});


