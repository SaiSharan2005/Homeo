import React, { useState, useEffect } from 'react';

const InventoryItemAndRecordForm = () => {
  const API_BASE_URL = process.env.REACT_APP_BACKEND_URL; // Set in your .env file
  const token = localStorage.getItem("Token");

  // Form data for InventoryItem
  const [itemFormData, setItemFormData] = useState({
    name: '',
    description: '',
    manufacturer: '',
    unit: '',
    reorderLevel: 0,
    expiryDate: '',
    categoryId: ''
  });
  // Quantity for InventoryRecord
  const [recordQuantity, setRecordQuantity] = useState(0);
  // Categories for dropdown
  const [categories, setCategories] = useState([]);
  // Messages & errors
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  // After successful InventoryItem creation, store its ID
  const [createdItemId, setCreatedItemId] = useState(null);

  // Fetch categories when component mounts
  useEffect(() => {
    if (!token) {
      setError("No authentication token found.");
      return;
    }
    fetch(`${API_BASE_URL}/categories`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch categories.");
        return response.json();
      })
      .then((data) => setCategories(data))
      .catch((err) => {
        console.error("Error fetching categories:", err);
        setError("Error fetching categories.");
      });
  }, [API_BASE_URL, token]);

  // Handle changes for inventory item form
  const handleItemChange = (e) => {
    const { name, value } = e.target;
    setItemFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit inventory item form
  const handleItemSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!token) {
      setError("No authentication token found.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/inventory-items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(itemFormData)
      });
      if (!response.ok) throw new Error('Failed to create inventory item.');
      const data = await response.json();
      setMessage('Inventory item created successfully!');
      setCreatedItemId(data.id);
      // Optionally reset the inventory item form
      setItemFormData({
        name: '',
        description: '',
        manufacturer: '',
        unit: '',
        reorderLevel: 0,
        expiryDate: '',
        categoryId: ''
      });
    } catch (err) {
      console.error('Error creating inventory item:', err);
      setError('Failed to create inventory item.');
    }
  };

  // Handle change for record quantity
  const handleRecordQuantityChange = (e) => {
    setRecordQuantity(e.target.value);
  };

  // Submit inventory record form
  const handleRecordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!token) {
      setError("No authentication token found.");
      return;
    }

    // Prepare payload: note that backend may expect a nested object with just the IDs
    const payload = {
      quantity: parseInt(recordQuantity, 10),
      inventoryItemId: createdItemId ,
      // Assuming a default warehouse id; adjust if you have a different source for this value.
      warehouseId:1 ,
      id:1
    };

    try {
      const response = await fetch(`${API_BASE_URL}/inventory-records`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error('Failed to create inventory record.');
      await response.json();
      setMessage('Inventory record created successfully!');
      setRecordQuantity(0);
      // Optionally reset createdItemId if you want to allow new item creation afterwards.
      setCreatedItemId(null);
    } catch (err) {
      console.error('Error creating inventory record:', err);
      setError('Failed to create inventory record.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md mt-8">
      <h2 className="text-3xl font-bold mb-6 text-center">Create Inventory Item & Set Stock</h2>
      {!createdItemId ? (
        // Inventory Item Form
        <form onSubmit={handleItemSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-gray-700 mb-2">Name</label>
            <input 
              type="text"
              name="name"
              value={itemFormData.name}
              onChange={handleItemChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Description */}
          <div>
            <label className="block text-gray-700 mb-2">Description</label>
            <textarea 
              name="description"
              value={itemFormData.description}
              onChange={handleItemChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Manufacturer and Unit */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Manufacturer</label>
              <input 
                type="text"
                name="manufacturer"
                value={itemFormData.manufacturer}
                onChange={handleItemChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Unit</label>
              <input 
                type="text"
                name="unit"
                value={itemFormData.unit}
                onChange={handleItemChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          {/* Reorder Level and Expiry Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Reorder Level</label>
              <input 
                type="number"
                name="reorderLevel"
                value={itemFormData.reorderLevel}
                onChange={handleItemChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Expiry Date</label>
              <input 
                type="date"
                name="expiryDate"
                value={itemFormData.expiryDate}
                onChange={handleItemChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          {/* Category Dropdown */}
          <div>
            <label className="block text-gray-700 mb-2">Category</label>
            <select
              name="categoryId"
              value={itemFormData.categoryId}
              onChange={handleItemChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          {/* Submit Button */}
          <div className="text-center">
            <button 
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            >
              Create Inventory Item
            </button>
          </div>
        </form>
      ) : (
        // Inventory Record Form for Quantity
        <form onSubmit={handleRecordSubmit} className="space-y-4">
          <h3 className="text-xl font-bold mb-4 text-center">
            Set Initial Stock for Inventory Item (ID: {createdItemId})
          </h3>
          <div>
            <label className="block text-gray-700 mb-2">Quantity</label>
            <input 
              type="number"
              value={recordQuantity}
              onChange={handleRecordQuantityChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="text-center">
            <button 
              type="submit"
              className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
            >
              Create Inventory Record
            </button>
          </div>
        </form>
      )}
      {message && <p className="mt-4 text-center text-green-600">{message}</p>}
      {error && <p className="mt-4 text-center text-red-600">{error}</p>}
    </div>
  );
};

export default InventoryItemAndRecordForm;
