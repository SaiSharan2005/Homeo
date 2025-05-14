import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PrescriptionForm from '../prescription/PrescriptionForm';
import PrescriptionReport from '../prescription/PrescriptionDetails';
import image from '../../images/image.jpg';
import PatientAppointmentsPage from './PatientAppointment';
const CompleteSlot = () => {
  const { tokenId } = useParams();
  const navigate = useNavigate();
  const [appointmentData, setAppointmentData] = useState(null);
  const [createdPrescription, setCreatedPrescription] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isCancel, setIsCancel] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
  const [role, setRole] = useState(null);

  useEffect(() => {
    setRole(localStorage.getItem("ROLE"));
  }, []);

  useEffect(() => {
    const fetchAppointmentData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/bookingAppointments/token/${tokenId}`);
        if (!response.ok) throw new Error('Failed to fetch appointment data');
        const data = await response.json();
        setAppointmentData(data);

        if (data.status === "completed") setIsCompleted(true);
        else if (data.status === "cancel") setIsCancel(true);

        if (data.bookingId) fetchPrescriptionByBooking(data.bookingId);
      } catch (error) {
        console.error('Error fetching appointment data:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchPrescriptionByBooking = async (bookingId) => {
      try {
        const resp = await fetch(`${process.env.REACT_APP_BACKEND_URL}/prescriptions/booking/${bookingId}`);
        if (resp.ok) {
          const prescriptionData = await resp.json();
          setCreatedPrescription(prescriptionData);
        }
      } catch (err) {
        console.error('No existing prescription found for this booking', err);
      }
    };

    fetchAppointmentData();
  }, [tokenId]);
  const handleAppointmentCompleted = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/bookingAppointments/completed-appointment/${tokenId}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        }
      );
      if (!response.ok) throw new Error('Failed to mark appointment as completed');
      const data = await response.json();
      // Update state or handle the response here as needed
    } catch (error) {
      console.error('Error completing appointment:', error);
    }
  };
  
  // Handle navigation for DOCTOR and PATIENT roles
  const handleCardClick = () => {
    if (role === "DOCTOR" && appointmentData?.patient?.id) {
      navigate(`/${role.toLowerCase()}/patient/profile/${appointmentData.patient.userId}`);
    } else if (role === "PATIENT" && appointmentData?.doctor?.id) {
      navigate(`/${role.toLowerCase()}/doctor/profile/${appointmentData.doctor.userId}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600 text-center mt-8">Error: {error}</div>;
  }

  if (!appointmentData) {
    return <div className="text-center mt-8">Error: Appointment data is not available</div>;
  }

  // Extract reusable data
  const { patient, doctor } = appointmentData;

  return (
    <>
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl p-8">
        <div className="flex flex-col md:flex-row justify-between items-center border-b pb-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Appointment Report</h1>
          <button className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow transition-colors">
            🖨 Print Report
          </button>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {role === "ADMIN" ? (
            <>
              {/* Patient Details Card */}
              <div 
                className="bg-gray-50 hover:shadow-xl rounded-xl p-6 cursor-pointer"
                onClick={() => navigate(`/admin/patient/profile/${patient.userId}`)}
              >
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Patient Details</h2>
                <div className="flex flex-col items-center">
                  <img
                    src={image}
                    alt="Patient"
                    className="w-24 h-24 rounded-full object-cover mb-4 border-2 border-gray-300 shadow-md"
                  />
                  <div className="w-full">
                    <p className="mb-1"><span className="font-semibold">Name:</span> {patient.username}</p>
                    <p className="mb-1"><span className="font-semibold">Email:</span> {patient.email}</p>
                    <p className="mb-1"><span className="font-semibold">Phone:</span> {patient.phoneNumber}</p>
                    <p className="mb-1"><span className="font-semibold">ID:</span> {patient.patientDetails?.id || 'N/A'}</p>
                    <p className="mb-1"><span className="font-semibold">City:</span> {patient.patientDetails?.city || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Doctor Details Card */}
              <div 
                className="bg-gray-50 hover:shadow-xl rounded-xl p-6 cursor-pointer"
                onClick={() => navigate(`/admin/doctor/profile/${doctor.userId}`)}
              >
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Doctor Details</h2>
                <div className="flex flex-col items-center">
                  <img
                    src={image}
                    alt="Doctor"
                    className="w-24 h-24 rounded-full object-cover mb-4 border-2 border-gray-300 shadow-md"
                  />
                  <div className="w-full">
                    <p className="mb-1"><span className="font-semibold">Name:</span> {doctor.username}</p>
                    <p className="mb-1"><span className="font-semibold">Email:</span> {doctor.email}</p>
                    <p className="mb-1"><span className="font-semibold">Phone:</span> {doctor.phoneNumber}</p>
                    <p className="mb-1"><span className="font-semibold">ID:</span> {doctor.doctorDetails?.id || 'N/A'}</p>
                    <p className="mb-1"><span className="font-semibold">City:</span> {doctor.doctorDetails?.city || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            // For DOCTOR or PATIENT roles, show one role-based card.
            <div 
              className="bg-gray-50 hover:shadow-xl rounded-xl p-6 cursor-pointer" 
              onClick={handleCardClick}
            >
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                {role === "DOCTOR" ? "Patient Details" : "Doctor Details"}
              </h2>
              <div className="flex flex-col items-center">
                <img
                  src={image}
                  alt="User"
                  className="w-24 h-24 rounded-full object-cover mb-4 border-2 border-gray-300 shadow-md"
                />
                <div className="w-full">
                  {role === "DOCTOR" ? (
                    <>
                      <p className="mb-1"><span className="font-semibold">Name:</span> {patient.username}</p>
                      <p className="mb-1"><span className="font-semibold">Email:</span> {patient.email}</p>
                      <p className="mb-1"><span className="font-semibold">Phone:</span> {patient.phoneNumber}</p>
                      <p className="mb-1">
                        <span className="font-semibold">ID:</span> {patient.patientDetails?.id || 'N/A'}
                      </p>
                      <p className="mb-1">
                        <span className="font-semibold">City:</span> {patient.patientDetails?.city || 'N/A'}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="mb-1"><span className="font-semibold">Name:</span> {doctor.username}</p>
                      <p className="mb-1"><span className="font-semibold">Email:</span> {doctor.email}</p>
                      <p className="mb-1"><span className="font-semibold">Phone:</span> {doctor.phoneNumber}</p>
                      <p className="mb-1">
                        <span className="font-semibold">ID:</span> {doctor.doctorDetails?.id || 'N/A'}
                      </p>
                      <p className="mb-1">
                        <span className="font-semibold">City:</span> {doctor.doctorDetails?.city || 'N/A'}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Appointment Details Card */}
          <div className="bg-gray-50 hover:shadow-xl rounded-xl p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Appointment Details</h2>
            <p className="mb-2"><span className="font-semibold">Token:</span> {appointmentData.token}</p>
            <p className="mb-2"><span className="font-semibold">Date:</span> {appointmentData.scheduleId?.date}</p>
            <p className="mb-2">
              <span className="font-semibold">Time:</span> {appointmentData.scheduleId?.startTime} - {appointmentData.scheduleId?.endTime}
            </p>
            <p className="mb-2"><span className="font-semibold">Status:</span> {appointmentData.status}</p>
          </div>
        </div>

        {/* Doctor-specific controls */}
        {role === "DOCTOR" && appointmentData.status === "Upcoming" && (
          <div className="flex justify-center mb-8">
            <button
              onClick={handleAppointmentCompleted}
              className={`px-6 py-3 rounded-lg font-medium text-white transition-colors shadow ${
                isCompleted ? 'bg-green-500 hover:bg-green-600' :
                isCancel ? 'bg-red-500' :
                'bg-blue-500 hover:bg-blue-600'
              }`}
              disabled={isCompleted || isCancel}
            >
              {isCancel ? 'Appointment Cancelled' : isCompleted ? 'Appointment Completed' : 'Mark Appointment as Completed'}
            </button>
          </div>
        )}

        {/* Patient status note for PATIENT role */}
        {role === "PATIENT" && (
          <div className="bg-blue-50 text-blue-700 px-4 py-3 rounded mb-8 text-center font-semibold">
            Appointment Status: {appointmentData.status}
          </div>
        )}

        {/* Prescription Section */}
        {createdPrescription ? (
          <PrescriptionReport prescription={createdPrescription} />
        ) : (
          role === "DOCTOR" && (
            <div className="flex justify-center">
              <button
                onClick={() => setShowPrescriptionForm(true)}
                className="bg-purple-500 hover:bg-purple-600 text-white py-3 px-6 rounded-lg shadow transition-colors"
              >
                ➕ Add Prescription
              </button>
            </div>
          )
        )}
      </div>

      {/* Modal: Prescription Form */}
      {showPrescriptionForm && (
        <PrescriptionForm
          onClose={() => setShowPrescriptionForm(false)}
          onPrescriptionCreated={(prescription) => {
            setCreatedPrescription(prescription);
          }}
          doctorId={doctor.id}
          patientId={patient.id}
          bookingAppointmentId={appointmentData.bookingId}
        />
      )}

      {/* Modal: Prescription Image */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-white p-4 rounded-lg shadow-xl relative w-[90%] h-[90%] flex flex-col">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-3xl font-bold text-gray-700 hover:text-gray-900"
            >
              &times;
            </button>
            <img
              src={appointmentData.prescriptionImageUrl}
              alt="Prescription"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}

{role === "DOCTOR" && appointmentData.patient?.id && (
        <div className="mt-8">
          <PatientAppointmentsPage
            patientId={appointmentData.patient.id}
            patientUsername={appointmentData.patient.username}

          />




          
        </div>
      )}

    </>
  );
};

export default CompleteSlot;
