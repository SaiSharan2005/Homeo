import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdBanner from "./Adv";
import { toast } from 'react-toastify';
import apiService from "../../utils/api";
import Card from "../common/Card";
import Button from "../common/Button";
import Input from "../common/Input";
import Select from "../common/Select";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";

const AppointmentsPage = ({
  role,
  defaultStatusFilter = "All",
  appointments: appointmentsProp,
}) => {
//   const [page, setPage] = useState(0);
//const size = 10;
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
      let json;
      if (role === "doctor") {
        json = await apiService.get(`/bookingAppointments/doctor/my-appointments?page=${page}&size=${size}`);
      } else if (role === "patient") {
        json = await apiService.get(`/bookingAppointments/patient/my-appointments?page=${page}&size=${size}`);
      } else if (role === "admin") {
        json = await apiService.get(`/bookingAppointments?page=${page}&size=${size}`);
      }
      
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
              await apiService.delete(`/bookingAppointments/${id}`);
      setAppointments((prev) => prev.filter((appt) => appt.id !== id));
      toast.success("Appointment deleted successfully.");
    } catch (error) {
      console.error("Error deleting appointment:", error);
      toast.error("An error occurred while deleting.");
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
        <div className="flex-1">
          <Card
            header={
              <div className="flex items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {role === "doctor" && "Appointments"}
                    {role === "patient" && "Your Appointments"}
                    {role === "admin" && "All Appointments"}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {role === "doctor" &&
                      "Recent and upcoming appointments."}
                    {role === "patient" &&
                      "Your recent and upcoming visits."}
                    {role === "admin" && "Manage appointments across the system."}
                  </p>
                </div>
                {role === "admin" && (
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => navigate("create")}
                    className="whitespace-nowrap"
                  >
                    <Plus className="h-4 w-4 mr-2" /> Create Appointment
                  </Button>
                )}
              </div>
            }
          >
            {/* Search and Status Filter */}
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="w-full sm:w-1/2">
                <Input
                  type="search"
                  placeholder={
                    role === "doctor"
                      ? "Search by patient name..."
                      : role === "admin"
                      ? "Search by doctor or patient..."
                      : "Search by doctor name..."
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  leftIcon={<Search className="h-4 w-4 text-gray-400" />}
                />
              </div>
              <div className="w-full sm:w-1/6">
                <Select
                  options={[
                    { label: 'All Status', value: 'All' },
                    { label: 'Completed', value: 'Completed' },
                    { label: 'Upcoming', value: 'Upcoming' },
                    { label: 'Cancelled', value: 'Cancelled' },
                    { label: 'Missed', value: 'Missed' },
                  ]}
                  value={statusFilter}
                  onChange={(val) => setStatusFilter(val)}
                  placeholder="Filter status"
                  fullWidth
                  size="md"
                  clearable
                />
              </div>
            </div>
            {/* Appointments Table */}
            <div className="overflow-x-auto">
            <table className="w-full table-auto text-left border-collapse">
              <thead>
                <tr className="text-gray-600 border-b bg-gray-50">
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
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/admin/appointment/token/update/${token}`);
                              }}
                              title="Update Appointment"
                              className="text-blue-600 hover:text-blue-700"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(bookingId);
                              }}
                              title="Delete Appointment"
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        )}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
            {/* ── Pagination Bar ── */}
            <div className="flex justify-center items-center mt-4 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(p - 1, 0))}
                disabled={page === 0}
              >
                Prev
              </Button>

              {Array.from({ length: totalPages }, (_, i) => (
                <Button
                  key={i}
                  variant={i === page ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setPage(i)}
                >
                  {i + 1}
                </Button>
              ))}

              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
                disabled={page >= totalPages - 1}
              >
                Next
              </Button>
            </div>
            {/* ────────────────────── */}

            </div>
          </Card>
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
