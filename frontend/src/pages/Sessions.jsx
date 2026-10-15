import { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';
import ReviewModal from '../components/ReviewModal';
import DashboardLayout from '../components/DashboardLayout';

const Sessions = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('incoming');
  const [toast, setToast] = useState(null);
  const [reviewModal, setReviewModal] = useState(null);
  const [reviewedSessions, setReviewedSessions] = useState([]);

  useEffect(() => {
    fetchSessions();
    fetchReviewedSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await API.get('/sessions');
      setSessions(response.data);
    } catch (err) {
      console.error('Error fetching sessions:', err);
      setToast({ message: 'Failed to load sessions', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const fetchReviewedSessions = async () => {
    try {
      const response = await API.get('/sessions');
      const completedSessions = response.data.filter((s) => s.status === 'Completed');

      const reviewed = [];
      for (const session of completedSessions) {
        try {
          const checkRes = await API.get(`/reviews/check/${session._id}`);
          if (checkRes.data.hasReviewed) {
            reviewed.push(session._id);
          }
        } catch (err) {
          // Ignore
        }
      }
      setReviewedSessions(reviewed);
    } catch (err) {
      console.error('Error fetching reviewed sessions:', err);
    }
  };

  const updateStatus = async (sessionId, status) => {
    try {
      await API.put(`/sessions/${sessionId}`, { status });
      setToast({ message: `Session ${status.toLowerCase()} successfully!`, type: 'success' });
      fetchSessions();
    } catch (err) {
      setToast({ message: 'Failed to update session', type: 'error' });
    }
  };

  const handleReviewSuccess = () => {
    setReviewModal(null);
    setToast({ message: 'Review submitted successfully! ⭐', type: 'success' });
    fetchReviewedSessions();
  };

  // Split sessions
  const incomingSessions = sessions.filter((s) => s.mentor?._id === user?._id);
  const outgoingSessions = sessions.filter((s) => s.requester?._id === user?._id);

  const currentSessions = activeTab === 'incoming' ? incomingSessions : outgoingSessions;

  // Stats
  const pendingCount = incomingSessions.filter((s) => s.status === 'Pending').length;
  const acceptedCount = incomingSessions.filter((s) => s.status === 'Accepted').length;
  const completedCount = sessions.filter((s) => s.status === 'Completed').length;

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Pending': return { bg: '#FEF3C7', color: '#92400E', border: '#F59E0B', icon: '⏳' };
      case 'Accepted': return { bg: '#DBEAFE', color: '#1E40AF', border: '#3B82F6', icon: '✅' };
      case 'Completed': return { bg: '#D1FAE5', color: '#065F46', border: '#10B981', icon: '🎉' };
      case 'Rejected': return { bg: '#FEE2E2', color: '#991B1B', border: '#EF4444', icon: '❌' };
      case 'Cancelled': return { bg: '#F3F4F6', color: '#4B5563', border: '#6B7280', icon: '🚫' };
      default: return { bg: '#F3F4F6', color: '#4B5563', border: '#6B7280', icon: '📅' };
    }
  };

  return (
    <DashboardLayout>
      <div style={{ padding: '30px 35px' }}>

        {toast && (
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        )}

        {/* HEADER */}
        <div style={{ marginBottom: '25px' }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '800',
            color: 'var(--dark)',
            marginBottom: '6px',
            letterSpacing: '-0.5px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            📅 My Sessions
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--gray)' }}>
            Manage your learning sessions and requests
          </p>
        </div>

        {/* STATS CARDS */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px',
          marginBottom: '25px'
        }}>
          {/* Pending */}
          <div style={{
            background: 'var(--white)',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid var(--border)',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
            display: 'flex',
            alignItems: 'center',
            gap: '14px'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
              flexShrink: 0
            }}>
              ⏳
            </div>
            <div>
              <p style={{ fontSize: '11px', color: 'var(--gray)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '3px' }}>
                Pending
              </p>
              <p style={{ fontSize: '24px', fontWeight: '800', color: 'var(--dark)', lineHeight: 1 }}>
                {pendingCount}
              </p>
            </div>
          </div>

          {/* Accepted */}
          <div style={{
            background: 'var(--white)',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid var(--border)',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
            display: 'flex',
            alignItems: 'center',
            gap: '14px'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
              flexShrink: 0
            }}>
              ✅
            </div>
            <div>
              <p style={{ fontSize: '11px', color: 'var(--gray)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '3px' }}>
                Accepted
              </p>
              <p style={{ fontSize: '24px', fontWeight: '800', color: 'var(--dark)', lineHeight: 1 }}>
                {acceptedCount}
              </p>
            </div>
          </div>

          {/* Completed */}
          <div style={{
            background: 'var(--white)',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid var(--border)',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
            display: 'flex',
            alignItems: 'center',
            gap: '14px'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
              flexShrink: 0
            }}>
              🎉
            </div>
            <div>
              <p style={{ fontSize: '11px', color: 'var(--gray)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '3px' }}>
                Completed
              </p>
              <p style={{ fontSize: '24px', fontWeight: '800', color: 'var(--dark)', lineHeight: 1 }}>
                {completedCount}
              </p>
            </div>
          </div>
        </div>
        

        {/* TABS */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '25px',
          background: 'var(--white)',
          padding: '6px',
          borderRadius: '14px',
          border: '1px solid var(--border)',
          boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)'
        }}>
          <button
            onClick={() => setActiveTab('incoming')}
            style={{
              flex: 1,
              padding: '12px 20px',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '700',
              background: activeTab === 'incoming'
                ? 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)'
                : 'transparent',
              color: activeTab === 'incoming' ? '#fff' : 'var(--gray)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.25s ease',
              border: 'none',
              cursor: 'pointer',
              boxShadow: activeTab === 'incoming' ? '0 4px 12px rgba(59, 130, 246, 0.25)' : 'none'
            }}
          >
            <span>📥</span>
            <span>Requests to Me</span>
            <span style={{
              background: activeTab === 'incoming' ? 'rgba(255,255,255,0.25)' : 'var(--light-gray)',
              color: activeTab === 'incoming' ? '#fff' : 'var(--gray)',
              padding: '2px 9px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: '700'
            }}>
              {incomingSessions.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('outgoing')}
            style={{
              flex: 1,
              padding: '12px 20px',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '700',
              background: activeTab === 'outgoing'
                ? 'linear-gradient(135deg, #A855F7 0%, #6366F1 100%)'
                : 'transparent',
              color: activeTab === 'outgoing' ? '#fff' : 'var(--gray)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.25s ease',
              border: 'none',
              cursor: 'pointer',
              boxShadow: activeTab === 'outgoing' ? '0 4px 12px rgba(168, 85, 247, 0.25)' : 'none'
            }}
          >
            <span>📤</span>
            <span>My Requests</span>
            <span style={{
              background: activeTab === 'outgoing' ? 'rgba(255,255,255,0.25)' : 'var(--light-gray)',
              color: activeTab === 'outgoing' ? '#fff' : 'var(--gray)',
              padding: '2px 9px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: '700'
            }}>
              {outgoingSessions.length}
            </span>
          </button>
        </div>

        {/* Sessions List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div className="spinner"></div>
            <p style={{ color: 'var(--gray)', marginTop: '15px' }}>Loading sessions...</p>
          </div>
        ) : currentSessions.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '80px 20px',
            background: 'var(--white)',
            borderRadius: '16px',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.06)',
            border: '1px solid var(--border)'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '15px' }}>
              {activeTab === 'incoming' ? '📥' : '📤'}
            </div>
            <p style={{ color: 'var(--dark)', fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>
              {activeTab === 'incoming' ? 'No session requests yet' : "You haven't requested any sessions yet"}
            </p>
            <p style={{ color: 'var(--gray)', fontSize: '15px' }}>
              {activeTab === 'incoming'
                ? 'When students request sessions with you, they will appear here.'
                : 'Go to Explore Matches to find students and book sessions!'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {currentSessions.map((session) => {
              const otherPerson = activeTab === 'incoming' ? session.requester : session.mentor;
              const statusStyle = getStatusStyle(session.status);
              const isPending = session.status === 'Pending';
              const isAccepted = session.status === 'Accepted';
              const isCompleted = session.status === 'Completed';
              const isReviewed = reviewedSessions.includes(session._id);

              return (
                <div
                  key={session._id}
                  className="card-hover"
                  style={{
                    background: 'var(--white)',
                    padding: '24px',
                    borderRadius: '16px',
                    boxShadow: '0 2px 10px rgba(15, 23, 42, 0.06)',
                    border: '1px solid var(--border)',
                    borderLeft: `5px solid ${statusStyle.border}`,
                    position: 'relative'
                  }}
                >
                  {/* TOP ROW: User + Status */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px', flexWrap: 'wrap', gap: '15px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{
                        width: '54px',
                        height: '54px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #3B82F6 0%, #A855F7 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontWeight: '800',
                        fontSize: '20px',
                        flexShrink: 0,
                        overflow: 'hidden'
                      }}>
                        {otherPerson?.avatar ? (
                          <img
                            src={
                              otherPerson.avatar.startsWith('http')
                                ? otherPerson.avatar
                                : `http://localhost:5000${otherPerson.avatar}`
                            }
                            alt={otherPerson.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.parentElement.textContent = otherPerson.name?.charAt(0).toUpperCase() || '?';
                            }}
                          />
                        ) : (
                          otherPerson?.name?.charAt(0).toUpperCase() || '?'
                        )}
                      </div>
                      <div>
                        <h3 style={{ fontSize: '17px', fontWeight: '700', color: 'var(--dark)', marginBottom: '3px' }}>
                          {otherPerson?.name || 'Unknown User'}
                        </h3>
                        <p style={{ fontSize: '12px', color: 'var(--gray)' }}>
                          {activeTab === 'incoming' ? '📥 Requesting from you' : '📤 You requested'}
                        </p>
                      </div>
                    </div>

                    <span style={{
                      padding: '8px 18px',
                      background: statusStyle.bg,
                      color: statusStyle.color,
                      borderRadius: '20px',
                      fontSize: '13px',
                      fontWeight: '800',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      letterSpacing: '0.3px'
                    }}>
                      {statusStyle.icon} {session.status}
                    </span>
                  </div>

                  {/* SKILL CARD */}
                  <div style={{
                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.06) 0%, rgba(168, 85, 247, 0.06) 100%)',
                    padding: '16px 20px',
                    borderRadius: '12px',
                    marginBottom: '16px',
                    border: '1px solid rgba(99, 102, 241, 0.15)'
                  }}>
                    <p style={{ fontSize: '11px', color: 'var(--gray)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>
                      🎯 Skill
                    </p>
                    <p style={{ fontSize: '17px', color: 'var(--dark)', fontWeight: '700' }}>
                      {session.skill}
                    </p>
                  </div>

                  {/* DETAILS GRID */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                    gap: '14px',
                    marginBottom: '18px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '18px' }}>📅</span>
                      <div>
                        <p style={{ fontSize: '11px', color: 'var(--gray)', fontWeight: '600' }}>Date</p>
                        <p style={{ fontSize: '13px', color: 'var(--dark)', fontWeight: '700' }}>{session.date}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '18px' }}>⏰</span>
                      <div>
                        <p style={{ fontSize: '11px', color: 'var(--gray)', fontWeight: '600' }}>Time</p>
                        <p style={{ fontSize: '13px', color: 'var(--dark)', fontWeight: '700' }}>{session.time}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '18px' }}>{session.mode === 'Online' ? '💻' : '📍'}</span>
                      <div>
                        <p style={{ fontSize: '11px', color: 'var(--gray)', fontWeight: '600' }}>Mode</p>
                        <p style={{ fontSize: '13px', color: 'var(--dark)', fontWeight: '700' }}>{session.mode}</p>
                      </div>
                    </div>
                  </div>

                  {/* MESSAGE */}
                  {session.message && (
                    <div style={{
                      padding: '14px 18px',
                      background: 'var(--light-gray)',
                      borderRadius: '10px',
                      marginBottom: '18px',
                      borderLeft: '3px solid #6366F1'
                    }}>
                      <p style={{ fontSize: '11px', color: '#6366F1', fontWeight: '700', marginBottom: '6px', letterSpacing: '0.5px' }}>
                        💬 MESSAGE
                      </p>
                      <p style={{ fontSize: '13px', color: 'var(--dark)', lineHeight: '1.6' }}>
                        {session.message}
                      </p>
                    </div>
                  )}

                  {/* ACTION BUTTONS */}
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                    {/* Incoming - Pending */}
                    {activeTab === 'incoming' && isPending && (
                      <>
                        <button
                          onClick={() => updateStatus(session._id, 'Accepted')}
                          style={{
                            flex: 1,
                            minWidth: '140px',
                            padding: '12px 20px',
                            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                            color: '#fff',
                            borderRadius: '10px',
                            fontSize: '14px',
                            fontWeight: '700',
                            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)',
                            border: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          ✅ Accept
                        </button>
                        <button
                          onClick={() => updateStatus(session._id, 'Rejected')}
                          style={{
                            flex: 1,
                            minWidth: '140px',
                            padding: '12px 20px',
                            background: 'var(--danger-light)',
                            color: '#DC2626',
                            borderRadius: '10px',
                            fontSize: '14px',
                            fontWeight: '700',
                            border: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          ❌ Reject
                        </button>
                      </>
                    )}

                    {/* Incoming - Accepted */}
                    {activeTab === 'incoming' && isAccepted && (
                      <button
                        onClick={() => updateStatus(session._id, 'Completed')}
                        style={{
                          flex: 1,
                          minWidth: '180px',
                          padding: '12px 20px',
                          background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
                          color: '#fff',
                          borderRadius: '10px',
                          fontSize: '14px',
                          fontWeight: '700',
                          boxShadow: '0 4px 12px rgba(59, 130, 246, 0.25)',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        🎉 Mark as Completed
                      </button>
                    )}

                    {/* Outgoing - Pending */}
                    {activeTab === 'outgoing' && isPending && (
                      <button
                        onClick={() => updateStatus(session._id, 'Cancelled')}
                        style={{
                          flex: 1,
                          minWidth: '180px',
                          padding: '12px 20px',
                          background: 'var(--light-gray)',
                          color: 'var(--gray)',
                          borderRadius: '10px',
                          fontSize: '14px',
                          fontWeight: '700',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        🚫 Cancel Request
                      </button>
                    )}

                    {/* Completed - Leave Review */}
                    {isCompleted && !isReviewed && (
                      <button
                        onClick={() => setReviewModal({
                          session,
                          reviewee: activeTab === 'incoming' ? session.requester : session.mentor
                        })}
                        style={{
                          flex: 1,
                          minWidth: '200px',
                          padding: '12px 20px',
                          background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                          color: '#fff',
                          borderRadius: '10px',
                          fontSize: '14px',
                          fontWeight: '700',
                          boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        ⭐ Leave a Review
                      </button>
                    )}

                    {/* Completed - Reviewed */}
                    {isCompleted && isReviewed && (
                      <p style={{
                        flex: 1,
                        padding: '12px 20px',
                        textAlign: 'center',
                        color: '#065F46',
                        fontSize: '14px',
                        fontWeight: '700',
                        background: '#D1FAE5',
                        borderRadius: '10px',
                        margin: 0
                      }}>
                        ✅ Review Submitted
                      </p>
                    )}

                    {/* Rejected */}
                    {session.status === 'Rejected' && (
                      <p style={{
                        flex: 1,
                        padding: '12px 20px',
                        textAlign: 'center',
                        color: '#991B1B',
                        fontSize: '14px',
                        fontWeight: '600',
                        background: '#FEE2E2',
                        borderRadius: '10px',
                        margin: 0
                      }}>
                        This session was rejected
                      </p>
                    )}

                    {/* Cancelled */}
                    {session.status === 'Cancelled' && (
                      <p style={{
                        flex: 1,
                        padding: '12px 20px',
                        textAlign: 'center',
                        color: '#4B5563',
                        fontSize: '14px',
                        fontWeight: '600',
                        background: '#F3F4F6',
                        borderRadius: '10px',
                        margin: 0
                      }}>
                        You cancelled this request
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Review Modal */}
        {reviewModal && (
          <ReviewModal
            session={reviewModal.session}
            reviewee={reviewModal.reviewee}
            onClose={() => setReviewModal(null)}
            onSuccess={handleReviewSuccess}
          />
        )}

      </div>
    </DashboardLayout>
  );
};

export default Sessions;