// DoctorLayout.js
import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Bell, User } from "lucide-react";
import DoctorNavbar from "../navbar/DoctorNavbar";
import { Link } from "react-router-dom";

const DoctorLayout = () => {
  const [activeMenu, setActiveMenu] = useState("overview");
  const [username, setUsername] = useState("");

  // on mount, read the doctor's name from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("USERNAME");
    if (stored) setUsername(stored);
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar Navbar */}
      <DoctorNavbar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />

      {/* Main Content Area */}
      <div className="flex-grow bg-gray-50 p-6 overflow-y-auto">
        {/* Top Header */}
        <header className="flex justify-between items-center mb-6">
          <div className="relative flex-grow max-w-md mr-4">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-1">
              Hello {username ? `, ${username}` : ""}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <Bell className="text-gray-600 cursor-pointer" />
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <Link to="/doctor/profile">
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

export default DoctorLayout;
