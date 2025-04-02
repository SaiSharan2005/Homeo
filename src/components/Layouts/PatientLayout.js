import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import PatientNavbar from '../navbar/PatientNavbar';
import { Bell, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const PatientLayout = () => {
  const [activeMenu, setActiveMenu] = useState('overview');

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar Navbar */}
      <PatientNavbar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
      
      {/* Main Content Area */}
      <div className="flex-grow bg-gray-50 p-6 overflow-y-auto">
        {/* Top Header */}
        <header className="flex justify-between items-center mb-6">
          <div className="relative flex-grow max-w-md mr-4">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-1">
              Welcome back, Patient
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <Bell className="text-gray-600 cursor-pointer" />
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <Link to="/patient/profile">
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

export default PatientLayout;
