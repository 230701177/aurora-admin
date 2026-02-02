import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { SettingsProvider } from './context/SettingsContext';
import PageLayout from './components/layout/PageLayout';
import PageTransition from './components/ui/PageTransition';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Services from './pages/Services';
import Logs from './pages/Logs';
import Resources from './pages/Resources';
import Storage from './pages/Storage';
import Security from './pages/Security';
import Settings from './pages/Settings';
import './App.css';

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('aurora_auth_token');
    setIsAuthenticated(!!token);
  }, []);

  if (isAuthenticated === null) {
    // Still checking authentication
    return (
      <div className="app-loading">
        <div className="loading-spinner" />
        <div className="loading-text">Loading Aurora Admin</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Public Route wrapper (only for login)
const PublicRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('aurora_auth_token');
    setIsAuthenticated(!!token);
  }, []);

  if (isAuthenticated === null) {
    // Still checking authentication
    return (
      <div className="app-loading">
        <div className="loading-spinner" />
        <div className="loading-text">Loading Aurora Admin</div>
      </div>
    );
  }

  // If authenticated and trying to access login, redirect to dashboard
  if (isAuthenticated && location.pathname === '/login') {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  const location = useLocation();

  return (
    <SettingsProvider>
      <ThemeProvider>
        <AuthProvider>
          <div className="app">
            <Routes location={location} key={location.pathname}>
              {/* Public route - Login page */}
              <Route path="/login" element={
                <PublicRoute>
                  <PageTransition>
                    <Login />
                  </PageTransition>
                </PublicRoute>
              } />

              {/* Protected routes - All admin pages */}
              <Route path="/" element={
                <ProtectedRoute>
                  <PageLayout />
                </ProtectedRoute>
              }>
                <Route index element={
                  <PageTransition>
                    <Dashboard />
                  </PageTransition>
                } />
                <Route path="dashboard" element={<Navigate to="/" replace />} />
                <Route path="services" element={
                  <PageTransition>
                    <Services />
                  </PageTransition>
                } />
                <Route path="logs" element={
                  <PageTransition>
                    <Logs />
                  </PageTransition>
                } />
                <Route path="resources" element={
                  <PageTransition>
                    <Resources />
                  </PageTransition>
                } />
                <Route path="storage" element={
                  <PageTransition>
                    <Storage />
                  </PageTransition>
                } />
                <Route path="security" element={
                  <PageTransition>
                    <Security />
                  </PageTransition>
                } />
                <Route path="settings" element={
                  <PageTransition>
                    <Settings />
                  </PageTransition>
                } />

                {/* Catch all route - redirect to dashboard */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </div>
        </AuthProvider>
      </ThemeProvider>
    </SettingsProvider>
  );
}

export default App;
