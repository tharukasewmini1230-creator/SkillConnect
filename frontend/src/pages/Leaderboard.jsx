import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';

const Leaderboard = () => {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('top');

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await API.get('/points/leaderboard');
      setLeaderboard(response.data);
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  // Find current user's rank
  const myRank = leaderboard.findIndex((u) => u._id === user?._id) + 1;
  const myData = leaderboard.find((u) => u._id === user?._id);

  // Top 3 for podium
  const top3 = leaderboard.slice(0, 3);
  const others = leaderboard.slice(3);

  const getRankIcon = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const getRankColor = (rank) => {
    if (rank === 1) return '#F59E0B';
    if (rank === 2) return '#9CA3AF';
    if (rank === 3) return '#B45309';
    return '#64748B';
  };

  const getRankBgColor = (rank) => {
    if (rank === 1) return '#FEF3C7';
    if (rank === 2) return '#F3F4F6';
    if (rank === 3) return '#FED7AA';
    return 'transparent';
  };

  return (
    <DashboardLayout>
      <div style={{ padding: '30px 35px' }}>

        {/* HEADER */}
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{
            fontSize: '32px',
            color: 'var(--dark)',
            fontWeight: '800',
            marginBottom: '5px',
            letterSpacing: '-0.5px'
          }}>
            🏆 Leaderboard
          </h1>
          <p style={{ color: 'var(--gray)', fontSize: '15px' }}>
            See who's leading the skill exchange community
          </p>
        </div>

        {/* MY RANK BANNER */}
        {myData && (
          <div style={{
            background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 50%, #A855F7 100%)',
            borderRadius: '16px',
            padding: '20px 25px',
            marginBottom: '30px',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '20px',
            flexWrap: 'wrap',
            boxShadow: '0 10px 25px rgba(59, 130, 246, 0.2)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '-50px',
              right: '-50px',
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.08)'
            }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', position: 'relative', zIndex: 1 }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '26px',
                border: '3px solid rgba(255,255,255,0.3)',
                flexShrink: 0
              }}>
                {getRankIcon(myRank)}
              </div>
              <div>
                <p style={{ fontSize: '12px', opacity: 0.85, fontWeight: '600', marginBottom: '3px', letterSpacing: '0.5px' }}>
                  YOUR RANK
                </p>
                <p style={{ fontSize: '22px', fontWeight: '800' }}>
                  #{myRank} {myRank === 1 ? 'of the community!' : `out of ${leaderboard.length}`}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '25px', position: 'relative', zIndex: 1 }}>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '12px', opacity: 0.85, fontWeight: '600', marginBottom: '3px', letterSpacing: '0.5px' }}>
                  POINTS
                </p>
                <p style={{ fontSize: '22px', fontWeight: '800' }}>
                  ⭐ {myData.points}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TABS */}
        <div style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '25px',
          background: 'var(--white)',
          padding: '8px',
          borderRadius: '14px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          width: 'fit-content',
          flexWrap: 'wrap',
          border: '1px solid var(--border)'
        }}>
          <button
            onClick={() => setActiveTab('top')}
            style={{
              padding: '10px 20px',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '600',
              background: activeTab === 'top'
                ? 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)'
                : 'transparent',
              color: activeTab === 'top' ? '#fff' : 'var(--gray)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.25s ease',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <span>🏆</span>
            <span>Top Students</span>
          </button>

          <button
            onClick={() => setActiveTab('mentors')}
            style={{
              padding: '10px 20px',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '600',
              background: activeTab === 'mentors'
                ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                : 'transparent',
              color: activeTab === 'mentors' ? '#fff' : 'var(--gray)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.25s ease',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <span>🎓</span>
            <span>Top Mentors</span>
          </button>
        </div>

        {/* LOADING / EMPTY */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div className="spinner"></div>
            <p style={{ color: 'var(--gray)', marginTop: '15px' }}>Loading leaderboard...</p>
          </div>
        ) : leaderboard.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '80px 20px',
            background: 'var(--white)',
            borderRadius: '16px',
            border: '1px solid var(--border)'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '15px' }}>🏆</div>
            <p style={{ color: 'var(--dark)', fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>
              No students yet
            </p>
            <p style={{ color: 'var(--gray)', fontSize: '15px' }}>
              Be the first to earn points!
            </p>
          </div>
        ) : (
          <>
            {/* TOP 3 PODIUM */}
            {top3.length > 0 && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: top3.length === 3 ? '1fr 1.15fr 1fr' : `repeat(${top3.length}, 1fr)`,
                gap: '16px',
                marginBottom: '30px',
                alignItems: 'end'
              }}>
                {/* 2nd Place (Left) */}
                {top3[1] && (
                  <div style={{
                    background: 'var(--white)',
                    borderRadius: '16px',
                    padding: '24px 20px',
                    textAlign: 'center',
                    border: '1px solid var(--border)',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
                    position: 'relative',
                    minHeight: '220px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <div style={{ fontSize: '36px', marginBottom: '10px' }}>🥈</div>
                    <div style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #9CA3AF 0%, #6B7280 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontWeight: '800',
                      fontSize: '24px',
                      marginBottom: '12px',
                      border: '3px solid #E5E7EB'
                    }}>
                      {top3[1].name?.charAt(0).toUpperCase()}
                    </div>
                    <h3 style={{
                      fontSize: '15px',
                      fontWeight: '700',
                      color: 'var(--dark)',
                      marginBottom: '4px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '100%'
                    }}>
                      {top3[1].name}
                    </h3>
                    <p style={{
                      fontSize: '11px',
                      color: 'var(--gray)',
                      marginBottom: '12px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '100%'
                    }}>
                      {top3[1].university || 'Student'}
                    </p>
                    <div style={{
                      background: '#F3F4F6',
                      color: '#374151',
                      padding: '6px 14px',
                      borderRadius: '20px',
                      fontSize: '13px',
                      fontWeight: '800'
                    }}>
                      ⭐ {top3[1].points} pts
                    </div>
                  </div>
                )}

                {/* 1st Place (Center) */}
                {top3[0] && (
                  <div style={{
                    background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
                    borderRadius: '16px',
                    padding: '30px 20px',
                    textAlign: 'center',
                    border: '2px solid #F59E0B',
                    boxShadow: '0 10px 25px rgba(245, 158, 11, 0.25)',
                    position: 'relative',
                    minHeight: '260px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: '-15px',
                      right: '-15px',
                      fontSize: '32px',
                      transform: 'rotate(15deg)'
                    }}>👑</div>
                    <div style={{ fontSize: '44px', marginBottom: '10px' }}>🥇</div>
                    <div style={{
                      width: '72px',
                      height: '72px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontWeight: '800',
                      fontSize: '28px',
                      marginBottom: '12px',
                      border: '3px solid #fff',
                      boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)'
                    }}>
                      {top3[0].name?.charAt(0).toUpperCase()}
                    </div>
                    <h3 style={{
                      fontSize: '17px',
                      fontWeight: '800',
                      color: '#78350F',
                      marginBottom: '4px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '100%'
                    }}>
                      {top3[0].name}
                    </h3>
                    <p style={{
                      fontSize: '12px',
                      color: '#92400E',
                      marginBottom: '14px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '100%'
                    }}>
                      {top3[0].university || 'Student'}
                    </p>
                    <div style={{
                      background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                      color: '#fff',
                      padding: '8px 18px',
                      borderRadius: '20px',
                      fontSize: '15px',
                      fontWeight: '800',
                      boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
                    }}>
                      ⭐ {top3[0].points} pts
                    </div>
                  </div>
                )}

                {/* 3rd Place (Right) */}
                {top3[2] && (
                  <div style={{
                    background: 'var(--white)',
                    borderRadius: '16px',
                    padding: '24px 20px',
                    textAlign: 'center',
                    border: '1px solid var(--border)',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
                    position: 'relative',
                    minHeight: '220px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <div style={{ fontSize: '36px', marginBottom: '10px' }}>🥉</div>
                    <div style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #B45309 0%, #92400E 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontWeight: '800',
                      fontSize: '24px',
                      marginBottom: '12px',
                      border: '3px solid #FED7AA'
                    }}>
                      {top3[2].name?.charAt(0).toUpperCase()}
                    </div>
                    <h3 style={{
                      fontSize: '15px',
                      fontWeight: '700',
                      color: 'var(--dark)',
                      marginBottom: '4px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '100%'
                    }}>
                      {top3[2].name}
                    </h3>
                    <p style={{
                      fontSize: '11px',
                      color: 'var(--gray)',
                      marginBottom: '12px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '100%'
                    }}>
                      {top3[2].university || 'Student'}
                    </p>
                    <div style={{
                      background: '#FED7AA',
                      color: '#92400E',
                      padding: '6px 14px',
                      borderRadius: '20px',
                      fontSize: '13px',
                      fontWeight: '800'
                    }}>
                      ⭐ {top3[2].points} pts
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* RANKS 4+ */}
            {others.length > 0 && (
              <div style={{
                background: 'var(--white)',
                borderRadius: '16px',
                border: '1px solid var(--border)',
                overflow: 'hidden'
              }}>
                {others.map((student, index) => {
                  const rank = index + 4;
                  const isMe = student._id === user?._id;
                  return (
                    <div
                      key={student._id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        padding: '16px 20px',
                        borderBottom: index < others.length - 1 ? '1px solid var(--border)' : 'none',
                        background: isMe ? 'var(--primary-light)' : 'transparent',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        background: isMe ? '#3B82F6' : 'var(--light-gray)',
                        color: isMe ? '#fff' : 'var(--gray)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        fontWeight: '800',
                        flexShrink: 0
                      }}>
                        #{rank}
                      </div>

                      <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #3B82F6 0%, #A855F7 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontWeight: '800',
                        fontSize: '17px',
                        flexShrink: 0
                      }}>
                        {student.name?.charAt(0).toUpperCase()}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{
                          fontSize: '14px',
                          fontWeight: '700',
                          color: 'var(--dark)',
                          marginBottom: '2px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {student.name} {isMe && <span style={{ color: '#3B82F6', fontSize: '12px' }}>(You)</span>}
                        </p>
                        <p style={{
                          fontSize: '12px',
                          color: 'var(--gray)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {student.university || 'Student'}
                        </p>
                      </div>

                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 14px',
                        background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
                        borderRadius: '20px',
                        flexShrink: 0
                      }}>
                        <span style={{ fontSize: '13px' }}>⭐</span>
                        <span style={{
                          color: '#92400E',
                          fontSize: '13px',
                          fontWeight: '800'
                        }}>
                          {student.points}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* CTAs */}
            <div style={{
              marginTop: '30px',
              background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 50%, #A855F7 100%)',
              borderRadius: '16px',
              padding: '30px',
              textAlign: 'center',
              color: '#fff',
              boxShadow: '0 10px 25px rgba(59, 130, 246, 0.2)'
            }}>
              <h3 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '10px' }}>
                Want to climb the leaderboard? 🚀
              </h3>
              <p style={{ fontSize: '14px', opacity: 0.95, marginBottom: '20px', maxWidth: '500px', margin: '0 auto 20px' }}>
                Complete sessions, leave reviews, and share your skills to earn points!
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                  <button style={{
                    padding: '12px 26px',
                    background: '#fff',
                    color: '#3B82F6',
                    borderRadius: '50px',
                    fontSize: '14px',
                    fontWeight: '700',
                    border: 'none',
                    cursor: 'pointer'
                  }}>
                    + Add a Skill
                  </button>
                </Link>
                <Link to="/matches" style={{ textDecoration: 'none' }}>
                  <button style={{
                    padding: '12px 26px',
                    background: 'rgba(255,255,255,0.15)',
                    color: '#fff',
                    borderRadius: '50px',
                    fontSize: '14px',
                    fontWeight: '700',
                    border: '1px solid rgba(255,255,255,0.3)',
                    cursor: 'pointer'
                  }}>
                    Find Matches →
                  </button>
                </Link>
              </div>
            </div>
          </>
        )}

      </div>
    </DashboardLayout>
  );
};

export default Leaderboard;