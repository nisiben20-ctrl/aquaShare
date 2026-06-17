import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';
import Footer from '../components/Footer';
import heroBg from '../assets/hero1.png';
import residentImg from '../assets/resident1.jpg';
import supplierImg from '../assets/supplier1.jpg';
import {
  FaTint, FaSearch, FaPaperPlane, FaStar, FaCheckCircle,
  FaShieldAlt, FaBolt, FaCommentAlt, FaChartLine, FaMapMarkerAlt,
  FaUserCheck, FaDollarSign, FaChevronDown, FaChevronUp,
  FaArrowRight,
} from 'react-icons/fa';

/* ─── Data ──────────────────────────────────────────────────── */
const HOW_STEPS = [
  {
    num: '01', icon: FaSearch, color: '#009CFF',
    title: 'Find a Supplier',
    desc: 'Browse our directory of verified, rated water suppliers in your area. Filter by price, rating, and availability.',
  },
  {
    num: '02', icon: FaPaperPlane, color: '#FF7A00',
    title: 'Place Your Order',
    desc: 'Select your quantity, add any delivery notes, and send your request in seconds. Track status in real time.',
  },
  {
    num: '03', icon: FaTint, color: '#009CFF',
    title: 'Get Fresh Water',
    desc: 'Your supplier confirms the order and delivers clean, safe water right to your door. Then rate your experience!',
  },
];

const FEATURES = [
  { icon: FaShieldAlt, color: '#009CFF', title: 'Verified Suppliers', desc: 'Every supplier on AquaShare is manually reviewed and verified before listing.' },
  { icon: FaBolt, color: '#FF7A00', title: 'Real-time Availability', desc: 'See instantly which suppliers are online and ready to accept your order.' },
  { icon: FaCommentAlt, color: '#009CFF', title: 'Secure Messaging', desc: 'Chat directly with your supplier inside the app — no need to share phone numbers.' },
  { icon: FaChartLine, color: '#FF7A00', title: 'Order Tracking', desc: 'Follow your request from pending to delivery with live status updates.' },
  { icon: FaStar, color: '#009CFF', title: 'Ratings & Reviews', desc: 'Community-driven ratings keep quality high and suppliers accountable.' },
  { icon: FaDollarSign, color: '#FF7A00', title: 'Transparent Pricing', desc: 'No hidden fees. Suppliers publish their per-unit price upfront before you order.' },
];

const RESIDENT_BENEFITS = [
  'Browse verified local water suppliers instantly',
  'See live availability — no more guessing',
  'Order with one tap, track delivery status',
  'Chat directly with your supplier',
  'Rate & review after every delivery',
  'Full order history at your fingertips',
];

const SUPPLIER_BENEFITS = [
  'Get discovered by thousands of residents in your area',
  'Set your own pricing and availability schedule',
  'Manage all incoming orders from one dashboard',
  'Chat with customers directly through the app',
  'Build a reputation with verified ratings',
  'Zero commission — keep 100% of your earnings',
];



const FAQS = [
  { q: 'What is AquaShare?', a: 'AquaShare is a community water delivery platform that connects local residents with verified water suppliers for fast, affordable, and safe water delivery.' },
  { q: 'Is AquaShare free for residents?', a: 'Yes! Residents can browse suppliers and place orders completely free. You only pay the supplier\'s published price for the water itself.' },
  { q: 'How are suppliers verified?', a: 'Every supplier goes through a manual review process where we verify their identity, water source quality, and service reliability before they can be listed.' },
  { q: 'How do I place an order?', a: 'Simply find a supplier, click "Request", choose your quantity, add any delivery notes, and submit. The supplier will confirm and arrange delivery.' },
  { q: 'Can I message my supplier?', a: 'Absolutely. AquaShare has a built-in chat system so you can communicate directly with your supplier without sharing personal contact details.' },
  { q: 'What areas are currently covered?', a: 'We are currently serving the South West and Littoral regions of Cameroon, with expansion to other regions planned for later this year.' },
];

/* ─── Sub-components ────────────────────────────────────────── */
function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`faq-item ${open ? 'open' : ''}`}>
      <button className="faq-question" onClick={() => setOpen(v => !v)} aria-expanded={open}>
        <span>{q}</span>
        {open ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
      </button>
      {open && <div className="faq-answer animate-fade">{a}</div>}
    </div>
  );
}

/* ── Hero slide data ───────────────────────────────────────── */
const HERO_SLIDES = [
  {
    overlay: 'linear-gradient(135deg, rgba(0,58,99,0.88) 0%, rgba(0,156,255,0.55) 100%)',
    tag: 'Community Water Network',
    headline: <>Clean Water,<br /><span className="hero-headline-accent">Delivered to</span><br />Your Doorstep</>,
    sub: 'AquaShare connects residents with verified local water suppliers for fast, affordable, and safe drinking water — anytime, anywhere.',
  },
  {
    overlay: 'linear-gradient(135deg, rgba(255,122,0,0.7) 0%, rgba(0,58,99,0.88) 100%)',
    tag: 'Fast & Reliable',
    headline: <>Pure Water,<br /><span className="hero-headline-accent">No Stress</span><br />Order in Seconds</>,
    sub: 'Browse rated, verified suppliers in your area and get crystal-clear water delivered fast and affordably.',
  },
  {
    overlay: 'linear-gradient(135deg, rgba(0,58,99,0.92) 0%, rgba(0,156,255,0.35) 60%, rgba(255,122,0,0.25) 100%)',
    tag: 'Trusted Partners',
    headline: <>Connecting Residents<br /><span className="hero-headline-accent">With Clean</span><br />Water</>,
    sub: 'Join thousands of residents already using AquaShare to stay hydrated, healthy and connected.',
  },
];

/* ─── Main ──────────────────────────────────────────────────── */
export default function Landing() {
  const [heroIdx, setHeroIdx] = useState(0);
  const [heroFade, setHeroFade] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroFade(false);
      setTimeout(() => {
        setHeroIdx(i => (i + 1) % HERO_SLIDES.length);
        setHeroFade(true);
      }, 500);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[heroIdx];

  return (
    <div className="landing-page">
      <PublicNavbar />

      {/* ══════════════════════════════════════════════════════
          HERO — Smooth crossfade slides
      ══════════════════════════════════════════════════════ */}
      <section
        id="hero"
        className="landing-hero"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        {/* Crossfading gradient overlay */}
        <div
          className="landing-hero-overlay"
          style={{
            background: slide.overlay,
            opacity: heroFade ? 1 : 0,
            transition: 'opacity 0.8s ease-in-out, background 1s ease-in-out',
          }}
        />

        {/* Floating water drops (decorative) */}
        <div className="hero-drop hero-drop-1" />
        <div className="hero-drop hero-drop-2" />
        <div className="hero-drop hero-drop-3" />

        <div
          className="container landing-hero-content"
          style={{
            opacity: heroFade ? 1 : 0,
            transform: heroFade ? 'translateY(0)' : 'translateY(12px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
          }}
        >
          <span className="hero-tag" style={{ marginBottom: 24 }}>
            {slide.tag}
          </span>

          <h1 className="landing-hero-headline">
            {slide.headline}
          </h1>

          <p className="landing-hero-sub">
            {slide.sub}
          </p>

          <div className="landing-hero-actions">
            <Link to="/register" className="btn btn-primary btn-lg">
              Get Started Free <FaArrowRight size={14} />
            </Link>
            <a
              href="#how-it-works"
              className="btn btn-outline-white btn-lg"
              onClick={e => { e.preventDefault(); document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' }); }}
            >
              How It Works
            </a>
          </div>

          {/* Trust badges */}
          <div className="hero-trust">
            <span className="hero-trust-item"><FaCheckCircle color="#4ade80" size={14} /> Verified Suppliers</span>
            <span className="hero-trust-item"><FaCheckCircle color="#4ade80" size={14} /> Free for Residents</span>
            <span className="hero-trust-item"><FaCheckCircle color="#4ade80" size={14} /> Secure Payments</span>
          </div>
        </div>

        {/* Slide indicators (Hidden per user request) */}
        <div style={{
          position: 'absolute', bottom: '100px', left: '50%', transform: 'translateX(-50%)',
          zIndex: 3, display: 'none', gap: '10px',
        }}>
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => { setHeroFade(false); setTimeout(() => { setHeroIdx(i); setHeroFade(true); }, 300); }}
              style={{
                width: heroIdx === i ? '28px' : '10px', height: '10px',
                borderRadius: '5px', border: 'none', cursor: 'pointer',
                background: heroIdx === i ? 'var(--secondary-color)' : 'rgba(255,255,255,0.5)',
                transition: 'all 0.3s ease',
              }}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Scroll cue */}
        <a
          className="hero-scroll-cue"
          href="#how-it-works"
          onClick={e => { e.preventDefault(); document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' }); }}
          aria-label="Scroll down"
        >
          <FaChevronDown size={18} />
        </a>

        {/* Bottom wave */}
        <div className="hero-wave">
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#fff" />
          </svg>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════════════════ */}
      <section id="how-it-works" className="pub-section pub-section-white">
        <div className="container">
          <div className="section-header-center">
            <span className="section-tag">Simple Process</span>
            <h2 className="section-title">How AquaShare Works</h2>
            <p className="section-sub">
              Getting clean water delivered has never been easier. Three simple steps and you're done.
            </p>
          </div>

          <div className="how-steps-grid">
            {HOW_STEPS.map((step, i) => (
              <div key={i} className="how-step-card">
                <div className="how-step-num" style={{ color: step.color, borderColor: step.color + '33' }}>
                  {step.num}
                </div>
                <div className="how-step-icon" style={{ background: step.color + '15', color: step.color }}>
                  <step.icon size={28} />
                </div>
                <h3 className="how-step-title">{step.title}</h3>
                <p className="how-step-desc">{step.desc}</p>
                {i < HOW_STEPS.length - 1 && <div className="how-step-arrow">→</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FEATURES
      ══════════════════════════════════════════════════════ */}
      <section id="features" className="pub-section pub-section-gray">
        <div className="container">
          <div className="section-header-center">
            <span className="section-tag">Everything You Need</span>
            <h2 className="section-title">Powerful Features Built for You</h2>
            <p className="section-sub">
              From verified suppliers to real-time chat, AquaShare has every tool you need for a smooth water delivery experience.
            </p>
          </div>

          <div className="features-grid">
            {FEATURES.map((f, i) => (
              <div key={i} className="feature-card">
                <div className="feature-icon" style={{ background: f.color + '15', color: f.color }}>
                  <f.icon size={26} />
                </div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FOR RESIDENTS
      ══════════════════════════════════════════════════════ */}
      <section id="residents" className="pub-section pub-section-white">
        <div className="container">
          <div className="split-section">
            {/* Visual */}
            <div className="split-visual split-visual-blue" style={{ backgroundImage: `url(${residentImg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
              <div className="split-visual-inner" style={{ background: 'rgba(0, 156, 255, 0.2)' }}>
                <div className="split-icon-big"><FaTint size={64} color="rgba(255,255,255,0.9)" /></div>
              </div>
            </div>

            {/* Text */}
            <div className="split-text">
              <span className="section-tag">For Residents</span>
              <h2 className="section-title" style={{ textAlign: 'left' }}>
                Never Run Out of Clean Water Again
              </h2>
              <p className="section-sub" style={{ textAlign: 'left' }}>
                AquaShare makes it effortless to find trusted water suppliers near you and order fresh water whenever you need it.
              </p>
              <ul className="benefit-list">
                {RESIDENT_BENEFITS.map((b, i) => (
                  <li key={i} className="benefit-item">
                    <span className="benefit-check"><FaCheckCircle size={16} /></span>
                    {b}
                  </li>
                ))}
              </ul>
              <Link to="/register?role=resident" className="btn btn-primary btn-lg" style={{ marginTop: 32 }}>
                Join as a Resident <FaArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FOR SUPPLIERS
      ══════════════════════════════════════════════════════ */}
      <section id="suppliers" className="pub-section pub-section-gray">
        <div className="container">
          <div className="split-section split-section-reverse">
            {/* Text */}
            <div className="split-text">
              <span className="section-tag" style={{ background: 'rgba(255,122,0,0.1)', color: '#FF7A00', borderColor: 'rgba(255,122,0,0.25)' }}>
                For Suppliers
              </span>
              <h2 className="section-title" style={{ textAlign: 'left' }}>
                Grow Your Water Supply Business
              </h2>
              <p className="section-sub" style={{ textAlign: 'left' }}>
                Join hundreds of suppliers already using AquaShare to reach more customers, manage orders efficiently, and build a trusted brand.
              </p>
              <ul className="benefit-list">
                {SUPPLIER_BENEFITS.map((b, i) => (
                  <li key={i} className="benefit-item">
                    <span className="benefit-check" style={{ color: '#FF7A00' }}><FaCheckCircle size={16} /></span>
                    {b}
                  </li>
                ))}
              </ul>
              <Link to="/register?role=supplier" className="btn btn-lg" style={{ marginTop: 32, background: '#FF7A00', color: '#fff', border: 'none' }}>
                Join as a Supplier <FaArrowRight size={14} />
              </Link>
            </div>

            {/* Visual */}
            <div className="split-visual split-visual-orange" style={{ backgroundImage: `url(${supplierImg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
              <div className="split-visual-inner" style={{ background: 'rgba(255, 122, 0, 0.2)' }}>
                <div className="split-icon-big"><FaUserCheck size={64} color="rgba(255,255,255,0.9)" /></div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* ══════════════════════════════════════════════════════
          FAQ
      ══════════════════════════════════════════════════════ */}
      <section id="faq" className="pub-section pub-section-white">
        <div className="container" style={{ maxWidth: 780 }}>
          <div className="section-header-center">
            <span className="section-tag">Got Questions?</span>
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-sub">
              Everything you need to know about AquaShare. Can't find an answer?{' '}
              <Link to="/contact" style={{ color: 'var(--primary-500)', fontWeight: 600 }}>Contact us</Link>.
            </p>
          </div>
          <div className="faq-list">
            {FAQS.map((faq, i) => <FAQItem key={i} q={faq.q} a={faq.a} />)}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          CONTACT TEASER
      ══════════════════════════════════════════════════════ */}
      <section id="contact" className="pub-section pub-section-gray">
        <div className="container" style={{ maxWidth: 700, textAlign: 'center' }}>
          <span className="section-tag">Get In Touch</span>
          <h2 className="section-title">Have More Questions?</h2>
          <p className="section-sub">
            Our team is happy to help. Reach out to us and we'll get back to you as soon as possible.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginTop: 32 }}>
            <Link to="/contact" className="btn btn-primary btn-lg">
              <FaEnvelope size={15} /> Contact Us
            </Link>
            <Link to="/faq" className="btn btn-secondary btn-lg">
              Browse FAQ
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          CTA BANNER
      ══════════════════════════════════════════════════════ */}
      <section className="landing-cta-band">
        <div className="container landing-cta-inner">
          <div>
            <h2 className="landing-cta-title">Ready to Get Started?</h2>
            <p className="landing-cta-sub">Join thousands of residents and suppliers already on AquaShare.</p>
          </div>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <Link to="/register?role=resident" className="btn btn-lg" style={{ background: '#fff', color: 'var(--primary-600)', fontWeight: 700 }}>
              I'm a Resident
            </Link>
            <Link to="/register?role=supplier" className="btn btn-outline-white btn-lg">
              I'm a Supplier
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

// needed inline since we reference it inside Landing
function FaEnvelope({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
    </svg>
  );
}
