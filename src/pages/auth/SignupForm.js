import React, { useState } from 'react';
import { MdPerson, MdPhone, MdEmail, MdLock } from "react-icons/md";
import { useNavigate } from 'react-router-dom';

import {Signup } from "../../services/patient/patient_api"
export default function SignUpForm({ rolesFromParams }) {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    name: "",
    number: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState(null);

  // Use roles from props, defaulting to ["PATIENT"] if not provided
  const roles = rolesFromParams || ["PATIENT"];

  const onChange = (event) => {
    const { name, value } = event.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = {
      username: credentials.name,
      phoneNumber: credentials.number,
      email: credentials.email,
      password: credentials.password,
      roles: roles, // using roles from props
    };

    try {
      const responseData = await Signup(data);
      localStorage.setItem("Token", responseData.token);
      console.log('Patient registered successfully:', responseData);

      // Navigate to the respective details page based on role
      if (roles.includes("PATIENT")) {
        navigate("/patient/details", { state: { data: responseData } });
      } else if (roles.includes("DOCTOR")) {
        navigate("/doctor/details", { state: { data: responseData } });
      }
    } catch (error) {
      console.error('Error registering patient:', error.message);
      setError(error.message);
    }
  };

  return (
    <div className="min-h-[400px] flex flex-col justify-center p-6 bg-white rounded-2xl max-w-2xl mx-auto">
      <h2 className="mb-4 text-3xl font-bold text-center text-gray-800">Sign Up</h2>
      {error && <p className="mb-4 text-center text-red-500">{error}</p>}
      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block mb-1 text-sm font-semibold text-gray-700">
            Name
          </label>
          <div className="relative">
            <MdPerson className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your name"
              required
              value={credentials.name}
              onChange={onChange}
              className="w-full px-3 pl-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 transition duration-200"
            />
          </div>
        </div>

        {/* Phone Number Field */}
        <div>
          <label htmlFor="number" className="block mb-1 text-sm font-semibold text-gray-700">
            Phone Number
          </label>
          <div className="relative">
            <MdPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
            <input
              id="number"
              name="number"
              type="tel"
              placeholder="Enter your phone number"
              required
              value={credentials.number}
              onChange={onChange}
              className="w-full px-3 pl-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 transition duration-200"
            />
          </div>
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block mb-1 text-sm font-semibold text-gray-700">
            Email
          </label>
          <div className="relative">
            <MdEmail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              required
              value={credentials.email}
              onChange={onChange}
              className="w-full px-3 pl-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 transition duration-200"
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="password" className="block mb-1 text-sm font-semibold text-gray-700">
            Password
          </label>
          <div className="relative">
            <MdLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              required
              value={credentials.password}
              onChange={onChange}
              className="w-full px-3 pl-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 transition duration-200"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 transition transform hover:scale-105"
        >
          SIGN UP
        </button>
      </form>

      {/* Footer Links */}
      <div className="mt-4 text-sm text-center text-gray-600">
        Already have an account?{' '}
        <a href="#" className="font-medium text-green-600 hover:underline">
          Login here
        </a>
      </div>
      <div className="mt-2 text-sm text-center text-gray-600">
        <a href="#" className="font-medium text-green-600 hover:underline">
          Need help?
        </a>
      </div>
    </div>
  );
}
