import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DoctorLogin() {
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    phoneNumber: "",
    password: "",
  });

  const onChange = (event) => {
    const { name, value } = event.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const url = process.env.REACT_APP_BACKEND_URL + "/auth/login";
    const data = {
      phoneNumber: credentials.phoneNumber,
      password: credentials.password,
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }

      const responseData = await response.json();
      console.log("Doctor logged in successfully:", responseData);
      localStorage.setItem("userId", responseData.id);
      localStorage.setItem("doctorId", responseData.doctorId);
      localStorage.setItem("Token", responseData.token);
      localStorage.setItem("role", "DOCTOR");

      navigate("/doctor/home");
    } catch (error) {
      console.error("Error logging in doctor:", error.message);
      alert("Error logging in doctor: " + error.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full flex flex-col justify-center items-center gap-y-6 py-3 lg:py-8"
    >
      <div className="w-full flex flex-row flex-wrap justify-center gap-4 lg:gap-x-8">
        <input
          type="number"
          name="phoneNumber"
          className="w-11/24 md:w-5/12 px-4 py-3 mb-4 text-md border rounded-xl"
          placeholder="+91 Enter your number"
          value={credentials.phoneNumber}
          onChange={onChange}
          required
        />
        <input
          type="password"
          name="password"
          className="w-11/24 md:w-5/12 px-4 py-3 mb-4 text-md border rounded-xl"
          placeholder="Enter your password"
          value={credentials.password}
          onChange={onChange}
          required
        />
      </div>
      <button
        type="submit"
        className="inline font-semibold py-3 px-6 text-lg bg-[#228672] text-white rounded-full hover:bg-[#1a6456] focus:outline-none"
      >
        Submit
      </button>
    </form>
  );
}
