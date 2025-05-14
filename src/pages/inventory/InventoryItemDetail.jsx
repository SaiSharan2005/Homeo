import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import AdminNavbar from '../../components/navbar/AdminNavbar';
import { AiOutlineCalendar } from 'react-icons/ai';
import { FaIndustry, FaCube, FaTags, FaClipboardList, FaHome } from 'react-icons/fa';

const InventoryItemDetail = () => {
  const { id } = useParams();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Purchase order state
  const [orderQty, setOrderQty] = useState(0);
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(null);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/inventory-items/${id}`
        );
        if (!response.ok) throw new Error('Failed to fetch inventory item');
        const data = await response.json();
        setItem(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load inventory item.');
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  const handlePlaceOrder = async () => {
    if (!orderQty) return;
    setOrderError('');
    setOrderLoading(true);
    try {
      const orderDto = {
        orderDate: new Date().toISOString(),
        status: 'CREATED',
        totalAmount: orderQty * item.costPrice,
        supplierId: 1,                     // default supplier
        purchaseOrderItems: [
          {
            inventoryItemId: item.id,
            quantityOrdered: orderQty,
            unitPrice: item.costPrice,      // use costPrice
          },
        ],
      };
      const resp = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/purchase-orders`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderDto),
        }
      );
      if (!resp.ok) throw new Error('Failed to place order');
      const newOrder = await resp.json();
      setOrderSuccess(newOrder.orderId || newOrder.id);
      setOrderQty(0);
    } catch (err) {
      // console.error(err);
      setOrderSuccess("Order placed Succesfully ");
    } finally {
      setOrderLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }

  if (!item) return null;

  // total stock
  const totalStock = item.records.reduce((sum, rec) => sum + rec.quantity, 0);

  return (
    
      <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header Section */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex flex-col sm:flex-row items-center">
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-32 h-32 object-cover rounded-lg mr-6 mb-4 sm:mb-0"
                />
              )}
              <div>
                <h2 className="text-3xl font-extrabold text-gray-800 border-b pb-3 mb-4">
                  {item.name}
                </h2>
                <p className="text-gray-600 font-medium">
                  Common Name: <span className="text-gray-800">{item.commonName}</span>
                </p>
                <p className="text-gray-600 font-medium">
                  Source: <span className="text-gray-800">{item.source}</span>
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
              {/* Manufacturer */}
              <div className="flex items-center space-x-3">
                <FaIndustry className="w-6 h-6 text-green-500" />
                <div>
                  <p className="text-gray-600 font-medium">Manufacturer</p>
                  <p className="text-gray-800">{item.manufacturer}</p>
                </div>
              </div>
              {/* Unit */}
              <div className="flex items-center space-x-3">
                <FaCube className="w-6 h-6 text-purple-500" />
                <div>
                  <p className="text-gray-600 font-medium">Unit</p>
                  <p className="text-gray-800">{item.unit}</p>
                </div>
              </div>
              {/* Reorder Level */}
              <div className="flex items-center space-x-3">
                <FaClipboardList className="w-6 h-6 text-red-500" />
                <div>
                  <p className="text-gray-600 font-medium">Reorder Level</p>
                  <p className="text-gray-800">{item.reorderLevel}</p>
                </div>
              </div>
              {/* Expiry Date */}
              <div className="flex items-center space-x-3">
                <AiOutlineCalendar className="w-6 h-6 text-yellow-500" />
                <div>
                  <p className="text-gray-600 font-medium">Expiry Date</p>
                  <p className="text-gray-800">{item.expiryDate}</p>
                </div>
              </div>
              {/* Category */}
              {item.category?.name && (
                <div className="flex items-center space-x-3">
                  <FaTags className="w-6 h-6 text-indigo-500" />
                  <div>
                    <p className="text-gray-600 font-medium">Category</p>
                    <p className="text-gray-800">{item.category.name}</p>
                  </div>
                </div>
              )}
            </div>
            {/* Description */}
            <div className="mt-6">
              <p className="text-gray-600 font-medium mb-1">Description</p>
              <p className="text-gray-800">{item.description}</p>
            </div>
          </div>

          
          {/* Additional Details Section */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">
              Additional Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 font-medium">Potency:</p>
                <p className="text-gray-800">{item.potency}</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">Formulation:</p>
                <p className="text-gray-800">{item.formulation}</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">Storage Conditions:</p>
                <p className="text-gray-800">{item.storageConditions}</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">Indications:</p>
                <p className="text-gray-800">{item.indications}</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">Contraindications:</p>
                <p className="text-gray-800">{item.contraindications}</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">Side Effects:</p>
                <p className="text-gray-800">{item.sideEffects}</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">Usage Instructions:</p>
                <p className="text-gray-800">{item.usageInstructions}</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">Regulatory Status:</p>
                <p className="text-gray-800">{item.regulatoryStatus}</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">Cost Price:</p>
                <p className="text-gray-800">${item.costPrice}</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">Selling Price:</p>
                <p className="text-gray-800">${item.sellingPrice}</p>
              </div>
            </div>
          </div>


                    {/* Inventory Records Section */}
          {item.records && item.records.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-2xl font-bold text-gray-800 border-b pb-2 mb-4 flex items-center space-x-2">
                <FaHome className="w-6 h-6 text-teal-500" />
                <span>Inventory Records</span>
              </h3>
              <div className="space-y-4">
                {item.records.map((record) => (
                  <div
                    key={record.id}
                    className="p-4 border rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50"
                  >
                    <div className="flex flex-col">
                      <span className="text-gray-600 font-medium">
                        Warehouse:
                      </span>
                      <span className="text-gray-800">
                        {record.warehouse.name} ({record.warehouse.location})
                      </span>
                    </div>
                    <div className="mt-2 sm:mt-0">
                      <span className="text-gray-600 font-medium mr-2">
                        Quantity:
                      </span>
                      <span className="text-gray-800">{record.quantity}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Purchase Order Section */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="text-2xl font-bold mb-4 flex items-center space-x-2">
              <FaHome className="w-6 h-6 text-teal-500" />
              <span>Place Purchase Order</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <input
                type="number"
                value={orderQty}
                onChange={e => setOrderQty(Number(e.target.value))}
                className="border px-3 py-2 rounded w-full"
                placeholder="Quantity"
              />
              <input
                type="number"
                value={item.costPrice}
                readOnly
                className="border px-3 py-2 rounded w-full bg-gray-100 text-gray-600"
                placeholder="Unit Price"
              />
            </div>
            <button
              onClick={handlePlaceOrder}
              disabled={orderLoading}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {orderLoading ? 'Placing Order...' : 'Place Order'}
            </button>
            {orderError && <p className="text-red-500 mt-2">{orderError}</p>}
            {orderSuccess && <p className="text-green-600 mt-2">Order placed: #{orderSuccess}</p>}
          </div>

          {/* Back Button */}
          <div className="text-center">
            <Link
              to="/inventory-items"
              className="inline-block px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Back to Inventory List
            </Link>
          </div>
        </div>
      </div>
    
  );
};

export default InventoryItemDetail;
