import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, Users, FileText, MessageCircle, User, HelpCircle } from 'lucide-react';

const DoctorNavbar = ({ activeMenu, setActiveMenu }) => {
  const location = useLocation(); // Get current route

  const menuItems = [
    { icon: Home, label: 'Overview', key: 'home' },
    { icon: FileText, label: 'Appointment', key: 'appointment' },
    { icon: Calendar, label: 'Schedule', key: 'schedule' },
    { icon: Users, label: 'Medicians', key: 'medicians' },
    { icon: MessageCircle, label: 'Messages', key: 'messages' },
    { icon: User, label: 'Patients', key: 'patients' }
  ];

  // Update activeMenu based on URL path
  useEffect(() => {
    const currentPath = location.pathname.split('/')[2]; // Extracts "home", "appointment", etc.
    setActiveMenu(currentPath || 'home'); // Default to "home" if no match
  }, [location.pathname, setActiveMenu]);

  return (
<div className="relative w-64 flex-shrink-0 bg-white text-gray-800 shadow-lg overflow-hidden">
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
            className={`
              flex items-center p-4 cursor-pointer transition-colors duration-200 relative
              ${activeMenu === item.key 
                ? 'bg-green-50 text-green-600' 
                : 'hover:bg-gray-100 text-gray-600'}
            `}
          >
            <item.icon className={`mr-4 w-5 h-5 ${activeMenu === item.key ? 'text-green-600' : 'text-gray-500'}`} />
            <span className="flex-grow">{item.label}</span>
            {activeMenu === item.key && (
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-green-500 rounded-l-full"></div>
            )}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default DoctorNavbar;
