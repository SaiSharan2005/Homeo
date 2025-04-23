import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
// Optionally import the AdminNavbar if needed
// import AdminNavbar from "../../../components/navbar/AdminNavbar";

export default function ShowAdvertisements() {
  const [ads, setAds] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await fetch(
          process.env.REACT_APP_BACKEND_URL + "/ads"
        );
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        setAds(data || []);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchAds();
  }, []);

  const handleDeleteAd = async (id) => {
    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + `/ads/${id}`,
        { method: "DELETE" }
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      setAds(ads.filter((ad) => ad.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = !currentStatus;
    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL +
          `/ads/${id}/status?isActive=${newStatus}`,
        { method: "GET" }
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      setAds(
        ads.map((ad) =>
          ad.id === id ? { ...ad, isActive: newStatus } : ad
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      {/* <AdminNavbar /> */}
      <div className="w-full p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-semibold text-center text-gray-900">
            Manage Advertisements
          </h1>
          <button
            onClick={() => navigate("create")}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Create Advertisement
          </button>
        </div>

        {error && (
          <p className="text-red-600 text-center mb-4">{error}</p>
        )}

        <div className="bg-white shadow-md rounded-lg border border-gray-200 overflow-x-auto">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Target Page
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  End Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {ads.map((ad) => (
                <tr key={ad.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {ad.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {ad.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {ad.imageUrl ? (
                      ad.imageUrl.endsWith(".pdf") ? (
                        <a
                          href={ad.imageUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          View PDF
                        </a>
                      ) : (
                        <img
                          src={ad.imageUrl}
                          alt={ad.title}
                          className="w-24 h-24 object-cover rounded-md"
                        />
                      )
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {ad.targetPage}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {ad.endDate
                      ? new Date(ad.endDate).toLocaleDateString()
                      : "No End Date"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {ad.isActive ? (
                      <span
                        onClick={() =>
                          handleToggleStatus(ad.id, ad.isActive)
                        }
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 cursor-pointer"
                      >
                        Active
                      </span>
                    ) : (
                      <span
                        onClick={() =>
                          handleToggleStatus(ad.id, ad.isActive)
                        }
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 cursor-pointer"
                      >
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link to={`update/${ad.id}`}>
                      <button className="text-yellow-600 hover:text-yellow-800 focus:outline-none focus:ring-2 focus:ring-yellow-500">
                        Edit
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDeleteAd(ad.id)}
                      className="ml-4 text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
