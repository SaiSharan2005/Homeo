import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AdminNavbar from "../../../components/navbar/AdminNavbar";
import { getAdvertisements, deleteAdvertisement, changeAdvertisementStatus } from "../../../services/advertisement";

export default function ShowAdvertisements() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAds(page, size);
  }, [page, size]);

  const fetchAds = async (p = 0, s = 10) => {
    try {
      setLoading(true);
      const res = await getAdvertisements(p, s);
      setAds(res.content || res || []);
      setTotalPages(res.totalPages || 0);
      setTotalElements(res.totalElements || (Array.isArray(res) ? res.length : 0));
    } catch (error) {
      toast.error(error.message || "Failed to fetch advertisements");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAd = async (id) => {
    if (!window.confirm("Are you sure you want to delete this advertisement?")) {
      return;
    }

    try {
      await deleteAdvertisement(id);
      setAds(ads.filter((ad) => ad.id !== id));
      toast.success("Advertisement deleted successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to delete advertisement");
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = !currentStatus;
    try {
      await changeAdvertisementStatus(id, newStatus);
      setAds(ads.map((ad) => ad.id === id ? { ...ad, isActive: newStatus } : ad));
      toast.success(`Advertisement ${newStatus ? 'activated' : 'deactivated'} successfully!`);
    } catch (error) {
      toast.error(error.message || "Failed to update advertisement status");
    }
  };

  if (loading) {
    return (
      <>
        <div className="w-full p-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
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

        {ads.length === 0 ? (
          <div className="bg-white shadow-md rounded-lg border border-gray-200 p-8">
            <div className="text-center py-8 text-gray-500">
              <p className="text-lg mb-4">No advertisements found.</p>
              <button
                onClick={() => navigate("create")}
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
              >
                Create Your First Advertisement
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg border border-gray-200 overflow-x-auto">
            <table className="w-full divide-y divide-gray-200">
              <thead>
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
              <tbody>
                {ads.map((ad) => (
                  <tr key={ad.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {ad.title}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
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
                            onError={(e) => {
                              e.target.src = '/placeholder-image.png';
                              e.target.alt = 'Image not available';
                            }}
                          />
                        )
                      ) : (
                        <span className="text-gray-400">No image</span>
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      {ad.isActive ? (
                        <span
                          onClick={() =>
                            handleToggleStatus(ad.id, ad.isActive)
                          }
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 cursor-pointer hover:bg-green-200 transition"
                        >
                          Active
                        </span>
                      ) : (
                        <span
                          onClick={() =>
                            handleToggleStatus(ad.id, ad.isActive)
                          }
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 cursor-pointer hover:bg-red-200 transition"
                        >
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link to={`update/${ad.id}`}>
                        <button className="text-yellow-600 hover:text-yellow-800 focus:outline-none focus:ring-2 focus:ring-yellow-500 mr-3">
                          Edit
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDeleteAd(ad.id)}
                        className="text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between p-4 border-t">
                <div className="text-sm text-gray-700">
                  Showing {page * size + 1} to {Math.min((page + 1) * size, totalElements)} of {totalElements} results
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="px-3 py-1 border rounded disabled:opacity-50"
                    disabled={page === 0}
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                  >
                    Previous
                  </button>
                  <span className="text-sm">Page {page + 1} of {totalPages}</span>
                  <button
                    className="px-3 py-1 border rounded disabled:opacity-50"
                    disabled={page >= totalPages - 1}
                    onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
