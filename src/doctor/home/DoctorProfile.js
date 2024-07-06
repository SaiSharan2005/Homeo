import React, { useEffect, useState } from "react";
import DoctorNavbar from "../../components/DoctorNavbar";
import { fetchDoctorById } from "../../utils/doctorService";

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
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const doctorId = localStorage.getItem("doctorId");
        const data = await fetchDoctorById(doctorId);
        setDoctor(data);
      } catch (error) {
        console.error("Error fetching doctor data:", error);
        // Handle error fetching data
      }
    };

    fetchDoctorData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/bookingAppointments/doctor/${localStorage.getItem("userId")}`
        );
        const data = await response.json();
        setAppointments(data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        // Handle error fetching data
      }
    };

    fetchData();
  }, []);

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  return (
    <>
      <DoctorNavbar />
      <div className="min-h-[90vh] flex flex-col bg-[#E3F9F5]">
        <main className="flex-1 bg-[#F7FAFC] p-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Doctor Details</h1>
          </div>
          <div className="mt-4 bg-white shadow-md rounded-lg p-6 relative">
            {doctor ? (
              <>
                <div className="flex items-center space-x-4">
                  <img
                    src="https://via.placeholder.com/150"
                    alt="Profile"
                    className="w-24 h-24 rounded-full"
                  />
                  <div>
                    <h2 className="text-xl font-bold">{doctor.doctorName}</h2>
                    <p className="text-gray-600">{doctor.doctorDetails.specialization}</p>
                    <p className="text-gray-500">{doctor.doctorDetails.experience} years of experience</p>
                    <p className="text-gray-500">{doctor.doctorDetails.address}, {doctor.doctorDetails.city}</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-col lg:flex-row gap-4">
                  <div className="flex-1 bg-[#F7FAFC] p-4 rounded-lg shadow-md relative">
                    <h3 className="flex justify-between items-center font-bold">
                      Contact Information
                      {!isEditing && <PencilIcon onClick={toggleEditMode} />}
                    </h3>
                    <hr className="my-2" />
                    {isEditing ? (
                      <div className="flex flex-col space-y-2">
                        <div className="flex justify-between">
                          <label htmlFor="clinic" className="font-semibold">
                            Clinic:
                          </label>
                          <input
                            type="text"
                            id="clinic"
                            name="clinic"
                            value={doctor.doctorDetails.address}
                            disabled
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
                            value={doctor.doctorDetails.specialization}
                            disabled
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
                            value={doctor.doctorDetails.experience}
                            disabled
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
                            value={doctor.phoneNumber}
                            disabled
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
                            value={doctor.email}
                            disabled
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
                            value={doctor.doctorDetails.address}
                            disabled
                            className="border-gray-300 border p-2 rounded-md w-2/3"
                          />
                        </div>
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={toggleEditMode}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md mt-4"
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col space-y-2">
                        <div className="flex justify-between">
                          <span className="font-semibold">Clinic:</span>
                          <span>{doctor.doctorDetails.address}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-semibold">Specialization:</span>
                          <span>{doctor.doctorDetails.specialization}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-semibold">Experience:</span>
                          <span>{doctor.doctorDetails.experience} years</span>
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
                          <span>
                            {doctor.doctorDetails.address}, {doctor.doctorDetails.city}
                          </span>
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
                      {appointments.length > 0 ? (
                        appointments.map((appointment) => (
                          <div key={appointment.bookingId}>
                            <h4 className="text-lg font-medium">
                              Appointment with {appointment.patientId.patientName}
                            </h4>
                            <p className="text-gray-500">Date: {appointment.scheduleId.date}</p>
                            <p className="text-gray-500">Time: {appointment.scheduleId.startTime} - {appointment.scheduleId.endTime}</p>
                          </div>
                        ))
                      ) : (
                        <p>No upcoming appointments</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-8 bg-white shadow-md rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4">Patient Reviews</h3>
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
                  </div>
                </div>
              </>
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default DoctorProfile;
