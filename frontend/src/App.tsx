import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { DashboardLayout } from './layouts/DashboardLayout';

// Public & Auth Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';

// Student Core Pages
import { StudentDashboard } from './pages/StudentDashboard';
import { StudentProfile } from './pages/StudentProfile';
import { CareerAssessment } from './pages/CareerAssessment';
import { CareerPrediction } from './pages/CareerPrediction';
import { SkillGapAnalysis } from './pages/SkillGapAnalysis';
import { CareerRoadmap } from './pages/CareerRoadmap';
import { ResumeAnalysis } from './pages/ResumeAnalysis';
import { AIChatAssistant } from './pages/AIChatAssistant';

// Admin Pages
import { AdminDashboard } from './pages/AdminDashboard';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Protected Application Routes in DashboardLayout */}
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            {/* Student Hub */}
            <Route path="/dashboard" element={<StudentDashboard />} />
            <Route path="/profile" element={<StudentProfile />} />
            <Route path="/assessment" element={<CareerAssessment />} />
            <Route path="/predictions" element={<CareerPrediction />} />
            <Route path="/skill-gap" element={<SkillGapAnalysis />} />
            <Route path="/roadmap" element={<CareerRoadmap />} />
            <Route path="/resume" element={<ResumeAnalysis />} />
            <Route path="/chat" element={<AIChatAssistant />} />

            {/* Admin Hub */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute roleRequired="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Catch-all Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
