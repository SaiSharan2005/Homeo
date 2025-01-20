import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PatientNavbar from '../../components/PatientNavbar';
import image from '../../images/image.jpg';

const CompleteSlot = () => {
  const { tokenId } = useParams();
  const [appointmentData, setAppointmentData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isCancel , setIsCancel] = useState(false)

  useEffect(() => {
    const fetchAppointmentData = async () => {
      try {
        const response = await fetch(process.env.REACT_APP_BACKEND_URL+`/bookingAppointments/token/${tokenId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch appointment data');
        }
        const data = await response.json();
        setAppointmentData(data);
        if(data.status == "completed"){
            setIsCompleted(true)
        }else if(data.status == "cancel"){
            setIsCancel(true)

        }
      } catch (error) {
        console.error('Error fetching appointment data:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointmentData();
  }, [tokenId]);

  const handleAppointmentCompleted = async () => {
    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL+`/bookingAppointments/completed-appointment/${tokenId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
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
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!appointmentData) {
    return <div>Error: Appointment data is not available</div>;
  }

  const doctorProfilePic =  image; // Assuming `profilePicUrl` is the key for the profile picture URL.

  return (
    <>
      <PatientNavbar />
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="bg-white p-16 rounded-lg shadow-lg w-[80%] text-center">
          {/* <h1 className="text-3xl font-semibold mb-8">
            Thanks for booking with Dr. {appointmentData.doctorId.doctorName}!
          </h1> */}

          <div className=" gap-8 mb-8">
            <div className="bg-gray-100 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Patient Details</h2>
               <img 
                src={doctorProfilePic} 
                alt={`Dr. ${appointmentData.doctorId.doctorName}`} 
                className="w-40 h-40 rounded-full object-cover mb-4 m-auto" 
              />
              <p><strong>Name:</strong> {appointmentData.patientId.patientName}</p>
              <p><strong>Patient ID:</strong> {appointmentData.patientId.patientId}</p>
              <p><strong>Phone:</strong> {appointmentData.patientId.phoneNumber}</p>
              <p><strong>Email:</strong> {appointmentData.patientId.email}</p>
            </div>

            {/* <div className="bg-gray-100 p-6 rounded-lg ">
              <h2 className="text-xl font-semibold mb-4">Doctor Details</h2>
              <img 
                src={doctorProfilePic} 
                alt={`Dr. ${appointmentData.doctorId.doctorName}`} 
                className="w-40 h-40 rounded-full object-cover mb-4 m-auto" 
              />
              <p><strong>Name:</strong> {appointmentData.doctorId.doctorName}</p>
              <p><strong>Specialization:</strong> {appointmentData.doctorId.doctorDetails.specialization}</p>
              <p><strong>Consultation Fee:</strong> ${appointmentData.doctorId.doctorDetails.consultationFee}</p>
              <p><strong>Contact:</strong> {appointmentData.doctorId.phoneNumber}</p>
            </div> */}
          </div>

          <div className="bg-gray-100 p-6 rounded-lg mb-8">
            <h2 className="text-xl font-semibold mb-4">Appointment Details</h2>
            <p><strong>Token:</strong> {appointmentData.token}</p>
            <p><strong>Date:</strong> {appointmentData.scheduleId.date}</p>
            <p><strong>Time:</strong> {appointmentData.scheduleId.startTime} - {appointmentData.scheduleId.endTime}</p>
            <p><strong>Status:</strong> {appointmentData.status}</p>
          </div>

          <button
            onClick={handleAppointmentCompleted}
            className={`${
              isCompleted ? 'bg-green-500' : 'bg-blue-500'
            }   ${
                isCancel ? 'bg-red-500' : 'bg-blue-500'
              }    text-white py-3 px-6 rounded-lg mb-8`}
            disabled={isCompleted||isCancel}
          >
            {isCancel?'Appointment Cancled':`${isCompleted  ? 'Appointment Completed' : 'Mark Appointment as Completed'}`}
            
          </button>

          {error && <div className="text-red-500">{error}</div>}

          <div className="text-left">
            <div className="mb-4">
              <strong>Need help?</strong>
              <p className="text-gray-500 text-sm">
                Have questions? You can always reach out to our support team.
              </p>
            </div>
            <div className="mb-4">
              <strong>Reminder</strong>
              <p className="text-gray-500 text-sm">
                We'll send you a reminder email 24 hours before your appointment.
              </p>
            </div>
            <div>
              <strong>Manage your appointment</strong>
              <p className="text-gray-500 text-sm">
                You can manage your appointment or cancel it from your account.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CompleteSlot;
