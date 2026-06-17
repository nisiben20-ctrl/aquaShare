/* eslint-disable no-unused-vars */
import React from 'react';
import { Link } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';
import Footer from '../components/Footer';

const values = [
  {
    icon: '💧',
    title: 'Purity',
    description:
      'We hold every drop to the highest standard. All suppliers on AquaShare are vetted, certified, and continuously monitored to ensure the water you receive is clean, safe, and refreshing.',
  },
  {
    icon: '🤝',
    title: 'Community',
    description:
      'AquaShare was built on the belief that access to clean water is a shared responsibility. We connect neighbours, businesses, and suppliers into one thriving water-sharing community.',
  },
  {
    icon: '⚡',
    title: 'Reliability',
    description:
      'From same-day delivery slots to real-time order tracking, you can count on AquaShare to deliver — every single time, without exception.',
  },
];



export default function About() {
  return (
    <div style={{ fontFamily: 'var(--font-family)', color: 'var(--gray-900)', overflowX: 'hidden' }}>
      <PublicNavbar />

      {/* ── HERO ── */}
      <section
        style={{
          background: 'linear-gradient(135deg, #003a63 0%, #005a96 50%, #009CFF 100%)',
          padding: '120px 24px 100px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* decorative blobs */}
        <div
          style={{
            position: 'absolute',
            top: '-80px',
            left: '-80px',
            width: '320px',
            height: '320px',
            borderRadius: '50%',
            background: 'rgba(0,156,255,0.18)',
            filter: 'blur(60px)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-60px',
            right: '-60px',
            width: '280px',
            height: '280px',
            borderRadius: '50%',
            background: 'rgba(255,122,0,0.14)',
            filter: 'blur(50px)',
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
            Our Story
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
            About AquaShare
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
            We're on a mission to make clean, affordable water accessible to every home and business
            powered by community, technology, and trust.
          </p>
        </div>
      </section>



      {/* ── MISSION ── */}
      <section className="pub-section" style={{ background: '#f8fafc', padding: '96px 24px' }}>
        <div
          className="container"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '64px',
            alignItems: 'center',
          }}
        >
          {/* Text */}
          <div className="animate-in">
            <span className="section-tag">Our Mission</span>
            <h2
              className="section-title"
              style={{ fontFamily: 'var(--font-family-display)', marginTop: '12px', marginBottom: '20px' }}
            >
              Clean Water for Every Home
            </h2>
            <p className="section-sub" style={{ marginBottom: '20px' }}>
              Many people in Dirty South struggle with water shortage and further confuse and unreliable access to clean drinking water.
              AquaShare was founded to change that, not through charity, but through smart community infrastructure
              that connects people who need water with trusted, local suppliers who can deliver it.
            </p>
            <p style={{ color: '#475569', lineHeight: 1.75, fontSize: '1rem' }}>
              We believe consitent availability of clean water isn't a luxury, it's a right. Our platform removes the middlemen,
              The stress of serachin trusted suppliers
              eliminates price gouging, and creates a transparent marketplace where quality and affordability
              coexist. Every order placed on AquaShare contributes to a fairer, more resilient water ecosystem
              for the whole community.
            </p>
          </div>

          {/* Visual card */}
          <div
            className="animate-fade"
            style={{
              background: 'linear-gradient(135deg, #003a63, #009CFF)',
              borderRadius: 'var(--radius-xl, 20px)',
              padding: '48px 40px',
              color: '#fff',
              boxShadow: 'var(--shadow-lg, 0 20px 60px rgba(0,156,255,0.25))',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '-30px',
                right: '-30px',
                width: '160px',
                height: '160px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.07)',
              }}
            />
            <div style={{ fontSize: '3.5rem', marginBottom: '20px' }}>🌊</div>
            <h3
              style={{
                fontFamily: 'var(--font-family-display)',
                fontSize: '1.6rem',
                fontWeight: 700,
                marginBottom: '14px',
              }}
            >
              Water is Life
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.82)', lineHeight: 1.7 }}>
              We're not just delivering water, we're delivering peace of mind, health, and community resilience.
              Every drop matters, and every delivery counts.
            </p>
            <div
              style={{
                marginTop: '28px',
                paddingTop: '24px',
                borderTop: '1px solid rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '0.92rem',
                color: 'rgba(255,255,255,0.75)',
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>✅</span> Certified &amp; vetted suppliers only
            </div>
            <div
              style={{
                marginTop: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '0.92rem',
                color: 'rgba(255,255,255,0.75)',
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>✅</span> Transparent, community-driven pricing
            </div>
            <div
              style={{
                marginTop: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '0.92rem',
                color: 'rgba(255,255,255,0.75)',
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>✅</span> Real-time tracking &amp; support
            </div>
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="pub-section" style={{ background: '#fff', padding: '96px 24px' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="section-tag">What We Stand For</span>
          <h2
            className="section-title"
            style={{ fontFamily: 'var(--font-family-display)', marginTop: '12px', marginBottom: '16px' }}
          >
            Our Core Values
          </h2>
          <p className="section-sub" style={{ maxWidth: '560px', margin: '0 auto 56px' }}>
            Three pillars guide every decision we make, from the suppliers we onboard to the features we build.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '28px',
            }}
          >
            {values.map((v, i) => (
              <div
                key={v.title}
                className="card animate-in"
                style={{
                  padding: '44px 32px',
                  borderRadius: 'var(--radius-xl, 20px)',
                  border: '1px solid #e8f4ff',
                  textAlign: 'center',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  cursor: 'default',
                  animationDelay: `${i * 0.12}s`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = '0 20px 50px rgba(0,156,255,0.14)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '';
                }}
              >
                <div
                  style={{
                    width: '76px',
                    height: '76px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #e8f4ff, #cce8ff)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2.2rem',
                    margin: '0 auto 24px',
                  }}
                >
                  {v.icon}
                </div>
                <h3
                  style={{
                    fontFamily: 'var(--font-family-display)',
                    fontSize: '1.35rem',
                    fontWeight: 700,
                    color: '#003a63',
                    marginBottom: '14px',
                  }}
                >
                  {v.title}
                </h3>
                <p style={{ color: '#475569', lineHeight: 1.75, fontSize: '0.97rem' }}>{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STORY ── */}
      <section className="pub-section" style={{ background: '#f8fafc', padding: '96px 24px' }}>
        <div className="container" style={{ maxWidth: '820px', margin: '0 auto', textAlign: 'center' }}>
          <span className="section-tag">How It Started</span>
          <h2
            className="section-title"
            style={{ fontFamily: 'var(--font-family-display)', marginTop: '12px', marginBottom: '24px' }}
          >
            The AquaShare Story
          </h2>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              textAlign: 'left',
              background: '#fff',
              border: '1px solid #dde8f5',
              borderRadius: 'var(--radius-xl, 20px)',
              padding: '48px',
              boxShadow: '0 4px 24px rgba(0,60,100,0.06)',
            }}
          >
            <p style={{ color: '#334155', lineHeight: 1.85, fontSize: '1.05rem' }}>
              AquaShare was developed by Six final year students from the university of buea in the department of computer science.

              The idea for AquaShare was inspired by the daily struggles faced by residents who
              needed water but did not know where to find reliable suppliers. The founders observed
              that while technology had transformed transportation, food delivery, and online shopping,
              there was still no centralized platform connecting water consumers with water suppliers.
            </p>
            <p style={{ color: '#334155', lineHeight: 1.85, fontSize: '1.05rem' }}>
              So they built AquaShare, a platform where customers could browse certified local suppliers, compare
              pricing, read real reviews, and place orders in minutes. Suppliers gained a fair, digital storefront
              to reach more customers without expensive marketing.
            </p>
            <p style={{ color: '#334155', lineHeight: 1.85, fontSize: '1.05rem' }}>
              AquaShare is still early in its journey, but already making a meaningful difference, powered by
              a community that believes clean water and transparency go hand in hand. We're just getting started.
            </p>

            <div
              style={{
                marginTop: '8px',
                paddingTop: '24px',
                borderTop: '1px solid #e8f4ff',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
              }}
            >
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #009CFF, #003a63)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.6rem',
                  flexShrink: 0,
                }}
              >

              </div>
              <div>
                <div style={{ fontWeight: 700, color: '#003a63', fontSize: '1rem' }}>The AquaShare Team</div>
                <div style={{ color: '#64748b', fontSize: '0.88rem' }}>Founded 2026 · Community-first, always</div>
              </div>
            </div>
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
            top: '-60px',
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
            Ready to Start?
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
            Join the Water Revolution
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
            Households already enjoy clean, affordable water delivered on their schedule.
            Sign up today. It takes less than 2 minutes.
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
                Get Started Free
              </button>
            </Link>
            <Link to="/services">
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
                Explore Services
              </button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
