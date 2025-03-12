import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import AdminNavbar from '../../components/navbar/AdminNavbar';

const InventoryItemDetail = () => {
  const { id } = useParams();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/inventory-items/${id}`,
          {
            headers: {
              'Content-Type': 'application/json'
              // Optionally include token if needed
            }
          }
        );
        if (!response.ok) {
          throw new Error('Failed to fetch inventory item');
        }
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

  return (
    <>
      <AdminNavbar />
      <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 p-8">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden transform hover:scale-105 transition duration-500">
          <div className="px-8 py-6">
            <h2 className="text-3xl font-extrabold text-gray-800 mb-6 border-b pb-2">
              Inventory Item Details
            </h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <span className="w-40 font-semibold text-gray-600">Name:</span>
                <span className="text-gray-800">{item.name}</span>
              </div>
              <div className="flex items-center">
                <span className="w-40 font-semibold text-gray-600">Description:</span>
                <span className="text-gray-800">{item.description}</span>
              </div>
              <div className="flex items-center">
                <span className="w-40 font-semibold text-gray-600">Manufacturer:</span>
                <span className="text-gray-800">{item.manufacturer}</span>
              </div>
              <div className="flex items-center">
                <span className="w-40 font-semibold text-gray-600">Unit:</span>
                <span className="text-gray-800">{item.unit}</span>
              </div>
              <div className="flex items-center">
                <span className="w-40 font-semibold text-gray-600">Reorder Level:</span>
                <span className="text-gray-800">{item.reorderLevel}</span>
              </div>
              <div className="flex items-center">
                <span className="w-40 font-semibold text-gray-600">Expiry Date:</span>
                <span className="text-gray-800">{item.expiryDate}</span>
              </div>
              {item.category && item.category.name && (
                <div className="flex items-center">
                  <span className="w-40 font-semibold text-gray-600">Category:</span>
                  <span className="text-gray-800">{item.category.name}</span>
                </div>
              )}
            </div>
            <div className="mt-6 text-center">
              <Link
                to="/inventory-items"
                className="inline-block px-6 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition"
              >
                Back to Inventory List
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InventoryItemDetail;
