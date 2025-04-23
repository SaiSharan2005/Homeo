import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { fetchInventoryItems } from "../../services/doctor/appointment";

const InventoryItemsPage = () => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const userRole = localStorage.getItem("ROLE");

  useEffect(() => {
    const loadInventoryItems = async () => {
      try {
        const data = await fetchInventoryItems();
        setInventoryItems(data);
      } catch (error) {
        console.error("Error fetching inventory items:", error);
      }
    };
    loadInventoryItems();
  }, []);

  const filteredItems = inventoryItems.filter((item) =>
    (item.name || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderMedicineImage = (item) => {
    if (item.imageUrl) {
      return (
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-8 h-8 object-cover rounded-full mr-2"
        />
      );
    }
    return (
      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold text-gray-700 mr-2">
        {(item.name ? item.name.charAt(0) : "?").toUpperCase()}
      </div>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const monthAbbr = date
      .toLocaleString("default", { month: "short" })
      .toLowerCase();
    const year = date.getFullYear();
    return `${day} ${monthAbbr} ${year}`;
  };

  const handleRowClick = (id) => {
    navigate(`${id}`);
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (
      !window.confirm("Are you sure you want to delete this inventory item?")
    ) {
      return;
    }

    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/inventory-items/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) throw new Error("Delete failed");
      // Remove locally
      setInventoryItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Error deleting inventory item:", err);
      alert("Failed to delete item. Please try again.");
    }
  };

  return (
    <div className="bg-white rounded-md shadow p-4 w-full">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-800">Inventory Items</h2>
        <p className="text-sm text-gray-500">
          Here are all your inventory items with detailed medicine information.
        </p>
      </div>

      {/* Search & Create */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 
                   1010.5 17.5a7.5 7.5 0 006.15-3.85z"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search by medicine name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 p-2 rounded-md border border-gray-300 
                       focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        {userRole === "ADMIN" && (
          <button
            onClick={() => navigate("/admin/inventory/create")}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          >
            Create Inventory
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto text-left border-collapse">
          <thead>
            <tr className="text-gray-600 border-b">
              <th className="py-3 px-4 text-sm font-medium">ID</th>
              <th className="py-3 px-4 text-sm font-medium">Image</th>
              <th className="py-3 px-4 text-sm font-medium">Name</th>
              <th className="py-3 px-4 text-sm font-medium">Common Name</th>
              <th className="py-3 px-4 text-sm font-medium">Source</th>
              <th className="py-3 px-4 text-sm font-medium">Potency</th>
              <th className="py-3 px-4 text-sm font-medium">Formulation</th>
              <th className="py-3 px-4 text-sm font-medium">Expiry Date</th>
              <th className="py-3 px-4 text-sm font-medium">Selling Price</th>
              {userRole === "ADMIN" && (
                <th className="py-3 px-4 text-sm font-medium">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm">
            {filteredItems.length === 0 ? (
              <tr>
                <td
                  colSpan={userRole === "ADMIN" ? 10 : 9}
                  className="py-4 px-4 text-center"
                >
                  No inventory items found.
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => (
                <tr
                  key={item.id}
                  className="border-b hover:bg-gray-50 transition cursor-pointer"
                  onClick={() => handleRowClick(item.id)}
                >
                  <td className="py-3 px-4">{item.id}</td>
                  <td className="py-3 px-4 flex items-center">
                    {renderMedicineImage(item)}
                  </td>
                  <td className="py-3 px-4">{item.name}</td>
                  <td className="py-3 px-4">{item.commonName}</td>
                  <td className="py-3 px-4">{item.source}</td>
                  <td className="py-3 px-4">{item.potency}</td>
                  <td className="py-3 px-4">{item.formulation}</td>
                  <td className="py-3 px-4">{formatDate(item.expiryDate)}</td>
                  <td className="py-3 px-4">{item.sellingPrice}</td>
                  {userRole === "ADMIN" && (
                    <td className="py-3 px-4">
                      <button
                        onClick={(e) => handleDelete(e, item.id)}
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
    </div>
  );
};

export default InventoryItemsPage;
