import React, { useState } from 'react';
import { 
  Home, 
  Calendar, 
  Users, 
  FileText, 
  MessageCircle, 
  Clipboard, 
  HelpCircle, 
  Search,
  Bell,
  User
} from 'lucide-react';

const ProvoHealDashboard = () => {
  const [activeMenu, setActiveMenu] = useState('overview');

  const menuItems = [
    { icon: Home, label: 'Overview', key: 'overview' },
    { icon: Calendar, label: 'Appointments', key: 'appointments' },
    { icon: Users, label: 'Doctors', key: 'doctors' },
    { icon: Users, label: 'Patients', key: 'patients' },
    { icon: FileText, label: 'Reports', key: 'reports' },
    { icon: MessageCircle, label: 'Messages', key: 'messages', notifications: 9 },
    { icon: Clipboard, label: 'Prescriptions', key: 'prescriptions' }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Curved Sidebar */}
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

        {/* ProvoHeal Logo */}
        <div className="relative z-10 p-6 flex items-center">
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-2">
            <span className="text-white font-bold">P</span>
          </div>
          <h1 className="text-xl font-bold text-gray-800">ProvoHeal</h1>
        </div>

        {/* Navigation Menu */}
        <nav className="relative z-10 mt-4">
          {menuItems.map((item) => (
            <div 
              key={item.key}
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
              {item.notifications && (
                <span className="bg-red-500 text-white rounded-full px-2 py-0.5 text-xs">
                  {item.notifications}
                </span>
              )}
              {/* Active Indicator */}
              {activeMenu === item.key && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-green-500 rounded-l-full"></div>
              )}
            </div>
          ))}
        </nav>

        {/* Help Center Button with Curved Design */}
        <div className="relative z-10 p-6 mt-auto">
          <div className="bg-gray-100 rounded-2xl p-4 flex items-center shadow-md overflow-hidden relative">
            {/* Subtle Curve Background */}
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

      {/* Main Content Area */}
      <div className="flex-grow bg-gray-50 p-6 overflow-y-auto">
        {/* Top Header */}
        <header className="flex justify-between items-center mb-6">
          <div className="relative flex-grow max-w-md mr-4">
            <input 
              type="text" 
              placeholder="Search here..."
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <div className="flex items-center space-x-4">
            <Bell className="text-gray-600 cursor-pointer" />
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="text-gray-600" />
            </div>
          </div>
        </header>

        {/* Welcome Message */}
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Welcome back, Richard</h2>
      </div>
    </div>
  );
};

export default ProvoHealDashboard;