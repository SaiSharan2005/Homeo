import React, { useEffect, useState } from 'react';
import { json, useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const GetAllAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [responseMessage, setResponseMessage] = useState('');
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [selectedState,setSelectState] = useState({});
  const navigate = useNavigate();

  useEffect(() => {

  
    fetch('http://localhost:8080/bookingAppointments')
      .then(response => response.json())
      .then(data => {
        setAppointments(data);
        setFilteredAppointments(data);
      })
      .catch(error => {
        console.error('Error fetching appointments:', error);
      });
  }, []);

  const deleteAppointment = async (id,doctorId) => {
    // var name=prompt("enter the reason for cancellation ");
    // const cancellingData = {
    //   // "bookingId":,
    //   "doctorId":doctorId,
    //   "adminId":Number(localStorage.getItem("staffId")),
    //   "role":"admin",
    //   "action":"cancel",
    //   "reasonForAction":name

    // }
    // const responses = await fetch(
    //   `http://localhost:8080/appointmentHistory/add`,
    //   {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(cancellingData),
    //   }
    // );

    try {
      const response = await fetch(`http://localhost:8080/bookingAppointments/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // const data = await response.json();
      setResponseMessage('Appointment deleted successfully');
        
        if (response.ok) {
          const responseData = await response.json();
          console.log("Appointment updated successfully!", responseData);
         
        } else {
          console.error("Failed to update appointment");
        }} catch (error) {
          console.error("Failed to update appointment:", error);
        }
      setAppointments(appointments.filter(appointment => appointment.bookingId !== id));
      setFilteredAppointments(filteredAppointments.filter(appointment => appointment.bookingId !== id));
  

  };





  useEffect(() => {
    const [startDate, endDate] = dateRange;
    
    setFilteredAppointments(
      appointments.filter(appointment => {
        const doctorName = appointment?.doctorId?.doctorName?.toLowerCase() || '';
        const patientName = appointment?.patientId?.patientName?.toLowerCase() || '';
        const doctorId = appointment?.doctorId?.doctorId?.toString() || '';
        const patientPhone = appointment?.patientId?.phoneNumber || '';
        const consultationFee = appointment?.doctorId?.doctorDetails?.consultationFee?.toString() || '';
        const specialty = appointment?.doctorId?.doctorDetails?.specialization?.toLowerCase() || '';
        const status = appointment?.status?.toLowerCase() || '';
        const appointmentDate = new Date(appointment?.scheduleId?.date);

        return (
          (doctorName.includes(searchTerm.toLowerCase()) ||
            patientName.includes(searchTerm.toLowerCase()) ||
            doctorId.includes(searchTerm) ||
            patientPhone.includes(searchTerm) ||
            consultationFee.includes(searchTerm) ||
            specialty.includes(searchTerm.toLowerCase()) ||
            status.includes(searchTerm.toLowerCase())) 
            &&
          (!startDate || appointmentDate >= startDate) &&
          (!endDate || appointmentDate <= endDate)
        );
      })
    );
  }, [searchTerm, dateRange, appointments]);

  const handleDateChange = (dates) => {
    setDateRange(dates);
  };

  const toggleCalendarVisibility = () => {
    setIsCalendarVisible(!isCalendarVisible);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Upcoming Appointments</h1>

      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search by doctor or patient name, doctor ID, phone number, fee, specialty, or status"
          className="w-full p-4 pr-12 text-sm border border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          <svg className="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6a4 4 0 100 8 4 4 0 000-8zm6 10l4 4" />
          </svg>
        </div>
      </div>

      <button
        onClick={toggleCalendarVisibility}
        className="mb-4 py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        {isCalendarVisible ? 'Hide Calendar' : 'Show Calendar'}
      </button>

      {isCalendarVisible && (
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <Calendar
            onChange={handleDateChange}
            value={dateRange}
            selectRange
            className="border-2 border-gray-200 p-2 rounded-lg shadow-md w-full"
            calendarClassName="custom-calendar"
          />
        </div>
      )}

      {filteredAppointments.length === 0 && <p>No appointments found</p>}
      {filteredAppointments.map((appointment, index) => (
        <div key={index} className="flex items-center mb-4 p-4 bg-white shadow-md rounded-lg">
          <img
            src={`https://randomuser.me/api/portraits/med/${appointment?.doctorId?.doctorDetails?.gender === "female" ? "women" : "men"}/${index + 10}.jpg`}
            alt={appointment?.doctorId?.doctorName}
            className="w-16 h-16 rounded-full mr-4"
          />
          <div className="flex-grow">
            <p className="font-semibold">{appointment?.doctorId?.doctorName}</p>
            <p>Doctor ID: {appointment?.doctorId?.doctorId} Phone: {appointment?.doctorId?.phoneNumber}</p>
            <p>Consultation Fee: ${appointment?.doctorId?.doctorDetails?.consultationFee}</p>
            <p>Patient Details: Name: {appointment?.patientId?.patientName} Phone: {appointment?.patientId?.phoneNumber}</p>
            <p>Specialty: {appointment?.doctorId?.doctorDetails?.specialization} - {appointment?.status}</p>
            <p>Date: {appointment?.scheduleId?.date} Time: {appointment?.scheduleId?.startTime} - {appointment?.scheduleId?.endTime}</p>
          </div>
          <button onClick={() => { navigate(`/UpdateAppoinment/${appointment?.bookingId}`) }}
            className="ml-4 py-2 px-4 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
            Update
          </button>
          <button onClick={() => {deleteAppointment(appointment?.bookingId,appointment?.doctorId.id);}} className="ml-4 py-2 px-4 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
            Cancel
          </button>


        </div>
      ))}
    </div>
  );
};

export default GetAllAppointment;
