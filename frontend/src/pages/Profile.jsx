import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { user as userApi } from '../services/api';
import {
  FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaLandmark, FaSave, FaLock, FaEye, FaEyeSlash, FaCheckCircle, FaShieldAlt
} from 'react-icons/fa';

export default function Profile() {
  const { user, profile, role, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Profile form
  const [profileForm, setProfileForm] = useState({
    address: profile?.address || '',
    landmark: profile?.landmark || '',
  });

  // Password form
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    newPass: '',
    confirm: '',
  });
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

  const saveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const res = await userApi.createProfile({
        address: profileForm.address,
        landmark: profileForm.landmark,
      });
      if (res.error) {
        setError(res.error.message || 'Failed to save profile');
      } else {
        updateProfile({ ...profile, ...profileForm });
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
    if (!passwordForm.current || !passwordForm.newPass) {
      return setError('All fields are required');
    }
    if (passwordForm.newPass.length < 6) {
      return setError('New password must be at least 6 characters');
    }
    if (passwordForm.newPass !== passwordForm.confirm) {
      return setError('New passwords do not match');
    }
    setSuccess('Password updated successfully!');
    setPasswordForm({ current: '', newPass: '', confirm: '' });
  };

  const initials = user?.full_name
    ? user.full_name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  const tabs = [
    { key: 'profile', label: 'Profile Settings', icon: FaUser },
    { key: 'password', label: 'Account Security', icon: FaShieldAlt },
  ];

  return (
    <div className="animate-in">
      <div className="page-welcome">
        <h2>Account Settings</h2>
        <p>Manage your personal profile and security preferences.</p>
      </div>

      {/* User Info Header Card */}
      <div className="profile-card">
        <div className="profile-banner"></div>
        <div className="profile-card-body">
          <div className="profile-avatar-wrapper">
            <div className="avatar avatar-lg">
              {initials}
            </div>
          </div>
          <div style={{ paddingBottom: '8px', flex: 1 }}>
            <h3 style={{ fontSize: '1.375rem', marginBottom: '4px' }}>{user?.full_name}</h3>
            <div className="text-sm text-muted" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FaEnvelope size={14} color="var(--primary-500)" /> {user?.email || 'No email provided'}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FaPhone size={14} color="var(--primary-500)" /> {user?.phone || 'No phone provided'}
              </span>
            </div>
          </div>
          <div style={{ paddingBottom: '12px' }}>
            <span className="chip" style={{ textTransform: 'capitalize', background: 'var(--gray-100)', color: 'var(--gray-700)', padding: '6px 14px', fontSize: '.8125rem' }}>
              {role} Account
            </span>
          </div>
        </div>
      </div>

      <div className="card">
        {/* Tabs */}
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

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <form onSubmit={saveProfile} className="animate-fade" style={{ maxWidth: '600px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="profile-address">Home/Delivery Address</label>
                <div style={{ position: 'relative' }}>
                  <FaMapMarkerAlt size={17} style={{
                    position: 'absolute', left: '14px', top: '50%',
                    transform: 'translateY(-50%)', color: 'var(--gray-400)',
                  }} />
                  <input
                    id="profile-address"
                    className="form-input"
                    name="address"
                    placeholder="E.g., Molyko, Buea"
                    value={profileForm.address}
                    onChange={handleProfileChange}
                    style={{ paddingLeft: '42px' }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="profile-landmark">Nearby Landmark</label>
                <div style={{ position: 'relative' }}>
                  <FaLandmark size={17} style={{
                    position: 'absolute', left: '14px', top: '50%',
                    transform: 'translateY(-50%)', color: 'var(--gray-400)',
                  }} />
                  <input
                    id="profile-landmark"
                    className="form-input"
                    name="landmark"
                    placeholder="E.g., Behind Total Station"
                    value={profileForm.landmark}
                    onChange={handleProfileChange}
                    style={{ paddingLeft: '42px' }}
                  />
                </div>
                <span className="form-hint">This helps suppliers find your location easily.</span>
              </div>

              <div style={{ marginTop: '32px' }}>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? (
                    <>
                      <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2, borderColor: 'rgba(255,255,255,.3)', borderTopColor: '#fff' }} />
                      Saving…
                    </>
                  ) : (
                    <><FaSave size={16} /> Save Profile</>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Password Tab */}
          {activeTab === 'password' && (
            <form onSubmit={savePassword} className="animate-fade" style={{ maxWidth: '600px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="pass-current">Current Password</label>
                <div style={{ position: 'relative' }}>
                  <FaLock size={17} style={{
                    position: 'absolute', left: '14px', top: '50%',
                    transform: 'translateY(-50%)', color: 'var(--gray-400)',
                  }} />
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
                    style={{
                      position: 'absolute', right: '12px', top: '50%',
                      transform: 'translateY(-50%)', background: 'none',
                      border: 'none', cursor: 'pointer', color: 'var(--gray-400)', padding: '4px', display: 'flex'
                    }}
                  >
                    {showPass ? <FaEyeSlash size={17} /> : <FaEye size={17} />}
                  </button>
                </div>
              </div>
              
              <div className="divider" style={{ margin: '24px 0' }} />

              <div className="form-group">
                <label className="form-label" htmlFor="pass-new">New Password</label>
                <input
                  id="pass-new"
                  className="form-input"
                  type={showPass ? 'text' : 'password'}
                  name="newPass"
                  placeholder="At least 6 characters"
                  value={passwordForm.newPass}
                  onChange={handlePasswordChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="pass-confirm">Confirm New Password</label>
                <input
                  id="pass-confirm"
                  className="form-input"
                  type={showPass ? 'text' : 'password'}
                  name="confirm"
                  placeholder="Re-enter new password"
                  value={passwordForm.confirm}
                  onChange={handlePasswordChange}
                />
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
