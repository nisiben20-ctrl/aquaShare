import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../services/api';
import { FaHandHoldingWater, FaUser, FaPhone, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaChevronRight, FaCheck, FaArrowRight, FaMapMarkerAlt } from 'react-icons/fa';
import PublicNavbar from '../components/PublicNavbar';

const STEPS = ['Account Type', 'Personal Info', 'Security'];

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    role: 'resident',
    name: '',
    phone: '',
    email: '',
    address: 'Dirty south',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const nextStep = () => {
    if (step === 1) {
      if (!form.name.trim()) return setError('Full name is required');
      if (!form.phone.trim()) return setError('Phone number is required');
      if (form.role !== 'resident' && !form.address.trim()) return setError('Physical address is required');
      if (form.email && !/\S+@\S+\.\S+/.test(form.email)) return setError('Invalid email address');
    }
    setError('');
    setStep(step + 1);
  };

  const prevStep = () => {
    setError('');
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.password || form.password.length < 6) {
      return setError('Password must be at least 6 characters');
    }
    if (form.password !== form.confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);
    try {
      const res = await auth.register({
        full_name: form.name,
        phone: form.phone,
        email: form.email,
        address: form.role === 'resident' ? 'Dirty south' : form.address,
        password: form.password,
        role: form.role,
      });

      if (res.error) {
        setError(res.error.message || 'Registration failed');
      } else {
        // Success — register.php redirects to login.html, we navigate in React instead
        navigate('/login', { state: { registered: true } });
      }
    } catch {
      setError('Network error — please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout" style={{ paddingTop: '72px' }}>
      <PublicNavbar />
      {/* Sidebar */}
      <div className="auth-sidebar">
        <div className="auth-sidebar-content">
          <div className="auth-logo">
            <FaHandHoldingWater size={60} color="rgba(186,230,253,0.9)" />
          </div>
          <h1>Join AquaShare</h1>
          <p>
            Whether you need water or supply it — AquaShare brings
            your community together for reliable water access.
          </p>

          {/* Stepper */}
          <div style={{ marginTop: '48px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {STEPS.map((label, i) => (
              <div key={label} style={{
                display: 'flex', alignItems: 'center', gap: '14px',
                opacity: i <= step ? 1 : 0.35,
                transition: 'opacity 0.3s ease',
              }}>
                <div style={{
                  width: 34, height: 34, borderRadius: '50%',
                  background: i < step
                    ? 'rgba(34,211,238,0.3)'
                    : i === step
                      ? 'rgba(255,255,255,0.95)'
                      : 'rgba(255,255,255,0.08)',
                  color: i === step ? 'var(--primary-700)' : 'var(--white)',
                  border: i < step
                    ? '2px solid rgba(34,211,238,0.5)'
                    : i === step
                      ? '2px solid rgba(255,255,255,0.9)'
                      : '2px solid rgba(255,255,255,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '.8125rem', fontWeight: 700,
                  transition: 'all .3s ease',
                  flexShrink: 0,
                  boxShadow: i === step ? '0 0 0 4px rgba(255,255,255,0.1)' : 'none',
                }}>
                  {i < step ? <FaCheck size={15} /> : i + 1}
                </div>
                <div>
                  <div style={{
                    fontSize: '.9375rem',
                    fontWeight: i === step ? 700 : 500,
                    color: i === step ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.7)',
                  }}>
                    {label}
                  </div>
                  {i < step && (
                    <div style={{ fontSize: '.72rem', color: 'rgba(34,211,238,0.8)', marginTop: '1px' }}>
                      ✓ Completed
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Wave */}
        <div className="auth-sidebar-wave">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ height: '60px' }}>
            <path d="M0,60 C200,100 400,20 600,60 C800,100 1000,20 1200,60 L1200,120 L0,120 Z" fill="rgba(255,255,255,0.06)" />
          </svg>
        </div>
      </div>

      {/* Form */}
      <div className="auth-main">
        <div className="auth-form-wrapper animate-in">
          <div className="auth-form-header">
            <h2>Create your account</h2>
            <p>
              Step <strong>{step + 1}</strong> of {STEPS.length}
              <span style={{
                marginLeft: '10px', padding: '2px 10px',
                background: 'var(--primary-50)', color: 'var(--primary-600)',
                borderRadius: 'var(--radius-full)', fontSize: '.78rem', fontWeight: 600,
              }}>
                {STEPS[step]}
              </span>
            </p>
          </div>

          {/* Progress bar */}
          <div style={{
            height: '4px', background: 'var(--gray-100)', borderRadius: 'var(--radius-full)',
            marginBottom: '28px', overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${((step + 1) / STEPS.length) * 100}%`,
              background: 'linear-gradient(90deg, var(--primary-400), var(--accent-500))',
              borderRadius: 'var(--radius-full)',
              transition: 'width 0.4s cubic-bezier(.34,1.56,.64,1)',
            }} />
          </div>

          {error && (
            <div className="alert alert-error">
              <span>⚠</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* STEP 0 — Role Selection */}
            {step === 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  {
                    value: 'resident',
                    title: 'I need water',
                    desc: 'Find and request water from local suppliers.',
                    color: 'var(--primary-500)',
                  },
                  {
                    value: 'supplier',
                    title: 'I supply water',
                    desc: 'Reach residents in your area and grow your business.',
                    color: 'var(--accent-500)',
                  },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    id={`role-${opt.value}`}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '16px',
                      padding: '18px 20px', borderRadius: 'var(--radius-lg)',
                      border: `2px solid ${form.role === opt.value ? 'var(--primary-400)' : 'var(--gray-200)'}`,
                      background: form.role === opt.value ? 'var(--primary-50)' : 'var(--white)',
                      cursor: 'pointer',
                      transition: 'all .2s ease',
                      boxShadow: form.role === opt.value ? '0 0 0 3px rgba(14,165,233,0.1)' : 'none',
                    }}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={opt.value}
                      checked={form.role === opt.value}
                      onChange={handleChange}
                      style={{ display: 'none' }}
                    />
                    <span style={{
                      fontSize: '2rem', lineHeight: 1,
                      background: form.role === opt.value ? 'var(--primary-100)' : 'var(--gray-100)',
                      borderRadius: 'var(--radius-md)', padding: '10px',
                      transition: 'background .2s',
                    }}>
                      {opt.icon}
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '3px', color: 'var(--gray-900)' }}>
                        {opt.title}
                      </div>
                      <div style={{ fontSize: '.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                        {opt.desc}
                      </div>
                    </div>
                    <div style={{
                      width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                      border: `2.5px solid ${form.role === opt.value ? 'var(--primary-500)' : 'var(--gray-300)'}`,
                      background: form.role === opt.value ? 'var(--primary-500)' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all .2s',
                    }}>
                      {form.role === opt.value && <FaCheck size={13} color="white" strokeWidth={3} />}
                    </div>
                  </label>
                ))}

                <button
                  type="button"
                  className="btn btn-primary rounded-pill w-100 py-3"
                  onClick={nextStep}
                  style={{ marginTop: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                  id="register-next-step-0"
                >
                  Continue <FaChevronRight size={18} />
                </button>
              </div>
            )}

            {/* STEP 1 — Personal Info */}
            {step === 1 && (
              <div>
                <div className="form-group">
                  <label className="form-label" htmlFor="reg-name">Full Name *</label>
                  <div style={{ position: 'relative' }}>
                    <FaUser size={17} style={{
                      position: 'absolute', left: '14px', top: '50%',
                      transform: 'translateY(-50%)', color: 'var(--gray-400)', pointerEvents: 'none',
                    }} />
                    <input
                      id="reg-name"
                      className="form-input"
                      type="text"
                      name="name"
                      placeholder="John Doe"
                      value={form.name}
                      onChange={handleChange}
                      style={{ paddingLeft: '42px' }}
                      autoFocus
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="reg-phone">Phone Number *</label>
                  <div style={{ position: 'relative' }}>
                    <FaPhone size={17} style={{
                      position: 'absolute', left: '14px', top: '50%',
                      transform: 'translateY(-50%)', color: 'var(--gray-400)', pointerEvents: 'none',
                    }} />
                    <input
                      id="reg-phone"
                      className="form-input"
                      type="tel"
                      name="phone"
                      placeholder="675 204 747"
                      value={form.phone}
                      onChange={handleChange}
                      style={{ paddingLeft: '42px' }}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="reg-email">
                    Email Address
                    <span style={{ fontWeight: 400, color: 'var(--gray-400)', marginLeft: '6px' }}>(Optional)</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <FaEnvelope size={17} style={{
                      position: 'absolute', left: '14px', top: '50%',
                      transform: 'translateY(-50%)', color: 'var(--gray-400)', pointerEvents: 'none',
                    }} />
                    <input
                      id="reg-email"
                      className="form-input"
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={handleChange}
                      style={{ paddingLeft: '42px' }}
                    />
                  </div>
                  <span className="form-hint">Recommended for account recovery</span>
                </div>

                {form.role === 'supplier' && (
                  <div className="form-group">
                    <label className="form-label" htmlFor="reg-address">Physical Address *</label>
                    <div style={{ position: 'relative' }}>
                      <FaMapMarkerAlt size={17} style={{
                        position: 'absolute', left: '14px', top: '50%',
                        transform: 'translateY(-50%)', color: 'var(--gray-400)', pointerEvents: 'none',
                      }} />
                      <input
                        id="reg-address"
                        className="form-input"
                        type="text"
                        name="address"
                        placeholder="e.g. Molyko, Buea"
                        value={form.address}
                        onChange={handleChange}
                        style={{ paddingLeft: '42px' }}
                      />
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                  <button type="button" className="btn btn-secondary rounded-pill py-3 px-4" onClick={prevStep} id="register-back-1">
                    Back
                  </button>
                  <button type="button" className="btn btn-primary rounded-pill w-100 py-3" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }} onClick={nextStep} id="register-next-step-1">
                    Continue <FaChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2 — Password */}
            {step === 2 && (
              <div>
                <div className="form-group">
                  <label className="form-label" htmlFor="reg-password">Create Password *</label>
                  <div style={{ position: 'relative' }}>
                    <FaLock size={17} style={{
                      position: 'absolute', left: '14px', top: '50%',
                      transform: 'translateY(-50%)', color: 'var(--gray-400)', pointerEvents: 'none',
                    }} />
                    <input
                      id="reg-password"
                      className="form-input"
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="At least 6 characters"
                      value={form.password}
                      onChange={handleChange}
                      style={{ paddingLeft: '42px', paddingRight: '44px' }}
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute', right: '12px', top: '50%',
                        transform: 'translateY(-50%)', background: 'none',
                        border: 'none', cursor: 'pointer', color: 'var(--gray-400)',
                        padding: '4px', display: 'flex',
                      }}
                    >
                      {showPassword ? <FaEyeSlash size={17} /> : <FaEye size={17} />}
                    </button>
                  </div>

                  {/* Password strength indicator */}
                  {form.password && (
                    <div style={{ marginTop: '8px' }}>
                      <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                        {[1, 2, 3].map((n) => (
                          <div key={n} style={{
                            height: '3px', flex: 1, borderRadius: '99px',
                            background: form.password.length >= n * 3
                              ? (n === 1 ? '#f59e0b' : n === 2 ? '#3b82f6' : '#16a34a')
                              : 'var(--gray-200)',
                            transition: 'background 0.3s',
                          }} />
                        ))}
                      </div>
                      <span style={{ fontSize: '.72rem', color: 'var(--gray-400)' }}>
                        {form.password.length < 3 ? 'Weak' : form.password.length < 6 ? 'Fair' : 'Strong'} password
                      </span>
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="reg-confirm-password">Confirm Password *</label>
                  <div style={{ position: 'relative' }}>
                    <FaLock size={17} style={{
                      position: 'absolute', left: '14px', top: '50%',
                      transform: 'translateY(-50%)', color: 'var(--gray-400)', pointerEvents: 'none',
                    }} />
                    <input
                      id="reg-confirm-password"
                      className="form-input"
                      type={showPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      placeholder="Re-enter your password"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      style={{
                        paddingLeft: '42px',
                        borderColor: form.confirmPassword && form.password !== form.confirmPassword
                          ? 'var(--error)' : undefined,
                      }}
                    />
                    {form.confirmPassword && form.password === form.confirmPassword && (
                      <FaCheck size={16} style={{
                        position: 'absolute', right: '14px', top: '50%',
                        transform: 'translateY(-50%)', color: 'var(--success)',
                      }} />
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                  <button type="button" className="btn btn-secondary rounded-pill py-3 px-4" onClick={prevStep} id="register-back-2">
                    Back
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary rounded-pill w-100 py-3"
                    disabled={loading}
                    id="register-submit-btn"
                    style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                  >
                    {loading ? (
                      <>
                        <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2, borderColor: 'rgba(255,255,255,.3)', borderTopColor: '#fff' }} />
                        Creating…
                      </>
                    ) : (
                      <>Create Account <FaArrowRight size={17} /></>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>

          <div className="auth-form-footer">
            Already have an account?{' '}
            <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
