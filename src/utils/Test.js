import React from 'react';
import { format } from 'date-fns';

// Default appointment data
const defaultData = {
    bookingId: 1,
    doctor: {
      id: 1,
      username: 'SamWalton',
      email: 'duginisaisharan@gmail.com',
      phoneNumber: '8125281005',
      password: '$2a$12$VWtemO7XyG9mpIOpknRIcuF2daKzwXqoSnoqyzWEL58WaUshgD.lq',
      userId: 'D29SamW8891',
      imageUrl: null,
      roles: [{ id: 2, name: 'DOCTOR' }],
      doctorDetails: {
        id: 1,
        doctorId: null,
        age: 35,
        gender: 'Male',
        address: '456 Elm Street',
        city: 'Metropolis',
        pincode: '543210',
        consultationFee: null,
        specialization: null,
        remuneration: null,
      },
      patientDetails: null,
    },
    patient: {
      id: 202,
      username: 'SaiSharan',
      email: 'duginisaisharan657@gmail.com',
      phoneNumber: '9121641029',
      password: '$2a$12$BC51kgKyNUMtuWbG7N1it.NpaBbkRgwBzvb8pvMaT2N7DhckuuqfW',
      userId: 'PATSaiS4505',
      imageUrl: null,
      roles: [{ id: 1, name: 'PATIENT' }],
      doctorDetails: null,
      patientDetails: {
        id: 2,
        age: 20,
        gender: 'Male',
        address: 'Osman gunj',
        city: 'Hyderabad',
        pincode: '500001',
      },
    },
    token: '20250401181058-1',
    status: 'completed',
    prescriptionImageUrl: null,
    scheduleId: {
      scheduleId: 11,
      doctor: {}, // omitted for brevity
      slot: {
        slotId: 7,
        startTime: '10:00:00',
        endTime: '10:30:00',
        inUse: false,
      },
      date: '2025-04-01',
      startTime: '10:00:00',
      endTime: '10:30:00',
      booked: true,
    },
    appointmenDate: '2025-04-01',
  };
  
  
const AppointmentReport = ({ data = defaultData, onComplete, onAddPrescription, onPrint }) => {
  const { patient, doctor, token, status, scheduleId } = data;
  const appointmentDate = new Date(scheduleId.date);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-blue-900 mb-2">Appointment Report</h1>
          <p className="text-gray-600">Booking ID: <span className="font-medium">{data.bookingId}</span></p>
        </div>
        <button
          onClick={onPrint}
          className="mt-4 md:mt-0 px-5 py-2 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition"
        >
          🖨️ Print
        </button>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Doctor Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center text-center">
          <div className="w-20 h-20 mb-4 rounded-full bg-gradient-to-tr from-blue-400 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
            {doctor.username.charAt(0)}
          </div>
          <h2 className="text-lg font-semibold text-blue-800">Dr. {doctor.username}</h2>
          <p className="text-gray-500 text-sm">Specialization: <span className="font-medium">{doctor.doctorDetails.specialization || 'N/A'}</span></p>
          <p className="text-gray-500 text-sm">Fee: <span className="font-medium">{doctor.doctorDetails.consultationFee || 'N/A'}</span></p>
        </div>

        {/* Patient Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center text-center">
          <div className="w-20 h-20 mb-4 rounded-full bg-gradient-to-tr from-green-400 to-teal-500 flex items-center justify-center text-white text-xl font-bold">
            {patient.username.charAt(0)}
          </div>
          <h2 className="text-lg font-semibold text-green-800">{patient.username}</h2>
          <p className="text-gray-500 text-sm">Age: <span className="font-medium">{patient.patientDetails.age}</span></p>
          <p className="text-gray-500 text-sm">City: <span className="font-medium">{patient.patientDetails.city}</span></p>
        </div>

        {/* Appointment Details Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Appointment Details</h2>
          <ul className="space-y-3 text-gray-700">
            <li><span className="font-medium">Token:</span> {token}</li>
            <li><span className="font-medium">Date:</span> {format(appointmentDate, 'dd MMM yyyy')}</li>
            <li><span className="font-medium">Time:</span> {scheduleId.startTime} - {scheduleId.endTime}</li>
            <li>
              <span className="font-medium">Status:</span>
              <span className={`ml-2 inline-block px-3 py-1 rounded-full text-xs uppercase ${
                status === 'completed' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'
              }`}>{status}</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-10 flex flex-col sm:flex-row justify-center gap-6">
        <button
          onClick={onComplete}
          disabled={status === 'completed'}
          className={`flex-1 max-w-xs px-6 py-3 rounded-xl text-white font-semibold shadow-lg transition ${
            status === 'completed'
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          ✅ Mark Completed
        </button>
        <button
          onClick={onAddPrescription}
          className="flex-1 max-w-xs px-6 py-3 rounded-xl bg-purple-500 text-white font-semibold shadow-lg hover:bg-purple-600 transition"
        >
          💊 Add Prescription
        </button>
      </div>
    </div>
  );
};

export default AppointmentReport;