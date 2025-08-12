import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, ResponsiveContainer } from 'recharts';
import AdminNavbar from "../../../components/navbar/AdminNavbar"
import apiService from '../../../utils/api';
import { getAppointmentCount, fetchAppointments } from '../../../services/appointment';
// Function to generate the last N days
function getLastNDays(date, n) {
    const dates = [];
    const startDate = new Date(date);

    for (let i = n; i >= 0; i--) {
        const newDate = new Date(startDate);
        newDate.setDate(startDate.getDate() - i);
        dates.push(newDate.toISOString().split('T')[0]); // Format as YYYY-MM-DD
    }

    return dates;
}

const StaffHomePage = () => {
  const [doctorCount, setDoctorCount] = useState(0);
  const [patientCount, setPatientCount] = useState(0);
  const [appointmentsToday, setAppointmentsToday] = useState(0);
  const [missedAppointments, setMissedAppointments] = useState(0);
  const [recentActivities, setRecentActivities] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [lineData, setLineData] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Doctor count
        const doctorCountData = await apiService.get('/doctor/count');
        setDoctorCount(doctorCountData);
        // Patient count
        const patientCountData = await apiService.get('/patient/count');
        setPatientCount(patientCountData);
        // Today's appointments count
        const appointmentsTodayData = await getAppointmentCount();
        setAppointmentsToday(appointmentsTodayData);
        // Missed appointments count
        const missedAppointmentsData = await apiService.get('/appointments/missed/count');
        setMissedAppointments(missedAppointmentsData.count);
        // Recent activities
        const activitiesData = await apiService.get('/api/activity-log');
        const recentActivities = activitiesData.slice(Math.max(activitiesData.length - 6, 0));
        setRecentActivities(recentActivities);
        // Upcoming appointments
        const upcomingData = await fetchAppointments(0, 100); // fetch all, or adjust as needed
        const upcomingList = (upcomingData.content || upcomingData).slice(Math.max((upcomingData.content || upcomingData).length - 6, 0));
        setUpcomingAppointments(upcomingList);
        // Appointments for the last 6 days
        const startDate = new Date();
        const last6Days = getLastNDays(startDate, 6);
        const linePromises = last6Days.map(async (date) => {
          try {
            const summary = await apiService.get(`/daily-summary/date/${date}`);
            return { date, appointments: summary.totalAppointments || 0 };
          } catch (error) {
            console.error(`Error fetching data for ${date}:`, error);
            return { date, appointments: 0 };
          }
        });
        const results = await Promise.all(linePromises);
        setLineData(results);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };
    fetchDashboardData();
  }, []);

  const data = [
    { name: 'Doctors', count: doctorCount },
    { name: 'Patients', count: patientCount },
    { name: 'Today\'s Appointments', count: appointmentsToday },
    // { name: 'Missed Appointments', count: missedAppointments },
  ];

  return (<>
      {/* <AdminNavbar/> */}
    <div className="min-h-screen bg-[#FAFAFA] p-6">
      <div className="max-w-7xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-8">Staff Dashboard</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          <div className="bg-white p-8 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-6">Overview</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#4B5563" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-8 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-6">Appointments This Week</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="appointments" stroke="#10B981" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <h2 className="text-xl font-semibold text-gray-700">Doctors</h2>
            <p className="text-4xl font-bold text-gray-900">{doctorCount}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <h2 className="text-xl font-semibold text-gray-700">Patients</h2>
            <p className="text-4xl font-bold text-gray-900">{patientCount}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <h2 className="text-xl font-semibold text-gray-700">Today's Appointments</h2>
            <p className="text-4xl font-bold text-gray-900">{appointmentsToday}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <h2 className="text-xl font-semibold text-gray-700">Missed Appointments</h2>
            <p className="text-4xl font-bold text-gray-900">{missedAppointments}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          <div className="bg-white p-8 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-6">Recent Activities</h2>
            <ul className="space-y-4">
              {recentActivities.map((activity, index) => (
                <li key={index} className="text-gray-700 flex items-center">
                  {/* <span className="material-icons mr-3">event</span> */}
                  {activity.message}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-8 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-6">Upcoming Appointments</h2>
            <ul className="space-y-4">
              {upcomingAppointments.map((appointment, index) => (
                <li key={index} className="text-gray-700 flex items-center">
                  <span className="material-icons mr-3">schedule</span>
                  {appointment.patient.username} with {appointment.doctor.username} at {appointment.scheduleId.slot.startTime}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex space-x-4">
          <Link
            to="/staff/search-doctor"
            className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg shadow text-center"
            >
            Search Doctor
          </Link>
          <Link
            to="/staff/search-patient"
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg shadow text-center"
            >
            Search Patient
          </Link>
          <Link
            to="/GetAllAppointment"
            className="flex-1 bg-yellow-600 text-white py-3 px-6 rounded-lg shadow text-center"
            >
            Manage Appointments
          </Link>
        </div>
      </div>
    </div>
            </>
  );
};

export default StaffHomePage;
