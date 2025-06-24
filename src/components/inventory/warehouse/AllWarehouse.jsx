import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import {
  fetchWarehouses,
  deleteWarehouse,
  createWarehouse,
} from "../../../services/inventory/warehouse";

export default function WarehousesPage() {
  const [warehouses, setWarehouses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const navigate = useNavigate();
  const userRole = localStorage.getItem("ROLE");

  useEffect(() => {
    loadWarehouses();
  }, []);

  const loadWarehouses = async () => {
    try {
      const data = await fetchWarehouses();
      setWarehouses(data);
    } catch (error) {
      console.error("Error fetching warehouses:", error);
    }
  };

  const filtered = warehouses.filter((w) =>
    (w.name || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRowClick = (id) => {
    navigate(`${id}`);
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this warehouse?")) return;
    try {
      await deleteWarehouse(id);
      setWarehouses((prev) => prev.filter((w) => w.id !== id));
    } catch (err) {
      console.error("Error deleting warehouse:", err);
      alert("Failed to delete warehouse. Please try again.");
    }
  };

  const openModal = () => {
    setNewName("");
    setNewLocation("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleCreate = async () => {
    if (!newName.trim() || !newLocation.trim()) {
      alert("Please fill out both name and location.");
      return;
    }
    try {
      await createWarehouse({ name: newName, location: newLocation });
      closeModal();
      loadWarehouses();
    } catch (err) {
      console.error("Error creating warehouse:", err);
      alert("Failed to create warehouse. Please try again.");
    }
  };

  return (
    <div className="bg-white rounded-md shadow p-4 w-full">
      {/* Header */}
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Warehouses</h2>
          <p className="text-sm text-gray-500">
            Manage all your warehouses and their locations here.
          </p>
        </div>
        {userRole === "ADMIN" && (
          <button
            onClick={openModal}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          >
            Create Warehouse
          </button>
        )}
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="relative w-full sm:w-1/2">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {/* magnifier icon */}
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 17.5a7.5 7.5 0 006.15-3.85z"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search warehouses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto text-left border-collapse">
          <thead>
            <tr className="text-gray-600 border-b">
              <th className="py-3 px-4 text-sm font-medium">ID</th>
              <th className="py-3 px-4 text-sm font-medium">Name</th>
              <th className="py-3 px-4 text-sm font-medium">Location</th>
              {userRole === "ADMIN" && (
                <th className="py-3 px-4 text-sm font-medium">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm">
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={userRole === "ADMIN" ? 4 : 3}
                  className="py-4 px-4 text-center"
                >
                  No warehouses found.
                </td>
              </tr>
            ) : (
              filtered.map((w) => (
                <tr
                  key={w.id}
                  className="border-b hover:bg-gray-50 transition cursor-pointer"
                  onClick={() => handleRowClick(w.id)}
                >
                  <td className="py-3 px-4">{w.id}</td>
                  <td className="py-3 px-4">{w.name}</td>
                  <td className="py-3 px-4">{w.location}</td>
                  {userRole === "ADMIN" && (
                    <td className="py-3 px-4">
                      <button
                        onClick={(e) => handleDelete(e, w.id)}
                        className="p-1 rounded-md hover:bg-red-100 transition"
                        title="Delete"
                      >
                        <MdDelete
                          className="text-red-600 hover:text-red-800"
                          size={18}
                        />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-md shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Create Warehouse</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Location</label>
              <input
                type="text"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
