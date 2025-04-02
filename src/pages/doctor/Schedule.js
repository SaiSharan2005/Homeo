import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./ModernCalendar.css"; // Custom CSS for modern styling
import { fetchDoctorTiming } from "../../services/doctor/appointment"; // Import your fetch function
import Schedule from "../../components/appointment/DoctorScheduleComponenet";
import { FiPlusCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import DoctorAppointmentsPage from "../../components/appointment/Appointments";

// Current Appointment Component
function CurrentAppointment() {
  const currentApp = null; // or { patient: "John Doe", time: "10:00 AM", date: "2025-03-01" }
  return (
    <div className="bg-white shadow rounded-xl p-5">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Current Appointment</h2>
      {currentApp ? (
        <div className="text-gray-700">
          <p className="text-sm">Patient: {currentApp.patient}</p>
          <p className="text-sm">Time: {currentApp.time}</p>
          <p className="text-sm">Date: {currentApp.date}</p>
        </div>
      ) : (
        <p className="text-gray-500 text-sm">No current appointments.</p>
      )}
    </div>
  );
}

// Doctor Timings Component – Horizontal scroll timeline using fetched data
function DoctorTimings() {
  const navigate = useNavigate();
  const [timings, setTimings] = React.useState([]);

  React.useEffect(() => {
    const getTimings = async () => {
      try {
        const data = await fetchDoctorTiming();
        setTimings(data);
      } catch (error) {
        console.error("Error fetching doctor timings:", error);
      }
    };
    getTimings();
  }, []);

  return (
    <div className="bg-white shadow rounded-xl p-5">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-800">Doctor Timings</h3>
        <button
          onClick={() => navigate("/doctor/create-schedule")}
          className="text-blue-500 hover:text-blue-700 flex items-center"
        >
          <FiPlusCircle size={20} className="mr-1" /> Create Schedule
        </button>
      </div>
      <div className="overflow-x-auto" style={{ maxWidth: "100%" }}>
        <div style={{ width: "800px" }}>
          <div className="flex space-x-4">
            {timings && timings.length > 0 ? (
              timings.map((slot) => (
                <div
                  key={slot.slotId}
                  className="min-w-[120px] p-3 border rounded-lg flex flex-col items-center hover:shadow transition"
                >
                  <span className="text-xs text-gray-600">
                    {slot.startTime.slice(0, 5)} - {slot.endTime.slice(0, 5)}
                  </span>
                  <span className="mt-1 text-sm font-medium text-green-600">
                    {slot.inUse ? "In Use" : "Free"}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No timings available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Upcoming Appointments Component
// function UpcomingAppointments() {
//   const appointments = [
//     {
//       id: 1,
//       patient: "John Doe",
//       time: "10:00 AM",
//       date: "2025-03-01",
//       status: "Confirmed",
//     },
//     {
//       id: 2,
//       patient: "Jane Smith",
//       time: "11:30 AM",
//       date: "2025-03-02",
//       status: "Pending",
//     },
//     {
//       id: 3,
//       patient: "Alice Brown",
//       time: "02:00 PM",
//       date: "2025-03-03",
//       status: "Confirmed",
//     },
//   ];
//   return (
//     <div className="bg-white shadow rounded-xl p-5">
//       <h3 className="text-lg font-bold text-gray-800 mb-4">Upcoming Appointments</h3>
//       <div className="overflow-x-auto">
//         <table className="min-w-full text-left border-collapse">
//           <thead className="bg-gray-50">
//             <tr className="text-gray-600 text-sm border-b">
//               <th className="px-4 py-3">Patient Name</th>
//               <th className="px-4 py-3">Time</th>
//               <th className="px-4 py-3">Date</th>
//               <th className="px-4 py-3">Status</th>
//             </tr>
//           </thead>
//           <tbody className="text-gray-700 text-sm">
//             {appointments.map((app) => (
//               <tr key={app.id} className="border-b hover:bg-gray-50">
//                 <td className="px-4 py-3">{app.patient}</td>
//                 <td className="px-4 py-3">{app.time}</td>
//                 <td className="px-4 py-3">{app.date}</td>
//                 <td className="px-4 py-3">{app.status}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// Main Schedule Page
export default function SchedulePage() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Top Section: On larger screens, the left side spans two columns and the modern calendar is on the right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Left Side: Spanning two columns */}
        <div className="lg:col-span-2 space-y-6">
          <CurrentAppointment />
          <DoctorTimings />
        </div>
        {/* Right Side: Modern Calendar */}
        <div className="lg:col-span-1 bg-white shadow-sm rounded-xl p-5">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Modern Calendar</h3>
          {/* The Calendar component with custom modern styling */}
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            className="modern-calendar"
          />
        </div>
      </div>
      <div className="py-8">
        {/* Pass the selected date to the Schedule component */}
        <Schedule selectedDate={selectedDate} />
      </div>
      
      {/* Upcoming Appointments Section */}
      <DoctorAppointmentsPage defaultStatusFilter="Upcoming" />
      </div>
  );
}
