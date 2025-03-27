import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { 
  MdCake, 
  MdTransgender, 
  MdHome, 
  MdLocationCity, 
  MdLocalPostOffice, 
  MdAttachMoney, 
  MdMedicalServices, 
  MdMonetizationOn 
} from 'react-icons/md';
import { addDoctorProfile } from '../../services/doctor/doctor_api'; // Adjust the path as needed

export default function DoctorDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = location.state || {};
  
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    address: '',
    city: '',
    pincode: '',
    consultationFee: '',
    specialization: '',
    remuneration: ''
  });
  
  useEffect(() => {
    // Optionally, use data if needed
  }, [data]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Attach doctorId from location data
    try {
      const responseData = await addDoctorProfile(formData);
      if (responseData) {
        console.log('Doctor details saved successfully!', responseData);
      } else {
        console.error('Failed to save doctor details');
      }
      navigate("/login");
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  return (
    <div className="min-h-[400px] flex flex-col justify-center p-6 bg-white rounded-2xl max-w-2xl mx-auto">
      <h2 className="mb-4 text-3xl font-bold text-center text-gray-800">Doctor Details</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Two columns layout for input fields */}
        <div className="flex flex-wrap -mx-2">
          {/* Age Field */}
          <div className="w-full sm:w-1/2 px-2 mb-4">
            <label htmlFor="age" className="mb-1 block text-sm font-medium text-gray-700">Age</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MdCake className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="age"
                name="age"
                type="number"
                placeholder="Enter Age"
                value={formData.age}
                onChange={handleInputChange}
                required
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 transition duration-200 text-sm"
              />
            </div>
          </div>
          {/* Gender Field */}
          <div className="w-full sm:w-1/2 px-2 mb-4">
            <label htmlFor="gender" className="mb-1 block text-sm font-medium text-gray-700">Gender</label>
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
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-300 transition duration-200 text-sm"
              >
                <option value="" disabled>Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          {/* Address Field */}
          <div className="w-full sm:w-1/2 px-2 mb-4">
            <label htmlFor="address" className="mb-1 block text-sm font-medium text-gray-700">Address</label>
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
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 transition duration-200 text-sm"
              />
            </div>
          </div>
          {/* City Field */}
          <div className="w-full sm:w-1/2 px-2 mb-4">
            <label htmlFor="city" className="mb-1 block text-sm font-medium text-gray-700">City</label>
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
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 transition duration-200 text-sm"
              />
            </div>
          </div>
          {/* Pincode Field */}
          <div className="w-full sm:w-1/2 px-2 mb-4">
            <label htmlFor="pincode" className="mb-1 block text-sm font-medium text-gray-700">Pincode</label>
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
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 transition duration-200 text-sm"
              />
            </div>
          </div>
          {/* Consultation Fee Field */}
          <div className="w-full sm:w-1/2 px-2 mb-4">
            <label htmlFor="consultationFee" className="mb-1 block text-sm font-medium text-gray-700">Consultation Fee</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MdAttachMoney className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="consultationFee"
                name="consultationFee"
                type="number"
                placeholder="Enter Fee"
                value={formData.consultationFee}
                onChange={handleInputChange}
                required
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 transition duration-200 text-sm"
              />
            </div>
          </div>
          {/* Specialization Field */}
          <div className="w-full sm:w-1/2 px-2 mb-4">
            <label htmlFor="specialization" className="mb-1 block text-sm font-medium text-gray-700">Specialization</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MdMedicalServices className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="specialization"
                name="specialization"
                type="text"
                placeholder="Enter Specialization"
                value={formData.specialization}
                onChange={handleInputChange}
                required
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 transition duration-200 text-sm"
              />
            </div>
          </div>
          {/* Remuneration Field */}
          <div className="w-full sm:w-1/2 px-2 mb-4">
            <label htmlFor="remuneration" className="mb-1 block text-sm font-medium text-gray-700">Remuneration</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MdMonetizationOn className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="remuneration"
                name="remuneration"
                type="number"
                placeholder="Enter Remuneration"
                value={formData.remuneration}
                onChange={handleInputChange}
                required
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 transition duration-200 text-sm"
              />
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="w-full py-2 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 transition transform hover:scale-105"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
