import "./index.css";
// import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  // Link
} from "react-router-dom";

// Landing Page imports
import Base from './base';
import Register from './register';
import Login from './login';
import Details from "./doctor/Details";

// Doctor imports
import DoctorSignUp from "./doctor/signup";
import DoctorHome from "./doctor/home/DoctorHome";

// Patient imports
import PatientSignUp from "./patient/signup";
import PatientHome from "./patient/home/PatientHome";

// Staff imports
import StaffSignUp from "./staff/signup";
import DoctorSearch from "./patient/home/DoctorSearch";
import AppointmentBooking from "./patient/home/AppointmentBooking";

export default function App(){
  return (
    <Router>
      <div>
        <Routes>
          {/* Landing Page Screens and Components */}
          <Route exact path="/" element={<Base />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/login" element={<Login />} />
          <Route path= "/details/doctor" element={<Details/>}/>

          {/* Patient Screens and Components */}
          <Route exact path="/patient/signup" element={<PatientSignUp />} />
          <Route exact path="/patient/home" element={<PatientHome />} />
          <Route path="/doctorSearch" element={<DoctorSearch/>}/>

          {/* Doctor Screens and Components */}
          <Route exact path="/doctor/signup" element={<DoctorSignUp />} />
          <Route exact path="/doctor/home/DoctorHome" element={<DoctorHome />} />
          <Route path = "/BookAppoinment/:doctorId" element={<AppointmentBooking/>}/>

          {/* Staff Screens and Components */}
          <Route exact path="/staff/signup" element={<StaffSignUp />} />

        </Routes>
      </div>
    </Router>
  );
}