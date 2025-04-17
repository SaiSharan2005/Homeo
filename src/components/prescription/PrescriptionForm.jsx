import React, { useEffect, useState } from 'react';
import { FaTimes, FaPlus, FaSearch } from 'react-icons/fa';

const PrescriptionForm = ({ 
  onClose, 
  onPrescriptionCreated, 
  doctorId, 
  patientId, 
  bookingAppointmentId 
}) => {
  // Prescription-level state
  const [prescriptionNumber, setPrescriptionNumber] = useState('');
  const [generalInstructions, setGeneralInstructions] = useState('');
  // Each prescription item now contains searchTerm, selectedMedicine details, and quantity.
  const [prescriptionItems, setPrescriptionItems] = useState([]);

  // Available inventory items fetched from backend
  const [availableItems, setAvailableItems] = useState([]);
  const frequencyOptions = [
    "Before Breakfast",
    "Before Lunch",
    "Before Dinner",
    "Before Lunch and Before Dinner",
    "After Breakfast",
    "After Lunch",
    "After Dinner",
    "After Lunch and After Dinner",
    "Morning",
    "Night",
    "Every 8 Hours",
    "Every 12 Hours"
  ];

  // Fetch available inventory items for search functionality
  useEffect(() => {
    const fetchInventoryItems = async () => {
      try {
        const response = await fetch(
          process.env.REACT_APP_BACKEND_URL + '/inventory-items'
        );
        if (!response.ok) {
          throw new Error('Failed to fetch inventory items');
        }
        const data = await response.json();
        setAvailableItems(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchInventoryItems();
  }, []);

  // Add a new empty prescription item with local search state and quantity field.
  const addPrescriptionItem = () => {
    setPrescriptionItems(prev => [
      ...prev,
      {
        inventoryItemId: null,
        selectedMedicine: null,
        searchTerm: '',
        dosage: '',
        frequency: '',
        duration: '',
        additionalInstructions: '',
        quantity: ''
      }
    ]);
  };

  // Update a field in a prescription item at a given index
  const updatePrescriptionItem = (index, field, value) => {
    setPrescriptionItems(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // Remove a prescription item at a given index
  const removePrescriptionItem = (index) => {
    setPrescriptionItems(prev => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
  };

  // Handle form submission: create the prescription and add items.
  const handleSubmit = async (e) => {
    e.preventDefault();
    const prescriptionDto = {
      prescriptionNumber,
      doctorId,
      patientId,
      bookingAppointmentId,
      generalInstructions,
      prescriptionItems: [] // Items will be added separately
    };

    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + '/prescriptions',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(prescriptionDto)
        }
      );
      if (!response.ok) {
        throw new Error('Failed to create prescription');
      }
      const createdPrescription = await response.json();

      // Add each prescription item using the separate endpoint
      for (const item of prescriptionItems) {
        const itemPayload = {
          inventoryItemId: item.inventoryItemId,
          dosage: item.dosage,
          frequency: item.frequency,
          duration: item.duration,
          additionalInstructions: item.additionalInstructions,
          quantity: item.quantity
        };

        const itemResponse = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/prescriptions/${createdPrescription.id}/items`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(itemPayload)
          }
        );
        if (!itemResponse.ok) {
          throw new Error('Failed to add a prescription item');
        }
      }

      const totalAmount = prescriptionItems.reduce((acc, item) => {
        const price = item.selectedMedicine ? parseFloat(item.selectedMedicine.sellingPrice) : 0;
        const qty = parseFloat(item.quantity) || 0;
        return acc + price * qty;
      }, 0);

      alert(`Prescription created successfully. Total Amount: ₹${totalAmount.toFixed(2)}`);
      onPrescriptionCreated(createdPrescription);
      onClose();
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto transform transition-all">
        <div className="sticky top-0 z-20">
          <div className="flex justify-between items-center p-5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-t-xl">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <FaPlus /> Add Prescription
            </h2>
            <button 
              onClick={onClose} 
              className="text-white text-3xl hover:text-gray-200 transition-colors"
            >
              <FaTimes />
            </button>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Prescription Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prescription Number
            </label>
            <input
              type="text"
              value={prescriptionNumber}
              onChange={(e) => setPrescriptionNumber(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              required
            />
          </div>
          {/* General Instructions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              General Instructions
            </label>
            <textarea
              value={generalInstructions}
              onChange={(e) => setGeneralInstructions(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              rows="3"
            />
          </div>
          {/* Prescription Items */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Prescription Items</h3>
            {prescriptionItems.map((item, index) => (
              <div key={index} className="relative mb-6 p-5 border rounded-xl shadow-sm bg-gray-50 hover:shadow-lg transition-shadow">
                {/* Remove Icon */}
                <button
                  type="button"
                  onClick={() => removePrescriptionItem(index)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-red-500 transition-colors"
                >
                  <FaTimes />
                </button>
                {/* Medicine search and selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                    <FaSearch /> Medicine
                  </label>
                  {item.selectedMedicine ? (
                    <div className="p-3 border rounded bg-white flex justify-between items-center">
                      <div>
                        <p className="font-bold text-gray-800">{item.selectedMedicine.name}</p>
                        <p className="text-sm text-gray-500">Unit: {item.selectedMedicine.unit}</p>
                        <p className="text-sm text-gray-500">{item.selectedMedicine.description}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          updatePrescriptionItem(index, 'selectedMedicine', null);
                          updatePrescriptionItem(index, 'inventoryItemId', null);
                          updatePrescriptionItem(index, 'searchTerm', '');
                        }}
                        className="text-blue-500 hover:underline transition-colors"
                      >
                        Change
                      </button>
                    </div>
                  ) : (
                    <>
                      <input
                        type="text"
                        placeholder="Search medicine by name..."
                        value={item.searchTerm || ''}
                        onChange={(e) => updatePrescriptionItem(index, 'searchTerm', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                      />
                      {item.searchTerm && (
                        <ul className="mt-2 border border-gray-300 rounded-lg bg-white shadow-lg max-h-48 overflow-y-auto">
                          {availableItems
                            .filter(invItem =>
                              invItem.name.toLowerCase().includes(item.searchTerm.toLowerCase())
                            )
                            .map(invItem => (
                              <li
                                key={invItem.id}
                                onClick={() => {
                                  updatePrescriptionItem(index, 'inventoryItemId', invItem.id);
                                  updatePrescriptionItem(index, 'selectedMedicine', invItem);
                                  updatePrescriptionItem(index, 'searchTerm', invItem.name);
                                }}
                                className="p-3 hover:bg-blue-100 cursor-pointer transition-colors"
                              >
                                <div className="font-bold text-gray-800">{invItem.name}</div>
                                <div className="text-sm text-gray-500">Unit: {invItem.unit}</div>
                                <div className="text-sm text-gray-500">{invItem.description}</div>
                              </li>
                            ))}
                        </ul>
                      )}
                    </>
                  )}
                </div>
                {/* Dosage, Frequency, Duration, Additional Instructions, and Quantity */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dosage
                    </label>
                    <input
                      type="text"
                      value={item.dosage}
                      onChange={(e) =>
                        updatePrescriptionItem(index, 'dosage', e.target.value)
                      }
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Frequency
                    </label>
                    <select
                      value={item.frequency}
                      onChange={(e) => updatePrescriptionItem(index, 'frequency', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                      required
                    >
                      <option value="">Select Frequency</option>
                      {frequencyOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration
                    </label>
                    <input
                      type="text"
                      value={item.duration}
                      onChange={(e) =>
                        updatePrescriptionItem(index, 'duration', e.target.value)
                      }
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Instructions
                    </label>
                    <textarea
                      value={item.additionalInstructions}
                      onChange={(e) =>
                        updatePrescriptionItem(index, 'additionalInstructions', e.target.value)
                      }
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                      rows="2"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updatePrescriptionItem(index, 'quantity', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={addPrescriptionItem}
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg transition-colors"
              >
                <FaPlus /> Add Prescription Item
              </button>
            </div>
          </div>
          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded-lg transition-colors"
            >
              <FaTimes /> Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg transition-colors"
            >
              <FaPlus /> Create Prescription
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PrescriptionForm;
