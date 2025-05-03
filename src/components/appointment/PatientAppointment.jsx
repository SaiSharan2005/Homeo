import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PrescriptionReport from "../prescription/PrescriptionDetails"

const PatientAppointmentsPage = ({ patientId }) => {
    
    const navigate = useNavigate();
//   const patientId = localStorage.getItem("USER_ID");

  // pagination & filters
  const [page, setPage] = useState(0);
  const size = 10;
  const [logsPage, setLogsPage] = useState({ content: [], totalPages: 0 });
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // which booking is expanded?
  const [expandedBookingId, setExpandedBookingId] = useState(null);
  // prescription data for the expanded booking
  const [createdPrescription, setCreatedPrescription] = useState(null);

  // fetch paged appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const resp = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/bookingAppointments/patient/${patientId}?page=${page}&size=${size}`,
          { headers: { Authorization: `Bearer ${localStorage.getItem("Token")}` } }
        );
        const data = await resp.json();
        setLogsPage({
          content: data.content || [],
          totalPages: data.totalPages || 0,
        });
      } catch (err) {
        console.error("Error loading appointments", err);
      }
    };
    fetchAppointments();
  }, [page, patientId]);

  // fetch prescription for a booking
  const fetchPrescriptionByBooking = async (bookingId) => {
    try {
      const resp = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/prescriptions/booking/${bookingId}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("Token")}` } }
      );
      if (resp.ok) {
        const prescriptionData = await resp.json();
        setCreatedPrescription(prescriptionData);
      } else {
        setCreatedPrescription(null);
      }
    } catch (err) {
      console.error("No existing prescription found for this booking", err);
      setCreatedPrescription(null);
    }
  };

  // toggle expand & fetch prescription
  const toggleExpand = (bookingId) => {
    if (expandedBookingId === bookingId) {
      setExpandedBookingId(null);
      setCreatedPrescription(null);
    } else {
      setExpandedBookingId(bookingId);
      fetchPrescriptionByBooking(bookingId);
    }
  };

  // formatting helpers
  const formatDate = (ds) => {
    if (!ds) return "";
    const d = new Date(ds);
    const day = String(d.getDate()).padStart(2, "0");
    const mon = d
      .toLocaleString("default", { month: "short" })
      .toLowerCase();
    return `${day} ${mon} ${d.getFullYear()}`;
  };
  const formatTime = (ts) => (ts ? ts.slice(0, 5) : "");

  // profile avatar
  const renderProfile = (user) =>
    user?.imageUrl ? (
      <img
        src={user.imageUrl}
        alt={user.username}
        className="w-8 h-8 rounded-full object-cover mr-2"
      />
    ) : (
      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold text-gray-700 mr-2">
        {user?.username?.[0]?.toUpperCase() || "?"}
      </div>
    );

  // apply search & status filter
  const filtered = logsPage.content.filter((appt) => {
    const name = appt.doctor?.username?.toLowerCase() || "";
    const status = appt.status?.toLowerCase() || "";
    return (
      name.includes(searchQuery.toLowerCase()) &&
      (statusFilter === "All" || status === statusFilter.toLowerCase())
    );
  });

  return (
    <div className="flex flex-col lg:flex-row container mx-auto p-6">
      {/* Main Table */}
      <div className="flex-1 bg-white rounded-md shadow p-4">
        <h2 className="text-2xl font-bold mb-4">Your Appointments</h2>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row sm:justify-between mb-4 gap-4">
          <input
            className="flex-grow border p-2 rounded focus:ring-2 focus:ring-green-500"
            placeholder="Search by doctor name..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(0);
            }}
          />
          <select
            className="border p-2 rounded focus:ring-2 focus:ring-green-500"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(0);
            }}
          >
            {["All", "Completed", "Upcoming", "Cancelled", "Missed"].map(
              (s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              )
            )}
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-600">
                <th className="px-4 py-2">Token</th>
                <th className="px-4 py-2">Profile</th>
                <th className="px-4 py-2">Specialization</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Time</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-4 text-center">
                    No appointments found.
                  </td>
                </tr>
              )}
              {filtered.map((appt) => {
                const date = appt.appointmenDate || appt.scheduleId?.date;
                const start = appt.scheduleId?.startTime;
                const end = appt.scheduleId?.endTime;
                const badgeColor =
                  appt.status === "completed"
                    ? "bg-green-100 text-green-700"
                    : appt.status === "upcoming"
                    ? "bg-blue-100 text-blue-700"
                    : ["cancelled", "cancel"].includes(appt.status)
                    ? "bg-red-100 text-red-700"
                    : appt.status === "missed"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-gray-100 text-gray-700";

                return (
                  <React.Fragment key={appt.bookingId}>
                    <tr
                      className="cursor-pointer hover:bg-gray-50 border-b"
                      onClick={() => toggleExpand(appt.bookingId)}
                    >
                      <td className="px-4 py-2">{appt.token}</td>
                      <td className="px-4 py-2 flex items-center">
                        {renderProfile(appt.doctor)}
                        {appt.doctor?.username}
                      </td>
                      <td className="px-4 py-2">
                        {appt.doctor?.doctorDetails?.specialization || "N/A"}
                      </td>
                      <td className="px-4 py-2">{formatDate(date)}</td>
                      <td className="px-4 py-2">
                        {formatTime(start)}–{formatTime(end)}
                      </td>
                      <td className="px-4 py-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${badgeColor}`}
                        >
                          {appt.status.charAt(0).toUpperCase() +
                            appt.status.slice(1)}
                        </span>
                      </td>
                    </tr>

                    {expandedBookingId === appt.bookingId && (
                      <tr>
                        <td colSpan={6} className="bg-gray-50 p-4">
                          {/* Doctor & Schedule Details */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <h3 className="font-semibold mb-1">
                                Doctor Details
                              </h3>
                              <p>Name: {appt.doctor.username}</p>
                              <p>
                                City: {appt.doctor.doctorDetails?.city}
                              </p>
                              <p>
                                Fee:{" "}
                                {appt.doctor.doctorDetails
                                  ?.consultationFee ?? "-"}
                              </p>
                            </div>
                            <div>
                              <h3 className="font-semibold mb-1">Schedule</h3>
                              <p>
                                Slot ID: {appt.scheduleId?.slot.slotId}
                              </p>
                              <p>
                                Start:{" "}
                                {formatTime(appt.scheduleId?.startTime)}
                              </p>
                              <p>
                                End:{" "}
                                {formatTime(appt.scheduleId?.endTime)}
                              </p>
                            </div>
                          </div>

                          {/* Prescription Report */}
                          {createdPrescription ? (
                            <PrescriptionReport
                              prescription={createdPrescription}
                            />
                          ) : (
                            <p className="text-sm text-gray-500">
                              No prescription available.
                            </p>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {logsPage.totalPages > 1 && (
          <div className="flex justify-center items-center mt-4 space-x-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 0))}
              disabled={page === 0}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>
            {Array.from({ length: logsPage.totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`px-3 py-1 border rounded ${
                  i === page ? "bg-blue-500 text-white" : ""
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() =>
                setPage((p) => Math.min(p + 1, logsPage.totalPages - 1))
              }
              disabled={page >= logsPage.totalPages - 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Ads for patient */}
    
    </div>
  );
};

export default PatientAppointmentsPage;
