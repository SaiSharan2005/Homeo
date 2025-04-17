import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  FaPhone, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaBriefcase, 
  FaCalendarAlt, 
  FaClock, 
  FaStethoscope, 
  FaMobileAlt 
} from "react-icons/fa";
import AppointmentsPage from "../../../components/appointment/Appointments";

// Pencil icon for edit mode
const PencilIcon = ({ onClick }) => (
  <svg
    className="w-6 h-6 text-gray-700 hover:text-[#228672] absolute top-2 right-2 cursor-pointer"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    onClick={onClick}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M15 3l6 6-9 9-6-6 9-9zm-6 6l-2 5 5-2 9-9-3-3-9 9z"
    ></path>
  </svg>
);

// Helper to format time (removes seconds)
const formatTime = (timeString) => (timeString ? timeString.substring(0, 5) : "");

const DoctorProfile = ({ appointments: appointmentsProp }) => {
  const [doctor, setDoctor] = useState(null);
  const [doctorDetails, setDoctorDetails] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  // Get doctorId from route parameters (if provided)
  const { doctorId } = useParams();
  const navigate = useNavigate();

  // Fetch doctor data. If a doctorId is provided (admin or other user viewing a profile), fetch using that ID.
  // Otherwise, fetch the details of the currently authenticated doctor.
  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const url = doctorId 
          ? `${process.env.REACT_APP_BACKEND_URL}/doctor/${doctorId}` 
          : `${process.env.REACT_APP_BACKEND_URL}/doctor/me`;
        const res = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("Token")}`,
          },
        });
        if (!res.ok) {
          throw new Error("Failed to fetch doctor data");
        }
        const data = await res.json();
        setDoctor(data);
        setDoctorDetails(data.doctorDetails || {});
      } catch (error) {
        console.error("Error fetching doctor data:", error);
      }
    };
    fetchDoctorData();
  }, [doctorId]);

  // Fetch appointments.
  // If appointmentsProp is passed, use it;
  // Otherwise, fetch appointments using the appropriate route.
  useEffect(() => {
    const loadAppointments = async () => {
      try {
        let url;
        if (doctorId) {
          // Use the provided doctorId from the route.
          url = `${process.env.REACT_APP_BACKEND_URL}/bookingAppointments/doctor/${doctorId}`;
        } else {
          // Otherwise, use the logged-in doctor's appointments route.
          url = `${process.env.REACT_APP_BACKEND_URL}/bookingAppointments/doctor/my-appointments`;
        }
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("Token")}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch appointments");
        }
        const data = await response.json();
        setAppointments(data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    if (appointmentsProp && appointmentsProp.length > 0) {
      setAppointments(appointmentsProp);
    } else {
      loadAppointments();
    }
  }, [appointmentsProp, doctorId]);

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDoctorDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSave = () => {
    // Save changes logic goes here.
    setIsEditing(false);
  };

  if (!doctor) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {/* Top Banner with Background Image */}
      <div
        className="relative w-full bg-cover bg-center"
        style={{
          backgroundImage: `url("https://via.placeholder.com/1920x400")`,
        }}
      >
        <div className="relative max-w-7xl mx-auto px-4 h-full flex items-end pb-4">
          <div className="bg-white shadow-md rounded-lg p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4 w-full">
            <div className="relative">
              <div className="absolute -inset-1 bg-green-100 rounded-full" />
              <img
                src={doctor.imageUrl || `https://picsum.photos/seed/${doctor.id}/200/200`}
                alt="Doctor"
                className="relative w-24 h-24 rounded-full object-cover border-2 border-green-400"
              />
            </div>
            <div>
              <h2 className="text-xl font-bold">{doctor.username}</h2>
              <p className="text-sm text-gray-600 mt-1">
                {doctorDetails.specialization || "ENT Doctor"}
              </p>
              <p className="text-sm text-gray-500">
                {doctorDetails.address || "Siloam Hospitals"}, {" "}
                {doctorDetails.city || "West Bekasi, Bekasi"}
              </p>
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mt-2">
                <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-md">
                  BFS Full-time
                </span>
                <span className="px-2 py-1 bg-green-50 text-green-600 rounded-md">
                  250k - 350k
                </span>
                <span className="px-2 py-1 bg-yellow-50 text-yellow-600 rounded-md">
                  94%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-8 px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left/Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Doctor Profile Section */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">Doctor Profile</h3>
            <p className="text-gray-700 leading-relaxed">
              With a seasoned career spanning four years, our ENT specialist brings
              a wealth of experience and expertise to the field. Having dedicated
              their professional journey to ear, nose, and throat health, they have
              honed their skills in diagnosing and treating a wide range of conditions.
              Their commitment to staying abreast of the latest advancements ensures
              that patients receive cutting-edge care.
            </p>
          </div>

          {/* Practice Experience Section */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Practice Experience</h3>
            </div>
            {/* Experience 1 */}
            <div className="border-b border-gray-200 pb-4 mb-4">
              <h4 className="font-semibold text-gray-800">
                Siloam Hospitals Bekasi Timur
              </h4>
              <p className="text-gray-600 text-sm">
                ENT Doctor - Neutrologi • Online Consultation
              </p>
              <p className="text-gray-500 text-sm">
                Dec 2022 - Present • 2 yrs 1 mos
              </p>
            </div>
            {/* Experience 2 */}
            <div>
              <h4 className="font-semibold text-gray-800">
                Mitra Keluarga Pratama Jatiasih
              </h4>
              <p className="text-gray-600 text-sm">
                ENT Doctor - Otologi • Full-time
              </p>
              <p className="text-gray-500 text-sm">
                Dec 2021 - Present • 1 yrs 11 mos
              </p>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Contact Information Card */}
          <div className="bg-white shadow-sm rounded-lg p-6 relative">
            <h3 className="flex justify-between items-center font-bold mb-3">
              Contact Information
              {!isEditing && <PencilIcon onClick={toggleEditMode} />}
            </h3>
            <hr className="my-2" />
            {isEditing ? (
              <div className="flex flex-col space-y-2">
                <div className="flex justify-between">
                  <label htmlFor="address" className="font-semibold">
                    <FaMapMarkerAlt className="inline mr-1 text-green-600" />
                    Address:
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={doctorDetails.address || ""}
                    onChange={handleInputChange}
                    className="border border-gray-300 p-2 rounded-md w-2/3"
                  />
                </div>
                <div className="flex justify-between">
                  <label htmlFor="specialization" className="font-semibold">
                    <FaBriefcase className="inline mr-1 text-green-600" />
                    Specialization:
                  </label>
                  <input
                    type="text"
                    id="specialization"
                    name="specialization"
                    value={doctorDetails.specialization || ""}
                    onChange={handleInputChange}
                    className="border border-gray-300 p-2 rounded-md w-2/3"
                  />
                </div>
                <div className="flex justify-between">
                  <label htmlFor="experience" className="font-semibold">
                    <FaBriefcase className="inline mr-1 text-green-600" />
                    Experience:
                  </label>
                  <input
                    type="text"
                    id="experience"
                    name="experience"
                    value={doctorDetails.experience || ""}
                    onChange={handleInputChange}
                    className="border border-gray-300 p-2 rounded-md w-2/3"
                  />
                </div>
                <div className="flex justify-between">
                  <label htmlFor="phoneNumber" className="font-semibold">
                    <FaPhone className="inline mr-1 text-green-600" />
                    Phone Number:
                  </label>
                  <input
                    type="text"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={doctor.phoneNumber || ""}
                    onChange={handleInputChange}
                    className="border border-gray-300 p-2 rounded-md w-2/3"
                  />
                </div>
                <div className="flex justify-between">
                  <label htmlFor="email" className="font-semibold">
                    <FaEnvelope className="inline mr-1 text-green-600" />
                    Email:
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={doctor.email || ""}
                    onChange={handleInputChange}
                    className="border border-gray-300 p-2 rounded-md w-2/3"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleSave}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md mt-4"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                <div className="flex justify-between">
                  <span className="font-semibold">
                    <FaMapMarkerAlt className="inline mr-1 text-green-600" />
                    Address:
                  </span>
                  <span>{doctorDetails.address}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">
                    <FaBriefcase className="inline mr-1 text-green-600" />
                    Specialization:
                  </span>
                  <span>{doctorDetails.specialization}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">
                    <FaBriefcase className="inline mr-1 text-green-600" />
                    Experience:
                  </span>
                  <span>{doctorDetails.experience} years</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">
                    <FaPhone className="inline mr-1 text-green-600" />
                    Phone Number:
                  </span>
                  <span>{doctor.phoneNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">
                    <FaEnvelope className="inline mr-1 text-green-600" />
                    Email:
                  </span>
                  <span>{doctor.email}</span>
                </div>
              </div>
            )}
          </div>

          {/* Upcoming Appointments Card */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h3 className="font-bold text-lg mb-3">Upcoming Appointments</h3>
            <hr className="my-2" />
            <div className="flex flex-col space-y-4 mt-2 text-sm text-gray-700">
              {appointments.length > 0 ? (
                appointments.map((appointment) => (
                  <div key={appointment.bookingId}>
                    <h4 className="font-medium">
                      Appointment with {appointment.patient.username}
                    </h4>
                    <p className="text-gray-500 flex items-center">
                      <FaCalendarAlt className="mr-1 text-green-600" />
                      Date: {appointment.scheduleId.date}
                    </p>
                    <p className="text-gray-500 flex items-center">
                      <FaClock className="mr-1 text-green-600" />
                      Time: {formatTime(appointment.scheduleId.startTime)} -{" "}
                      {formatTime(appointment.scheduleId.endTime)}
                    </p>
                  </div>
                ))
              ) : (
                <p>No upcoming appointments.</p>
              )}
            </div>
          </div>

          {/* Medical Actions Card */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h3 className="flex items-center text-lg font-semibold mb-3">
              <FaStethoscope className="mr-2 text-green-600" />
              Medical Actions
            </h3>
            <ul className="space-y-2 text-sm text-gray-700 list-disc list-inside">
              <li>BERA (Brainstem Response Audiometry)</li>
              <li>ENT Surgery</li>
              <li>ENT Corpus Alienum</li>
              <li>Ear Endoscopy</li>
              <li>Ear Irrigation</li>
              <li>Titioplasty</li>
              <li>Hearing Test</li>
            </ul>
            <button className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors">
              Make Appointment
            </button>
          </div>

          {/* Download App Card */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h3 className="flex items-center text-lg font-semibold mb-3">
              <FaMobileAlt className="mr-2 text-green-600" />
              Download App
            </h3>
            <p className="text-sm text-gray-700 mb-4">
              Get the best experience by downloading our mobile app.
            </p>
            <img
              src="https://via.placeholder.com/300x150"
              alt="Download App Banner"
              className="w-full h-auto rounded"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
