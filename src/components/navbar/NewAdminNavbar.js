import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  FileText, 
  Users, 
  User, 
  Megaphone, 
  Activity, 
  Package,
  ChevronDown,
  LogOut
} from 'lucide-react';

const NewAdminNavbar = ({ activeMenu, setActiveMenu }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isActivityDropdownOpen, setIsActivityDropdownOpen] = useState(false);

  // Update activeMenu based on URL path
  useEffect(() => {
    const segments = location.pathname.split('/');
    const currentMain = segments[2] || 'home';
    setActiveMenu(currentMain);
    setIsActivityDropdownOpen(currentMain === 'activity');
  }, [location.pathname, setActiveMenu]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const menuItems = [
    { icon: Home, label: 'Overview', key: 'home', to: '/admin/home' },
    { icon: FileText, label: 'Appointment', key: 'appointment', to: '/admin/appointment' },
    { icon: Users, label: 'Patient', key: 'patient-search', to: '/admin/patient-search' },
    { icon: User, label: 'Doctor', key: 'doctor-search', to: '/admin/doctor-search' },
    { icon: Users, label: 'Staff', key: 'staff-search', to: '/admin/staff-search' },
    { icon: Megaphone, label: 'Advertisement', key: 'advertisement', to: '/admin/advertisement' },
    { icon: Activity, label: 'Activity', key: 'activity', to: '/admin/activity' },
    { icon: Package, label: 'Inventory', key: 'inventory', to: '/admin/inventory' },
    { icon: Package, label: 'Payment', key: 'payment', to: '/admin/payment' },
  ];

  const activitySubItems = [
    { label: 'All Activity', key: 'all-activity', to: '/admin/all-activity' },
    { label: 'Appointment Activity', key: 'appointment-activity', to: '/admin/appointment-activity' },
    { label: 'Doctor Activity', key: 'doctor-activity', to: '/admin/doctor-activity' },
    { label: 'Patient Activity', key: 'patient-activity', to: '/admin/patient-activity' },
    { label: 'Advertisement Activity', key: 'advertisment-activity', to: '/admin/advertisment-activity' }
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
          {menuItems.map(item => {
            const Icon = item.icon;
            if (item.key === 'activity') {
              const isActive = activeMenu === item.key;
              return (
                <div key={item.key}>
                  <div
                    onClick={() => setIsActivityDropdownOpen(prev => !prev)}
                    className={`flex items-center p-4 cursor-pointer transition-colors duration-200 relative ${
                      isActive ? 'bg-green-50 text-green-600' : 'hover:bg-gray-100 text-gray-600'
                    }`}
                  >
                    <Icon className={`mr-4 w-5 h-5 ${isActive ? 'text-green-600' : 'text-gray-500'}`} />
                    <span className="flex-grow">{item.label}</span>
                    <ChevronDown className={`w-4 h-4 ${isActivityDropdownOpen ? 'transform rotate-180' : ''}`} />
                    {isActive && (
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-green-500 rounded-l-full"></div>
                    )}
                  </div>
                  {isActivityDropdownOpen && (
                    <div className="pl-12">
                      {activitySubItems.map(sub => {
                        const isSubActive = location.pathname.includes(sub.key);
                        return (
                          <Link
                            key={sub.key}
                            to={sub.to}
                            className={`block p-3 rounded transition-colors duration-200 ${
                              isSubActive ? 'bg-green-50 text-green-600' : 'hover:bg-gray-100 text-gray-600'
                            }`}
                          >
                            {sub.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }
            const isActive = activeMenu === item.key;
            return (
              <Link
                key={item.key}
                to={item.to}
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

export default NewAdminNavbar;