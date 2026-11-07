import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VerificationPage from './pages/VerificationPage';
import StudentDashboard from './pages/StudentDashboard';
import IDCardStudioPage from './pages/IDCardStudioPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/AdminDashboard';
import AdminCardsQueue from './pages/AdminCardsQueue';
import AdminStudentsDirectory from './pages/AdminStudentsDirectory';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <Routes>
      {/* 1. Public Marketing and Auth Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* 2. Public Edge Verification Route (Clean mobile viewport for camera scanners) */}
      <Route path="/verify/:verificationId" element={<VerificationPage />} />

      {/* 3. Student Authenticated Workspace */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <DashboardLayout userRole="student" />
          </ProtectedRoute>
        }
      >
        <Route index element={<StudentDashboard />} />
        <Route path="id-card" element={<IDCardStudioPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* 4. Administrator Command Center */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout userRole="admin" />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="cards" element={<AdminCardsQueue />} />
        <Route path="students" element={<AdminStudentsDirectory />} />
      </Route>
    </Routes>
  );
}

