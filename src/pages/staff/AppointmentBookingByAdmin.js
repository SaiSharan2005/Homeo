import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const BookSlot = () => {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch all patients
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/patient/all`
        );
        if (!response.ok) throw new Error("Failed to fetch patients");
        const data = await response.json();
        setPatients(data);
      } catch (error) {
        alert(error.message);
      }
    };
    fetchPatients();
  }, []);

  // Fetch all available doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/doctor/availableDoctors`
        );
        if (!response.ok) throw new Error("Failed to fetch doctors");
        const data = await response.json();
        setDoctors(data);
      } catch (error) {
        alert(error.message);
      }
    };
    fetchDoctors();
  }, []);

  // Fetch doctor's schedule when a doctor is selected
  useEffect(() => {
    if (selectedDoctor) {
      const fetchSchedules = async () => {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/schedule/doctor/${selectedDoctor.id}`
          );
          if (!response.ok) throw new Error("Failed to fetch schedules");
          const data = await response.json();
          setSchedules(data);
        } catch (error) {
          alert(error.message);
        }
      };
      fetchSchedules();
    }
  }, [selectedDoctor]);

  const bookAppointment = async () => {
    if (!selectedPatient || !selectedDoctor || !selectedSchedule) {
      alert("Please select a patient, doctor, and slot.");
      return;
    }

    const bookingData = {
      patientId: selectedPatient.id,
      doctorId: selectedDoctor.id,
      scheduleId: selectedSchedule.scheduleId,
    };

    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/bookingAppointments/byStaff`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bookingData),
        }
      );

      if (!response.ok) throw new Error("Failed to book appointment");
      const data = await response.json();
      alert("Appointment booked successfully!");
      navigate(`/token/${data.token}`);
    } catch (error) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(":");
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    const options = { hour: "numeric", minute: "numeric", hour12: true };
    return date.toLocaleTimeString([], options);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
      <div className="w-full max-w-4xl p-6 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-6">Book an Appointment</h1>
{/* Patient Selection */}
<div className="mb-6">
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Select Patient
  </label>
  <select
    className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2 bg-white hover:shadow-md transition-all duration-200"
    value={selectedPatient?.id || ""}
    onChange={(e) =>
      setSelectedPatient(
        patients.find(
          (patient) => patient.id === parseInt(e.target.value)
        )
      )
    }
  >
    <option value="" disabled className="text-gray-500">
      Select a patient
    </option>
    {patients.map((patient) => (
      <option key={patient.id} value={patient.id}>
        {patient.userId} - {patient.username}
      </option>
    ))}
  </select>
</div>

{/* Doctor Selection */}
<div className="mb-6">
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Select Doctor
  </label>
  <select
    className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2 bg-white hover:shadow-md transition-all duration-200"
    value={selectedDoctor?.id || ""}
    onChange={(e) =>
      setSelectedDoctor(
        doctors.find((doctor) => doctor.id === parseInt(e.target.value))
      )
    }
  >
    <option value="" disabled className="text-gray-500">
      Select a doctor
    </option>
    {doctors.map((doctor) => (
      <option key={doctor.id} value={doctor.id}>
        {doctor.userId} - {doctor.username}
      </option>
    ))}
  </select>
</div>

        {/* Schedule Slots */}
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
              <button
                onClick={bookAppointment}
                className="w-full bg-[#2BA78F] text-white px-4 py-2 rounded"          disabled={isLoading}

              >
          {isLoading ? "Booking..." : "Book Appointment"}
          </button>
            </div>
      </div>
    </div>
  );
};

export default BookSlot;
