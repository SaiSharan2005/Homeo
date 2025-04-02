import React, { useState, useEffect } from 'react';

const InventoryItemAndRecordForm = () => {
  const API_BASE_URL = process.env.REACT_APP_BACKEND_URL; // Backend URL from .env file
  const token = localStorage.getItem("Token");

  // State for InventoryItem fields (matching your InventoryItem model)
  const [itemFormData, setItemFormData] = useState({
    name: '',
    commonName: '',
    source: '',
    potency: '',
    formulation: '',
    description: '',
    manufacturer: '',
    unit: '',
    reorderLevel: 0,
    expiryDate: '',
    storageConditions: '',
    indications: '',
    contraindications: '',
    sideEffects: '',
    usageInstructions: '',
    regulatoryStatus: '',
    costPrice: 0,
    sellingPrice: 0,
    categoryId: ''
  });

  // State for the medicine image file
  const [imageFile, setImageFile] = useState(null);

  // State for InventoryRecord (stock)
  const [recordQuantity, setRecordQuantity] = useState(0);
  
  // For category dropdown
  const [categories, setCategories] = useState([]);
  
  // For messages & errors
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  // After successfully creating an InventoryItem, store its ID
  const [createdItemId, setCreatedItemId] = useState(null);

  // Fetch available categories on component mount
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

  // Handle change for inventory item fields
  const handleItemChange = (e) => {
    const { name, value } = e.target;
    setItemFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  // Submit InventoryItem form
  const handleItemSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!token) {
      setError("No authentication token found.");
      return;
    }

    // Create a FormData instance to send multipart/form-data
    const formData = new FormData();
    formData.append(
      'inventoryItem',
      new Blob([JSON.stringify(itemFormData)], { type: 'application/json' })
    );
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/inventory-items`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      if (!response.ok) throw new Error('Failed to create inventory item.');
      const data = await response.json();
      setMessage('Inventory item created successfully!');
      setCreatedItemId(data.id);
      setItemFormData({
        name: '',
        commonName: '',
        source: '',
        potency: '',
        formulation: '',
        description: '',
        manufacturer: '',
        unit: '',
        reorderLevel: 0,
        expiryDate: '',
        storageConditions: '',
        indications: '',
        contraindications: '',
        sideEffects: '',
        usageInstructions: '',
        regulatoryStatus: '',
        costPrice: 0,
        sellingPrice: 0,
        categoryId: ''
      });
      setImageFile(null);
    } catch (err) {
      console.error('Error creating inventory item:', err);
      setError('Failed to create inventory item.');
    }
  };

  // Handle change for record quantity
  const handleRecordQuantityChange = (e) => {
    setRecordQuantity(e.target.value);
  };

  // Submit InventoryRecord (stock) form
  const handleRecordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!token) {
      setError("No authentication token found.");
      return;
    }

    const payload = {
      quantity: parseInt(recordQuantity, 10),
      inventoryItemId: createdItemId,
      warehouseId: 1
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
      setCreatedItemId(null);
    } catch (err) {
      console.error('Error creating inventory record:', err);
      setError('Failed to create inventory record.');
    }
  };

  return (
    <div className="w-full p-6 bg-gray-100">
      <div className="max-w-screen-xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-center">Create Inventory Item &amp; Set Stock</h2>
        {!createdItemId ? (
          <form onSubmit={handleItemSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-gray-700 mb-2">Name</label>
              <input 
                type="text"
                name="name"
                value={itemFormData.name}
                onChange={handleItemChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {/* Common Name */}
            <div>
              <label className="block text-gray-700 mb-2">Common Name</label>
              <input 
                type="text"
                name="commonName"
                value={itemFormData.commonName}
                onChange={handleItemChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {/* Description */}
            <div>
              <label className="block text-gray-700 mb-2">Description</label>
              <textarea 
                name="description"
                value={itemFormData.description}
                onChange={handleItemChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {/* Manufacturer, Unit, Cost & Selling Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 mb-2">Manufacturer</label>
                <input 
                  type="text"
                  name="manufacturer"
                  value={itemFormData.manufacturer}
                  onChange={handleItemChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Unit</label>
                <input 
                  type="text"
                  name="unit"
                  value={itemFormData.unit}
                  onChange={handleItemChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Cost Price</label>
                <input 
                  type="number"
                  name="costPrice"
                  value={itemFormData.costPrice}
                  onChange={handleItemChange}
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Selling Price</label>
                <input 
                  type="number"
                  name="sellingPrice"
                  value={itemFormData.sellingPrice}
                  onChange={handleItemChange}
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            {/* Source, Potency & Formulation */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-gray-700 mb-2">Source</label>
                <input 
                  type="text"
                  name="source"
                  value={itemFormData.source}
                  onChange={handleItemChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Potency</label>
                <input 
                  type="text"
                  name="potency"
                  value={itemFormData.potency}
                  onChange={handleItemChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Formulation</label>
                <input 
                  type="text"
                  name="formulation"
                  value={itemFormData.formulation}
                  onChange={handleItemChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            {/* Reorder Level & Expiry Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 mb-2">Reorder Level</label>
                <input 
                  type="number"
                  name="reorderLevel"
                  value={itemFormData.reorderLevel}
                  onChange={handleItemChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Expiry Date</label>
                <input 
                  type="date"
                  name="expiryDate"
                  value={itemFormData.expiryDate}
                  onChange={handleItemChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            {/* Storage Conditions, Indications, Contraindications, Side Effects, Usage Instructions & Regulatory Status */}
            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 mb-2">Storage Conditions</label>
                <input 
                  type="text"
                  name="storageConditions"
                  value={itemFormData.storageConditions}
                  onChange={handleItemChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Indications</label>
                <textarea 
                  name="indications"
                  value={itemFormData.indications}
                  onChange={handleItemChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Contraindications</label>
                <textarea 
                  name="contraindications"
                  value={itemFormData.contraindications}
                  onChange={handleItemChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Side Effects</label>
                <textarea 
                  name="sideEffects"
                  value={itemFormData.sideEffects}
                  onChange={handleItemChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Usage Instructions</label>
                <textarea 
                  name="usageInstructions"
                  value={itemFormData.usageInstructions}
                  onChange={handleItemChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Regulatory Status</label>
                <input 
                  type="text"
                  name="regulatoryStatus"
                  value={itemFormData.regulatoryStatus}
                  onChange={handleItemChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            {/* Image File Input */}
            <div>
              <label className="block text-gray-700 mb-2">Medicine Image</label>
              <input 
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full"
              />
            </div>
            {/* Submit Button */}
            <div className="text-center">
              <button 
                type="submit"
                className="w-full md:w-auto px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                Create Inventory Item
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRecordSubmit} className="space-y-6">
            <h3 className="text-xl font-bold text-center">
              Set Initial Stock for Inventory Item (ID: {createdItemId})
            </h3>
            <div>
              <label className="block text-gray-700 mb-2">Quantity</label>
              <input 
                type="number"
                value={recordQuantity}
                onChange={handleRecordQuantityChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="text-center">
              <button 
                type="submit"
                className="w-full md:w-auto px-8 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              >
                Create Inventory Record
              </button>
            </div>
          </form>
        )}
        {message && <p className="mt-6 text-center text-green-600">{message}</p>}
        {error && <p className="mt-6 text-center text-red-600">{error}</p>}
      </div>
    </div>
  );
};

export default InventoryItemAndRecordForm;
