import React, { useState, useEffect } from "react";
import AdminNavbar from "../../../components/navbar/AdminNavbar";

export default function CreateAdvertisement() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetPage, setTargetPage] = useState("");
  const [file, setFile] = useState(null);
  const [endDate, setEndDate] = useState("");
  const [ads, setAds] = useState([]);

  const handleAddAd = async () => {
    try {
      const formData = new FormData();

      // Check if file is selected
      if (!file) {
        alert("Please select an image file.");
        return;
      }

      // Check if end date is provided
      if (!endDate) {
        alert("Please select an end date.");
        return;
      }

      // Append form fields to formData
      formData.append("title", title);
      formData.append("description", description);
      formData.append("targetPage", targetPage);
      formData.append("image", file);
      formData.append("endDate", endDate); // Add end date

      // Send the POST request to the backend
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/ads`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to add advertisement");
      }

      // Fetch updated ads after submission
      fetchAds();

      // Clear form after submission
      setTitle("");
      setDescription("");
      setTargetPage("");
      setFile(null);
      setEndDate("");
    } catch (error) {
      console.error("Error while adding advertisement:", error);
      alert("Error while adding advertisement.");
    }
  };

  const fetchAds = async () => {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/ads`);
    const data = await response.json();
    setAds(data);
  };

  useEffect(() => {
    fetchAds();
  }, []);

  return (
    <>
      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-lg border border-gray-200">
          <h1 className="text-3xl font-semibold mb-8 text-gray-800 text-center">
            Create Advertisement
          </h1>

          {/* Form Section */}
          <div className="space-y-6 mb-8">
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
            <div>
              <input
                id="file"
                type="file"
                accept="image/*"
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => {
                  const selectedFile = e.target.files[0];
                  if (selectedFile && !selectedFile.type.startsWith("image/")) {
                    alert("Please upload a valid image file.");
                    e.target.value = null; // Clear the invalid file input
                    return;
                  }
                  setFile(selectedFile);
                }}
              />
            </div>

            <button
              onClick={handleAddAd}
              className="w-full py-3 px-6 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            >
              Add Advertisement
            </button>
          </div>

          {/* Table Section */}
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 text-center">
            Existing Advertisements
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
              <thead>
                <tr className="text-left border-b bg-gray-100">
                  <th className="py-3 px-4 text-gray-700">Title</th>
                  <th className="py-3 px-4 text-gray-700">Description</th>
                  <th className="py-3 px-4 text-gray-700">Target Page</th>
                  <th className="py-3 px-4 text-gray-700">Image</th>
                  <th className="py-3 px-4 text-gray-700">End Date</th>
                  <th className="py-3 px-4 text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {ads.map((ad) => (
                  <tr key={ad.id} className="border-b">
                    <td className="py-3 px-4">{ad.title}</td>
                    <td className="py-3 px-4">{ad.description}</td>
                    <td className="py-3 px-4">{ad.targetPage}</td>
                    <td className="py-3 px-4">
                      <img
                        src={ad.imageUrl}
                        alt={ad.title}
                        className="w-24 h-16 object-cover rounded"
                      />
                    </td>
                    <td className="py-3 px-4">
                      {ad.endDate ? new Date(ad.endDate).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {ad.isActive ? (
                        <span className="text-green-500">Active</span>
                      ) : (
                        <span className="text-red-500">Inactive</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
