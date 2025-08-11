import React, { useState, useEffect } from 'react';
import { getAdvertisements, deleteAdvertisement } from '../../services/advertisement';

export default function ShowAdvertisements() {
  const [ads, setAds] = useState([]);
  const [selectedAd, setSelectedAd] = useState(null);

  useEffect(() => {
    const fetchAds = async () => {
      const data = await getAdvertisements(0, 100);
      setAds(data.content || data || []);
    };
    fetchAds();
  }, []);

  const handleDeleteAd = async (id) => {
    await deleteAdvertisement(id);
    setAds(ads.filter(ad => ad.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Manage Advertisements</h1>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        {ads.map((ad) => (
          <div key={ad.id} className="border-b border-gray-200 pb-4 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">{ad.title}</h3>
                <p>{ad.description}</p>
                {ad.imageUrl && (
                  <img
                    src={ad.imageUrl}
                    alt={ad.title}
                    className="w-32 h-32 mt-2 rounded-lg"
                  />
                )}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedAd(ad)}
                  className="bg-yellow-500 text-white rounded-lg p-2 hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteAd(ad.id)}
                  className="bg-red-500 text-white rounded-lg p-2 hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
