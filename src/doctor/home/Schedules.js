import React, { useState, useEffect } from 'react';
import doctorImage from '../../images/doctorPatient.jpg'; // Adjust the path as needed

export default function Schedules() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `http://localhost:8080/bookingAppointments/doctor/${localStorage.getItem("userId")}`
      );
      const data = await response.json();
      setAppointments(data);
    };
    fetchData();
  }, []);

  return (
    <div className="bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-4xl">
        <div className="flex items-center p-6">
          <div className="w-1/3">
            <img src={doctorImage} alt="Doctor Schedule" className="w-full h-full object-cover" />
          </div>
          <div className="w-2/3 p-6">
            <h1 className="text-2xl font-bold mb-4">Doctor's Schedule</h1>
            <p className="text-gray-700 mb-6">View and manage your appointments and schedules.</p>
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">Appointment Time</span>
              <span className="text-lg font-semibold">Patient Name</span>
            </div>
            {appointments.map((appointment) => (
              <div key={appointment.bookingId} className="flex justify-between items-center py-2 border-t border-gray-200">
                <span className="text-gray-600">{appointment.scheduleId.startTime} - {appointment.scheduleId.endTime}</span>
                <span className="text-gray-600">{appointment.patientId.patientName}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
