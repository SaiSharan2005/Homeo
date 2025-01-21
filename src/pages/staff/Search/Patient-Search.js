import React, { useState } from "react";
import AdminNavbar from "../../../components/AdminNavbar"

const PatientSearch = () => {
  const [keyword, setKeyword] = useState("");
  const [patients, setPatients] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_BACKEND_URL+`/patient/searchPatient/${keyword}`);
      const data = await response.json();
      setPatients(data);
    } catch (error) {
      console.error("Error searching patients:", error);
    }
  };

  return (<>
  <AdminNavbar/>
    <div className="container mx-auto p-6">
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-bold mb-4">Search Patients</h2>
        <input
          type="text"
          placeholder="Search patients by name, ID, or city"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      {patients.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead>
              <tr>
                <th className="px-6 py-3 border-b border-gray-200 bg-gray-100 text-left text-sm leading-4 text-gray-600 font-medium">
                  Patient Name
                </th>
                <th className="px-6 py-3 border-b border-gray-200 bg-gray-100 text-left text-sm leading-4 text-gray-600 font-medium">
                  Patient ID
                </th>
                <th className="px-6 py-3 border-b border-gray-200 bg-gray-100 text-left text-sm leading-4 text-gray-600 font-medium">
                  City
                </th>
                <th className="px-6 py-3 border-b border-gray-200 bg-gray-100 text-left text-sm leading-4 text-gray-600 font-medium">
                  Age
                </th>
                <th className="px-6 py-3 border-b border-gray-200 bg-gray-100 text-left text-sm leading-4 text-gray-600 font-medium">
                  Gender
                </th>
                <th className="px-6 py-3 border-b border-gray-200 bg-gray-100 text-left text-sm leading-4 text-gray-600 font-medium">
                  Address
                </th>
                <th className="px-6 py-3 border-b border-gray-200 bg-gray-100 text-left text-sm leading-4 text-gray-600 font-medium">
                  Pincode
                </th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={patient.id} className="hover:bg-gray-100">
                  <td className="px-6 py-4 border-b border-gray-200 text-sm">
                    {patient.username}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200 text-sm">
                    {patient.userId}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200 text-sm">
                    {patient.patientDetails ? patient.patientDetails.city : "-"}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200 text-sm">
                    {patient.patientDetails ? patient.patientDetails.age : "-"}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200 text-sm">
                    {patient.patientDetails ? patient.patientDetails.gender : "-"}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200 text-sm">
                    {patient.patientDetails ? patient.patientDetails.address : "-"}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200 text-sm">
                    {patient.patientDetails ? patient.patientDetails.pincode : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-600 text-center">No patients found</p>
      )}
    </div>
    </>

  );
};

export default PatientSearch;
