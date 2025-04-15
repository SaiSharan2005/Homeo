import React, { useState, useEffect } from "react";
import image from "../../../images/image.jpg";
import { Link } from "react-router-dom";
import AdBanner from "../Adv"; // If still needed

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
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/doctor/availableDoctors`);
        const data = await response.json();
        setDoctors(data);
        setFilteredDoctors(data);
      } catch (error) {
        console.error("Failed to fetch doctor data:", error.message);
        setDoctors([]);
        setFilteredDoctors([]);
      }
    };
    fetchDoctors();
  }, []);

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setFilteredDoctors(
      term === ""
        ? doctors
        : doctors.filter(
            (doctor) =>
              doctor.username?.toLowerCase().includes(term.toLowerCase()) ||
              doctor.email?.toLowerCase().includes(term.toLowerCase()) ||
              doctor.doctorId?.toLowerCase().includes(term.toLowerCase())
          )
    );
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
        <h3 className="text-2xl font-medium text-gray-900 mb-2">Find a doctor</h3>
        <p className="text-sm text-gray-500 mb-4">
          Use the search box or explore by specialty or insurance to find a doctor that suits your needs.
        </p>
        <input
          type="text"
          placeholder="Search by name, specialty, or condition"
          className="py-2 px-4 w-full mb-6 rounded border border-gray-300"
          value={searchTerm}
          onChange={handleSearchChange}
        />

        <div className="mb-6">
          <h4 className="text-lg font-medium text-gray-900 mb-2">Popular specialties</h4>
          <div className="flex flex-wrap gap-2">
            {specialties.map((specialty, index) => (
              <span key={index} className="bg-[#AADCD2] text-gray-700 px-3 py-1 rounded-full text-sm">
                {specialty}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h4 className="text-lg font-medium text-gray-900 mb-2">Popular insurance</h4>
          <div className="flex flex-wrap gap-2">
            {insurances.map((insurance, index) => (
              <span key={index} className="bg-[#AADCD2] text-gray-700 px-3 py-1 rounded-full text-sm">
                {insurance}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">Available Doctors</h4>
          <div>
            {filteredDoctors.map((doctor, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b">
                <div className="flex items-center">
                  <img src={image} alt={doctor.username} className="h-10 w-10 rounded-full mr-4" />
                  <div>
                    <p className="text-lg font-medium text-gray-900">{doctor.username}</p>
                    <p className="text-sm text-gray-500">
                      {doctor.doctorDetails?.specialization || "Specialization not mentioned"}
                    </p>
                  </div>
                </div>
                <Link to={`/patient/BookAppoinment/${doctor.id}`}>
                  <button className="bg-[#AADCD2] text-gray-700 px-4 py-1 rounded-full text-sm hover:bg-[#93ccc2]">
                    Book now
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorSearch;
