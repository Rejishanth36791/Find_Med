import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/admin/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import ProtectedRoute from './components/ProtectedRoute';

// Landing Page 
import Home from './pages/Home';
import Login from './pages/Login';
import CivilianRegistration from './pages/civilian/CivilianRegistration';

// Admin Pages 
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminManagement from './pages/admin/AdminManagement';
import CivilianManagement from "./pages/admin/Civilian/CivilianManagement";
import CivilianDetails from "./pages/admin/Civilian/CivilianDetails";
import CivilianVivo from "./pages/admin/Civilian/CivilianVivo";
import CivilianReports from "./pages/admin/Civilian/CivilianReports";
import CivilianReportDetails from "./pages/admin/Civilian/CivilianReportDetails";
import AppealDetails from "./pages/admin/Appeal/AppealDetails";
import CivilianAppeals from "./pages/admin/Civilian/CivilianAppeals";
import AdminMedicineRegistry from './pages/admin/AdminMedicineRegistry';
import AdminAddMedicine from './pages/admin/AdminAddMedicine';
import AdminMedicineDetails from './pages/admin/AdminMedicineDetails';
import AdminNotificationCenter from './pages/admin/AdminNotificationCenter';
import AdminNotificationDetails from './pages/admin/AdminNotificationDetails';
import AdminProfilePage from './pages/admin/AdminProfilePage';
import SystemSettings from './pages/admin/SystemSettings';
import PharmacyManagementHome from './pages/admin/Pharmacy/PharmacyManagementHome';
import AdminPharmacyDetails from './pages/admin/Pharmacy/AdminPharmacyDetails';
import AdminPharmacyReview from './pages/admin/Pharmacy/AdminPharmacyReview';
import AdminPharmacyReports from './pages/admin/Pharmacy/AdminPharmacyReports';
import AdminReportDetails from './pages/admin/Pharmacy/AdminReportDetails';
import RejectedPharmacyTable from './pages/admin/Pharmacy/RejectedPharmacyTable';
import RejectedPharmacyDetails from './pages/admin/Pharmacy/RejectedPharmacyDetails';

// Pharmacy Pages 
import PharmacyDashboard from './pages/pharmacy/Dashboard';
import PharmacyLogin from './pages/pharmacy/PharmacyLogin';
import PharmacySignup from './pages/pharmacy/PharmacySignup';
import MedicineInventory from './pages/pharmacy/MedicineInventory';
import PharmacyMedicineDetails from './pages/pharmacy/MedicineDetails';
import PharmacyNotificationCenter from './pages/pharmacy/NotificationCenter';
import PharmacyNotificationDetails from './pages/pharmacy/NotificationDetails';
import AdminCenter from './pages/pharmacy/AdminCenter.jsx';
import PharmacySystemSettings from './pages/pharmacy/SystemSettings';
import PharmacyAddMedicine from './pages/pharmacy/AddMedicine';
import PharmacyCurrentReservations from './pages/pharmacy/CurrentReservations';
import PharmacyReservationHistory from './pages/pharmacy/ReservationHistory';
import PharmacyReportPage from './pages/pharmacy/PharmacyReportPage';
import PharmacyProfile from './pages/pharmacy/PharmacyProfile';

// Civilian Pages 
import CivilianLayout from './components/civilian/CivilianLayout';
import ActivityPage from './pages/civilian/ActivityPage';
import FindPharmacy from './pages/civilian/FindPharmacy';
import ReservationPage from './pages/civilian/ReservationPage';

import CivilianReservation from './pages/civilian/CivilianReservation';
import HomePage from './pages/civilian/HomePage';
import NotificationPage from './pages/civilian/NotificationPage';
import AppealsAndReports from './pages/civilian/AppealsAndReports';
import CivilianDrugDictionary from './pages/civilian/CivilianDrugDictionary';

import { NotificationProvider } from './context/NotificationContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import CivilianNotificationDetails from './pages/civilian/CivilianNotificationDetails';
import ReservationDetailsPage from './pages/civilian/ReservationDetailsPage';
function App() {
  useEffect(() => {
    const applyTheme = () => {
      const theme = localStorage.getItem('theme') || 'system';
      const root = window.document.documentElement;

      root.classList.remove('light', 'dark');

      if (theme === 'dark') {
        root.classList.add('dark');
      } else if (theme === 'light') {
        root.classList.add('light');
      }
    };

    applyTheme();
    window.addEventListener('storage', applyTheme);
    return () => window.removeEventListener('storage', applyTheme);
  }, []);

  return (
    <BrowserRouter>

      <ToastProvider>
        <AuthProvider>
          <Routes>
            {/* Landing page */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<CivilianRegistration />} />
            <Route path="/register" element={<CivilianRegistration />} />
            {/* <Route path="/pharmacy-login" element={<PharmacyLogin />} /> - Deprecated */}
            <Route path="/pharmacy-signup" element={<PharmacySignup />} />
            <Route path="/pharmacy-signup" element={<PharmacySignup />} />

            {/* Hidden Admin Login */}
            <Route path="/admin/u/login" element={<AdminLogin />} />

            {/*  Admin Routes - Protected */}
            <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']} />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route path="pharmacies/:pharmacyId" element={<AdminPharmacyDetails />} />
                {/* Pharmacy Reports & Inquiries Routes */}
                <Route path="reports" element={<AdminPharmacyReports />} />
                <Route path="reports/:reportId" element={<AdminReportDetails />} />
                <Route path="pharmacy/rejected" element={<RejectedPharmacyTable />} />
                <Route path="pharmacy/rejected/:id" element={<RejectedPharmacyDetails />} />
                <Route path="pharmacy-review/:pharmacyId" element={<AdminPharmacyReview />} />

                {/* When visiting /admin -> go to /admin/dashboard */}
                <Route index element={<Navigate to="dashboard" replace />} />

                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="administrators" element={<AdminManagement />} />
                <Route path="settings" element={<SystemSettings />} />

                {/* Medicines */}
                <Route path="medicines" element={<AdminMedicineRegistry />} />
                <Route path="medicines/add" element={<AdminAddMedicine />} />
                <Route path="medicines/:id" element={<AdminMedicineDetails />} />

                {/* Pharmacies placeholder */}
                <Route path="pharmacies" element={<PharmacyManagementHome />} />

                {/* Civilians */}
                <Route path="civilians" element={<CivilianManagement />} />
                <Route path="civilians/:id" element={<CivilianDetails />} />
                <Route path="civilians/:id/vivo" element={<CivilianVivo />} />
                <Route path="civilian-reports" element={<CivilianReports />} />
                <Route path="civilian-reports/:id" element={<CivilianReportDetails />} />
                <Route path="appeals" element={<AppealDetails />} />
                <Route path="appeals/:id" element={<AppealDetails />} />
                <Route path="civilian-appeals" element={<CivilianAppeals />} />

                {/* Notifications */}
                <Route path="notifications" element={<AdminNotificationCenter />} />
                <Route path="notifications/:id" element={<AdminNotificationDetails />} />

                {/* Profile */}
                <Route path="profile" element={<AdminProfilePage />} />
              </Route>
            </Route>



            {/* Pharmacy Routes */}
            <Route path="/pharmacy/*" element={
              <NotificationProvider>
                <Routes>
                  <Route index element={<PharmacyDashboard />} />
                  <Route path="inventory" element={<MedicineInventory />} />
                  <Route path="inventory/add" element={<PharmacyAddMedicine />} />
                  <Route path="medicines/:id" element={<PharmacyMedicineDetails />} />
                  <Route path="notifications" element={<PharmacyNotificationCenter />} />
                  <Route path="notifications/:id" element={<PharmacyNotificationDetails />} />
                  <Route path="admin-center" element={<AdminCenter />} />
                  <Route path="settings" element={<PharmacySystemSettings />} />
                  <Route path="current-reservations" element={<PharmacyCurrentReservations />} />
                  <Route path="reservation-history" element={<PharmacyReservationHistory />} />
                  <Route path="reports" element={<PharmacyReportPage />} />
                  <Route path="profile" element={<PharmacyProfile />} />
                </Routes>
              </NotificationProvider>
            } />

            {/* Civilian Routes */}
            <Route path="/civilian" element={<CivilianLayout />}>
              <Route index element={<Navigate to="home" replace />} />
              <Route path="home" element={<HomePage />} />
              <Route path="dashboard" element={<ActivityPage />} />
              <Route path="activity" element={<ActivityPage />} />
              <Route path="activity/reservation/:id" element={<ReservationDetailsPage />} />
              <Route path="find-pharmacy" element={<FindPharmacy />} />
              <Route path="reservation" element={<CivilianReservation />} />
              <Route path="notifications" element={<NotificationPage />} />
              <Route path="notifications/:id" element={<CivilianNotificationDetails />} />
              <Route path="appeals-reports" element={<AppealsAndReports />} />
              <Route path="drug-dictionary" element={<CivilianDrugDictionary />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes >
        </AuthProvider >
      </ToastProvider >
    </BrowserRouter >
  );
}

export default App;
