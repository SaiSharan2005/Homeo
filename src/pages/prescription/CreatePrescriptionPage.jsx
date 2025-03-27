// src/pages/CreatePrescriptionPage.jsx
import React from 'react';
import AdminNavbar from '../../components/navbar/AdminNavbar';
import PrescriptionForm from '../../components/prescription/PrescriptionForm';

const CreatePrescriptionPage = () => {
  return (
    <>
      <AdminNavbar />
      <div className="min-h-screen bg-gray-100 p-8">
        <PrescriptionForm />
      </div>
    </>
  );
};

export default CreatePrescriptionPage;
