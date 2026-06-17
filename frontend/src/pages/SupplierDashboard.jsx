import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { requests as requestsApi, suppliers as suppliersApi, syncActiveSupplierToMockList } from '../services/api';
import {
  FaTint, FaShoppingCart, FaClock, FaCheckCircle, FaSave,
  FaTimes, FaCheck, FaTimesCircle, FaMapMarkerAlt, FaCommentAlt,
  FaBriefcase, FaDollarSign, FaPhone, FaChevronDown
} from 'react-icons/fa';
import heroBg from '../assets/hero.jpg';

const STATUS_CHIP = {
  pending: 'chip-warning',
  accepted: 'chip',
  completed: 'chip-success',
  rejected: 'chip-error',
  cancelled: 'chip-neutral',
};

export default function SupplierDashboard() {
  const { user, profile, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [isAvailable, setIsAvailable] = useState(profile?.is_available !== false);
  const [pricePerUnit, setPricePerUnit] = useState(profile?.price_per_unit || 500);
  const [unitDescription, setUnitDescription] = useState(profile?.unit_description || '25L jerry can');

  const [editingPrice, setEditingPrice] = useState(false);
  const [tempPrice, setTempPrice] = useState(pricePerUnit);
  const [tempDesc, setTempDesc] = useState(unitDescription);

  // Sync supplier state to search pool
  useEffect(() => {
    if (user) {
      const activeProfile = {
        address: profile?.address || 'Buea, Cameroon',
        landmark: profile?.landmark || '',
        price_per_unit: pricePerUnit,
        unit_description: unitDescription,
        is_available: isAvailable,
        delivery_available: true,
        rating: profile?.rating || 5.0
      };
      syncActiveSupplierToMockList(user, activeProfile);
    }
  }, [user, profile, pricePerUnit, unitDescription, isAvailable]);

  // Fetch incoming requests
  const loadRequests = async () => {
    setLoadingRequests(true);
    try {
      const res = await requestsApi.getAll();
      if (res.data) setRequests(res.data);
    } catch (err) {
      console.error('Failed to load incoming requests:', err);
    } finally {
      setLoadingRequests(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleToggleAvailability = async () => {
    const newVal = !isAvailable;
    setIsAvailable(newVal);
    try {
      await suppliersApi.updateAvailability(newVal);
      updateProfile({ ...profile, is_available: newVal });
    } catch (err) {
      console.error('Failed to update availability:', err);
    }
  };

  const savePrice = async () => {
    setPricePerUnit(tempPrice);
    setUnitDescription(tempDesc);
    setEditingPrice(false);
    try {
      await suppliersApi.updatePrice(tempPrice, tempDesc);
      updateProfile({ ...profile, price_per_unit: tempPrice, unit_description: tempDesc });
    } catch (err) {
      console.error('Failed to update price:', err);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const res = await requestsApi.updateStatus(id, newStatus);
      if (res.data) {
        loadRequests(); // Refresh requests list
      }
    } catch (err) {
      console.error('Failed to update request status:', err);
    }
  };

  const openChat = (requestId) => {
    navigate(`/dashboard/chat?request_id=${requestId}`);
  };

  const stats = [
    { label: 'Total Requests', value: requests.length, icon: FaShoppingCart, cls: 'stat-icon-blue' },
    { label: 'Pending', value: requests.filter(r => r.status === 'pending').length, icon: FaClock, cls: 'stat-icon-orange' },
    { label: 'Accepted', value: requests.filter(r => r.status === 'accepted').length, icon: FaCheckCircle, cls: 'stat-icon-green' },
    { label: 'Completed', value: requests.filter(r => r.status === 'completed').length, icon: FaTint, cls: 'stat-icon-cyan' },
  ];

  return (
    <div>
      {/* ══ DASHBOARD WELCOME BANNER ═══════════════════════════ */}
      <div style={{
        background: 'linear-gradient(135deg, #001f3f 0%, #003366 60%, #004a8f 100%)',
        borderRadius: '18px',
        padding: '28px 32px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        boxShadow: '0 8px 32px rgba(0, 31, 63, 0.25)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '-30px', right: '-30px',
          width: '160px', height: '160px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.04)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-50px', right: '120px',
          width: '200px', height: '200px', borderRadius: '50%',
          background: 'rgba(255,122,0,0.07)', pointerEvents: 'none',
        }} />
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', marginBottom: '6px', letterSpacing: '-0.02em' }}>
            👋 Welcome back, {user?.full_name?.split(' ')[0] || 'Supplier'}!
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.95rem', margin: 0 }}>
            Manage your pricing, availability, and respond to water requests.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            background: isAvailable ? 'rgba(22,163,74,0.2)' : 'rgba(255,255,255,0.08)',
            borderRadius: '12px',
            padding: '10px 18px',
            border: isAvailable ? '1px solid rgba(22,163,74,0.4)' : '1px solid rgba(255,255,255,0.15)',
            display: 'flex', alignItems: 'center', gap: '8px',
            cursor: 'pointer',
            transition: 'all 0.3s',
          }} onClick={handleToggleAvailability}>
            <span style={{
              width: 8, height: 8, borderRadius: '50%',
              background: isAvailable ? '#4ade80' : 'rgba(255,255,255,0.4)',
              display: 'inline-block', boxShadow: isAvailable ? '0 0 6px #4ade80' : 'none',
            }} />
            <span style={{ color: isAvailable ? '#4ade80' : 'rgba(255,255,255,0.6)', fontSize: '0.875rem', fontWeight: 600 }}>
              {isAvailable ? 'Online · Accepting' : 'Offline'}
            </span>
          </div>
        </div>
      </div>

      {/* ══ Below hero ══════════════════════════════════════════ */}
      <div className="below-hero-content" id="supplier-stats">
      {/* Stats */}
      <div className="stat-grid">
        {stats.map((s) => (
          <div className="stat-card" key={s.label}>
            <div className={`stat-icon ${s.cls}`}>
              <s.icon size={22} />
            </div>
            <div className="stat-info">
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div id="supplier-controls-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        {/* Availability Toggle */}
        <div className="card">
          <div className="card-header" style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: 32, height: 32, borderRadius: '8px',
                background: isAvailable ? 'linear-gradient(135deg, #dcfce7, #bbf7d0)' : 'linear-gradient(135deg, var(--gray-200), var(--gray-300))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.3s'
              }}>
                <FaBriefcase size={16} color={isAvailable ? '#15803d' : 'var(--gray-600)'} />
              </div>
              <div className="card-title">Availability Status</div>
            </div>
            <label className="toggle">
              <input
                type="checkbox"
                checked={isAvailable}
                onChange={handleToggleAvailability}
              />
              <span className="toggle-slider" />
            </label>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <p className="text-sm text-muted">
              {isAvailable
                ? 'You are currently visible in search results and can receive new requests from residents.'
                : 'You are hidden from search. No new requests will come in until you go online.'}
            </p>
            <div>
              <span className={isAvailable ? 'chip chip-success' : 'chip chip-neutral'} style={{ padding: '6px 12px' }}>
                <span className={`pulse-dot ${isAvailable ? '' : 'pulse-dot-offline'}`} style={{ width: 6, height: 6, marginRight: 4 }} />
                {isAvailable ? 'Online & Visible' : 'Offline'}
              </span>
            </div>
          </div>
        </div>

        {/* Pricing Card */}
        <div className="card">
          <div className="card-header" style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: 32, height: 32, borderRadius: '8px',
                background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <FaDollarSign size={16} color="#92400e" />
              </div>
              <div className="card-title">Pricing & Unit</div>
            </div>
            {!editingPrice && (
              <button className="btn btn-secondary btn-sm" onClick={() => { setTempPrice(pricePerUnit); setTempDesc(unitDescription); setEditingPrice(true); }}>
                Edit
              </button>
            )}
          </div>

          {editingPrice ? (
            <div className="animate-in" style={{ animationDuration: '0.2s' }}>
              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label className="form-label" style={{ fontSize: '.75rem' }}>Price per unit (FCFA)</label>
                <input
                  className="form-input"
                  type="number"
                  min="0"
                  value={tempPrice}
                  onChange={e => setTempPrice(parseInt(e.target.value) || 0)}
                  style={{ padding: '8px 12px' }}
                />
              </div>
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label" style={{ fontSize: '.75rem' }}>Unit Description</label>
                <input
                  className="form-input"
                  placeholder="e.g. 25L jerry can, 50L drum"
                  value={tempDesc}
                  onChange={e => setTempDesc(e.target.value)}
                  style={{ padding: '8px 12px' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button className="btn btn-ghost btn-sm" onClick={() => setEditingPrice(false)}>Cancel</button>
                <button className="btn btn-primary btn-sm" onClick={savePrice}><FaSave size={14} /> Save</button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary-600)', letterSpacing: '-.02em', lineHeight: 1 }}>
                  {pricePerUnit}
                </span>
                <span style={{ fontWeight: 600, color: 'var(--gray-500)', fontSize: '.875rem' }}>FCFA</span>
              </div>
              <div style={{ fontSize: '.875rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--gray-300)' }} />
                Per {unitDescription}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Incoming Requests */}
      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: 32, height: 32, borderRadius: '8px',
              background: 'linear-gradient(135deg, var(--primary-50), var(--primary-100))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <FaShoppingCart size={16} color="var(--primary-600)" />
            </div>
            <div>
              <div className="card-title">Incoming Requests</div>
              <div className="card-subtitle">Manage water requests from residents</div>
            </div>
          </div>
          {requests.filter(r => r.status === 'pending').length > 0 && (
            <span className="badge" style={{ padding: '4px 8px', height: 'auto', fontSize: '.75rem' }}>
              {requests.filter(r => r.status === 'pending').length} New
            </span>
          )}
        </div>

        {loadingRequests ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '32px' }}>
            <span className="spinner spinner-lg" />
          </div>
        ) : requests.length === 0 ? (
          <div className="empty-state">
            <FaShoppingCart size={48} className="empty-state-icon" />
            <div className="empty-state-title">No requests yet</div>
            <div className="empty-state-text">Requests from residents will appear here when you are online</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {requests.map((req) => (
              <div key={req.id} className="request-list-item" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '16px 20px',
                borderRadius: 'var(--radius-md)',
                border: req.status === 'pending' ? '1.5px solid var(--primary-300)' : '1px solid var(--gray-200)',
                background: req.status === 'pending' ? 'var(--primary-50)' : 'var(--white)',
                flexWrap: 'wrap'
              }}>
                {/* Avatar */}
                <div className="avatar avatar-online">
                  {req.resident_name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: '220px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 700, fontSize: '.9375rem' }}>{req.resident_name}</span>
                    <span style={{ color: 'var(--gray-400)', fontSize: '.75rem' }}>• {req.created_at.split(' ')[0]}</span>
                  </div>
                  <div className="text-sm text-muted" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <FaMapMarkerAlt size={13} /> Buea, Cameroon
                    </span>
                    <a href={`tel:${req.resident_phone}`} style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary-600)', fontWeight: 500 }}>
                      <FaPhone size={13} /> {req.resident_phone}
                    </a>
                  </div>
                  <div style={{
                    padding: '8px 12px', background: req.status === 'pending' ? 'var(--white)' : 'var(--gray-50)',
                    borderRadius: 'var(--radius-sm)', border: '1px solid var(--gray-100)',
                    fontSize: '.875rem'
                  }}>
                    <strong style={{ color: 'var(--primary-700)' }}>{req.quantity}×</strong> units requested
                    {req.note && <span className="text-muted"> — <em style={{ opacity: .8 }}>"{req.note}"</em></span>}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px', marginLeft: 'auto' }}>
                  <span className={`chip ${STATUS_CHIP[req.status]}`} style={{ textTransform: 'capitalize', alignSelf: 'flex-end' }}>
                    {req.status}
                  </span>

                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                    {/* Always allow chat for active requests */}
                    {(req.status === 'pending' || req.status === 'accepted') && (
                      <button className="btn btn-secondary btn-sm" onClick={() => openChat(req.id)}>
                        <FaCommentAlt size={14} /> Chat
                      </button>
                    )}

                    {req.status === 'pending' && (
                      <>
                        <button className="btn btn-danger btn-sm" onClick={() => handleUpdateStatus(req.id, 'rejected')}>
                          <FaTimesCircle size={14} /> Reject
                        </button>
                        <button className="btn btn-success btn-sm" onClick={() => handleUpdateStatus(req.id, 'accepted')} style={{ boxShadow: '0 2px 8px rgba(22,163,74,.3)' }}>
                          <FaCheck size={14} /> Accept
                        </button>
                      </>
                    )}
                    {req.status === 'accepted' && (
                      <button className="btn btn-primary btn-sm" onClick={() => handleUpdateStatus(req.id, 'completed')}>
                        <FaCheckCircle size={14} /> Mark Completed
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      </div>{/* end below-hero-content */}
    </div>
  );
}
