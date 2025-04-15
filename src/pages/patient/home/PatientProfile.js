import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import AppointmentsPage from "../../../components/appointment/Appointments";

const PatientProfile = () => {
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const { patientId } = useParams();
  const navigate = useNavigate();

  // Fetch patient data.
  // If patientId is passed, fetch that patient's details;
  // otherwise, fetch the current authenticated patient's details.
  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const url = patientId
          ? `${process.env.REACT_APP_BACKEND_URL}/patient/${patientId}`
          : `${process.env.REACT_APP_BACKEND_URL}/patient/me`;
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("Token")}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch patient details");
        }
        const data = await response.json();
        setPatient(data);
      } catch (error) {
        console.error("Error fetching patient:", error);
      }
    };
    fetchPatient();
  }, [patientId]);

  // Fetch appointments.
  // If patientId exists, use that to build the URL;
  // otherwise, fetch the current patient's appointments.
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        let url;
        if (patient) {
          // Use the provided patientId from the URL.
          url = `${process.env.REACT_APP_BACKEND_URL}/bookingAppointments/patient/${patient.id}`;
        } else {
          url = `${process.env.REACT_APP_BACKEND_URL}/bookingAppointments/patient/my-appointments`;
        }
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("Token")}`,
          },
        });
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
  }, [patient]);

  // If patient data or nested patientDetails is not yet available, show loading.
  if (!patient || !patient.patientDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Banner with Background Image */}
      <div
        className="relative w-full bg-cover bg-center h-64"
        style={{
          backgroundImage: `url("https://via.placeholder.com/1920x400")`,
        }}
      >
        <div className="relative max-w-7xl mx-auto px-4 h-full flex items-end pb-4">
          <div className="bg-white shadow-md rounded-lg p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4 w-full">
            <div className="relative">
              <img
                src={
                  patient.imageUrl ||
                  `https://picsum.photos/seed/${patient.id}/200/200`
                }
                alt="Patient"
                className="w-24 h-24 rounded-full object-cover border-2 border-green-400"
              />
            </div>
            <div>
              <h2 className="text-xl font-bold">{patient.username}</h2>
              <p className="text-sm text-gray-600 mt-1">
                {patient.patientDetails.gender} | Age:{" "}
                {patient.patientDetails.age}
              </p>
              <p className="text-sm text-gray-500">
                {patient.patientDetails.address},{" "}
                {patient.patientDetails.city} - {patient.patientDetails.pincode}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-8 px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left/Main Content */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">Patient Profile</h3>
            <p className="text-gray-700 leading-relaxed">
              Below are the profile details of{" "}
              <span className="font-bold">{patient.username}</span>.
            </p>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Contact Information Card */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h3 className="font-bold mb-3">Contact Information</h3>
            <hr className="my-2" />
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-semibold flex items-center gap-1">
                  <FaMapMarkerAlt className="text-green-600" />
                  Address:
                </span>
                <span>{patient.patientDetails.address}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold flex items-center gap-1">
                  <FaPhone className="text-green-600" />
                  Phone Number:
                </span>
                <span>{patient.phoneNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold flex items-center gap-1">
                  <FaEnvelope className="text-green-600" />
                  Email:
                </span>
                <span>{patient.email}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Render appointments with the fetched data */}
      <AppointmentsPage role="patient" appointments={appointments} defaultStatusFilter= "completed" />
    </div>
  );
};

export default PatientProfile;
