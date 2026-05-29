import { useState } from 'react';
import { Routes, Route, NavLink, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ResidentDashboard from './ResidentDashboard';
import SupplierDashboard from './SupplierDashboard';
import Profile from './Profile';
import Chat from './Chat';

import {
  FaTint,
  FaTachometerAlt,
  FaShoppingCart,
  FaCommentAlt,
  FaUser,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from 'react-icons/fa';

const NAV_RESIDENT = [
  { to: '/dashboard', icon: FaTachometerAlt, label: 'Dashboard', end: true },
  { to: '/dashboard/requests', icon: FaShoppingCart, label: 'My Requests' },
  { to: '/dashboard/chat', icon: FaCommentAlt, label: 'Messages' },
  { to: '/dashboard/profile', icon: FaUser, label: 'Profile' },
];

const NAV_SUPPLIER = [
  { to: '/dashboard', icon: FaTachometerAlt, label: 'Dashboard', end: true },
  { to: '/dashboard/requests', icon: FaShoppingCart, label: 'Requests' },
  { to: '/dashboard/chat', icon: FaCommentAlt, label: 'Messages' },
  { to: '/dashboard/profile', icon: FaUser, label: 'Profile' },
];

export default function Dashboard() {
  const { user, logout, role } = useAuth();

  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  console.log("USER:", user);
  console.log("ROLE:", role);

  const navItems =
    role === 'supplier'
      ? NAV_SUPPLIER
      : NAV_RESIDENT;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.full_name
    ? user.full_name
      .split(' ')
      .map(w => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
    : '?';

  return (
    <div className="app-layout">

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15,23,42,.55)',
            backdropFilter: 'blur(2px)',
            zIndex: 99,
            display: 'none',
          }}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>

        {/* Brand */}
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="sidebar-brand-icon">
              <FaTint
                size={19}
                color="rgba(186,230,253,0.9)"
              />
            </div>

            <span className="sidebar-brand-text">
              AquaShare
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">

          <div className="sidebar-section-label">
            Navigation
          </div>

          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sidebar-link-icon">
                <item.icon size={18} />
              </span>

              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">

          <div className="sidebar-user-card">

            <div
              className="avatar avatar-sm"
              style={{ flexShrink: 0 }}
            >
              {initials}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="sidebar-user-name">
                {user?.full_name}
              </div>

              <div className="sidebar-user-role">
                {role}
              </div>
            </div>
          </div>

          <button
            className="btn btn-ghost btn-sm btn-block"
            onClick={handleLogout}
            id="sidebar-logout-btn"
            style={{
              color: 'rgba(255,255,255,.55)',
              justifyContent: 'flex-start',
              gap: '8px',
              padding: '8px 10px',
            }}
          >
            <FaSignOutAlt size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="main-content">

        {/* Topbar */}
        <div className="topbar">

          <div className="topbar-left">

            <button
              className="btn btn-icon btn-ghost"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              id="mobile-menu-toggle"
              aria-label="Toggle menu"
              style={{
                display: 'none',
                width: '36px',
                height: '36px',
              }}
            >
              {sidebarOpen
                ? <FaTimes size={20} />
                : <FaBars size={20} />
              }
            </button>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <FaTint
                size={18}
                color="var(--primary-400)"
              />

              <span className="topbar-title">
                {role === 'supplier'
                  ? 'Supplier Dashboard'
                  : 'Resident Dashboard'}
              </span>
            </div>
          </div>

          <div className="topbar-right">

            <span
              className="chip"
              style={{
                textTransform: 'capitalize',
                fontSize: '.72rem',
              }}
            >
              {role}
            </span>

            <div
              className="avatar avatar-sm"
              style={{ cursor: 'default' }}
            >
              {initials}
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="page-content">

          <Routes>

            {/* HOME */}
            <Route
              index
              element={
                role === 'supplier'
                  ? <SupplierDashboard />
                  : <ResidentDashboard />
              }
            />

            {/* REQUESTS */}
            <Route
              path="requests"
              element={
                <div>
                  Requests Page
                </div>
              }
            />

            {/* CHAT */}
            <Route
              path="chat"
              element={<Chat />}
            />

            {/* PROFILE */}
            <Route
              path="profile"
              element={<Profile />}
            />

            {/* FALLBACK */}
            <Route
              path="*"
              element={<Navigate to="/dashboard" replace />}
            />

          </Routes>
        </div>
      </div>

      {/* Mobile styles */}
      <style>{`
        @media (max-width: 1024px) {

          #mobile-menu-toggle {
            display: flex !important;
          }

          .sidebar-overlay {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
}