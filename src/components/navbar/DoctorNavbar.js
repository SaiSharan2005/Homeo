// DoctorNavbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Calendar, Users, FileText, MessageCircle, User, HelpCircle } from 'lucide-react';

const DoctorNavbar = ({ activeMenu, setActiveMenu }) => {
  const menuItems = [
    { icon: Home, label: 'Overview', key: 'home' },
    { icon: FileText, label: 'Appointment', key: 'appointment' },
    { icon: Calendar, label: 'Schedule', key: 'schedule' },
    { icon: Users, label: 'Medicians', key: 'medicians' },
    { icon: MessageCircle, label: 'Messages', key: 'messages' },
    { icon: User, label: 'Patients', key: 'patients' }
  ];

  return (
    <div className="relative w-64 bg-white text-gray-800 shadow-lg overflow-hidden">
      {/* Background Curves */}
      <div className="absolute top-0 left-0 right-0 z-0">
        <svg width="100%" height="100" viewBox="0 0 260 100" preserveAspectRatio="none">
          <path 
            d="M0 50 Q130 0, 260 50 T260 100 L0 100 Z" 
            fill="white" 
            className="opacity-50"
          />
        </svg>
      </div>

      {/* Logo */}
      <div className="relative z-10 p-6 flex items-center">
        <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-2">
          <span className="text-white font-bold">P</span>
        </div>
        <h1 className="text-xl font-bold text-gray-800">ProvoHeal</h1>
      </div>

      {/* Navigation Menu */}
      <nav className="relative z-10 mt-4">
        {menuItems.map((item) => (
          <Link 
            key={item.key} 
            to={`/doctor/${item.key}`} 
            onClick={() => setActiveMenu(item.key)}
            className={`
              flex items-center p-4 cursor-pointer transition-colors duration-200 relative
              ${activeMenu === item.key 
                ? 'bg-green-50 text-green-600' 
                : 'hover:bg-gray-100 text-gray-600'}
            `}
          >
            <item.icon className={`mr-4 w-5 h-5 ${activeMenu === item.key ? 'text-green-600' : 'text-gray-500'}`} />
            <span className="flex-grow">{item.label}</span>
            {/* Active Indicator */}
            {activeMenu === item.key && (
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-green-500 rounded-l-full"></div>
            )}
          </Link>
        ))}
      </nav>

      {/* Help Center Button */}
      <div className="relative z-10 p-6 mt-auto">
        <div className="bg-gray-100 rounded-2xl p-4 flex items-center shadow-md overflow-hidden relative">
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gray-100 rounded-b-full"></div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 w-12 h-12 rounded-full flex items-center justify-center mr-3 relative z-10">
            <HelpCircle className="w-6 h-6 text-white" />
          </div>
          <div className="relative z-10">
            <p className="text-sm font-semibold text-gray-800">Help Center</p>
            <p className="text-xs text-gray-500">Support & FAQ</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorNavbar;
