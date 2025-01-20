
import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import Schedules from "./Schedules";
import image from "../../../images/image.jpg";
import serviceImage1 from "../../../images/doctorPatient.jpg";
import serviceImage2 from "../../../images/doctorPatient.jpg";
import serviceImage3 from "../../../images/doctorPatient.jpg";
import DoctorNavbar from "../../../components/DoctorNavbar";
import { fetchDoctorById } from "../../../utils/doctorService";
import "react-calendar/dist/Calendar.css";
import { useNavigate } from "react-router-dom";

export default function DoctorHome() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [doctorData, setDoctorData] = useState({});
  const [schedules, setSchedules] = useState([]);
  const navigate = useNavigate();

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    // console.log(selectedDate);
  }, [selectedDate]);

  const [appointments, setAppointments] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL+`/bookingAppointments/doctor/${localStorage.getItem("userId")}`
      );
      const data = await response.json();
      setAppointments(data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const doctor = await fetchDoctorById(localStorage.getItem("doctorId"));
        setDoctorData(doctor);
        const response = await fetch(
          process.env.REACT_APP_BACKEND_URL+`/schedule/doctor/${doctor.doctorId}/date/${formatDate(selectedDate)}`
        );
        const data = await response.json();
        setSchedules(Array.isArray(data) ? data : []);
        // console.log(data);
      } catch (error) {
        console.error("Failed to fetch doctor data:", error);
      }
    };

    fetchDoctorData();
  }, [selectedDate]);

  const formatTime = (time) => {
    const [hours, minutes] = time.split(":");
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    const options = { hour: "numeric", minute: "numeric", hour12: true };
    return date.toLocaleTimeString([], options);
  };

  const createSchedule = async () => {
    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL+`/create-appointment-slots/date/${formatDate(selectedDate)}`,
        {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(doctorData),
        }
      );
      if (response.ok) {
        console.log("Schedule created successfully");
        // Fetch the updated schedules after creation
        const data = await response.json();
        setSchedules(Array.isArray(data) ? data : []);
      } else {
        console.error("Failed to create schedule");
      }
    } catch (error) {
      console.error("Error creating schedule:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <DoctorNavbar />

      <div className="bg-white flex-grow">
        <main className="flex flex-col justify-center items-center h-full py-10 md:py-20 px-4 md:px-0">
          <div className="bg-white p-8 rounded-lg shadow-md flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8 max-w-full md:max-w-[70vw]">
            <img src={image} alt="Health" className="rounded-lg w-full md:w-1/2" />
            <div>
              <h1 className="text-4xl md:text-4xl font-bold mb-4 text-center md:text-left">
                Welcome Dr.{doctorData?.doctorName},
              </h1>
              <h1 className="text-2xl md:text-4xl font-bold mb-4 text-center md:text-left">
                Welcome to Your MediHealth Dashboard
              </h1>
              <p className="text-lg mb-6 text-center md:text-left">
                Manage your appointments and schedules with ease.
              </p>
              <button onClick={() => navigate("/doctor/history")} className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700">
                Check Today's Schedule
              </button>
            </div>
          </div>
        </main>
      </div>

      <div className="flex flex-col md:flex-row justify-around space-y-4 md:space-y-0 md:space-x-10 mx-auto my-8 md:w-[80vw] px-4 md:px-0">
        <div className="flex justify-center md:block">
          <div className="bg-white rounded-lg shadow-md p-4">
            <Calendar
              onChange={handleDateChange}
              value={selectedDate}
              className="border-2 border-gray-200 p-2 rounded-lg shadow-md w-full"
              calendarClassName="custom-calendar"
            />
          </div>
        </div>

        <div className="w-full md:[80vw] bg-white rounded-lg shadow-md p-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Doctor Schedules</h2>
          {!selectedDate && <p className="text-gray-500">No date selected.</p>}
          {schedules.length > 0 ? (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Morning</h3>
                <div className="flex flex-wrap gap-2 justify-center">
                  {schedules
                    .filter((schedule) => {
                      const hour = parseInt(schedule.startTime.split(":")[0]);
                      return hour >= 9 && hour < 12;
                    })
                    .map((schedule) => (
                      <button
                        key={schedule.scheduleId}
                        className={`px-4 py-2 rounded ${
                          schedule.booked ? "bg-red-300" : "bg-green-400"
                        } `}
                        disabled={schedule.booked}
                      >
                        {formatTime(schedule.startTime)}
                      </button>
                    ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Afternoon</h3>
                <div className="flex flex-wrap gap-2 justify-center">
                  {schedules
                    .filter((schedule) => {
                      const hour = parseInt(schedule.startTime.split(":")[0]);
                      return hour >= 12 && hour < 18;
                    })
                    .map((schedule) => (
                      <button
                        key={schedule.scheduleId}
                        className={`px-4 py-2 rounded ${
                          schedule.booked ? "bg-red-300" : "bg-green-400"
                        } `}
                        disabled={schedule.booked}
                      >
                        {formatTime(schedule.startTime)}
                      </button>
                    ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              <p className="font-semibold text-2xl my-4">
                Not yet Created the Schedule. Click the button below to generate the
                schedule.
              </p>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded mt-4 mx-auto"
                onClick={createSchedule}
              >
                Create Schedule
              </button>
            </>
          )}
          {/* {console.log(selectedDate)} */}
          {/* {new Date(selectedDate).toISOString().split('T')[0]} */}
          {selectedDate && <Schedules date={formatDate(selectedDate)} />}
        </div>
      </div>

      <main className="flex-grow">
        <section className="bg-[#f7fafa] py-20">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold text-[#0a2822] mb-12">
              Our Services
            </h2>
            <div className="flex flex-wrap justify-center">
              <div className="w-full md:w-1/2 lg:w-1/3 p-4">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <img
                    src={serviceImage1}
                    alt="Service 1"
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-[#0a2822] mb-4">
                      Consultations
                    </h3>
                    <p className="text-gray-700">
                      Get expert advice from our experienced doctors.
                    </p>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-1/2 lg:w-1/3 p-4">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <img
                    src={serviceImage2}
                    alt="Service 2"
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-[#0a2822] mb-4">
                      Diagnostics
                    </h3>
                    <p className="text-gray-700">
                      Comprehensive diagnostic services for accurate results.
                    </p>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-1/2 lg:w-1/3 p-4">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <img
                    src={serviceImage3}
                    alt="Service 3"
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-[#0a2822] mb-4">
                      Emergency Care
                    </h3>
                    <p className="text-gray-700">
                      24/7 emergency services for urgent medical needs.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white py-6">
        <div className="container mx-auto text-center">
          <p className="text-gray-700">
            &copy; 2024 Healthcare System. All r ights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
