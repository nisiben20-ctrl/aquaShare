import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { suppliers as suppliersApi, requests as requestsApi, ratings as ratingsApi } from '../services/api';
import {
  FaTint, FaShoppingCart, FaClock, FaCheckCircle, FaStar, FaSearch,
  FaMapMarkerAlt, FaPhone, FaPaperPlane, FaTimes, FaPlus, FaCommentAlt, FaChartLine
} from 'react-icons/fa';

const STATUS_CHIP = {
  pending:   'chip-warning',
  accepted:  'chip',
  completed: 'chip-success',
  rejected:  'chip-error',
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

  const handleRequestWater = (supplier) => {
    setSelectedSupplier(supplier);
    setRequestNote('');
    setRequestQty(1);
    setShowRequestModal(true);
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
    { label: 'Total Requests',  value: requests.length,                                      icon: FaShoppingCart, cls: 'stat-icon-blue' },
    { label: 'Pending',         value: requests.filter(r => r.status === 'pending').length,   icon: FaClock,        cls: 'stat-icon-orange' },
    { label: 'Completed',       value: requests.filter(r => r.status === 'completed').length, icon: FaCheckCircle,  cls: 'stat-icon-green' },
    { label: 'Suppliers Found', value: suppliersList.filter(s => s.is_available).length,      icon: FaTint,         cls: 'stat-icon-cyan' },
  ];

  return (
    <div className="animate-in">
      {/* Welcome */}
      <div className="page-welcome">
        <h2>Welcome, {user?.full_name?.split(' ')[0] || 'Resident'} 👋</h2>
        <p>Find a water supplier and place a request below.</p>
      </div>

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

      {/* Supplier Search */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
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
              <div className="card-subtitle">Tap "Request" to place an order</div>
            </div>
          </div>
          <span className="chip">
            {suppliersList.filter(s => s.is_available).length} online
          </span>
        </div>

        {/* Search */}
        <div className="search-wrapper">
          <FaSearch size={17} className="search-icon" />
          <input
            className="form-input"
            placeholder="Search by name or location…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '42px' }}
            id="supplier-search-input"
          />
        </div>

        {/* Supplier list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {loadingSuppliers ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '32px' }}>
              <span className="spinner spinner-lg" />
            </div>
          ) : suppliersList.map((sup) => (
            <div key={sup.id} className="supplier-card">
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
                    onClick={() => handleRequestWater(sup)}
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

      {/* Request History */}
      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: 32, height: 32, borderRadius: '8px',
              background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <FaChartLine size={16} color="#1d4ed8" />
            </div>
            <div>
              <div className="card-title">Request History</div>
              <div className="card-subtitle">Track all your past and active requests</div>
            </div>
          </div>
          <span className="badge" style={{ background: 'var(--primary-500)' }}>
            {requests.length}
          </span>
        </div>

        {loadingRequests ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '32px' }}>
            <span className="spinner" />
          </div>
        ) : requests.length === 0 ? (
          <div className="empty-state">
            <FaShoppingCart size={48} className="empty-state-icon" />
            <div className="empty-state-title">No requests yet</div>
            <div className="empty-state-text">Browse suppliers above to make your first water request</div>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Supplier</th>
                  <th>Qty</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr key={req.id}>
                    <td style={{ fontWeight: 600 }}>{req.supplier_name}</td>
                    <td>
                      <span style={{ fontWeight: 600, color: 'var(--primary-600)' }}>
                        {req.quantity}×
                      </span>
                    </td>
                    <td>
                      <span className={`chip ${STATUS_CHIP[req.status] || 'chip-neutral'}`}
                        style={{ textTransform: 'capitalize' }}>
                        {req.status}
                      </span>
                    </td>
                    <td className="text-muted" style={{ fontSize: '.8125rem' }}>
                      {req.created_at.split(' ')[0]}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {(req.status === 'pending' || req.status === 'accepted') && (
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => openChat(req.id)}
                            style={{ color: 'var(--primary-600)', padding: '4px 10px' }}
                            id={`chat-btn-${req.id}`}
                          >
                            <FaCommentAlt size={13} /> Chat
                          </button>
                        )}
                        {req.status === 'completed' && (
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => openRating(req)}
                            style={{ color: '#92400e', padding: '4px 10px' }}
                            id={`rate-btn-${req.id}`}
                          >
                            <FaStar size={13} /> Rate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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
    </div>
  );
}
