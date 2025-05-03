import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchPatientPayments,
  fetchDoctorPayments,
  fetchPaymentList,         // ← import the new helper
  fetchCurrentPayment,
} from "../../services/other/other";
import CurrentPaymentBanner from "./CurrentPaymentBanner";


const PaymentList = ({ role = "admin" }) => {
  const [payments, setPayments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        let data;
        switch (role) {
          case "doctor":
            data = await fetchDoctorPayments();
            break;
          case "patient":
            data = await fetchPatientPayments();
            break;
          case "admin":
          case "staff":
            data = await fetchPaymentList();
            break;
          default:
            console.warn(`Unknown role "${role}", defaulting to patient`);
            data = await fetchPatientPayments();
        }
        setPayments(data);
      } catch (error) {
        console.error("Error fetching payments:", error);
      }
    };
    fetchPayments();
  }, [role]);

  const filteredPayments = payments.filter((payment) => {
    const searchField = `${payment.prescriptionId} ${payment.method}`.toLowerCase();
    return searchField.includes(searchQuery.toLowerCase());
  });

  const handleRowClick = (id) => navigate(`${id}`);

  // Heading + sub‑text change per role
  const headings = {
    patient: ["Your Payments", "Below is a list of your payment transactions."],
    doctor: ["Doctor’s Payments", "Payments related to your prescriptions."],
    staff:   ["All Payments (Staff)", "All payment transactions in the system."],
    admin:   ["All Payments (Admin)", "Full payment log — staff and patient records."],
  };
  const [title, subtitle] = headings[role] || headings.patient;

  return (
    <div className="bg-white rounded-md shadow p-4 w-full">
           <CurrentPaymentBanner role={role} />

      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-1/3">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {/* magnifying-glass icon */}
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor"
                 viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 17.5a7.5 7.5 0 006.15-3.85z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search by Prescription ID or Method..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto text-left border-collapse">
          <thead>
            <tr className="text-gray-600 border-b">
              <th className="py-3 px-4 text-sm font-medium">Prescription ID</th>
              <th className="py-3 px-4 text-sm font-medium">Method</th>
              <th className="py-3 px-4 text-sm font-medium">Status</th>
              <th className="py-3 px-4 text-sm font-medium">Total Amount</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm">
            {filteredPayments.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-4 px-4 text-center">
                  No payments found.
                </td>
              </tr>
            ) : (
              filteredPayments.map((payment) => (
                <tr
                  key={payment.id}
                  className="border-b hover:bg-gray-50 transition cursor-pointer"
                  onClick={() => handleRowClick(payment.id)}
                >
                  <td className="py-3 px-4">{payment.prescriptionId}</td>
                  <td className="py-3 px-4">{payment.method}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        payment.status.toLowerCase() === "completed"
                          ? "bg-green-100 text-green-700"
                          : payment.status.toLowerCase() === "pending"
                          ? "bg-blue-100 text-blue-700"
                          : payment.status.toLowerCase() === "failed"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4">{payment.totalAmount}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentList;
