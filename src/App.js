import "./index.css";
import './style.css'


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
import DoctorDetails from "./doctor/Details";

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
// import AppointmentBooking from "./staff/AppointmentBooking"
import PatientHistory from "./patient/History";

import StaffSignUp from "./staff/signup";
import DoctorSearch from "./patient/home/DoctorSearch";
import StaffDoctorSearch from "./staff/Search/Doctor-Search";
import GetAllAppointment from "./staff/GetAllAppointment";
import UpdateAppointment from "./staff/UpdateAppointment";
import PatientProfile from "./patient/home/PatientProfile";
import Schedules from "./doctor/home/Schedules";
import StaffHome from "./staff/Home/Home";
// import UploadForm from "./staff/Adv";
// import AdvManagement from "./staff/Home/AdvManage";
// import BannerTable from "./staff/Home/AdvManage";
// import AdvertisementForm from "./staff/Adv";
import AppointmentBooking from "./staff/AppointmentBooking";
import PatientDetails from "./patient/Details";
import CompleteSlot from "./doctor/CompleteSlot";
import PatientPage from "./patient/Adv";
import AdvertisementManager from "./staff/AdvertisementManager";
import CreateAdvertisement from "./staff/Advertisement/CreateAdvertisement";
import UpdateAdvertisement from "./staff/Advertisement/updateAdvertisement";
import ShowAdvertisements from "./staff/Advertisement/AllAdvertisement";
import StaffHomePage from "./staff/Home/Home";
import PatientSearch from "./staff/Search/Patient-Search";
import ActivitySearch from "./staff/activity/All-Activity";
import DoctorActivitySearch from "./staff/activity/Doctor-Activity";
import PatientActivitySearch from "./staff/activity/Patient-Activity";
import AppointmentActivitySearch from "./staff/activity/Appointment-Activity";
import AdvertisementActivitySearch from "./staff/activity/Advertisement-Activity";
import Home from "./base";
import Mainhome from "./crocs/views/home"

export default function App(){
  return (
    <Router>
      <div>
        <Routes>
          {/* Landing Page Screens and Components */}
          <Route exact path="/" element={<Mainhome />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/login" element={<Login />} />
          <Route path= "/doctor/details" element={<DoctorDetails/>}/>
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
          <Route path="/patient/details" element = {<PatientDetails/>}/>
          <Route path = "/patient/history" element = {<PatientHistory/>}/>
          <Route path = "/patient/adv" element = {<PatientPage/>}/>
          

          {/* Doctor Screens and Components */}
          <Route exact path="/doctor/signup" element={<DoctorSignUp />} />
          <Route exact path="/doctor/home" element={<DoctorHome />} />
          <Route path = "/BookAppoinment/:doctorId" element={<AppointmentBooking/>}/>
          <Route path = "/UpdateAppoinment/:AppointmentId" element={<UpdateAppointment/>}/>
          <Route path = "/doctor-token/:tokenId" element={<CompleteSlot/>}/>

          {/* Staff Screens and Components */}
          <Route exact path="/staff/signup" element={<StaffSignUp />} />
          <Route exact path="/staff/home" element={<StaffHomePage />} />
          {/* <Route path = "/adv" element={<UploadForm/>}/> */}
          <Route path = "/adv/management" element={<AdvertisementManager/>}/>
          <Route path = "/staff/create-adv" element={<CreateAdvertisement/>}/>
          <Route path = "/staff/update-adv/:id" element={<UpdateAdvertisement/>}/>
          <Route path = "/staff/all-adv" element={<ShowAdvertisements/>}/>
          <Route path = "/staff/doctor-search" element={<StaffDoctorSearch/>}/>
          <Route path = "/staff/patient-search" element={<PatientSearch/>}/>
          <Route path = "staff/GetAllAppointment" element={<GetAllAppointment/>}/>
          <Route path = "/staff/all-activity" element={<ActivitySearch/>}/>
          <Route path = "/staff/doctor-activity" element={<DoctorActivitySearch/>}/>
          <Route path = "/staff/patient-activity" element={<PatientActivitySearch/>}/>
          <Route path = "/staff/appointment-activity" element={<AppointmentActivitySearch/>}/>
          <Route path = "/staff/advertisement-activity" element={<AdvertisementActivitySearch/>}/>
          
          

        </Routes>
      </div>
    </Router>
  );
}