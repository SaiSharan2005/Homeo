// src/components/PrescriptionItem.jsx
import React, { useState, useEffect } from 'react';

const PrescriptionItem = ({ index, item, availableItems, onChange, onRemove }) => {
  const [localItem, setLocalItem] = useState(item);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    setLocalItem(item);
  }, [item]);

  useEffect(() => {
    const filtered = availableItems.filter(invItem =>
      invItem.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [searchTerm, availableItems]);

  const handleFieldChange = (field, value) => {
    const updatedItem = { ...localItem, [field]: value };
    setLocalItem(updatedItem);
    onChange(updatedItem);
  };

  const handleSelectItem = (selectedItemId) => {
    handleFieldChange('inventoryItemId', selectedItemId);
    setSearchTerm('');
  };

  return (
    <div className="border p-4 mb-4 rounded">
      <div className="mb-2">
        <label className="block font-semibold">Inventory Item ID</label>
        <input
          type="number"
          value={localItem.inventoryItemId || ''}
          onChange={(e) => handleFieldChange('inventoryItemId', e.target.value)}
          className="w-full border p-2 rounded"
          placeholder="Or search below"
          required
        />
      </div>
      <div className="mb-2">
        <label className="block font-semibold">Search Inventory Item</label>
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border p-2 rounded"
        />
        {searchTerm && (
          <ul className="border border-gray-300 mt-2 max-h-40 overflow-y-auto">
            {filteredItems.map(invItem => (
              <li
                key={invItem.id}
                onClick={() => handleSelectItem(invItem.id)}
                className="p-2 hover:bg-gray-100 cursor-pointer"
              >
                {invItem.name}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="mb-2">
        <label className="block font-semibold">Dosage</label>
        <input
          type="text"
          value={localItem.dosage}
          onChange={(e) => handleFieldChange('dosage', e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
      </div>
      <div className="mb-2">
        <label className="block font-semibold">Frequency</label>
        <input
          type="text"
          value={localItem.frequency}
          onChange={(e) => handleFieldChange('frequency', e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
      </div>
      <div className="mb-2">
        <label className="block font-semibold">Duration</label>
        <input
          type="text"
          value={localItem.duration}
          onChange={(e) => handleFieldChange('duration', e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
      </div>
      <div className="mb-2">
        <label className="block font-semibold">Additional Instructions</label>
        <textarea
          value={localItem.additionalInstructions}
          onChange={(e) => handleFieldChange('additionalInstructions', e.target.value)}
          className="w-full border p-2 rounded"
          rows="2"
        />
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Remove Item
      </button>
    </div>
  );
};

export default PrescriptionItem;
