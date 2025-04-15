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
import "./index.css";
import "./style.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Landing Page imports
import Mainhome from "./crocs/views/home";
import Register from "./register";
import Login from "./login";

// Doctor imports
import DoctorSignUp from "./pages/doctor/signup";
import DoctorDetails from "./pages/doctor/Details";
import DoctorHome from "./pages/doctor/home/DoctorHome";
import DoctorScheduleCreation from "./pages/doctor/DoctorScheduleCreation";
import DoctorProfile from "./pages/doctor/home/DoctorProfile";
import DoctorHistory from "./pages/doctor/History";

// Patient imports
import PatientSignUp from "./pages/auth/SignupForm";
import PatientHome from "./pages/patient/home/PatientHome";
import PatientProfile from "./pages/patient/home/PatientProfile";
import AppointmentDetails from "./components/appointment/AppointmentDetails";
import PatientDetails from "./pages/patient/Details";
import PatientHistory from "./pages/patient/History";
import PatientPage from "./pages/patient/Adv";
import DoctorSearch from "./pages/patient/home/DoctorSearch";

// Staff imports
import StaffSignUp from "./pages/staff/signup";
import AdminHomePage from "./pages/staff/Home/Home";
import AppointmentBooking from "./pages/staff/AppointmentBooking";
import BookSlot from "./pages/staff/AppointmentBookingByAdmin";
import StaffDoctorSearch from "./pages/staff/Search/Doctor-Search";
import PatientSearch from "./pages/staff/Search/Patient-Search";
import UpdateAppointment from "./pages/staff/UpdateAppointment";
import AdvertisementManager from "./pages/staff/AdvertisementManager";
import CreateAdvertisement from "./pages/staff/Advertisement/CreateAdvertisement";
import UpdateAdvertisement from "./pages/staff/Advertisement/updateAdvertisement";
import ShowAdvertisements from "./pages/staff/Advertisement/AllAdvertisement";
import ActivitySearch from "./pages/staff/activity/All-Activity";
import DoctorActivitySearch from "./pages/staff/activity/Doctor-Activity";
import PatientActivitySearch from "./pages/staff/activity/Patient-Activity";
import AppointmentActivitySearch from "./pages/staff/activity/Appointment-Activity";
import AdvertisementActivitySearch from "./pages/staff/activity/Advertisement-Activity";

// Inventory & Prescription imports
import InventoryPage from "./pages/inventory/InventoryPage";
import InventoryItemList from "./pages/inventory/InventoryItemList";
import InventoryItemDetail from "./pages/inventory/InventoryItemDetail";
import PurchaseOrderCreate from "./pages/inventory/productOrder/PurchaseOrderCreate";
import PurchaseOrderList from "./pages/inventory/productOrder/PurchaseOrderList";
import CreatePrescriptionPage from "./pages/prescription/CreatePrescriptionPage";

// Auth Container and Dashboard imports
import AuthContainer from "./pages/auth/AuthContainer";
import ProvoHealDashboard from "./utils/Test";
import DoctorLayout from "./components/Layouts/DoctorLayout";
import AdminLayout from "./components/Layouts/AdminLayout";
import StaffLayout from "./components/Layouts/StaffLayout";
import PatientLayout from "./components/Layouts/PatientLayout";
import DoctorDashboard from "./pages/doctor/home/DoctorOverview";
import { ToastContainer } from "react-toastify";
import AppointmentsPage from "./components/appointment/Appointments"; // Generic appointments list component
import SchedulePage from "./pages/doctor/Schedule";
import PaymentList from "./pages/prescription/PaymentList";
import PaymentDetails from "./pages/prescription/PaymentDetails";
import CompleteSlot from "./components/appointment/AppointmentDetails";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<Mainhome />} />
        <Route path="/login" element={<AuthContainer activeForm="login" />} />

        {/* Doctor Routes */}
        <Route path="/doctor/signup" element={<AuthContainer activeForm="doctor-signup" />} />
        <Route path="/doctor/details" element={<AuthContainer activeForm="doctor-details" />} />
        <Route path="/doctor" element={<DoctorLayout />}>
          <Route path="home" element={<DoctorDashboard />} />
          <Route path="profile" element={<DoctorProfile />} />
          <Route path="details" element={<DoctorDetails />} />
          <Route path="create-schedule" element={<DoctorScheduleCreation />} />
          <Route path="patient/profile/:patientId" element={<PatientProfile />} />
          <Route path="doctor/profile/:patientId" element={<DoctorProfile />} />

          {/* Use the generic AppointmentsPage with role="doctor" */}
          <Route path="appointment" element={<AppointmentsPage role="doctor" />} />
          <Route path="token/:tokenId" element={<CompleteSlot />} />
          <Route path="schedule" element={<SchedulePage />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="home" element={<AdminHomePage />} />
          {/* Use the generic AppointmentsPage with role="admin" */}
          <Route path="appointment" element={<AppointmentsPage role="admin" />} />
          <Route path="doctor-search" element={<StaffDoctorSearch />} />
          <Route path="patient-search" element={<PatientSearch />} />
          <Route path="advertisement" element={<ShowAdvertisements />} />
          <Route path="inventory/create" element={<InventoryPage />} />
          <Route path="inventory" element={<InventoryItemList />} />
        </Route>

        {/* Staff Routes */}
        <Route path="/staff" element={<StaffLayout />}>
          <Route path="payments" element={<PaymentList />} />
          <Route path="payment/:id" element={<PaymentDetails />} />
          <Route path="all-activity" element={<ActivitySearch />} />
          <Route path="doctor-activity" element={<DoctorActivitySearch />} />
          <Route path="patient-activity" element={<PatientActivitySearch />} />
          <Route path="appointment-activity" element={<AppointmentActivitySearch />} />
          <Route path="advertisement-activity" element={<AdvertisementActivitySearch />} />
          <Route path="appointment-booking" element={<AppointmentBooking />} />
          <Route path="BookSlot" element={<BookSlot />} />
        </Route>

        {/* Patient Routes */}
        <Route path="/patient/signup" element={<AuthContainer activeForm="patient-signup" />} />
        <Route path="/patient/details" element={<AuthContainer activeForm="patient-details" />} />
        <Route path="/patient" element={<PatientLayout />}>
          <Route path="profile" element={<PatientProfile />} />
          <Route path="profile/:patientId" element={<PatientProfile />} />
          <Route path="doctor/profile/:patientId" element={<DoctorProfile />} />
          <Route path="home" element={<PatientHome />} />
          <Route path="history" element={<AppointmentsPage role="patient" />} />
          <Route path="adv" element={<PatientPage />} />
          <Route path="doctorSearch" element={<DoctorSearch />} />
          <Route path="BookAppoinment/:doctorId" element={<AppointmentBooking />} />

          {/* Use the generic AppointmentsPage with role="patient" */}
          
          <Route path="appointment" element={<AppointmentsPage role="patient" />} />
          <Route path="token/:tokenId" element={<AppointmentDetails />} />
        </Route>

        {/* Other Routes */}
        <Route path="/patient/adv" element={<PatientPage />} />
        <Route path="/doctorSearch" element={<DoctorSearch />} />
        <Route path="/staff/signup" element={<AuthContainer activeForm="admin-signup" />} />
        <Route path="/adv/management" element={<AdvertisementManager />} />
        <Route path="/staff/create-adv" element={<CreateAdvertisement />} />
        <Route path="/staff/update-adv/:id" element={<UpdateAdvertisement />} />
        <Route path="/staff/all-adv" element={<ShowAdvertisements />} />
        <Route path="/inventory-items/create" element={<InventoryPage />} />
        <Route path="/inventory-items" element={<InventoryItemList />} />
        <Route path="/inventory-items/:id" element={<InventoryItemDetail />} />
        <Route path="/purchase-orders" element={<PurchaseOrderList />} />
        <Route path="/purchase-orders/create" element={<PurchaseOrderCreate />} />
        <Route path="/prescription/create" element={<CreatePrescriptionPage />} />
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
