import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchPaymentDetail } from "../../services/other/other";

const PaymentDetails = () => {
  const { id } = useParams();
  const [payment, setPayment] = useState(null);
  const [showQRCode, setShowQRCode] = useState(false);
  const role = localStorage.getItem("ROLE"); // Determine the user role

  useEffect(() => {
    fetchPaymentDetail(id)
      .then(data => {
        console.log("Fetched payment detail:", data);
        setPayment(data);
      })
      .catch(error => console.error("Error fetching payment details:", error));
  }, [id]);

  if (!payment) return <div>Loading payment details...</div>;

  // Calculate each item's cost and total amount based on prescriptionItems if available.
  const items = payment.prescriptionItems || [];
  const calculatedTotal = items.reduce((sum, item) => {
    const qty = parseFloat(item.quantity) || 0;
    const price = item.inventoryItem ? parseFloat(item.inventoryItem.sellingPrice) || 0 : 0;
    return sum + qty * price;
  }, 0);

  // Handler for "Pay Online" button click.
  const handlePayOnline = () => {
    setShowQRCode(true);
  };

  return (
    <div className="bg-white rounded-md shadow p-4 w-full">
      {/* Payment Details Heading */}
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-800">Payment Details</h2>
        <p className="text-sm text-gray-500">
          Detailed breakdown of the payment calculation.
        </p>
      </div>

      {/* Payment Basic Info Table */}
      <table className="w-full mb-6 table-auto text-left border-collapse">
        <tbody className="text-gray-700 text-sm">
          <tr className="border-b">
            <td className="py-3 px-4 font-medium">Payment ID:</td>
            <td className="py-3 px-4">{payment.id}</td>
          </tr>
          <tr className="border-b">
            <td className="py-3 px-4 font-medium">Prescription ID:</td>
            <td className="py-3 px-4">{payment.prescriptionId}</td>
          </tr>
          <tr className="border-b">
            <td className="py-3 px-4 font-medium">Status:</td>
            <td className="py-3 px-4">{payment.status}</td>
          </tr>
          <tr className="border-b">
            <td className="py-3 px-4 font-medium">Method:</td>
            <td className="py-3 px-4">{payment.method}</td>
          </tr>
        </tbody>
      </table>

      {/* Prescription Items Breakdown */}
      <div className="overflow-x-auto mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Prescription Items Breakdown
        </h3>
        {items.length === 0 ? (
          <p className="text-gray-600 text-sm">No prescription items available.</p>
        ) : (
          <table className="w-full table-auto text-left border-collapse">
            <thead>
              <tr className="text-gray-600 border-b">
                <th className="py-2 px-4 text-sm font-medium">Medicine Name</th>
                <th className="py-2 px-4 text-sm font-medium">Unit</th>
                <th className="py-2 px-4 text-sm font-medium">Quantity</th>
                <th className="py-2 px-4 text-sm font-medium">Selling Price</th>
                <th className="py-2 px-4 text-sm font-medium">Cost (Qty x Price)</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm">
              {items.map(item => {
                const qty = parseFloat(item.quantity) || 0;
                const price = item.inventoryItem
                  ? parseFloat(item.inventoryItem.sellingPrice) || 0
                  : 0;
                const cost = qty * price;
                return (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4">{item.inventoryItem ? item.inventoryItem.name : "N/A"}</td>
                    <td className="py-2 px-4">{item.inventoryItem ? item.inventoryItem.unit : "N/A"}</td>
                    <td className="py-2 px-4">{item.quantity || "N/A"}</td>
                    <td className="py-2 px-4">${price.toFixed(2)}</td>
                    <td className="py-2 px-4">${cost.toFixed(2)}</td>
                  </tr>
                );
              })}
              {/* Total Amount Row */}
              <tr>
                <td className="py-2 px-4 font-medium" colSpan="4">
                  Total Amount:
                </td>
                <td className="py-2 px-4 font-bold">${calculatedTotal.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        )}
      </div>

      {/* Action Button */}
      <div className="flex items-center justify-between">
        <Link
          to="/payments"
          className="text-blue-600 hover:underline text-sm"
        >
          Back to All Payments
        </Link>
        {role === "PATIENT" ? (
          <button
            onClick={handlePayOnline}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Pay Online
          </button>
        ) : role === "ADMIN" ? (
          <button
            disabled
            className="bg-gray-400 text-white px-4 py-2 rounded cursor-not-allowed"
          >
            Payed
          </button>
        ) : null}
      </div>

      {/* QR Code Display (shown when "Pay Online" is clicked) */}
      {showQRCode && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Scan to Pay</h3>
          <img
            src={
              payment.paymentScreenshotPath ||
              "https://via.placeholder.com/200x200?text=QR+Code"
            }
            alt="QR Code"
            className="w-48 h-48 object-contain"
          />
        </div>
      )}
    </div>
  );
};

export default PaymentDetails;
