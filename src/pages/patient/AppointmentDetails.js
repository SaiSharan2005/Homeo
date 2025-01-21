// import React from 'react';
// import image from "../images/image.jpg";
// const AppointmentDetails = () => {
//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-white">
//       <div className="bg-white p-16 rounded-lg shadow-lg w-[80%] text-center">
//         <h1 className="text-3xl font-semibold mb-8">Thanks for booking with Dr. Emily!</h1>
//         <div className="flex flex-col items-center mb-8">
//           <img 
//             src={image} 
//             alt="Dr. Emily Chen" 
//             className="w-40 h-40 rounded-full object-cover mb-4"
//           />
//           <div className="text-gray-700">
//             <div className="text-xl font-medium">Dr. Emily Chen</div>
//             <div className="text-md text-gray-500">Pediatrician, San Francisco</div>
//           </div>
//         </div>
//         <div className="bg-gray-100 p-6 rounded-lg mb-8">
//           <div className="text-gray-500 text-sm">Appointment token number</div>
//           <div className="text-2xl font-semibold">A2T4-8D9J</div>
//         </div>
//         <button className="bg-blue-500 text-white py-3 px-6 rounded-lg mb-8">Add to calendar</button>
//         <div className="text-left">
//           <div className="mb-4">
//             <strong>Need help?</strong>
//             <p className="text-gray-500 text-sm">Have questions? You can always reach out to our support team.</p>
//           </div>
//           <div className="mb-4">
//             <strong>Reminder</strong>
//             <p className="text-gray-500 text-sm">We'll send you a reminder email 24 hours before your appointment.</p>
//           </div>
//           <div>
//             <strong>Manage your appointment</strong>
//             <p className="text-gray-500 text-sm">You can manage your appointment or cancel it from your account.</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AppointmentDetails;


import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import image from '../../images/image.jpg';
import PatientNavbar from '../../components/PatientNavbar';
const AppointmentDetails = () => {
  const { tokenId } = useParams();
  const [appointmentData, setAppointmentData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAppointmentData = async () => {
      try {
        console.log(tokenId)
        const response = await fetch(process.env.REACT_APP_BACKEND_URL+`/bookingAppointments/token/${tokenId}`);
        const data = await response.json();
        setAppointmentData(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch appointment data:', error);
        setIsLoading(false);
      }
    };

    fetchAppointmentData();
  }, [tokenId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!appointmentData) {
    return <div>Error: Failed to fetch appointment details</div>;
  }

  return (
    <>
    <PatientNavbar/>
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="bg-white p-16 rounded-lg shadow-lg w-[80%] text-center">
        <h1 className="text-3xl font-semibold mb-8">Thanks for booking with Dr. {appointmentData.doctor.username}!</h1>
        <div className="flex flex-col items-center mb-8">
          <img 
            src={image} 
            alt={appointmentData.doctor.username} 
            className="w-40 h-40 rounded-full object-cover mb-4"
            />
          <div className="text-gray-700">
            <div className="text-xl font-medium">{`Dr. ${appointmentData.doctor.username}`}</div>
            <div className="text-md text-gray-500">{appointmentData.doctor.doctorDetails.specialization}</div>
          </div>
        </div>
        <div className="bg-gray-100 p-6 rounded-lg mb-8">
          <div className="text-gray-500 text-sm">Appointment token number</div>
          <div className="text-2xl font-semibold">{appointmentData.token}</div>
        </div>
        <button className="bg-blue-500 text-white py-3 px-6 rounded-lg mb-8">Add to calendar</button>
        <div className="text-left">
          <div className="mb-4">
            <strong>Need help?</strong>
            <p className="text-gray-500 text-sm">Have questions? You can always reach out to our support team.</p>
          </div>
          <div className="mb-4">
            <strong>Reminder</strong>
            <p className="text-gray-500 text-sm">We'll send you a reminder email 24 hours before your appointment.</p>
          </div>
          <div>
            <strong>Manage your appointment</strong>
            <p className="text-gray-500 text-sm">You can manage your appointment or cancel it from your account.</p>
          </div>
        </div>
      </div>
    </div>
            </>
  );
}

export default AppointmentDetails;
