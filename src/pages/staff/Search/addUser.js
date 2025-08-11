import React, { useState } from "react";
import {
  MdPerson,
  MdEmail,
  MdPhone,
  MdLock,
  MdCake,
  MdTransgender,
  MdHome,
  MdLocationCity,
  MdLocalPostOffice,
  MdMedicalServices,
  MdAttachMoney,
  MdMonetizationOn,
} from "react-icons/md";
import { toast } from "react-toastify";
// import { Signup } from "../services/patient/patient_api";
import { Signup } from "../../../services/patient/patient_api";
import { addDoctorProfile } from "../../../services/doctor/doctor_api";
import apiService from "../../../utils/api";

export default function AdminAddUser({ initialRole = "PATIENT" }) {
  const [role, setRole] = useState(initialRole);
  const [baseData, setBaseData] = useState({
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
  });
  const [patientData, setPatientData] = useState({
    dateOfBirth: "",
    gender: "",
    address: "",
    city: "",
    pincode: "",
  });
  const [doctorData, setDoctorData] = useState({
    dateOfBirth: "",
    gender: "",
    address: "",
    city: "",
    pincode: "",
    specialization: "",
    consultationFee: "",
    remuneration: "",
  });
  const [error, setError] = useState("");

  const onBaseChange = (e) =>
    setBaseData({ ...baseData, [e.target.name]: e.target.value });
  const onPatientChange = (e) =>
    setPatientData({ ...patientData, [e.target.name]: e.target.value });
  const onDoctorChange = (e) =>
    setDoctorData({ ...doctorData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      // Sign up the user with selected role
      const user = await Signup({
        username: baseData.username,
        email: baseData.email,
        phoneNumber: baseData.phoneNumber,
        password: baseData.password,
        roles: [role],
      });

      // For roles with extra profile data, make additional API calls
      if (role === "PATIENT") {
        await apiService.post(`/patient/addProfile/${baseData.username}`, patientData);
      } else if (role === "DOCTOR") {
        await addDoctorProfile({ username: baseData.username, ...doctorData });
      }
      // For STAFF, only the signup is needed.

      toast.success(`${role} created successfully!`);

      // Reset base fields
      setBaseData({ username: "", email: "", phoneNumber: "", password: "" });
      // Reset profile fields if applicable
      setPatientData({ dateOfBirth: "", gender: "", address: "", city: "", pincode: "" });
      setDoctorData({
        dateOfBirth: "",
        gender: "",
        address: "",
        city: "",
        pincode: "",
        specialization: "",
        consultationFee: "",
        remuneration: "",
      });
    } catch (err) {
      console.error(err);
      setError(err.message || "An error occurred");
      toast.error(err.message || "Failed to create user. Please try again.");
    }
  };

  // Determine which extra profile fields and change handler to use based on role
  const profileFields =
    role === "PATIENT" ? patientData : role === "DOCTOR" ? doctorData : {};
  const onProfileChange =
    role === "PATIENT" ? onPatientChange : role === "DOCTOR" ? onDoctorChange : () => {};

  return (
    <div className="w-full max-w-3xl mx-auto p-8 bg-white rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Create <span className="uppercase">{role}</span>
      </h1>

      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-6">
        {/* Role selector */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Role
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 transition"
          >
            <option value="PATIENT">Patient</option>
            <option value="DOCTOR">Doctor</option>
            <option value="STAFF">Staff</option>
          </select>
        </div>

        {/* Base user fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { name: "username", icon: MdPerson, label: "Username", type: "text" },
            { name: "email", icon: MdEmail, label: "Email", type: "email" },
            { name: "phoneNumber", icon: MdPhone, label: "Phone", type: "tel" },
            { name: "password", icon: MdLock, label: "Password", type: "password" },
          ].map(({ name, icon: Icon, label, type }) => (
            <div key={name}>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                {label}
              </label>
              <div className="relative">
                <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  name={name}
                  type={type}
                  value={baseData[name]}
                  onChange={onBaseChange}
                  required
                  placeholder={label}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 transition"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Profile-specific fields for PATIENT and DOCTOR */}
        {(role === "PATIENT" || role === "DOCTOR") && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date of Birth */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Date of Birth
              </label>
              <div className="relative">
                <MdCake className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  name="dateOfBirth"
                  type="date"
                  value={profileFields.dateOfBirth}
                  onChange={onProfileChange}
                  required
                  placeholder="Date of Birth"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 transition"
                />
              </div>
            </div>

            {/* Gender */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Gender
              </label>
              <div className="relative">
                <MdTransgender className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select
                  name="gender"
                  value={profileFields.gender}
                  onChange={onProfileChange}
                  required
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 transition"
                >
                  <option value="">Select Gender</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Address
              </label>
              <div className="relative">
                <MdHome className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  name="address"
                  value={profileFields.address}
                  onChange={onProfileChange}
                  required
                  placeholder="Address"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 transition"
                />
              </div>
            </div>

            {/* City */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                City
              </label>
              <div className="relative">
                <MdLocationCity className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  name="city"
                  value={profileFields.city}
                  onChange={onProfileChange}
                  required
                  placeholder="City"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 transition"
                />
              </div>
            </div>

            {/* Pincode */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Pincode
              </label>
              <div className="relative">
                <MdLocalPostOffice className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  name="pincode"
                  value={profileFields.pincode}
                  onChange={onProfileChange}
                  required
                  placeholder="Pincode"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 transition"
                />
              </div>
            </div>

            {/* Doctor-only fields */}
            {role === "DOCTOR" && (
              <>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Specialization
                  </label>
                  <div className="relative">
                    <MdMedicalServices className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      name="specialization"
                      value={doctorData.specialization}
                      onChange={onDoctorChange}
                      required
                      placeholder="Specialization"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Consultation Fee
                  </label>
                  <div className="relative">
                    <MdAttachMoney className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      name="consultationFee"
                      type="number"
                      value={doctorData.consultationFee}
                      onChange={onDoctorChange}
                      required
                      placeholder="Fee"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Remuneration
                  </label>
                  <div className="relative">
                    <MdMonetizationOn className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      name="remuneration"
                      type="number"
                      value={doctorData.remuneration}
                      onChange={onDoctorChange}
                      required
                      placeholder="Remuneration"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 transition"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        <button
          type="submit"
          className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
        >
          Create {role.charAt(0) + role.slice(1).toLowerCase()}
        </button>
      </form>
    </div>
  );
}
