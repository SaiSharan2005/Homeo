import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaSearch, FaPlus } from 'react-icons/fa';
import AdminNavbar from '../../components/navbar/AdminNavbar';

const InventoryItemList = () => {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(
          process.env.REACT_APP_BACKEND_URL + '/inventory-items'
        );
        if (!response.ok) {
          throw new Error('Failed to fetch inventory items');
        }
        const data = await response.json();
        setItems(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, []);

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + `/inventory-items/${id}`,
        { method: 'DELETE' }
      );
      if (!response.ok) {
        throw new Error('Failed to delete inventory item');
      }
      setItems(prevItems => prevItems.filter(item => item.id !== id));
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <>
      <AdminNavbar />
      <div className="min-h-screen bg-gray-100 p-8">
        <h1 className="text-4xl font-extrabold text-center mb-8 text-gray-800">
          Inventory Items
        </h1>

        <div className="flex justify-between items-center mb-6">
          <div className="relative w-full max-w-md">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button
            onClick={() => navigate('/inventory-items/create')}
            className="px-5 py-2 flex items-center gap-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition"
          >
            <FaPlus /> Add Inventory
          </button>
        </div>

        {isLoading ? (
          <div className="text-center text-lg">Loading inventory items...</div>
        ) : error ? (
          <div className="text-center text-lg text-red-500">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead className="bg-blue-500">
                <tr>
                  <th className="py-3 px-4 text-left text-white font-semibold">ID</th>
                  <th className="py-3 px-4 text-left text-white font-semibold">Name</th>
                  <th className="py-3 px-4 text-left text-white font-semibold">Description</th>
                  <th className="py-3 px-4 text-left text-white font-semibold">Manufacturer</th>
                  <th className="py-3 px-4 text-left text-white font-semibold">Unit</th>
                  <th className="py-3 px-4 text-center text-white font-semibold">Reorder Level</th>
                  <th className="py-3 px-4 text-center text-white font-semibold">Expiry Date</th>
                  <th className="py-3 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map(item => (
                  <tr
                    key={item.id}
                    onClick={() => navigate(`/inventory-items/${item.id}`)}
                    className="cursor-pointer border-b hover:bg-gray-50"
                  >
                    <td className="py-4 px-4 text-gray-700">{item.id}</td>
                    <td className="py-4 px-4 text-gray-700">{item.name}</td>
                    <td className="py-4 px-4 text-gray-700">{item.description}</td>
                    <td className="py-4 px-4 text-gray-700">{item.manufacturer}</td>
                    <td className="py-4 px-4 text-gray-700">{item.unit}</td>
                    <td className="py-4 px-4 text-center text-gray-700">{item.reorderLevel}</td>
                    <td className="py-4 px-4 text-center text-gray-700">{item.expiryDate}</td>
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(item.id);
                        }}
                      >
                        <FaTrash className="text-red-500 hover:text-red-600 transition duration-150" />
                      </button>
                    </td>
                  </tr>
                ))}
                {currentItems.length === 0 && (
                  <tr>
                    <td colSpan="8" className="text-center py-6 text-gray-500">
                      No inventory items found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default InventoryItemList;
