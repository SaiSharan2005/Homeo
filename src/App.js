// src/App.js

import "./index.css";
import "./style.css";
import "react-toastify/dist/ReactToastify.css";

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
import InventoryPage from "./pages/inventory/InventoryPage.jsx";
import InventoryItemList from "./pages/inventory/InventoryItemList";
import InventoryItemDetail from "./pages/inventory/InventoryItemDetail";
import InventoryItemForm from "./pages/inventory/InventoryItemForm";
import InventoryRecordList from "./pages/inventory/InventoryRecordList";
import InventoryRecordDetail from "./pages/inventory/InventoryRecordDetail";
import InventoryTransactionList from "./pages/inventory/InventoryTransactionList";
import CategoryManagement from "./pages/inventory/CategoryManagement";
import PurchaseOrderCreate from "./pages/inventory/productOrder/PurchaseOrderCreate";
import PurchaseOrderDetail from "./pages/inventory/productOrder/PurchaseOrderDetail";
import PurchaseOrderList from "./pages/inventory/productOrder/PurchaseOrderList";
import GoodsReceiptList from "./pages/inventory/receipt/GoodsReceiptList";
import GoodsReceiptDetail from "./pages/inventory/receipt/GoodsReceiptDetail";
import GoodsReceiptCreate from "./pages/inventory/receipt/GoodsReceiptCreate";
import CreatePrescriptionPage from "./pages/prescription/CreatePrescriptionPage";
import PrescriptionList from "./pages/prescription/PrescriptionList";

// Billing & Payments
import PaymentList from "./pages/billing/PaymentList";
import PaymentDetails from "./pages/prescription/PaymentDetails";
import InvoiceList from "./pages/billing/InvoiceList";

// Batch Management
import BatchList from "./pages/inventory/BatchList";

// Supplier & Warehouse
import SupplierList from "./pages/inventory/SupplierList";
import SupplierForm from "./pages/inventory/SupplierForm";
import SupplierDetail from "./pages/inventory/SupplierDetail";
import AllWarehouse from "./components/inventory/warehouse/AllWarehouse";
import WarehouseDetail from "./pages/inventory/WarehouseDetail";
import AllSupplier from "./components/inventory/supplier/AllSupplier";

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

// Questionnaire
import QuestionSetList from "./pages/questionnaire/QuestionSetList";
import CreateQuestionSet from "./pages/questionnaire/CreateQuestionSet";
import QuestionnairePage from "./pages/questionnaire/QuestionnairePage";
import SubmissionList from "./pages/questionnaire/SubmissionList";
import SubmissionDetail from "./pages/questionnaire/SubmissionDetail";

// Misc
import ProvoHealDashboard from "./utils/Test";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Landing & Login */}
        <Route path="/" element={<Mainhome />} />
        <Route path="/login" element={<AuthContainer activeForm="login" />} />

        {/* Auth Routes */}
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
        <Route
          path="/admin/signup"
          element={<AuthContainer activeForm="admin-signup" />}
        />

        {/* Doctor Routes */}
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

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="home" element={<AdminHomePage />} />
          
          {/* Appointment Management */}
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

          {/* User Management */}
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

          {/* Advertisement Management */}
          <Route path="advertisement" element={<ShowAdvertisements />} />
          <Route
            path="advertisement/create"
            element={<CreateAdvertisement />}
          />
          <Route
            path="advertisement/update/:id"
            element={<UpdateAdvertisement />}
          />

          {/* Inventory Management */}
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="inventory/create" element={<InventoryItemForm />} />
          <Route path="inventory/items" element={<InventoryItemList />} />
          <Route path="inventory/items/:id" element={<InventoryItemDetail />} />
          <Route path="inventory/items/:id/edit" element={<InventoryItemForm />} />
          <Route path="inventory/records" element={<InventoryRecordList />} />
          <Route path="inventory/records/:id" element={<InventoryRecordDetail />} />
          <Route path="inventory/transactions" element={<InventoryTransactionList />} />
          <Route path="inventory/categories" element={<CategoryManagement />} />
          <Route path="inventory/batches" element={<BatchList />} />
          <Route path="inventory/suppliers" element={<SupplierList />} />
          <Route path="inventory/suppliers/create" element={<SupplierForm />} />
          <Route path="inventory/suppliers/:id" element={<SupplierDetail />} />
          <Route path="inventory/suppliers/:id/edit" element={<SupplierForm />} />
          <Route path="inventory/warehouses" element={<AllWarehouse />} />
          <Route path="inventory/warehouses/:id" element={<WarehouseDetail />} />

          {/* Goods Receipts */}
          <Route path="inventory/receipt" element={<GoodsReceiptList />} />
          <Route path="inventory/receipt/create" element={<GoodsReceiptCreate />} />
          <Route path="inventory/receipt/:id" element={<GoodsReceiptDetail />} />

          {/* Purchase Orders */}
          <Route path="purchase-orders" element={<PurchaseOrderList />} />
          <Route path="purchase-orders/create" element={<PurchaseOrderCreate />} />
          <Route path="purchase-orders/:id" element={<PurchaseOrderDetail />} />

          {/* Prescription Management */}
          <Route path="prescriptions" element={<PrescriptionList />} />
          <Route path="prescriptions/create" element={<CreatePrescriptionPage />} />

          {/* Billing & Payments */}
          <Route path="billing/payments" element={<PaymentList />} />
          <Route path="billing/payments/:id" element={<PaymentDetails />} />
          <Route path="billing/invoices" element={<InvoiceList />} />

          {/* Activity Management */}
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

          {/* Questionnaire Management */}
          <Route path="questionnaire" element={<QuestionSetList />} />
          <Route path="questionnaire/create" element={<CreateQuestionSet />} />
          <Route path="questionnaire/:id" element={<QuestionnairePage />} />
          <Route path="submissions" element={<SubmissionList />} />
          <Route path="submissions/:id" element={<SubmissionDetail />} />

          {/* Legacy Routes */}
          <Route path="payment" element={<PaymentList />} />
          <Route path="payment/:id" element={<PaymentDetails />} />
          <Route path="warehouse" element={<AllWarehouse />} />
          <Route path="supplier" element={<AllSupplier />} />
        </Route>

        {/* Staff Routes */}
        <Route path="/staff" element={<StaffLayout />}>
          <Route path="home" element={<AdminHomePage />} />
          
          {/* Appointment Management */}
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

          {/* User Management */}
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

          {/* Advertisement Management */}
          <Route path="advertisement" element={<ShowAdvertisements />} />
          <Route
            path="advertisement/create"
            element={<CreateAdvertisement />}
          />
          <Route
            path="advertisement/update/:id"
            element={<UpdateAdvertisement />}
          />

          {/* Inventory Management */}
          <Route path="inventory/create" element={<InventoryPage />} />
          <Route path="inventory" element={<InventoryItemList />} />
          <Route path="inventory/:id" element={<InventoryItemDetail />} />

          {/* Activity Management */}
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

          {/* Payments */}
          <Route path="payment" element={<PaymentList />} />
          <Route path="payment/:id" element={<PaymentDetails />} />
        </Route>

        {/* Patient Routes */}
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
            path="appointment/token/:tokenId"
            element={<AppointmentDetails />}
          />
          <Route path="payments" element={<PaymentList role="patient" />} />
          <Route path="payments/:id" element={<PaymentDetails />} />
        </Route>

        {/* Standalone Routes */}
        <Route path="/patient/adv" element={<PatientPage />} />
        <Route path="/doctorSearch" element={<DoctorSearch />} />
        <Route path="/adv/management" element={<AdvertisementManager />} />
        <Route path="/staff/create-adv" element={<CreateAdvertisement />} />
        <Route path="/staff/update-adv/:id" element={<UpdateAdvertisement />} />
        <Route path="/staff/all-adv" element={<ShowAdvertisements />} />
        
        {/* Legacy Inventory Routes */}
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
        
        {/* Legacy Questionnaire Routes */}
        <Route path="/test" element={<AllSupplier />} />
        <Route path="/questionnaires" element={<QuestionSetList />} />
        <Route path="/question-sets/create" element={<CreateQuestionSet />} />
        <Route path="/questionnaire/:id" element={<QuestionnairePage />} />
        <Route path="/submissions" element={<SubmissionList />} />
        <Route path="/submissions/:id" element={<SubmissionDetail />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Router>
  );
}
