import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  fetchPaymentDetail,
  fetchNextPayment,
  fetchLastPayment,
} from "../../services/other/other";
import {
  MdCheck,
  MdClear,
  MdPayment,
  MdLocalShipping,
  MdAutorenew,
} from "react-icons/md"; // Using react-icons
import {
  fetchDuesForPatient,
  payCash,
  recordPaymentAmount,
  setDeliveryStatus,
  setPaymentStatus,
} from "../../services/other/paymentApi";

// optionally pull in an icon for delivered/not:
const PaymentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [payment, setPayment] = useState(null);
  const [showQRCode, setShowQRCode] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const role = localStorage.getItem("ROLE");
  const [nextId, setNextId] = useState(null);
  const [prevId, setPrevId] = useState(null);
  const [delivered, setDelivered] = useState(payment?.deliveryStatus ?? false);
  const [dues, setDues] = useState([]); // list of previous dues
  const [applyingDueId, setApplyingDueId] = useState(null);
  const [partialAmount, setPartialAmount] = useState(""); // controlled input for arbitrary payment
  const [payingPartial, setPayingPartial] = useState(false);
  // list of due‐payments the user has “ticked” to pay
  const [payableDues, setPayableDues] = useState([]);
  const [togglingDelivery, setTogglingDelivery] = useState(false);

  // computed sum of all selected dues
  const payableAmountSum = payableDues.reduce(
    (sum, d) => sum + (Number(d.totalAmount) - Number(d.paidAmount)),
    0
  );

  useEffect(() => {
    fetchPaymentDetail(id)
      .then((data) => {
        setPayment(data);
        setDelivered(data.deliveryStatus);
      })
      .catch(console.error);
  }, [id]);
  useEffect(() => {
    if (!payment) return;

    fetchDuesForPatient(payment.prescription.patient.id)
      .then((list) => setDues(list.filter((due) => due.id !== payment.id)))
      .catch(console.error);
  }, [payment]);

  useEffect(() => {
    if (!payment) return;
    (async () => {
      try {
        const nxt = await fetchNextPayment(id);
        const prev = await fetchLastPayment(id);
        setNextId(nxt?.id ?? null);
        setPrevId(prev?.id ?? null);
      } catch (err) {
        console.error("Error loading adjacent payments:", err);
      }
    })();
  }, [payment, id]);

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
  const handleToggleDelivery = async () => {
    setTogglingDelivery(true);
    try {
      const updated = await setDeliveryStatus(payment.id, !delivered);
      setDelivered(updated.deliveryStatus);
      setPayment((prev) => ({
        ...prev,
        deliveryStatus: updated.deliveryStatus,
      }));
    } catch (err) {
      console.error("Failed to update delivery status", err);
    } finally {
      setTogglingDelivery(false);
    }
  };
  // + Handler to apply one due into current payment
  const handleApplyDue = (due) => {
    setDues((curr) => curr.filter((d) => d.id !== due.id)); // remove from waiting‐list
    setPayableDues((curr) => [...curr, due]); // add to “to‐pay” list
  };
  const handlePayPartial = async () => {
    if (!parseFloat(partialAmount)) return;
    setPayingPartial(true);
    try {
      const amt = parseFloat(partialAmount);
      const updated = await recordPaymentAmount(payment.id, amt);
      setPayment(updated);
      setPartialAmount("");
    } finally {
      setPayingPartial(false);
    }
  };

  /** Mark this payment’s status to “DUE” */
  const handleMarkAsDue = async () => {
    try {
      const response = await setPaymentStatus(payment.id, "DUE");
      if (!response.ok) throw new Error("Failed to mark as unpaid");

      const refreshed = await fetchPaymentDetail(payment.id);
      setPayment(refreshed);
    } catch (err) {
      console.error("Failed to mark as DUE", err);
    }
  };

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

  const handleFinalizeCash = async () => {
    try {
      // 1) pay the main payment
      await payCash(payment.id);

      // 2) pay each of the selected dues
      await Promise.all(payableDues.map((due) => payCash(due.id)));
      // 3) reload the payment detail & clear out dues
      const refreshed = await fetchPaymentDetail(payment.id);
      setPayment(refreshed);
      setDues([]); // no more unpaid dues
      setPayableDues([]); // reset your “to‐pay” bucket
    } catch (error) {
      console.error("Error finalizing cash payments:", error);
    }
  };
  const handleMarkAsUnpaid = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/payments/${payment.id}/mark-unpaid`,
        { method: "PUT" }
      );
      if (!response.ok) throw new Error("Failed to mark as unpaid");
      const refreshed = await fetchPaymentDetail(payment.id);
      setPayment(refreshed);
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
            <span className="w-40 font-medium text-gray-600">Payment ID:</span>
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
          {/* ─── status dropdown for admin, plain text for patient ─── */}
          <div className="flex items-center space-x-2">
            <span className="w-40 font-medium text-gray-600">
              Payment Status:
            </span>
            {role === "ADMIN" ? (
              <select
                value={payment.status}
                onChange={async (e) => {
                  const newStatus = e.target.value;
                  if (newStatus === "UNPAID") {
                    // your existing “mark unpaid” call
                    await handleMarkAsUnpaid();
                  } else if (newStatus === "DUE") {
                    // your existing “mark due” call
                    await handleMarkAsDue();
                  }
                }}
                className="px-3 py-1 bg-white border rounded-md text-sm focus:ring-2 focus:ring-blue-400"
              >
                {/* always show current status first */}
                <option value={payment.status} disabled>
                  {payment.status}
                </option>
                {payment.status === "PAID" && (
                  <option value="UNPAID">Unpaid</option>
                )}
                {payment.status === "PENDING" && (
                  <option value="DUE">Due</option>
                )}
                {payment.status === "FAILED" && (
                  <option value="DUE">Due</option>
                )}
              </select>
            ) : (
              <span className="text-gray-800">{payment.status}</span>
            )}
            {/* </div> */}
          </div>
          <div className="flex">
            <span className="w-40 font-medium text-gray-600">
              Payment Method:
            </span>
            <span className="text-gray-800">{payment.method}</span>
          </div>{" "}
          <div className="flex items-center space-x-2">
            <span className="w-40 font-medium text-gray-600">Delivery:</span>

            {role === "ADMIN" ? (
              <button
                onClick={handleToggleDelivery}
                disabled={togglingDelivery}
                className={`
        flex items-center gap-2 
         px-4 py-2 rounded-2xl text-sm font-medium
         transition
         ${
           delivered
             ? "bg-green-500 text-white hover:bg-green-600"
             : "bg-yellow-500 text-white hover:bg-yellow-600"
         }
         ${togglingDelivery && "opacity-70 cursor-wait"}`}
              >
                {togglingDelivery ? (
                  <MdAutorenew className="animate-spin" size={18} />
                ) : delivered ? (
                  <MdCheck size={18} />
                ) : (
                  <MdLocalShipping size={18} />
                )}
                {togglingDelivery
                  ? "Updating..."
                  : delivered
                  ? "Delivered"
                  : "Mark Delivered"}
              </button>
            ) : (
              <span className="text-gray-800">
                {delivered ? "Delivered" : "Pending"}
              </span>
            )}
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
            <strong>Instructions:</strong> {prescription.generalInstructions}
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
                <th className="py-2 px-4 text-sm font-medium">Medicine Name</th>
                <th className="py-2 px-4 text-sm font-medium">Unit</th>
                <th className="py-2 px-4 text-sm font-medium">Quantity</th>
                <th className="py-2 px-4 text-sm font-medium">Selling Price</th>
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
        {/* === Show selected dues & final total === */}
        {payableDues.length > 0 && (
          <div className="mt-4 p-4 bg-blue-50 rounded border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2">
              You’ll also pay these dues:
            </h4>
            <ul className="list-disc list-inside mb-2">
              {payableDues.map((d) => {
                const dueAmt = Number(d.totalAmount) - Number(d.paidAmount);
                return (
                  <li key={d.id} className="flex justify-between">
                    <span>
                      # {d.id} – ${dueAmt.toFixed(2)}
                    </span>
                    <button
                      onClick={() => {
                        // “untick” a due
                        setPayableDues((curr) =>
                          curr.filter((x) => x.id !== d.id)
                        );
                        setDues((curr) => [...curr, d]); // put it back in the dues list
                      }}
                      className="text-red-500 hover:underline text-sm"
                    >
                      Remove
                    </button>
                  </li>
                );
              })}
            </ul>
            <div className="text-right font-semibold">
              Current Amount: ${calculatedTotal.toFixed(2)}
              <br />
              Dues Total: ${payableAmountSum.toFixed(2)}
              <br />
              <span className="text-lg">
                Final Amount: ${(calculatedTotal + payableAmountSum).toFixed(2)}
              </span>
            </div>
          </div>
        )}
      </div>
      {dues.length > 0 && (
        <div className="mt-6 bg-yellow-50 p-4 rounded border border-yellow-300">
          <h4 className="font-semibold text-yellow-800 mb-2">Previous Dues</h4>
          <ul className="space-y-1 mb-3">
            {dues.map((d) => (
              <li key={d.id} className="flex justify-between items-center">
                <span>
                  #{d.id}: ${(d.totalAmount - d.paidAmount).toFixed(2)}
                </span>
                <button
                  disabled={applyingDueId === d.id}
                  onClick={() => handleApplyDue(d)}
                  className="text-blue-600 hover:underline text-sm"
                >
                  {applyingDueId === d.id ? "Applying…" : "Apply Full Due"}
                </button>
              </li>
            ))}
          </ul>

          {/* 4️⃣ Partial-pay input */}
          <div className="flex items-center space-x-2">
            <input
              type="number"
              min="0"
              placeholder="Custom amount"
              value={partialAmount}
              onChange={(e) => setPartialAmount(e.target.value)}
              className="border px-2 py-1 rounded w-32"
            />
            <button
              disabled={payingPartial || !partialAmount}
              onClick={handlePayPartial}
              className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
            >
              {payingPartial ? "Processing…" : "Pay Partial"}
            </button>
          </div>
        </div>
      )}

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
            onClick={handleFinalizeCash}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Pay Cash
          </button>
        ) : null}

        {/* <button
          onClick={handleToggleDelivery}
          className={`flex items-center gap-2 px-4 py-2 rounded ${
            delivered
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-yellow-500 text-white hover:bg-yellow-600"
          } transition`}
        >
          <MdLocalShipping />
          {delivered ? "Mark as Not Delivered" : "Mark as Delivered"}
        </button> */}
        {/* ==== NEW: Show list of previous dues ==== */}
      </div>

      {/* QR Code & File Upload Section */}
      {payment.status !== "PAID" &&
        !payment.paymentScreenshotPath &&
        showQRCode && (
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
      {payment.method === "ONLINE" && payment.paymentScreenshotPath && (
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
      {/* Prev / Next */}
      <div className="flex justify-between">
        <button
          onClick={() =>
            prevId && navigate(`../${prevId}`, { relative: "path" })
          }
          disabled={!prevId}
          className={`px-4 py-2 rounded ${
            prevId ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-500"
          }`}
        >
          ← Previous
        </button>
        <button
          onClick={() =>
            nextId && navigate(`../${nextId}`, { relative: "path" })
          }
          disabled={!nextId}
          className={`px-4 py-2 rounded ${
            nextId ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-500"
          }`}
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default PaymentDetails;
