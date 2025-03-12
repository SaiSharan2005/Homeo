import React, { useEffect, useState } from "react";
import DoctorNavbar from "../../../components/navbar/DoctorNavbar";
import { fetchDoctorById } from "../../../utils/doctorService";

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
  const [doctorDetails, setDoctorDetails] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const doctor = await fetch(
          process.env.REACT_APP_BACKEND_URL + `/doctor/me`,
          {
            method: "GET", // Specify the method explicitly
            headers: {
              "Content-Type": "application/json", // Ensures the backend knows the data format
              Authorization: `Bearer ${localStorage.getItem("Token")}`, // Retrieve token from local storage
            },
          }
        );        
        const res =await doctor.json()
        console.log(res)
        setDoctor(res);
        setDoctorDetails(res.doctorDetails || {});
      } catch (error) {
        console.error("Error fetching doctor data:", error);
      }
    };

    fetchDoctorData();
  }, []);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch(
          process.env.REACT_APP_BACKEND_URL+`/bookingAppointments/doctor/my-appointments`,
          {
            method: "GET", // Specify the method explicitly
            headers: {
              "Content-Type": "application/json", // Ensures the backend knows the data format
              Authorization: `Bearer ${localStorage.getItem("Token")}`, // Retrieve token from local storage
            },
          }
        );
        const data = await response.json();
        setAppointments(data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, []);

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDoctorDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSave = () => {
    // Logic to save changes
    setIsEditing(false);
  };

  if (!doctor) return <p>Loading...</p>;

  return (
    <>
      <DoctorNavbar />
      <div className="min-h-[90vh] flex flex-col bg-[#E3F9F5]">
        <main className="flex-1 bg-[#F7FAFC] p-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Doctor Details</h1>
          </div>
          <div className="mt-4 bg-white shadow-md rounded-lg p-6 relative">
            <div className="flex items-center space-x-4">
              <img
                src= {`https://picsum.photos/seed/${doctor.id}/200/200`}
                alt="Profile"
                className="w-24 h-24 rounded-full"
              />
              <div>
                {/* {JSON.stringify(doctorDetails)} */}
                <h2 className="text-xl font-bold">{doctor.username}</h2>
                <p className="text-gray-600">
                  {doctorDetails.specialization}
                </p>
                <p className="text-gray-500">
                  {doctorDetails.experience} years of experience
                </p>
                <p className="text-gray-500">
                  {doctorDetails.address}, {doctorDetails.city}
                </p>
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
                      <label htmlFor="address" className="font-semibold">
                        Address:
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={doctorDetails.address || ""}
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
                        value={doctorDetails.specialization || ""}
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
                        value={doctorDetails.experience || ""}
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
                        value={doctor.phoneNumber || ""}
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
                        value={doctor.email || ""}
                        onChange={handleInputChange}
                        className="border-gray-300 border p-2 rounded-md w-2/3"
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={handleSave}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md mt-4"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <div className="flex justify-between">
                      <span className="font-semibold">Address:</span>
                      <span>{doctorDetails.address}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Specialization:</span>
                      <span>{doctorDetails.specialization}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Experience:</span>
                      <span>{doctorDetails.experience} years</span>
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
                        {doctorDetails.address}, {doctorDetails.city}
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
                          Appointment with {appointment.patient.username}
                        </h4>
                        <p className="text-gray-500">
                          Date: {appointment.scheduleId.date}
                        </p>
                        <p className="text-gray-500">
                          Time: {appointment.scheduleId.startTime} -{" "}
                          {appointment.scheduleId.endTime}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p>No upcoming appointments.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default DoctorProfile;
