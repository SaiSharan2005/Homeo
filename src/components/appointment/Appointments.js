import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchDoctorAppointments } from "../../services/doctor/doctor_api";
import AdBanner from "./Adv";

const AppointmentsPage = ({
  role,
  defaultStatusFilter = "All",
  appointments: appointmentsProp,
}) => {
//   const [page, setPage] = useState(0);
// const size = 10;
// const [totalPages, setTotalPages] = useState(0);

  const [appointments, setAppointments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState(defaultStatusFilter);
  const [page, setPage] = useState(0);
  const size = 10;
  const [totalPages, setTotalPages] = useState(0);

  const [hasAd, setHasAd] = useState(false); // ← NEW
  const navigate = useNavigate();

  // Function to fetch appointments based on role
  const loadAppointments = async () => {
    try {
      // let data;
      // if (role === "doctor") {
      //   data = await fetchDoctorAppointments();
      let data, json;
      if (role === "doctor") {
        const resp = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/bookingAppointments/doctor/my-appointments?page=${page}&size=${size}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("Token")}`,
            },
          }
        );
        json = await resp.json();
      } else if (role === "patient") {
               const response = await fetch(
                `${process.env.REACT_APP_BACKEND_URL}/bookingAppointments/patient/my-appointments?page=${page}&size=${size}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("Token")}`,
            },
          }
        );
        // data = await response.json();
        json = await response.json();

      } else if (role === "admin") {
        // Define your admin endpoint or fetching logic here
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/bookingAppointments?page=${page}&size=${size}`,
          
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("Token")}`,
            },
          }
        );
        json = await response.json();
      }
      // setAppointments(data);
           setAppointments(json.content);
      setTotalPages(json.totalPages);

    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  // Single useEffect to use passed-in data or fetch it if not provided.
  useEffect(() => {
    if (appointmentsProp && appointmentsProp.length > 0) {
      setAppointments(appointmentsProp);
    } else {
      loadAppointments();
      console.log(appointmentsProp);
    }}, [role, appointmentsProp, page]);
  // Helper to format date as "dd mon yyyy"
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

  // Helper to format time by removing seconds
  const formatTime = (timeString) =>
    timeString ? timeString.substring(0, 5) : "";

  // Define filtered appointments based on search and status filters
  const filteredAppointments = appointments.filter((appt) => {
    let searchField = "";
    const status = appt.status || "";

    // Determine the search field based on role
    if (role === "doctor") {
      searchField = appt.patient?.username || "";
    } else if (role === "patient") {
      searchField = appt.doctor?.username || "";
    } else if (role === "admin") {
      searchField = `${appt.doctor?.username || ""} ${
        appt.patient?.username || ""
      }`;
    }
    const matchesName = searchField
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "All" ||
      status.toLowerCase() === statusFilter.toLowerCase();
    return matchesName && matchesStatus;
  });

  // Row click navigation, update routes based on role if necessary
  const handleRowClick = (token) => {
    if (role === "doctor") {
      navigate(`token/${token}`);
    } else if (role === "patient") {
      navigate(`token/${token}`);
    } else if (role === "admin") {
      // Admin row click directs to update page
      navigate(`token/${token}`);
    } else if (role === "staff") {
      // Admin row click directs to update page
      navigate(`token/${token}`);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this appointment?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/bookingAppointments/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("Token")}`,
          },
        }
      );

      if (response.status === 204) {
        setAppointments((prev) => prev.filter((appt) => appt.id !== id));
      } else {
        alert("Failed to delete appointment.");
      }
    } catch (error) {
      console.error("Error deleting appointment:", error);
      alert("An error occurred while deleting.");
    }
  };

  // Render profile image or placeholder based on role (doctor or patient)
  const renderProfile = (user, defaultLabel) => {
    if (user?.imageUrl) {
      return (
        <img
          src={user.imageUrl}
          alt={user.username || defaultLabel}
          className="w-8 h-8 rounded-full object-cover mr-2"
        />
      );
    }
    return (
      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold text-gray-700 mr-2">
        {user?.username ? user.username.charAt(0).toUpperCase() : "?"}
      </div>
    );
  };
  const useFlexLayout = role === "patient" && hasAd;

  return (
    <div>
      <div className="flex w-full">
        {/* main table area */}
        <div className="flex-1 bg-white rounded-md shadow p-4">
          {" "}
          {/* Heading with Create Appointment Button for Admin */}
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                {role === "doctor" && "Appointments List"}
                {role === "patient" && "Your Appointments"}
                {role === "admin" && "All Appointments"}
              </h2>
              <p className="text-sm text-gray-500">
                {role === "doctor" &&
                  "Here are all your recent and upcoming appointments."}
                {role === "patient" &&
                  "Here are your recent and upcoming appointments with doctors."}
                {role === "admin" && "Manage all appointments in the system."}
              </p>
            </div>
            {role === "admin" && (
              <button
                onClick={() => navigate("create")}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                Create Appointment
              </button>
            )}
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
                placeholder={
                  role === "doctor"
                    ? "Search by patient name..."
                    : "Search by doctor name..."
                }
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
                  {role === "doctor" && (
                    <>
                      <th className="py-3 px-4 text-sm font-medium">
                        Patient Name
                      </th>
                      <th className="py-3 px-4 text-sm font-medium">
                        Patient Email
                      </th>
                      <th className="py-3 px-4 text-sm font-medium">Phone</th>
                    </>
                  )}
                  {role === "patient" && (
                    <>
                      <th className="py-3 px-4 text-sm font-medium">Profile</th>
                      <th className="py-3 px-4 text-sm font-medium">
                        Specialization
                      </th>
                    </>
                  )}
                  {role === "admin" && (
                    <>
                      <th className="py-3 px-4 text-sm font-medium">Patient</th>
                      <th className="py-3 px-4 text-sm font-medium">Doctor</th>
                    </>
                  )}
                  <th className="py-3 px-4 text-sm font-medium">Date</th>
                  <th className="py-3 px-4 text-sm font-medium">Time Slot</th>
                  <th className="py-3 px-4 text-sm font-medium">Status</th>
                  {(role === "admin" || role === "staff") && (
                    <th className="py-3 px-4 text-sm font-medium">Actions</th>
                  )}{" "}
                </tr>
              </thead>
              <tbody className="text-gray-700 text-sm">
                {filteredAppointments.length === 0 ? (
                  <tr>
                    <td
                      colSpan={role === "doctor" ? 7 : 6}
                      className="py-4 px-4 text-center"
                    >
                      No appointments found.
                    </td>
                  </tr>
                ) : (
                  filteredAppointments.map((appt) => {
                    const { bookingId, token, status } = appt;
                    let date, startTime, endTime;
                    if (role === "doctor" || role === "patient") {
                      date = appt.appointmenDate || appt.scheduleId?.date;
                      startTime = formatTime(appt.scheduleId?.startTime);
                      endTime = formatTime(appt.scheduleId?.endTime);
                    } else if (role === "admin") {
                      date = appt.scheduleId?.date;
                      startTime = formatTime(appt.scheduleId?.startTime);
                      endTime = formatTime(appt.scheduleId?.endTime);
                    }
                    return (
                      <tr
                        key={token}
                        className="border-b hover:bg-gray-50 transition cursor-pointer"
                        onClick={() => handleRowClick(token)}
                      >
                        <td className="py-3 px-4">{token}</td>
                        {role === "doctor" && (
                          <>
                            <td className="py-3 px-4 flex items-center">
                              {renderProfile(appt.patient, "Patient")}
                              <span>{appt.patient?.username}</span>
                            </td>
                            <td className="py-3 px-4">{appt.patient?.email}</td>
                            <td className="py-3 px-4">
                              {appt.patient?.phoneNumber}
                            </td>
                          </>
                        )}
                        {role === "patient" && (
                          <>
                            <td className="py-3 px-4 flex items-center gap-2">
                              <img
                                src={
                                  appt.doctor?.imageUrl ||
                                  "https://ui-avatars.com/api/?name=" +
                                    encodeURIComponent(
                                      appt.doctor?.name || "Doctor"
                                    )
                                }
                                alt="Doctor"
                                className="w-8 h-8 rounded-full object-cover"
                              />
                              <span>{appt.doctor?.username}</span>
                            </td>
                            <td className="py-3 px-4">
                              {appt.doctor?.doctorDetails?.specialization ||
                                "N/A"}
                            </td>
                          </>
                        )}
                        {(role === "admin" || role === "staff") && (
                          <>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                {appt.patient
                                  ? renderProfile(appt.patient, "Patient")
                                  : null}
                                <span>{appt.patient?.username || "N/A"}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                {appt.doctor
                                  ? renderProfile(appt.doctor, "Doctor")
                                  : null}
                                <span>{appt.doctor?.username || "N/A"}</span>
                              </div>
                            </td>
                          </>
                        )}
                        <td className="py-3 px-4">{formatDate(date)}</td>
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
                                : status.toLowerCase() === "cancelled" ||
                                  status.toLowerCase() === "cancel"
                                ? "bg-red-100 text-red-700"
                                : status.toLowerCase() === "missed"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </span>
                        </td>
                        {role === "admin" && (
                          <td className="py-3 px-4 flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation(); // prevent row navigation
                                navigate(
                                  `/admin/appointment/token/update/${token}`
                                );
                              }}
                              className="text-blue-500 hover:text-blue-700"
                              title="Update Appointment"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(bookingId);
                              }}
                              className="text-red-500 hover:text-red-700"
                              title="Delete Appointment"
                            >
                              🗑️
                            </button>
                          </td>
                        )}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
            {/* ── Pagination Bar ── */}
<div className="flex justify-center items-center mt-4 space-x-2">
  <button
    onClick={() => setPage(p => Math.max(p - 1, 0))}
    disabled={page === 0}
    className="px-3 py-1 border rounded disabled:opacity-50"
  >
    Prev
  </button>

  {Array.from({ length: totalPages }, (_, i) => (
    <button
      key={i}
      onClick={() => setPage(i)}
      className={`px-3 py-1 border rounded ${i === page ? "bg-blue-500 text-white" : ""}`}
    >
      {i + 1}
    </button>
  ))}

  <button
    onClick={() => setPage(p => Math.min(p + 1, totalPages - 1))}
    disabled={page >= totalPages - 1}
    className="px-3 py-1 border rounded disabled:opacity-50"
  >
    Next
  </button>
</div>
{/* ────────────────────── */}

          </div>
        </div>
        {role === "patient" && (
          <div className="hidden lg:block w-[20%] pl-4">
            <AdBanner targetPage="history-right" />
          </div>
        )}
      </div>

      {role === "patient" && (
        <div className="w-full mt-6 lg:mt-8">
          <AdBanner targetPage="appointments-bottom" />
        </div>
      )}
    </div>
  );
};

export default AppointmentsPage;
