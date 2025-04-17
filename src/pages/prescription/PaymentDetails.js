import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchPaymentDetail } from "../../services/other/other";
import { MdCheck, MdClear, MdPayment } from "react-icons/md"; // Using react-icons

const PaymentDetails = () => {
  const { id } = useParams();
  const [payment, setPayment] = useState(null);
  const [showQRCode, setShowQRCode] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const role = localStorage.getItem("ROLE");

  useEffect(() => {
    fetchPaymentDetail(id)
      .then(data => {
        console.log("Fetched payment detail:", data);
        setPayment(data);
      })
      .catch(error => console.error("Error fetching payment details:", error));
  }, [id]);

  if (!payment)
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-600">Loading payment details...</p>
      </div>
    );

  const { prescription = {} } = payment;
  const items = prescription.prescriptionItems || [];

  const calculatedTotal = items.reduce((sum, item) => {
    const qty = parseFloat(item.quantity) || 0;
    const price = item.inventoryItem
      ? parseFloat(item.inventoryItem.sellingPrice) || 0
      : 0;
    return sum + qty * price;
  }, 0);

  // Handlers
  const handlePayOnline = () => setShowQRCode(true);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        `http://localhost:8000/api/payments/${payment.id}/complete-payment`,
        { method: "PUT", body: formData }
      );
      if (!response.ok) throw new Error("Upload failed");
      const updatedPayment = await response.json();
      setPayment(updatedPayment);
      setShowQRCode(false);
      setFile(null);
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleCashPayment = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/payments/${payment.id}/cash-payment`,
        { method: "PUT" }
      );
      if (!response.ok) throw new Error("Cash payment failed");
      const updatedPayment = await response.json();
      setPayment(updatedPayment);
    } catch (error) {
      console.error("Error processing cash payment:", error);
    }
  };

  const handleMarkAsUnpaid = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/payments/${payment.id}/mark-unpaid`,
        { method: "PUT" }
      );
      if (!response.ok) throw new Error("Failed to mark as unpaid");
      const updatedPayment = await response.json();
      setPayment(updatedPayment);
    } catch (error) {
      console.error("Error marking as unpaid:", error);
    }
  };

  return (
    <div className="bg-white rounded-md shadow p-6 w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center gap-2">
        <MdPayment className="text-3xl text-blue-600" />
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Payment Details</h2>
          <p className="text-sm text-gray-500">
            Detailed breakdown of payment and billing.
          </p>
        </div>
      </div>

      {/* Payment Basic Info */}
      <div className="mb-6 p-4 bg-gray-50 rounded-md">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">
          Basic Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3">
          <div className="flex">
            <span className="w-40 font-medium text-gray-600">
              Payment ID:
            </span>
            <span className="text-gray-800">{payment.id}</span>
          </div>
          {prescription.id && (
            <div className="flex">
              <span className="w-40 font-medium text-gray-600">
                Prescription ID:
              </span>
              <span className="text-gray-800">{prescription.id}</span>
            </div>
          )}
          {prescription.prescriptionNumber && (
            <div className="flex">
              <span className="w-40 font-medium text-gray-600">
                Prescription Number:
              </span>
              <span className="text-gray-800">
                {prescription.prescriptionNumber}
              </span>
            </div>
          )}
          <div className="flex">
            <span className="w-40 font-medium text-gray-600">
              Payment Status:
            </span>
            <span className="text-gray-800">{payment.status}</span>
          </div>
          <div className="flex">
            <span className="w-40 font-medium text-gray-600">
              Payment Method:
            </span>
            <span className="text-gray-800">{payment.method}</span>
          </div>
        </div>
      </div>

      {/* Prescription Details */}
      <div className="mb-6 p-4 bg-gray-50 rounded-md">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">
          Prescription Details
        </h3>
        {prescription.doctor && (
          <div className="text-gray-800 text-sm mb-1">
            <strong>Doctor:</strong> {prescription.doctor.username} (
            {prescription.doctor.email})
          </div>
        )}
        {prescription.patient && (
          <div className="text-gray-800 text-sm mb-1">
            <strong>Patient:</strong> {prescription.patient.username} (
            {prescription.patient.email})
          </div>
        )}
        {prescription.dateIssued && (
          <div className="text-gray-800 text-sm mb-1">
            <strong>Date Issued:</strong>{" "}
            {new Date(prescription.dateIssued).toLocaleString()}
          </div>
        )}
        {prescription.generalInstructions && (
          <div className="text-gray-800 text-sm">
            <strong>Instructions:</strong>{" "}
            {prescription.generalInstructions}
          </div>
        )}
      </div>

      {/* Prescription Items & Billing */}
      <div className="mb-6 p-4 bg-gray-50 rounded-md overflow-x-auto">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">
          Prescription Items & Billing
        </h3>
        {items.length === 0 ? (
          <p className="text-gray-600 text-sm">
            No prescription items available.
          </p>
        ) : (
          <table className="w-full table-auto text-left border-collapse">
            <thead>
              <tr className="text-gray-600 border-b">
                <th className="py-2 px-4 text-sm font-medium">
                  Medicine Name
                </th>
                <th className="py-2 px-4 text-sm font-medium">Unit</th>
                <th className="py-2 px-4 text-sm font-medium">
                  Quantity
                </th>
                <th className="py-2 px-4 text-sm font-medium">
                  Selling Price
                </th>
                <th className="py-2 px-4 text-sm font-medium">Cost</th>
              </tr>
            </thead>
            <tbody className="text-gray-800 text-sm">
              {items.map((item) => {
                const qty = parseFloat(item.quantity) || 0;
                const price = item.inventoryItem
                  ? parseFloat(item.inventoryItem.sellingPrice) || 0
                  : 0;
                const cost = qty * price;
                return (
                  <tr key={item.id} className="border-b hover:bg-gray-100">
                    <td className="py-2 px-4">
                      {item.inventoryItem ? item.inventoryItem.name : "N/A"}
                    </td>
                    <td className="py-2 px-4">
                      {item.inventoryItem ? item.inventoryItem.unit : "N/A"}
                    </td>
                    <td className="py-2 px-4">{item.quantity || "N/A"}</td>
                    <td className="py-2 px-4">
                      ${price.toFixed(2)}
                    </td>
                    <td className="py-2 px-4">
                      ${cost.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
              <tr>
                <td className="py-2 px-4 font-medium" colSpan="4">
                  Total Amount:
                </td>
                <td className="py-2 px-4 font-bold">
                  ${calculatedTotal.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between">
        <Link
          to="/payments"
          className="text-blue-600 hover:underline text-sm mb-4 sm:mb-0"
        >
          &larr; Back to All Payments
        </Link>
        {payment.status === "PAID" ? (
          <div className="flex items-center gap-4">
            <span className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2">
              <MdCheck /> Paid
            </span>
            {role === "ADMIN" && (
              <button
                onClick={handleMarkAsUnpaid}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition flex items-center gap-2"
              >
                <MdClear /> Mark as Unpaid
              </button>
            )}
          </div>
        ) : role === "PATIENT" ? (
          <button
            onClick={handlePayOnline}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Pay Online
          </button>
        ) : role === "ADMIN" ? (
          <button
            onClick={handleCashPayment}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Pay Cash
          </button>
        ) : null}
      </div>

      {/* QR Code & File Upload Section */}
      {!payment.status === "PAID" && !payment.paymentScreenshotPath && showQRCode && (
        <div className="mt-8 p-4 bg-gray-50 rounded-md flex flex-col items-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Scan to Pay
          </h3>
          <img
            src="https://miro.medium.com/v2/resize:fit:785/1*IR2e6Evsopa0qQy2PXTlFA.jpeg"
            alt="QR Code"
            className="w-48 h-48 object-contain mb-4"
          />
          <div className="w-full max-w-xs">
            <input
              type="file"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded cursor-pointer bg-gray-50 p-2"
            />
          </div>
          <button
            onClick={handleUpload}
            disabled={uploading || !file}
            className={`mt-4 bg-blue-600 text-white px-4 py-2 rounded transition ${
              uploading || !file
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-blue-700"
            }`}
          >
            {uploading ? "Uploading..." : "Upload Payment Proof"}
          </button>
        </div>
      )}

      {/* Display Payment Screenshot if Available */}
      {payment.method === "ONLINE" &&
        payment.paymentScreenshotPath && (
          <div className="mt-8 p-4 bg-gray-50 rounded-md flex flex-col items-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Payment Proof
            </h3>
            <img
              src={payment.paymentScreenshotPath}
              alt="Payment Proof"
              className="w-48 h-48 object-contain"
            />
          </div>
        )}
    </div>
  );
};

export default PaymentDetails;
