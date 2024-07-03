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
import DoctorScheduleCreation from "./doctor/DoctorScheduleCreation";
import DoctorProfile from "./doctor/home/DoctorProfile";
import DoctorHistory from "./doctor/History"
// Patient imports
import PatientSignUp from "./patient/signup";
import PatientHome from "./patient/home/PatientHome";
import AppointmentDetails from "./patient/AppointmentDetails";
import AppointmentBooking from "./staff/AppointmentBooking"
import PatientHistory from "./patient/History";

import StaffSignUp from "./staff/signup";
import DoctorSearch from "./patient/home/DoctorSearch";
import GetAllAppointment from "./staff/GetAllAppointment";
import UpdateAppointment from "./staff/UpdateAppointment";
import PatientProfile from "./patient/home/PatientProfile";
import Schedules from "./doctor/home/Schedules";

export default function App(){
  return (
    <Router>
      <div>
        <Routes>
          {/* Landing Page Screens and Components */}
          <Route exact path="/" element={<Base />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/login" element={<Login />} />
          <Route path= "/doctor/details" element={<Details/>}/>
          <Route path="/AllAppointment" element={<GetAllAppointment/>}/>
          <Route path = "/doctorSchedule/Create" element= {<DoctorScheduleCreation/>} />
          <Route path = "/doctor/profile" element= {<DoctorProfile/>} />
          <Route path = "/doctor/schedule" element={<Schedules/>}/>
          <Route path = "/doctor/history" element={<DoctorHistory/>}/>

          {/* Patient Screens and Components */}
          <Route exact path="/patient/signup" element={<PatientSignUp />} />
          <Route exact path="/patient/home" element={<PatientHome />} />
          <Route path="/doctorSearch" element={<DoctorSearch/>}/>
          <Route path = "/token/:tokenId/" element= {<AppointmentDetails/>}/>
          <Route path="/patient/details" element = {<PatientProfile/>}/>
          <Route path = "/patient/history" element = {<PatientHistory/>}/>

          {/* Doctor Screens and Components */}
          <Route exact path="/doctor/signup" element={<DoctorSignUp />} />
          <Route exact path="/doctor/home" element={<DoctorHome />} />
          <Route path = "/BookAppoinment/:doctorId" element={<AppointmentBooking/>}/>
          <Route path = "/UpdateAppoinment/:AppointmentId" element={<UpdateAppointment/>}/>

          {/* Staff Screens and Components */}
          <Route exact path="/staff/signup" element={<StaffSignUp />} />
          <Route path = "/GetAllAppointment" element={<GetAllAppointment/>}/>

        </Routes>
      </div>
    </Router>
  );
}