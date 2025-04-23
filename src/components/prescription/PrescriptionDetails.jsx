import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PrescriptionReport = ({ prescription }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  if (!prescription) {
    return (
      <div className="flex items-center justify-center">
        <p className="text-xl text-gray-600">No prescription data available.</p>
      </div>
    );
  }

  // Calculate total billing amount
  const totalAmount = prescription.prescriptionItems?.reduce((acc, item) => {
    const qty = parseFloat(item.quantity) || 0;
    const price = item.inventoryItem
      ? parseFloat(item.inventoryItem.sellingPrice) || 0
      : 0;
    return acc + qty * price;
  }, 0) || 0;

  // Handler for Buy button
  const handleBuy = async () => {
    try {
      setLoading(true);
      // fetch the payment for this prescription
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/payments/prescription/${prescription.id}`
      );
      const res = await response.json();
      // redirect to /payments/{paymentId}
      navigate(`/patient/payments/${res.id}`);
    } catch (err) {
      console.error(err);
      alert('Could not initialize payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200 mt-8">
      {/* Report Header */}
      <div className="flex justify-between items-center border-b pb-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Prescription Report</h2>
        <div className="space-x-2">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 shadow"
            onClick={() => window.print()}
          >
            Print Report
          </button>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 shadow disabled:opacity-50"
            onClick={handleBuy}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Buy'}
          </button>
        </div>
      </div>

      {/* Prescription Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Prescription Info
          </h3>
          <p>
            <span className="font-medium">ID:</span> {prescription.id}
          </p>
          <p>
            <span className="font-medium">Number:</span>{' '}
            {prescription.prescriptionNumber}
          </p>
          <p>
            <span className="font-medium">Date Issued:</span>{' '}
            {new Date(prescription.dateIssued).toLocaleString()}
          </p>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Doctor &amp; Patient
          </h3>
          <p>
            <span className="font-medium">Doctor:</span>{' '}
            {prescription.doctor?.username || 'N/A'}
          </p>
          <p>
            <span className="font-medium">Patient:</span>{' '}
            {prescription.patient?.username || 'N/A'}
          </p>
        </div>
      </div>

      {/* General Instructions */}
      {prescription.generalInstructions && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            General Instructions
          </h3>
          <p className="text-gray-600">{prescription.generalInstructions}</p>
        </div>
      )}

      {/* Prescription Items Table */}
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
          Prescription Items
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="bg-blue-50">
                <th className="px-4 py-2 border">ID</th>
                <th className="px-4 py-2 border">Medicine Name</th>
                <th className="px-4 py-2 border">Unit</th>
                <th className="px-4 py-2 border">Quantity</th>
                <th className="px-4 py-2 border">Selling Price</th>
                <th className="px-4 py-2 border">Cost</th>
                <th className="px-4 py-2 border">Dosage</th>
                <th className="px-4 py-2 border">Frequency</th>
                <th className="px-4 py-2 border">Duration</th>
                <th className="px-4 py-2 border">Additional Instructions</th>
              </tr>
            </thead>
            <tbody>
              {prescription.prescriptionItems?.length > 0 ? (
                prescription.prescriptionItems.map((item) => {
                  const qty = parseFloat(item.quantity) || 0;
                  const price = item.inventoryItem
                    ? parseFloat(item.inventoryItem.sellingPrice) || 0
                    : 0;
                  const cost = qty * price;
                  return (
                    <tr key={item.id} className="hover:bg-gray-100">
                      <td className="px-4 py-2 border">{item.id}</td>
                      <td className="px-4 py-2 border">
                        {item.inventoryItem?.name || 'N/A'}
                      </td>
                      <td className="px-4 py-2 border">
                        {item.inventoryItem?.unit || 'N/A'}
                      </td>
                      <td className="px-4 py-2 border">{item.quantity || 'N/A'}</td>
                      <td className="px-4 py-2 border">
                        {item.inventoryItem
                          ? `Rs${parseFloat(item.inventoryItem.sellingPrice).toFixed(2)}`
                          : 'N/A'}
                      </td>
                      <td className="px-4 py-2 border">{`Rs${cost.toFixed(2)}`}</td>
                      <td className="px-4 py-2 border">{item.dosage}</td>
                      <td className="px-4 py-2 border">{item.frequency}</td>
                      <td className="px-4 py-2 border">{item.duration}</td>
                      <td className="px-4 py-2 border">
                        {item.additionalInstructions}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="10"
                    className="px-4 py-2 text-center text-gray-500"
                  >
                    No prescription items found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Billing Section */}
      <div className="mt-6 text-right">
        <h3 className="text-xl font-semibold text-gray-700">
          Total Amount: Rs.{totalAmount.toFixed(2)}
        </h3>
        <p className="text-gray-600 text-sm mt-2">
          Calculation: For each item, Cost = Quantity x Selling Price. Sum of all
          item costs.
        </p>
      </div>
    </div>
  );
};

export default PrescriptionReport;
