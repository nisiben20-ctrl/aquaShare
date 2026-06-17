import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { suppliers as suppliersApi, requests as requestsApi, ratings as ratingsApi } from '../services/api';
import {
  FaTint, FaShoppingCart, FaClock, FaCheckCircle, FaStar, FaSearch,
  FaMapMarkerAlt, FaPaperPlane, FaTimes, FaCommentAlt, FaChartLine,
  FaChevronRight
} from 'react-icons/fa';

const STATUS_CHIP = {
  pending: 'chip-warning',
  accepted: 'chip',
  completed: 'chip-success',
  rejected: 'chip-error',
  cancelled: 'chip-neutral',
};

export default function ResidentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [suppliersList, setSuppliersList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [requests, setRequests] = useState([]);

  const [loadingSuppliers, setLoadingSuppliers] = useState(false);
  const [loadingRequests, setLoadingRequests] = useState(false);

  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [requestNote, setRequestNote] = useState('');
  const [requestQty, setRequestQty] = useState(1);
  const [submittingRequest, setSubmittingRequest] = useState(false);

  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsTarget, setDetailsTarget] = useState(null);

  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingTarget, setRatingTarget] = useState(null);
  const [ratingScore, setRatingScore] = useState(0);
  const [ratingComment, setRatingComment] = useState('');
  const [submittingRating, setSubmittingRating] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  // Fetch suppliers list
  const loadSuppliers = async (term = '') => {
    setLoadingSuppliers(true);
    try {
      const res = await suppliersApi.list(term);
      if (res.data) setSuppliersList(res.data);
    } catch (err) {
      console.error('Failed to load suppliers:', err);
    } finally {
      setLoadingSuppliers(false);
    }
  };

  // Fetch request history
  const loadRequests = async () => {
    setLoadingRequests(true);
    try {
      const res = await requestsApi.getAll();
      if (res.data) setRequests(res.data);
    } catch (err) {
      console.error('Failed to load requests:', err);
    } finally {
      setLoadingRequests(false);
    }
  };

  useEffect(() => {
    loadSuppliers();
    loadRequests();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      loadSuppliers(searchTerm);
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const handleRequestWater = (e, supplier) => {
    e.stopPropagation(); // prevent card click
    setSelectedSupplier(supplier);
    setRequestQty(1);
    setRequestNote('');
    setShowRequestModal(true);
  };

  const handleSupplierClick = (supplier) => {
    setDetailsTarget(supplier);
    setShowDetailsModal(true);
  };

  const submitRequest = async () => {
    if (!selectedSupplier) return;
    setSubmittingRequest(true);
    try {
      const res = await requestsApi.create({
        supplierId: selectedSupplier.id,
        quantity: requestQty,
        note: requestNote,
      });
      if (res.data) {
        setShowRequestModal(false);
        loadRequests();
      }
    } catch (err) {
      console.error('Error placing request:', err);
    } finally {
      setSubmittingRequest(false);
    }
  };

  const openRating = (req) => {
    setRatingTarget(req);
    setRatingScore(0);
    setRatingComment('');
    setShowRatingModal(true);
  };

  const submitRating = async () => {
    if (!ratingTarget) return;
    setSubmittingRating(true);
    try {
      const res = await ratingsApi.create({
        supplierId: ratingTarget.supplier_id,
        score: ratingScore,
        comment: ratingComment,
      });
      if (res.data) {
        setShowRatingModal(false);
        loadSuppliers(searchTerm);
      }
    } catch (err) {
      console.error('Error submitting rating:', err);
    } finally {
      setSubmittingRating(false);
    }
  };

  const openChat = (requestId) => {
    navigate(`/dashboard/chat?request_id=${requestId}`);
  };

  const stats = [
    { label: 'Total Requests', value: requests.length, icon: FaShoppingCart, cls: 'stat-icon-blue' },
    { label: 'Pending', value: requests.filter(r => r.status === 'pending').length, icon: FaClock, cls: 'stat-icon-orange' },
    { label: 'Completed', value: requests.filter(r => r.status === 'completed').length, icon: FaCheckCircle, cls: 'stat-icon-green' },
    { label: 'Suppliers Found', value: suppliersList.filter(s => s.is_available).length, icon: FaTint, cls: 'stat-icon-cyan' },
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
        {/* Decorative circle */}
        <div style={{
          position: 'absolute', top: '-30px', right: '-30px',
          width: '160px', height: '160px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.04)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-50px', right: '120px',
          width: '200px', height: '200px', borderRadius: '50%',
          background: 'rgba(0,156,255,0.07)', pointerEvents: 'none',
        }} />
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', marginBottom: '6px', letterSpacing: '-0.02em' }}>
            Welcome back, {user?.full_name?.split(' ')[0] || 'Resident'}!
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.95rem', margin: 0 }}>
            Find verified local suppliers and track your water orders.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            background: 'rgba(255,255,255,0.1)', borderRadius: '12px',
            padding: '10px 18px', border: '1px solid rgba(255,255,255,0.15)',
            display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            <FaMapMarkerAlt size={14} color="rgba(255,255,255,0.7)" />
            <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem', fontWeight: 600 }}>
              Dirty south
            </span>
          </div>
        </div>
      </div>

      <div className="below-hero-content" id="stats">

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

        {/* Standalone Search Bar */}
        <div style={{ position: 'relative', marginBottom: '24px' }}>
          <FaSearch size={20} color="var(--primary-500)" style={{
            position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none'
          }} />
          <input
            type="text"
            placeholder="Search suppliers by name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '18px 24px 18px 54px',
              fontSize: '1.1rem',
              borderRadius: '99px',
              border: '1px solid var(--gray-200)',
              outline: 'none',
              background: 'var(--white)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              transition: 'all 0.3s ease',
              color: 'var(--gray-800)',
            }}
            onFocus={(e) => {
              e.target.style.border = '1px solid var(--primary-400)';
              e.target.style.boxShadow = '0 6px 16px rgba(14, 165, 233, 0.15)';
            }}
            onBlur={(e) => {
              e.target.style.border = '1px solid var(--gray-200)';
              e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
            }}
            id="supplier-search-input"
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
          {/* Suppliers List Area */}
          <div className="card">
            <div className="card-header" style={{ borderBottom: '1px solid var(--gray-100)', paddingBottom: '16px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '8px',
                  background: 'linear-gradient(135deg, var(--primary-50), var(--primary-100))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <FaTint size={16} color="var(--primary-500)" />
                </div>
                <div>
                  <div className="card-title">Available Suppliers</div>
                  <div className="card-subtitle">Tap a supplier for details or to order</div>
                </div>
              </div>
              <span className="chip">
                {suppliersList.filter(s => s.is_available).length} online
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {loadingSuppliers ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '32px' }}>
                  <span className="spinner spinner-lg" />
                </div>
              ) : suppliersList.map((sup) => (
                <div
                  key={sup.id}
                  className="supplier-card"
                  onClick={() => handleSupplierClick(sup)}
                  style={{ cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  {/* Avatar */}
                  <div className="avatar" style={{
                    background: sup.is_available
                      ? 'linear-gradient(135deg, var(--primary-400), var(--primary-700))'
                      : 'linear-gradient(135deg, var(--gray-300), var(--gray-400))',
                  }}>
                    {sup.full_name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: '180px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                      <span style={{ fontWeight: 700, fontSize: '.9375rem' }}>{sup.full_name}</span>
                    </div>
                    <div className="text-sm text-muted" style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '5px' }}>
                      <FaMapMarkerAlt size={13} /> {sup.address || 'Buea, Cameroon'}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 700, color: 'var(--primary-600)', fontSize: '.875rem' }}>
                        {sup.price_per_unit} FCFA
                        <span style={{ fontWeight: 400, color: 'var(--gray-400)', fontSize: '.78rem' }}>
                          {' '}/ {sup.unit_description}
                        </span>
                      </span>
                      <span className="star-rating">
                        {[1, 2, 3, 4, 5].map(n => (
                          <FaStar
                            key={n} size={13}
                            className={`star ${n <= Math.round(sup.rating) ? 'filled' : ''}`}
                            color={n <= Math.round(sup.rating) ? '#f59e0b' : 'var(--gray-300)'}
                            style={{ cursor: 'default' }}
                          />
                        ))}
                        <span className="text-xs text-muted" style={{ marginLeft: '4px' }}>
                          {sup.rating || '5.0'}
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', marginLeft: 'auto' }}>
                    <span className={sup.is_available ? 'chip chip-success' : 'chip chip-error'}>
                      <span className={`pulse-dot ${sup.is_available ? '' : 'pulse-dot-offline'}`}
                        style={{ width: '6px', height: '6px' }} />
                      {sup.is_available ? 'Available' : 'Offline'}
                    </span>
                    {sup.is_available && (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={(e) => handleRequestWater(e, sup)}
                        id={`request-btn-${sup.id}`}
                      >
                        <FaPaperPlane size={13} /> Request
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {!loadingSuppliers && suppliersList.length === 0 && (
                <div className="empty-state">
                  <FaSearch size={48} className="empty-state-icon" />
                  <div className="empty-state-title">No suppliers found</div>
                  <div className="empty-state-text">Try a different search term or check back later</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Request History Summary */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: 48, height: 48, borderRadius: '12px',
              background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <FaChartLine size={22} color="#1d4ed8" />
            </div>
            <div>
              <div className="card-title" style={{ fontSize: '1.15rem' }}>Request History</div>
              <div className="card-subtitle">Track all your past and active requests</div>
            </div>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/dashboard/requests')}
          >
            View All Requests <FaChevronRight size={14} style={{ marginLeft: 8 }} />
          </button>
        </div>

        {/* ─── Request Modal ─────────────────────────────────────── */}
        {showRequestModal && selectedSupplier && (
          <div className="modal-backdrop" onClick={() => setShowRequestModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              {/* Modal header with supplier info */}
              <div className="modal-header">
                <div className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FaTint size={20} color="var(--primary-500)" />
                  Request Water
                </div>
                <button className="modal-close" onClick={() => setShowRequestModal(false)}>
                  <FaTimes size={18} />
                </button>
              </div>

              {/* Supplier pill */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                background: 'var(--primary-50)', border: '1px solid var(--primary-100)',
                borderRadius: 'var(--radius-md)', padding: '10px 14px',
                marginBottom: '20px',
              }}>
                <div className="avatar avatar-sm">
                  {selectedSupplier.full_name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '.9rem' }}>{selectedSupplier.full_name}</div>
                  <div style={{ fontSize: '.78rem', color: 'var(--primary-600)' }}>
                    {selectedSupplier.price_per_unit} FCFA / {selectedSupplier.unit_description}
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Quantity</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    style={{ width: 36, height: 36, padding: 0, flexShrink: 0 }}
                    onClick={() => setRequestQty(q => Math.max(1, q - 1))}
                  >
                    –
                  </button>
                  <input
                    className="form-input"
                    type="number"
                    min="1"
                    value={requestQty}
                    onChange={e => setRequestQty(parseInt(e.target.value) || 1)}
                    style={{ textAlign: 'center', fontWeight: 700, fontSize: '1.1rem' }}
                    id="request-qty-input"
                  />
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    style={{ width: 36, height: 36, padding: 0, flexShrink: 0 }}
                    onClick={() => setRequestQty(q => q + 1)}
                  >
                    +
                  </button>
                </div>
                <div style={{
                  marginTop: '8px', padding: '8px 12px',
                  background: 'var(--primary-50)', borderRadius: 'var(--radius-md)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <span className="text-sm text-muted">Total estimate</span>
                  <span style={{ fontWeight: 800, color: 'var(--primary-700)', fontSize: '1.0625rem' }}>
                    {requestQty * selectedSupplier.price_per_unit} FCFA
                  </span>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Note <span style={{ fontWeight: 400, color: 'var(--gray-400)' }}>(optional)</span></label>
                <textarea
                  className="form-input"
                  rows="3"
                  placeholder="Any special delivery instructions…"
                  value={requestNote}
                  onChange={e => setRequestNote(e.target.value)}
                  style={{ resize: 'vertical' }}
                  id="request-note-input"
                />
              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowRequestModal(false)}>Cancel</button>
                <button
                  className="btn btn-primary"
                  onClick={submitRequest}
                  disabled={submittingRequest}
                  id="request-submit-btn"
                >
                  {submittingRequest ? (
                    <>
                      <span className="spinner" style={{ width: 15, height: 15, borderWidth: 2, borderColor: 'rgba(255,255,255,.3)', borderTopColor: '#fff' }} />
                      Submitting…
                    </>
                  ) : (
                    <><FaPaperPlane size={15} /> Submit Request</>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── Rating Modal ──────────────────────────────────────── */}
        {showRatingModal && ratingTarget && (
          <div className="modal-backdrop" onClick={() => setShowRatingModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <div className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FaStar size={20} color="#f59e0b" />
                  Rate Supplier
                </div>
                <button className="modal-close" onClick={() => setShowRatingModal(false)}>
                  <FaTimes size={18} />
                </button>
              </div>

              <p className="text-sm text-muted" style={{ marginBottom: '24px' }}>
                How was your experience with <strong>{ratingTarget.supplier_name}</strong>?
              </p>

              {/* Star selector */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '8px' }}>
                {[1, 2, 3, 4, 5].map(n => (
                  <FaStar
                    key={n}
                    size={40}
                    className={`star ${n <= (hoverRating || ratingScore) ? 'filled' : ''}`}
                    color={n <= (hoverRating || ratingScore) ? '#f59e0b' : 'var(--gray-300)'}
                    onClick={() => setRatingScore(n)}
                    onMouseEnter={() => setHoverRating(n)}
                    onMouseLeave={() => setHoverRating(0)}
                    style={{ cursor: 'pointer', transition: 'transform 0.15s, color 0.15s' }}
                  />
                ))}
              </div>
              {ratingScore > 0 && (
                <p style={{ textAlign: 'center', fontSize: '.875rem', color: 'var(--primary-600)', fontWeight: 600, marginBottom: '20px' }}>
                  {['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent!'][ratingScore]}
                </p>
              )}

              <div className="form-group" style={{ marginTop: ratingScore > 0 ? 0 : '20px' }}>
                <label className="form-label">Comment <span style={{ fontWeight: 400, color: 'var(--gray-400)' }}>(optional)</span></label>
                <textarea
                  className="form-input"
                  rows="3"
                  placeholder="Share your experience…"
                  value={ratingComment}
                  onChange={e => setRatingComment(e.target.value)}
                  style={{ resize: 'vertical' }}
                  id="rating-comment-input"
                />
              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowRatingModal(false)}>Cancel</button>
                <button
                  className="btn btn-primary"
                  onClick={submitRating}
                  disabled={ratingScore === 0 || submittingRating}
                  id="rating-submit-btn"
                >
                  {submittingRating ? 'Submitting…' : 'Submit Rating'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── Supplier Details Modal ──────────────────────────────────────── */}
        {showDetailsModal && detailsTarget && (
          <div className="modal-backdrop" onClick={() => setShowDetailsModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <div className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div className="avatar avatar-sm" style={{ background: 'var(--primary-500)', fontSize: '0.8rem' }}>
                    {detailsTarget.full_name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  Supplier Details
                </div>
                <button className="modal-close" onClick={() => setShowDetailsModal(false)}>
                  <FaTimes size={18} />
                </button>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 4px', color: 'var(--gray-900)' }}>
                  {detailsTarget.full_name}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--gray-500)', fontSize: '0.9rem', marginBottom: '16px' }}>
                  <FaMapMarkerAlt size={14} /> {detailsTarget.address || 'Buea, Cameroon'}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div style={{ background: 'var(--gray-50)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-100)' }}>
                    <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--gray-500)', fontWeight: 700, marginBottom: '4px' }}>Price</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary-600)' }}>
                      {detailsTarget.price_per_unit} <span style={{ fontSize: '0.85rem', color: 'var(--gray-600)' }}>FCFA</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>per {detailsTarget.unit_description}</div>
                  </div>

                  <div style={{ background: 'var(--gray-50)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-100)' }}>
                    <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--gray-500)', fontWeight: 700, marginBottom: '4px' }}>Rating</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--gray-900)' }}>{detailsTarget.rating || '5.0'}</div>
                      <div style={{ display: 'flex', gap: '2px' }}>
                        {[1, 2, 3, 4, 5].map(n => <FaStar key={n} size={12} color={n <= Math.round(detailsTarget.rating) ? '#f59e0b' : 'var(--gray-300)'} />)}
                      </div>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>Based on community feedback</div>
                  </div>
                </div>
              </div>

              {/* Quick Actions inside Details Modal */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--gray-800)', borderBottom: '1px solid var(--gray-100)', paddingBottom: '8px' }}>
                  Actions
                </div>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {detailsTarget.is_available ? (
                    <button
                      className="btn btn-primary"
                      style={{ flex: 1, display: 'flex', justifyContent: 'center' }}
                      onClick={(e) => {
                        setShowDetailsModal(false);
                        handleRequestWater(e, detailsTarget);
                      }}
                    >
                      <FaPaperPlane size={14} /> Request Water
                    </button>
                  ) : (
                    <div style={{ flex: 1, padding: '10px', background: 'var(--gray-100)', color: 'var(--gray-500)', borderRadius: 'var(--radius-md)', textAlign: 'center', fontSize: '0.9rem', fontWeight: 600 }}>
                      Currently Offline
                    </div>
                  )}
                  <button
                    className="btn btn-secondary"
                    style={{ flex: 1, display: 'flex', justifyContent: 'center' }}
                    onClick={() => {
                      setShowDetailsModal(false);
                      // Pass a simulated request object to the rating modal
                      setRatingTarget({ id: 'direct', supplier_id: detailsTarget.id, supplier_name: detailsTarget.full_name });
                      setRatingScore(0);
                      setRatingComment('');
                      setShowRatingModal(true);
                    }}
                  >
                    <FaStar size={14} color="#f59e0b" /> Rate Supplier
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* end below-hero-content */}
      </div>
    </div>
  );
}
