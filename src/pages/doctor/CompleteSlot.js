import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PatientNavbar from '../../components/navbar/PatientNavbar';
import PrescriptionForm from '../../components/prescription/PrescriptionForm';
import PrescriptionReport from '../../components/prescription/PrescriptionDetails';
import image from '../../images/image.jpg';
import DoctorNavbar from '../../components/navbar/DoctorNavbar';

const CompleteSlot = () => {
  const { tokenId } = useParams();
  const [appointmentData, setAppointmentData] = useState(null);
  const [createdPrescription, setCreatedPrescription] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isCancel, setIsCancel] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);

  useEffect(() => {
    const fetchAppointmentData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/bookingAppointments/token/${tokenId}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch appointment data');
        }
        const data = await response.json();
        setAppointmentData(data);
        if (data.status === "completed") {
          setIsCompleted(true);
        } else if (data.status === "cancel") {
          setIsCancel(true);
        }
        // Fetch prescription if bookingId exists
        if (data.bookingId) {
          fetchPrescriptionByBooking(data.bookingId);
        }
      } catch (error) {
        console.error('Error fetching appointment data:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchPrescriptionByBooking = async (bookingId) => {
      try {
        const resp = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/prescriptions/booking/${bookingId}`
        );
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
          headers: { 'Content-Type': 'application/json' }
        }
      );
      if (!response.ok) {
        throw new Error('Failed to mark appointment as completed');
      }
      const data = await response.json();
      console.log('Appointment completed:', data);
      setIsCompleted(true);
    } catch (error) {
      console.error('Error completing appointment:', error);
      setError('Failed to complete the appointment. Please try again.');
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
    return (
      <div className="text-red-600 text-center mt-8">
        Error: {error}
      </div>
    );
  }

  if (!appointmentData) {
    return (
      <div className="text-center mt-8">
        Error: Appointment data is not available
      </div>
    );
  }

  return (
    <>
      {/* <DoctorNavbar /> */}
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-xl p-8">
          {/* Report Header */}
          <div className="flex justify-between items-center border-b pb-4 mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Appointment Report</h1>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 shadow">
              Print Report
            </button>
          </div>

          {/* Patient & Appointment Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Patient Details Card */}
            <div className="bg-gray-100 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">Patient Details</h2>
              <img
                src={image}
                alt={`Patient ${appointmentData.patient.username}`}
                className="w-24 h-24 rounded-full object-cover mb-4 mx-auto"
              />
              <p><span className="font-medium">Name:</span> {appointmentData.patient.username}</p>
              <p>
                <span className="font-medium">ID:</span>{' '}
                {appointmentData.patient.patientDetails ? appointmentData.patient.patientDetails.id : 'N/A'}
              </p>
              <p><span className="font-medium">Phone:</span> {appointmentData.patient.phoneNumber}</p>
              <p><span className="font-medium">Email:</span> {appointmentData.patient.email}</p>
            </div>
            {/* Appointment Details Card */}
            <div className="bg-gray-100 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">Appointment Details</h2>
              <p><span className="font-medium">Token:</span> {appointmentData.token}</p>
              <p><span className="font-medium">Date:</span> {appointmentData.scheduleId.date}</p>
              <p>
                <span className="font-medium">Time:</span> {appointmentData.scheduleId.startTime} - {appointmentData.scheduleId.endTime}
              </p>
              <p><span className="font-medium">Status:</span> {appointmentData.status}</p>
            </div>
          </div>

          {/* Appointment Completion Button */}
          <div className="flex justify-center mb-8">
            <button
              onClick={handleAppointmentCompleted}
              className={`px-6 py-3 rounded-lg font-medium text-white ${
                isCompleted ? 'bg-green-500' : isCancel ? 'bg-red-500' : 'bg-blue-500'
              }`}
              disabled={isCompleted || isCancel}
            >
              {isCancel ? 'Appointment Cancelled' : isCompleted ? 'Appointment Completed' : 'Mark Appointment as Completed'}
            </button>
          </div>

          {/* Prescription Report or Prescription Form */}
          {createdPrescription ? (
            <PrescriptionReport prescription={createdPrescription} />
          ) : (
            <div className="flex justify-center">
              <button
                onClick={() => setShowPrescriptionForm(true)}
                className="bg-purple-500 hover:bg-purple-600 text-white py-3 px-6 rounded-lg"
              >
                Add Prescription
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Prescription Form Modal */}
      {showPrescriptionForm && (
        <PrescriptionForm
          onClose={() => setShowPrescriptionForm(false)}
          onPrescriptionCreated={(prescription) => {
            console.log('Prescription created:', prescription);
            setCreatedPrescription(prescription);
          }}
          doctorId={appointmentData.doctor.id}
          patientId={appointmentData.patient.id}
          bookingAppointmentId={appointmentData.bookingId}
        />
      )}

      {/* Prescription Image Modal (if needed) */}
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
    </>
  );
};

export default CompleteSlot;
