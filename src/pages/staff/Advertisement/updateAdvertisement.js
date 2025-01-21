import React, { useState, useEffect } from 'react';
import AdminNavbar from "../../../components/AdminNavbar";
import { useParams, useNavigate } from 'react-router-dom';

export default function CreateAdvertisement() {
  const { id } = useParams(); // If `id` exists, it means we're updating
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetPage, setTargetPage] = useState('');
  const [file, setFile] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const fetchAdDetails = async () => {
      if (id) {
        setIsEditMode(true);
        try {
          const response = await fetch(process.env.REACT_APP_BACKEND_URL + `/ads/${id}`);
          if (!response.ok) throw new Error('Failed to fetch ad details');
          const data = await response.json();
          setTitle(data.title || '');
          setDescription(data.description || '');
          setTargetPage(data.targetPage || '');
        } catch (error) {
          console.error(error.message);
        }
      } else {
        setIsEditMode(false);
      }
    };

    fetchAdDetails();
  }, [id]);

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('targetPage', targetPage);
    if (file) formData.append('image', file);

    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + (isEditMode ? `/ads/${id}` : '/ads'),
        {
          method: isEditMode ? 'PUT' : 'POST',
          body: formData,
        }
      );
      if (!response.ok) throw new Error('Failed to submit the ad');
      navigate('/staff/all-adv');
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleFormReset = () => {
    setTitle('');
    setDescription('');
    setTargetPage('');
    setFile(null);
  };

  return (
    <>
      <AdminNavbar />
      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-lg border border-gray-200">
          <h1 className="text-3xl font-semibold mb-8 text-gray-800 text-center">
            {isEditMode ? 'Update Advertisement' : 'Create Advertisement'}
          </h1>
          <div className="space-y-6 mb-8">
            <div>
              <label htmlFor="title" className="block text-gray-700 text-sm font-medium mb-2">
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
              <label htmlFor="description" className="block text-gray-700 text-sm font-medium mb-2">
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
              <label htmlFor="targetPage" className="block text-gray-700 text-sm font-medium mb-2">
                Target Page URL
              </label>
              <input
                id="targetPage"
                type="text"
                placeholder="Enter target page URL"
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={targetPage}
                onChange={(e) => setTargetPage(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="file" className="block text-gray-700 text-sm font-medium mb-2">
                Upload Advertisement Image
              </label>
              <input
                id="file"
                type="file"
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </div>
            <button
              onClick={handleSubmit}
              className="w-full py-3 px-6 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            >
              {isEditMode ? 'Update Advertisement' : 'Create Advertisement'}
            </button>
            <button
              onClick={handleFormReset}
              className="w-full mt-3 py-3 px-6 bg-gray-200 text-gray-700 rounded-lg shadow-md hover:bg-gray-300 focus:outline-none transition duration-200"
            >
              Reset Form
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
