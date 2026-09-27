import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';
import BookingModal from '../components/BookingModal';

const Matches = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [bookingModal, setBookingModal] = useState(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await API.get('/match');
        setMatches(response.data);
      } catch (err) {
        console.error('Error fetching matches:', err);
        setToast({ message: 'Failed to load matches', type: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, []);

  const getScoreColor = (score) => {
    if (score >= 90) return '#10B981';
    if (score >= 70) return '#F59E0B';
    return '#6B7280';
  };

  return (
    <div className="container" style={{ padding: '40px 20px', maxWidth: '900px', margin: '0 auto' }}>
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{
          display: 'inline-block',
          background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
          color: '#fff',
          padding: '8px 20px',
          borderRadius: '30px',
          fontSize: '14px',
          fontWeight: '600',
          marginBottom: '20px'
        }}>
          🤝 Skill Exchange Matches
        </div>
        <h1 style={{ fontSize: '36px', fontWeight: '800', color: 'var(--dark)', marginBottom: '10px', letterSpacing: '-0.5px' }}>
          Your Perfect Matches
        </h1>
        <p style={{ fontSize: '16px', color: 'var(--gray)', maxWidth: '600px', margin: '0 auto' }}>
          Find students who can teach you what you want to learn, and want to learn what you can teach.
        </p>
      </div>

      {/* Your Skills Summary */}
      <div style={{
        background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
        color: '#fff',
        padding: '25px',
        borderRadius: '16px',
        marginBottom: '30px',
        boxShadow: '0 10px 25px rgba(59, 130, 246, 0.2)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '15px' }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🎓 Skills I Can Teach
            </h3>
            {user?.skillsOffered?.length > 0 ? (
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {user.skillsOffered.map((skill, i) => (
                  <span key={i} style={{
                    background: 'rgba(255,255,255,0.2)',
                    padding: '5px 12px',
                    borderRadius: '20px',
                    fontSize: '13px',
                    fontWeight: '600'
                  }}>
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p style={{ opacity: 0.8, fontSize: '14px' }}>
                No skills added yet.{' '}
                <Link to="/profile" style={{ color: '#FDE68A', fontWeight: '600', textDecoration: 'underline' }}>
                  Add now →
                </Link>
              </p>
            )}
          </div>

          <div style={{ flex: 1, minWidth: '200px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              📖 Skills I Want to Learn
            </h3>
            {user?.skillsWanted?.length > 0 ? (
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {user.skillsWanted.map((skill, i) => (
                  <span key={i} style={{
                    background: 'rgba(255,255,255,0.2)',
                    padding: '5px 12px',
                    borderRadius: '20px',
                    fontSize: '13px',
                    fontWeight: '600'
                  }}>
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p style={{ opacity: 0.8, fontSize: '14px' }}>
                No skills added yet.{' '}
                <Link to="/profile" style={{ color: '#FDE68A', fontWeight: '600', textDecoration: 'underline' }}>
                  Add now →
                </Link>
              </p>
            )}
          </div>
        </div>

        <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
          <Link to="/profile">
            <button style={{
              padding: '10px 24px',
              background: '#fff',
              color: '#3B82F6',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '700',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              ✏️ Edit My Skills
            </button>
          </Link>
        </div>
      </div>

      {/* Matches List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div className="spinner"></div>
          <p style={{ color: 'var(--gray)', marginTop: '15px' }}>Finding your matches...</p>
        </div>
      ) : matches.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '80px 20px',
          background: 'var(--white)',
          borderRadius: '16px',
          boxShadow: '0 2px 8px rgba(15, 23, 42, 0.06)',
          border: '1px solid var(--border)'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '15px' }}>🔍</div>
          <p style={{ color: 'var(--dark)', fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>
            No matches found yet
          </p>
          <p style={{ color: 'var(--gray)', fontSize: '15px', marginBottom: '25px', maxWidth: '400px', margin: '0 auto 25px' }}>
            {user?.skillsOffered?.length === 0 || user?.skillsWanted?.length === 0
              ? 'Please add your skills (both offered and wanted) to find matches.'
              : 'No students match with your skills yet. Check back later!'}
          </p>
          <Link to="/profile">
            <button style={{
              padding: '14px 32px',
              background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
              color: '#fff',
              borderRadius: '10px',
              fontSize: '15px',
              fontWeight: '600',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
            }}>
              Update My Skills
            </button>
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {matches.map((match) => (
            <div
              key={match.user._id}
              className="card-hover"
              style={{
                background: 'var(--white)',
                padding: '25px',
                borderRadius: '16px',
                boxShadow: '0 2px 8px rgba(15, 23, 42, 0.06)',
                border: '1px solid var(--border)',
                borderLeft: match.isPerfectMatch
                  ? '4px solid #10B981'
                  : '4px solid #F59E0B'
              }}
            >
              {/* Match Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: '700',
                    fontSize: '24px',
                    flexShrink: 0
                  }}>
                    {match.user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--dark)', marginBottom: '3px' }}>
                      {match.user.name}
                    </h3>
                    <p style={{ fontSize: '13px', color: 'var(--gray)' }}>
                      {match.user.university || 'University not specified'}
                    </p>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    background: match.isPerfectMatch ? '#D1FAE5' : '#FEF3C7',
                    color: match.isPerfectMatch ? '#065F46' : '#92400E',
                    fontWeight: '700',
                    fontSize: '14px'
                  }}>
                    {match.isPerfectMatch ? '🎯 Perfect Match' : '🔸 Partial Match'}
                  </div>
                  <p style={{
                    marginTop: '8px',
                    fontSize: '24px',
                    fontWeight: '800',
                    color: getScoreColor(match.matchScore)
                  }}>
                    {match.matchScore}%
                  </p>
                </div>
              </div>

              {/* Match Details */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto 1fr',
                gap: '20px',
                alignItems: 'center',
                padding: '20px',
                background: 'var(--light-gray)',
                borderRadius: '12px',
                marginBottom: '20px'
              }}>
                <div>
                  <p style={{
                    fontSize: '12px',
                    fontWeight: '700',
                    color: '#10B981',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '10px'
                  }}>
                    ⬇️ They Can Teach You
                  </p>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {match.theyCanTeachMe.map((skill, i) => (
                      <span key={i} style={{
                        background: '#D1FAE5',
                        color: '#065F46',
                        padding: '4px 10px',
                        borderRadius: '16px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: '22px',
                  fontWeight: '700',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                }}>
                  ⇄
                </div>

                <div>
                  <p style={{
                    fontSize: '12px',
                    fontWeight: '700',
                    color: '#3B82F6',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '10px'
                  }}>
                    ⬆️ You Can Teach Them
                  </p>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {match.iCanTeachThem.map((skill, i) => (
                      <span key={i} style={{
                        background: '#DBEAFE',
                        color: '#1E40AF',
                        padding: '4px 10px',
                        borderRadius: '16px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                  onClick={() => navigate(`/book/${match.user._id}`)}
                  style={{
                    flex: 1,
                    minWidth: '200px',
                    padding: '12px 20px',
                    background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
                    color: '#fff',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: '600',
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.25)'
                  }}
                >
                  📅 Request Session
                </button>
                <button
                  onClick={() => setToast({ message: 'Messaging feature coming soon!', type: 'info' })}
                  style={{
                    flex: 1,
                    minWidth: '200px',
                    padding: '12px 20px',
                    background: 'var(--light-gray)',
                    color: 'var(--dark)',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  💬 Send Message
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking Modal */}
      {bookingModal && (
        <BookingModal
          mentor={bookingModal.mentor}
          skill={bookingModal.skill}
          onClose={() => setBookingModal(null)}
          onSuccess={() => {
            setBookingModal(null);
            setToast({ message: 'Session request sent successfully!', type: 'success' });
          }}
        />
      )}
    </div>
  );
};

export default Matches;