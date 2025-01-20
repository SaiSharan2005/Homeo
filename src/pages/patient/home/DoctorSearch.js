// import React, { useState } from 'react';
// import image from "../../images/image.jpg";
// import {Link} from "react-router-dom"
// import PatientNavbar from '../../components/PatientNavbar';
// const specialties = [
//   'Primary Care Doctor', 'OB-GYN', 'Dermatologist', 'Orthopedic Surgeon', 'Cardiologist', 'Psychiatrist'
// ];

// const insurances = [
//   'Blue Cross Blue Shield', 'Aetna', 'Cigna', 'United Healthcare', 'Medicare', 'Humana'
// ];

// const DoctorSearch = () => {
//   const [searchTerm, setSearchTerm] = useState('');

//   const [doctors, setDoctors] = useState({});
//   const [filteredDoctors, setFilteredDoctors] = useState(doctors);

//   const getDoctors = async()=>{
//       try {
//         const response = await fetch(
//           `http://localhost:8080/doctor/all`
//         );
//         const data = await response.json();
//         setDoctors(data);
//         // setIsLoading(false);
//         console.log(data);
//       } catch (error) {
//         console.error("Failed to fetch doctor data:", error);
//         // setIsLoading(false);
//       }

//   }

//   const handleSearchChange = (e) => {
//     const term = e.target.value;
//     setSearchTerm(term);
//     if (term === '') {
//       setFilteredDoctors(doctors);
//     } else {
//       const filtered = doctors.filter(doctor =>
//         doctor.doctorName.toLowerCase().includes(term.toLowerCase()) ||
//         doctor.email.toLowerCase().includes(term.toLowerCase()) ||
//         doctor.doctorId.toLowerCase().includes(term.toLowerCase())
//       );
//       setFilteredDoctors(filtered);
//     }
//   };

//   return (
//     <>
//    <PatientNavbar/>
//     <div className="min-h-[90vh] bg-gray-50">

//       <main className="max-w-[80vw] mx-auto py-6 sm:px-6 lg:px-8">
//         <div className="bg-white shadow overflow-hidden sm:rounded-lg">
//           <div className="px-4 py-5 sm:px-6">
//             <h3 className="text-2xl leading-6 font-medium text-gray-900">Find a doctor</h3>
//             <p className="mt-1 max-w-2xl text-sm text-gray-500">Find a doctor who meets your unique needs. Use our search tools to find the right doctor for you.</p>
//             <input
//               type="text"
//               placeholder="Search by name, specialty, or condition"
//               className="mt-4 py-2 px-4 w-full rounded border border-gray-300"
//               value={searchTerm}
//               onChange={handleSearchChange}
//               />
//           </div>
//           <div className="px-4 py-5 sm:px-6">
//             <h4 className="text-lg leading-6 font-medium text-gray-900">Popular specialties</h4>
//             <div className="mt-2 flex flex-row flex-wrap space-x-2">
//               {specialties.map((specialty, index) => (
//                 <span key={index} className="bg-[#AADCD2] text-gray-700 px-3 py-1 mb-2 rounded-full text-sm">{specialty}</span>
//               ))}
//             </div>
//           </div>
//           <div className="px-4 py-5 sm:px-6">
//             <h4 className="text-lg leading-6 font-medium text-gray-900">Popular insurance</h4>
//             <div className="mt-2 flex flex-wrap space-x-2">
//               {insurances.map((insurance, index) => (
//                 <span key={index} className="bg-[#AADCD2] text-gray-700 mb-2 px-3 py-1 rounded-full text-sm">{insurance}</span>
//               ))}
//             </div>
//           </div>
//           <div className="px-4 py-5 sm:px-6">
//             <h4 className="text-lg leading-6 font-medium text-gray-900">Available Doctors</h4>
//             <div className="mt-2">
//               {filteredDoctors.map((doctor, index) => (
//                 <div key={index} className="flex items-center justify-between py-2">
//                   <div className="flex items-center">
//                     <img src={image} alt={doctor.doctorName} className="h-10 w-10 rounded-full mr-4" />
//                     <div>
//                       <p className="text-lg font-medium text-gray-900">{doctor.doctorName}</p>
//                       <p className="text-base text-gray-500">{doctor.email}</p>
//                     </div>
//                   </div>
//                   <Link to ={`/BookAppoinment/${doctor.doctorId}`}>
//                   <button className="bg-[#AADCD2] text-gray-700 px-3 py-1 rounded-full text-sm">Book now</button>
//                   </Link>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//               </>
//   );
// };

// export default DoctorSearch;



import React, { useState, useEffect } from "react";
import image from "../../../images/image.jpg";
import { Link } from "react-router-dom";
import PatientNavbar from "../../../components/PatientNavbar";
import AdBanner from "../Adv"; // Assuming you have this component for displaying ads

const specialties = [
  "Primary Care Doctor",
  "OB-GYN",
  "Dermatologist",
  "Orthopedic Surgeon",
  "Cardiologist",
  "Psychiatrist",
];

const insurances = [
  "Blue Cross Blue Shield",
  "Aetna",
  "Cigna",
  "United Healthcare",
  "Medicare",
  "Humana",
];

const DoctorSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch(process.env.REACT_APP_BACKEND_URL+"/doctor/all");
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        
        if (!data || typeof data !== "object") {
          throw new Error("Invalid JSON response");
        }
  
        setDoctors(data);
        setFilteredDoctors(data); // Initialize filteredDoctors with all doctors
        console.log(data);
      } catch (error) {
        console.error("Failed to fetch doctor data:", error.message);
        setDoctors([]); // Optionally, clear the state or show an error message
        setFilteredDoctors([]);
      }
    };
    fetchDoctors();
  }, []);
  

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term === "") {
      setFilteredDoctors(doctors);
    } else {
      const filtered = doctors.filter(
        (doctor) =>
          doctor.doctorName.toLowerCase().includes(term.toLowerCase()) ||
          doctor.email.toLowerCase().includes(term.toLowerCase()) ||
          doctor.doctorId.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredDoctors(filtered);
    }
  };

  return (
    <>
      <PatientNavbar />
      <div className="flex min-h-[90vh] bg-gray-50">
        {/* Left Banner */}
        <div className="w-[15%] hidden lg:block">
          <AdBanner targetPage="doctorSearch-left" />
        </div>
        
        {/* Main Content */}
        <main className="flex-1 max-w-[70vw] mx-auto py-6 sm:px-6 lg:px-8">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-2xl leading-6 font-medium text-gray-900">
                Find a doctor
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Find a doctor who meets your unique needs. Use our search tools
                to find the right doctor for you.
              </p>
              <input
                type="text"
                placeholder="Search by name, specialty, or condition"
                className="mt-4 py-2 px-4 w-full rounded border border-gray-300"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <div className="px-4 py-5 sm:px-6">
              <h4 className="text-lg leading-6 font-medium text-gray-900">
                Popular specialties
              </h4>
              <div className="mt-2 flex flex-row flex-wrap space-x-2">
                {specialties.map((specialty, index) => (
                  <span
                    key={index}
                    className="bg-[#AADCD2] text-gray-700 px-3 py-1 mb-2 rounded-full text-sm"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
            <div className="px-4 py-5 sm:px-6">
              <h4 className="text-lg leading-6 font-medium text-gray-900">
                Popular insurance
              </h4>
              <div className="mt-2 flex flex-wrap space-x-2">
                {insurances.map((insurance, index) => (
                  <span
                    key={index}
                    className="bg-[#AADCD2] text-gray-700 mb-2 px-3 py-1 rounded-full text-sm"
                  >
                    {insurance}
                  </span>
                ))}
              </div>
            </div>
            <div className="px-4 py-5 sm:px-6">
              <h4 className="text-lg leading-6 font-medium text-gray-900">
                Available Doctors
              </h4>
              <div className="mt-2">
                {filteredDoctors.map((doctor, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2"
                  >
                    <div className="flex items-center">
                      <img
                        src={image}
                        alt={doctor.username}
                        className="h-10 w-10 rounded-full mr-4"
                      />
                      <div>
                        <p className="text-lg font-medium text-gray-900">
                          {doctor.username}
                        </p>
                        {doctor.doctorDetails ? (
                          <p className="text-base text-gray-500">
                            {doctor.doctorDetails.specialization ||
                              "Specialization not mentioned"}
                          </p>
                        ) : (
                          <p className="text-base text-gray-500">
                            Details not available
                          </p>
                        )}{" "}
                      </div>
                    </div>
                    <Link to={`/BookAppoinment/${doctor.userId}`}>
                      <button className="bg-[#AADCD2] text-gray-700 px-3 py-1 rounded-full text-sm">
                        Book now
                      </button>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>

        {/* Right Banner */}
        <div className="w-[15%] hidden lg:block">
          <AdBanner targetPage="doctorSearch-Right" />
        </div>
      </div>
    </>
  );
};

export default DoctorSearch;
