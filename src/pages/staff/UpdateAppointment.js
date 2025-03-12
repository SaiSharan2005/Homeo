import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PatientNavbar from "../../components/navbar/PatientNavbar";

const UpdateAppointment = () => {
  const { AppointmentId } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [scheduleId, setScheduleId] = useState();
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [bookingData, setBookingData] = useState({});
  const [patient, setPatient] = useState({});
  const [updateReason, setUpdateReason] = useState(""); // State for update reason
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointmentData = async () => {
      try {
        const response = await fetch(
          process.env.REACT_APP_BACKEND_URL+`/bookingAppointments/byId/${AppointmentId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const AppointmentDetails = await response.json();
        setBookingData(AppointmentDetails);
        setDoctor(AppointmentDetails.doctor);
        setScheduleId(AppointmentDetails.scheduleId?.scheduleId);
        setPatient(AppointmentDetails.patient);
        setIsLoading(false);
        fetchSchedule(AppointmentDetails.doctor.id);
      } catch (error) {
        console.error("Failed to fetch appointment data:", error);
        setIsLoading(false);
      }
    };

    const fetchSchedule = async (schedule) => {
      try {
        const response = await fetch(
          process.env.REACT_APP_BACKEND_URL+`/schedule/doctor/${schedule}`
        );
        const data = await response.json();
        setSchedules(data);
      } catch (error) {
        console.error("Failed to fetch schedule data:", error);
        setIsLoading(false);
      }
    };

    fetchAppointmentData();
  }, [AppointmentId]);

  const updateAppointment = async () => {
    if (!selectedSchedule) {
      console.error("No schedule selected");
      return;
    }

    // Update the booking data with selected schedule and reason
    bookingData.doctorId= bookingData.doctor.id;
    bookingData.patientId= bookingData.patient.id
    bookingData.scheduleId = selectedSchedule.scheduleId;
    bookingData.updateReason = updateReason; // Assigning update reason

    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL+`/bookingAppointments/${AppointmentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bookingData),
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        console.log("Appointment updated successfully!", responseData);
        updateAppointmentReason();
        navigate(`/token/${responseData.token}`);
        setSchedules((prevSchedules) =>
          prevSchedules.map((sch) =>
            sch.scheduleId === selectedSchedule.scheduleId
              ? { ...sch, booked: true }
              : sch
          )
        );
      } else {
        console.error("Failed to update appointment");
      }
    } catch (error) {
      console.error("Failed to update appointment:", error);
    }
  };


  const  updateAppointmentReason = async()=>{
    const data = {
      "bookingId":bookingData.bookingId,
      "doctorId":doctor.id,
      "adminId":localStorage.getItem("staffId"),
      "role":"admin",
      "action":"update",
      "reasonForAction":updateReason

    }
  
  
    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL+`/appointmentHistory/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        console.log("Appointment updated successfully!", responseData);
        // updateAppointmentReason();
       
        
      } else {
        console.error("Failed to update appointment");
      }} catch (error) {
        console.error("Failed to update appointment:", error);
      }

    }


  const formatTime = (time) => {
    const [hours, minutes] = time.split(":");
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    const options = { hour: "numeric", minute: "numeric", hour12: true };
    return date.toLocaleTimeString([], options);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <PatientNavbar />
      <div className="min-h-[90vh] bg-gray-50 flex flex-col items-center">
        <main className="w-full max-w-3xl mt-8 p-4 bg-white shadow-md rounded-md">
          <div className="flex justify-between">
            <div className="patient">
              <h1 className="text-2xl font-bold">{patient.username}</h1>
              <p className="">Patient Id : {patient.userId}</p>
              {doctor.doctorDetails && (
                <>
                  <p className="">Phone Number : {patient.phoneNumber}</p>
                  <p className="">
                    Address : {doctor.doctorDetails.address}{" "}
                    {doctor.doctorDetails.city}
                  </p>
                </>
              )}
            </div>
            <div className="doctor">
              <h1 className="text-2xl font-bold">{doctor.doctorName}</h1>
              {doctor.doctorDetails && (
                <>
                  <p className="text-[#2BA78F]">
                    {doctor.doctorDetails.specialization ||
                      "Specialty not specified"}
                  </p>
                  <p className="">Phone Number : {doctor.phoneNumber}</p>
                  <p className="">
                    Consultation Fee : {doctor.doctorDetails.consultationFee}
                  </p>
                  <p className="">
                    Address : {doctor.doctorDetails.address}{" "}
                    {doctor.doctorDetails.city}
                  </p>
                </>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Select a time</h2>
            <p className="mb-4">
              {doctor.doctorName} is available for online booking on the
              following dates and times:
            </p>
            <div className="flex justify-between border-b-2 mb-4">
              <button className="pb-2 border-b-2 border-[#2BA78F]">
                Thursday, Sep 30
              </button>
              <button className="pb-2">Friday, Oct 1</button>
              <button className="pb-2">Saturday, Oct 2</button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Morning</h3>
                <div className="flex flex-wrap gap-2">
                  {schedules
                    .filter((schedule) => {
                      const hour = parseInt(schedule.startTime.split(":")[0]);
                      return hour >= 9 && hour < 12;
                    })
                    .map((schedule) => (
                      <button
                        onClick={() => setSelectedSchedule(schedule)}
                        key={schedule.scheduleId}
                        className={`px-4 py-2 rounded ${
                          schedule.booked ? "bg-red-300" : "bg-green-400"
                        } ${
                          schedule === selectedSchedule ? "bg-blue-400" : ""
                        }`}
                        disabled={schedule.booked}
                      >
                        {formatTime(schedule.startTime)}
                      </button>
                    ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Afternoon</h3>
                <div className="flex flex-wrap gap-2">
                  {schedules
                    .filter((schedule) => {
                      const hour = parseInt(schedule.startTime.split(":")[0]);
                      return hour >= 12 && hour < 18;
                    })
                    .map((schedule) => (
                      <button
                        onClick={() => setSelectedSchedule(schedule)}
                        key={schedule.scheduleId}
                        className={`px-4 py-2 rounded ${
                          schedule.booked ? "bg-red-300" : "bg-green-400"
                        } ${
                          schedule === selectedSchedule ? "bg-blue-400" : ""
                        }`}
                        disabled={schedule.booked}
                      >
                        {formatTime(schedule.startTime)}
                      </button>
                    ))}
                </div>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">
                Reason for Update
              </label>
              <input
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={updateReason}
                onChange={(e) => setUpdateReason(e.target.value)}
              />
            </div>
            <div className="mt-4">
              <button
                onClick={updateAppointment}
                className="w-full bg-[#2BA78F] text-white px-4 py-2 rounded"
              >
                Book an appointment
              </button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default UpdateAppointment;


