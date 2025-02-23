import React, { useState, useEffect } from "react";

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

// Component to display fetched appointment data in a card layout.
const PatientAppointments = ({ appointments }) => {
  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold mb-4">Upcoming Appointments</h3>
      {appointments.length === 0 ? (
        <p className="text-gray-600">No upcoming appointments.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {appointments.map((appointment) => (
            <div
              key={appointment.bookingId}
              className="bg-white shadow-lg rounded-lg p-4 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="mb-3">
                <p className="text-gray-500 text-sm">
                  {new Date(appointment.appointmenDate).toLocaleDateString()}
                </p>
                <h4 className="text-xl font-semibold">
                  {appointment.scheduleId && appointment.scheduleId.startTime
                    ? appointment.scheduleId.startTime
                    : "Time N/A"}
                  {" - "}
                  {appointment.scheduleId && appointment.scheduleId.endTime
                    ? appointment.scheduleId.endTime
                    : "Time N/A"}
                </h4>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center mr-3">
                  <span className="text-xl text-gray-500">
                    {appointment.doctor.username.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-gray-800 font-medium">
                    {appointment.doctor.username}
                  </p>
                  <p className="text-gray-500 text-sm">{appointment.status}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const PatientProfile = () => {
  const [patient, setPatient] = useState(null);
  const [editedPatient, setEditedPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [isEditingGeneral, setIsEditingGeneral] = useState(false);
  const [isEditingContact, setIsEditingContact] = useState(false);

  // Fetch patient data
  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await fetch(
          process.env.REACT_APP_BACKEND_URL + "/patient/me",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("Token")}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch patient details");
        }
        const data = await response.json();
        setPatient(data);
        setEditedPatient(data);
      } catch (error) {
        console.error("Error fetching patient:", error);
      }
    };
    fetchPatient();
  }, []);

  // Fetch appointment data for the authenticated patient
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch(
          process.env.REACT_APP_BACKEND_URL +
            "/bookingAppointments/patient/my-appointments",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("Token")}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch appointments");
        }
        const data = await response.json();
        setAppointments(data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };
    fetchAppointments();
  }, []);

  // Handle input changes for editing profile info (supports nested patientDetails)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("patientDetails.")) {
      const key = name.split(".")[1];
      setEditedPatient({
        ...editedPatient,
        patientDetails: {
          ...editedPatient.patientDetails,
          [key]: value,
        },
      });
    } else {
      setEditedPatient({
        ...editedPatient,
        [name]: value,
      });
    }
  };

  // Submit updated general information (username, gender, age)
  const handleGeneralFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "/patient/updateMyProfile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("Token")}`,
          },
          body: JSON.stringify({
            username: editedPatient.username,
            gender: editedPatient.patientDetails.gender,
            age: editedPatient.patientDetails.age,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update general information");
      }
      const updatedData = await response.json();
      setPatient(updatedData);
      setEditedPatient(updatedData);
      setIsEditingGeneral(false);
    } catch (error) {
      console.error("Error updating general info:", error);
    }
  };

  // Submit updated contact information (address, phoneNumber, email)
  const handleContactFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "/patient/updateMyProfile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("Token")}`,
          },
          body: JSON.stringify({
            address: editedPatient.patientDetails.address,
            phoneNumber: editedPatient.phoneNumber,
            email: editedPatient.email,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update contact information");
      }
      const updatedData = await response.json();
      setPatient(updatedData);
      setEditedPatient(updatedData);
      setIsEditingContact(false);
    } catch (error) {
      console.error("Error updating contact info:", error);
    }
  };

  if (!patient || !editedPatient) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#E3F9F5]">
      <main className="flex-1 bg-[#F7FAFC] p-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Patient Details</h1>
        </div>
        <div className="mt-6 bg-white shadow-lg rounded-lg p-6">
          {/* Profile Header */}
          <div className="flex items-center space-x-4">
            <img
              src="https://via.placeholder.com/150"
              // alt="Profile"
              className="w-24 h-24 rounded-full"
            />
            <div>
              <h2 className="text-2xl font-bold">{patient.username}</h2>
              <p className="text-gray-600">
                {patient.patientDetails.gender} | Age:{" "}
                {patient.patientDetails.age}
              </p>
            </div>
          </div>

          {/* Profile Edit Sections */}
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {/* General Information Section */}
            <div className="bg-gray-50 p-4 rounded-lg shadow">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-bold">General Information</h3>
                <PencilIcon onClick={() => setIsEditingGeneral(true)} />
              </div>
              {isEditingGeneral ? (
                <form onSubmit={handleGeneralFormSubmit}>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <label htmlFor="username" className="font-semibold">
                        Name:
                      </label>
                      <input
                        type="text"
                        id="username"
                        name="username"
                        value={editedPatient.username || ""}
                        onChange={handleInputChange}
                        className="border rounded-md p-2 w-2/3"
                      />
                    </div>
                    <div className="flex justify-between">
                      <label htmlFor="gender" className="font-semibold">
                        Gender:
                      </label>
                      <input
                        type="text"
                        id="gender"
                        name="patientDetails.gender"
                        value={editedPatient.patientDetails.gender || ""}
                        onChange={handleInputChange}
                        className="border rounded-md p-2 w-2/3"
                      />
                    </div>
                    <div className="flex justify-between">
                      <label htmlFor="age" className="font-semibold">
                        Age:
                      </label>
                      <input
                        type="number"
                        id="age"
                        name="patientDetails.age"
                        value={editedPatient.patientDetails.age || ""}
                        onChange={handleInputChange}
                        className="border rounded-md p-2 w-2/3"
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="space-y-2">
                  <p>
                    <span className="font-semibold">Name:</span> {patient.username}
                  </p>
                  <p>
                    <span className="font-semibold">Gender:</span> {patient.patientDetails.gender}
                  </p>
                  <p>
                    <span className="font-semibold">Age:</span> {patient.patientDetails.age}
                  </p>
                </div>
              )}
            </div>

            {/* Contact Information Section */}
            <div className="bg-gray-50 p-4 rounded-lg shadow">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-bold">Contact Information</h3>
                <PencilIcon onClick={() => setIsEditingContact(true)} />
              </div>
              {isEditingContact ? (
                <form onSubmit={handleContactFormSubmit}>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <label htmlFor="address" className="font-semibold">
                        Address:
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="patientDetails.address"
                        value={editedPatient.patientDetails.address || ""}
                        onChange={handleInputChange}
                        className="border rounded-md p-2 w-2/3"
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
                        value={editedPatient.phoneNumber || ""}
                        onChange={handleInputChange}
                        className="border rounded-md p-2 w-2/3"
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
                        value={editedPatient.email || ""}
                        onChange={handleInputChange}
                        className="border rounded-md p-2 w-2/3"
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="space-y-2">
                  <p>
                    <span className="font-semibold">Address:</span>{" "}
                    {patient.patientDetails.address}
                  </p>
                  <p>
                    <span className="font-semibold">Phone Number:</span>{" "}
                    {patient.phoneNumber}
                  </p>
                  <p>
                    <span className="font-semibold">Email:</span> {patient.email}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Render fetched appointment data */}
          <PatientAppointments appointments={appointments} />
        </div>
      </main>
    </div>
  );
};

export default PatientProfile;
