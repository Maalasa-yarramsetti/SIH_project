import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SplashScreen from './components/SplashScreen';
import AuthPage from './pages/AuthPage';
import UserDashboard from './pages/UserDashboard';
// --- THIS IMPORT PATH IS UPDATED ---
import AdminDashboard from './components/AdminDashboard/AdminDashboard'; 
import NgoDashboard from './pages/NgoDashboard';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LocaleProvider } from './contexts/LocaleContext';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <LocaleProvider>
          <Router>
          {loading ? (
            <SplashScreen />
          ) : (
            <Routes>
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/user/*" element={<ProtectedRoute role="user"><UserDashboard /></ProtectedRoute>} />
              {/* --- THIS ROUTE NOW USES YOUR NEW DASHBOARD --- */}
              <Route path="/admin/*" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
              <Route path="/ngo/*" element={<ProtectedRoute role="ngo"><NgoDashboard /></ProtectedRoute>} />
              <Route path="*" element={<AuthRedirect />} />
            </Routes>
          )}
          </Router>
        </LocaleProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

const AuthRedirect = () => {
    const { user } = useAuth();
    if (user) {
        // --- THIS REDIRECT IS UPDATED ---
        if (user.role === 'admin') {
            return <Navigate to="/admin" replace />;
        }
        return <Navigate to={`/${user.role}/explore`} replace />;
    }
    return <Navigate to="/auth" replace />;
};

const ProtectedRoute = ({ children, role }) => {
    const { user, loading } = useAuth();
    if (loading) {
        return <div>Loading...</div>;
    }
    if (!user || user.role !== role) {
        return <Navigate to="/auth" replace />;
    }
    return children;
};

export default App;