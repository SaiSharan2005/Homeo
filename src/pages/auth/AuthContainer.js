import React from "react";
import LoginForm from "./LoginForm";
// Import or define additional form components as needed

import loginBg from "../../images/login-bg.jpg";
import SignUpForm from "./SignupForm";
import PatientDetails from "../patient/Details";
import DoctorDetails from "../doctor/Details";

function AuthContainer({ activeForm }) {
  let RenderedComponent;

  // Decide which component to render based on 'activeForm'
  if (activeForm === "login") {
    RenderedComponent = <LoginForm />;
  } else if (activeForm === "patient-signup") {
    RenderedComponent = <SignUpForm rolesFromParams={["PATIENT"]} />;
  } else if (activeForm === "doctor-signup") {
    RenderedComponent = <SignUpForm rolesFromParams={["DOCTOR"]} />;
  } else if (activeForm === "admin-signup") {
    RenderedComponent = <SignUpForm rolesFromParams={["ADMIN"]} />;
  } else if (activeForm === "patient-details") {
    RenderedComponent = <PatientDetails />;
  } else if (activeForm === "doctor-details") {
    RenderedComponent = <DoctorDetails />;
  } else {
    // Fallback if no form matches
    RenderedComponent = (
      <div className="text-center text-red-600">
        Unknown form type: {activeForm}
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-80"
        style={{
          backgroundImage: `url(${loginBg})`,
        }}
      />
      {/* Overlay to soften the image */}
      <div className="absolute inset-0 bg-white bg-opacity-20" />

      {/* Main container for alignment */}
      <div className="relative flex items-center min-h-screen px-4">
        {/*
          The form:
          - Full width on mobile (w-full)
          - 40% width on medium+ screens (md:w-2/5)
          - Pinned to the left with a left margin of 5% (md:ml-[5%])
        */}
        <div className="w-full md:w-2/5 md:ml-[5%] p-6 bg-white rounded-xl shadow-lg z-10">
          {RenderedComponent}
        </div>
      </div>
    </div>
  );
}

export default AuthContainer;
