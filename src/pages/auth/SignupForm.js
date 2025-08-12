import React, { useState, useEffect } from "react";
import { MdPerson, MdPhone, MdEmail, MdLock, MdVisibility, MdVisibilityOff } from "react-icons/md";
import { useNavigate, useLocation } from "react-router-dom";
import { Signup } from "../../services/patient/patient_api";
import { sendPasswordReset, verifyEmail } from "../../services/auth";

export default function SignUpForm({ rolesFromParams }) {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    name: "",
    number: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState(null);
  const [verificationSent, setVerificationSent] = useState(false);
  const [code, setCode] = useState("");

  // Use roles from props, defaulting to ["PATIENT"] if not provided
  const roles = rolesFromParams || ["PATIENT"];
  const isPatient = roles.includes("PATIENT");

  const onChange = (event) => {
    const { name, value } = event.target;
    // When updating the name field, do not allow spaces
    if (name === "name" && value.includes(" ")) {
      setError("Spaces are not allowed in the username.");
      return;
    } else {
      setError(null);
    }
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Prevent space key for the username field
  const handleNameKeyDown = (event) => {
    if (event.key === " ") {
      event.preventDefault();
      setError("Spaces are not allowed in the username.");
    }
  };

  // Prevent pasting text with spaces into the username field
  const handleNamePaste = (event) => {
    const pasteData = event.clipboardData.getData("text");
    if (pasteData.includes(" ")) {
      event.preventDefault();
      setError("Spaces are not allowed in the username.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate username (already prevented spaces during typing/paste)
    if (/\s/.test(credentials.name)) {
      setError("Username should not contain spaces.");
      return;
    }

    // Validate email format
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(credentials.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Validate phone number: exactly 10 digits
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(credentials.number)) {
      setError("Phone number must be exactly 10 digits.");
      return;
    }

    setError(null); // Clear errors if validations pass

    const data = {
      username: credentials.name,
      phoneNumber: credentials.number,
      email: credentials.email,
      password: credentials.password,
      roles: roles, // Using roles from props
    };

    try {
      const responseData = await Signup(data);
      if (!responseData.status) {
        setError(responseData?.message || "Sign up Failes ");
      }
      // Navigate to the respective details page based on role
      else if (roles.includes("DOCTOR")) {
        localStorage.setItem("ROLE", "DOCTOR");
        // Forward to doctor details page with responseData (which contains user data)
        navigate("/doctor/details", {
          state: { data: { username: data.username } },
        });
      } else if (roles.includes("PATIENT")) {
        localStorage.setItem("ROLE", "PATIENT");
        // navigate("/patient/details", { state: { data: responseData } });
        setVerificationSent(true);
      } else if (roles.includes("ADMIN")) {
        localStorage.setItem("ROLE", "ADMIN");
        navigate("/admin/home", { state: { data: responseData } });
      }
    } catch (error) {
      console.error("Error registering user:", error.message);
      setError(error.message);
    }
  };
  // ── new: request a 4‑digit code for the patient’s email
  const handleRequestCode = async (event) => {
    event.preventDefault();
    // reuse your validations for email/phone/etc.
    setError(null);
    try {
      await sendPasswordReset(credentials.email);
      setVerificationSent(true);
    } catch (error) {
      setError("Failed to send verification code. Please try again.");
    }
  };

  // ── new: confirm the code, then call real signup
  const handleConfirmCode = async (event) => {
    event.preventDefault();
    try {
      await verifyEmail(code);
      // now actually sign up
      navigate("/patient/details");
    } catch (error) {
      setError("Invalid or expired verification code.");
    }
  };
  const handleSignUpAndRequest = async (event) => {
    // stop the form/button default
    event.preventDefault();
    // run your normal signup logic
    await handleSubmit(event);
    // only if signup succeeded (no error), fire the code request
    if (!error) {
      await handleRequestCode(event);
    }
  };
  return (
    <div className="min-h-[400px] flex flex-col justify-center p-6 bg-white rounded-2xl max-w-2xl mx-auto">
      <h2 className="mb-4 text-3xl font-bold text-center text-gray-800">
        Sign Up
      </h2>
      {error && <p className="mb-4 text-center text-red-500">{error}</p>}
      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Name Field */}
        <div>
          <label
            htmlFor="name"
            className="block mb-1 text-sm font-semibold text-gray-700"
          >
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
              onKeyDown={handleNameKeyDown}
              onPaste={handleNamePaste}
              className="w-full px-3 pl-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 transition duration-200"
            />
          </div>
        </div>

        {/* Phone Number Field */}
        <div>
          <label
            htmlFor="number"
            className="block mb-1 text-sm font-semibold text-gray-700"
          >
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
          <label
            htmlFor="email"
            className="block mb-1 text-sm font-semibold text-gray-700"
          >
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
          <label
            htmlFor="password"
            className="block mb-1 text-sm font-semibold text-gray-700"
          >
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
        {/* <button
          type="submit"
          className="w-full py-2 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 transition transform hover:scale-105"
        >
          SIGN UP
        </button> */}

        {/* ── conditional submit UI for patient vs others */}
        {isPatient ? (
          !verificationSent ? (
            // 1️⃣ First click: sign them up (Signup + send code)
            <button
              type="button"
              //  onClick={()=>{handleSubmit(); handleRequestCode()}}
              onClick={handleSignUpAndRequest}
              className="w-full py-2 …"
            >
              Sign Up & Send Verification Code
            </button>
          ) : (
            <>
             
            </>
          )
        ) : (
          // Non‑patients still just call handleSubmit
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full py-2 …"
          >
            SIGN UP
          </button>
        )}
      </form>

      {/* Footer Links */}
      <div className="mt-4 text-sm text-center text-gray-600">
        Already have an account?{" "}
        <a href="#" className="font-medium text-green-600 hover:underline">
          Login here
        </a>
      </div>
      <div className="mt-2 text-sm text-center text-gray-600">
        <a href="#" className="font-medium text-green-600 hover:underline">
          Need help?
        </a>
      </div>
      {isPatient && verificationSent && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 w-full max-w-sm">
      <h3 className="text-xl font-semibold text-center mb-4">Enter OTP</h3>
      <div className="flex justify-center gap-2 mb-4">
        {[0, 1, 2, 3].map((i) => (
          <input
            key={i}
            type="text"
            maxLength={1}
            className="w-12 h-12 text-xl text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            value={code[i] || ""}
            onChange={(e) => {
              const newCode = [...code];
              newCode[i] = e.target.value;
              setCode(newCode.join(""));
              // Auto focus next input
              if (e.target.nextSibling) e.target.nextSibling.focus();
            }}
          />
        ))}
      </div>
      <button
        onClick={handleConfirmCode}
        className="w-full py-2 font-semibold text-white bg-green-600 rounded hover:bg-green-700"
      >
        Verify & Continue
      </button>
    </div>
  </div>
)}

    </div>
  );
}
