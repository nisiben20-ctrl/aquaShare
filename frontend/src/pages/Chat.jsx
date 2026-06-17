import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { messages as msgApi, requests as reqApi } from '../services/api';
import {
  FaPaperPlane, FaImage, FaMapMarkerAlt, FaChevronLeft, FaCalendar,
  FaTint, FaCommentAlt, FaTimes, FaMap, FaSearch, FaPhone
} from 'react-icons/fa';

const BUEA_LANDMARKS = [
  { name: 'Molyko - Beside University of Buea', lat: 4.1565, lng: 9.2718 },
  { name: 'Mile 17 - Motor Park', lat: 4.1489, lng: 9.2825 },
  { name: 'Bonduma - Near Petrol Station', lat: 4.1633, lng: 9.2601 },
  { name: 'Malingo - Street 1', lat: 4.1610, lng: 9.2785 },
  { name: 'Clerks Quarters - Near Governor\'s Office', lat: 4.1522, lng: 9.2392 },
  { name: 'Buea Town - Government Station', lat: 4.1578, lng: 9.2281 },
];

export default function Chat() {
  const { user } = useAuth();
  const routerLocation = useLocation();
  const navigate = useNavigate();
  
  const [requestsList, setRequestsList] = useState([]);
  const [activeRequest, setActiveRequest] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Read initial request_id from query params or navigation state
  useEffect(() => {
    const searchParams = new URLSearchParams(routerLocation.search);
    const initialId = searchParams.get('request_id') || routerLocation.state?.requestId;
    
    const loadRequests = async () => {
      setLoadingRequests(true);
      try {
        const res = await reqApi.getAll();
        if (res.data) {
          // Sort requests by newest first
          const sorted = [...res.data].sort((a, b) => b.id - a.id);
          setRequestsList(sorted);
          
          if (initialId) {
            const req = sorted.find(r => r.id === Number(initialId));
            if (req) {
              setActiveRequest(req);
            }
          } else if (sorted.length > 0 && !activeRequest) {
            // Do not auto-select on mobile to show requests list first
            if (window.innerWidth > 768) {
              setActiveRequest(sorted[0]);
            }
          }
        }
      } catch (err) {
        console.error('Error loading requests:', err);
      } finally {
        setLoadingRequests(false);
      }
    };
    
    loadRequests();
  }, [routerLocation]);

  // Load messages whenever the active request changes
  useEffect(() => {
    if (!activeRequest) return;
    
    const fetchMessages = async (showLoading = true) => {
      if (showLoading) setLoadingMessages(true);
      try {
        const res = await msgApi.get(activeRequest.id);
        if (res.data) {
          setMessages(res.data);
        }
      } catch (err) {
        console.error('Error fetching messages:', err);
      } finally {
        if (showLoading) setLoadingMessages(false);
      }
    };

    fetchMessages();
    
    // Set up auto polling for real-time chat feeling
    const interval = setInterval(() => {
      fetchMessages(false);
    }, 3000);

    return () => clearInterval(interval);
  }, [activeRequest]);

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loadingMessages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !activeRequest) return;

    const text = inputText;
    setInputText('');

    try {
      const res = await msgApi.send({
        requestId: activeRequest.id,
        type: 'text',
        body: text
      });
      if (res.data) {
        setMessages(prev => [...prev, res.data]);
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const handleSendLocation = async (landmark) => {
    if (!activeRequest) return;
    setShowLocationModal(false);

    const bodyData = JSON.stringify({
      name: landmark.name,
      lat: landmark.lat,
      lng: landmark.lng
    });

    try {
      const res = await msgApi.send({
        requestId: activeRequest.id,
        type: 'location',
        body: bodyData
      });
      if (res.data) {
        setMessages(prev => [...prev, res.data]);
      }
    } catch (err) {
      console.error('Failed to send location:', err);
    }
  };

  const handleImageUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !activeRequest) return;

    try {
      setLoadingMessages(true);
      const res = await msgApi.sendImage({
        requestId: activeRequest.id,
        file
      });
      if (res.data) {
        setMessages(prev => [...prev, res.data]);
      }
    } catch (err) {
      console.error('Failed to upload image:', err);
    } finally {
      setLoadingMessages(false);
    }
  };

  const formatTime = (timeStr) => {
    try {
      const parts = timeStr.split(' ');
      if (parts.length === 2) {
        // HH:MM
        return parts[1].substring(0, 5);
      }
      return new Date(timeStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return timeStr;
    }
  };

  const filteredRequests = requestsList.filter(req => {
    const partnerName = user.role === 'supplier' ? req.resident_name : req.supplier_name;
    return partnerName?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="chat-container animate-in">
      <div className="chat-layout-grid" style={{
        display: 'grid',
        gridTemplateColumns: activeRequest ? '320px 1fr' : '1fr',
        height: '100%',
      }}>
        
        {/* Sidebar: Requests thread list */}
        <div className={`chat-sidebar-pane ${activeRequest ? 'has-active' : ''}`} style={{
          borderRight: '1px solid var(--gray-100)',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          background: 'var(--white)'
        }}>
          <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid var(--gray-100)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-.02em', marginBottom: '12px' }}>Messages</h3>
            
            <div className="search-wrapper" style={{ margin: 0 }}>
              <FaSearch size={15} className="search-icon" />
              <input 
                className="form-input" 
                placeholder="Search conversations..." 
                style={{ paddingLeft: '38px', borderRadius: 'var(--radius-full)', background: 'var(--gray-50)', padding: '8px 16px 8px 38px', fontSize: '.875rem' }}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '12px 12px 20px' }}>
            {loadingRequests ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '32px' }}>
                <span className="spinner" />
              </div>
            ) : filteredRequests.length === 0 ? (
              <div className="empty-state" style={{ padding: '32px 16px' }}>
                <FaCommentAlt size={36} className="empty-state-icon" style={{ opacity: 0.5 }} />
                <div className="empty-state-title" style={{ fontSize: '.9375rem' }}>No conversations</div>
                <div className="empty-state-text" style={{ fontSize: '.8125rem' }}>
                  {searchTerm ? 'No results for your search.' : 'Place or accept a request to begin chatting.'}
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {filteredRequests.map((req) => {
                  const partnerName = user.role === 'supplier' ? req.resident_name : req.supplier_name;
                  const isSelected = activeRequest?.id === req.id;
                  
                  return (
                    <div
                      key={req.id}
                      onClick={() => setActiveRequest(req)}
                      className="chat-thread-item"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 14px',
                        borderRadius: 'var(--radius-md)',
                        cursor: 'pointer',
                        background: isSelected ? 'var(--primary-50)' : 'transparent',
                        border: isSelected ? '1px solid rgba(14,165,233,0.15)' : '1px solid transparent',
                      }}
                    >
                      <div className="avatar avatar-sm" style={{ 
                        background: isSelected 
                          ? 'linear-gradient(135deg, var(--primary-500), var(--primary-700))'
                          : 'linear-gradient(135deg, var(--gray-400), var(--gray-600))'
                      }}>
                        {partnerName ? partnerName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : '?'}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ 
                          fontWeight: isSelected ? 700 : 600, 
                          fontSize: '.875rem', 
                          color: isSelected ? 'var(--primary-700)' : 'var(--text-primary)',
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' 
                        }}>
                          {partnerName}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2px', alignItems: 'center' }}>
                          <span style={{ fontSize: '.75rem', color: 'var(--gray-500)' }}>
                            {req.quantity} units requested
                          </span>
                          <span className={`chip chip-neutral`} style={{ padding: '2px 6px', fontSize: '.65rem', background: 'var(--gray-100)', color: 'var(--gray-500)' }}>
                            {req.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Main: Message view */}
        {activeRequest ? (
          <div className="chat-messages-pane" style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            background: 'var(--white)'
          }}>
            {/* Chat header */}
            <div className="chat-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1 }}>
                <button
                  className="btn btn-icon btn-ghost mobile-back-btn"
                  onClick={() => setActiveRequest(null)}
                  style={{ display: 'none', width: '36px', height: '36px' }}
                >
                   <FaChevronLeft size={20} />
                </button>
                <div className="avatar" style={{ background: 'linear-gradient(135deg, var(--primary-400), var(--primary-600))' }}>
                  {(user.role === 'supplier' ? activeRequest.resident_name : activeRequest.supplier_name)?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1rem', letterSpacing: '-.01em' }}>
                    {user.role === 'supplier' ? activeRequest.resident_name : activeRequest.supplier_name}
                  </div>
                  <div className="text-xs text-muted" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '1px' }}>
                    <span style={{ fontWeight: 500, color: 'var(--primary-600)' }}>Req #{activeRequest.id}</span>
                    <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--gray-300)' }} />
                    <span style={{ textTransform: 'capitalize' }}>{activeRequest.status}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <a href={`tel:${user.role === 'supplier' ? activeRequest.resident_phone : activeRequest.supplier_phone}`} 
                   className="btn btn-icon btn-ghost" 
                   style={{ color: 'var(--primary-600)', background: 'var(--primary-50)' }}
                   title="Call">
                   <FaPhone size={18} />
                </a>
                <div className="text-xs text-muted" style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--gray-50)', padding: '6px 10px', borderRadius: 'var(--radius-full)' }}>
                  <FaCalendar size={13} color="var(--gray-400)" />
                  <span style={{ fontWeight: 500 }}>{activeRequest.created_at.split(' ')[0]}</span>
                </div>
              </div>
            </div>

            {/* Messages box */}
            <div className="chat-messages">
              {/* Initial Request Note */}
              <div style={{
                alignSelf: 'center',
                background: 'linear-gradient(135deg, var(--primary-50), var(--primary-100))',
                color: 'var(--primary-900)',
                padding: '16px 20px',
                borderRadius: 'var(--radius-lg)',
                maxWidth: '85%',
                fontSize: '.875rem',
                border: '1px solid rgba(14,165,233,0.15)',
                marginBottom: '16px',
                textAlign: 'center',
                boxShadow: '0 4px 12px rgba(2,132,199,0.05)',
                marginTop: '10px'
              }}>
                <div style={{ fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '6px', color: 'var(--primary-700)' }}>
                  <FaTint size={18} /> Water Request Placed
                </div>
                <div style={{ marginBottom: activeRequest.note ? '8px' : '0' }}>
                  Requested Quantity: <strong style={{ color: 'var(--primary-600)', fontSize: '1.05em' }}>{activeRequest.quantity} units</strong>
                </div>
                {activeRequest.note && (
                  <div style={{ fontStyle: 'italic', color: 'var(--primary-800)', opacity: 0.85, background: 'rgba(255,255,255,0.5)', padding: '8px 12px', borderRadius: 'var(--radius-sm)' }}>
                    "{activeRequest.note}"
                  </div>
                )}
              </div>

              {loadingMessages ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                  <span className="spinner" />
                </div>
              ) : messages.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--gray-400)', padding: '32px', fontSize: '.875rem' }}>
                  No messages yet. Say hello and finalize delivery details!
                </div>
              ) : (
                messages.map((msg) => {
                  const isOwn = Number(msg.sender_id) === Number(user.id);
                  
                  return (
                    <div
                      key={msg.id}
                      className={`chat-bubble ${isOwn ? 'chat-bubble-sent' : 'chat-bubble-received'}`}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px'
                      }}
                    >
                      {!isOwn && (
                        <span style={{ fontSize: '.65rem', fontWeight: 700, opacity: 0.6, display: 'block', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: '2px' }}>
                          {msg.sender_name}
                        </span>
                      )}
                      
                      {/* Text Type */}
                      {msg.type === 'text' && (
                        <p style={{ margin: 0, wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
                          {msg.body}
                        </p>
                      )}

                      {/* Image Type */}
                      {msg.type === 'image' && (
                        <div style={{ borderRadius: 'var(--radius-sm)', overflow: 'hidden', marginTop: '4px' }}>
                          <img
                            src={msg.body}
                            alt="Attachment"
                            style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'cover' }}
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                          <a
                            href={msg.body}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ fontSize: '.75rem', color: isOwn ? '#e0f2fe' : 'var(--primary-600)', display: 'inline-block', marginTop: '6px', fontWeight: 600 }}
                          >
                            View Original ↗
                          </a>
                        </div>
                      )}

                      {/* Location Type */}
                      {msg.type === 'location' && (() => {
                        let loc = { name: 'Shared Location', lat: 0, lng: 0 };
                        try { loc = JSON.parse(msg.body); } catch {}
                        
                        return (
                          <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px',
                            background: isOwn ? 'rgba(0,0,0,0.1)' : 'var(--gray-50)',
                            padding: '12px',
                            borderRadius: 'var(--radius-md)',
                            border: `1px solid ${isOwn ? 'rgba(255,255,255,0.15)' : 'var(--gray-200)'}`
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '.875rem', fontWeight: 600 }}>
                              <FaMapMarkerAlt size={18} style={{ color: isOwn ? '#bae6fd' : 'var(--primary-500)' }} />
                              <span style={{ lineHeight: 1.3 }}>{loc.name}</span>
                            </div>
                            <a
                              href={`https://www.google.com/maps/search/?api=1&query=${loc.lat},${loc.lng}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-sm"
                              style={{
                                fontSize: '.75rem',
                                padding: '6px 12px',
                                background: isOwn ? 'rgba(255,255,255,0.2)' : 'var(--white)',
                                color: isOwn ? 'var(--white)' : 'var(--primary-600)',
                                border: isOwn ? 'none' : '1px solid var(--primary-200)',
                                justifyContent: 'center',
                                marginTop: '4px'
                              }}
                            >
                              <FaMap size={14} /> Open in Maps
                            </a>
                          </div>
                        );
                      })()}

                      <span className="chat-bubble-time" style={{
                        alignSelf: 'flex-end',
                        color: isOwn ? 'rgba(255,255,255,0.7)' : 'var(--gray-500)'
                      }}>
                        {formatTime(msg.created_at)}
                      </span>
                    </div>
                  );
                })
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input area */}
            <form onSubmit={handleSendMessage} className="chat-input-area">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageFileChange}
                accept="image/*"
                style={{ display: 'none' }}
              />
              
              <div style={{ display: 'flex', gap: '4px' }}>
                <button
                  type="button"
                  className="btn btn-ghost btn-icon"
                  onClick={handleImageUploadClick}
                  style={{ width: '38px', height: '38px', color: 'var(--gray-500)' }}
                  title="Send Image"
                >
                   <FaImage size={18} />
                </button>

                <button
                  type="button"
                  className="btn btn-ghost btn-icon"
                  onClick={() => setShowLocationModal(true)}
                  style={{ width: '38px', height: '38px', color: 'var(--gray-500)' }}
                  title="Share Location Pin"
                >
                   <FaMapMarkerAlt size={18} />
                </button>
              </div>

              <input
                className="chat-input"
                placeholder="Type a message..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />

              <button
                type="submit"
                className="chat-send-btn"
                disabled={!inputText.trim()}
              >
                <FaPaperPlane size={16} />
              </button>
            </form>
          </div>
        ) : (
          <div className="chat-messages-pane empty-state-pane" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--gray-50)',
            padding: '48px',
            textAlign: 'center',
            height: '100%'
          }}>
            <FaCommentAlt size={56} className="empty-state-icon" style={{ opacity: 0.2 }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--gray-900)' }}>No conversation active</h3>
            <p className="text-muted" style={{ maxWidth: '300px', fontSize: '.9375rem', marginTop: '8px' }}>
              Select a conversation from the sidebar to view details and begin messaging.
            </p>
          </div>
        )}

      </div>

      {/* Location sharing dialog modal */}
      {showLocationModal && (
        <div className="modal-backdrop" onClick={() => setShowLocationModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ padding: '24px' }}>
            <div className="modal-header" style={{ marginBottom: '16px', paddingBottom: '12px' }}>
              <div className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaMapMarkerAlt size={20} color="var(--primary-500)" /> Share Location
              </div>
              <button className="modal-close" onClick={() => setShowLocationModal(false)}>
                <FaTimes size={18} />
              </button>
            </div>
            <p className="text-sm text-muted" style={{ marginBottom: '20px' }}>
              Select a Buea landmark to send as your delivery drop-off or pickup point:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {BUEA_LANDMARKS.map((landmark) => (
                <button
                  key={landmark.name}
                  className="btn btn-secondary btn-block"
                  onClick={() => handleSendLocation(landmark)}
                  style={{
                    justifyContent: 'flex-start',
                    textAlign: 'left',
                    padding: '12px 16px',
                    borderColor: 'var(--gray-200)',
                    fontWeight: 600,
                    fontSize: '.875rem'
                  }}
                >
                  <FaMapMarkerAlt size={16} style={{ color: 'var(--primary-400)', marginRight: '8px', flexShrink: 0 }} />
                  {landmark.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
