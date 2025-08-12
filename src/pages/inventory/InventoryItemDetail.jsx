import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AiOutlineCalendar } from 'react-icons/ai';
import { FaIndustry, FaCube, FaTags, FaClipboardList, FaHome, FaArrowLeft } from 'react-icons/fa';
import { getInventoryItemById } from '../../services/inventory/inventoryItem';

const InventoryItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // No purchase order state on detail page

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const data = await getInventoryItemById(id);
        // Support both plain object and { data: ... } API shapes
        const itemData = (data && data.data) ? data.data : data;
        setItem(itemData);
      } catch (err) {
        console.error(err);
        setError('Failed to load inventory item.');
        toast.error('Failed to load inventory item details');
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  // Removed place order handler

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
  const totalStock = (item.records || []).reduce((sum, rec) => sum + (rec?.quantity || 0), 0);

  return (
    
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white p-6 md:p-8">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Top bar */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-900"
            >
              <FaArrowLeft className="w-4 h-4" /> Back
            </button>
          </div>

          {/* Header Section */}
          <div className="bg-white/70 backdrop-blur rounded-2xl shadow-md p-6 border border-gray-100">
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-28 h-28 object-cover rounded-xl mr-6 mb-4 sm:mb-0 shadow"
                />
              )}
              <div className="flex-1">
                <div className="flex items-start gap-3 flex-wrap">
                  <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">{item.name}</h2>
                  {item.category?.name && (
                    <span className="px-2 py-1 text-xs rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1">
                      <FaTags className="w-3 h-3" /> {item.category.name}
                    </span>
                  )}
                </div>
                {(item.commonName || item.source) && (
                  <div className="mt-2 text-gray-600 flex gap-4 flex-wrap">
                    {item.commonName && (
                      <span>
                        Common: <span className="text-gray-800">{item.commonName}</span>
                      </span>
                    )}
                    {item.source && (
                      <span>
                        Source: <span className="text-gray-800">{item.source}</span>
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
            {/* Chips */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100">
                <p className="text-xs text-emerald-700">Total Stock</p>
                <p className="text-lg font-semibold text-emerald-900">{totalStock}</p>
              </div>
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-100 flex items-center gap-2">
                <AiOutlineCalendar className="w-5 h-5 text-amber-600" />
                <div>
                  <p className="text-xs text-amber-700">Expiry</p>
                  <p className="text-sm font-medium text-amber-900">{item.expiryDate || '—'}</p>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-violet-50 border border-violet-100 flex items-center gap-2">
                <FaCube className="w-5 h-5 text-violet-600" />
                <div>
                  <p className="text-xs text-violet-700">Unit</p>
                  <p className="text-sm font-medium text-violet-900">{item.unit || '—'}</p>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-100 flex items-center gap-2">
                <FaClipboardList className="w-5 h-5 text-rose-600" />
                <div>
                  <p className="text-xs text-rose-700">Reorder Level</p>
                  <p className="text-sm font-medium text-rose-900">{item.reorderLevel ?? '—'}</p>
                </div>
              </div>
            </div>
          </div>

          
          {/* Additional Details Section */}
          <div className="bg-white/70 backdrop-blur rounded-2xl shadow-md p-6 border border-gray-100">
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
            <div className="bg-white/70 backdrop-blur rounded-2xl shadow-md p-6 border border-gray-100">
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
                        {record?.warehouse?.name || 'Unknown'}{record?.warehouse?.location ? ` (${record.warehouse.location})` : ''}
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
          {/* Description & Manufacturer */}
          {(item.description || item.manufacturer) && (
            <div className="bg-white/70 backdrop-blur rounded-2xl shadow-md p-6 border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">About</h3>
              {item.manufacturer && (
                <div className="mb-3 flex items-center gap-2 text-gray-700">
                  <FaIndustry className="w-5 h-5 text-emerald-600" />
                  <span><span className="text-gray-600">Manufacturer:</span> {item.manufacturer}</span>
                </div>
              )}
              {item.description && (
                <p className="text-gray-800 leading-relaxed">{item.description}</p>
              )}
            </div>
          )}

          {/* Back Button */}
          <div className="flex items-center justify-center">
            <Link to="/admin/inventory/items" className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition">
              Back to Inventory
            </Link>
          </div>
        </div>
      </div>
    
  );
};

export default InventoryItemDetail;

