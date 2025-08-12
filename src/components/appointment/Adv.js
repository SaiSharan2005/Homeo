import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import apiService from '../../utils/api';

export default function AdBanner({ targetPage }) {
  const [ad, setAd] = useState(null);

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const data = await apiService.get(`/ads/active?targetPage=${encodeURIComponent(targetPage)}`);
        
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

AdBanner.propTypes = {
  targetPage: PropTypes.string.isRequired,
};
