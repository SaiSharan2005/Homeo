import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Calendar, Users, FileText, LogOut } from 'lucide-react';

const DoctorNavbar = ({ activeMenu, setActiveMenu }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { icon: Home, label: 'Overview', key: 'home' },
    { icon: FileText, label: 'Appointment', key: 'appointment' },
    { icon: Calendar, label: 'Schedule', key: 'schedule' },
    { icon: Users, label: 'Medicines', key: 'medicians' },
  ];

  useEffect(() => {
    const currentPath = location.pathname.split('/')[2];
    setActiveMenu(currentPath || 'home');
  }, [location.pathname, setActiveMenu]);

  const handleLogout = () => {
    // Clear all stored data
    localStorage.clear();
    // Redirect to login page
    navigate('/login');
  };

  return (
    <div className="relative w-64 flex-shrink-0 bg-white text-gray-800 shadow-lg overflow-hidden flex flex-col justify-between h-screen">
      {/* Top section: Logo + Menu */}
      <div>
        <div className="relative z-10 p-6 flex items-center">
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-2">
            <span className="text-white font-bold">H</span>
          </div>
          <h1 className="text-xl font-bold text-gray-800">Healthify</h1>
        </div>
        <nav className="relative z-10 mt-4">
          {menuItems.map((item) => (
            <Link
              key={item.key}
              to={`/doctor/${item.key}`}
              className={`flex items-center p-4 cursor-pointer transition-colors duration-200 relative ${
                activeMenu === item.key
                  ? 'bg-green-50 text-green-600'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <item.icon
                className={`mr-4 w-5 h-5 ${
                  activeMenu === item.key ? 'text-green-600' : 'text-gray-500'
                }`}
              />
              <span className="flex-grow">{item.label}</span>
              {activeMenu === item.key && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-green-500 rounded-l-full"></div>
              )}
            </Link>
          ))}
        </nav>
      </div>

      {/* Bottom section: Logout */}
      <div className="p-4">
        <button
          onClick={handleLogout}
          className="flex items-center w-full p-4 text-gray-600 hover:bg-gray-100 transition-colors duration-200"
        >
          <LogOut className="mr-4 w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default DoctorNavbar;