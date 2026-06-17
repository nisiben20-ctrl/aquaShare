import { useState } from 'react';
import { Routes, Route, NavLink, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ResidentDashboard from './ResidentDashboard';
import SupplierDashboard from './SupplierDashboard';
import AdminDashboard from './AdminDashboard';
import Profile from './Profile';
import Chat from './Chat';
import Requests from './Requests';

import {
  FaTint,
  FaTachometerAlt,
  FaShoppingCart,
  FaCommentAlt,
  FaUser,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaChevronRight
} from 'react-icons/fa';

export default function Dashboard() {
  const { user, logout, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/dashboard',          label: 'Dashboard', icon: FaTachometerAlt, end: true },
    ...(role === 'resident' ? [{ to: '/dashboard/requests', label: 'Requests',  icon: FaShoppingCart }] : []),
    ...(role !== 'admin'   ? [{ to: '/dashboard/chat',     label: 'Messages',  icon: FaCommentAlt   }] : []),
    { to: '/dashboard/profile',  label: 'Profile',   icon: FaUser },
  ];

  // Derive page title from current route
  const currentLink = navLinks.find(l => {
    if (l.end) return location.pathname === l.to || location.pathname === '/dashboard';
    return location.pathname.startsWith(l.to);
  });
  const pageTitle = currentLink?.label ?? 'Dashboard';

  return (
    <div className="app-layout">
      {/* ══ BACKDROP ══════════════════════════════════════════════ */}
      <div
        className={`sidebar-backdrop ${sidebarOpen ? 'open' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* ══ SIDEBAR DRAWER ════════════════════════════════════════ */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="sidebar-brand-icon">
              <FaTint size={22} color="#fff" />
            </div>
            <span className="sidebar-brand-text">AquaShare</span>
          </div>
          <button className="sidebar-close" onClick={() => setSidebarOpen(false)} aria-label="Close menu">
            <FaTimes size={18} />
          </button>
        </div>

        {/* User Card */}
        <div className="sidebar-user-card">
          <div className="avatar avatar-sm">
            {user?.full_name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?'}
          </div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user?.full_name}</div>
            <div className="sidebar-user-role">{role}</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-nav-heading">Main Menu</div>
          {navLinks.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <item.icon size={18} className="sidebar-link-icon" />
              <span style={{ flex: 1 }}>{item.label}</span>
              <FaChevronRight size={12} className="sidebar-link-chevron" />
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="sidebar-link sidebar-link-logout" onClick={handleLogout}>
            <FaSignOutAlt size={18} className="sidebar-link-icon" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ══ MAIN CONTENT ══════════════════════════════════════════ */}
      <div className="main-content">
        <header className="topbar">
          {/* Hamburger — only visible on mobile */}
          <button
            className="mobile-menu-btn"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={sidebarOpen}
          >
            <FaBars size={20} color="#fff" />
          </button>

          {/* Brand + page title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
            <span style={{
              display: 'flex', alignItems: 'center', gap: '7px',
              fontFamily: 'var(--font-family-display)', fontSize: '1rem',
              fontWeight: 800, color: 'rgba(255,255,255,0.5)', letterSpacing: '-0.01em',
            }}>
              <FaTint size={16} color="var(--primary-400)" />
              AquaShare
            </span>
            <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '1.1rem', lineHeight: 1 }}>›</span>
            <h2 className="topbar-title">{pageTitle}</h2>
          </div>

          {/* User greeting */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              Hi, <strong style={{ color: '#fff' }}>{user?.full_name?.split(' ')[0] || 'User'}</strong>
            </span>
            <div className="avatar avatar-sm" style={{ border: '2px solid rgba(255,255,255,0.2)' }}>
              {user?.full_name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?'}
            </div>
          </div>
        </header>

        <div className="page-content">
          <Routes>
            <Route
              index
              element={
                role === 'supplier'
                  ? <SupplierDashboard />
                  : role === 'admin'
                    ? <AdminDashboard />
                    : <ResidentDashboard />
              }
            />
            <Route path="requests" element={<Requests />} />
            <Route path="chat"     element={<Chat />} />
            <Route path="profile"  element={<Profile />} />
            <Route path="*"        element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}