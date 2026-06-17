import React, { useState } from 'react';
import PublicNavbar from '../components/PublicNavbar';
import Footer from '../components/Footer';

const faqs = [
  {
    question: 'What is AquaShare?',
    answer:
      'AquaShare is a community-driven water delivery platform that connects residents who need clean water with verified local water suppliers. Our mission is to make access to safe, affordable water simple, transparent, and reliable for everyone — whether you\'re in a bustling city or a rural community.',
  },
  {
    question: 'How do I find a water supplier near me?',
    answer:
      'Simply sign up or log in, then visit the "Find Suppliers" section. Enter your location or allow AquaShare to detect it automatically. You\'ll see a map and list of verified suppliers near you, complete with ratings, reviews, pricing, and available delivery windows. You can filter by distance, price, and rating to find the best match.',
  },
  {
    question: 'Is AquaShare free to use for residents?',
    answer:
      'Yes! Creating an account and browsing water suppliers on AquaShare is completely free for residents. You only pay for the water you order, directly to your chosen supplier. There are no hidden subscription fees or platform charges applied to residents.',
  },
  {
    question: 'How do I become a verified water supplier?',
    answer:
      'To become a verified supplier, head to our "Become a Supplier" page and fill out the registration form. You\'ll need to provide your business details, service area, pricing, and upload the required documentation. Our team will review your application and contact you within 2–5 business days. Once approved, your profile goes live and you can start receiving orders.',
  },
  {
    question: 'How are suppliers verified?',
    answer:
      'All suppliers go through a thorough vetting process. This includes verification of business registration, health and safety compliance certifications, water quality test results, and a review of their operational history. We also conduct periodic re-checks to ensure ongoing compliance with our quality standards. Only suppliers who meet all criteria receive the AquaShare Verified badge.',
  },
  {
    question: 'How do I place a water order?',
    answer:
      'Once you\'ve found a supplier you\'d like to use, click on their profile and select "Place Order." Choose your preferred delivery date and time slot, specify the quantity of water you need, and confirm your delivery address. You\'ll receive an order confirmation notification, and you can track your order status in real time from your dashboard.',
  },
  {
    question: 'Can I communicate with my supplier?',
    answer:
      'Absolutely. AquaShare includes a built-in messaging system that allows residents and suppliers to communicate directly within the platform. You can ask questions about your order, make special requests, or simply coordinate delivery details — all in one secure, convenient place without sharing personal contact information.',
  },
  {
    question: 'What happens if my order is rejected?',
    answer:
      'If a supplier is unable to fulfill your order, you\'ll receive an immediate notification with the reason for the rejection. Your account will not be charged. You\'re encouraged to browse other available suppliers in your area and place a new order. If you experience repeated issues, our support team is available to assist you in finding a reliable supplier.',
  },
  {
    question: 'How do I rate my supplier?',
    answer:
      'After your order has been marked as delivered, you\'ll receive a prompt in your dashboard and via email to leave a rating and review. You can score the supplier on water quality, punctuality, and service, and optionally write a short review. Your honest feedback helps the community choose the best suppliers and encourages high standards across the platform.',
  },
  {
    question: 'What areas does AquaShare currently cover?',
    answer:
      'AquaShare is currently in the Dirty South Locality of Molyko, Buea.you can register your interest and we\'ll notify you as soon as we launch nearby.',
  },
];

const FAQItem = ({ question, answer, isOpen, onToggle }) => {
  return (
    <div
      className="faq-item"
      style={{
        borderRadius: '12px',
        marginBottom: '12px',
        background: '#fff',
        boxShadow: isOpen
          ? '0 8px 32px rgba(0,156,255,0.13)'
          : '0 2px 12px rgba(0,60,100,0.07)',
        border: isOpen ? '1.5px solid #009CFF' : '1.5px solid #e8f0f7',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
      }}
    >
      <button
        className="faq-question"
        onClick={onToggle}
        aria-expanded={isOpen}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '22px 28px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          gap: '16px',
        }}
      >
        <span
          style={{
            fontFamily: "'Open Sans', sans-serif",
            fontWeight: '600',
            fontSize: '1.05rem',
            color: isOpen ? '#009CFF' : '#003a63',
            lineHeight: '1.5',
            transition: 'color 0.3s',
          }}
        >
          {question}
        </span>
        <span
          style={{
            flexShrink: 0,
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: isOpen ? '#009CFF' : '#f0f7ff',
            color: isOpen ? '#fff' : '#009CFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.4rem',
            fontWeight: '300',
            lineHeight: '1',
            transition: 'all 0.3s',
            border: isOpen ? 'none' : '1.5px solid #c8e4ff',
          }}
        >
          {isOpen ? '−' : '+'}
        </span>
      </button>

      <div
        className="faq-answer"
        style={{
          maxHeight: isOpen ? '400px' : '0',
          overflow: 'hidden',
          transition: 'max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <p
          style={{
            fontFamily: "'Open Sans', sans-serif",
            fontSize: '0.97rem',
            color: '#4a6070',
            lineHeight: '1.8',
            padding: '0 28px 24px 28px',
            margin: 0,
          }}
        >
          {answer}
        </p>
      </div>
    </div>
  );
};

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
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
        {/* Decorative circles */}
        <div
          style={{
            position: 'absolute',
            top: '-60px',
            right: '-60px',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.04)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-80px',
            left: '-80px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'rgba(0,156,255,0.08)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <span
            className="chip"
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
            Help Center
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
            Frequently Asked Questions
          </h1>
          <p
            style={{
              fontFamily: "'Open Sans', sans-serif",
              fontSize: '1.1rem',
              color: 'rgba(255,255,255,0.78)',
              maxWidth: '560px',
              margin: '0 auto',
              lineHeight: '1.7',
            }}
          >
            Everything you need to know about AquaShare — from getting started to managing your orders.
          </p>
        </div>

        {/* Wave bottom */}
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

      {/* FAQ Section */}
      <section
        className="pub-section"
        style={{
          flex: 1,
          padding: '60px 24px 80px',
        }}
      >
        <div
          className="container"
          style={{
            maxWidth: '800px',
            margin: '0 auto',
          }}
        >
          {/* Stats bar */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '40px',
              flexWrap: 'wrap',
              marginBottom: '56px',
              padding: '24px 32px',
              background: '#fff',
              borderRadius: '16px',
              boxShadow: '0 4px 24px rgba(0,60,100,0.08)',
              border: '1px solid #e0eefc',
            }}
          >
            {[
              { number: '10+', label: 'Topics Covered' },
              { number: '24/7', label: 'Support Available' },
              { number: '98%', label: 'Questions Resolved' },
            ].map((stat) => (
              <div key={stat.label} style={{ textAlign: 'center' }}>
                <div
                  className="stat-number"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '1.8rem',
                    fontWeight: '700',
                    color: '#009CFF',
                  }}
                >
                  {stat.number}
                </div>
                <div
                  className="stat-label"
                  style={{
                    fontFamily: "'Open Sans', sans-serif",
                    fontSize: '0.82rem',
                    color: '#7a94a8',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    marginTop: '2px',
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Section heading */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span className="section-tag" style={{ color: '#009CFF', fontFamily: "'Open Sans', sans-serif", fontWeight: '700', fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Common Questions
            </span>
            <h2
              className="section-title"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(1.6rem, 3vw, 2.1rem)',
                fontWeight: '700',
                color: '#003a63',
                margin: '10px 0 14px',
              }}
            >
              Find Your Answer Below
            </h2>
            <p
              className="section-sub"
              style={{
                fontFamily: "'Open Sans', sans-serif",
                fontSize: '0.97rem',
                color: '#6b849a',
                margin: 0,
              }}
            >
              Click any question to expand the answer.
            </p>
          </div>

          {/* FAQ Accordion */}
          <div>
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === index}
                onToggle={() => handleToggle(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        style={{
          background: 'linear-gradient(135deg, #003a63 0%, #005a9a 60%, #009CFF 100%)',
          padding: '80px 24px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.03)',
            pointerEvents: 'none',
          }}
        />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '600px', margin: '0 auto' }}>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
              fontWeight: '700',
              color: '#ffffff',
              margin: '0 0 16px',
            }}
          >
            Still Have Questions?
          </h2>
          <p
            style={{
              fontFamily: "'Open Sans', sans-serif",
              fontSize: '1.05rem',
              color: 'rgba(255,255,255,0.78)',
              margin: '0 0 36px',
              lineHeight: '1.7',
            }}
          >
            Our support team is available around the clock to help you. Reach out any time — we're happy to assist.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="/contact"
              className="btn btn-lg"
              style={{
                background: '#FF7A00',
                color: '#fff',
                borderRadius: '10px',
                padding: '14px 36px',
                fontFamily: "'Open Sans', sans-serif",
                fontWeight: '700',
                fontSize: '1rem',
                textDecoration: 'none',
                display: 'inline-block',
                boxShadow: '0 4px 20px rgba(255,122,0,0.4)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(255,122,0,0.5)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(255,122,0,0.4)'; }}
            >
              Contact Support
            </a>
            <a
              href="/register"
              className="btn btn-lg btn-outline-white"
              style={{
                background: 'transparent',
                color: '#fff',
                border: '2px solid rgba(255,255,255,0.5)',
                borderRadius: '10px',
                padding: '14px 36px',
                fontFamily: "'Open Sans', sans-serif",
                fontWeight: '700',
                fontSize: '1rem',
                textDecoration: 'none',
                display: 'inline-block',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'; }}
            >
              Get Started Free
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FAQPage;
