// AppRoutes.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Import all page components
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import About from '../pages/About';
import Contact from '../pages/Contact';
import VerifyOtp from '../pages/VerifyOtp';
import Dashboard from '../components/Dashboard/Dashboard';
import Doctorboard from '../pages/Doctorboard';
import DoctorMedicalRecords from '../components/DoctorMedicalRecords/DoctorMedicalRecords';
import DoctorTestResults from '../components/DoctorTestResults/DoctorTestResults';
import DoctorHome from '../pages/DoctorsHome';

// Import Admin Components
import AdminDashboard from '../pages/AdminDashboard';
import DoctorsManager from '../components/admin/DoctorsManager/DoctorsManager';
import PatientsManager from '../components/admin/PatientsManager/PatientsManager';
import AppointmentsManager from '../components/admin/AppointmentsManager/AppointmentsManager';
import ResultsManager from '../components/admin/ResultsManager/ResultsManager';
import PatientRecords from '../components/admin/PatientsManager/PatientRecords';

// Import NotFound Component
const NotFound = () => (
  <div className="container mt-5 text-center">
    <h1>404 - Page Not Found</h1>
    <p>The page you are looking for does not exist.</p>
    <a href="/" className="btn btn-primary">Return to Home</a>
  </div>
);

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const hasRequiredRole = allowedRoles.includes(user?.role);

  if (allowedRoles.length > 0 && !hasRequiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

// Unauthorized Component
const Unauthorized = () => (
  <div className="container mt-5 text-center">
    <h1>Unauthorized Access</h1>
    <p>You don't have permission to access this page.</p>
    <a href="/" className="btn btn-primary">Return to Home</a>
  </div>
);

import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/doctor" element={<DoctorHome />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:encodedEmail" element={<ResetPassword />} />

      {/* Doctor Routes */}
      <Route 
        path="/doctor/dashboard" 
        element={
          <ProtectedRoute allowedRoles={['DOCTOR']}>
            <Doctorboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/doctor/medical-records" 
        element={
          <ProtectedRoute allowedRoles={['DOCTOR']}>
            <DoctorMedicalRecords />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/doctor/test-results" 
        element={
          <ProtectedRoute allowedRoles={['DOCTOR']}>
            <DoctorTestResults />
          </ProtectedRoute>
        } 
      />

      {/* Patient Routes */}
      <Route 
        path="/patient/dashboard" 
        element={
          <ProtectedRoute allowedRoles={['PATIENT']}>
            <Dashboard />
          </ProtectedRoute>
        } 
      />

      {/* Admin Routes */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/doctors" 
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <DoctorsManager />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/patients" 
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <PatientsManager />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/appointments" 
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AppointmentsManager />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/results" 
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <ResultsManager />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/patients/:patientId/records" 
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <PatientRecords />
          </ProtectedRoute>
        } 
      />

      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;