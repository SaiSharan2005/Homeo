import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchPaymentList } from "../../services/other/other";

const PaymentList = () => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    fetchPaymentList()
      .then(data => {
        console.log("Fetched payments:", data);
        setPayments(data);
      })
      .catch(error => console.error("Error fetching payments:", error));
  }, []);

  return (
    <div className="bg-white rounded-md shadow p-4 w-full">
      {/* Page Heading */}
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-800">All Payments</h2>
        <p className="text-sm text-gray-500">
          Below is a list of all payment transactions.
        </p>
      </div>

      {/* Payments Table */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto text-left border-collapse">
          <thead>
            <tr className="text-gray-600 border-b">
              <th className="py-3 px-4 text-sm font-medium">ID</th>
              <th className="py-3 px-4 text-sm font-medium">Prescription ID</th>
              <th className="py-3 px-4 text-sm font-medium">Method</th>
              <th className="py-3 px-4 text-sm font-medium">Status</th>
              <th className="py-3 px-4 text-sm font-medium">Total Amount</th>
              <th className="py-3 px-4 text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm">
            {payments.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-4 px-4 text-center">
                  No payments found.
                </td>
              </tr>
            ) : (
              payments.map(payment => (
                <tr
                  key={payment.id}
                  className="border-b hover:bg-gray-50 transition cursor-pointer"
                >
                  <td className="py-3 px-4">{payment.id}</td>
                  <td className="py-3 px-4">{payment.prescriptionId}</td>
                  <td className="py-3 px-4">{payment.method}</td>
                  <td className="py-3 px-4">{payment.status}</td>
                  <td className="py-3 px-4">{payment.totalAmount}</td>
                  <td className="py-3 px-4">
                    <Link
                      to={`/staff/payment/${payment.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      View Details
                    </Link>
                  </td>
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
