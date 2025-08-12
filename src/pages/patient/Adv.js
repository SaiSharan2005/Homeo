// src/components/Adv.jsx
import React, { useState, useEffect } from 'react';
import apiService from '../../utils/api';

export default function AdBanner({ targetPage, className = '' }) {
  const [ad, setAd] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await apiService.get(`/ads/active?targetPage=${encodeURIComponent(targetPage)}`);
        setAd(Object.keys(data || {}).length ? data : null);
      } catch (e) {
        console.error("Ad fetch failed:", e);
        setAd(null);
      }
    })();
  }, [targetPage]);

  // Merge passed classes with a default if none:
  const wrapperClasses = className || 'w-[15vw]';

  return ad ? (
    <div className={wrapperClasses}>
      <img src={ad.imageUrl} alt={ad.title} className="w-full h-auto" />
      <h2 className="text-center font-semibold mt-2">{ad.title}</h2>
      <p className="text-center text-sm">{ad.description}</p>
    </div>
  ) : null;
}
