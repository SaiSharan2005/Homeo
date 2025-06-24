import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  FileText,
  Users,
  User,
  Megaphone,
  Activity,
  Archive,
  CreditCard,
  ClipboardList,
  ChevronDown,
  LogOut,
  Stethoscope
} from 'lucide-react';

const NewAdminNavbar = ({ activeMenu, setActiveMenu }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isActivityOpen, setIsActivityOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);

  useEffect(() => {
    const segments = location.pathname.split('/');
    const current = segments[2] || 'home';
    setActiveMenu(current);
    setIsActivityOpen(current === 'activity');
    setIsUserOpen(['patient-search','doctor-search','staff-search'].includes(current));
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const mainItems = [
    { icon: Home, label: 'Overview', key: 'home', to: '/admin/home' },
    { icon: FileText, label: 'Appointment', key: 'appointment', to: '/admin/appointment' },
        { icon: Users, label: 'Users', key: 'users', dropdown: true, open: isUserOpen, toggle: () => setIsUserOpen(o => !o) },
    { icon: Megaphone, label: 'Advertisement', key: 'advertisement', to: '/admin/advertisement' },
    { icon: Activity, label: 'Activity', key: 'activity', to: '/admin/activity', dropdown: true, open: isActivityOpen, toggle: () => setIsActivityOpen(o => !o) },
    { icon: Archive, label: 'Inventory', key: 'inventory', to: '/admin/inventory' },
    { icon: CreditCard, label: 'Payment', key: 'payment', to: '/admin/payment' },
    { icon: ClipboardList, label: 'Questionnaire', key: 'questionnaire', to: '/admin/questionnaire' },
  ];

  const activitySubs = [
    { label: 'All', key: 'all-activity', to: '/admin/all-activity' },
    { label: 'Appointment', key: 'appointment-activity', to: '/admin/appointment-activity' },
    { label: 'Doctor', key: 'doctor-activity', to: '/admin/doctor-activity' },
    { label: 'Patient', key: 'patient-activity', to: '/admin/patient-activity' },
    { label: 'Advertisement', key: 'advertisment-activity', to: '/admin/advertisment-activity' }
  ];

  const userSubs = [
    { label: 'Patient', key: 'patient-search', to: '/admin/patient-search', icon: User },
    { label: 'Doctor', key: 'doctor-search', to: '/admin/doctor-search', icon: Stethoscope },
    { label: 'Staff', key: 'staff-search', to: '/admin/staff-search', icon: Users }
  ];

  return (
    <div className="flex flex-col h-screen bg-white text-gray-800 shadow-lg transform transition-width duration-200 w-20 sm:w-64">
      {/* Logo */}
      <div className="p-4 flex items-center justify-center sm:justify-start">
        <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold">P</span>
        </div>
        <h1 className="ml-2 text-xl font-bold hidden sm:block">ProvoHeal</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto">
        {mainItems.map(item => {
          const isActive = activeMenu === item.key;
          const Icon = item.icon;
          return (
            <div key={item.key}>
              <div
                onClick={item.dropdown ? item.toggle : () => navigate(item.to)}
                className={`flex items-center p-4 cursor-pointer hover:bg-gray-100 transition-colors ${isActive ? 'bg-green-50 text-green-600' : 'text-gray-600'}`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-green-600' : 'text-gray-500'}`} />
                <span className="ml-3 hidden sm:inline-flex flex-grow">{item.label}</span>
                {item.dropdown && <ChevronDown className={`w-4 h-4 transition-transform ${item.open ? 'rotate-180' : ''}`} />}
              </div>
              {item.dropdown && item.open && (
                <div className="pl-12">
                  {(item.key === 'activity' ? activitySubs : userSubs).map(sub => {
                    const isSub = location.pathname.includes(sub.key);
                    const SubIcon = sub.icon;
                    return (
                      <Link
                        key={sub.key}
                        to={sub.to}
                        className={`flex items-center p-2 rounded hover:bg-gray-100 transition-colors ${isSub ? 'bg-green-50 text-green-600' : 'text-gray-600'}`}
                      >
                        {SubIcon && <SubIcon className="w-4 h-4 mr-2" />}
                        <span className="hidden sm:inline-flex">{sub.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4">
        <button onClick={handleLogout} className="flex items-center w-full p-2 hover:bg-gray-100 transition-colors text-gray-600">
          <LogOut className="w-5 h-5" />
          <span className="ml-3 hidden sm:inline-flex">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default NewAdminNavbar;
