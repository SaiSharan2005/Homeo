import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";

const PatientAppointmentsPage = ({ defaultStatusFilter = "All" }) => {
  const [appointments, setAppointments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState(defaultStatusFilter);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await api.get(`/bookingAppointments/patient/my-appointments`);
        setAppointments(data);
      } catch (error) {
        console.error("Error fetching patient appointments:", error);
      }
    };

    fetchAppointments();
  }, []);

  // Format date to "dd mon yyyy"
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

  // Format time to "HH:MM" (dropping seconds)
  const formatTime = (timeString) => {
    return timeString ? timeString.substring(0, 5) : "";
  };

  // Filter appointments by doctor name and status
  const filteredAppointments = appointments.filter((appt) => {
    const doctorName = appt.doctor?.username || "";
    const status = appt.status || "";
    const matchesName = doctorName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "All" ||
      status.toLowerCase() === statusFilter.toLowerCase();
    return matchesName && matchesStatus;
  });

  const handleRowClick = (token) => {
    navigate(`/token/${token}`);
  };

  return (
    <div className="bg-white rounded-md shadow p-4 w-full mt-8">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-800">Your Appointments</h2>
        <p className="text-sm text-gray-500">
          Here are your recent and upcoming appointments with doctors.
        </p>
      </div>

      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative w-full sm:w-1/2">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
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
            placeholder="Search by doctor name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-1/6 p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="All">All Status</option>
          <option value="Completed">Completed</option>
          <option value="Upcoming">Upcoming</option>
          <option value="Cancel">Cancelled</option>
          <option value="Missed">Missed</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto text-left border-collapse">
          <thead>
            <tr className="text-gray-600 border-b">
              <th className="py-3 px-4 text-sm font-medium">Token</th>
              <th className="py-3 px-4 text-sm font-medium">Profile</th>
              <th className="py-3 px-4 text-sm font-medium">
                Specialization
              </th>
              <th className="py-3 px-4 text-sm font-medium">Date</th>
              <th className="py-3 px-4 text-sm font-medium">Time Slot</th>
              <th className="py-3 px-4 text-sm font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm">
            {filteredAppointments.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-4 px-4 text-center">
                  No appointments found.
                </td>
              </tr>
            ) : (
              filteredAppointments.map((appt) => {
                const { token, doctor, scheduleId, status } = appt;
                const startTime = formatTime(scheduleId?.startTime);
                const endTime = formatTime(scheduleId?.endTime);

                return (
                  <tr
                    key={token}
                    className="border-b hover:bg-gray-50 transition cursor-pointer"
                    onClick={() => handleRowClick(token)}
                  >
                    <td className="py-3 px-4">{token}</td>
                    <td className="py-3 px-4 flex items-center gap-2">
                      <img
                        src={
                          doctor?.imageUrl
                            ? doctor.imageUrl
                            : "https://ui-avatars.com/api/?name=" +
                              encodeURIComponent(doctor?.username || "Doctor")
                        }
                        alt="Doctor"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span>{doctor?.username}</span>
                    </td>
                    <td className="py-3 px-4">
                      {doctor?.doctorDetails?.specialization || "N/A"}
                    </td>
                    <td className="py-3 px-4">
                      {formatDate(scheduleId?.date)}
                    </td>
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
                            : status.toLowerCase() === "cancel"
                            ? "bg-red-100 text-red-700"
                            : status.toLowerCase() === "missed"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
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

export default PatientAppointmentsPage;

PatientAppointmentsPage.propTypes = {
  defaultStatusFilter: PropTypes.string,
};
