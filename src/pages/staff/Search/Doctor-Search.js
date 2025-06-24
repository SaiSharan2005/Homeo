import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const DoctorSearchPage = () => {
  const navigate = useNavigate();

  // search keyword + pagination state
  const [keyword, setKeyword] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [page, setPage] = useState(0);
  const [size] = useState(20);
  const [totalPages, setTotalPages] = useState(0);

  // whenever `keyword` or `page` changes, fetch from backend
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const params = new URLSearchParams({
          keyword,
          page: page.toString(),
          size: size.toString(),
        });
        const res = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/doctor/search?${params}`
        );
        if (!res.ok) {
          throw new Error("Failed to fetch doctors");
        }
        const data = await res.json();
        setDoctors(data.content || []);
        setTotalPages(data.totalPages);
      } catch (err) {
        console.error(err);
      }
    };

    fetchDoctors();
  }, [keyword, page, size]);

  const renderGenderIcon = (gender) => {
    if (!gender) return "-";
    const g = gender.toLowerCase();
    if (g === "male")
      return (
        <span role="img" aria-label="Male">
          ♂️
        </span>
      );
    if (g === "female")
      return (
        <span role="img" aria-label="Female">
          ♀️
        </span>
      );
    return (
      <span role="img" aria-label="Other">
        ⚧
      </span>
    );
  };

  const renderProfile = (doctor) =>
    doctor.imageUrl ? (
      <img
        src={doctor.imageUrl}
        alt={doctor.username}
        className="w-10 h-10 rounded-full object-cover"
      />
    ) : (
      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold text-gray-700">
        {doctor.username ? doctor.username[0].toUpperCase() : "?"}
      </div>
    );

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white rounded-md shadow p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Search Doctors</h2>
          <button
            onClick={() => navigate("addDoctor")}
            className="mt-2 md:mt-0 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
          >
            Add Doctor
          </button>
        </div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search doctors by name, specialization, or city"
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              setPage(0);
            }}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            aria-label="Search doctors"
          />
        </div>
      </div>

      {doctors.length > 0 ? (
        <div className="overflow-x-auto mb-4 bg-white rounded-md shadow">
          <table className="w-full table-auto text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-600 border-b">
                {[
                  "Profile",
                  "Doctor Name",
                                    "Phone",

                  "Doctor ID",
                  "Specialization",
                  "City",
                  "Age",
                  "Gender",
                  "Address",
                  "Pincode",
                  "Fee",
                ].map((h) => (
                  <th key={h} className="px-6 py-3 text-sm font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm">
              {doctors.map((doc) => (
                <tr
                  key={doc.id}
                  className="hover:bg-gray-50 transition cursor-pointer border-b"
                  onClick={() => navigate(`profile/${doc.userId || doc.id}`)}
                >
                  <td className="px-6 py-4">{renderProfile(doc)}</td>
                  <td className="px-6 py-4">{doc.username || "-"}</td>
                  <td className="px-6 py-4">{doc.phoneNumber || "-"}</td>

                  <td className="px-6 py-4">{doc.userId || "-"}</td>
                  <td className="px-6 py-4">
                    {doc.doctorDetails?.specialization || "-"}
                  </td>
                  <td className="px-6 py-4">
                    {doc.doctorDetails?.city || "-"}
                  </td>
                  <td className="px-6 py-4">{doc.doctorDetails?.age || "-"}</td>
                  <td className="px-6 py-4">
                    {renderGenderIcon(doc.doctorDetails?.gender)}
                  </td>
                  <td className="px-6 py-4">
                    {doc.doctorDetails?.address || "-"}
                  </td>
                  <td className="px-6 py-4">
                    {doc.doctorDetails?.pincode || "-"}
                  </td>
                  <td className="px-6 py-4">
                    {doc.doctorDetails?.consultationFee != null
                      ? `$${doc.doctorDetails.consultationFee}`
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-600 text-center">No doctors found</p>
      )}

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 0))}
            disabled={page === 0}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {page + 1} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
            disabled={page === totalPages - 1}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default DoctorSearchPage;
