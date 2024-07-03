import React, { useEffect, useState } from "react";
import profile1 from "../images/doctorPatient.jpg";
import PatientNavbar from "../components/PatientNavbar";
import { useNavigate } from "react-router-dom";
export default function PatientHistory() {
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `http://localhost:8080/bookingAppointments/patient/${localStorage.getItem(
          "userId"
        )}`
      );
      const data = await response.json();
      setAppointments(data);
    };
    fetchData();
  }, []);
  return (
    <>
      <PatientNavbar />
      <div className="max-w-4xl mx-auto mt-8 p-4">
        <h1 className="text-2xl font-bold mb-6">Past Appointments</h1>
        <ul>
          {console.log(appointments)}
          {appointments?.map((appointment) => (
            <li
              key={appointment.id}
              onClick={()=>navigate(`/token/${appointment?.token}`)}
              className="flex items-center justify-between mb-4"
            >
              <div className="flex items-center">
                <img
                  className="h-12 w-12 rounded-full object-cover mr-4"
                  src={profile1}
                  alt={appointment?.doctorId?.doctorName}
                />
                <div>
                  <h2 className="text-lg font-semibold">
                    {appointment?.doctorId?.doctorName}
                  </h2>
                  <p className="text-gray-600">
                    {appointment?.doctorId?.doctorDetails?.specialization}
                  </p>
                  <p className="text-gray-600">
                    {appointment?.token}
                  </p>
                </div>
              </div>
              <div className="text-gray-600">
                {appointment?.scheduleId?.date}{" "}
                {appointment?.scheduleId?.startTime}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
