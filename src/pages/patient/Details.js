import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { MdCake, MdTransgender, MdHome, MdLocationCity, MdLocalPostOffice } from 'react-icons/md';
import { savePatientProfile } from '../../services/patient/patient_api';

export default function PatientDetails() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    dateOfBirth: '',
    gender: '',  
    address: '',
    city: '',
    pincode: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await savePatientProfile(formData);
      if (response) {
        console.log('Patient details saved successfully!');
        navigate("/questionnaire/1");
      } else {
        console.error('Failed to save patient details');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-[400px] flex flex-col justify-center p-6 bg-white rounded-2xl max-w-2xl mx-auto">
      <h2 className="mb-4 text-3xl font-bold text-center text-gray-800">Patient Details</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Date of Birth Field */}
        <div className="flex flex-col">
          <label htmlFor="dateOfBirth" className="mb-1 text-sm font-medium text-gray-700">Date of Birth</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MdCake className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              placeholder="Enter Date of Birth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              required
              className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 transition duration-200"
            />
          </div>
        </div>
        {/* Gender Field */}
        <div className="flex flex-col">
          <label htmlFor="gender" className="mb-1 text-sm font-medium text-gray-700">Gender</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MdTransgender className="h-5 w-5 text-gray-400" />
            </div>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              required
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-300 transition duration-200"
            >
              <option value="" disabled>Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
        {/* Address Field */}
        <div className="flex flex-col">
          <label htmlFor="address" className="mb-1 text-sm font-medium text-gray-700">Address</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MdHome className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="address"
              name="address"
              type="text"
              placeholder="Enter Address"
              value={formData.address}
              onChange={handleInputChange}
              required
              className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 transition duration-200"
            />
          </div>
        </div>
        {/* City Field */}
        <div className="flex flex-col">
          <label htmlFor="city" className="mb-1 text-sm font-medium text-gray-700">City</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MdLocationCity className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="city"
              name="city"
              type="text"
              placeholder="Enter City"
              value={formData.city}
              onChange={handleInputChange}
              required
              className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 transition duration-200"
            />
          </div>
        </div>
        {/* Pincode Field */}
        <div className="flex flex-col">
          <label htmlFor="pincode" className="mb-1 text-sm font-medium text-gray-700">Pincode</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MdLocalPostOffice className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="pincode"
              name="pincode"
              type="text"
              placeholder="Enter Pincode"
              value={formData.pincode}
              onChange={handleInputChange}
              required
              className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 transition duration-200"
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full py-2 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 transition transform hover:scale-105"
        >
          Submit
        </button>
      </form>
      <div className="mt-4 text-sm text-center text-gray-600">
        <a href="#" className="font-medium text-green-600 hover:underline">
          Need help?
        </a>
      </div>
    </div>
  );
}
