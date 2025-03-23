import React from 'react';

const PrescriptionReport = ({ prescription }) => {
  if (!prescription) {
    return (
      <div className="flex items-center justify-center">
        <p className="text-xl text-gray-600">No prescription data available.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200 mt-8">
      {/* Report Header */}
      <div className="flex justify-between items-center border-b pb-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Prescription Report</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 shadow">
          Print Report
        </button>
      </div>
      {/* Prescription Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Prescription Info</h3>
          <p>
            <span className="font-medium">ID:</span> {prescription.id}
          </p>
          <p>
            <span className="font-medium">Prescription Number:</span> {prescription.prescriptionNumber}
          </p>
          <p>
            <span className="font-medium">Date Issued:</span> {new Date(prescription.dateIssued).toLocaleString()}
          </p>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Doctor &amp; Patient</h3>
          <p>
            <span className="font-medium">Doctor:</span> {prescription.doctor?.username || 'N/A'}
          </p>
          <p>
            <span className="font-medium">Patient:</span> {prescription.patient?.username || 'N/A'}
          </p>
        </div>
      </div>
      {prescription.generalInstructions && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">General Instructions</h3>
          <p className="text-gray-600">{prescription.generalInstructions}</p>
        </div>
      )}
      {/* Prescription Items Table */}
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Prescription Items</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="bg-blue-50">
                <th className="px-4 py-2 border">ID</th>
                <th className="px-4 py-2 border">Medicine Name</th>
                <th className="px-4 py-2 border">Unit</th>
                <th className="px-4 py-2 border">Dosage</th>
                <th className="px-4 py-2 border">Frequency</th>
                <th className="px-4 py-2 border">Duration</th>
                <th className="px-4 py-2 border">Additional Instructions</th>
              </tr>
            </thead>
            <tbody>
              {prescription.prescriptionItems && prescription.prescriptionItems.length > 0 ? (
                prescription.prescriptionItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-100">
                    <td className="px-4 py-2 border">{item.id}</td>
                    <td className="px-4 py-2 border">{item.inventoryItem ? item.inventoryItem.name : 'N/A'}</td>
                    <td className="px-4 py-2 border">{item.inventoryItem ? item.inventoryItem.unit : 'N/A'}</td>
                    <td className="px-4 py-2 border">{item.dosage}</td>
                    <td className="px-4 py-2 border">{item.frequency}</td>
                    <td className="px-4 py-2 border">{item.duration}</td>
                    <td className="px-4 py-2 border">{item.additionalInstructions}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-4 py-2 text-center text-gray-500">
                    No prescription items found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionReport;
