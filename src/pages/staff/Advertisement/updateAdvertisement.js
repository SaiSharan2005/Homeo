import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getAdvertisementById, updateAdvertisement } from "../../../services/advertisement";
// Optionally import the AdminNavbar if needed
// import AdminNavbar from "../../../components/navbar/AdminNavbar";

export default function UpdateAdvertisement() {
  const { id } = useParams(); // The advertisement ID to update
  const navigate = useNavigate();

  // Form state variables
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetPage, setTargetPage] = useState("");
  const [endDate, setEndDate] = useState("");
  const [file, setFile] = useState(null);

  // Fetch the advertisement details when the component mounts (if id is provided)
  useEffect(() => {
    const fetchAdDetails = async () => {
      if (id) {
        try {
          const data = await getAdvertisementById(id);
          setTitle(data.title || "");
          setDescription(data.description || "");
          setTargetPage(data.targetPage || "");
          // Convert the endDate to a format acceptable by input[type="date"]
          setEndDate(data.endDate ? data.endDate.split("T")[0] : "");
        } catch (error) {
          console.error(error.message);
          toast.error("Failed to fetch advertisement details");
        }
      }
    };

    fetchAdDetails();
  }, [id]);

  // Handle form submission
  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("targetPage", targetPage);
    formData.append("endDate", endDate);
    if (file) {
      formData.append("image", file);
    }

    try {
      await updateAdvertisement(id, formData);
      toast.success("Advertisement updated successfully!");
      navigate("/admin/advertisement/");
    } catch (error) {
      console.error(error.message);
      toast.error("Error updating advertisement.");
    }
  };

  // Reset the form fields
  const handleReset = () => {
    setTitle("");
    setDescription("");
    setTargetPage("");
    setEndDate("");
    setFile(null);
    toast.info("Form reset.");
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Optionally include <AdminNavbar /> here */}
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-lg border border-gray-200">
        <h1 className="text-3xl font-semibold mb-8 text-gray-800 text-center">
          Update Advertisement
        </h1>
        <div className="space-y-6 mb-8">
          {/* Advertisement Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              Advertisement Title
            </label>
            <input
              id="title"
              type="text"
              placeholder="Enter ad title"
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Advertisement Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              Advertisement Description
            </label>
            <textarea
              id="description"
              placeholder="Enter ad description"
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Target Page Selection */}
          <div>
            <label
              htmlFor="targetPage"
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              Target Page URL
            </label>
            <select
              id="targetPage"
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={targetPage}
              onChange={(e) => setTargetPage(e.target.value)}
            >
              <option value="" disabled>
                Select a target page
              </option>
              <option value="doctorSearch-left">Doctor Search - Left</option>
              <option value="doctorSearch-right">Doctor Search - Right</option>
              <option value="history-left">History - Left</option>
              <option value="history-right">History - Right</option>
            </select>
          </div>

          {/* End Date */}
          <div>
            <label
              htmlFor="endDate"
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              End Date
            </label>
            <input
              id="endDate"
              type="date"
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          {/* Image Upload */}
          <div>
            <label
              htmlFor="file"
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              Update Advertisement Image (optional)
            </label>
            <input
              id="file"
              type="file"
              accept="image/*"
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="w-full py-3 px-6 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          >
            Update Advertisement
          </button>

          {/* Reset Form Button */}
          <button
            onClick={handleReset}
            className="w-full mt-3 py-3 px-6 bg-gray-200 text-gray-700 rounded-lg shadow-md hover:bg-gray-300 focus:outline-none transition duration-200"
          >
            Reset Form
          </button>
        </div>
      </div>
    </div>
  );
}
