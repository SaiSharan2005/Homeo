import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import AdminNavbar from "../../components/AdminNavbar"
const GetAllAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [responseMessage, setResponseMessage] = useState('');
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(process.env.REACT_APP_BACKEND_URL+'/bookingAppointments')
      .then(response => response.json())
      .then(data => {
        const activeAppointments = data.filter(appointment => appointment.status && appointment.status.toLowerCase() !== 'cancel');
        setAppointments(activeAppointments);
        setFilteredAppointments(activeAppointments);
      })
      .catch(error => {
        console.error('Error fetching appointments:', error);
      });
  }, []);

  const cancelAppointment = async (id, doctorId) => {
    try {
      const response = await fetch(process.env.REACT_APP_BACKEND_URL+`/bookingAppointments/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      setResponseMessage('Appointment deleted successfully');
      setAppointments(appointments.filter(appointment => appointment.bookingId !== id));
      setFilteredAppointments(filteredAppointments.filter(appointment => appointment.bookingId !== id));

      const booking = appointments.find(booking => booking.bookingId === id);

      const data = {
        bookingId: booking.bookingId,
        doctorId: booking.doctorId.id,
        adminId: localStorage.getItem("staffId"),
        role: "admin",
        action: "delete",
        reasonForAction: "cancellation reason",
      };

      try {
        const response = await fetch(process.env.REACT_APP_BACKEND_URL+'/appointmentHistory/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          console.log("Appointment history updated successfully!");
        } else {
          console.error("Failed to update appointment history");
        }
      } catch (error) {
        console.error("Failed to update appointment history:", error);
      }

    } catch (error) {
      console.error("Failed to delete appointment:", error);
    }
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
            status.includes(searchTerm.toLowerCase())) &&
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
    <div>
    <AdminNavbar/>

    <div className="p-6 max-w-[80vw] mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Upcoming Appointments</h1>

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
        className="mb-4 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
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

      {filteredAppointments.length === 0 && <p className="text-gray-600">No appointments found</p>}

      {filteredAppointments.map((appointment, index) => (
        <div key={index} className="flex items-center mb-4 p-4 bg-white shadow-md rounded-lg">
          <img
            src={`https://randomuser.me/api/portraits/med/${appointment?.doctorId?.doctorDetails?.gender === "female" ? "women" : "men"}/${index + 10}.jpg`}
            alt={appointment?.doctorId?.doctorName}
            className="w-16 h-16 rounded-full mr-4"
          />
          <div className="flex-grow">
            <p className="font-semibold text-lg text-gray-800">{appointment?.doctorId?.doctorName}</p>
            <p className="text-gray-600">Doctor ID: {appointment?.doctorId?.doctorId} | Phone: {appointment?.doctorId?.phoneNumber}</p>
            <p className="text-gray-600">Consultation Fee: ${appointment?.doctorId?.doctorDetails?.consultationFee}</p>
            <p className="text-gray-600">Patient: {appointment?.patientId?.patientName} | Phone: {appointment?.patientId?.phoneNumber}</p>
            <p className="text-gray-600">Specialty: {appointment?.doctorId?.doctorDetails?.specialization} - Status: {appointment?.status}</p>
            <p className="text-gray-600">Date: {new Date(appointment?.scheduleId?.date).toLocaleDateString()} | Time: {appointment?.scheduleId?.startTime} - {appointment?.scheduleId?.endTime}</p>
          </div>
          <div className="flex-shrink-0">
            <button 
              onClick={() => { navigate(`/UpdateAppoinment/${appointment?.bookingId}`) }} 
              className="py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300 mr-2">
              Update
            </button>
            <button 
              onClick={() => cancelAppointment(appointment?.bookingId, appointment?.doctorId.id)} 
              className="py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300">
              Cancel
            </button>
          </div>
        </div>
      ))}
    </div>    
    </div>
  );
};

export default GetAllAppointment;
