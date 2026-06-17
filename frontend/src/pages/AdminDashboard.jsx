/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { admin as adminApi } from '../services/api';
import {
  FaUsers,
  FaUserTie,
  FaShoppingCart,
  FaCheckCircle,
  FaBan,
  FaCheck,
  FaEnvelope,
  FaUserClock,
  FaMapMarkerAlt,
  FaClock,
  FaTimes
} from 'react-icons/fa';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    total_users: 0,
    total_suppliers: 0,
    total_requests: 0,
    completed_requests: 0
  });
  const [users, setUsers] = useState([]);
  const [pendingSuppliers, setPendingSuppliers] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');
  const [verifying, setVerifying] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, pendingRes, messagesRes] = await Promise.all([
        adminApi.getStats(),
        adminApi.getUsers(),
        adminApi.getPendingSuppliers(),
        adminApi.getMessages(),
      ]);
      if (statsRes.data) setStats(statsRes.data);
      if (usersRes.data) setUsers(usersRes.data);
      if (pendingRes.data) setPendingSuppliers(pendingRes.data);
      if (messagesRes.data) setContactMessages(messagesRes.data);
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetch = async () => {
      await loadData();
    };
    fetch();
  }, []);

  const handleToggleBan = async (user) => {
    const newStatus = user.is_active === 1 ? 0 : 1;
    try {
      const res = await adminApi.banUser(user.id, newStatus);
      if (res.data) {
        loadData();
      }
    } catch (err) {
      console.error('Error updating user status:', err);
    }
  };

  const handleVerifySupplier = async (supplierId) => {
    setVerifying(supplierId);
    try {
      const res = await adminApi.verifySupplier(supplierId);
      if (res.data) {
        loadData();
      }
    } catch (err) {
      console.error('Error verifying supplier:', err);
    } finally {
      setVerifying(null);
    }
  };

  const statCards = [
    { label: 'Total Users', value: stats.total_users, icon: FaUsers, cls: 'stat-icon-blue' },
    { label: 'Total Suppliers', value: stats.total_suppliers, icon: FaUserTie, cls: 'stat-icon-orange' },
    { label: 'Total Requests', value: stats.total_requests, icon: FaShoppingCart, cls: 'stat-icon-cyan' },
    { label: 'Completed Requests', value: stats.completed_requests, icon: FaCheckCircle, cls: 'stat-icon-green' },
  ];

  const tabs = [
    { key: 'users', label: 'User Management', icon: FaUsers, count: users.length },
    { key: 'pending', label: 'Pending Suppliers', icon: FaUserClock, count: pendingSuppliers.length },
    { key: 'messages', label: 'Contact Messages', icon: FaEnvelope, count: contactMessages.length },
  ];

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="animate-in">
      {/* Welcome Banner */}
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
          background: 'rgba(0,156,255,0.07)', pointerEvents: 'none',
        }} />
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', marginBottom: '6px', letterSpacing: '-0.02em' }}>
            Admin Dashboard
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.95rem', margin: 0 }}>
            Platform statistics and management tools.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="stat-grid">
        {statCards.map((s) => (
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

      {/* Tab Navigation */}
      <div style={{
        display: 'flex', gap: '8px', marginBottom: '20px',
        borderBottom: '2px solid var(--gray-100)', paddingBottom: '0',
        flexWrap: 'wrap',
      }}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '12px 20px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab.key ? '3px solid var(--primary-500)' : '3px solid transparent',
              color: activeTab === tab.key ? 'var(--primary-600)' : 'var(--gray-500)',
              fontWeight: activeTab === tab.key ? 700 : 500,
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              marginBottom: '-2px',
            }}
          >
            <tab.icon size={16} />
            {tab.label}
            {tab.count > 0 && (
              <span style={{
                background: activeTab === tab.key ? 'var(--primary-500)' : 'var(--gray-200)',
                color: activeTab === tab.key ? '#fff' : 'var(--gray-600)',
                padding: '2px 8px',
                borderRadius: '10px',
                fontSize: '0.75rem',
                fontWeight: 700,
                minWidth: '20px',
                textAlign: 'center',
              }}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ─── User Management Tab ──────────────────────────── */}
      {activeTab === 'users' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">User Management</div>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '32px' }}>
              <span className="spinner spinner-lg" />
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td>{u.id}</td>
                      <td style={{ fontWeight: 600 }}>{u.full_name}</td>
                      <td>{u.phone}</td>
                      <td>{u.email}</td>
                      <td><span className="chip" style={{ textTransform: 'capitalize' }}>{u.role}</span></td>
                      <td>
                        <span className={`chip ${u.is_active ? 'chip-success' : 'chip-error'}`}>
                          {u.is_active ? 'Active' : 'Banned'}
                        </span>
                      </td>
                      <td>
                        {u.role !== 'admin' && (
                          <button
                            className={`btn btn-sm ${u.is_active ? 'btn-danger' : 'btn-success'}`}
                            onClick={() => handleToggleBan(u)}
                          >
                            {u.is_active ? <><FaBan size={12} /> Ban</> : <><FaCheck size={12} /> Unban</>}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ─── Pending Suppliers Tab ──────────────────────────── */}
      {activeTab === 'pending' && (
        <div className="card">
          <div className="card-header" style={{ borderBottom: '1px solid var(--gray-100)', paddingBottom: '16px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: 36, height: 36, borderRadius: '10px',
                background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <FaUserClock size={18} color="#d97706" />
              </div>
              <div>
                <div className="card-title">Pending Supplier Verifications</div>
                <div className="card-subtitle">Review and approve new supplier registrations</div>
              </div>
            </div>
            <span className="chip chip-warning">{pendingSuppliers.length} pending</span>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '32px' }}>
              <span className="spinner spinner-lg" />
            </div>
          ) : pendingSuppliers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--gray-400)' }}>
              <FaCheckCircle size={48} style={{ marginBottom: '16px', opacity: 0.4 }} />
              <div style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px' }}>All caught up!</div>
              <div style={{ fontSize: '0.9rem' }}>No pending supplier verifications.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {pendingSuppliers.map((sup) => (
                <div
                  key={sup.id}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '16px',
                    padding: '16px 20px',
                    background: 'var(--gray-50)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--gray-100)',
                    flexWrap: 'wrap',
                    transition: 'all 0.2s',
                  }}
                >
                  {/* Avatar */}
                  <div style={{
                    width: 44, height: 44, borderRadius: '12px',
                    background: 'linear-gradient(135deg, #FF7A00, #e06800)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontWeight: 800, fontSize: '0.85rem',
                    flexShrink: 0,
                  }}>
                    {sup.full_name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--gray-900)', marginBottom: '4px' }}>
                      {sup.full_name}
                    </div>
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '0.82rem', color: 'var(--gray-500)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <FaEnvelope size={11} /> {sup.email}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <FaMapMarkerAlt size={11} /> {sup.sp_address || sup.address || 'N/A'}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <FaClock size={11} /> {formatDate(sup.created_at)}
                      </span>
                    </div>
                    <div style={{ marginTop: '4px', fontSize: '0.82rem', color: 'var(--primary-600)', fontWeight: 600 }}>
                      {sup.price_per_unit} FCFA / {sup.unit_description || 'unit'}
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => handleVerifySupplier(sup.id)}
                      disabled={verifying === sup.id}
                      style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      {verifying === sup.id ? (
                        <><span className="spinner" style={{ width: 12, height: 12, borderWidth: 2 }} /> Verifying...</>
                      ) : (
                        <><FaCheck size={12} /> Approve</>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── Contact Messages Tab ──────────────────────────── */}
      {activeTab === 'messages' && (
        <div className="card">
          <div className="card-header" style={{ borderBottom: '1px solid var(--gray-100)', paddingBottom: '16px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: 36, height: 36, borderRadius: '10px',
                background: 'linear-gradient(135deg, var(--primary-50), var(--primary-100))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <FaEnvelope size={18} color="var(--primary-500)" />
              </div>
              <div>
                <div className="card-title">Contact Messages</div>
                <div className="card-subtitle">Messages received from the public contact form</div>
              </div>
            </div>
            <span className="chip">{contactMessages.length} messages</span>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '32px' }}>
              <span className="spinner spinner-lg" />
            </div>
          ) : contactMessages.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--gray-400)' }}>
              <FaEnvelope size={48} style={{ marginBottom: '16px', opacity: 0.4 }} />
              <div style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px' }}>No messages yet</div>
              <div style={{ fontSize: '0.9rem' }}>Messages from the contact page will appear here.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {contactMessages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    padding: '20px',
                    background: 'var(--gray-50)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--gray-100)',
                    transition: 'all 0.2s',
                  }}
                >
                  {/* Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: '10px',
                        background: 'linear-gradient(135deg, var(--primary-400), var(--primary-600))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontWeight: 800, fontSize: '0.8rem',
                        flexShrink: 0,
                      }}>
                        {msg.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--gray-900)' }}>
                          {msg.name}
                        </div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--primary-500)' }}>
                          {msg.email}
                        </div>
                      </div>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--gray-400)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <FaClock size={11} />
                      {formatDate(msg.created_at)}
                    </div>
                  </div>

                  {/* Message Body */}
                  <div style={{
                    padding: '14px 16px',
                    background: '#fff',
                    borderRadius: '8px',
                    border: '1px solid var(--gray-100)',
                    fontSize: '0.9rem',
                    color: 'var(--gray-700)',
                    lineHeight: '1.7',
                    whiteSpace: 'pre-wrap',
                  }}>
                    {msg.message}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
