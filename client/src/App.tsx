import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Landing from './pages/Landing';
import ServicesPage from './pages/ServicesPage';
import SafetyMatrixPage from './pages/SafetyMatrixPage';
import LabDecoderPage from './pages/LabDecoderPage';
import RegionalCarePage from './pages/RegionalCarePage';
import AnnotationPage from './pages/AnnotationPage';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Login from './pages/Login';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Healthcare Startup Homepage Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Landing />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/safety-matrix" element={<SafetyMatrixPage />} />
        <Route path="/lab-decoder" element={<LabDecoderPage />} />
        <Route path="/regional-care" element={<RegionalCarePage />} />
        <Route path="/annotation" element={<AnnotationPage />} />
        <Route path="/login" element={<Login />} />

        {/* Authenticated Patient Vault & Clinical Dashboard Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
