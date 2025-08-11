import React, { useState, useEffect } from "react";
import image from "../../../images/image.jpg";
import { Link } from "react-router-dom";
import AdBanner from "../Adv";
import { fetchAvailableDoctors } from '../../../services/doctor/doctor_api';
import apiService from '../../../utils/api';

const specialties = [
  "Primary Care Doctor",
  "OB-GYN",
  "Dermatologist",
  "Orthopedic Surgeon",
  "Cardiologist",
  "Psychiatrist",
];

const insurances = [
  "Blue Cross Blue Shield",
  "Aetna",
  "Cigna",
  "United Healthcare",
  "Medicare",
  "Humana",
];

export default function DoctorSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);

  const [hasRightAd, setHasRightAd] = useState(false);
  const [hasBottomAd, setHasBottomAd] = useState(false);

  // Pagination state
  const [page, setPage] = useState(0);
  const size = 10;
  const [totalPages, setTotalPages] = useState(0);

  // Fetch doctors with paging
  useEffect(() => {
    (async () => {
      try {
        const data = await fetchAvailableDoctors(page, size);
        if (data.content) {
          setDoctors(data.content);
          setFilteredDoctors(data.content);
          setTotalPages(data.totalPages || 0);
        } else {
          setDoctors(data);
          setFilteredDoctors(data);
          setTotalPages(1);
        }
      } catch (e) {
        console.error("Error fetching doctors:", e);
      }
    })();
  }, [page]);

  // Check for right‑side ad
  useEffect(() => {
    (async () => {
      try {
        const ad = await apiService.get(`/ads/active?targetPage=${encodeURIComponent('doctor-search-right')}`);
        setHasRightAd(!!ad);
      } catch {}
    })();
  }, []);

  // Check for bottom ad
  useEffect(() => {
    (async () => {
      try {
        const ad = await apiService.get(`/ads/active?targetPage=${encodeURIComponent('doctor-search-bottom')}`);
        setHasBottomAd(!!ad);
      } catch {}
    })();
  }, []);

  // Filter local list by search term
  useEffect(() => {
    const term = searchTerm.toLowerCase();
    setFilteredDoctors(
      doctors.filter((doc) =>
        [doc.username, doc.email, doc.doctorId]
          .filter(Boolean)
          .some((field) =>
            field.toLowerCase().includes(term)
          )
      )
    );
  }, [searchTerm, doctors]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const containerClasses = hasRightAd
    ? "flex max-w-6xl mx-auto gap-6"
    : "max-w-6xl mx-auto";

  return (
    <>
      <div className={containerClasses}>
        {/* Main search card */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 flex-1">
          <h3 className="text-2xl font-medium text-gray-900 mb-2">
            Find a doctor
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Use the search box or explore by specialty or insurance to find a
            doctor that suits your needs.
          </p>

          <input
            type="text"
            placeholder="Search by name, specialty, or condition"
            className="py-2 px-4 w-full mb-6 rounded border border-gray-300"
            value={searchTerm}
            onChange={handleSearchChange}
          />

          <div className="mb-6">
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              Popular specialties
            </h4>
            <div className="flex flex-wrap gap-2">
              {specialties.map((s, i) => (
                <span
                  key={i}
                  className="bg-[#AADCD2] text-gray-700 px-3 py-1 rounded-full text-sm"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              Popular insurance
            </h4>
            <div className="flex flex-wrap gap-2">
              {insurances.map((ins, i) => (
                <span
                  key={i}
                  className="bg-[#AADCD2] text-gray-700 px-3 py-1 rounded-full text-sm"
                >
                  {ins}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              Available Doctors
            </h4>
            <div>
              {filteredDoctors.map((doc, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-3 border-b"
                >
                  <div className="flex items-center">
                    <img
                      src={image}
                      alt={doc.username}
                      className="h-10 w-10 rounded-full mr-4"
                    />
                    <div>
                      <p className="text-lg font-medium text-gray-900">
                        {doc.username}
                      </p>
                      <p className="text-sm text-gray-500">
                        {doc.doctorDetails?.specialization ||
                          "Specialization not mentioned"}
                      </p>
                    </div>
                  </div>
                  <Link to={`/patient/BookAppoinment/${doc.id}`}>
                    <button className="bg-[#AADCD2] text-gray-700 px-4 py-1 rounded-full text-sm hover:bg-[#93ccc2]">
                      Book now
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* right‑side ad */}
        {hasRightAd && (
          <div className="hidden lg:block">
            <AdBanner targetPage="doctor-search-right" />
          </div>
        )}
      </div>

      {/* bottom ad */}
      {hasBottomAd && (
        <div className="mt-8">
          <AdBanner targetPage="doctor-search-bottom" className="w-full" />
        </div>
      )}

      {/* Pagination Bar */}
      <div className="flex justify-center items-center mt-6 space-x-2">
        <button
          onClick={() => setPage(p => Math.max(p - 1, 0))}
          disabled={page === 0}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setPage(i)}
            className={`px-3 py-1 border rounded ${i === page ? "bg-blue-500 text-white" : ""}`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => setPage(p => Math.min(p + 1, totalPages - 1))}
          disabled={page >= totalPages - 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </>
  );
}
