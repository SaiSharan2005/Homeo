import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import {
  fetchSuppliers,
  createSupplier,
  deleteSupplier,
} from "../../../services/inventory/supplier";
import { toast } from 'react-toastify';

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", contactDetails: "", address: "" });
  const navigate = useNavigate();
  const userRole = localStorage.getItem("ROLE");

  useEffect(() => {
    const loadSuppliers = async () => {
      try {
        const data = await fetchSuppliers();
        setSuppliers(data);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
      }
    };
    loadSuppliers();
  }, []);

  const filtered = suppliers.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRowClick = (id) => navigate(`${id}`);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this supplier?")) return;
    try {
      await deleteSupplier(id);
      setSuppliers((prev) => prev.filter((s) => s.id !== id));
    } catch {
      toast.error("Failed to delete supplier. Please try again.");
    }
  };

  const openModal = () => setShowModal(true);
  const closeModal = () => {
    setShowModal(false);
    setFormData({ name: "", email: "", contactDetails: "", address: "" });
  };

  const handleCreate = async () => {
    const { name, email } = formData;
    if (!name.trim() || !email.trim()) {
      toast.error("Name and Email are required.");
      return;
    }
    try {
      const newSupplier = await createSupplier(formData);
      setSuppliers((prev) => [...prev, newSupplier]);
      closeModal();
    } catch {
      toast.error("Failed to create supplier. Please try again.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white rounded-md shadow p-4 w-full">
      {/* Header */}
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Suppliers</h2>
          <p className="text-sm text-gray-500">
            Manage your suppliers and their contact information here.
          </p>
        </div>
        {userRole === "ADMIN" && (
          <button
            onClick={openModal}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          >
            Create Supplier
          </button>
        )}
      </div>

      {/* Search */}
      <div className="mb-4 w-full sm:w-1/2 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
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
          placeholder="Search suppliers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto text-left border-collapse">
          <thead>
            <tr className="text-gray-600 border-b">
              <th className="py-3 px-4 text-sm font-medium">ID</th>
              <th className="py-3 px-4 text-sm font-medium">Name</th>
              <th className="py-3 px-4 text-sm font-medium">Email</th>
              <th className="py-3 px-4 text-sm font-medium">Contact Details</th>
              <th className="py-3 px-4 text-sm font-medium">Address</th>
              {userRole === "ADMIN" && (
                <th className="py-3 px-4 text-sm font-medium">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={userRole === "ADMIN" ? 6 : 5} className="py-4 px-4 text-center">
                  No suppliers found.
                </td>
              </tr>
            ) : (
              filtered.map((s) => (
                <tr
                  key={s.id}
                  className="border-b hover:bg-gray-50 transition cursor-pointer"
                  onClick={() => handleRowClick(s.id)}
                >
                  <td className="py-3 px-4">{s.id}</td>
                  <td className="py-3 px-4">{s.name}</td>
                  <td className="py-3 px-4">{s.email}</td>
                  <td className="py-3 px-4">{s.contactDetails}</td>
                  <td className="py-3 px-4">{s.address}</td>
                  {userRole === "ADMIN" && (
                    <td className="py-3 px-4">
                      <button
                        onClick={(e) => handleDelete(e, s.id)}
                        className="p-1 rounded-md hover:bg-red-100 transition"
                        title="Delete"
                      >
                        <MdDelete size={18} className="text-red-600 hover:text-red-800" />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-md shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Create Supplier</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Contact Details</label>
              <textarea
                name="contactDetails"
                rows={2}
                value={formData.contactDetails}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Address</label>
              <textarea
                name="address"
                rows={2}
                value={formData.address}
                onChange={handleChange}
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
