import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";

export default function PatientNavbar() {
    const [activeButton, setActiveButton] = useState(1);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const profileMenuRef = useRef(null);
    const mobileMenuRef = useRef(null);
    const navigator = useNavigate();
    const handleButtonClick = (buttonId) => {
        setActiveButton(buttonId);
    };

    const [selectedOption, setSelectedOption] = useState('Option 1');

    const handleOptionChange = (option) => {
        setSelectedOption(option);
    };

    const handleToggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleClickOutside = (event) => {
        if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
            setIsMenuOpen(false);
        }
        if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <nav className="bg-teal-600 p-4 flex justify-between items-center px-7 md:px-10 lg:px-20">
            <div className="text-white font-bold lg:text-2xl">Healthify</div>
            <div className="flex items-center space-x-6">
                <div className="hidden md:flex space-x-6">
                    <Link to="/patient/home">
                        <button
                            className={`p-2 lg:px-4 font-semibold bg-transparent ${selectedOption === 'Option 1' ? 'text-teal-200' : 'text-white'}`}
                            onClick={() => handleOptionChange('Option 1')}
                        >Home</button>
                    </Link>
                    <Link to="/doctorSearch">
                        <button
                            className={`p-2 lg:px-4 font-semibold bg-transparent ${selectedOption === 'Option 2' ? 'text-teal-200' : 'text-white'}`}
                            onClick={() => handleOptionChange('Option 2')}
                        >Doctors</button>
                    </Link>
                    <button
                        className={`p-2 lg:px-4 font-semibold bg-transparent ${selectedOption === 'Option 3' ? 'text-teal-200' : 'text-white'}`}
                        onClick={() => navigator("/patient/history")}
                    >Appointments</button>
                    {/* <button
                        className={`p-2 lg:px-4 font-semibold bg-transparent ${selectedOption === 'Option 4' ? 'text-teal-200' : 'text-white'}`}
                        onClick={() => handleOptionChange('Option 4')}
                    >Prescriptions</button> */}
                </div>
                <button className="relative">
                    {/* notification bell */}
                    <svg className="w-8 h-8 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="#FFFFFF" viewBox="0 0 14 20">
                        <path d="M12.133 10.632v-1.8A5.406 5.406 0 0 0 7.979 3.57.946.946 0 0 0 8 3.464V1.1a1 1 0 0 0-2 0v2.364a.946.946 0 0 0 .021.106 5.406 5.406 0 0 0-4.154 5.262v1.8C1.867 13.018 0 13.614 0 14.807 0 15.4 0 16 .538 16h12.924C14 16 14 15.4 14 14.807c0-1.193-1.867-1.789-1.867-4.175ZM3.823 17a3.453 3.453 0 0 0 6.354 0H3.823Z" />
                    </svg>
                </button>
                <div className="relative" ref={profileMenuRef}>
                    <button aria-expanded={isMenuOpen} onClick={handleToggleMenu}>
                        {/* profile symbol */}
                        <svg className="w-8 h-8 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="#FFFFFF" viewBox="0 0 20 20">
                            <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
                        </svg>
                    </button>
                    {isMenuOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-teal-100 rounded-lg shadow-lg py-2 z-50">
                            <button
                                className={`block px-4 py-2 text-teal-800`}
                                onClick={() => navigator("/patient/profile")}
                            >Profile</button>
                            <a href="#help" className="block px-4 py-2 text-teal-800">Help Center</a>
                            <a href="#support" className="block px-4 py-2 text-teal-800">Customer Support</a>
                            <a onClick={() => { localStorage.clear(); navigator("/") }} className="block px-4 py-2 text-teal-800 cursor-pointer">Log Out</a>
                        </div>
                    )}
                </div>
                <div ref={mobileMenuRef} className="relative">
                    <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
                        <svg className="w-5 h-5 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                        </svg>
                    </button>
                </div>
                {isOpen && (
                    <div ref={mobileMenuRef} className="md:hidden absolute w-48 top-16 right-4 rounded-md bg-teal-100 p-4 flex flex-col items-start pl-5 space-y-4 z-50">
                        <Link to="/doctorSearch">
                            <button className="text-teal-800" onClick={() => handleOptionChange('Option 2')}>Doctors</button>
                        </Link>
                        <button className="text-teal-800" onClick={() => handleOptionChange('Option 3')}>Appointments</button>
                        <button className="text-teal-800" onClick={() => handleOptionChange('Option 4')}>Medical Records</button>
                        <button className="text-teal-800" onClick={() => handleOptionChange('Option 5')}>Prescriptions</button>
                    </div>
                )}
            </div>
        </nav>
    );
}
