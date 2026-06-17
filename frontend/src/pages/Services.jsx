import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';
import Footer from '../components/Footer';

const services = [
  {
    icon: '🚰',
    title: 'Water Delivery',
    description:
      'Schedule same-day or next-day water delivery straight to your door. Choose from 2L, 10L, 20L, or bulk tank options. Contactless delivery available.',
    highlight: 'Most Popular',
  },
  {
    icon: '🔗',
    title: 'Supplier Matching',
    description:
      'Our smart algorithm matches you with the best-rated, nearest certified supplier. No guesswork, just clean water from a trusted local source.',
    highlight: null,
  },
  {
    icon: '💬',
    title: 'Live Chat Support',
    description:
      'Our support team is available 7 days a week via live chat and phone. Have a question about your order? We respond in under 3 minutes on average.',
    highlight: '24/7',
  },
  {
    icon: '📦',
    title: 'Order Tracking',
    description:
      'Watch your delivery in real time on an interactive map. Get SMS and push notifications as your order is picked up, en route, and delivered. Feature deos not yet exist but will',
    highlight: null,
  },
  {
    icon: '⭐',
    title: 'Rating System',
    description:
      'Every delivery is rated by verified customers. Suppliers earn badges for consistency, punctuality, and quality, keeping standards high across the board.',
    highlight: null,
  },
  {
    icon: '💰',
    title: 'Pricing Transparency',
    description:
      'No hidden fees. No surprise charges. See the full breakdown water cost, delivery fee, and any applicable taxes before you confirm your order.',
    highlight: 'No Hidden Fees',
  },
];

const pricingTiers = [
  {
    name: 'Pay As You Go',

    price: 'From 300FCFA',
    per: 'per order',
    description: 'Perfect for occasional orders with no commitment.',
    features: ['Order anytime', 'Standard delivery windows', 'Email receipts', 'Basic order tracking'],
    color: '#009CFF',
    cta: 'Start Ordering',
  },
  {
    name: 'Weekly Plan',

    price: '1000FCFA',
    per: 'per month',
    description: 'Ideal for households needing regular, reliable delivery.',
    features: [
      'Up to 4 deliveries/week',
      'Priority scheduling',
      'Real-time tracking',
      'Dedicated support agent',
      '10% off delivery fees',
    ],
    color: '#FF7A00',
    cta: 'Choose Weekly',
    featured: true,
  },
  {
    name: 'Business Plan',

    price: 'Custom',
    per: 'negotiated',
    description: 'Tailored for offices, restaurants, and large facilities.',
    features: [
      'Unlimited deliveries',
      'Bulk pricing discounts',
      'Dedicated account manager',
      'SLA-backed delivery',
      'Monthly consolidated invoicing',
    ],
    color: '#003a63',
    cta: 'Contact Sales',
  },
];

const faqs = [
  {
    question: 'How do I know my supplier is certified?',
    answer:
      'Every supplier on AquaShare goes through a rigorous onboarding process, including facility inspection, water quality testing, and documentation review. Certified suppliers display a blue verification badge on their profile.',
  },
  {
    question: 'Can I switch suppliers after placing an order?',
    answer:
      'Yes if your order has not yet been picked up for delivery, you can cancel and re-order through a different supplier at no extra charge. Once en route, changes are handled via live chat support.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept card payments (Visa, Mastercard), bank transfers, USSD, and popular mobile wallets. All transactions are encrypted and secured via our payment partner.',
  },
  {
    question: 'Is there a minimum order size?',
    answer:
      'The minimum order is a single 5L bottle. There is no upper limit — businesses can order bulk tanker deliveries through our Business Plan.',
  },
];

export default function Services() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (i) => setOpenFaq(openFaq === i ? null : i);

  return (
    <div style={{ fontFamily: 'var(--font-family)', color: 'var(--gray-900)', overflowX: 'hidden' }}>
      <PublicNavbar />

      {/* ── HERO ── */}
      <section
        style={{
          background: 'linear-gradient(135deg, #003a63 0%, #005a96 55%, #009CFF 100%)',
          padding: '120px 24px 100px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-80px',
            right: '-80px',
            width: '360px',
            height: '360px',
            borderRadius: '50%',
            background: 'rgba(0,156,255,0.18)',
            filter: 'blur(70px)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-60px',
            left: '-60px',
            width: '280px',
            height: '280px',
            borderRadius: '50%',
            background: 'rgba(255,122,0,0.13)',
            filter: 'blur(55px)',
            pointerEvents: 'none',
          }}
        />

        <div className="container animate-in" style={{ position: 'relative', zIndex: 1 }}>
          <span
            className="chip"
            style={{
              background: 'rgba(255,255,255,0.15)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.3)',
              marginBottom: '20px',
              display: 'inline-block',
            }}
          >
            What We Offer
          </span>
          <h1
            style={{
              fontFamily: 'var(--font-family-display)',
              fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
              fontWeight: 700,
              color: '#fff',
              marginBottom: '20px',
              lineHeight: 1.15,
            }}
          >
            Our Services
          </h1>
          <p
            style={{
              fontSize: '1.2rem',
              color: 'rgba(255,255,255,0.82)',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: 1.7,
            }}
          >
            Everything you need to get clean, safe water delivered reliably — from smart supplier matching
            to real-time tracking and transparent pricing.
          </p>
        </div>
      </section>

      {/* ── SERVICES GRID ── */}
      <section className="pub-section" style={{ background: '#fff', padding: '96px 24px' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="section-tag">Core Services</span>
          <h2
            className="section-title"
            style={{ fontFamily: 'var(--font-family-display)', marginTop: '12px', marginBottom: '16px' }}
          >
            Built for Every Water Need
          </h2>
          <p className="section-sub" style={{ maxWidth: '580px', margin: '0 auto 56px' }}>
            Six powerful services working together to deliver the smoothest water experience possible.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
              gap: '26px',
            }}
          >
            {services.map((s, i) => (
              <div
                key={s.title}
                className="card animate-in"
                style={{
                  padding: '40px 32px',
                  borderRadius: 'var(--radius-xl, 20px)',
                  border: '1px solid #e8f4ff',
                  textAlign: 'left',
                  position: 'relative',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  cursor: 'default',
                  animationDelay: `${i * 0.1}s`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = '0 20px 50px rgba(0,156,255,0.13)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '';
                }}
              >
                {s.highlight && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '20px',
                      right: '20px',
                      background: s.highlight === '24/7' ? '#003a63' : '#FF7A00',
                      color: '#fff',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '4px 10px',
                      borderRadius: '50px',
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {s.highlight}
                  </span>
                )}

                <div
                  style={{
                    width: '68px',
                    height: '68px',
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, #e8f4ff, #cce8ff)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    marginBottom: '22px',
                  }}
                >
                  {s.icon}
                </div>
                <h3
                  style={{
                    fontFamily: 'var(--font-family-display)',
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: '#003a63',
                    marginBottom: '12px',
                  }}
                >
                  {s.title}
                </h3>
                <p style={{ color: '#475569', lineHeight: 1.75, fontSize: '0.96rem' }}>{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW PRICING WORKS ── */}
      <section className="pub-section" style={{ background: '#f8fafc', padding: '96px 24px' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="section-tag">Transparent Pricing</span>
          <h2
            className="section-title"
            style={{ fontFamily: 'var(--font-family-display)', marginTop: '12px', marginBottom: '16px' }}
          >
            How Pricing Works
          </h2>
          <p className="section-sub" style={{ maxWidth: '560px', margin: '0 auto 56px' }}>
            We keep it simple — see everything upfront. No subscriptions you didn't ask for, no hidden delivery
            surcharges, no surprises.
          </p>

          {/* Pricing Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
              gap: '26px',
              alignItems: 'stretch',
            }}
          >
            {pricingTiers.map((tier) => (
              <div
                key={tier.name}
                style={{
                  background: tier.featured
                    ? 'linear-gradient(160deg, #FF7A00, #ff9d3d)'
                    : '#fff',
                  border: tier.featured ? 'none' : '1px solid #dde8f5',
                  borderRadius: 'var(--radius-xl, 20px)',
                  padding: '44px 36px',
                  textAlign: 'left',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: tier.featured
                    ? '0 24px 60px rgba(255,122,0,0.28)'
                    : '0 4px 20px rgba(0,60,100,0.05)',
                  transform: tier.featured ? 'scale(1.03)' : 'scale(1)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {tier.featured && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '16px',
                      right: '16px',
                      background: 'rgba(255,255,255,0.22)',
                      color: '#fff',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '4px 12px',
                      borderRadius: '50px',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                    }}
                  >
                    Best Value
                  </div>
                )}

                <div style={{ fontSize: '2rem', marginBottom: '16px' }}>{tier.icon}</div>
                <h3
                  style={{
                    fontFamily: 'var(--font-family-display)',
                    fontSize: '1.3rem',
                    fontWeight: 700,
                    color: tier.featured ? '#fff' : '#003a63',
                    marginBottom: '6px',
                  }}
                >
                  {tier.name}
                </h3>
                <p
                  style={{
                    fontSize: '0.92rem',
                    color: tier.featured ? 'rgba(255,255,255,0.82)' : '#64748b',
                    marginBottom: '22px',
                  }}
                >
                  {tier.description}
                </p>

                <div style={{ marginBottom: '28px' }}>
                  <span
                    style={{
                      fontSize: '2.2rem',
                      fontWeight: 800,
                      color: tier.featured ? '#fff' : tier.color,
                      fontFamily: 'var(--font-family-display)',
                    }}
                  >
                    {tier.price}
                  </span>
                  <span
                    style={{
                      fontSize: '0.9rem',
                      color: tier.featured ? 'rgba(255,255,255,0.7)' : '#94a3b8',
                      marginLeft: '6px',
                    }}
                  >
                    / {tier.per}
                  </span>
                </div>

                <ul
                  style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: '0 0 32px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    flexGrow: 1,
                  }}
                >
                  {tier.features.map((f) => (
                    <li
                      key={f}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        fontSize: '0.93rem',
                        color: tier.featured ? 'rgba(255,255,255,0.9)' : '#475569',
                      }}
                    >
                      <span
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          background: tier.featured ? 'rgba(255,255,255,0.25)' : '#e8f4ff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.65rem',
                          flexShrink: 0,
                          color: tier.featured ? '#fff' : '#009CFF',
                          fontWeight: 700,
                        }}
                      >
                        ✓
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  to={tier.name === 'Business Plan' ? '/contact' : '/register'}
                  style={{ textDecoration: 'none' }}
                >
                  <button
                    style={{
                      width: '100%',
                      padding: '14px',
                      borderRadius: 'var(--radius-full, 50px)',
                      border: tier.featured ? 'none' : `2px solid ${tier.color}`,
                      background: tier.featured ? 'rgba(255,255,255,0.2)' : tier.color,
                      color: tier.featured ? '#fff' : '#fff',
                      fontSize: '0.97rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'opacity 0.2s ease, transform 0.2s ease',
                      backdropFilter: tier.featured ? 'blur(8px)' : 'none',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = '0.88';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = '1';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    {tier.cta}
                  </button>
                </Link>
              </div>
            ))}
          </div>

          {/* Pricing note */}
          <p
            style={{
              marginTop: '36px',
              color: '#94a3b8',
              fontSize: '0.88rem',
              maxWidth: '480px',
              margin: '36px auto 0',
            }}
          >
            All prices exclude applicable local taxes. Delivery fees vary by distance and are always shown before checkout.
          </p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="pub-section" style={{ background: '#fff', padding: '96px 24px' }}>
        <div className="container" style={{ maxWidth: '760px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '52px' }}>
            <span className="section-tag">Got Questions?</span>
            <h2
              className="section-title"
              style={{ fontFamily: 'var(--font-family-display)', marginTop: '12px', marginBottom: '14px' }}
            >
              Frequently Asked Questions
            </h2>
            <p className="section-sub">
              Everything you need to know about how our services work.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="faq-item"
                style={{
                  border: '1px solid',
                  borderColor: openFaq === i ? '#009CFF' : '#e2e8f0',
                  borderRadius: 'var(--radius-lg, 14px)',
                  overflow: 'hidden',
                  transition: 'border-color 0.2s ease',
                }}
              >
                <button
                  className="faq-question"
                  onClick={() => toggleFaq(i)}
                  style={{
                    width: '100%',
                    padding: '22px 26px',
                    background: openFaq === i ? '#f0f9ff' : '#fff',
                    border: 'none',
                    textAlign: 'left',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-family)',
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: openFaq === i ? '#009CFF' : '#1e293b',
                    transition: 'background 0.2s ease, color 0.2s ease',
                    gap: '12px',
                  }}
                >
                  {faq.question}
                  <span
                    style={{
                      fontSize: '1.3rem',
                      color: openFaq === i ? '#009CFF' : '#94a3b8',
                      transform: openFaq === i ? 'rotate(45deg)' : 'rotate(0)',
                      transition: 'transform 0.25s ease',
                      flexShrink: 0,
                    }}
                  >
                    +
                  </span>
                </button>
                {openFaq === i && (
                  <div
                    className="faq-answer"
                    style={{
                      padding: '0 26px 24px',
                      color: '#475569',
                      lineHeight: 1.78,
                      fontSize: '0.97rem',
                      background: '#f0f9ff',
                    }}
                  >
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        style={{
          background: 'linear-gradient(135deg, #003a63 0%, #005a96 60%, #009CFF 100%)',
          padding: '96px 24px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-80px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'rgba(0,156,255,0.12)',
            filter: 'blur(80px)',
            pointerEvents: 'none',
          }}
        />
        <div className="container animate-in" style={{ position: 'relative', zIndex: 1 }}>
          <span
            className="chip"
            style={{
              background: 'rgba(255,255,255,0.15)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.3)',
              marginBottom: '20px',
              display: 'inline-block',
            }}
          >
            Get Started Today
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-family-display)',
              fontSize: 'clamp(2rem, 4.5vw, 3rem)',
              fontWeight: 700,
              color: '#fff',
              marginBottom: '18px',
            }}
          >
            Clean Water, Delivered Your Way
          </h2>
          <p
            style={{
              color: 'rgba(255,255,255,0.82)',
              fontSize: '1.15rem',
              maxWidth: '520px',
              margin: '0 auto 40px',
              lineHeight: 1.7,
            }}
          >
            Whether you're ordering for your home or managing supply for a business, AquaShare has a plan
            that fits. Join the community and never worry about water again.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register">
              <button
                className="btn btn-lg"
                style={{
                  background: '#FF7A00',
                  color: '#fff',
                  border: 'none',
                  padding: '16px 40px',
                  borderRadius: 'var(--radius-full, 50px)',
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'background 0.2s ease, transform 0.2s ease',
                  boxShadow: '0 8px 30px rgba(255,122,0,0.35)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#e06d00';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#FF7A00';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Create Free Account
              </button>
            </Link>
            <Link to="/about">
              <button
                className="btn btn-lg btn-outline-white"
                style={{
                  background: 'transparent',
                  color: '#fff',
                  border: '2px solid rgba(255,255,255,0.5)',
                  padding: '16px 40px',
                  borderRadius: 'var(--radius-full, 50px)',
                  fontSize: '1.05rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'border-color 0.2s ease, background 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                  e.currentTarget.style.borderColor = '#fff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)';
                }}
              >
                Learn About Us
              </button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
