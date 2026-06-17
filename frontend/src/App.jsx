import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Public pages
import Landing  from './pages/Landing';
import About    from './pages/About';
import Services from './pages/Services';
import FAQPage  from './pages/FAQPage';
import Contact  from './pages/Contact';

// Auth pages
import Login    from './pages/Login';
import Register from './pages/Register';

// App (authenticated)
import Dashboard from './pages/Dashboard';
import Profile   from './pages/Profile';

import './index.css';

/** Only accessible when logged in */
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

/** Only accessible when logged out */
function GuestRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      {/* ── Public landing & info pages ─────────────────────── */}
      <Route path="/"        element={<Landing />} />
      <Route path="/about"   element={<About />} />
      <Route path="/services"element={<Services />} />
      <Route path="/faq"     element={<FAQPage />} />
      <Route path="/contact" element={<Contact />} />

      {/* ── Auth pages (guest only) ──────────────────────────── */}
      <Route path="/login"    element={<GuestRoute><Login /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />

      {/* ── Protected app area ──────────────────────────────── */}
      <Route path="/dashboard/*" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/profile"     element={<ProtectedRoute><Profile /></ProtectedRoute>} />

      {/* ── Fallback ─────────────────────────────────────────── */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
