/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaTint, FaBars, FaTimes, FaChevronRight, FaSignInAlt, FaUserPlus } from 'react-icons/fa';

const NAV_LINKS = [
  { label: 'Home',     href: '/',         section: 'hero' },
  { label: 'About',   href: '/about',    section: 'about' },
  { label: 'Services',href: '/services', section: 'features' },
  { label: 'FAQ',     href: '/faq',      section: 'faq' },
  { label: 'Contact', href: '/contact',  section: 'contact' },
];

export default function PublicNavbar() {
  const [scrolled,  setScrolled]  = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isLanding = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close drawer on route change
  useEffect(() => setDrawerOpen(false), [location.pathname]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  const handleNavClick = (e, link) => {
    e.preventDefault();
    setDrawerOpen(false);
    if (isLanding) {
      const el = document.getElementById(link.section);
      if (el) { el.scrollIntoView({ behavior: 'smooth' }); return; }
    }
    navigate(link.href);
  };

  const solid = scrolled || drawerOpen || !isLanding;

  return (
    <>
      <nav
        className={`pub-navbar ${solid ? 'pub-navbar-solid' : ''}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="pub-navbar-inner">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {/* Hamburger */}
            <button
              className="pub-navbar-hamburger"
              onClick={() => setDrawerOpen(v => !v)}
              aria-label="Toggle menu"
              aria-expanded={drawerOpen}
              style={{ marginRight: '32px', display: 'flex' }}
            >
              <FaBars size={20} />
            </button>

            {/* Brand */}
            <Link to="/" className="pub-navbar-brand">
              <div className="pub-navbar-brand-icon">
                <FaTint size={18} color="#fff" />
              </div>
              <span className="pub-navbar-brand-text">AquaShare</span>
            </Link>
          </div>

          {/* Desktop links */}
          <div className="pub-navbar-links">
            {NAV_LINKS.map(link => (
              <a
                key={link.label}
                href={link.href}
                className={`pub-navbar-link ${location.pathname === link.href ? 'active' : ''}`}
                onClick={e => handleNavClick(e, link)}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="pub-navbar-cta">
            <Link to="/login"    className="btn pub-navbar-btn-login">Login</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* ── Mobile Sidebar Drawer (matches dashboard sidebar) ── */}
      {/* Backdrop */}
      <div
        className={`sidebar-backdrop ${drawerOpen ? 'open' : ''}`}
        onClick={() => setDrawerOpen(false)}
        style={{ zIndex: 290 }}
      />

      {/* Drawer panel */}
      <aside
        className={`pub-drawer ${drawerOpen ? 'open' : ''}`}
        aria-hidden={!drawerOpen}
      >
        {/* Header */}
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="sidebar-brand-icon">
              <FaTint size={22} color="#fff" />
            </div>
            <span className="sidebar-brand-text">AquaShare</span>
          </div>
          <button className="sidebar-close" onClick={() => setDrawerOpen(false)} aria-label="Close menu">
            <FaTimes size={20} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="sidebar-nav" style={{ paddingTop: '8px' }}>
          <div className="sidebar-nav-heading">Navigation</div>
          {NAV_LINKS.map(link => (
            <a
              key={link.label}
              href={link.href}
              className={`sidebar-link ${location.pathname === link.href ? 'active' : ''}`}
              onClick={e => handleNavClick(e, link)}
            >
              <span style={{ flex: 1 }}>{link.label}</span>
              <FaChevronRight size={12} className="sidebar-link-chevron" />
            </a>
          ))}
        </nav>

        {/* Auth CTA at the bottom */}
        <div className="sidebar-footer" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Link
            to="/login"
            className="sidebar-link"
            onClick={() => setDrawerOpen(false)}
            style={{ justifyContent: 'center', textDecoration: 'none' }}
          >
            <FaSignInAlt size={17} className="sidebar-link-icon" />
            <span>Login</span>
          </Link>
          <Link
            to="/register"
            onClick={() => setDrawerOpen(false)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              padding: '12px 16px', borderRadius: 'var(--radius-md)',
              background: 'var(--primary-500)', color: '#fff',
              fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none',
              transition: 'background 0.2s',
            }}
          >
            <FaUserPlus size={16} />
            Get Started Free
          </Link>
        </div>
      </aside>
    </>
  );
}
