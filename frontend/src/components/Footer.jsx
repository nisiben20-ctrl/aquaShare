import { Link } from 'react-router-dom';
import { FaTint, FaMapMarkerAlt, FaPhone, FaEnvelope,
         FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const FOOTER_LINKS = {
  Company:  [
    { label: 'Home',     to: '/' },
    { label: 'About Us', to: '/about' },
    { label: 'Services', to: '/services' },
    { label: 'Contact',  to: '/contact' },
  ],
  Support:  [
    { label: 'FAQ',               to: '/faq' },
    { label: 'How It Works',      to: '/#how-it-works' },
    { label: 'For Residents',     to: '/#residents' },
    { label: 'For Suppliers',     to: '/#suppliers' },
  ],
  Account:  [
    { label: 'Login',               to: '/login' },
    { label: 'Register (Resident)', to: '/register?role=resident' },
    { label: 'Register (Supplier)', to: '/register?role=supplier' },
  ],
};

const SOCIALS = [
  { Icon: FaFacebookF,  href: '#', label: 'Facebook' },
  { Icon: FaTwitter,    href: '#', label: 'Twitter' },
  { Icon: FaInstagram,  href: '#', label: 'Instagram' },
  { Icon: FaLinkedinIn, href: '#', label: 'LinkedIn' },
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="site-footer-top">
        <div className="container site-footer-grid">

          {/* Brand column */}
          <div className="footer-brand-col">
            <Link to="/" className="footer-brand">
              <div className="footer-brand-icon">
                <FaTint size={20} color="#fff" />
              </div>
              <span className="footer-brand-text">AquaShare</span>
            </Link>
            <p className="footer-desc">
              Connecting communities with verified, local water suppliers for clean and safe water delivery.
            </p>
            {/* Social media links removed until available */}
            <div className="footer-contact-list">
              <div className="footer-contact-item">
                <FaMapMarkerAlt size={14} /> Buea, South West Region, Cameroon
              </div>
              <div className="footer-contact-item">
                <FaPhone size={14} /> +237 6XX XXX XXX
              </div>
              <div className="footer-contact-item">
                <FaEnvelope size={14} /> hello@aquashare.cm
              </div>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading} className="footer-link-col">
              <h4 className="footer-col-title">{heading}</h4>
              <ul className="footer-link-list">
                {links.map(link => (
                  <li key={link.label}>
                    <Link to={link.to} className="footer-link">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="site-footer-bottom">
        <div className="container site-footer-bottom-inner">
          <span>© {year} AquaShare. All rights reserved.</span>
          <div className="footer-bottom-links">
            <a href="#" className="footer-bottom-link">Privacy Policy</a>
            <a href="#" className="footer-bottom-link">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
