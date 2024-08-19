import React, { useState } from "react";
import AdminNavbar from "../../components/AdminNavbar"
const DoctorSearch = () => {
  const [keyword, setKeyword] = useState("");
  const [doctors, setDoctors] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_BACKEND_URL+`/doctor/searchDoctors/${keyword}`);
      const data = await response.json();
      setDoctors(data);
    } catch (error) {
      console.error("Error searching doctors:", error);
    }
  };

  return (
    <>
    <AdminNavbar/>
    <div className="container mx-auto p-6">
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-bold mb-4">Search Doctors</h2>
        <input
          type="text"
          placeholder="Search doctors by name, specialization, or city"
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

      {doctors.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead>
              <tr>
                <th className="px-6 py-3 border-b border-gray-200 bg-gray-100 text-left text-sm leading-4 text-gray-600 font-medium">
                  Doctor Name
                </th>
                <th className="px-6 py-3 border-b border-gray-200 bg-gray-100 text-left text-sm leading-4 text-gray-600 font-medium">
                  DoctorId
                </th>
                <th className="px-6 py-3 border-b border-gray-200 bg-gray-100 text-left text-sm leading-4 text-gray-600 font-medium">
                  Specialization
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
                <th className="px-6 py-3 border-b border-gray-200 bg-gray-100 text-left text-sm leading-4 text-gray-600 font-medium">
                  Consultation Fee
                </th>
                <th className="px-6 py-3 border-b border-gray-200 bg-gray-100 text-left text-sm leading-4 text-gray-600 font-medium">
                  Remuneration
                </th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doctor) => (
                <tr key={doctor.id} className="hover:bg-gray-100">
                  <td className="px-6 py-4 border-b border-gray-200 text-sm">
                    {doctor.doctorName}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200 text-sm">
                    {doctor.doctorId}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200 text-sm">
                    {doctor.doctorDetails.specialization}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200 text-sm">
                    {doctor.doctorDetails.city}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200 text-sm">
                    {doctor.doctorDetails.age}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200 text-sm">
                    {doctor.doctorDetails.gender}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200 text-sm">
                    {doctor.doctorDetails.address}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200 text-sm">
                    {doctor.doctorDetails.pincode}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200 text-sm">
                    ${doctor.doctorDetails.consultationFee}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200 text-sm">
                    ${doctor.doctorDetails.remuneration}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-600 text-center">No doctors found</p>
      )}
    </div>
      </>
  );
};

export default DoctorSearch;
