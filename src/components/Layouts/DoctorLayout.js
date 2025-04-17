// DoctorLayout.js
import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
// import DoctorNavbar from './DoctorNavbar';
import { Search, Bell, User } from 'lucide-react';
import DoctorNavbar from '../navbar/DoctorNavbar';
import { Link, useLocation } from 'react-router-dom';

const DoctorLayout = () => {
  const [activeMenu, setActiveMenu] = useState('overview');
  

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar Navbar */}
      <DoctorNavbar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
      
      {/* Main Content Area */}
      <div className="flex-grow bg-gray-50 p-6 overflow-y-auto">
        {/* Top Header */}
        <header className="flex justify-between items-center mb-6">
          <div className="relative flex-grow max-w-md mr-4">
            {/* <input 
              type="text" 
              placeholder="Search here..."
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /> */}

<h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-1">
            Welcome back, 
          </h1>          </div>
          <div className="flex items-center space-x-4">
            <Bell className="text-gray-600 cursor-pointer" />
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <Link to = "/doctor/profile">
              <User className="text-gray-600" />
              </Link>

            </div>
          </div>
        </header>
        
        {/* Render Child Components */}
        <Outlet />
      </div>
    </div>
  );
};

export default DoctorLayout;
