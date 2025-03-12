import React, { useState, useEffect } from 'react';

export default function AdBanner({ targetPage }) {
  const [ad, setAd] = useState(null);

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const response = await fetch(process.env.REACT_APP_BACKEND_URL+`/ads/active?targetPage=${targetPage}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data && Object.keys(data).length !== 0) {
          setAd(data);
        } else {
          setAd(null); // No active ad found
        }
      } catch (error) {
        console.error("Failed to fetch ad:", error.message);
        setAd(null); // Handle errors by not showing an ad
      }
    };
    
    fetchAd();
  }, [targetPage]);

  return (
    <div className="w-[15vw]">
      {ad ? (
        <div className="ad-banner bg-blue-500">
          <img src={ad.imageUrl} alt={ad.title} className="w-full h-auto" />
          <h2 className="text-white text-center">{ad.title}</h2>
          <p className="text-white text-center">{ad.description}</p>
        </div>
      ) : (
        <div className="ad-placeholder"></div>
      )}
    </div>
  );
}
