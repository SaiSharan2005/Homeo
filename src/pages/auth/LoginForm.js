import React, { useState } from "react";
import { MdPhone, MdLock } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
// Import the login service and aboutMe fetching service
import { Login as loginService } from "../../services/patient/patient_api.js";
import { fetchAboutMe } from "../../services/other/other.js";

function LoginForm() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { phoneNumber: phone, password: password };

    try {
      const success = await loginService(data);
      const aboutMe = await fetchAboutMe();
      if (success && aboutMe && aboutMe.roles && aboutMe.roles.length > 0) {
        // Assume the first role is the primary one
        const role = aboutMe.roles[0].name.toUpperCase();
        const name = aboutMe.username;
        localStorage.setItem("USERNAME",name);
        const nameList = aboutMe.roles.map(item => item.name);

        // Navigate based on role
        switch (role) {
          case "DOCTOR":
            localStorage.setItem("ROLE", "DOCTOR");
            navigate("/doctor/home");
            break;
          case "PATIENT":
            localStorage.setItem("ROLE", "PATIENT");
            navigate("/patient/home");
            break;
          case "ADMIN":
            localStorage.setItem("ROLE", "ADMIN");

            navigate("/admin/home");
            break;
          case "STAFF":
            localStorage.setItem("ROLE", "STAFF");


            localStorage.setItem("ROLES",JSON.stringify(nameList));
            navigate("/staff/home");
            break;
          default:
            localStorage.setItem("ROLE", "STAFF");
            localStorage.setItem("ROLES",JSON.stringify(nameList));
            navigate("/staff/home");
            // navigate("/dashboard");
        }
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred during login.");
    }
  };

  return (
    <div className="min-h-[500px] flex flex-col justify-center p-8 bg-white rounded-2xl max-w-2xl mx-auto">
      <h2 className="mb-8 text-3xl font-bold text-center text-gray-800">Login</h2>
      {error && <p className="mb-4 text-center text-red-500">{error}</p>}
      <form className="space-y-8" onSubmit={handleSubmit}>
        {/* Phone Number Field */}
        <div>
          <label htmlFor="phone" className="block mb-2 text-sm font-semibold text-gray-700">
            Phone Number
          </label>
          <div className="relative">
            <MdPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
            <input
              id="phone"
              type="tel"
              placeholder="Enter your phone number"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 pl-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 transition duration-200"
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="password" className="block mb-2 text-sm font-semibold text-gray-700">
            Password
          </label>
          <div className="relative">
            <MdLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 pl-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 transition duration-200"
            />
          </div>
        </div>

        {/* Forgot Password Link */}
        <div className="text-right">
          <a href="#" className="text-sm text-green-600 hover:underline">
            Forgot Password?
          </a>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 transition transform hover:scale-105"
        >
          LOGIN
        </button>
      </form>

      {/* Footer Links */}
      <div className="mt-10 text-sm text-center text-gray-600">
        If you don't have an account,{" "}
        <Link to="/patient/signup" className="font-medium text-green-600 hover:underline">
          Register here
        </Link>
      </div>
      <div className="mt-4 text-sm text-center text-gray-600">
        <a href="#" className="font-medium text-green-600 hover:underline">
          Need help?
        </a>
      </div>
    </div>
  );
}

export default LoginForm;
