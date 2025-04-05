import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchPaymentDetail } from "../../services/other/other";

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

  if (!payment) return <div>Loading payment details...</div>;

  const prescription = payment.prescription || {};
  const items = prescription.prescriptionItems || [];

  const calculatedTotal = items.reduce((sum, item) => {
    const qty = parseFloat(item.quantity) || 0;
    const price = item.inventoryItem
      ? parseFloat(item.inventoryItem.sellingPrice) || 0
      : 0;
    return sum + qty * price;
  }, 0);

  // For PATIENT: Show QR Code and file upload section
  const handlePayOnline = () => {
    setShowQRCode(true);
  };

  // For file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Upload the payment proof image to complete the payment
  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        `http://localhost:8000/api/payments/${payment.id}/complete-payment`,
        {
          method: "PUT",
          body: formData,
        }
      );
      if (!response.ok) {
        throw new Error("Upload failed");
      }
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

  // For ADMIN: Handle cash payment
  const handleCashPayment = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/payments/${payment.id}/cash-payment`,
        { method: "PUT" }
      );
      if (!response.ok) {
        throw new Error("Cash payment failed");
      }
      const updatedPayment = await response.json();
      setPayment(updatedPayment);
    } catch (error) {
      console.error("Error processing cash payment:", error);
    }
  };

  return (
    <div className="bg-white rounded-md shadow p-4 w-full">
      {/* Payment Details Heading */}
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-800">Payment Details</h2>
        <p className="text-sm text-gray-500">
          Detailed breakdown of the payment and billing calculation.
        </p>
      </div>

      {/* Payment Basic Info Table */}
      <table className="w-full mb-6 table-auto text-left border-collapse">
        <tbody className="text-gray-700 text-sm">
          <tr className="border-b">
            <td className="py-3 px-4 font-medium">Payment ID:</td>
            <td className="py-3 px-4">{payment.id}</td>
          </tr>
          {prescription.id && (
            <tr className="border-b">
              <td className="py-3 px-4 font-medium">Prescription ID:</td>
              <td className="py-3 px-4">{prescription.id}</td>
            </tr>
          )}
          {prescription.prescriptionNumber && (
            <tr className="border-b">
              <td className="py-3 px-4 font-medium">Prescription Number:</td>
              <td className="py-3 px-4">{prescription.prescriptionNumber}</td>
            </tr>
          )}
          <tr className="border-b">
            <td className="py-3 px-4 font-medium">Payment Status:</td>
            <td className="py-3 px-4">{payment.status}</td>
          </tr>
          <tr className="border-b">
            <td className="py-3 px-4 font-medium">Payment Method:</td>
            <td className="py-3 px-4">{payment.method}</td>
          </tr>
        </tbody>
      </table>

      {/* Prescription Details Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Prescription Details
        </h3>
        {prescription.doctor && (
          <div className="text-gray-700 text-sm mb-1">
            <strong>Doctor:</strong> {prescription.doctor.username} (
            {prescription.doctor.email})
          </div>
        )}
        {prescription.patient && (
          <div className="text-gray-700 text-sm mb-1">
            <strong>Patient:</strong> {prescription.patient.username} (
            {prescription.patient.email})
          </div>
        )}
        {prescription.dateIssued && (
          <div className="text-gray-700 text-sm">
            <strong>Date Issued:</strong>{" "}
            {new Date(prescription.dateIssued).toLocaleString()}
          </div>
        )}
        {prescription.generalInstructions && (
          <div className="text-gray-700 text-sm mt-1">
            <strong>Instructions:</strong> {prescription.generalInstructions}
          </div>
        )}
      </div>

      {/* Prescription Items & Billing Table */}
      <div className="overflow-x-auto mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
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
                <th className="py-2 px-4 text-sm font-medium">Quantity</th>
                <th className="py-2 px-4 text-sm font-medium">
                  Selling Price
                </th>
                <th className="py-2 px-4 text-sm font-medium">
                  Cost (Qty x Price)
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm">
              {items.map((item) => {
                const qty = parseFloat(item.quantity) || 0;
                const price = item.inventoryItem
                  ? parseFloat(item.inventoryItem.sellingPrice) || 0
                  : 0;
                const cost = qty * price;
                return (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4">
                      {item.inventoryItem ? item.inventoryItem.name : "N/A"}
                    </td>
                    <td className="py-2 px-4">
                      {item.inventoryItem ? item.inventoryItem.unit : "N/A"}
                    </td>
                    <td className="py-2 px-4">{item.quantity || "N/A"}</td>
                    <td className="py-2 px-4">${price.toFixed(2)}</td>
                    <td className="py-2 px-4">${cost.toFixed(2)}</td>
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

      {/* Action Buttons or Payment Proof Display */}
      <div className="flex items-center justify-between">
        <Link to="/payments" className="text-blue-600 hover:underline text-sm">
          Back to All Payments
        </Link>
        {payment.method === "ONLINE" && payment.paymentScreenshotPath ? (
          <span className="bg-gray-400 text-white px-4 py-2 rounded">
            Paid
          </span>
        ) : role === "PATIENT" ? (
          <button
            onClick={handlePayOnline}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Pay Online
          </button>
        ) : role === "ADMIN" ? (
          <button
            onClick={handleCashPayment}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Pay Cash
          </button>
        ) : null}
      </div>

      {/* Show QR Code & File Upload when "Pay Online" is clicked */}
      {
        !payment.paymentScreenshotPath &&
        showQRCode && (
          <div className="mt-6 flex flex-col items-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
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
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded cursor-pointer bg-gray-50"
              />
            </div>
            <button
              onClick={handleUpload}
              disabled={uploading || !file}
              className={`mt-4 bg-blue-600 text-white px-4 py-2 rounded ${
                uploading || !file
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-blue-700"
              }`}
            >
              {uploading ? "Uploading..." : "Upload Payment Proof"}
            </button>
          </div>
        )}

      {/* For online payments that are already paid, display the payment screenshot */}
      {payment.method === "ONLINE" && payment.paymentScreenshotPath && (
        <div className="mt-6 flex flex-col items-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
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
