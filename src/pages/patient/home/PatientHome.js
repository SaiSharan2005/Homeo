// import React, { useState, useRef, useEffect } from 'react';
// import { Link } from "react-router-dom";

// import logo from '../../images/doctorPatient.jpg'; // Adjust the path as needed
// import heroImage from '../../images/doctorPatient.jpg'; // Adjust the path as needed
// import serviceImage1 from '../../images/doctorPatient.jpg'; // Adjust the path as needed
// import serviceImage2 from '../../images/doctorPatient.jpg'; // Adjust the path as needed
// import serviceImage3 from '../../images/doctorPatient.jpg'; // Adjust the path as needed

// export default function PatientHome() {
//     const [isMenuOpen, setIsMenuOpen] = useState(false);
//     const profileMenuRef = useRef(null);
//     const mobileMenuRef = useRef(null);

//     const handleToggleMenu = () => {
//         setIsMenuOpen(!isMenuOpen);
//     };

//     const handleClickOutside = (event) => {
//         if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
//             setIsMenuOpen(false);
//         }
//         if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
//             setIsMenuOpen(false);
//         }
//     };

//     useEffect(() => {
//         document.addEventListener("mousedown", handleClickOutside);

//         return () => {
//             document.removeEventListener("mousedown", handleClickOutside);
//         };
//     }, []);

//     return (
//         <div className='min-h-screen flex flex-col'>
//             <nav className="bg-[#AADCD2] p-4 flex justify-between items-center px-7 md:px-10 lg:px-20">
//                 <div className="text-black font-bold lg:text-2xl">LOGO</div>
//                 <div className="flex items-center space-x-6">
//                     <div className="hidden md:flex space-x-6">
//                         <Link to="/home" className="p-2 lg:px-4 font-semibold text-black">Home</Link>
//                         <Link to="/doctorSearch" className="p-2 lg:px-4 font-semibold text-black">Doctors</Link>
//                         <Link to="/medicalRecords" className="p-2 lg:px-4 font-semibold text-black">Medical Records</Link>
//                         <Link to="/prescriptions" className="p-2 lg:px-4 font-semibold text-black">Prescriptions</Link>
//                     </div>
//                     <button className="relative">
//                         <svg className="w-8 h-8 text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="#000000" viewBox="0 0 14 20">
//                             <path d="M12.133 10.632v-1.8A5.406 5.406 0 0 0 7.979 3.57.946.946 0 0 0 8 3.464V1.1a1 1 0 0 0-2 0v2.364a.946.946 0 0 0 .021.106 5.406 5.406 0 0 0-4.154 5.262v1.8C1.867 13.018 0 13.614 0 14.807 0 15.4 0 16 .538 16h12.924C14 16 14 15.4 14 14.807c0-1.193-1.867-1.789-1.867-4.175ZM3.823 17a3.453 3.453 0 0 0 6.354 0H3.823Z" />
//                         </svg>
//                     </button>
//                     <div className="relative" ref={profileMenuRef}>
//                         <button aria-expanded={isMenuOpen} onClick={handleToggleMenu}>
//                             <svg className="w-8 h-8 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="#000000" viewBox="0 0 20 20">
//                                 <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
//                             </svg>
//                         </button>
//                         {isMenuOpen && (
//                             <div className="absolute right-0 mt-2 w-48 bg-[#d5ede9] rounded-lg shadow-lg py-2 z-50">
//                                 <Link to="/profile" className="block px-4 py-2 text-black">Profile</Link>
//                                 <Link to="/help" className="block px-4 py-2 text-black">Help Center</Link>
//                                 <Link to="/support" className="block px-4 py-2 text-black">Customer Support</Link>
//                                 <Link to="/logout" className="block px-4 py-2 text-black">Log Out</Link>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </nav>

//             <main className="flex-grow">
//                 <section className="bg-white py-20">
//                     <div className="container mx-auto flex flex-col lg:flex-row items-center">
//                         <div className="w-full lg:w-1/2 px-4">
//                             <h1 className="text-4xl lg:text-5xl font-bold text-[#0a2822] leading-tight">Welcome to Our Healthcare System</h1>
//                             <p className="mt-4 text-lg text-gray-700">Providing the best medical services for you and your family.</p>
//                             <Link to="/services" className="mt-8 bg-[#2BA78F] text-white py-2 px-6 rounded-full">Explore Services</Link>
//                         </div>
//                         <div className="w-full lg:w-1/2 mt-8 lg:mt-0 px-4">
//                             <img src={heroImage} alt="Healthcare" className="w-full h-full object-cover rounded-lg shadow-lg" />
//                         </div>
//                     </div>
//                 </section>

//                 <section className="bg-[#f7fafa] py-20">
//                     <div className="container mx-auto text-center">
//                         <h2 className="text-3xl font-bold text-[#0a2822] mb-12">Our Services</h2>
//                         <div className="flex flex-wrap justify-center">
//                             <div className="w-full md:w-1/2 lg:w-1/3 p-4">
//                                 <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//                                     <img src={serviceImage1} alt="Service 1" className="w-full h-48 object-cover" />
//                                     <div className="p-6">
//                                         <h3 className="text-2xl font-bold text-[#0a2822] mb-4">Consultations</h3>
//                                         <p className="text-gray-700">Get expert advice from our experienced doctors.</p>
//                                     </div>
//                                 </div>
//                             </div>
//                             <div className="w-full md:w-1/2 lg:w-1/3 p-4">
//                                 <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//                                     <img src={serviceImage2} alt="Service 2" className="w-full h-48 object-cover" />
//                                     <div className="p-6">
//                                         <h3 className="text-2xl font-bold text-[#0a2822] mb-4">Diagnostics</h3>
//                                         <p className="text-gray-700">Comprehensive diagnostic services for accurate results.</p>
//                                     </div>
//                                 </div>
//                             </div>
//                             <div className="w-full md:w-1/2 lg:w-1/3 p-4">
//                                 <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//                                     <img src={serviceImage3} alt="Service 3" className="w-full h-48 object-cover" />
//                                     <div className="p-6">
//                                         <h3 className="text-2xl font-bold text-[#0a2822] mb-4">Emergency Care</h3>
//                                         <p className="text-gray-700">24/7 emergency services for urgent medical needs.</p>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </section>
//             </main>

//             <footer className="bg-white py-6">
//                 <div className="container mx-auto text-center">
//                     <p className="text-gray-700">&copy; 2024 Healthcare System. All rights reserved.</p>
//                 </div>
//             </footer>
//         </div>
//     );
// }

// HeroSection.jsx
import React from "react";
// import PatientNavbar from "../../../../components/PatientNavbar";
import patientBackground from "../../../images/patientBackground.jpeg";
import patientHome from "../../../images/patientHome.jpeg";
import PatientNavbar from "../../../components/navbar/PatientNavbar";
const HomePage = () => {
  const testimonials = [
    {
      name: "Maria Lopez",
      image: "url_to_image1",
      text: "Healthify changed my life! I felt like a superstar!",
    },
    {
      name: "James Smith",
      image: "url_to_image2",
      text: "The staff is amazing! They treat you like family!",
    },
    {
      name: "Emily Johnson",
      image: "url_to_image3",
      text: "I never knew healthcare could be this fun!",
    },
    {
      name: "Michael Brown",
      image: "url_to_image4",
      text: "Professional and caring, just what I needed!",
    },
    {
      name: "Sophia Davis",
      image: "url_to_image5",
      text: "A breath of fresh air in healthcare!",
    },
    {
      name: "David Wilson",
      image: "url_to_image6",
      text: "I actually look forward to my appointments now!",
    },
  ];
  var index = 1;
  return (
    <div className="HomePage">
      {/* <PatientNavbar /> */}
      {/* Hero Section */}
      <div className="relative bg-gray-100">
        <img
          src={patientBackground}
          alt="Hospital scene"
          className="w-full h-screen object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent"></div>
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-8">
          <div className="bg-white bg-opacity-90 p-4 rounded-full">
            <img
              src="your-logo-url.jpg"
              alt="Healthify Logo"
              className="w-12 h-12 object-cover rounded-full"
            />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mt-4">
            Care Revolution
          </h1>
          <p className="text-lg text-gray-700 mt-2">
            Where Compassion Meets Expertise in Every Interaction!
          </p>
          <button className="mt-4 bg-green-500 text-white py-2 px-6 rounded-full hover:bg-green-600">
            Get Started
          </button>
        </div>
      </div>

      {/* Commitment Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 text-center md:text-left md:pr-8">
            <h2 className="text-5xl font-bold text-gray-900">
              Our Commitment to Care
            </h2>
            <p className="text-gray-700 mt-4">
              At Healthify, we believe that healthcare should be a delightful
              experience, not a daunting one. Our team of dedicated
              professionals is here to ensure that every patient feels valued
              and cared for, like a VIP at a five-star resort!
            </p>
            <p className="text-gray-700 mt-2">
              We pride ourselves on our diverse team of healthcare heroes, each
              bringing unique skills and perspectives to the table. From the
              moment you walk through our doors, you’ll be greeted with warmth
              and professionalism that makes you feel right at home.
            </p>
            <p className="text-gray-700 mt-2">
              Join us on this journey to redefine healthcare, where every visit
              is a step towards a healthier, happier you!
            </p>
          </div>
          <div className="md:w-1/2 mt-8 md:mt-0">
            <img
              src={patientHome}
              alt="Healthcare professionals"
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-12">
            Cheers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gray-100 p-6 rounded-lg text-center"
              >
                <img
                  className="w-24 h-24 rounded-full mx-auto mb-4"
                  src={`https://randomuser.me/api/portraits/med/men/${index+10}.jpg`}
                  alt={testimonial.name}
                />
                <h3 className="text-lg font-medium text-gray-900">
                  {testimonial.name}
                </h3>
                <p className="mt-4 text-gray-600">{testimonial.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-yellow-400 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-8">
            Your Health, Our Priority!
          </h1>
          <button className="bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 transition">
            Join Us Today!
          </button>
        </div>
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <span className="text-4xl font-extrabold text-green-600">
                99%
              </span>
              <p className="mt-2 text-lg font-medium text-gray-900">
                Patient Satisfaction
              </p>
            </div>
            <div className="p-6">
              <span className="text-4xl font-extrabold text-green-600">
                24/7
              </span>
              <p className="mt-2 text-lg font-medium text-gray-900">
                Care Available
              </p>
            </div>
            <div className="p-6">
              <span className="text-4xl font-extrabold text-green-600">
                100+
              </span>
              <p className="mt-2 text-lg font-medium text-gray-900">
                Expert Doctors
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
