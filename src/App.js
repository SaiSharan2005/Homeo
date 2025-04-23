// import "./index.css";
// import "./style.css";

// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// // Landing Page imports
// import Mainhome from "./crocs/views/home";
// import Register from "./register";
// import Login from "./login";

// // Doctor imports
// import DoctorSignUp from "./pages/doctor/signup";
// import DoctorDetails from "./pages/doctor/Details";
// import DoctorHome from "./pages/doctor/home/DoctorHome";
// import DoctorScheduleCreation from "./pages/doctor/DoctorScheduleCreation";
// import DoctorProfile from "./pages/doctor/home/DoctorProfile";
// import DoctorHistory from "./pages/doctor/History";

// // Patient imports
// import PatientSignUp from "./pages/auth/SignupForm";
// import PatientHome from "./pages/patient/home/PatientHome";
// import PatientProfile from "./pages/patient/home/PatientProfile";
// import AppointmentDetails from "./components/appointment/AppointmentDetails";
// import PatientDetails from "./pages/patient/Details";
// import PatientHistory from "./pages/patient/History";
// import PatientPage from "./pages/patient/Adv";
// import DoctorSearch from "./pages/patient/home/DoctorSearch";

// // Staff imports
// import StaffSignUp from "./pages/staff/signup";
// import AdminHomePage from "./pages/staff/Home/Home";
// import AppointmentBooking from "./pages/staff/AppointmentBooking";
// import BookSlot from "./pages/staff/AppointmentBookingByAdmin";
// import StaffDoctorSearch from "./pages/staff/Search/Doctor-Search";
// import PatientSearch from "./pages/staff/Search/Patient-Search";
// import GetAllAppointment from "./pages/staff/GetAllAppointment";
// import UpdateAppointment from "./pages/staff/UpdateAppointment";
// import AdvertisementManager from "./pages/staff/AdvertisementManager";
// import CreateAdvertisement from "./pages/staff/Advertisement/CreateAdvertisement";
// import UpdateAdvertisement from "./pages/staff/Advertisement/updateAdvertisement";
// import ShowAdvertisements from "./pages/staff/Advertisement/AllAdvertisement";
// import ActivitySearch from "./pages/staff/activity/All-Activity";
// import DoctorActivitySearch from "./pages/staff/activity/Doctor-Activity";
// import PatientActivitySearch from "./pages/staff/activity/Patient-Activity";
// import AppointmentActivitySearch from "./pages/staff/activity/Appointment-Activity";
// import AdvertisementActivitySearch from "./pages/staff/activity/Advertisement-Activity";

// // Inventory & Prescription imports
// import InventoryPage from "./pages/inventory/InventoryPage";
// import InventoryItemList from "./pages/inventory/InventoryItemList";
// import InventoryItemDetail from "./pages/inventory/InventoryItemDetail";
// import PurchaseOrderCreate from "./pages/inventory/productOrder/PurchaseOrderCreate";
// import PurchaseOrderList from "./pages/inventory/productOrder/PurchaseOrderList";
// import CreatePrescriptionPage from "./pages/prescription/CreatePrescriptionPage";

// // Auth Container
// import AuthContainer from "./pages/auth/AuthContainer";
// import ProvoHealDashboard from "./utils/Test";
// import DoctorLayout from "./components/Layouts/DoctorLayout";
// import AdminLayout from "./components/Layouts/AdminLayout";
// import StaffLayout from "./components/Layouts/StaffLayout";
// import DoctorDashboard from "./pages/doctor/home/DoctorOverview";
// import { ToastContainer } from "react-toastify";
// import DoctorAppointmentsPage from "./components/appointment/Appointments";
// import SchedulePage from "./pages/doctor/Schedule";
// import PaymentList from "./pages/prescription/PaymentList";
// import PaymentDetails from "./pages/prescription/PaymentDetails";
// import PatientLayout from "./components/Layouts/PatientLayout";
// import CompleteSlot from "./components/appointment/AppointmentDetails";

// export default function App() {
//   return (
//     <Router>
//       <Routes>
//         {/* Landing Page */}
//         <Route exact path="/" element={<Mainhome />} />
//         <Route
//           exact
//           path="/login"
//           element={<AuthContainer activeForm={"login"} />}
//         />

//         {/* Doctor Routes */}
//         <Route
//           path="/doctor/signup"
//           element={<AuthContainer activeForm={"doctor-signup"} />}
//         />
//         <Route
//           path="/doctor/details"
//           element={<AuthContainer activeForm={"doctor-details"} />}
//         />
//         {/* <Route path="/doctor/home" element={<DoctorHome />} />
//         <Route path="/doctorSchedule/Create" element={<DoctorScheduleCreation />} />
//         <Route path="/doctor/profile" element={<DoctorProfile />} />
//         <Route path="/doctor/schedule" element={<DoctorDetails />} />
//         <Route path="/doctor/history" element={<DoctorHistory />} />
//         <Route path="/doctor-token/:tokenId" element={<CompleteSlot />} /> */}
//         {/* Doctor Routes with shared layout */}
//         <Route path="/doctor" element={<DoctorLayout />}>
//           <Route path="home" element={<DoctorDashboard />} />
//           <Route path="profile" element={<DoctorProfile />} />
//           <Route path="details" element={<DoctorDetails />} />
//           <Route path="create-schedule" element={<DoctorScheduleCreation />} />
//           <Route path="appointment" element={<DoctorAppointmentsPage />} />
//           <Route path="token/:tokenId" element={<CompleteSlot />} />
//           <Route path="schedule" element={<SchedulePage />} />
//         </Route>

//         <Route path="/admin" element={<AdminLayout />}>
//           <Route path="home" element={<AdminHomePage />} />
//           <Route path="appointment" element={<GetAllAppointment />} />
//           <Route path="doctor-search" element={<StaffDoctorSearch />} />
//           <Route path="patient-search" element={<PatientSearch />} />
//           <Route path="advertisement" element={<ShowAdvertisements />} />
//           <Route path="inventory/create" element={<InventoryPage />} />
//           <Route path="inventory" element={<InventoryItemList />} />
//         </Route>
//         <Route path="/staff" element={<StaffLayout />}>
//           <Route path="payments" element={<PaymentList />} />
//           <Route path="payment/:id" element={<PaymentDetails />} />
//         </Route>

//         {/* Other routes */}
//         {/* </Routes> */}
//         {/* Patient Routes */}
//         <Route
//           path="/patient/signup"
//           element={<AuthContainer activeForm={"patient-signup"} />}
//         />
//         <Route
//           path="/patient/details"
//           element={<AuthContainer activeForm={"patient-details"} />}
//         />
//         <Route path="/patient" element={<PatientLayout />}>
//           <Route path="profile" element={<PatientProfile />} />
//           <Route path="home" element={<PatientHome />} />
//           <Route path="history" element={<PatientHistory />} />
//           <Route path="adv" element={<PatientPage />} />
//           <Route path="doctorSearch" element={<DoctorSearch />} />
//           <Route
//           path="BookAppoinment/:doctorId"
//           element={<AppointmentBooking />}
//         />
//                 <Route path="token/:tokenId/" element={<AppointmentDetails />} />

//         </Route>
//         <Route path="/patient/adv" element={<PatientPage />} />
//         <Route path="/doctorSearch" element={<DoctorSearch />} />

//         {/* Staff Routes */}

//         <Route
//           path="/staff/signup"
//           element={<AuthContainer activeForm={"admin-signup"} />}
//         />
//         {/* <Route path="home" element={<StaffHomePage />} /> */}
//         <Route path="/adv/management" element={<AdvertisementManager />} />
//         <Route path="/staff/create-adv" element={<CreateAdvertisement />} />
//         <Route path="/staff/update-adv/:id" element={<UpdateAdvertisement />} />
//         <Route path="/staff/all-adv" element={<ShowAdvertisements />} />
//         {/* <Route path="/staff/doctor-search" element={<StaffDoctorSearch />} />
//         <Route path="/staff/patient-search" element={<PatientSearch />} /> */}
//         {/* <Route path="staff/GetAllAppointment" element={<GetAllAppointment />} /> */}
//         <Route path="/staff/all-activity" element={<ActivitySearch />} />
//         <Route
//           path="/staff/doctor-activity"
//           element={<DoctorActivitySearch />}
//         />
//         <Route
//           path="/staff/patient-activity"
//           element={<PatientActivitySearch />}
//         />
//         <Route
//           path="/staff/appointment-activity"
//           element={<AppointmentActivitySearch />}
//         />
//         <Route
//           path="/staff/advertisement-activity"
//           element={<AdvertisementActivitySearch />}
//         />
//         <Route path="/BookSlot" element={<BookSlot />} />
//         <Route
//           path="/staff/appointment-booking"
//           element={<AppointmentBooking />}
//         />

//         {/* Inventory & Prescription Routes */}
//         <Route path="/inventory-items/create" element={<InventoryPage />} />
//         <Route path="/inventory-items" element={<InventoryItemList />} />
//         <Route path="/inventory-items/:id" element={<InventoryItemDetail />} />
//         <Route path="/purchase-orders" element={<PurchaseOrderList />} />
//         <Route
//           path="/purchase-orders/create"
//           element={<PurchaseOrderCreate />}
//         />
//         <Route
//           path="/prescription/create"
//           element={<CreatePrescriptionPage />}
//         />

//         <Route path="/test" element={<ProvoHealDashboard />} />
//       </Routes>
//       <ToastContainer
//         position="top-right"
//         autoClose={3000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//       />
//     </Router>
//   );
// }
// src/App.js

import "./index.css";
import "./style.css";

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

// Landing & Auth
import Mainhome from "./crocs/views/home";
import AuthContainer from "./pages/auth/AuthContainer";

// Doctor pages & layouts
import DoctorLayout from "./components/Layouts/DoctorLayout";
import DoctorSignUp from "./pages/doctor/signup";
import DoctorDetails from "./pages/doctor/Details";
import DoctorDashboard from "./pages/doctor/home/DoctorOverview";
import DoctorProfile from "./pages/doctor/home/DoctorProfile";
import DoctorScheduleCreation from "./pages/doctor/DoctorScheduleCreation";
import SchedulePage from "./pages/doctor/Schedule";

// Patient pages & layouts
import PatientLayout from "./components/Layouts/PatientLayout";
import PatientSignUp from "./pages/auth/SignupForm";
import PatientDetails from "./pages/patient/Details";
import PatientProfile from "./pages/patient/home/PatientProfile";
import PatientHome from "./pages/patient/home/PatientHome";
import PatientHistory from "./pages/patient/History";
import PatientPage from "./pages/patient/Adv";
import DoctorSearch from "./pages/patient/home/DoctorSearch";

// Staff/Admin pages & layouts
import AdminLayout from "./components/Layouts/AdminLayout";
import StaffLayout from "./components/Layouts/StaffLayout";
import AdminHomePage from "./pages/staff/Home/Home";
import StaffSignUp from "./pages/staff/signup";
import StaffDoctorSearch from "./pages/staff/Search/Doctor-Search";
import PatientSearch from "./pages/staff/Search/Patient-Search";
import StaffRoleManagement from "./pages/staff/Search/Staff-Search";
import AdminAddUser from "./pages/staff/Search/addUser";

// Appointment components
import AppointmentsPage from "./components/appointment/Appointments";
import AppointmentDetails from "./components/appointment/AppointmentDetails";
import AppointmentBooking from "./pages/staff/AppointmentBooking";
import CompleteSlot from "./components/appointment/AppointmentDetails";
import BookSlot from "./pages/staff/AppointmentBookingByAdmin";
import UpdateAppointment from "./pages/staff/UpdateAppointment";

// Inventory & Prescription
import InventoryPage from "./pages/inventory/InventoryPage";
import InventoryItemList from "./pages/inventory/InventoryItemList";
import InventoryItemDetail from "./pages/inventory/InventoryItemDetail";
import PurchaseOrderCreate from "./pages/inventory/productOrder/PurchaseOrderCreate";
import PurchaseOrderList from "./pages/inventory/productOrder/PurchaseOrderList";
import CreatePrescriptionPage from "./pages/prescription/CreatePrescriptionPage";

// Advertisements & Activity
import AdvertisementManager from "./pages/staff/AdvertisementManager";
import CreateAdvertisement from "./pages/staff/Advertisement/CreateAdvertisement";
import UpdateAdvertisement from "./pages/staff/Advertisement/updateAdvertisement";
import ShowAdvertisements from "./pages/staff/Advertisement/AllAdvertisement";
import ActivitySearch from "./pages/staff/activity/All-Activity";
import DoctorActivitySearch from "./pages/staff/activity/Doctor-Activity";
import PatientActivitySearch from "./pages/staff/activity/Patient-Activity";
import AppointmentActivitySearch from "./pages/staff/activity/Appointment-Activity";
import AdvertisementActivitySearch from "./pages/staff/activity/Advertisement-Activity";

// Payments
import PaymentList from "./pages/prescription/PaymentList";
import PaymentDetails from "./pages/prescription/PaymentDetails";

// Misc
import ProvoHealDashboard from "./utils/Test";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Landing & Login */}
        <Route path="/" element={<Mainhome />} />
        <Route path="/login" element={<AuthContainer activeForm="login" />} />

        {/* Doctor Signup & Details (no layout) */}
        <Route
          path="/doctor/signup"
          element={<AuthContainer activeForm="doctor-signup" />}
        />
        <Route
          path="/doctor/details"
          element={<AuthContainer activeForm="doctor-details" />}
        />
        <Route
          path="/patient/signup"
          element={<AuthContainer activeForm={"patient-signup"} />}
        />

        <Route
          path="/patient/details"
          element={<AuthContainer activeForm="patient-details" />}
        />
        {/* Doctor routes (with DoctorLayout) */}
        <Route path="/doctor" element={<DoctorLayout />}>
          <Route path="home" element={<DoctorDashboard />} />
          <Route path="profile" element={<DoctorProfile />} />
          <Route path="details" element={<DoctorDetails />} />
          <Route path="create-schedule" element={<DoctorScheduleCreation />} />
          <Route
            path="patient/profile/:patientId"
            element={<PatientProfile />}
          />
          <Route path="doctor/profile/:patientId" element={<DoctorProfile />} />
          <Route path="medicians" element={<InventoryItemList />} />
          <Route path="medicians/:id" element={<InventoryItemDetail />} />
          <Route path="payments" element={<PaymentList role="doctor" />} />
          <Route
            path="appointment"
            element={<AppointmentsPage role="doctor" />}
          />
          <Route path="appointment/token/:tokenId" element={<CompleteSlot />} />
          <Route path="schedule" element={<SchedulePage />} />
        </Route>

        {/* Admin routes (with AdminLayout) */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="home" element={<AdminHomePage />} />
          <Route
            path="appointment"
            element={<AppointmentsPage role="admin" />}
          />
          <Route
            path="appointment/token/update/:AppointmentId"
            element={<UpdateAppointment />}
          />
          <Route
            path="appointment/token/:tokenId"
            element={<AppointmentDetails />}
          />
          <Route path="appointment/create" element={<BookSlot />} />

          <Route path="doctor-search" element={<StaffDoctorSearch />} />
          <Route
            path="doctor-search/profile/:doctorId"
            element={<DoctorProfile />}
          />
          <Route
            path="doctor-search/addDoctor/"
            element={<AdminAddUser initialRole="DOCTOR" />}
          />

          <Route path="patient-search" element={<PatientSearch />} />
          <Route
            path="patient-search/profile/:patientId"
            element={<PatientProfile />}
          />
          <Route
            path="patient-search/addPatient/"
            element={<AdminAddUser initialRole="PATIENT" />}
          />

          <Route path="staff-search" element={<StaffRoleManagement />} />
          <Route
            path="staff-search/addStaff/"
            element={<AdminAddUser initialRole="STAFF" />}
          />

          <Route path="advertisement" element={<ShowAdvertisements />} />
          <Route
            path="advertisement/create"
            element={<CreateAdvertisement />}
          />
          <Route
            path="advertisement/update/:id"
            element={<UpdateAdvertisement />}
          />

          <Route path="inventory/create" element={<InventoryPage />} />
          <Route path="inventory" element={<InventoryItemList />} />
          <Route path="inventory/:id" element={<InventoryItemDetail />} />

          <Route path="all-activity" element={<ActivitySearch />} />
          <Route path="doctor-activity" element={<DoctorActivitySearch />} />
          <Route path="patient-activity" element={<PatientActivitySearch />} />
          <Route
            path="appointment-activity"
            element={<AppointmentActivitySearch />}
          />
          <Route
            path="advertisment-activity"
            element={<AdvertisementActivitySearch />}
          />

          <Route path="payment" element={<PaymentList />} />
          <Route path="payment/:id" element={<PaymentDetails />} />
        </Route>

        {/* Staff routes (with StaffLayout) */}
        <Route path="/staff" element={<StaffLayout />}>
          <Route path="home" element={<AdminHomePage />} />
          <Route
            path="appointment"
            element={<AppointmentsPage role="admin" />}
          />
          <Route
            path="appointment/token/update/:AppointmentId"
            element={<UpdateAppointment />}
          />
          <Route
            path="appointment/token/:tokenId"
            element={<AppointmentDetails />}
          />
          <Route path="BookSlot" element={<BookSlot />} />

          <Route path="doctor-search" element={<StaffDoctorSearch />} />
          <Route
            path="doctor-search/profile/:doctorId"
            element={<DoctorProfile />}
          />
          <Route
            path="doctor-search/addDoctor/"
            element={<AdminAddUser initialRole="DOCTOR" />}
          />

          <Route path="patient-search" element={<PatientSearch />} />
          <Route
            path="patient-search/profile/:patientId"
            element={<PatientProfile />}
          />
          <Route
            path="patient-search/addPatient/"
            element={<AdminAddUser initialRole="PATIENT" />}
          />

          <Route path="staff-search" element={<StaffRoleManagement />} />
          <Route
            path="staff-search/addStaff/"
            element={<AdminAddUser initialRole="STAFF" />}
          />

          <Route path="advertisement" element={<ShowAdvertisements />} />
          <Route
            path="advertisement/create"
            element={<CreateAdvertisement />}
          />
          <Route
            path="advertisement/update/:id"
            element={<UpdateAdvertisement />}
          />

          <Route path="inventory/create" element={<InventoryPage />} />
          <Route path="inventory" element={<InventoryItemList />} />
          <Route path="inventory/:id" element={<InventoryItemDetail />} />

          <Route path="all-activity" element={<ActivitySearch />} />
          <Route path="doctor-activity" element={<DoctorActivitySearch />} />
          <Route path="patient-activity" element={<PatientActivitySearch />} />
          <Route
            path="appointment-activity"
            element={<AppointmentActivitySearch />}
          />
          <Route
            path="advertisment-activity"
            element={<AdvertisementActivitySearch />}
          />

          <Route path="payment" element={<PaymentList />} />
          <Route path="payment/:id" element={<PaymentDetails />} />
        </Route>

        {/* Patient routes (with PatientLayout) */}
        <Route path="/patient" element={<PatientLayout />}>
          <Route path="profile" element={<PatientProfile />} />
          <Route path="profile/:patientId" element={<PatientProfile />} />
          <Route path="doctor/profile/:patientId" element={<DoctorProfile />} />
          <Route path="home" element={<PatientHome />} />
          <Route
            path="appointment"
            element={<AppointmentsPage role="patient" />}
          />
          <Route path="adv" element={<PatientPage />} />
          <Route path="doctorSearch" element={<DoctorSearch />} />
          <Route
            path="BookAppoinment/:doctorId"
            element={<AppointmentBooking />}
          />
          <Route
            path="appointment"
            element={<AppointmentsPage role="patient" />}
          />
          <Route
            path="appointment/token/:tokenId"
            element={<AppointmentDetails />}
          />
          <Route path="payments" element={<PaymentList role="patient" />} />
          <Route path="payments/:id" element={<PaymentDetails />} />
        </Route>

        {/* Misc standalone routes */}
        <Route path="/patient/adv" element={<PatientPage />} />
        <Route path="/doctorSearch" element={<DoctorSearch />} />
        <Route
          path="/admin/signup"
          element={<AuthContainer activeForm="admin-signup" />}
        />
        <Route path="/adv/management" element={<AdvertisementManager />} />
        <Route path="/staff/create-adv" element={<CreateAdvertisement />} />
        <Route path="/staff/update-adv/:id" element={<UpdateAdvertisement />} />
        <Route path="/staff/all-adv" element={<ShowAdvertisements />} />
        <Route path="/inventory-items/create" element={<InventoryPage />} />
        <Route path="/inventory-items" element={<InventoryItemList />} />
        <Route path="/inventory-items/:id" element={<InventoryItemDetail />} />
        <Route path="/purchase-orders" element={<PurchaseOrderList />} />
        <Route
          path="/purchase-orders/create"
          element={<PurchaseOrderCreate />}
        />
        <Route
          path="/prescription/create"
          element={<CreatePrescriptionPage />}
        />
        <Route path="/test" element={<ProvoHealDashboard />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Router>
  );
}
