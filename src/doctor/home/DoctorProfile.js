
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DoctorNavbar from "../../components/DoctorNavbar";
import { fetchDoctorById } from "../../utils/doctorService";
// Assuming you have a constant or variable for doctor details
// const doctor = {
//   name: "Dr. John Doe",
//   specialization: "Cardiologist",
//   experience: "15+ years",
//   clinic: "HeartCare Clinic",
//   phoneNumber: "987-654-3210",
//   email: "john.doe@example.com",
//   address: "123 Cardiology Street, Cityville, State, Country",
// };

const PencilIcon = ({ onClick }) => (
  <svg
    className="w-6 h-6 text-gray-700 hover:text-[#228672] absolute top-2 right-2 cursor-pointer"
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

const DoctorProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedDoctor, setEditedDoctor] = useState({ ...doctor });
  const [doctor,setDoctor] = useState({});
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedDoctor({ ...editedDoctor, [name]: value });
  };

  useEffect(async()=>{
    const data =await fetchDoctorById(localStorage.getItem("doctorId"))

    setDoctor(data);
  },)
  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Implement logic to save editedDoctor data
    console.log("Updated Doctor Information:", editedDoctor);
    setIsEditing(false); // Exit edit mode
  };

  return (
    <>
    <DoctorNavbar/>
    <div className="min-h-[90vh] flex flex-col bg-[#E3F9F5]">
      <main className="flex-1 bg-[#F7FAFC] p-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Doctor Details</h1>
        </div>
        <div className="mt-4 bg-white shadow-md rounded-lg p-6 relative">
          <div className="flex items-center space-x-4">
            <img
              src="https://via.placeholder.com/150"
              alt="Profile"
              className="w-24 h-24 rounded-full"
              />
            <div>
              <h2 className="text-xl font-bold">{doctor.name}</h2>
              <p className="text-gray-600">{doctor.specialization}</p>
              <p className="text-gray-500">{doctor.experience} of experience</p>
              <p className="text-gray-500">{doctor.clinic}</p>
            </div>
          </div>
          <div className="mt-4 flex flex-col lg:flex-row gap-4">
            <div className="flex-1 bg-[#F7FAFC] p-4 rounded-lg shadow-md relative">
              <h3 className="flex justify-between items-center font-bold">
                Contact Information
                {!isEditing && (
                  <PencilIcon onClick={() => setIsEditing(true)} />
                )}
              </h3>
              <hr className="my-2" />
              {isEditing ? (
                <form onSubmit={handleFormSubmit}>
                  <div className="flex flex-col space-y-2">
                    <div className="flex justify-between">
                      <label htmlFor="clinic" className="font-semibold">
                        Clinic:
                      </label>
                      <input
                        type="text"
                        id="clinic"
                        name="clinic"
                        value={editedDoctor.clinic}
                        onChange={handleInputChange}
                        className="border-gray-300 border p-2 rounded-md w-2/3"
                        />
                    </div>
                    <div className="flex justify-between">
                      <label htmlFor="specialization" className="font-semibold">
                        Specialization:
                      </label>
                      <input
                        type="text"
                        id="specialization"
                        name="specialization"
                        value={editedDoctor.specialization}
                        onChange={handleInputChange}
                        className="border-gray-300 border p-2 rounded-md w-2/3"
                        />
                    </div>
                    <div className="flex justify-between">
                      <label htmlFor="experience" className="font-semibold">
                        Experience:
                      </label>
                      <input
                        type="text"
                        id="experience"
                        name="experience"
                        value={editedDoctor.experience}
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
                        value={editedDoctor.phoneNumber}
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
                        value={editedDoctor.email}
                        onChange={handleInputChange}
                        className="border-gray-300 border p-2 rounded-md w-2/3"
                        />
                    </div>
                    <div className="flex justify-between">
                      <label htmlFor="address" className="font-semibold">
                        Address:
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={editedDoctor.address}
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
                    <span className="font-semibold">Clinic:</span>
                    <span>{doctor.clinic}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Specialization:</span>
                    <span>{doctor.specialization}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Experience:</span>
                    <span>{doctor.experience}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Phone Number:</span>
                    <span>{doctor.phoneNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Email:</span>
                    <span>{doctor.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Address:</span>
                    <span>{doctor.address}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="flex-1 bg-[#F7FAFC] p-4 rounded-lg shadow-md relative">
              <h3 className="flex justify-between items-center font-bold">
                Upcoming Appointments
              </h3>
              <hr className="my-2" />
              <div className="flex flex-col space-y-4">
                {/* Example upcoming appointments */}
                <div>
                  <h4 className="text-lg font-medium">
                    Appointment with Mr. Smith
                  </h4>
                  <p className="text-gray-500">Date: July 1, 2024</p>
                  <p className="text-gray-500">Time: 10:00 AM</p>
                </div>
                <div>
                  <h4 className="text-lg font-medium">
                    Appointment with Mrs. Johnson
                  </h4>
                  <p className="text-gray-500">Date: July 5, 2024</p>
                  <p className="text-gray-500">Time: 2:30 PM</p>
                </div>
                {/* Add logic to fetch and display actual appointments */}
              </div>
            </div>
          </div>
          <div className="mt-8 bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">Patient Reviews</h3>
            {/* Example review cards */}
            <div className="space-y-4">
              <div className="bg-gray-100 rounded-lg p-4">
                <p className="text-gray-700">
                  "Dr. Doe is very knowledgeable and caring."
                </p>
                <p className="text-gray-500">- John Smith</p>
              </div>
              <div className="bg-gray-100 rounded-lg p-4">
                <p className="text-gray-700">
                  "Excellent service and treatment."
                </p>
                <p className="text-gray-500">- Emily Johnson</p>
              </div>
              {/* Add logic to fetch and display actual patient reviews */}
            </div>
          </div>
          {/* Add any other sections or components specific to doctor profile */}
        </div>
      </main>
    </div>
              </>
  );
};

export default DoctorProfile;
