import React, { useState } from 'react';
import PublicNavbar from '../components/PublicNavbar';
import Footer from '../components/Footer';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required.';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required.';
    if (!formData.message.trim()) newErrors.message = 'Message is required.';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1400);
  };

  const contactInfoItems = [
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      ),
      label: 'Our Address',
      value: 'Buea Molyko',
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.73a16 16 0 0 0 6.36 6.36l1.57-1.57a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      ),
      label: 'Phone Number',
      value: '+237 679629849 | 682855741',
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      ),
      label: 'Email Address',
      value: 'velmaaliembom@gmail.com',
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
      label: 'Working Hours',
      value: '24/7',
    },
  ];

  const socialLinks = [
    {
      name: 'Twitter / X',
      href: 'https://twitter.com/aquashare',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      name: 'Facebook',
      href: 'https://facebook.com/aquashare',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      name: 'Instagram',
      href: 'https://instagram.com/aquashare',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
        </svg>
      ),
    },
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com/company/aquashare',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
  ];

  const inputStyle = (hasError) => ({
    width: '100%',
    padding: '13px 16px',
    border: hasError ? '1.5px solid #e53935' : '1.5px solid #dce8f5',
    borderRadius: '10px',
    fontFamily: "'Open Sans', sans-serif",
    fontSize: '0.96rem',
    color: '#003a63',
    background: '#f8fbff',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxSizing: 'border-box',
  });

  const labelStyle = {
    display: 'block',
    fontFamily: "'Open Sans', sans-serif",
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#003a63',
    marginBottom: '6px',
  };

  const errorStyle = {
    fontFamily: "'Open Sans', sans-serif",
    fontSize: '0.8rem',
    color: '#e53935',
    marginTop: '4px',
    display: 'block',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f9ff', display: 'flex', flexDirection: 'column' }}>
      <PublicNavbar />

      {/* Hero Banner */}
      <section
        style={{
          background: 'linear-gradient(135deg, #003a63 0%, #005a9a 55%, #009CFF 100%)',
          padding: '100px 24px 80px',
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
            width: '350px',
            height: '350px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.04)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-100px',
            left: '-100px',
            width: '450px',
            height: '450px',
            borderRadius: '50%',
            background: 'rgba(0,156,255,0.07)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <span
            style={{
              background: 'rgba(0,156,255,0.2)',
              color: '#7dd4ff',
              border: '1px solid rgba(0,156,255,0.35)',
              marginBottom: '20px',
              display: 'inline-block',
              padding: '6px 18px',
              borderRadius: '20px',
              fontSize: '0.82rem',
              fontFamily: "'Open Sans', sans-serif",
              fontWeight: '600',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            We'd Love to Hear From You
          </span>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
              fontWeight: '700',
              color: '#ffffff',
              margin: '0 0 18px',
              lineHeight: '1.2',
            }}
          >
            Get In Touch
          </h1>
          <p
            style={{
              fontFamily: "'Open Sans', sans-serif",
              fontSize: '1.1rem',
              color: 'rgba(255,255,255,0.78)',
              maxWidth: '520px',
              margin: '0 auto',
              lineHeight: '1.7',
            }}
          >
            Have a question, partnership inquiry, or just want to say hello? Our team is ready to help you.
          </p>
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '48px',
            background: '#f5f9ff',
            clipPath: 'ellipse(55% 100% at 50% 100%)',
          }}
        />
      </section>

      {/* Main Content */}
      <section style={{ flex: 1, padding: '70px 24px 80px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

          {/* Two-column layout */}
          <div
            className="contact-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '40px',
              alignItems: 'start',
            }}
          >
            {/* LEFT: Contact Info */}
            <div>
              <div style={{ marginBottom: '32px' }}>
                <span
                  style={{
                    fontFamily: "'Open Sans', sans-serif",
                    fontWeight: '700',
                    fontSize: '0.8rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: '#009CFF',
                  }}
                >
                  Contact Details
                </span>
                <h2
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 'clamp(1.6rem, 3vw, 2.1rem)',
                    fontWeight: '700',
                    color: '#003a63',
                    margin: '10px 0 12px',
                  }}
                >
                  Talk to Our Team
                </h2>
                <p
                  style={{
                    fontFamily: "'Open Sans', sans-serif",
                    fontSize: '0.97rem',
                    color: '#5a7285',
                    lineHeight: '1.7',
                    margin: 0,
                  }}
                >
                  Whether you're a resident, supplier, or partner — we're here to listen. Reach out through any of the channels below.
                </p>
              </div>

              {/* Info items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {contactInfoItems.map((item) => (
                  <div
                    key={item.label}
                    className="contact-info-item"
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '16px',
                      background: '#fff',
                      borderRadius: '14px',
                      padding: '20px 22px',
                      boxShadow: '0 2px 16px rgba(0,60,100,0.07)',
                      border: '1px solid #e4eefc',
                    }}
                  >
                    <div
                      style={{
                        flexShrink: 0,
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #e8f5ff 0%, #cce8ff 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#009CFF',
                      }}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <div
                        style={{
                          fontFamily: "'Open Sans', sans-serif",
                          fontSize: '0.8rem',
                          fontWeight: '700',
                          color: '#009CFF',
                          textTransform: 'uppercase',
                          letterSpacing: '0.07em',
                          marginBottom: '4px',
                        }}
                      >
                        {item.label}
                      </div>
                      <div
                        style={{
                          fontFamily: "'Open Sans', sans-serif",
                          fontSize: '0.95rem',
                          color: '#2c4a60',
                          lineHeight: '1.6',
                          whiteSpace: 'pre-line',
                        }}
                      >
                        {item.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Social Links */}
              <div style={{ marginTop: '36px' }}>
                <p
                  style={{
                    fontFamily: "'Open Sans', sans-serif",
                    fontSize: '0.88rem',
                    fontWeight: '700',
                    color: '#003a63',
                    textTransform: 'uppercase',
                    letterSpacing: '0.07em',
                    marginBottom: '14px',
                  }}
                >
                  Follow Us
                </p>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={social.name}
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        background: '#fff',
                        border: '1.5px solid #dce8f5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#009CFF',
                        textDecoration: 'none',
                        transition: 'all 0.2s',
                        boxShadow: '0 2px 8px rgba(0,60,100,0.06)',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = '#009CFF';
                        e.currentTarget.style.color = '#fff';
                        e.currentTarget.style.borderColor = '#009CFF';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,156,255,0.3)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = '#fff';
                        e.currentTarget.style.color = '#009CFF';
                        e.currentTarget.style.borderColor = '#dce8f5';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,60,100,0.06)';
                      }}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT: Contact Form */}
            <div
              style={{
                background: '#fff',
                borderRadius: '20px',
                padding: '40px 36px',
                boxShadow: '0 8px 40px rgba(0,60,100,0.10)',
                border: '1px solid #e0eefc',
              }}
            >
              {submitted ? (
                /* Success State */
                <div
                  style={{
                    textAlign: 'center',
                    padding: '40px 20px',
                  }}
                >
                  <div
                    style={{
                      width: '72px',
                      height: '72px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #e8f5ff 0%, #cce8ff 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 24px',
                    }}
                  >
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#009CFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  </div>
                  <h3
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: '1.7rem',
                      fontWeight: '700',
                      color: '#003a63',
                      marginBottom: '12px',
                    }}
                  >
                    Message Sent!
                  </h3>
                  <p
                    style={{
                      fontFamily: "'Open Sans', sans-serif",
                      fontSize: '0.97rem',
                      color: '#5a7285',
                      lineHeight: '1.7',
                      marginBottom: '28px',
                    }}
                  >
                    Thank you for reaching out. Our team will get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    style={{
                      background: 'transparent',
                      color: '#009CFF',
                      border: '2px solid #009CFF',
                      borderRadius: '10px',
                      padding: '11px 28px',
                      fontFamily: "'Open Sans', sans-serif",
                      fontWeight: '700',
                      fontSize: '0.95rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#009CFF'; e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#009CFF'; }}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                /* Form */
                <>
                  <div style={{ marginBottom: '28px' }}>
                    <h2
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: '1.7rem',
                        fontWeight: '700',
                        color: '#003a63',
                        margin: '0 0 8px',
                      }}
                    >
                      Send Us a Message
                    </h2>
                    <p
                      style={{
                        fontFamily: "'Open Sans', sans-serif",
                        fontSize: '0.9rem',
                        color: '#7a94a8',
                        margin: 0,
                      }}
                    >
                      Fill out the form below and we'll respond promptly.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} noValidate>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                      {/* Name */}
                      <div>
                        <label htmlFor="name" style={labelStyle}>
                          Full Name <span style={{ color: '#e53935' }}>*</span>
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          placeholder="Jane Doe"
                          value={formData.name}
                          onChange={handleChange}
                          style={inputStyle(!!errors.name)}
                          onFocus={e => { e.target.style.borderColor = '#009CFF'; e.target.style.boxShadow = '0 0 0 3px rgba(0,156,255,0.12)'; }}
                          onBlur={e => { e.target.style.borderColor = errors.name ? '#e53935' : '#dce8f5'; e.target.style.boxShadow = 'none'; }}
                        />
                        {errors.name && <span style={errorStyle}>{errors.name}</span>}
                      </div>

                      {/* Email */}
                      <div>
                        <label htmlFor="email" style={labelStyle}>
                          Email Address <span style={{ color: '#e53935' }}>*</span>
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          placeholder="jane@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          style={inputStyle(!!errors.email)}
                          onFocus={e => { e.target.style.borderColor = '#009CFF'; e.target.style.boxShadow = '0 0 0 3px rgba(0,156,255,0.12)'; }}
                          onBlur={e => { e.target.style.borderColor = errors.email ? '#e53935' : '#dce8f5'; e.target.style.boxShadow = 'none'; }}
                        />
                        {errors.email && <span style={errorStyle}>{errors.email}</span>}
                      </div>
                    </div>

                    {/* Subject */}
                    <div style={{ marginBottom: '16px' }}>
                      <label htmlFor="subject" style={labelStyle}>
                        Subject <span style={{ color: '#e53935' }}>*</span>
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        placeholder="e.g. Partnership Inquiry, Order Support..."
                        value={formData.subject}
                        onChange={handleChange}
                        style={inputStyle(!!errors.subject)}
                        onFocus={e => { e.target.style.borderColor = '#009CFF'; e.target.style.boxShadow = '0 0 0 3px rgba(0,156,255,0.12)'; }}
                        onBlur={e => { e.target.style.borderColor = errors.subject ? '#e53935' : '#dce8f5'; e.target.style.boxShadow = 'none'; }}
                      />
                      {errors.subject && <span style={errorStyle}>{errors.subject}</span>}
                    </div>

                    {/* Message */}
                    <div style={{ marginBottom: '24px' }}>
                      <label htmlFor="message" style={labelStyle}>
                        Your Message <span style={{ color: '#e53935' }}>*</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        placeholder="Write your message here..."
                        rows={6}
                        value={formData.message}
                        onChange={handleChange}
                        style={{
                          ...inputStyle(!!errors.message),
                          resize: 'vertical',
                          minHeight: '150px',
                        }}
                        onFocus={e => { e.target.style.borderColor = '#009CFF'; e.target.style.boxShadow = '0 0 0 3px rgba(0,156,255,0.12)'; }}
                        onBlur={e => { e.target.style.borderColor = errors.message ? '#e53935' : '#dce8f5'; e.target.style.boxShadow = 'none'; }}
                      />
                      {errors.message && <span style={errorStyle}>{errors.message}</span>}
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      style={{
                        width: '100%',
                        padding: '15px',
                        background: loading
                          ? 'rgba(0,156,255,0.6)'
                          : 'linear-gradient(135deg, #009CFF 0%, #0077cc 100%)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '10px',
                        fontFamily: "'Open Sans', sans-serif",
                        fontWeight: '700',
                        fontSize: '1rem',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        letterSpacing: '0.02em',
                        boxShadow: '0 4px 20px rgba(0,156,255,0.35)',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                      }}
                      onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,156,255,0.45)'; } }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,156,255,0.35)'; }}
                    >
                      {loading ? (
                        <>
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{ animation: 'spin 0.8s linear infinite' }}
                          >
                            <line x1="12" y1="2" x2="12" y2="6" />
                            <line x1="12" y1="18" x2="12" y2="22" />
                            <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
                            <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
                            <line x1="2" y1="12" x2="6" y2="12" />
                            <line x1="18" y1="12" x2="22" y2="12" />
                            <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
                            <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
                          </svg>
                          Sending…
                        </>
                      ) : (
                        <>
                          Send Message
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="22" y1="2" x2="11" y2="13" />
                            <polygon points="22 2 15 22 11 13 2 9 22 2" />
                          </svg>
                        </>
                      )}
                    </button>

                    <p
                      style={{
                        fontFamily: "'Open Sans', sans-serif",
                        fontSize: '0.8rem',
                        color: '#9ab0c0',
                        textAlign: 'center',
                        marginTop: '14px',
                        marginBottom: 0,
                      }}
                    >
                      We respect your privacy. Your information will never be shared.
                    </p>
                  </form>

                  <style>{`
                    @keyframes spin {
                      from { transform: rotate(0deg); }
                      to { transform: rotate(360deg); }
                    }
                  `}</style>
                </>
              )}
            </div>
          </div>

          {/* Map / Visual accent strip */}
          <div
            style={{
              marginTop: '60px',
              borderRadius: '20px',
              overflow: 'hidden',
              background: 'linear-gradient(135deg, #003a63 0%, #005a9a 60%, #009CFF 100%)',
              padding: '50px 40px',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '24px',
              boxShadow: '0 8px 40px rgba(0,60,100,0.15)',
            }}
          >
            <div>
              <h3
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '1.7rem',
                  fontWeight: '700',
                  color: '#fff',
                  margin: '0 0 10px',
                }}
              >
                Ready to Join AquaShare?
              </h3>
              <p
                style={{
                  fontFamily: "'Open Sans', sans-serif",
                  fontSize: '0.97rem',
                  color: 'rgba(255,255,255,0.78)',
                  margin: 0,
                  maxWidth: '500px',
                  lineHeight: '1.6',
                }}
              >
                Create your free account today and experience a better way to access clean water in your community.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <a
                href="/register"
                style={{
                  background: '#FF7A00',
                  color: '#fff',
                  borderRadius: '10px',
                  padding: '13px 30px',
                  fontFamily: "'Open Sans', sans-serif",
                  fontWeight: '700',
                  fontSize: '0.97rem',
                  textDecoration: 'none',
                  display: 'inline-block',
                  boxShadow: '0 4px 20px rgba(255,122,0,0.4)',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(255,122,0,0.5)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(255,122,0,0.4)'; }}
              >
                Create Account
              </a>
              <a
                href="/about"
                style={{
                  background: 'transparent',
                  color: '#fff',
                  border: '2px solid rgba(255,255,255,0.5)',
                  borderRadius: '10px',
                  padding: '13px 30px',
                  fontFamily: "'Open Sans', sans-serif",
                  fontWeight: '700',
                  fontSize: '0.97rem',
                  textDecoration: 'none',
                  display: 'inline-block',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'; }}
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
