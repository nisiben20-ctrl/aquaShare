import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { user as userApi } from '../services/api';
import {
  FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaLandmark, FaSave,
  FaLock, FaEye, FaEyeSlash, FaCheckCircle, FaShieldAlt, FaCamera
} from 'react-icons/fa';

export default function Profile() {
  const { user, profile, role, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Avatar
  const [avatarUrl, setAvatarUrl] = useState(null);
  const fileInputRef = useRef(null);

  // Profile form — pre-populate from context
  const [profileForm, setProfileForm] = useState({
    full_name: user?.full_name || '',
    phone:     user?.phone     || '',
    email:     user?.email     || '',
    address:   role === 'resident' ? 'Dirty south' : (profile?.address || user?.address || ''),
    landmark:  profile?.landmark || '',
  });

  // Password form
  const [passwordForm, setPasswordForm] = useState({ current: '', newPass: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);

  const handleProfileChange = (e) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
    setSuccess('');
    setError('');
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
    setSuccess('');
    setError('');
  };

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setAvatarUrl(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const payload = {
        full_name: profileForm.full_name,
        phone:     profileForm.phone,
        email:     profileForm.email,
        landmark:  profileForm.landmark,
      };
      // Only include address for suppliers (residents are forced server-side anyway)
      if (role !== 'resident') {
        payload.address = profileForm.address;
      }

      const res = await userApi.createProfile(payload);
      if (res.error) {
        setError(res.error.message || 'Failed to save profile');
      } else {
        updateProfile(res.data?.profile || profile, res.data?.user || null);
        // Refresh local form with saved values
        if (res.data?.user) {
          setProfileForm(prev => ({
            ...prev,
            full_name: res.data.user.full_name || prev.full_name,
            phone:     res.data.user.phone     || prev.phone,
            email:     res.data.user.email     || prev.email,
          }));
        }
        setSuccess('Profile updated successfully!');
      }
    } catch {
      setError('Network error — please try again');
    } finally {
      setSaving(false);
    }
  };

  const savePassword = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!passwordForm.current || !passwordForm.newPass) return setError('All fields are required');
    if (passwordForm.newPass.length < 6) return setError('New password must be at least 6 characters');
    if (passwordForm.newPass !== passwordForm.confirm) return setError('New passwords do not match');
    setSuccess('Password updated successfully!');
    setPasswordForm({ current: '', newPass: '', confirm: '' });
  };

  const initials = user?.full_name
    ? user.full_name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  const tabs = [
    { key: 'profile',  label: 'Profile Settings', icon: FaUser },
    { key: 'password', label: 'Account Security',  icon: FaShieldAlt },
  ];

  return (
    <div className="animate-in">
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--gray-900)', marginBottom: '8px' }}>
          Account Settings
        </h1>
        <p style={{ color: 'var(--gray-500)', fontSize: '1rem' }}>
          Manage your personal profile and security preferences.
        </p>
      </div>

      {/* ── Profile Header Card — fully white ─────────────────── */}
      <div style={{
        background: 'var(--white)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--gray-100)',
        boxShadow: 'var(--shadow-2)',
        overflow: 'hidden',
        marginBottom: '24px',
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '36px 24px 28px',
          position: 'relative',
        }}>

          {/* Avatar with upload overlay */}
          <div
            style={{ position: 'relative', cursor: 'pointer', marginBottom: '18px' }}
            onClick={handleAvatarClick}
          >
            {avatarUrl ? (
              <div style={{
                width: '120px', height: '120px', borderRadius: '50%',
                border: '4px solid var(--primary-100)', boxShadow: 'var(--shadow-2)',
                overflow: 'hidden', background: 'var(--gray-200)',
              }}>
                <img src={avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ) : (
              <div className="avatar" style={{
                width: '120px', height: '120px', fontSize: '2.2rem', fontWeight: 800,
                border: '4px solid var(--primary-100)', boxShadow: 'var(--shadow-2)',
                background: 'linear-gradient(135deg, var(--primary-400), var(--primary-700))',
              }}>
                {initials}
              </div>
            )}

            {/* Camera overlay */}
            <div style={{
              position: 'absolute', bottom: '4px', right: '4px',
              width: '34px', height: '34px', borderRadius: '50%',
              background: 'var(--primary-500)', border: '2px solid var(--white)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: 'var(--shadow-1)',
            }}>
              <FaCamera size={13} color="#fff" />
            </div>

            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: 'none' }} />
          </div>

          {/* Name & role badge */}
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '6px', color: 'var(--gray-900)', textAlign: 'center' }}>
            {user?.full_name || 'No name set'}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', marginBottom: '14px' }}>
            <span className="text-sm text-muted" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FaEnvelope size={13} color="var(--primary-500)" /> {user?.email || 'No email provided'}
            </span>
            <span className="text-sm text-muted" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FaPhone size={13} color="var(--primary-500)" /> {user?.phone || 'No phone provided'}
            </span>
          </div>
          <span className="chip" style={{
            textTransform: 'capitalize',
            background: 'var(--primary-50)', color: 'var(--primary-700)',
            padding: '6px 18px', fontSize: '.8125rem', fontWeight: 600,
            border: '1px solid var(--primary-100)',
          }}>
            {role} Account
          </span>
        </div>
      </div>

      {/* ── Tabs & Form ───────────────────────────────────────── */}
      <div className="card">
        <div className="tabs">
          {tabs.map(tab => (
            <button
              key={tab.key}
              className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => { setActiveTab(tab.key); setError(''); setSuccess(''); }}
            >
              <tab.icon size={16} /> {tab.label}
            </button>
          ))}
        </div>

        <div style={{ padding: '8px 0' }}>
          {/* Feedback */}
          {success && (
            <div className="alert alert-success">
              <FaCheckCircle size={18} /> {success}
            </div>
          )}
          {error && (
            <div className="alert alert-error">
              <span>⚠</span> {error}
            </div>
          )}

          {/* ── Profile Tab ─────────────────────────────────── */}
          {activeTab === 'profile' && (
            <form onSubmit={saveProfile} className="animate-fade" style={{ maxWidth: '600px' }}>

              {/* Full Name */}
              <div className="form-group">
                <label className="form-label" htmlFor="profile-fullname">Full Name</label>
                <div style={{ position: 'relative' }}>
                  <FaUser size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
                  <input
                    id="profile-fullname"
                    className="form-input"
                    name="full_name"
                    type="text"
                    placeholder="Your full name"
                    value={profileForm.full_name}
                    onChange={handleProfileChange}
                    style={{ paddingLeft: '42px' }}
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="form-group">
                <label className="form-label" htmlFor="profile-phone">Phone Number</label>
                <div style={{ position: 'relative' }}>
                  <FaPhone size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
                  <input
                    id="profile-phone"
                    className="form-input"
                    name="phone"
                    type="tel"
                    placeholder="Your phone number"
                    value={profileForm.phone}
                    onChange={handleProfileChange}
                    style={{ paddingLeft: '42px' }}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="form-group">
                <label className="form-label" htmlFor="profile-email">Email Address</label>
                <div style={{ position: 'relative' }}>
                  <FaEnvelope size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
                  <input
                    id="profile-email"
                    className="form-input"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={profileForm.email}
                    onChange={handleProfileChange}
                    style={{ paddingLeft: '42px' }}
                  />
                </div>
              </div>

              {/* Address — residents see fixed value, suppliers can edit */}
              <div className="form-group">
                <label className="form-label" htmlFor="profile-address">
                  {role === 'resident' ? 'Your Location' : 'Business / Delivery Address'}
                </label>
                <div style={{ position: 'relative' }}>
                  <FaMapMarkerAlt size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
                  <input
                    id="profile-address"
                    className="form-input"
                    name="address"
                    type="text"
                    placeholder="Your address"
                    value={role === 'resident' ? 'Dirty south' : profileForm.address}
                    onChange={handleProfileChange}
                    disabled={role === 'resident'}
                    style={{
                      paddingLeft: '42px',
                      backgroundColor: role === 'resident' ? 'var(--gray-50)' : undefined,
                      color: role === 'resident' ? 'var(--gray-500)' : undefined,
                    }}
                  />
                </div>
                {role === 'resident' && (
                  <span className="form-hint">Location is fixed for resident accounts.</span>
                )}
              </div>

              {/* Landmark */}
              <div className="form-group">
                <label className="form-label" htmlFor="profile-landmark">Nearby Landmark</label>
                <div style={{ position: 'relative' }}>
                  <FaLandmark size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
                  <input
                    id="profile-landmark"
                    className="form-input"
                    name="landmark"
                    type="text"
                    placeholder="E.g. Behind Total Station"
                    value={profileForm.landmark}
                    onChange={handleProfileChange}
                    style={{ paddingLeft: '42px' }}
                  />
                </div>
                <span className="form-hint">Helps suppliers find your location easily.</span>
              </div>

              <div style={{ marginTop: '32px' }}>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? (
                    <>
                      <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2, borderColor: 'rgba(255,255,255,.3)', borderTopColor: '#fff' }} />
                      Saving…
                    </>
                  ) : (
                    <><FaSave size={16} /> Save Changes</>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* ── Password Tab ─────────────────────────────────── */}
          {activeTab === 'password' && (
            <form onSubmit={savePassword} className="animate-fade" style={{ maxWidth: '600px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="pass-current">Current Password</label>
                <div style={{ position: 'relative' }}>
                  <FaLock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
                  <input
                    id="pass-current"
                    className="form-input"
                    type={showPass ? 'text' : 'password'}
                    name="current"
                    placeholder="Enter current password"
                    value={passwordForm.current}
                    onChange={handlePasswordChange}
                    style={{ paddingLeft: '42px', paddingRight: '44px' }}
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-400)', padding: '4px', display: 'flex' }}>
                    {showPass ? <FaEyeSlash size={17} /> : <FaEye size={17} />}
                  </button>
                </div>
              </div>

              <div className="divider" style={{ margin: '24px 0' }} />

              <div className="form-group">
                <label className="form-label" htmlFor="pass-new">New Password</label>
                <input id="pass-new" className="form-input" type={showPass ? 'text' : 'password'} name="newPass" placeholder="At least 6 characters" value={passwordForm.newPass} onChange={handlePasswordChange} />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="pass-confirm">Confirm New Password</label>
                <input id="pass-confirm" className="form-input" type={showPass ? 'text' : 'password'} name="confirm" placeholder="Re-enter new password" value={passwordForm.confirm} onChange={handlePasswordChange} />
              </div>

              <div style={{ marginTop: '32px' }}>
                <button type="submit" className="btn btn-primary">
                  <FaShieldAlt size={16} /> Update Password
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
