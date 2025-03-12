import React, { useEffect, useState } from "react";
import profile1 from "../../images/doctorPatient.jpg";
import DoctorNavbar from "../../components/navbar/DoctorNavbar";
import { useNavigate } from "react-router-dom";

export default function DoctorHistory() {
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL+`/bookingAppointments/doctor/my-appointments`, {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("Token")}`, // Retrieve token from local storage

          },
        }
      );
      const data = await response.json();
      setAppointments(data);
    };
    fetchData();
  }, []);

  const todayDate = new Date().toISOString().split('T')[0];

  const filteredAppointments = appointments.filter(appointment => {
    if (activeTab === 'all') return true;
    if (activeTab === 'today') return appointment.scheduleId.date === todayDate;
    if (activeTab === 'upcoming') return appointment.status === 'upcoming';
    if (activeTab === 'completed') return appointment.status === 'completed';
    if (activeTab === 'canceled') return appointment.status === 'cancel';
    if (activeTab === 'missed') return appointment.status === 'missed';
    return false;
  });

  filteredAppointments.sort((a, b) => {
    const dateTimeA = new Date(`${a.scheduleId.date}T${a.scheduleId.startTime}`);
    const dateTimeB = new Date(`${b.scheduleId.date}T${b.scheduleId.startTime}`);
    return dateTimeB - dateTimeA;
  });

  const groupedAppointments = filteredAppointments.reduce((grouped, appointment) => {
    const date = appointment.scheduleId.date;
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(appointment);
    return grouped;
  }, {});

  return (
    <>
      <DoctorNavbar />
      <div className="max-w-4xl mx-auto mt-8 p-4">
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded ${activeTab === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            All
          </button>
          <button
            onClick={() => setActiveTab('today')}
            className={`px-4 py-2 rounded ${activeTab === 'today' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            Today
          </button>
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-4 py-2 rounded ${activeTab === 'upcoming' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-4 py-2 rounded ${activeTab === 'completed' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            Completed
          </button>
          <button
            onClick={() => setActiveTab('canceled')}
            className={`px-4 py-2 rounded ${activeTab === 'canceled' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            Canceled
          </button>
          <button
            onClick={() => setActiveTab('missed')}
            className={`px-4 py-2 rounded ${activeTab === 'missed' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            Missed
          </button>
        </div>

        <div>
          <h1 className="text-2xl font-bold mb-6">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Appointments
          </h1>

          {filteredAppointments.length === 0 ? (
            <p className="text-gray-600">No appointments for this category.</p>
          ) : (
            Object.keys(groupedAppointments).map((date) => (
              <div key={date} className="mb-8">
                <h2 className="text-xl font-semibold mb-4 bg-blue-100 p-2 rounded-md">{date}</h2>
                <ul>
                  {groupedAppointments[date].map((appointment) => (
                    <li
                      key={appointment.id}
                      onClick={() => navigate(`/doctor-token/${appointment?.token}`)}
                      className="flex items-center justify-between mb-4 p-4 bg-white shadow-sm rounded-lg cursor-pointer transition-transform transform hover:scale-105"
                    >
                      <div className="flex items-center">
                        <img
                          className="h-12 w-12 rounded-full object-cover mr-4"
                          src={profile1}
                          alt={appointment?.patientId?.patientName}
                        />
                        <div>
                          <h3 className="text-lg font-semibold">
                            {appointment?.patientId?.patientName}
                          </h3>
                          <p className="text-gray-600">
                            Patient ID: {appointment?.patientId?.patientId}
                          </p>
                          <p className="text-gray-600">
                            Token: {appointment?.token}
                          </p>
                        </div>
                      </div>
                      <div className="text-gray-600">
                        {appointment?.scheduleId?.startTime}
                      </div>
                      <div className={`text-gray-600 font-bold ${
                        appointment.status === 'upcoming'
                          ? 'text-blue-500'
                          : appointment.status === 'cancel'
                          ? 'text-red-500'
                          : appointment.status === 'missed'
                          ? 'text-red-600'
                          : 'text-green-500'
                      }`}>
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
