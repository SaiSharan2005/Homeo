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
import CompleteSlot from "./pages/doctor/CompleteSlot";

// Patient imports
import PatientSignUp from "./pages/auth/SignupForm";
import PatientHome from "./pages/patient/home/PatientHome";
import PatientProfile from "./pages/patient/home/PatientProfile";
import AppointmentDetails from "./pages/patient/AppointmentDetails";
import PatientDetails from "./pages/patient/Details";
import PatientHistory from "./pages/patient/History";
import PatientPage from "./pages/patient/Adv";
import DoctorSearch from "./pages/patient/home/DoctorSearch";

// Staff imports
import StaffSignUp from "./pages/staff/signup";
import StaffHomePage from "./pages/staff/Home/Home";
import AppointmentBooking from "./pages/staff/AppointmentBooking";
import BookSlot from "./pages/staff/AppointmentBookingByAdmin";
import StaffDoctorSearch from "./pages/staff/Search/Doctor-Search";
import PatientSearch from "./pages/staff/Search/Patient-Search";
import GetAllAppointment from "./pages/staff/GetAllAppointment";
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

// Auth Container
import AuthContainer from "./pages/auth/AuthContainer";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Landing Page */}
        <Route exact path="/" element={<Mainhome />} />
        <Route exact path="/login" element={<AuthContainer activeForm={"login"} />} />

        {/* Doctor Routes */}
        <Route path="/doctor/signup" element={<AuthContainer activeForm={"doctor-signup"}  />} />
        <Route path="/doctor/details" element={<AuthContainer activeForm={"doctor-details"} />} />
        <Route path="/doctor/home" element={<DoctorHome />} />
        <Route path="/doctorSchedule/Create" element={<DoctorScheduleCreation />} />
        <Route path="/doctor/profile" element={<DoctorProfile />} />
        <Route path="/doctor/schedule" element={<DoctorDetails />} />
        <Route path="/doctor/history" element={<DoctorHistory />} />
        <Route path="/doctor-token/:tokenId" element={<CompleteSlot />} />

        {/* Patient Routes */}
        <Route path="/patient/signup" element={<AuthContainer activeForm={"patient-signup"}  />} />
        <Route path="/patient/details" element={<AuthContainer activeForm={"patient-details"} />} />
        <Route path="/patient/home" element={<PatientHome />} />
        <Route path="/patient/profile" element={<PatientProfile />} />
        <Route path="/patient/history" element={<PatientHistory />} />
        <Route path="/patient/adv" element={<PatientPage />} />
        <Route path="/doctorSearch" element={<DoctorSearch />} />
        <Route path="/token/:tokenId/" element={<AppointmentDetails />} />

        {/* Staff Routes */}
        <Route path="/staff/signup" element={<AuthContainer activeForm={"admin-signup"} />} />
        <Route path="/staff/home" element={<StaffHomePage />} />
        <Route path="/adv/management" element={<AdvertisementManager />} />
        <Route path="/staff/create-adv" element={<CreateAdvertisement />} />
        <Route path="/staff/update-adv/:id" element={<UpdateAdvertisement />} />
        <Route path="/staff/all-adv" element={<ShowAdvertisements />} />
        <Route path="/staff/doctor-search" element={<StaffDoctorSearch />} />
        <Route path="/staff/patient-search" element={<PatientSearch />} />
        <Route path="staff/GetAllAppointment" element={<GetAllAppointment />} />
        <Route path="/staff/all-activity" element={<ActivitySearch />} />
        <Route path="/staff/doctor-activity" element={<DoctorActivitySearch />} />
        <Route path="/staff/patient-activity" element={<PatientActivitySearch />} />
        <Route path="/staff/appointment-activity" element={<AppointmentActivitySearch />} />
        <Route path="/staff/advertisement-activity" element={<AdvertisementActivitySearch />} />
        <Route path="/BookSlot" element={<BookSlot />} />
        <Route path="/staff/appointment-booking" element={<AppointmentBooking />} />

        {/* Inventory & Prescription Routes */}
        <Route path="/inventory-items/create" element={<InventoryPage />} />
        <Route path="/inventory-items" element={<InventoryItemList />} />
        <Route path="/inventory-items/:id" element={<InventoryItemDetail />} />
        <Route path="/purchase-orders" element={<PurchaseOrderList />} />
        <Route path="/purchase-orders/create" element={<PurchaseOrderCreate />} />
        <Route path="/prescription/create" element={<CreatePrescriptionPage />} />
      </Routes>
    </Router>
  );
}
