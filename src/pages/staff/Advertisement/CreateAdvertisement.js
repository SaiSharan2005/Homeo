import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { createAdvertisement, getAdvertisements } from "../../../services/advertisement";
import { Image as ImageIcon, Calendar, FileUp, Loader2, Tag, Layout, Trash2 } from "lucide-react";

export default function CreateAdvertisement() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetPage, setTargetPage] = useState("");
  const [file, setFile] = useState(null);
  const [endDate, setEndDate] = useState("");
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleAddAd = async () => {
    try {
      // Form validation
      if (!title.trim()) {
        toast.error("Please enter an advertisement title.");
        return;
      }

      if (!description.trim()) {
        toast.error("Please enter an advertisement description.");
        return;
      }

      if (!targetPage) {
        toast.error("Please select a target page.");
        return;
      }

      if (!file) {
        toast.error("Please select an image file.");
        return;
      }

      if (!endDate) {
        toast.error("Please select an end date.");
        return;
      }

      // Check if end date is in the future
      const selectedDate = new Date(endDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate <= today) {
        toast.error("End date must be in the future.");
        return;
      }

      setLoading(true);

      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("targetPage", targetPage);
      formData.append("image", file);
      formData.append("endDate", endDate);

      // Use unified API client
      await createAdvertisement(formData);
      
      toast.success("Advertisement created successfully!");

      // Fetch updated ads after submission
      await fetchAds();

      // Clear form after submission
      setTitle("");
      setDescription("");
      setTargetPage("");
      setFile(null);
      setEndDate("");
      
      // Reset file input
      const fileInput = document.getElementById("file");
      if (fileInput) {
        fileInput.value = "";
      }

    } catch (error) {
      console.error("Error while adding advertisement:", error);
      toast.error(error.message || "Error while creating advertisement. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAds = async () => {
    try {
      const res = await getAdvertisements(0, 50);
      setAds(res.content || res || []);
    } catch (error) {
      toast.error("Failed to fetch advertisements");
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  // No live preview

  const handlePickFile = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files && e.target.files[0];
    if (!selectedFile) return;
    if (!selectedFile.type.startsWith("image/")) {
      toast.error("Please upload a valid image file.");
      e.target.value = null;
      setFile(null);
      return;
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error("Image file size must be less than 5MB.");
      e.target.value = null;
      setFile(null);
      return;
    }
    setFile(selectedFile);
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Create Advertisement</h1>
            <p className="text-gray-600 mt-1">Design and schedule a promotional banner for key pages.</p>
          </div>

          <div className="bg-white/80 backdrop-blur rounded-2xl shadow-sm border border-gray-200">
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: Text and Options */}
                <div className="lg:col-span-8 space-y-5">
                  {/* Title */}
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        id="title"
                        type="text"
                        placeholder="e.g., 20% Off Consultation"
                        className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="description"
                      placeholder="Short compelling message for the banner..."
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                    <div className="mt-1 text-xs text-gray-500">Keep it concise. Aim for 10–20 words.</div>
                  </div>

                  {/* Target Page and End Date */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="targetPage" className="block text-sm font-medium text-gray-700 mb-1">
                        Target Page <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Layout className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <select
                          id="targetPage"
                          className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={targetPage}
                          onChange={(e) => setTargetPage(e.target.value)}
                          required
                        >
                          <option value="">Select a target page</option>
                          <option value="doctor-search-bottom">Doctor Search - Bottom</option>
                          <option value="doctor-search-right">Doctor Search - Right</option>
                          <option value="history-left">History - Left</option>
                          <option value="history-right">History - Right</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                        End Date <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          id="endDate"
                          type="date"
                          className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Image Upload */}
                <div className="lg:col-span-4">
                  <div className="space-y-4">
                    <h2 className="text-sm font-semibold text-gray-900">Advertisement Image</h2>
                    <div
                      onClick={handlePickFile}
                      className="flex cursor-pointer items-center justify-center gap-3 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors px-4 py-10"
                    >
                      <div className="flex items-center gap-3 text-gray-600">
                        <FileUp className="w-5 h-5" />
                        <div className="text-sm">
                          <div className="font-medium">Click to upload</div>
                          <div className="text-gray-500">JPG, PNG, GIF up to 5MB</div>
                        </div>
                      </div>
                    </div>
                    <input
                      id="file"
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                      required
                    />
                    {file && (
                      <div className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
                        <div className="flex items-center gap-3">
                          <ImageIcon className="w-4 h-4 text-gray-500" />
                          <div>
                            <div className="text-sm font-medium text-gray-800 truncate max-w-[200px]">{file.name}</div>
                            <div className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</div>
                          </div>
                        </div>
                        <button type="button" onClick={handleRemoveFile} className="text-red-600 hover:text-red-700 inline-flex items-center gap-1 text-sm">
                          <Trash2 className="w-4 h-4" /> Remove
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end pt-4 border-t border-gray-200">
                <button
                  onClick={handleAddAd}
                  disabled={loading}
                  className={`inline-flex items-center justify-center gap-2 py-3 px-6 text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 transition ${
                    loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {loading ? 'Creating Advertisement...' : 'Create Advertisement'}
                </button>
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className="mt-10">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Existing Advertisements</h2>
            {ads.length === 0 ? (
              <div className="text-center py-10 text-gray-500 bg-white rounded-2xl border border-gray-200">No advertisements found. Create your first advertisement above.</div>
            ) : (
              <div className="overflow-x-auto bg-white rounded-2xl border border-gray-200">
                <table className="min-w-full">
                  <thead>
                    <tr className="text-left border-b bg-gray-50">
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
                      <tr key={ad.id} className="border-b last:border-0 hover:bg-gray-50">
                        <td className="py-3 px-4 align-top">{ad.title}</td>
                        <td className="py-3 px-4 max-w-xs align-top">
                          <div className="text-gray-700 line-clamp-2">{ad.description}</div>
                        </td>
                        <td className="py-3 px-4 align-top">{ad.targetPage}</td>
                        <td className="py-3 px-4 align-top">
                          {ad.imageUrl ? (
                            <img
                              src={ad.imageUrl}
                              alt={ad.title}
                              className="w-24 h-16 object-cover rounded"
                              onError={(e) => {
                                e.target.src = '/placeholder-image.png';
                                e.target.alt = 'Image not available';
                              }}
                            />
                          ) : (
                            <span className="text-gray-400">No image</span>
                          )}
                        </td>
                        <td className="py-3 px-4 align-top">{ad.endDate ? new Date(ad.endDate).toLocaleDateString() : "N/A"}</td>
                        <td className="py-3 px-4 text-center align-top">
                          {ad.isActive ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">Active</span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">Inactive</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
