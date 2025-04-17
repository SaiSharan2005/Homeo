import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const DoctorSearchPage = () => {
  const [keyword, setKeyword] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const navigate = useNavigate();

  // Fetch all doctors on component mount.
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/doctor/all`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch doctors.");
        }
        const data = await response.json();
        setDoctors(data || []);
      } catch (err) {
        console.error("Error fetching doctors:", err);
      }
    };
    fetchDoctors();
  }, []);

  // Filter doctors based on the search keyword (by name, specialization, or city)
  useEffect(() => {
    const lowercasedKeyword = keyword.toLowerCase();
    const filtered = doctors.filter((doctor) => {
      const username = doctor.username?.toLowerCase() || "";
      const specialization =
        doctor.doctorDetails?.specialization?.toLowerCase() || "";
      const city = doctor.doctorDetails?.city?.toLowerCase() || "";
      return (
        username.includes(lowercasedKeyword) ||
        specialization.includes(lowercasedKeyword) ||
        city.includes(lowercasedKeyword)
      );
    });
    setFilteredDoctors(filtered);
  }, [keyword, doctors]);

  // Render a gender icon based on the gender field.
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

  // Render the profile image or a fallback placeholder.
  const renderProfile = (doctor) => {
    if (doctor.imageUrl) {
      return (
        <img
          src={doctor.imageUrl}
          alt={doctor.username}
          className="w-10 h-10 rounded-full object-cover"
        />
      );
    }
    return (
      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold text-gray-700">
        {doctor.username ? doctor.username.charAt(0).toUpperCase() : "?"}
      </div>
    );
  };

  // Render the table of doctor data.
  const renderTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full table-auto text-left border-collapse">
        <thead>
          <tr className="bg-gray-100 text-gray-600 border-b">
            <th className="px-6 py-3 text-sm font-medium">Profile</th>
            <th className="px-6 py-3 text-sm font-medium">Doctor Name</th>
            <th className="px-6 py-3 text-sm font-medium">Doctor ID</th>
            <th className="px-6 py-3 text-sm font-medium">Specialization</th>
            <th className="px-6 py-3 text-sm font-medium">City</th>
            <th className="px-6 py-3 text-sm font-medium">Age</th>
            <th className="px-6 py-3 text-sm font-medium">Gender</th>
            <th className="px-6 py-3 text-sm font-medium">Address</th>
            <th className="px-6 py-3 text-sm font-medium">Pincode</th>
            <th className="px-6 py-3 text-sm font-medium">Consultation Fee</th>
          </tr>
        </thead>
        <tbody className="text-gray-700 text-sm">
          {filteredDoctors.map((doctor) => (
            <tr
              key={doctor.id}
              className="hover:bg-gray-50 transition cursor-pointer border-b"
              onClick={() =>
                navigate(`profile/${doctor.userId || doctor.id}`)
              }
            >
              <td className="px-6 py-4">{renderProfile(doctor)}</td>
              <td className="px-6 py-4">{doctor.username || "-"}</td>
              <td className="px-6 py-4">{doctor.userId || "-"}</td>
              <td className="px-6 py-4">
                {doctor.doctorDetails?.specialization || "-"}
              </td>
              <td className="px-6 py-4">
                {doctor.doctorDetails?.city || "-"}
              </td>
              <td className="px-6 py-4">
                {doctor.doctorDetails?.age || "-"}
              </td>
              <td className="px-6 py-4">
                {renderGenderIcon(doctor.doctorDetails?.gender)}
              </td>
              <td className="px-6 py-4">
                {doctor.doctorDetails?.address || "-"}
              </td>
              <td className="px-6 py-4">
                {doctor.doctorDetails?.pincode || "-"}
              </td>
              <td className="px-6 py-4">
                $
                {doctor.doctorDetails?.consultationFee != null
                  ? doctor.doctorDetails.consultationFee
                  : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white rounded-md shadow p-6 mb-6">
        {/* Header: Title and Add Doctor Button */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Search Doctors</h2>
          <button
            onClick={() => navigate("addDoctor")}
            className="mt-2 md:mt-0 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
          >
            Add Doctor
          </button>
        </div>
        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search doctors by name, specialization, or city"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            aria-label="Search doctors"
          />
        </div>
      </div>

      {filteredDoctors.length > 0 ? (
        renderTable()
      ) : (
        <p className="text-gray-600 text-center">No doctors found</p>
      )}
    </div>
  );
};

export default DoctorSearchPage;
