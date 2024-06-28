import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Schedules from "./Schedules";
import DoctorProfile from "./DoctorProfile";
import image from "../../images/image.jpg";
import heroImage from '../../images/doctorPatient.jpg'; // Adjust the path as needed
import serviceImage1 from '../../images/doctorPatient.jpg'; // Adjust the path as needed
import serviceImage2 from '../../images/doctorPatient.jpg'; // Adjust the path as needed
import serviceImage3 from '../../images/doctorPatient.jpg';
export default function DoctorHome() {
  const [activeButton, setActiveButton] = useState(1);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const handleButtonClick = (buttonId) => {
    setActiveButton(buttonId);
  };

  const [selectedOption, setSelectedOption] = useState("Option 1");

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  const handleToggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleClickOutside = (event) => {
    if (
      profileMenuRef.current &&
      !profileMenuRef.current.contains(event.target)
    ) {
      setIsMenuOpen(false);
    }
    if (
      mobileMenuRef.current &&
      !mobileMenuRef.current.contains(event.target)
    ) {
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
    <div className="min-h-screen">
      <nav className="bg-[#AADCD2] p-4 flex justify-between items-center px-7 md:px-10 lg:px-20">
        <div className="text-black font-bold lg:text-2xl">LOGO</div>
        <div className="flex items-center space-x-6">
          <div className="hidden md:flex space-x-6">
            <button
              className={`p-2 lg:px-4 font-semibold bg-transparent ${
                selectedOption === "Option 1" ? "text-white" : "text-black"
              }`}
              onClick={() => handleOptionChange("Option 1")}
            >
              Schedules
            </button>
            {/* <button
                        className={`p-2 lg:px-4 font-semibold bg-transparent ${selectedOption === 'Option 2' ? 'text-white' : 'text-black'}`}
                        onClick={() => handleOptionChange('Option 2')}
                    >Doctor Details</button>
                    <button
                        className={`p-2 lg:px-4 font-semibold bg-transparent ${selectedOption === 'Option 3' ? 'text-white' : 'text-black'}`}
                        onClick={() => handleOptionChange('Option 3')}
                    >Medical Records</button>
                    <button
                        className={`p-2 lg:px-4 font-semibold bg-transparent ${selectedOption === 'Option 4' ? 'text-white' : 'text-black'}`}
                        onClick={() => handleOptionChange('Option 4')}
                    >Prescriptions</button> */}
          </div>
          <button className="relative">
            {/* notification bell */}
            <svg
              className="w-8 h-8 text-gray-800 dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="#000000"
              viewBox="0 0 14 20"
            >
              <path d="M12.133 10.632v-1.8A5.406 5.406 0 0 0 7.979 3.57.946.946 0 0 0 8 3.464V1.1a1 1 0 0 0-2 0v2.364a.946.946 0 0 0 .021.106 5.406 5.406 0 0 0-4.154 5.262v1.8C1.867 13.018 0 13.614 0 14.807 0 15.4 0 16 .538 16h12.924C14 16 14 15.4 14 14.807c0-1.193-1.867-1.789-1.867-4.175ZM3.823 17a3.453 3.453 0 0 0 6.354 0H3.823Z" />
            </svg>
          </button>
          <div className="relative" ref={profileMenuRef}>
            <button aria-expanded={isMenuOpen} onClick={handleToggleMenu}>
              {/* profile symbol */}
              <svg
                className="w-8 h-8 text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="#000000"
                viewBox="0 0 20 20"
              >
                <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
              </svg>
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-[#d5ede9] rounded-lg shadow-lg py-2 z-50">
                <button
                  className={`block px-4 py-2 text-black`}
                  onClick={() => handleOptionChange("Profile")}
                >
                  Profile
                </button>
                <a href="#help" className="block px-4 py-2 text-black">
                  Help Center
                </a>
                <a href="#logout" className="block px-4 py-2 text-black">
                  Log Out
                </a>
              </div>
            )}
          </div>
          <div ref={mobileMenuRef} className="relative">
            <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
            </button>
          </div>
          {isOpen && (
            <div
              ref={mobileMenuRef}
              className="md:hidden absolute w-48 top-16 right-4 rounded-md bg-[#d5ede9] p-4 flex flex-col items-start pl-5 space-y-4 z-50"
            >
              <button
                className="text-black"
                onClick={() => handleOptionChange("Option 2")}
              >
                Doctors
              </button>
              <button
                className="text-black"
                onClick={() => handleOptionChange("Option 3")}
              >
                Appointments
              </button>
              <button
                className="text-black"
                onClick={() => handleOptionChange("Option 4")}
              >
                Medical Records
              </button>
              <button
                className="text-black"
                onClick={() => handleOptionChange("Option 5")}
              >
                Prescriptions
              </button>
            </div>
          )}
        </div>
      </nav>
      <div className=" bg-white">
        {/* <header className="flex justify-between items-center p-5 bg-gray-100 shadow">
          <div className="text-lg font-bold">MediCheck</div>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <a href="#home" className="hover:text-gray-700">
                  Home
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-gray-700">
                  About
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-gray-700">
                  Services
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-gray-700">
                  Contact
                </a>
              </li>
            </ul>
          </nav>
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Login
          </button>
        </header> */}
        <main className="flex justify-center items-center h-full py-20">
          <div className="bg-white p-8 rounded-lg shadow-md flex items-center space-x-8 max-w-4xl">
            <img src={image} alt="Health" className="rounded-lg w-1/2" />
            <div>
              <h1 className="text-4xl font-bold mb-4">
                Welcome to Your MediHealth Dashboard
              </h1>
              <p className="text-lg mb-6">
                Manage your appointments and schedules with ease.
              </p>
              <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700">
                Check Today's Schedule
              </button>
            </div>
          </div>
        </main>
      </div>




      <main className="flex-grow">
        {/* <section className="bg-white py-20">
          <div className="container mx-auto flex flex-col lg:flex-row items-center">
            <div className="w-full lg:w-1/2 px-4">
              <h1 className="text-4xl lg:text-5xl font-bold text-[#0a2822] leading-tight">Welcome to Our Healthcare System</h1>
              <p className="mt-4 text-lg text-gray-700">Providing the best medical services for you and your family.</p>
              <Link to="/services" className="mt-8 bg-[#2BA78F] text-white py-2 px-6 rounded-full">Explore Services</Link>
            </div>
            <div className="w-full lg:w-1/2 mt-8 lg:mt-0 px-4">
              <img src={heroImage} alt="Healthcare" className="w-full h-full object-cover rounded-lg shadow-lg" />
            </div>
          </div>
        </section> */}

        <section className="bg-[#f7fafa] py-20">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold text-[#0a2822] mb-12">Our Services</h2>
            <div className="flex flex-wrap justify-center">
              <div className="w-full md:w-1/2 lg:w-1/3 p-4">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <img src={serviceImage1} alt="Service 1" className="w-full h-48 object-cover" />
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-[#0a2822] mb-4">Consultations</h3>
                    <p className="text-gray-700">Get expert advice from our experienced doctors.</p>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-1/2 lg:w-1/3 p-4">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <img src={serviceImage2} alt="Service 2" className="w-full h-48 object-cover" />
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-[#0a2822] mb-4">Diagnostics</h3>
                    <p className="text-gray-700">Comprehensive diagnostic services for accurate results.</p>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-1/2 lg:w-1/3 p-4">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <img src={serviceImage3} alt="Service 3" className="w-full h-48 object-cover" />
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-[#0a2822] mb-4">Emergency Care</h3>
                    <p className="text-gray-700">24/7 emergency services for urgent medical needs.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white py-6">
        <div className="container mx-auto text-center">
          <p className="text-gray-700">&copy; 2024 Healthcare System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
