// src/components/payments/CurrentPaymentBanner.jsx
import React, { useState, useEffect } from "react";
import { fetchCurrentPayment, fetchPaymentDetail } from "../../services/other/other";
import { useNavigate } from "react-router-dom";

export default function CurrentPaymentBanner({ role }) {
  const [current, setCurrent] = useState(null);         // { id, prescriptionId, … }
  const [detail, setDetail] = useState(null);           // full PaymentDetail JSON
  const navigate = useNavigate();

  // 1) load the “current” summary
  useEffect(() => {
    if (role !== "admin" && role !== "staff") return;
    (async () => {
      try {
        const summary = await fetchCurrentPayment();
        setCurrent(summary);
      } catch (err) {
        console.error("Could not load current payment:", err);
      }
    })();
  }, [role]);

  // 2) when we know current.id, fetch full detail
  useEffect(() => {
    if (!current?.id) return;
    (async () => {
      try {
        const full = await fetchPaymentDetail(current.id);
        setDetail(full);
      } catch (err) {
        console.error("Could not load payment detail:", err);
      }
    })();
  }, [current]);

  if (role !== "admin" && role !== "staff") return null;

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
      <h3 className="font-bold text-yellow-800 mb-2">Current Pending Payment</h3>

      {!current ? (
        <p className="text-yellow-700">Loading current payment…</p>
      ) : !detail ? (
        <p className="text-yellow-700">Loading payment details…</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Prescription Info */}
          <div>
            <p className="text-sm text-gray-600">Prescription #</p>
            <p className="font-medium">{detail.prescription.prescriptionNumber}</p>
            <p className="text-sm text-gray-600 mt-2">Date Issued</p>
            <p className="font-medium">
              {new Date(detail.prescription.dateIssued).toLocaleString()}
            </p>
          </div>

          {/* Patient & Doctor */}
          <div>
            <p className="text-sm text-gray-600">Doctor</p>
            <p className="font-medium">{detail.prescription.doctor.username}</p>
            <p className="text-sm text-gray-600 mt-2">Patient</p>
            <p className="font-medium">{detail.prescription.patient.username}</p>
          </div>

          {/* Payment Info */}
          <div>
            <p className="text-sm text-gray-600">Amount</p>
            <p className="font-medium">₹{detail.totalAmount.toFixed(2)}</p>
            <p className="text-sm text-gray-600 mt-2">Method</p>
            <p className="font-medium">{detail.method}</p>
            <p className="text-sm text-gray-600 mt-2">Status</p>
            <p className="font-medium">{detail.status}</p>
          </div>

          {/* Action */}
          <div className="flex items-end">
            <button
              onClick={() => navigate(`${detail.id}`)}
              className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
            >
              View Full Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
