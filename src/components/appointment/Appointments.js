import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchDoctorAppointments } from "../../services/doctor/doctor_api"; 
// Adjust the import path if needed

const DoctorAppointmentsPage = ({ defaultStatusFilter = "All" }) => {
  const [appointments, setAppointments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState(defaultStatusFilter);
  const navigate = useNavigate();

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const data = await fetchDoctorAppointments();
        setAppointments(data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    loadAppointments();
  }, []);

  // Helper function to display patient profile image or a placeholder
  const renderPatientProfile = (patient) => {
    if (patient?.imageUrl) {
      return (
        <img
          src={patient.imageUrl}
          alt={patient.username}
          className="w-8 h-8 rounded-full object-cover mr-2"
        />
      );
    }
    // If no imageUrl exists, display a placeholder with the first letter of the username
    return (
      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold text-gray-700 mr-2">
        {patient?.username ? patient.username.charAt(0).toUpperCase() : "?"}
      </div>
    );
  };

  // Helper function to format appointment date in "01 jan 2005" format
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const monthAbbr = date
      .toLocaleString("default", { month: "short" })
      .toLowerCase();
    const year = date.getFullYear();
    return `${day} ${monthAbbr} ${year}`;
  };

  // Filter appointments based on search query (by patient name) and status filter
  const filteredAppointments = appointments.filter((appt) => {
    const patientName = appt.patient?.username || "";
    const status = appt.status || "";
    const matchesName = patientName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "All" ||
      status.toLowerCase() === statusFilter.toLowerCase();
    return matchesName && matchesStatus;
  });

  // Function to format time strings to hour:min (removing seconds)
  const formatTime = (timeString) => {
    return timeString ? timeString.substring(0, 5) : "";
  };

  // Handle row click to navigate to the appointment detail page
  const handleRowClick = (token) => {
    navigate(`/doctor/token/${token}`);
  };

  return (
    <div className="bg-white rounded-md shadow p-4 w-full">
      {/* Page Heading */}
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-800">Appointments List</h2>
        <p className="text-sm text-gray-500">
          Here are all your recent and upcoming appointments.
        </p>
      </div>

      {/* Search and Status Filter */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative w-full sm:w-1/2">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 17.5a7.5 7.5 0 006.15-3.85z"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search by patient name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-1/6 p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="All">All Status</option>
          <option value="Completed">Completed</option>
          <option value="Upcoming">Upcoming</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Missed">Missed</option>
        </select>
      </div>

      {/* Appointments Table */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto text-left border-collapse">
          <thead>
            <tr className="text-gray-600 border-b">
              <th className="py-3 px-4 text-sm font-medium">Token</th>
              <th className="py-3 px-4 text-sm font-medium">Patient Name</th>
              <th className="py-3 px-4 text-sm font-medium">Patient Email</th>
              <th className="py-3 px-4 text-sm font-medium">Phone</th>
              <th className="py-3 px-4 text-sm font-medium">Date</th>
              <th className="py-3 px-4 text-sm font-medium">Time Slot</th>
              <th className="py-3 px-4 text-sm font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm">
            {filteredAppointments.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-4 px-4 text-center">
                  No appointments found.
                </td>
              </tr>
            ) : (
              filteredAppointments.map((appt) => {
                const { token, patient, appointmenDate, status, scheduleId } = appt;
                const startTime = formatTime(scheduleId?.startTime);
                const endTime = formatTime(scheduleId?.endTime);

                return (
                  <tr
                    key={token}
                    className="border-b hover:bg-gray-50 transition cursor-pointer"
                    onClick={() => handleRowClick(token)}
                  >
                    <td className="py-3 px-4">{token}</td>
                    <td className="py-3 px-4 flex items-center">
                      {renderPatientProfile(patient)}
                      <span>{patient?.username}</span>
                    </td>
                    <td className="py-3 px-4">{patient?.email}</td>
                    <td className="py-3 px-4">{patient?.phoneNumber}</td>
                    <td className="py-3 px-4">{formatDate(appointmenDate)}</td>
                    <td className="py-3 px-4">
                      {startTime} - {endTime}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          status.toLowerCase() === "completed"
                            ? "bg-green-100 text-green-700"
                            : status.toLowerCase() === "upcoming"
                            ? "bg-blue-100 text-blue-700"
                            : status.toLowerCase() === "cancelled"
                            ? "bg-red-100 text-red-700"
                            : status.toLowerCase() === "missed"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {status}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DoctorAppointmentsPage;
