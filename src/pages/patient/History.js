import React, { useEffect, useState } from "react";
import profile1 from "../../images/doctorPatient.jpg";
import PatientNavbar from "../../components/PatientNavbar";
import { useNavigate } from "react-router-dom";
import AdBanner from "./Adv";

export default function PatientHistory() {
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState("all"); // State for the active tab
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL +
          `/bookingAppointments/patient/${localStorage.getItem("userId")}`
      );
      const data = await response.json();
      setAppointments(data);
    };
    fetchData();
  }, []);

  // Filter appointments based on the active tab
  const filteredAppointments = appointments.filter((appointment) => {
    if (activeTab === "all") return true;
    if (activeTab === "upcoming") return appointment.status === "upcoming";
    if (activeTab === "completed") return appointment.status === "completed";
    if (activeTab === "canceled")
      return appointment.status === "cancel" || appointment.status === "missed";
    return false;
  });

  // Sort the filtered appointments by date and time
  const sortedAppointments = filteredAppointments.sort((a, b) => {
    const dateA = new Date(`${a.scheduleId.date}T${a.scheduleId.startTime}`);
    const dateB = new Date(`${b.scheduleId.date}T${b.scheduleId.startTime}`);
    return dateA - dateB;
  });

  // Helper function to determine status color
  const getStatusColor = (status) => {
    switch (status) {
      case "upcoming":
        return "text-blue-600";
      case "cancel":
      case "missed":
        return "text-red-600";
      case "completed":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PatientNavbar />
      <div className="flex w-full justify-between">
        {/* Left Banner */}
        <div className="w-[15%] hidden lg:block">
          <AdBanner targetPage="history-left" />
        </div>

        {/* Main Content */}
        <div className="w-full lg:w-[60%] mt-8 p-4">
          {/* Tabs for filtering */}
          <div className="flex space-x-4 mb-8 justify-center">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 rounded ${
                activeTab === "all"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`px-4 py-2 rounded ${
                activeTab === "upcoming"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setActiveTab("completed")}
              className={`px-4 py-2 rounded ${
                activeTab === "completed"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => setActiveTab("canceled")}
              className={`px-4 py-2 rounded ${
                activeTab === "canceled"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              Canceled
            </button>
          </div>

          {/* Display sorted appointments */}
          <div>
            <h1 className="text-2xl font-bold mb-6 text-center">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}{" "}
              Appointments
            </h1>
            <ul>
              {sortedAppointments.length === 0 && (
                <p className="text-gray-600 text-center">
                  No appointments for this category.
                </p>
              )}
              {sortedAppointments.map((appointment) => (
                <li
                  key={appointment.id}
                  onClick={() => navigate(`/token/${appointment?.token}`)}
                  className="flex items-center justify-between mb-4 cursor-pointer bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition"
                >
                  <div className="flex items-center">
                    <img
                      className="h-12 w-12 rounded-full object-cover mr-4"
                      src={profile1}
                      alt={appointment?.doctorId?.doctorName}
                    />
                    <div>
                      <h2 className="text-lg font-semibold">
                        {appointment?.doctorId?.doctorName}
                      </h2>
                      <p className="text-gray-600">
                        {appointment?.doctorId?.doctorDetails?.specialization}
                      </p>
                      <p className="text-gray-600">{appointment?.token}</p>
                    </div>
                  </div>
                  <div className="text-gray-600">
                    {appointment?.scheduleId?.date}{" "}
                    {appointment?.scheduleId?.startTime}
                  </div>
                  <div
                    className={`${getStatusColor(appointment.status)} font-bold`}
                  >
                    {appointment.status.charAt(0).toUpperCase() +
                      appointment.status.slice(1)}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Banner */}
        <div className="w-[15%] hidden lg:block">
          <AdBanner targetPage="history-right" />
        </div>
      </div>
    </div>
  );
}
