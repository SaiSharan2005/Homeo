import React, { useState } from 'react';
import {Link} from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeButton, setActiveButton] = useState(1);

  const handleButtonClick = (buttonId) => {
    setActiveButton(buttonId);
  };

  return (
    <nav className="bg-[#AADCD2] p-4 flex justify-between items-center lg:px-20">
        <div className="text-black font-bold lg:text-2xl">LOGO</div>
      <div className="flex items-center space-x-10">
      <div className="hidden md:flex space-x-10">
      <button className="text-black py-1 px-3 font-semibold rounded-md bg-teal-400 border-none cursor-pointer transition-all duration-300 active:shadow-inner active:shadow-teal-700" isActive={activeButton === 1} onClick={()=>handleButtonClick(1)}>Click</button>
          <Link to="/patients/home/DoctorSearch" className="text-black font-semibold">Doctors</Link>
          <a href="#appointments" className="text-black font-semibold">Appointments</a>
          <a href="#records" className="text-black font-semibold">Medical Records</a>
          <a href="#prescriptions" className="text-black font-semibold">Prescriptions</a>
        </div>
        <button className="relative">
            {/* notification bell */}
        <svg class="w-8 h-8 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 14 20">
            <path d="M12.133 10.632v-1.8A5.406 5.406 0 0 0 7.979 3.57.946.946 0 0 0 8 3.464V1.1a1 1 0 0 0-2 0v2.364a.946.946 0 0 0 .021.106 5.406 5.406 0 0 0-4.154 5.262v1.8C1.867 13.018 0 13.614 0 14.807 0 15.4 0 16 .538 16h12.924C14 16 14 15.4 14 14.807c0-1.193-1.867-1.789-1.867-4.175ZM3.823 17a3.453 3.453 0 0 0 6.354 0H3.823Z"/>
        </svg>
        </button>
        <div className="relative">
          <button onClick={() => setIsOpen(!isOpen)}>
            {/* profile symbol */}
            <svg class="w-8 h-8 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"/>
            </svg>
          </button>
          {isOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2">
              <a href="#profile" className="block px-4 py-2 text-black">Profile</a>
              <a href="#help" className="block px-4 py-2 text-black">Help Center</a>
              <a href="#support" className="block px-4 py-2 text-black">Customer Support</a>
            </div>
          )}
        </div>
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          <span className="material-icons">menu</span>
        </button>
      </div>
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-teal-200 p-4 flex flex-col space-y-4">
          <a href="#appointments" className="text-black">Appointments</a>
          <a href="#records" className="text-black">Medical Records</a>
          <a href="#prescriptions" className="text-black">Prescriptions</a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
