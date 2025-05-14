import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, FileText, User, Package, LogOut } from 'lucide-react';

const PatientNavbar = ({ activeMenu, setActiveMenu }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Update activeMenu based on URL path (assumes /patient/{menu})
  useEffect(() => {
    const segments = location.pathname.split('/');
    const currentMain = segments[2] || 'home';
    setActiveMenu(currentMain);
  }, [location.pathname, setActiveMenu]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const menuItems = [
    { icon: Home, label: 'Home', key: 'home' },
    { icon: FileText, label: 'Appointment', key: 'appointment' },
    { icon: User, label: 'Doctor', key: 'doctorSearch' },
    { icon: Package, label: 'Payments', key: 'payments' },
  ];

  return (
    <div className="relative w-64 flex-shrink-0 bg-white text-gray-800 shadow-lg overflow-hidden flex flex-col justify-between h-screen">
      {/* Top section: Logo + Menu */}
      <div>
        <div className="relative z-10 p-6 flex items-center">
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-2">
            <span className="text-white font-bold">P</span>
          </div>
          <h1 className="text-xl font-bold text-gray-800">ProvoHeal</h1>
        </div>
        <nav className="relative z-10 mt-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.key;
            return (
              <Link
                key={item.key}
                to={`/patient/${item.key}`}
                className={`flex items-center p-4 cursor-pointer transition-colors duration-200 relative ${
                  isActive ? 'bg-green-50 text-green-600' : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <Icon className={`mr-4 w-5 h-5 ${isActive ? 'text-green-600' : 'text-gray-500'}`} />
                <span className="flex-grow">{item.label}</span>
                {isActive && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-green-500 rounded-l-full"></div>
                )}
              </Link>
            );
          })}
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

export default PatientNavbar;
