import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PatientSearchPage = () => {
  const navigate = useNavigate();

  // ─────── STATE ─────────────────────────────────────────────────
  const [keyword, setKeyword] = useState("");
  const [patientsPage, setPatientsPage] = useState({ content: [], totalPages: 0 });
  const [page, setPage] = useState(0);
  const size = 10; // or pull from state if you want dynamic sizes
  // ────────────────────────────────────────────────────────────────

  // Whenever keyword changes, reset to first page
  useEffect(() => {
    setPage(0);
  }, [keyword]);

  // Fetch a page of search results on (keyword, page) change
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const resp = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/patient/search?query=${encodeURIComponent(
            keyword
          )}&page=${page}&size=${size}`
        );
        if (!resp.ok) throw new Error("Fetch failed");
        const data = await resp.json();
        // data has fields: content, totalPages, totalElements, etc.
        setPatientsPage({
          content: data.content || [],
          totalPages: data.totalPages || 0,
        });
      } catch (err) {
        console.error("Error fetching patients:", err);
        setPatientsPage({ content: [], totalPages: 0 });
      }
    };
    fetchPatients();
  }, [keyword, page]);

  // Render profile image or initial
  const renderProfile = (patient) =>
    patient.imageUrl ? (
      <img
        src={patient.imageUrl}
        alt={patient.username}
        className="w-10 h-10 rounded-full object-cover"
      />
    ) : (
      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold text-gray-700">
        {patient.username?.[0]?.toUpperCase() || "?"}
      </div>
    );

  // Gender icon
  const renderGenderIcon = (g) => {
    if (!g) return "-";
    const gender = g.toLowerCase();
    if (gender === "male") return <span>♂️</span>;
    if (gender === "female") return <span>♀️</span>;
    return <span>⚧</span>;
  };

  // Table rows
  const rows = patientsPage.content.map((p) => (
    <tr
      key={p.id}
      className="hover:bg-gray-50 cursor-pointer"
      onClick={() =>
        navigate(`profile/${p.userId || p.id}`)
      }
    >
      <td className="px-6 py-4 border-b">{renderProfile(p)}</td>
      <td className="px-6 py-4 border-b">{p.username || "-"}</td>
      <td className="px-6 py-4 border-b">{p.userId || "-"}</td>
      <td className="px-6 py-4 border-b">{p.patientDetails?.city || "-"}</td>
      <td className="px-6 py-4 border-b">{p.patientDetails?.age || "-"}</td>
      <td className="px-6 py-4 border-b">
        {renderGenderIcon(p.patientDetails?.gender)}
      </td>
      <td className="px-6 py-4 border-b">{p.patientDetails?.address || "-"}</td>
      <td className="px-6 py-4 border-b">{p.patientDetails?.pincode || "-"}</td>
    </tr>
  ));

  return (
    <div className="container mx-auto p-6">
      {/* Header & Search Bar */}
      <div className="bg-white rounded-md shadow p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Search Patients</h2>
          <button
            onClick={() => navigate("addPatient")}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
          >
            Add Patient
          </button>
        </div>
        <input
          type="text"
          placeholder="Search by name, ID, or city"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Results Table */}
      {rows.length > 0 ? (
        <div className="overflow-x-auto bg-white rounded-md shadow">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-100 text-gray-600 border-b">
                <th className="px-6 py-3 text-sm">Profile</th>
                <th className="px-6 py-3 text-sm">Patient Name</th>
                <th className="px-6 py-3 text-sm">Patient ID</th>
                <th className="px-6 py-3 text-sm">City</th>
                <th className="px-6 py-3 text-sm">Age</th>
                <th className="px-6 py-3 text-sm">Gender</th>
                <th className="px-6 py-3 text-sm">Address</th>
                <th className="px-6 py-3 text-sm">Pincode</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm">{rows}</tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-600">No patients found.</p>
      )}

      {/* Pagination Controls */}
      {patientsPage.totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 space-x-2">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
            disabled={page === 0}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          {Array.from({ length: patientsPage.totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`px-3 py-1 border rounded ${
                i === page ? "bg-blue-500 text-white" : ""
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() =>
              setPage((prev) =>
                Math.min(prev + 1, patientsPage.totalPages - 1)
              )
            }
            disabled={page >= patientsPage.totalPages - 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default PatientSearchPage;
