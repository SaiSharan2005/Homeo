import React, { useState } from "react";
import { Link } from "react-router-dom";

const patient = {
  name: "Megan Santos",
  dateOfBirth: "02-21-1965",
  gender: "Female",
  address: "820 Oral Lake Road, Sacramento, California, United States",
  phoneNumber: "123-456-7890",
  email: "megan.santos@example.com",
  medicalHistory: "General checkups, dental cleaning",
  activeStatus: "Active",
};

const PencilIcon = ({ onClick }) => (
  <svg
    className="w-6 h-6 text-gray-700 hover:text-[#228672] cursor-pointer"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    onClick={onClick}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M15 3l6 6-9 9-6-6 9-9zm-6 6l-2 5 5-2 9-9-3-3-9 9z"
    ></path>
  </svg>
);

const UpcomingAppointment = () => (
  <div className="mt-6">
    <h3 className="text-lg font-semibold mb-3">Upcoming Appointments</h3>
    <div className="flex items-center space-x-4 mb-3">
      <div>
        <p className="text-gray-600">Monday, June 30, 2024</p>
        <p className="text-lg font-semibold">10:00 AM - General Checkup</p>
        <p className="text-gray-500">Dr. Smith</p>
      </div>
    </div>
    <div className="flex items-center space-x-4">
      <div>
        <p className="text-gray-600">Wednesday, July 2, 2024</p>
        <p className="text-lg font-semibold">2:30 PM - Dental Cleaning</p>
        <p className="text-gray-500">Dr. Johnson</p>
      </div>
    </div>
  </div>
);

const PatientProfile = () => {
  const [isEditingGeneral, setIsEditingGeneral] = useState(false);
  const [isEditingContact, setIsEditingContact] = useState(false);

  const [editedPatient, setEditedPatient] = useState({ ...patient });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedPatient({ ...editedPatient, [name]: value });
  };

  const handleGeneralFormSubmit = (e) => {
    e.preventDefault();
    console.log("Updated General Information:", {
      name: editedPatient.name,
      gender: editedPatient.gender,
      dateOfBirth: editedPatient.dateOfBirth,
    });
    setIsEditingGeneral(false);
  };

  const handleContactFormSubmit = (e) => {
    e.preventDefault();
    console.log("Updated Contact Information:", {
      address: editedPatient.address,
      phoneNumber: editedPatient.phoneNumber,
      email: editedPatient.email,
    });
    setIsEditingContact(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#E3F9F5]">
      <main className="flex-1 bg-[#F7FAFC] p-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Patient Details</h1>
        </div>
        <div className="mt-4 bg-white shadow-md rounded-lg p-6 relative">
          <div className="flex items-center space-x-4">
            <img
              src="https://via.placeholder.com/150"
              alt="Profile"
              className="w-24 h-24 rounded-full"
            />
            <div>
              <h2 className="text-xl font-bold">{patient.name}</h2>
              <p className="text-gray-600">
                {patient.gender} | {patient.dateOfBirth}
              </p>
              <p className="text-green-600">{patient.activeStatus}</p>
            </div>
          </div>
          <div className="mt-4 flex flex-col lg:flex-row gap-4">
            <div className="flex-1 bg-[#F7FAFC] p-4 rounded-lg shadow-md relative">
              <h3 className="flex justify-between items-center font-bold">
                General Information
                <PencilIcon onClick={() => setIsEditingGeneral(true)} />
              </h3>
              <hr className="my-2" />
              {isEditingGeneral ? (
                <form onSubmit={handleGeneralFormSubmit}>
                  <div className="flex flex-col space-y-2">
                    <div className="flex justify-between">
                      <label htmlFor="name" className="font-semibold">
                        Name:
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={editedPatient.name}
                        onChange={handleInputChange}
                        className="border-gray-300 border p-2 rounded-md w-2/3"
                      />
                    </div>
                    <div className="flex justify-between">
                      <label htmlFor="gender" className="font-semibold">
                        Gender:
                      </label>
                      <input
                        type="text"
                        id="gender"
                        name="gender"
                        value={editedPatient.gender}
                        onChange={handleInputChange}
                        className="border-gray-300 border p-2 rounded-md w-2/3"
                      />
                    </div>
                    <div className="flex justify-between">
                      <label htmlFor="dateOfBirth" className="font-semibold">
                        Date of Birth:
                      </label>
                      <input
                        type="text"
                        id="dateOfBirth"
                        name="dateOfBirth"
                        value={editedPatient.dateOfBirth}
                        onChange={handleInputChange}
                        className="border-gray-300 border p-2 rounded-md w-2/3"
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md mt-4"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="flex flex-col space-y-2">
                  <div className="flex justify-between">
                    <span className="font-semibold">Name:</span>
                    <span>{patient.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Gender:</span>
                    <span>{patient.gender}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Date of Birth:</span>
                    <span>{patient.dateOfBirth}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="flex-1 bg-[#F7FAFC] p-4 rounded-lg shadow-md relative">
              <h3 className="flex justify-between items-center font-bold">
                Contact Information
                <PencilIcon onClick={() => setIsEditingContact(true)} />
              </h3>
              <hr className="my-2" />
              {isEditingContact ? (
                <form onSubmit={handleContactFormSubmit}>
                  <div className="flex flex-col space-y-2">
                    <div className="flex justify-between">
                      <label htmlFor="address" className="font-semibold">
                        Address:
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={editedPatient.address}
                        onChange={handleInputChange}
                        className="border-gray-300 border p-2 rounded-md w-2/3"
                      />
                    </div>
                    <div className="flex justify-between">
                      <label htmlFor="phoneNumber" className="font-semibold">
                        Phone Number:
                      </label>
                      <input
                        type="text"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={editedPatient.phoneNumber}
                        onChange={handleInputChange}
                        className="border-gray-300 border p-2 rounded-md w-2/3"
                      />
                    </div>
                    <div className="flex justify-between">
                      <label htmlFor="email" className="font-semibold">
                        Email:
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={editedPatient.email}
                        onChange={handleInputChange}
                        className="border-gray-300 border p-2 rounded-md w-2/3"
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md mt-4"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="flex flex-col space-y-2">
                  <div className="flex justify-between">
                    <span className="font-semibold">Address:</span>
                    <span>{patient.address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Phone Number:</span>
                    <span>{patient.phoneNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Email:</span>
                    <span>{patient.email}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          <UpcomingAppointment />
        </div>
      </main>
    </div>
  );
};

export default PatientProfile;