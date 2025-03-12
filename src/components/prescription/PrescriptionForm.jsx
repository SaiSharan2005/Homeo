import React, { useEffect, useState } from 'react';

const PrescriptionForm = ({ 
  onClose, 
  onPrescriptionCreated, 
  doctorId, 
  patientId, 
  bookingAppointmentId // or pass booking appointment data if needed
}) => {
  // Prescription-level state
  const [prescriptionNumber, setPrescriptionNumber] = useState('');
  const [generalInstructions, setGeneralInstructions] = useState('');
  // Each prescription item now contains a searchTerm and selectedMedicine details.
  const [prescriptionItems, setPrescriptionItems] = useState([]);

  // Available inventory items fetched from backend
  const [availableItems, setAvailableItems] = useState([]);

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

  // Add a new empty prescription item with local search state
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
        additionalInstructions: ''
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

  // Handle form submission: first create prescription then add items one by one using the dedicated route
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Create the prescription payload without items first
    const prescriptionDto = {
      prescriptionNumber,
      doctorId,  // from props
      patientId, // from props
      bookingAppointmentId, // from props, if provided
      generalInstructions,
      prescriptionItems: [] // Items will be added separately
    };

    try {
      // Create the prescription
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

      // Now add each prescription item using the separate endpoint
      for (const item of prescriptionItems) {
        const itemPayload = {
          inventoryItemId: item.inventoryItemId,
          dosage: item.dosage,
          frequency: item.frequency,
          duration: item.duration,
          additionalInstructions: item.additionalInstructions
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

      // Optionally, re-fetch the complete prescription with all items.
      onPrescriptionCreated(createdPrescription);
      onClose();
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-[70%] max-h-[80vh] overflow-y-auto transform transition-all">
        <div className="flex justify-between items-center border-b pb-4 mb-6 sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-bold text-gray-800">Add Prescription</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800 text-3xl">
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          {/* Prescription Number */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prescription Number
            </label>
            <input
              type="text"
              value={prescriptionNumber}
              onChange={(e) => setPrescriptionNumber(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          {/* General Instructions */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              General Instructions
            </label>
            <textarea
              value={generalInstructions}
              onChange={(e) => setGeneralInstructions(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              rows="3"
            />
          </div>
          {/* Prescription Items */}
          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-4">
            Prescription Items
          </h3>
          {prescriptionItems.map((item, index) => (
            <div key={index} className="mb-6 border p-4 rounded-lg shadow-sm">
              {/* Medicine search and selection */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Medicine
                </label>
                {item.selectedMedicine ? (
                  <div className="p-2 border rounded bg-gray-100 flex justify-between items-center">
                    <div>
                      <p className="font-bold">{item.selectedMedicine.name}</p>
                      <p className="text-sm text-gray-600">Unit: {item.selectedMedicine.unit}</p>
                      <p className="text-sm text-gray-600">{item.selectedMedicine.description}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        updatePrescriptionItem(index, 'selectedMedicine', null);
                        updatePrescriptionItem(index, 'inventoryItemId', null);
                        updatePrescriptionItem(index, 'searchTerm', '');
                      }}
                      className="text-blue-500 hover:underline"
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
                      className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    {item.searchTerm && (
                      <ul className="border border-gray-300 mt-2 max-h-40 overflow-y-auto rounded-lg bg-white shadow-lg">
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
                              className="p-2 hover:bg-blue-100 cursor-pointer"
                            >
                              <div className="font-bold">{invItem.name}</div>
                              <div className="text-sm text-gray-600">Unit: {invItem.unit}</div>
                              <div className="text-sm text-gray-600">{invItem.description}</div>
                            </li>
                          ))}
                      </ul>
                    )}
                  </>
                )}
              </div>
              {/* Dosage, Frequency, Duration, Additional Instructions */}
              <div className="mb-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dosage
                  </label>
                  <input
                    type="text"
                    value={item.dosage}
                    onChange={(e) =>
                      updatePrescriptionItem(index, 'dosage', e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Frequency
                  </label>
                  <input
                    type="text"
                    value={item.frequency}
                    onChange={(e) =>
                      updatePrescriptionItem(index, 'frequency', e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  />
                </div>
              </div>
              <div className="mb-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={item.duration}
                    onChange={(e) =>
                      updatePrescriptionItem(index, 'duration', e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Instructions
                  </label>
                  <textarea
                    value={item.additionalInstructions}
                    onChange={(e) =>
                      updatePrescriptionItem(index, 'additionalInstructions', e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    rows="2"
                  />
                </div>
              </div>
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => removePrescriptionItem(index)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  Remove Item
                </button>
              </div>
            </div>
          ))}
          <div className="mb-6 text-right">
            <button
              type="button"
              onClick={addPrescriptionItem}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              Add Prescription Item
            </button>
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              Create Prescription
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PrescriptionForm;
