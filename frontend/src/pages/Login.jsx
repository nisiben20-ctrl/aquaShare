import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { auth } from '../services/api';
import { FaTint, FaEye, FaEyeSlash, FaEnvelope, FaLock, FaArrowRight } from 'react-icons/fa';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.email || !form.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const res = await auth.login(form.email, form.password);
      if (res.error) {
        setError(res.error.message || 'Login failed');
      } else if (res.success) {
        login(res.user, null);
        navigate('/dashboard');
      } else {
        setError('Unexpected response from server');
      }
    } catch {
      setError('Network error — please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      {/* Sidebar */}
      <div className="auth-sidebar">
        <div className="auth-sidebar-content">
          <div className="auth-logo">
            <FaTint size={60} color="rgba(186,230,253,0.9)" />
          </div>
          <h1>AquaShare</h1>
          <p>
            Connecting communities with trusted water suppliers.
            Request, track, and communicate — all in one place.
          </p>

          {/* Feature bullets */}
          <div style={{ marginTop: '40px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { emoji: '', text: 'Find verified water suppliers near you' },
              { emoji: '', text: 'Place and track requests in real time' },
              { emoji: '', text: 'Chat directly with your supplier' },
            ].map((item) => (
              <div key={item.text} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
                padding: '10px 14px', borderRadius: '10px', fontSize: '.875rem',
                color: 'rgba(255,255,255,0.85)',
              }}>
                <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>{item.emoji}</span>
                {item.text}
              </div>
            ))}
          </div>
        </div>

        {/* Animated wave */}
        <div className="auth-sidebar-wave">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ height: '60px' }}>
            <path
              d="M0,60 C200,100 400,20 600,60 C800,100 1000,20 1200,60 L1200,120 L0,120 Z"
              fill="rgba(255,255,255,0.06)"
            />
          </svg>
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ height: '60px' }}>
            <path
              d="M0,40 C150,80 350,0 600,50 C850,100 1050,10 1200,40 L1200,120 L0,120 Z"
              fill="rgba(255,255,255,0.04)"
            />
          </svg>
        </div>
      </div>

      {/* Form */}
      <div className="auth-main">
        <div className="auth-form-wrapper animate-in">
          <div className="auth-form-header">
            <h2>Welcome back !</h2>
            <p>Sign in to your AquaShare account</p>
          </div>

          {error && (
            <div className="alert alert-error">
              <span style={{ fontSize: '1rem' }}>⚠</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="login-email">Email Address</label>
              <div style={{ position: 'relative' }}>
                <FaEnvelope size={17} style={{
                  position: 'absolute', left: '14px', top: '50%',
                  transform: 'translateY(-50%)', color: 'var(--gray-400)',
                  pointerEvents: 'none',
                }} />
                <input
                  id="login-email"
                  className={`form-input ${error ? 'error' : ''}`}
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  style={{ paddingLeft: '42px' }}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="login-password">Password</label>
              <div style={{ position: 'relative' }}>
                <FaLock size={17} style={{
                  position: 'absolute', left: '14px', top: '50%',
                  transform: 'translateY(-50%)', color: 'var(--gray-400)',
                  pointerEvents: 'none',
                }} />
                <input
                  id="login-password"
                  className={`form-input ${error ? 'error' : ''}`}
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  style={{ paddingLeft: '42px', paddingRight: '44px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: '12px', top: '50%',
                    transform: 'translateY(-50%)', background: 'none',
                    border: 'none', cursor: 'pointer', color: 'var(--gray-400)',
                    padding: '4px', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'color 150ms',
                  }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FaEyeSlash size={17} /> : <FaEye size={17} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg btn-block"
              disabled={loading}
              id="login-submit-btn"
              style={{ marginTop: '8px', gap: '10px' }}
            >
              {loading ? (
                <>
                  <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2, borderColor: 'rgba(255,255,255,.3)', borderTopColor: '#fff' }} />
                  Signing in…
                </>
              ) : (
                <>
                  Sign In
                  <FaArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="auth-form-footer">
            Don&apos;t have an account?{' '}
            <Link to="/register">Create one</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
