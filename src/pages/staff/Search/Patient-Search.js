import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// Optionally import a Navbar if needed
// import AdminNavbar from "../../../components/navbar/AdminNavbar";

const PatientSearchPage = () => {
  const [keyword, setKeyword] = useState("");
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const navigate = useNavigate();

  // Fetch all patients on component mount
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/patient/all`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch patients.");
        }
        const data = await response.json();
        setPatients(data || []);
      } catch (err) {
        console.error("Error fetching patients:", err);
      }
    };
    fetchPatients();
  }, []);

  // Filter patients based on the search keyword (by name, ID, or city)
  useEffect(() => {
    const lowercasedKeyword = keyword.toLowerCase();
    const filtered = patients.filter((patient) => {
      const username = patient.username?.toLowerCase() || "";
      const id = patient.userId?.toString().toLowerCase() || "";
      const city = patient.patientDetails?.city?.toLowerCase() || "";
      return (
        username.includes(lowercasedKeyword) ||
        id.includes(lowercasedKeyword) ||
        city.includes(lowercasedKeyword)
      );
    });
    setFilteredPatients(filtered);
  }, [keyword, patients]);

  // Render the profile image or fallback for a patient
  const renderProfile = (patient) => {
    if (patient.imageUrl) {
      return (
        <img
          src={patient.imageUrl}
          alt={patient.username}
          className="w-10 h-10 rounded-full object-cover"
        />
      );
    }
    return (
      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold text-gray-700">
        {patient.username ? patient.username.charAt(0).toUpperCase() : "?"}
      </div>
    );
  };

  // Render gender icon based on patientDetails.gender
  const renderGenderIcon = (gender) => {
    if (!gender) return "-";
    const g = gender.toLowerCase();
    if (g === "male") {
      return <span role="img" aria-label="Male">♂️</span>;
    } else if (g === "female") {
      return <span role="img" aria-label="Female">♀️</span>;
    } else {
      return <span role="img" aria-label="Other">⚧</span>;
    }
  };

  // Render the table of patient data
  const renderTable = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
        <thead>
          <tr className="bg-gray-100 text-gray-600 border-b">
            <th className="px-6 py-3 text-sm font-medium">Profile</th>
            <th className="px-6 py-3 text-sm font-medium">Patient Name</th>
            <th className="px-6 py-3 text-sm font-medium">Patient ID</th>
            <th className="px-6 py-3 text-sm font-medium">City</th>
            <th className="px-6 py-3 text-sm font-medium">Age</th>
            <th className="px-6 py-3 text-sm font-medium">Gender</th>
            <th className="px-6 py-3 text-sm font-medium">Address</th>
            <th className="px-6 py-3 text-sm font-medium">Pincode</th>
          </tr>
        </thead>
        <tbody className="text-gray-700 text-sm">
          {filteredPatients.map((patient) => (
            <tr
              key={patient.id}
              className="hover:bg-gray-50 transition cursor-pointer"
              onClick={() =>
                navigate(`profile/${patient.userId || patient.id}`)
              }
            >
              <td className="px-6 py-4 border-b">{renderProfile(patient)}</td>
              <td className="px-6 py-4 border-b">{patient.username || "-"}</td>
              <td className="px-6 py-4 border-b">{patient.userId || "-"}</td>
              <td className="px-6 py-4 border-b">
                {patient.patientDetails?.city || "-"}
              </td>
              <td className="px-6 py-4 border-b">
                {patient.patientDetails?.age || "-"}
              </td>
              <td className="px-6 py-4 border-b">
                {renderGenderIcon(patient.patientDetails?.gender)}
              </td>
              <td className="px-6 py-4 border-b">
                {patient.patientDetails?.address || "-"}
              </td>
              <td className="px-6 py-4 border-b">
                {patient.patientDetails?.pincode || "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="container mx-auto p-6">
      {/* Optionally include a Navbar here */}
      {/* <AdminNavbar /> */}
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
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <input
            type="text"
            placeholder="Search patients by name, ID, or city"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            aria-label="Search patients"
          />
        </div>
      </div>
      {filteredPatients.length > 0 ? (
        renderTable()
      ) : (
        <p className="text-gray-600 text-center">No patients found</p>
      )}
    </div>
  );
};

export default PatientSearchPage;
