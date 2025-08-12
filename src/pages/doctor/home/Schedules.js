import React, { useState, useEffect } from 'react';
import doctorImage from '../../../images/doctorPatient.jpg'; // Adjust the path as needed
import { getDoctorAppointments } from '../../../services/doctor';

export default function Schedules({ date }) {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDoctorAppointments();

        const currentTime = new Date(); // Get the current time

        // Filter appointments based on the selected date and status
        const filteredAppointments = data.filter(appointment => {
          const appointmentDate = new Date(appointment.scheduleId.date);
          return appointmentDate.toISOString().split('T')[0] === date;
        });

        // Sort the filtered appointments by start time
        filteredAppointments.sort((a, b) => {
          const startTimeA = new Date(`${a.scheduleId.date}T${a.scheduleId.startTime}`);
          const startTimeB = new Date(`${b.scheduleId.date}T${b.scheduleId.startTime}`);
          return startTimeA - startTimeB;
        });

        setAppointments(filteredAppointments);
      } catch (error) {
        console.error('Failed to fetch appointments:', error);
      }
    };

    fetchData();
  }, [date]);

  // Function to determine the CSS class based on appointment status and time
  const getStatusClass = (appointment) => {
    const startTime = new Date(`${appointment.scheduleId.date}T${appointment.scheduleId.startTime}`);
    const endTime = new Date(`${appointment.scheduleId.date}T${appointment.scheduleId.endTime}`);
    const currentTime = new Date();

    if (appointment.status === 'canceled') {
      return 'bg-red-200 text-red-800'; // Canceled (Red)
    } else if (appointment.status === 'completed') {
      return 'bg-green-200 text-green-800'; // Completed (Green)
    } else if (startTime > currentTime) {
      return 'bg-gray-200 text-gray-800'; // Upcoming (Gray)
    } else if (endTime < currentTime) {
      return 'bg-red-200 text-red-800'; // Missed (Red)
    }
  };

  return (
    <div className="bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-4xl">
        <div className="flex items-center p-6">
          <div className="w-1/3">
            <img src={doctorImage} alt="Doctor Schedule" className="w-full h-full object-cover" />
          </div>
          <div className="w-2/3 p-6">
            <h1 className="text-2xl font-bold mb-4">Doctor's Schedule on {date}</h1>
            <p className="text-gray-700 mb-6">View and manage your appointments and schedules for the selected date.</p>
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">Appointment Time</span>
              <span className="text-lg font-semibold">Patient Name</span>
            </div>
            {appointments.length === 0 ? (
              <p className="text-gray-600">No appointments for this date.</p>
            ) : (
              appointments.map((appointment) => (
                <div
                  key={appointment.bookingId}
                  className={`flex justify-between items-center py-2 px-4 border-t border-gray-200 ${getStatusClass(appointment)}`}
                >
                  <span>{appointment.scheduleId.startTime} - {appointment.scheduleId.endTime}</span>
                  <span>{appointment.patient.username}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
