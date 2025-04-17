import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  FileText, 
  Users, 
  User, 
  Megaphone, 
  Activity, 
  Package,
  ChevronDown
} from 'lucide-react';

const StaffNavbar = ({ activeMenu, setActiveMenu }) => {
  const location = useLocation();
  const [isActivityDropdownOpen, setIsActivityDropdownOpen] = useState(false);

  // Retrieve the roles from localStorage.
  const userRoles = JSON.parse(localStorage.getItem("ROLES") || "[]");
  
  /*  
    Define the menu items.
    • 'always: true' means the menu item is always visible.
    • 'requiredRole' indicates the required role to view the item.
    • We add a Payment entry and remove the explicit Staff page (as requested).
  */
  const menuItems = [
    { icon: Home, label: 'Overview', key: 'home', to: '/staff/home', always: true },
    { icon: FileText, label: 'Appointment', key: 'appointment', to: '/staff/appointment', requiredRole: 'APPOINTMENT' },
    { icon: Users, label: 'Patient', key: 'patient-search', to: '/staff/patient-search', requiredRole: 'USERS' },
    { icon: User, label: 'Doctor', key: 'doctor-search', to: '/staff/doctor-search', requiredRole: 'USERS' },
    { icon: FileText, label: 'Payment', key: 'payment', to: '/staff/payment', requiredRole: 'PAYMENT' },
    { icon: Megaphone, label: 'Advertisement', key: 'advertisement', to: '/staff/advertisement', requiredRole: 'ADVERTISEMENT' },
    { icon: Activity, label: 'Activity', key: 'activity', to: '/staff/activity', requiredRole: 'ACTIVITY' },
    { icon: Package, label: 'Inventory', key: 'inventory', to: '/staff/inventory', requiredRole: 'INVENTORY' }
  ];

  // Filter to include only pages allowed by the user's roles.
  const allowedMenuItems = menuItems.filter(item => {
    if (item.always) return true;
    if (item.requiredRole && userRoles.includes(item.requiredRole)) return true;
    return false;
  });

  // Update activeMenu based on URL path (assumes /staff/{menu}[/...])
  useEffect(() => {
    const segments = location.pathname.split('/');
    const currentMain = segments[2] || 'home';
    setActiveMenu(currentMain);
    // If current main is "activity", open the dropdown automatically
    if (currentMain === "activity") {
      setIsActivityDropdownOpen(true);
    } else {
      setIsActivityDropdownOpen(false);
    }
  }, [location.pathname, setActiveMenu]);

  // Submenu items for the Activity dropdown remain as originally defined.
  const activitySubItems = [
    { label: 'All Activity', key: 'all-activity', to: '/staff/all-activity' },
    { label: 'Appointment Activity', key: 'appointment-activity', to: '/staff/appointment-activity' },
    { label: 'Doctor Activity', key: 'doctor-activity', to: '/staff/doctor-activity' },
    { label: 'Patient Activity', key: 'patient-activity', to: '/staff/patient-activity' },
    { label: 'Advertisement Activity', key: 'advertisment-activity', to: '/staff/advertisment-activity' }
  ];

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
        {allowedMenuItems.map((item) => {
          const Icon = item.icon;
          // Special handling for Activity dropdown menu
          if (item.key === 'activity') {
            const isActive = activeMenu === item.key;
            return (
              <div key={item.key}>
                <div 
                  onClick={() => setIsActivityDropdownOpen(prev => !prev)}
                  className={`
                    flex items-center p-4 cursor-pointer transition-colors duration-200 relative
                    ${isActive ? 'bg-green-50 text-green-600' : 'hover:bg-gray-100 text-gray-600'}
                  `}
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
                    {activitySubItems.map((subItem) => {
                      const isSubActive = location.pathname.includes(subItem.key);
                      return (
                        <Link 
                          key={subItem.key}
                          to={subItem.to}
                          className={`block p-3 rounded transition-colors duration-200
                            ${isSubActive ? 'bg-green-50 text-green-600' : 'hover:bg-gray-100 text-gray-600'}`}
                        >
                          {subItem.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          } else {
            const isActive = activeMenu === item.key;
            return (
              <Link 
                key={item.key} 
                to={item.to}
                className={`
                  flex items-center p-4 cursor-pointer transition-colors duration-200 relative
                  ${isActive ? 'bg-green-50 text-green-600' : 'hover:bg-gray-100 text-gray-600'}
                `}
              >
                <Icon className={`mr-4 w-5 h-5 ${isActive ? 'text-green-600' : 'text-gray-500'}`} />
                <span className="flex-grow">{item.label}</span>
                {isActive && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-green-500 rounded-l-full"></div>
                )}
              </Link>
            );
          }
        })}
      </nav>
    </div>
  );
};

export default StaffNavbar;
