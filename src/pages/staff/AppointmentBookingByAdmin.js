import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { getAllDoctors } from '../../services/doctor/doctor_api';
import { getDoctorSchedule } from '../../services/appointment';
import { getBookingAppointments, createAppointment } from '../../services/appointment';
import { getAllPatients } from '../../services/patient/patient_api';

const AdminBookSlot = () => {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Base URL from environment
  const BASE = process.env.REACT_APP_BACKEND_URL || "";

  // 1) Fetch all patients (unwrap `content` from Page<User>)
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const json = await getAllPatients(0, 100);
        setPatients(Array.isArray(json.content) ? json.content : []);
      } catch (err) {
        toast.error(err.message);
      }
    };
    fetchPatients();
  }, [BASE]);

  // 2) Fetch all available doctors (unwrap `content` from Page<User>)
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const json = await getAllDoctors(0, 100);
        setDoctors(json.content || []);
      } catch (err) {
        toast.error(err.message);
      }
    };
    fetchDoctors();
  }, [BASE]);

  // 3) Whenever selectedDoctor changes, fetch his/her schedule
  useEffect(() => {
    if (!selectedDoctor) {
      setSchedules([]);
      setSelectedSchedule(null);
      return;
    }

    const fetchSchedules = async () => {
      try {
        const json = await getDoctorSchedule(selectedDoctor.id);
        setSchedules(Array.isArray(json) ? json : []);
      } catch (err) {
        toast.error(err.message);
      }
    };
    fetchSchedules();
  }, [selectedDoctor, BASE]);

  // 4) Booking an appointment
  const bookAppointment = async () => {
    if (!selectedPatient || !selectedDoctor || !selectedSchedule) {
      toast.error("Please select a patient, a doctor, and a slot.");
      return;
    }

    const bookingData = {
      patientId: selectedPatient.id,
      doctorId: selectedDoctor.id,
      scheduleId: selectedSchedule.scheduleId,
    };

    try {
      setIsLoading(true);
      const created = await createAppointment(bookingData);
      toast.success("Appointment booked successfully!");
      navigate(`/token/${created.token}`);
    } catch (err) {
      toast.error('Failed to book appointment: ' + (err.message || 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  // 5) Utility to format "HH:mm" into e.g. "10:30 AM"
  const formatTime = (time) => {
    const [hh, mm] = time.split(":").map(Number);
    const d = new Date();
    d.setHours(hh, mm);
    return d.toLocaleTimeString([], { hour: "numeric", minute: "numeric", hour12: true });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
      <div className="w-full max-w-4xl p-6 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-6">Book an Appointment</h1>

        {/* 1) Patient Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Patient
          </label>
          <select
            className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2 bg-white hover:shadow-md transition-all duration-200"
            value={selectedPatient?.id || ""}
            onChange={(e) => {
              const pid = parseInt(e.target.value, 10);
              const found = patients.find((p) => p.id === pid) || null;
              setSelectedPatient(found);
            }}
          >
            <option value="" disabled className="text-gray-500">
              -- Select a patient --
            </option>
            {patients.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.userId} – {patient.username}
              </option>
            ))}
          </select>
        </div>
        {/* 2) Doctor Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Doctor
          </label>
          <select
            className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2 bg-white hover:shadow-md transition-all duration-200"
            value={selectedDoctor?.id || ""}
            onChange={(e) => {
              const did = parseInt(e.target.value, 10);
              const found = doctors.find((d) => d.id === did) || null;
              setSelectedDoctor(found);
            }}
          >
            <option value="" disabled className="text-gray-500">
              -- Select a doctor --
            </option>
            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.userId} – {doctor.username}
              </option>
            ))}
          </select>
        </div>

        {/* 3) Schedule Slots (Morning / Afternoon) */}
        {selectedDoctor && (
          <div className="space-y-4 mb-6">
            <div>
              <h3 className="font-semibold mb-2">Morning</h3>
              <div className="flex flex-wrap gap-2">
                {schedules
                  .filter((sch) => {
                    const hr = parseInt(sch.startTime.split(":")[0], 10);
                    return hr >= 9 && hr < 12;
                  })
                  .map((sch) => (
                    <button
                      key={sch.scheduleId}
                      onClick={() => setSelectedSchedule(sch)}
                      disabled={sch.booked}
                      className={`px-4 py-2 rounded transition-all duration-150
                        ${
                          sch.booked
                            ? "bg-red-300 cursor-not-allowed"
                            : "bg-green-400 hover:bg-green-500"
                        }
                        ${
                          sch === selectedSchedule ? "bg-blue-400 text-white" : ""
                        }`}
                    >
                      {formatTime(sch.startTime)}
                    </button>
                  ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Afternoon</h3>
              <div className="flex flex-wrap gap-2">
                {schedules
                  .filter((sch) => {
                    const hr = parseInt(sch.startTime.split(":")[0], 10);
                    return hr >= 12 && hr < 18;
                  })
                  .map((sch) => (
                    <button
                      key={sch.scheduleId}
                      onClick={() => setSelectedSchedule(sch)}
                      disabled={sch.booked}
                      className={`px-4 py-2 rounded transition-all duration-150
                        ${
                          sch.booked
                            ? "bg-red-300 cursor-not-allowed"
                            : "bg-green-400 hover:bg-green-500"
                        }
                        ${
                          sch === selectedSchedule ? "bg-blue-400 text-white" : ""
                        }`}
                    >
                      {formatTime(sch.startTime)}
                    </button>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* 4) Book Button */}
        <div className="mt-4">
          <button
            onClick={bookAppointment}
            disabled={isLoading}
            className={`w-full text-white px-4 py-2 rounded transition-all duration-150
              ${isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-[#2BA78F] hover:bg-green-600"}`}
          >
            {isLoading ? "Booking..." : "Book Appointment"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminBookSlot;
