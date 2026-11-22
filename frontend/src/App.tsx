import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { DashboardLayout } from './layouts/DashboardLayout';

// ─── Public & Auth Pages (eager - small, needed immediately) ─────────────────
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';

// ─── Student Core Pages (lazy - loaded on demand, reduces initial bundle) ─────
const StudentDashboard = React.lazy(() =>
  import('./pages/StudentDashboard').then((m) => ({ default: m.StudentDashboard }))
);
const StudentProfile = React.lazy(() =>
  import('./pages/StudentProfile').then((m) => ({ default: m.StudentProfile }))
);
const CareerAssessment = React.lazy(() =>
  import('./pages/CareerAssessment').then((m) => ({ default: m.CareerAssessment }))
);
const CareerPrediction = React.lazy(() =>
  import('./pages/CareerPrediction').then((m) => ({ default: m.CareerPrediction }))
);
const SkillGapAnalysis = React.lazy(() =>
  import('./pages/SkillGapAnalysis').then((m) => ({ default: m.SkillGapAnalysis }))
);
const CareerRoadmap = React.lazy(() =>
  import('./pages/CareerRoadmap').then((m) => ({ default: m.CareerRoadmap }))
);
const ResumeAnalysis = React.lazy(() =>
  import('./pages/ResumeAnalysis').then((m) => ({ default: m.ResumeAnalysis }))
);
const ResumeBuilder = React.lazy(() =>
  import('./pages/ResumeBuilder').then((m) => ({ default: m.ResumeBuilder }))
);
const MockInterviewer = React.lazy(() =>
  import('./pages/MockInterviewer').then((m) => ({ default: m.MockInterviewer }))
);
const AIChatAssistant = React.lazy(() =>
  import('./pages/AIChatAssistant').then((m) => ({ default: m.AIChatAssistant }))
);
const AdminDashboard = React.lazy(() =>
  import('./pages/AdminDashboard').then((m) => ({ default: m.AdminDashboard }))
);

// ─── Loading Fallback ─────────────────────────────────────────────────────────
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-950">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-slate-400 text-sm font-medium">Loading…</p>
    </div>
  </div>
);

// ─── React Query Client ───────────────────────────────────────────────────────
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,   // 5 min
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Suspense fallback={<PageLoader />}>
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
                <Route path="/resume-builder" element={<ResumeBuilder />} />
                <Route path="/interview" element={<MockInterviewer />} />
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
          </Suspense>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}
