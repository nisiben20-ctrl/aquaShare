import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { requests as requestsApi, ratings as ratingsApi } from '../services/api';
import {
  FaShoppingCart, FaClock, FaCheckCircle, FaTimesCircle,
  FaSearch, FaStar, FaCommentAlt, FaTimes, FaFilter
} from 'react-icons/fa';

const STATUS_CHIP = {
  pending: 'chip-warning',
  accepted: 'chip',
  completed: 'chip-success',
  rejected: 'chip-error',
  cancelled: 'chip-neutral',
};

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'completed', label: 'Completed' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'cancelled', label: 'Cancelled' },
];

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function getInitials(name) {
  if (!name) return '??';
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export default function Requests() {
  const { user } = useAuth();
  const navigate = useNavigate();

  /* ── Data state ─────────────────────────────────── */
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ── Filter state ───────────────────────────────── */
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  /* ── Rating modal state ─────────────────────────── */
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingTarget, setRatingTarget] = useState(null);
  const [ratingScore, setRatingScore] = useState(0);
  const [ratingComment, setRatingComment] = useState('');
  const [submittingRating, setSubmittingRating] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  /* ── Fetch requests ─────────────────────────────── */
  const loadRequests = async () => {
    setLoading(true);
    try {
      const res = await requestsApi.getAll();
      if (res.data) setRequests(res.data);
    } catch (err) {
      console.error('Failed to load requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  /* ── Filtering ──────────────────────────────────── */
  const filtered = requests.filter((r) => {
    const matchesSearch =
      !searchTerm ||
      (r.supplier_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.note || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  /* ── Stats ──────────────────────────────────────── */
  const stats = [
    {
      label: 'Total Requests',
      value: requests.length,
      icon: FaShoppingCart,
      cls: 'stat-icon-blue',
    },
    {
      label: 'Pending',
      value: requests.filter((r) => r.status === 'pending').length,
      icon: FaClock,
      cls: 'stat-icon-orange',
    },
    {
      label: 'Completed',
      value: requests.filter((r) => r.status === 'completed').length,
      icon: FaCheckCircle,
      cls: 'stat-icon-green',
    },
    {
      label: 'Cancelled / Rejected',
      value: requests.filter(
        (r) => r.status === 'cancelled' || r.status === 'rejected'
      ).length,
      icon: FaTimesCircle,
      cls: 'stat-icon-red',
    },
  ];

  /* ── Rating actions ─────────────────────────────── */
  const openRating = (req) => {
    setRatingTarget(req);
    setRatingScore(0);
    setRatingComment('');
    setHoverRating(0);
    setShowRatingModal(true);
  };

  const submitRating = async () => {
    if (!ratingTarget || ratingScore === 0) return;
    setSubmittingRating(true);
    try {
      const res = await ratingsApi.create({
        supplierId: ratingTarget.supplier_id,
        score: ratingScore,
        comment: ratingComment,
      });
      if (res.data) {
        setShowRatingModal(false);
        loadRequests();
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

  /* ── Render ─────────────────────────────────────── */
  return (
    <div>
      {/* ══ PAGE HEADER ═════════════════════════════════ */}
      <div style={{ marginBottom: '24px' }}>
        <h1
          style={{
            fontSize: '1.75rem',
            fontWeight: 800,
            color: 'var(--gray-900)',
            marginBottom: '8px',
          }}
        >
          My Requests
        </h1>
        <p style={{ color: 'var(--gray-500)', fontSize: '1rem' }}>
          Track and manage your water orders
        </p>
      </div>

      {/* ══ STATS ROW ═══════════════════════════════════ */}
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

      {/* ══ SEARCH / FILTER BAR ═════════════════════════ */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '24px',
          flexWrap: 'wrap',
        }}
      >
        {/* Search input — pill style */}
        <div style={{ position: 'relative', flex: '1 1 280px' }}>
          <FaSearch
            size={18}
            color="var(--primary-500)"
            style={{
              position: 'absolute',
              left: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
            }}
          />
          <input
            type="text"
            placeholder="Search by supplier name or note…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '14px 24px 14px 52px',
              fontSize: '1rem',
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
              e.target.style.boxShadow =
                '0 6px 16px rgba(14, 165, 233, 0.15)';
            }}
            onBlur={(e) => {
              e.target.style.border = '1px solid var(--gray-200)';
              e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
            }}
          />
        </div>

        {/* Status filter dropdown */}
        <div style={{ position: 'relative', flex: '0 0 auto' }}>
          <FaFilter
            size={14}
            color="var(--gray-400)"
            style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
            }}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '14px 40px 14px 40px',
              fontSize: '1rem',
              borderRadius: '99px',
              border: '1px solid var(--gray-200)',
              outline: 'none',
              background: 'var(--white)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              color: 'var(--gray-700)',
              cursor: 'pointer',
              appearance: 'none',
              WebkitAppearance: 'none',
              MozAppearance: 'none',
              minWidth: '180px',
            }}
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {/* Dropdown chevron */}
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            style={{
              position: 'absolute',
              right: '18px',
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
              fill: 'var(--gray-400)',
            }}
          >
            <path d="M2 4l4 4 4-4H2z" />
          </svg>
        </div>
      </div>

      {/* ══ REQUESTS LIST ═══════════════════════════════ */}
      <div className="card">
        <div
          className="card-header"
          style={{
            borderBottom: '1px solid var(--gray-100)',
            paddingBottom: '16px',
            marginBottom: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '8px',
                background:
                  'linear-gradient(135deg, var(--primary-50), var(--primary-100))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FaShoppingCart size={16} color="var(--primary-500)" />
            </div>
            <div>
              <div className="card-title">All Requests</div>
              <div className="card-subtitle">
                {filtered.length}{' '}
                {filtered.length === 1 ? 'request' : 'requests'} found
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {loading ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                padding: '48px',
              }}
            >
              <span className="spinner spinner-lg" />
            </div>
          ) : filtered.length === 0 ? (
            /* ── Empty State ──────────────────────────── */
            <div className="empty-state animate-in animate-fade">
              <FaSearch size={48} className="empty-state-icon" />
              <div className="empty-state-title">No requests found</div>
              <div className="empty-state-text">
                {requests.length === 0
                  ? "You haven't placed any water orders yet. Head to the dashboard to find a supplier!"
                  : 'No requests match your current filters. Try adjusting your search or status filter.'}
              </div>
            </div>
          ) : (
            filtered.map((req) => {
              const total =
                req.price_per_unit && req.quantity
                  ? req.price_per_unit * req.quantity
                  : null;

              return (
                <div
                  key={req.id}
                  className="animate-in animate-fade"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '16px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--gray-100)',
                    background: 'var(--white)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    flexWrap: 'wrap',
                    cursor: 'default',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow =
                      '0 6px 20px rgba(0,0,0,0.07)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {/* Avatar */}
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: '12px',
                      background:
                        'linear-gradient(135deg, var(--primary-400), var(--primary-700))',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      flexShrink: 0,
                      letterSpacing: '0.5px',
                    }}
                  >
                    {getInitials(req.supplier_name)}
                  </div>

                  {/* Info block */}
                  <div style={{ flex: 1, minWidth: '180px' }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        marginBottom: '4px',
                        flexWrap: 'wrap',
                      }}
                    >
                      <span
                        style={{
                          fontWeight: 700,
                          fontSize: '0.9375rem',
                          color: 'var(--gray-900)',
                        }}
                      >
                        {req.supplier_name || 'Supplier'}
                      </span>
                      <span className={STATUS_CHIP[req.status] || 'chip'}>
                        {req.status}
                      </span>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        flexWrap: 'wrap',
                      }}
                    >
                      <span
                        className="text-sm text-muted"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <FaClock size={12} />
                        {formatDate(req.created_at)}
                      </span>
                      <span
                        className="text-sm"
                        style={{
                          fontWeight: 600,
                          color: 'var(--gray-700)',
                        }}
                      >
                        Qty: {req.quantity}
                        {req.unit_description
                          ? ` ${req.unit_description}`
                          : ''}
                      </span>
                      {total != null && (
                        <span
                          style={{
                            fontWeight: 800,
                            color: 'var(--primary-600)',
                            fontSize: '0.9rem',
                          }}
                        >
                          {total.toLocaleString()} FCFA
                        </span>
                      )}
                    </div>

                    {req.note && (
                      <div
                        className="text-sm text-muted"
                        style={{
                          marginTop: '6px',
                          fontStyle: 'italic',
                          lineHeight: 1.4,
                        }}
                      >
                        "{req.note}"
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      flexShrink: 0,
                    }}
                  >
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => openChat(req.id)}
                      title="Chat with supplier"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <FaCommentAlt size={13} />
                      Chat
                    </button>
                    {req.status === 'completed' && (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => openRating(req)}
                        title="Rate this supplier"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <FaStar size={13} />
                        Rate
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ══ RATING MODAL ════════════════════════════════ */}
      {showRatingModal && ratingTarget && (
        <div
          className="modal-backdrop"
          onClick={() => setShowRatingModal(false)}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div
                className="modal-title"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <FaStar size={20} color="#f59e0b" />
                Rate Supplier
              </div>
              <button
                className="modal-close"
                onClick={() => setShowRatingModal(false)}
              >
                <FaTimes size={18} />
              </button>
            </div>

            <p
              className="text-sm text-muted"
              style={{ marginBottom: '24px' }}
            >
              How was your experience with{' '}
              <strong>{ratingTarget.supplier_name}</strong>?
            </p>

            {/* Star selector */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '10px',
                marginBottom: '8px',
              }}
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <FaStar
                  key={n}
                  size={40}
                  className={`star ${
                    n <= (hoverRating || ratingScore) ? 'filled' : ''
                  }`}
                  color={
                    n <= (hoverRating || ratingScore)
                      ? '#f59e0b'
                      : 'var(--gray-300)'
                  }
                  onClick={() => setRatingScore(n)}
                  onMouseEnter={() => setHoverRating(n)}
                  onMouseLeave={() => setHoverRating(0)}
                  style={{
                    cursor: 'pointer',
                    transition: 'transform 0.15s, color 0.15s',
                  }}
                />
              ))}
            </div>

            {ratingScore > 0 && (
              <p
                style={{
                  textAlign: 'center',
                  fontSize: '.875rem',
                  color: 'var(--primary-600)',
                  fontWeight: 600,
                  marginBottom: '20px',
                }}
              >
                {['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent!'][ratingScore]}
              </p>
            )}

            <div
              className="form-group"
              style={{ marginTop: ratingScore > 0 ? 0 : '20px' }}
            >
              <label className="form-label">
                Comment{' '}
                <span
                  style={{ fontWeight: 400, color: 'var(--gray-400)' }}
                >
                  (optional)
                </span>
              </label>
              <textarea
                className="form-input"
                rows="3"
                placeholder="Share your experience…"
                value={ratingComment}
                onChange={(e) => setRatingComment(e.target.value)}
                style={{ resize: 'vertical' }}
              />
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setShowRatingModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={submitRating}
                disabled={ratingScore === 0 || submittingRating}
              >
                {submittingRating ? (
                  <>
                    <span
                      className="spinner"
                      style={{
                        width: 15,
                        height: 15,
                        borderWidth: 2,
                        borderColor: 'rgba(255,255,255,.3)',
                        borderTopColor: '#fff',
                      }}
                    />
                    Submitting…
                  </>
                ) : (
                  <>
                    <FaStar size={15} /> Submit Rating
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
