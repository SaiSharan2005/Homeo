import React, { useState } from 'react';
import { 
  Home, 
  Calendar, 
  Users, 
  FileText, 
  MessageCircle, 
  Clipboard, 
  HelpCircle, 
  Bell, 
  Search, 
  User 
} from 'lucide-react';

const ProvoHealDashboard = () => {
  const [activeMenu, setActiveMenu] = useState('overview');

  const menuItems = [
    { icon: Home, label: 'Overview', key: 'overview' },
    { icon: Calendar, label: 'Appointments', key: 'appointments' },
    { icon: User, label: 'Doctors', key: 'doctors' },
    { icon: Users, label: 'Patients', key: 'patients' },
    { icon: FileText, label: 'Reports', key: 'reports' },
    { icon: MessageCircle, label: 'Messages', key: 'messages', notifications: 9 },
    { icon: Clipboard, label: 'Prescriptions', key: 'prescriptions' }
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-[#1E2036] text-white relative">
        {/* ProvoHeal Logo */}
        <div className="p-6 flex items-center">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-2">
            <span className="text-white font-bold">P</span>
          </div>
          <h1 className="text-xl font-bold">ProvoHeal</h1>
        </div>

        {/* Navigation Menu */}
        <nav className="mt-8">
          {menuItems.map((item) => (
            <div 
              key={item.key}
              onClick={() => setActiveMenu(item.key)}
              className={`
                flex items-center p-4 cursor-pointer transition-colors duration-200
                ${activeMenu === item.key 
                  ? 'bg-blue-600/20 border-r-4 border-blue-500' 
                  : 'hover:bg-blue-500/10'}
              `}
            >
              <item.icon className="mr-4 w-5 h-5" />
              <span className="flex-grow">{item.label}</span>
              {item.notifications && (
                <span className="bg-red-500 text-white rounded-full px-2 py-0.5 text-xs">
                  {item.notifications}
                </span>
              )}
            </div>
          ))}
        </nav>

        {/* Help Center Button with Curved Design */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="bg-[#2C3042] rounded-xl p-4 flex items-center shadow-lg">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 w-12 h-12 rounded-full flex items-center justify-center mr-3">
              <HelpCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold">Help Center</p>
              <p className="text-xs text-gray-400">Support & FAQ</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow p-6 overflow-y-auto">
        {/* Top Header */}
        <header className="flex justify-between items-center mb-6">
          <div className="relative flex-grow max-w-md mr-4">
            <input 
              type="text" 
              placeholder="Search here..."
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

        {/* Dashboard Content (Placeholder) */}
        <h2 className="text-2xl font-bold mb-4">Welcome back, Richard</h2>
        {/* Add your dashboard widgets and content here */}
      </div>
    </div>
  );
};

export default ProvoHealDashboard;