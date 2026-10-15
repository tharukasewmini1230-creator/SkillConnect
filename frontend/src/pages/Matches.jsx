import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Toast from '../components/Toast';
import DashboardLayout from '../components/DashboardLayout';
import matchIllustration from '../assets/match-illustration.png';

const Matches = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const skillFilter = searchParams.get('skill') || 'All';

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

  const filteredMatches = matches.filter((match) => {
    if (skillFilter === 'All') return true;
    const filterLower = skillFilter.toLowerCase();
    return (
      match.theyCanTeachMe?.some((skill) =>
        skill.toLowerCase().includes(filterLower)
      ) ||
      match.iCanTeachThem?.some((skill) =>
        skill.toLowerCase().includes(filterLower)
      )
    );
  });

  const handleClearFilter = () => {
    setSearchParams({});
  };

  const totalMatches = matches.length;
  const perfectMatches = matches.filter((m) => m.isPerfectMatch).length;

  const newMatchesCount = matches.filter((m) => {
    if (!m.user?.createdAt) return false;
    const userCreatedAt = new Date(m.user.createdAt);
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return userCreatedAt >= sevenDaysAgo;
  }).length;

  const sessionsBookedCount = 0;

  // Theme-aware text color
  const headingColor = theme === 'dark' ? '#F8FAFC' : '#0F172A';

  return (
    <DashboardLayout>
      <div style={{ paddingBottom: '60px' }}>
        {toast && (
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        )}

      {/* HERO SECTION */}
      <div style={{
        background: theme === 'dark'
          ? 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 50%, #2E1065 100%)'
          : 'linear-gradient(135deg, #EFF6FF 0%, #EEF2FF 50%, #F5F3FF 100%)',
        padding: '20px 30px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.08)' }} />
        <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '280px', height: '280px', borderRadius: '50%', background: 'rgba(168, 85, 247, 0.08)' }} />

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 0.9fr)',
          gap: '40px',
          alignItems: 'center',
          position: 'relative',
          zIndex: 1,
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(99, 102, 241, 0.15)',
              color: '#818CF8',
              padding: '8px 18px',
              borderRadius: '30px',
              fontSize: '13px',
              fontWeight: '700',
              marginBottom: '20px',
              border: '1px solid rgba(99, 102, 241, 0.3)'
            }}>
              <span>🔗</span>
              <span>Skill Matching</span>
            </div>

            <h1 style={{
              fontSize: '48px',
              fontWeight: '800',
              marginBottom: '22px',
              letterSpacing: '-1.5px',
              lineHeight: '1.1',
              color: headingColor
            }}>
              Skill Exchange{' '}
              <span style={{
                background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 50%, #A855F7 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>Matches</span>
            </h1>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative'
          }}>
            <img
              src={matchIllustration}
              alt="Skill exchange"
              style={{
                width: '100%',
                maxWidth: '280px',
                height: 'auto',
                filter: 'drop-shadow(0 15px 25px rgba(30, 41, 59, 0.1))'
              }}
            />

            <div style={{
              position: 'absolute',
              top: '5%',
              right: '-20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2px',
              pointerEvents: 'none'
            }}>
              <span style={{ fontSize: '22px', fontWeight: '800', fontStyle: 'italic', background: 'linear-gradient(135deg, #3B82F6 0%, #A855F7 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', fontFamily: 'Georgia, serif', transform: 'rotate(-12deg)', lineHeight: 1 }}>Learn</span>
              <span style={{ fontSize: '22px', fontWeight: '800', fontStyle: 'italic', background: 'linear-gradient(135deg, #A855F7 0%, #6366F1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', fontFamily: 'Georgia, serif', transform: 'rotate(-12deg)', lineHeight: 1, marginLeft: '10px' }}>Share</span>
              <span style={{ fontSize: '22px', fontWeight: '800', fontStyle: 'italic', background: 'linear-gradient(135deg, #6366F1 0%, #3B82F6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', fontFamily: 'Georgia, serif', transform: 'rotate(-12deg)', lineHeight: 1 }}>Grow</span>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT CONTAINER */}
      <div style={{ padding: '20px 30px 0' }}>

        {/* GRID LAYOUT */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)',
          gap: '10px',
          alignItems: 'flex-start'
        }}>

          {/* LEFT COLUMN */}
          <div>

            {/* YOUR SKILLS BANNER */}
            <div style={{
              background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 60%, #8B5CF6 100%)',
              color: '#fff',
              padding: '24px 28px',
              borderRadius: '20px',
              marginBottom: '10px',
              boxShadow: '0 12px 30px rgba(59, 130, 246, 0.25)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '180px', height: '180px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />

              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px', gap: '15px', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '12px',
                      background: 'rgba(255,255,255,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '22px',
                      flexShrink: 0
                    }}>
                      🎯
                    </div>
                    <div>
                      <h3 style={{ fontSize: '20px', fontWeight: '800', letterSpacing: '-0.3px', marginBottom: '2px' }}>
                        Your Skills
                      </h3>
                    </div>
                  </div>

                  <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                    <button style={{
                      padding: '9px 18px',
                      background: '#fff',
                      color: '#3B82F6',
                      borderRadius: '10px',
                      fontSize: '13px',
                      fontWeight: '700',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      whiteSpace: 'nowrap'
                    }}>
                      ✏️ Edit Skills
                    </button>
                  </Link>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: 'rgba(16, 185, 129, 0.25)',
                      padding: '5px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '700',
                      marginBottom: '10px',
                      border: '1px solid rgba(255,255,255,0.2)'
                    }}>
                      <span>🌱</span>
                      <span>Can Teach</span>
                      <span style={{ background: 'rgba(255,255,255,0.25)', padding: '1px 8px', borderRadius: '10px', fontSize: '11px' }}>
                        {user?.skillsOffered?.length || 0}
                      </span>
                    </div>
                    {user?.skillsOffered?.length > 0 ? (
                      <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                        {user.skillsOffered.slice(0, 4).map((skill, i) => (
                          <span key={i} style={{ background: 'rgba(255,255,255,0.15)', padding: '3px 10px', borderRadius: '14px', fontSize: '11px', fontWeight: '600' }}>
                            {skill}
                          </span>
                        ))}
                        {user.skillsOffered.length > 4 && (
                          <span style={{ background: 'rgba(255,255,255,0.15)', padding: '3px 10px', borderRadius: '14px', fontSize: '11px', fontWeight: '600' }}>
                            +{user.skillsOffered.length - 4}
                          </span>
                        )}
                      </div>
                    ) : (
                      <p style={{ opacity: 0.85, fontSize: '12px' }}>
                        <Link to="/dashboard" style={{ color: '#FDE68A', fontWeight: '700', textDecoration: 'underline' }}>
                          Add skills →
                        </Link>
                      </p>
                    )}
                  </div>

                  <div>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: 'rgba(168, 85, 247, 0.3)',
                      padding: '5px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '700',
                      marginBottom: '10px',
                      border: '1px solid rgba(255,255,255,0.2)'
                    }}>
                      <span>📖</span>
                      <span>Want to Learn</span>
                      <span style={{ background: 'rgba(255,255,255,0.25)', padding: '1px 8px', borderRadius: '10px', fontSize: '11px' }}>
                        {user?.skillsWanted?.length || 0}
                      </span>
                    </div>
                    {user?.skillsWanted?.length > 0 ? (
                      <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                        {user.skillsWanted.slice(0, 4).map((skill, i) => (
                          <span key={i} style={{ background: 'rgba(255,255,255,0.15)', padding: '3px 10px', borderRadius: '14px', fontSize: '11px', fontWeight: '600' }}>
                            {skill}
                          </span>
                        ))}
                        {user.skillsWanted.length > 4 && (
                          <span style={{ background: 'rgba(255,255,255,0.15)', padding: '3px 10px', borderRadius: '14px', fontSize: '11px', fontWeight: '600' }}>
                            +{user.skillsWanted.length - 4}
                          </span>
                        )}
                      </div>
                    ) : (
                      <p style={{ opacity: 0.85, fontSize: '12px' }}>
                        <Link to="/profile" style={{ color: '#FDE68A', fontWeight: '700', textDecoration: 'underline' }}>
                          Add skills →
                        </Link>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {skillFilter !== 'All' && (
              <div style={{
                background: theme === 'dark'
                  ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%)'
                  : 'var(--primary-light)',
                borderRadius: '12px',
                padding: '14px 20px',
                marginBottom: '10px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '10px',
                border: theme === 'dark'
                  ? '1px solid rgba(96, 165, 250, 0.4)'
                  : '1px solid #BFDBFE'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '18px' }}>🔍</span>
                  <span style={{
                    fontSize: '14px',
                    color: theme === 'dark' ? '#93C5FD' : '#1E40AF',
                    fontWeight: '600'
                  }}>
                    Showing matches for: <strong>{skillFilter}</strong>
                  </span>
                </div>
                <button
                  onClick={handleClearFilter}
                  style={{
                    padding: '6px 16px',
                    background: '#fff',
                    color: '#3B82F6',
                    borderRadius: '20px',
                    fontSize: '13px',
                    fontWeight: '700',
                    border: '1px solid #3B82F6',
                    cursor: 'pointer'
                  }}
                >
                  ✕ Clear Filter
                </button>
              </div>
            )}
            {loading ? (
              <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <div className="spinner"></div>
                <p style={{ color: 'var(--gray)', marginTop: '15px' }}>Finding your matches...</p>
              </div>
            ) : filteredMatches.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '60px 20px',
                background: 'var(--white)',
                borderRadius: '16px',
                boxShadow: '0 2px 8px rgba(15, 23, 42, 0.06)',
                border: '1px solid var(--border)'
              }}>
                <div style={{ fontSize: '56px', marginBottom: '15px' }}>
                  {skillFilter !== 'All' ? '🔍' : '🤝'}
                </div>
                <p style={{ color: 'var(--dark)', fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>
                  {skillFilter !== 'All'
                    ? `No matches found for "${skillFilter}"`
                    : 'No matches found yet'}
                </p>
                <p style={{ color: 'var(--gray)', fontSize: '14px', marginBottom: '20px' }}>
                  {skillFilter !== 'All'
                    ? 'Try a different skill or clear the filter.'
                    : 'Add your skills to find matches!'}
                </p>
                {skillFilter !== 'All' ? (
                  <button
                    onClick={handleClearFilter}
                    style={{
                      padding: '12px 28px',
                      background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
                      color: '#fff',
                      borderRadius: '10px',
                      fontSize: '14px',
                      fontWeight: '600',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    Clear Filter
                  </button>
                ) : (
                  <Link to="/profile">
                    <button style={{
                      padding: '12px 28px',
                      background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
                      color: '#fff',
                      borderRadius: '10px',
                      fontSize: '14px',
                      fontWeight: '600',
                      border: 'none',
                      cursor: 'pointer'
                    }}>
                      Update My Skills
                    </button>
                  </Link>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {filteredMatches.map((match) => (
                  <div
                    key={match.user._id}
                    className="card-hover"
                    style={{
                      background: 'var(--white)',
                      padding: '22px',
                      borderRadius: '16px',
                      boxShadow: '0 2px 8px rgba(15, 23, 42, 0.06)',
                      border: '1px solid var(--border)',
                      borderLeft: match.isPerfectMatch ? '4px solid #10B981' : '4px solid #F59E0B'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '52px',
                          height: '52px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          fontWeight: '700',
                          fontSize: '20px',
                          flexShrink: 0,
                          overflow: 'hidden'
                        }}>
                          {match.user.avatar ? (
                            <img
                              src={
                                match.user.avatar.startsWith('http')
                                  ? match.user.avatar
                                  : `http://localhost:5000${match.user.avatar}`
                              }
                              alt={match.user.name}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.parentElement.textContent = match.user.name?.charAt(0).toUpperCase();
                              }}
                            />
                          ) : (
                            match.user.name?.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div>
                          <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--dark)', marginBottom: '2px' }}>
                            {match.user.name}
                          </h3>
                          <p style={{ fontSize: '12px', color: 'var(--gray)' }}>
                            {match.user.university || 'University not specified'}
                          </p>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 14px',
                          borderRadius: '20px',
                          background: match.isPerfectMatch ? '#D1FAE5' : '#FEF3C7',
                          color: match.isPerfectMatch ? '#065F46' : '#92400E',
                          fontWeight: '700',
                          fontSize: '12px'
                        }}>
                          {match.isPerfectMatch ? '🎯 Perfect' : '🔸 Partial'}
                        </div>
                        <p style={{
                          marginTop: '6px',
                          fontSize: '22px',
                          fontWeight: '800',
                          color: getScoreColor(match.matchScore)
                        }}>
                          {match.matchScore}%
                        </p>
                      </div>
                    </div>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr auto 1fr',
                      gap: '12px',
                      alignItems: 'center',
                      padding: '14px',
                      background: 'var(--light-gray)',
                      borderRadius: '10px',
                      marginBottom: '16px'
                    }}>
                      <div>
                        <p style={{ fontSize: '10px', fontWeight: '700', color: '#10B981', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                          ⬇️ They Teach You
                        </p>
                        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                          {match.theyCanTeachMe.map((skill, i) => (
                            <span key={i} style={{ background: '#D1FAE5', color: '#065F46', padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '600' }}>
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontSize: '18px',
                        fontWeight: '700'
                      }}>
                        ⇄
                      </div>

                      <div>
                        <p style={{ fontSize: '10px', fontWeight: '700', color: '#3B82F6', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                          ⬆️ You Teach Them
                        </p>
                        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                          {match.iCanTeachThem.map((skill, i) => (
                            <span key={i} style={{ background: '#DBEAFE', color: '#1E40AF', padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '600' }}>
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => navigate(`/book/${match.user._id}`)}
                        style={{
                          flex: 1,
                          padding: '10px 16px',
                          background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
                          color: '#fff',
                          borderRadius: '8px',
                          fontSize: '13px',
                          fontWeight: '600',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        📅 Request Session
                      </button>
                      <button
                        onClick={() => navigate('/messages', { state: { partner: match.user } })}
                        style={{
                          flex: 1,
                          padding: '10px 16px',
                          background: 'var(--light-gray)',
                          color: 'var(--dark)',
                          borderRadius: '8px',
                          fontSize: '13px',
                          fontWeight: '600',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        💬 Message
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN - FILTER SIDEBAR */}
          <div style={{
            position: 'sticky',
            top: '90px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>

            {/* Filter Matches Card */}
            <div style={{
              background: 'var(--white)',
              borderRadius: '16px',
              padding: '20px',
              boxShadow: '0 2px 8px rgba(15, 23, 42, 0.06)',
              border: '1px solid var(--border)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--dark)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  🔽 Filter Matches
                </h3>
                {skillFilter !== 'All' && (
                  <button
                    onClick={handleClearFilter}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#3B82F6',
                      fontSize: '12px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    Clear All
                  </button>
                )}
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--dark)', marginBottom: '8px' }}>
                  📂 Category
                </label>
                <select style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  background: 'var(--light-gray)',
                  color: 'var(--dark)',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}>
                  <option>All Categories</option>
                  <option>Programming</option>
                  <option>Design</option>
                  <option>Languages</option>
                  <option>Music</option>
                  <option>Academic</option>
                </select>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--dark)', marginBottom: '8px' }}>
                  📊 Skill Level
                </label>
                <select style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  background: 'var(--light-gray)',
                  color: 'var(--dark)',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}>
                  <option>Any Level</option>
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--dark)', marginBottom: '8px' }}>
                  🎯 Match Percentage
                </label>
                <input
                  type="range"
                  min="50"
                  max="100"
                  defaultValue="50"
                  style={{ width: '100%', accentColor: '#3B82F6' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--gray)', marginTop: '4px' }}>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--dark)', marginBottom: '8px' }}>
                  📅 Availability
                </label>
                <select style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  background: 'var(--light-gray)',
                  color: 'var(--dark)',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}>
                  <option>Any Time</option>
                  <option>Weekdays</option>
                  <option>Weekends</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--dark)', marginBottom: '8px' }}>
                  🏷️ Type
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--dark)', cursor: 'pointer' }}>
                    <input type="checkbox" defaultChecked style={{ accentColor: '#3B82F6' }} />
                    Offers (Teaches)
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--dark)', cursor: 'pointer' }}>
                    <input type="checkbox" defaultChecked style={{ accentColor: '#3B82F6' }} />
                    Requests (Wants to learn)
                  </label>
                </div>
              </div>
            </div>

            {/* Your Match Summary Card */}
            <div style={{
              background: 'var(--white)',
              borderRadius: '16px',
              padding: '20px',
              boxShadow: '0 2px 8px rgba(15, 23, 42, 0.06)',
              border: '1px solid var(--border)'
            }}>
              <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--dark)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                🎯 Your Match Summary
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)', padding: '14px 12px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '16px' }}>👥</span>
                    <span style={{ fontSize: '22px', fontWeight: '800', color: '#1E40AF' }}>{totalMatches}</span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#1E40AF', fontWeight: '600', opacity: 0.8 }}>Total Matches</div>
                </div>

                <div style={{ background: 'linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)', padding: '14px 12px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '16px' }}>⭐</span>
                    <span style={{ fontSize: '22px', fontWeight: '800', color: '#6D28D9' }}>{perfectMatches}</span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#6D28D9', fontWeight: '600', opacity: 0.8 }}>Perfect Matches</div>
                </div>

                <div style={{ background: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)', padding: '14px 12px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '16px' }}>⚡</span>
                    <span style={{ fontSize: '22px', fontWeight: '800', color: '#15803D' }}>{newMatchesCount}</span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#15803D', fontWeight: '600', opacity: 0.8 }}>New Matches</div>
                </div>

                <div style={{ background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)', padding: '14px 12px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '16px' }}>📅</span>
                    <span style={{ fontSize: '22px', fontWeight: '800', color: '#B45309' }}>{sessionsBookedCount}</span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#B45309', fontWeight: '600', opacity: 0.8 }}>Sessions Booked</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
    </DashboardLayout>
  );
};

export default Matches;