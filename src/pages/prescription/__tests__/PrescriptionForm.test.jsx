import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ToastContainer } from 'react-toastify';
import PrescriptionForm from '../../../components/prescription/PrescriptionForm';
import { getInventoryItems } from '../../../services/inventory/inventoryItem';
import { createPrescription, addPrescriptionItem } from '../../../services/prescription';

jest.mock('../../../services/inventory/inventoryItem');
jest.mock('../../../services/prescription');

describe('PrescriptionForm', () => {
  beforeEach(() => jest.clearAllMocks());

  it('creates prescription and adds items', async () => {
    getInventoryItems.mockResolvedValue({ content: [{ id: 10, name: 'Aconite', unit: 'bottle', sellingPrice: 100 }] });
    createPrescription.mockResolvedValue({ id: 999 });
    addPrescriptionItem.mockResolvedValue({ id: 1 });

    const onClose = jest.fn();
    const onPrescriptionCreated = jest.fn();

    render(
      <>
        <PrescriptionForm onClose={onClose} onPrescriptionCreated={onPrescriptionCreated} doctorId={1} patientId={2} bookingAppointmentId={3} />
        <ToastContainer />
      </>
    );

    // fill basic fields
    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[0], { target: { value: 'P-1' } });
    fireEvent.change(screen.getByLabelText('General Instructions'), { target: { value: 'Rest well' } });

    // add one item
    fireEvent.click(screen.getByRole('button', { name: /Add Prescription Item/i }));

    // search and select medicine
    const searchInput = screen.getByPlaceholderText('Search medicine by name...');
    fireEvent.change(searchInput, { target: { value: 'Aco' } });
    await waitFor(() => expect(screen.getByText('Aconite')).toBeInTheDocument());
    fireEvent.click(screen.getByText('Aconite'));

    // fill item fields
    fireEvent.change(screen.getByLabelText('Dosage'), { target: { value: '1 tab' } });
    fireEvent.change(screen.getByLabelText('Frequency'), { target: { value: 'Morning' } });
    fireEvent.change(screen.getByLabelText('Duration'), { target: { value: '5 days' } });
    fireEvent.change(screen.getByLabelText('Additional Instructions'), { target: { value: 'After food' } });
    fireEvent.change(screen.getByLabelText('Quantity'), { target: { value: '2' } });

    // submit
    fireEvent.click(screen.getByRole('button', { name: /Create Prescription/i }));

    await waitFor(() => {
      expect(createPrescription).toHaveBeenCalled();
      expect(addPrescriptionItem).toHaveBeenCalled();
      expect(onPrescriptionCreated).toHaveBeenCalled();
      expect(onClose).toHaveBeenCalled();
    });
  });
});


