import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AdminNavbar from '../../../components/navbar/AdminNavbar';
import { createPurchaseOrder } from '../../../services/inventory/purchaseOrder';

const PurchaseOrderCreate = () => {
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState({
    orderDate: new Date().toISOString().slice(0, 16), // default to current date/time in "YYYY-MM-DDTHH:mm" format
    status: 'CREATED',
    totalAmount: '',
    supplierId: ''
    // Optionally, add purchaseOrderItems: [] here if needed
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrderData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createPurchaseOrder(orderData);
      toast.success('Purchase order created successfully!');
      navigate('/purchase-orders');
    } catch (err) {
      console.error(err);
      toast.error('Failed to create purchase order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AdminNavbar />
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Create Purchase Order</h2>
          {error && <div className="text-red-500 mb-4">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="orderDate" className="block font-semibold mb-1">Order Date</label>
              <input
                id="orderDate"
                type="datetime-local"
                name="orderDate"
                value={orderData.orderDate}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="status" className="block font-semibold mb-1">Status</label>
              <select
                id="status"
                name="status"
                value={orderData.status}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded"
              >
                <option value="CREATED">CREATED</option>
                <option value="ORDERED">ORDERED</option>
                <option value="RECEIVED">RECEIVED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="totalAmount" className="block font-semibold mb-1">Total Amount</label>
              <input
                id="totalAmount"
                type="number"
                name="totalAmount"
                value={orderData.totalAmount}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded"
                placeholder="Enter total amount"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="supplierId" className="block font-semibold mb-1">Supplier ID</label>
              <input
                id="supplierId"
                type="number"
                name="supplierId"
                value={orderData.supplierId}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded"
                placeholder="Enter supplier ID"
                required
              />
            </div>
            {/* Add additional fields (e.g., purchaseOrderItems) as needed */}
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600"
            >
              Create Order
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default PurchaseOrderCreate;
