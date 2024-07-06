import React from 'react';

const Banner = ({ imageUrl, forwardLink }) => (
  <a href={forwardLink} target="_blank" rel="noopener noreferrer" className="w-1/4 p-4">
    <img src={imageUrl} alt="Banner" className="w-full h-auto rounded-xl shadow-md" />
  </a>
);

export default Banner;
