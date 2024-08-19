import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function DoctorNavbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isAdOpen, setIsAdOpen] = useState(false);
    const [isActivityOpen, setIsActivityOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false); // Define isOpen state for mobile menu

    const profileMenuRef = useRef(null);
    const searchMenuRef = useRef(null);
    const adMenuRef = useRef(null);
    const activityMenuRef = useRef(null);
    const mobileMenuRef = useRef(null);
    const navigate = useNavigate();

    const handleClickOutside = (event) => {
        if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
            setIsMenuOpen(false);
        }
        if (searchMenuRef.current && !searchMenuRef.current.contains(event.target)) {
            setIsSearchOpen(false);
        }
        if (adMenuRef.current && !adMenuRef.current.contains(event.target)) {
            setIsAdOpen(false);
        }
        if (activityMenuRef.current && !activityMenuRef.current.contains(event.target)) {
            setIsActivityOpen(false);
        }
        if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
            setIsOpen(false); // Use setIsOpen to close mobile menu
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <nav className="bg-teal-700 p-4 flex justify-between items-center px-7 md:px-10 lg:px-20 shadow-lg">
            <div className="text-white font-bold lg:text-2xl">Healthify</div>
            <div className="flex items-center space-x-6">
                <div className="relative" ref={searchMenuRef}>
                    <button className="text-white" onClick={() => setIsSearchOpen(!isSearchOpen)}>
                        Search
                    </button>
                    {isSearchOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-200">
                            <Link to = "/staff/doctor-search">
                            <button className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Doctor Search</button>
                            </Link>
                            <Link to = "/staff/patient-search">
                            <button className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Patient Search</button>
                            </Link>
                            <Link to = "/staff/GetAllAppointment">
                            <button className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Appointment Search</button>
                            </Link>
                        </div>
                    )}
                </div>
                <div className="relative" ref={adMenuRef}>
                    <button className="text-white" onClick={() => setIsAdOpen(!isAdOpen)}>
                        Advertisement
                    </button>
                    {isAdOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-200">
                            <Link to="/staff/create-adv">
                                <button className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Create Advertisement</button>
                            </Link>
                            <Link to="/staff/all-adv">
                                <button className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Show All Appointments</button>
                            </Link>
                        </div>
                    )}
                </div>
                <div className="relative" ref={activityMenuRef}>
                    <button className="text-white" onClick={() => setIsActivityOpen(!isActivityOpen)}>
                        Activity
                    </button>
                    {isActivityOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-200">
                            <Link to="/staff/all-activity">
                                <button className="block px-4 py-2 text-gray-800 hover:bg-gray-100">All Activities</button>
                            </Link>
                            <Link to="/staff/doctor-activity">
                                <button className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Doctor Activity</button>
                            </Link>
                            <Link to="/staff/patient-activity">
                                <button className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Patient Activity</button>
                            </Link>
                            <Link to="/staff/appointment-activity">
                                <button className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Appointment Activity</button>
                            </Link>
                            <Link to="/staff/advertisement-activity">
                                <button className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Advertisement Activity</button>
                            </Link>
                        </div>
                    )}
                </div>
                <button className="text-white" onClick={() => { localStorage.clear(); navigate("/") }}>
                    Log Out
                </button>
                <div ref={mobileMenuRef} className="relative">
                    <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                        </svg>
                    </button>
                </div>
                {isOpen && (
                    <div ref={mobileMenuRef} className="md:hidden absolute w-48 top-16 right-4 rounded-md bg-white shadow-lg p-4 flex flex-col items-start space-y-4 z-50 border border-gray-200">
                        <button className="text-gray-800" onClick={() => setIsSearchOpen(!isSearchOpen)}>Search</button>
                        {isSearchOpen && (
                            <div className="mt-2 w-full bg-white rounded-lg shadow-lg py-2 border border-gray-200">
                                <Link to = "/staff/doctor-search">
                                    <button className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Doctor Search</button>
                                </Link>
                                <Link to = "/staff/patient-search">
                                    <button className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Patient Search</button>
                                </Link>
                                <Link to = "/staff/GetAllAppointment">
                                    <button className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Appointment Search</button>
                                </Link>
                            </div>
                        )}
                        <button className="text-gray-800" onClick={() => setIsAdOpen(!isAdOpen)}>Advertisement</button>
                        {isAdOpen && (
                            <div className="mt-2 w-full bg-white rounded-lg shadow-lg py-2 border border-gray-200">
                                <Link to="/staff/create-adv">
                                    <button className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Create Advertisement</button>
                                </Link>
                                <Link to="/staff/all-adv">
                                    <button className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Show All Appointments</button>
                                </Link>
                            </div>
                        )}
                        <button className="text-gray-800" onClick={() => setIsActivityOpen(!isActivityOpen)}>Activity</button>
                        {isActivityOpen && (
                            <div className="mt-2 w-full bg-white rounded-lg shadow-lg py-2 border border-gray-200">
                                <Link to="/staff/all-activity">
                                    <button className="block px-4 py-2 text-gray-800 hover:bg-gray-100">All Activities</button>
                                </Link>
                                <Link to="/staff/doctor-activity">
                                    <button className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Doctor Activity</button>
                                </Link>
                                <Link to="/staff/patient-activity">
                                    <button className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Patient Activity</button>
                                </Link>
                                <Link to="/staff/appointment-activity">
                                    <button className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Appointment Activity</button>
                                </Link>
                                <Link to="/staff/advertisement-activity">
                                    <button className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Advertisement Activity</button>
                                </Link>
                            </div>
                        )}
                        <button className="text-gray-800" onClick={() => { localStorage.clear(); navigate("/") }}>Log Out</button>
                    </div>
                )}
            </div>
        </nav>
    );}
