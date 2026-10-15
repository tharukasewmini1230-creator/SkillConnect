import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';
import DashboardLayout from '../components/DashboardLayout';

const Dashboard = () => {
  const { user, refreshUser, updateProfile } = useAuth();

  const [sessions, setSessions] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState(null);

  // New skill form state
  const [newSkill, setNewSkill] = useState('');
  const [skillType, setSkillType] = useState('Offer');

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [sessionsRes, matchesRes] = await Promise.all([
        API.get('/sessions'),
        API.get('/match')
      ]);
      setSessions(sessionsRes.data);
      setMatches(matchesRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  // ===== ADD SKILL =====
  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkill.trim()) return;

    const skill = newSkill.trim();
    const currentOffered = user?.skillsOffered || [];
    const currentWanted = user?.skillsWanted || [];

    // Duplicate check
    if (skillType === 'Offer' && currentOffered.includes(skill)) {
      setToast({ message: 'Skill already in your "Can Teach" list', type: 'error' });
      return;
    }
    if (skillType === 'Request' && currentWanted.includes(skill)) {
      setToast({ message: 'Skill already in your "Want to Learn" list', type: 'error' });
      return;
    }

    try {
      const newOffered = skillType === 'Offer' ? [...currentOffered, skill] : currentOffered;
      const newWanted = skillType === 'Request' ? [...currentWanted, skill] : currentWanted;

      await updateProfile({
        skillsOffered: newOffered,
        skillsWanted: newWanted
      });

      await refreshUser();
      setToast({
        message: `Skill added to "${skillType === 'Offer' ? 'Can Teach' : 'Want to Learn'}"!`,
        type: 'success'
      });
      setNewSkill('');
      setShowForm(false);
    } catch (err) {
      setToast({
        message: err.response?.data?.message || 'Failed to add skill',
        type: 'error'
      });
    }
  };

  // ===== REMOVE SKILL =====
  const handleRemoveSkill = async (skill, type) => {
    if (!window.confirm(`Remove "${skill}"?`)) return;

    try {
      const currentOffered = user?.skillsOffered || [];
      const currentWanted = user?.skillsWanted || [];

      const newOffered = type === 'Offer' ? currentOffered.filter(s => s !== skill) : currentOffered;
      const newWanted = type === 'Request' ? currentWanted.filter(s => s !== skill) : currentWanted;

      await updateProfile({
        skillsOffered: newOffered,
        skillsWanted: newWanted
      });

      await refreshUser();
      setToast({ message: 'Skill removed!', type: 'success' });
    } catch (err) {
      setToast({
        message: err.response?.data?.message || 'Failed to remove skill',
        type: 'error'
      });
    }
  };

  const offeredSkills = user?.skillsOffered?.length || 0;
  const wantedSkills = user?.skillsWanted?.length || 0;

  const completedSessions = sessions.filter((s) => s.status === 'Completed').length;
  const acceptedSessions = sessions.filter((s) => s.status === 'Accepted').length;
  const pendingSessions = sessions.filter((s) => s.status === 'Pending').length;

  const upcomingSessions = sessions
    .filter((s) => s.status === 'Accepted')
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  const nextSession = upcomingSessions[0];

  const topMatches = matches.slice(0, 4);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const userPoints = user?.points || 0;

  return (
    <DashboardLayout>
      <div style={{ padding: '30px 35px' }}>

        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

        {/* STATS CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px', marginBottom: '30px' }}>
          <div style={{ background: 'var(--white)', padding: '24px', borderRadius: '16px', boxShadow: '0 2px 8px rgba(15, 23, 42, 0.05)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '18px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', flexShrink: 0 }}>🎓</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: 'var(--gray)', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Skills I Teach</p>
              <p style={{ fontSize: '30px', fontWeight: '800', color: 'var(--dark)', lineHeight: 1 }}>{offeredSkills}</p>
              <p style={{ color: 'var(--gray)', fontSize: '11px', marginTop: '5px' }}>Skills you can teach others</p>
            </div>
          </div>

          <div style={{ background: 'var(--white)', padding: '24px', borderRadius: '16px', boxShadow: '0 2px 8px rgba(15, 23, 42, 0.05)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '18px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'linear-gradient(135deg, #E9D5FF 0%, #D8B4FE 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', flexShrink: 0 }}>📖</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: 'var(--gray)', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Skills I Want to Learn</p>
              <p style={{ fontSize: '30px', fontWeight: '800', color: 'var(--dark)', lineHeight: 1 }}>{wantedSkills}</p>
              <p style={{ color: 'var(--gray)', fontSize: '11px', marginTop: '5px' }}>Skills you want to learn</p>
            </div>
          </div>

          <div style={{ background: 'var(--white)', padding: '24px', borderRadius: '16px', boxShadow: '0 2px 8px rgba(15, 23, 42, 0.05)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '18px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', flexShrink: 0 }}>📅</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: 'var(--gray)', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Sessions Completed</p>
              <p style={{ fontSize: '30px', fontWeight: '800', color: 'var(--dark)', lineHeight: 1 }}>{completedSessions}</p>
              <p style={{ color: 'var(--gray)', fontSize: '11px', marginTop: '5px' }}>Total sessions completed</p>
            </div>
          </div>

          <div style={{ background: 'var(--white)', padding: '24px', borderRadius: '16px', boxShadow: '0 2px 8px rgba(15, 23, 42, 0.05)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '18px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', flexShrink: 0 }}>⭐</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: 'var(--gray)', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Points</p>
              <p style={{ fontSize: '30px', fontWeight: '800', color: 'var(--dark)', lineHeight: 1 }}>{userPoints}</p>
              <p style={{ color: 'var(--gray)', fontSize: '11px', marginTop: '5px' }}>Your total points</p>
            </div>
          </div>
        </div>

        {/* UPCOMING + RECENT */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)', gap: '20px', marginBottom: '30px' }}>
          <div style={{ background: 'var(--white)', padding: '25px', borderRadius: '16px', boxShadow: '0 2px 8px rgba(15, 23, 42, 0.05)', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--dark)' }}>Upcoming Session</h3>
              <Link to="/sessions" style={{ color: '#3B82F6', fontSize: '13px', fontWeight: '600', textDecoration: 'none' }}>View All →</Link>
            </div>
            {nextSession ? (
              <div style={{ background: 'var(--light-gray)', padding: '20px', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '18px' }}>
                <div style={{ width: '70px', height: '70px', borderRadius: '14px', background: 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', flexShrink: 0 }}>📚</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4 style={{ fontSize: '17px', fontWeight: '700', color: 'var(--dark)', marginBottom: '6px' }}>{nextSession.skill}</h4>
                  <p style={{ fontSize: '13px', color: 'var(--gray)', marginBottom: '10px' }}>With: {nextSession.mentor?._id === user?._id ? nextSession.requester?.name : nextSession.mentor?.name || 'Unknown'}</p>
                  <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '12px', color: 'var(--gray)' }}>📅 {nextSession.date}</span>
                    <span style={{ fontSize: '12px', color: 'var(--gray)' }}>⏰ {nextSession.time}</span>
                    <span style={{ fontSize: '12px', color: 'var(--gray)' }}>{nextSession.mode === 'Online' ? '💻' : '📍'} {nextSession.mode}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ background: 'var(--light-gray)', padding: '40px 20px', borderRadius: '14px', textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '10px' }}>📅</div>
                <p style={{ fontSize: '14px', color: 'var(--gray)', marginBottom: '5px' }}>No upcoming sessions</p>
                <p style={{ fontSize: '12px', color: 'var(--gray)' }}>Book a session with your matches!</p>
              </div>
            )}
          </div>

          <div style={{ background: 'var(--white)', padding: '25px', borderRadius: '16px', boxShadow: '0 2px 8px rgba(15, 23, 42, 0.05)', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--dark)', marginBottom: '20px' }}>Recent Activity</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {pendingSessions > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>⏳</div>
                  <p style={{ fontSize: '13px', color: 'var(--dark)', fontWeight: '600' }}>{pendingSessions} pending session{pendingSessions > 1 ? 's' : ''}</p>
                </div>
              )}
              {acceptedSessions > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>✅</div>
                  <p style={{ fontSize: '13px', color: 'var(--dark)', fontWeight: '600' }}>{acceptedSessions} accepted</p>
                </div>
              )}
              {completedSessions > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>🎉</div>
                  <p style={{ fontSize: '13px', color: 'var(--dark)', fontWeight: '600' }}>{completedSessions} completed</p>
                </div>
              )}
              {matches.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#E9D5FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>🎯</div>
                  <div>
                    <p style={{ fontSize: '13px', color: 'var(--dark)', fontWeight: '600' }}>{matches.length} skill match{matches.length > 1 ? 'es' : ''}</p>
                    <Link to="/matches" style={{ color: '#3B82F6', textDecoration: 'none', fontSize: '11px' }}>View matches →</Link>
                  </div>
                </div>
              )}
              {pendingSessions === 0 && acceptedSessions === 0 && completedSessions === 0 && matches.length === 0 && (
                <div style={{ textAlign: 'center', padding: '20px 10px' }}>
                  <div style={{ fontSize: '40px', marginBottom: '10px' }}>📭</div>
                  <p style={{ fontSize: '13px', color: 'var(--gray)' }}>No recent activity yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RECOMMENDED */}
        {topMatches.length > 0 && (
          <div style={{ marginBottom: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--dark)' }}>Recommended for You</h3>
              <Link to="/matches" style={{ color: '#3B82F6', fontSize: '13px', fontWeight: '600', textDecoration: 'none' }}>View All →</Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
              {topMatches.map((match) => (
                <div key={match.user._id} className="card-hover" style={{ background: 'var(--white)', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 8px rgba(15, 23, 42, 0.05)', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
                    <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'linear-gradient(135deg, #3B82F6 0%, #A855F7 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '700', fontSize: '16px', flexShrink: 0 }}>
                      {match.user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <p style={{ fontSize: '14px', fontWeight: '700', color: 'var(--dark)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{match.user.name}</p>
                      <p style={{ fontSize: '11px', color: 'var(--gray)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{match.user.university || 'Student'}</p>
                    </div>
                  </div>
                  <div style={{ display: 'inline-block', background: match.isPerfectMatch ? '#D1FAE5' : '#FEF3C7', color: match.isPerfectMatch ? '#065F46' : '#92400E', padding: '5px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', marginBottom: '12px' }}>
                    🎯 {match.matchScore}% Match
                  </div>
                  <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '15px' }}>
                    {match.theyCanTeachMe.slice(0, 2).map((skill, i) => (
                      <span key={i} style={{ background: '#D1FAE5', color: '#065F46', padding: '3px 10px', borderRadius: '12px', fontSize: '10px', fontWeight: '600' }}>{skill}</span>
                    ))}
                    {match.iCanTeachThem.slice(0, 2).map((skill, i) => (
                      <span key={i} style={{ background: '#DBEAFE', color: '#1E40AF', padding: '3px 10px', borderRadius: '12px', fontSize: '10px', fontWeight: '600' }}>{skill}</span>
                    ))}
                  </div>
                  <Link to="/matches" style={{ textDecoration: 'none' }}>
                    <button style={{ width: '100%', padding: '9px', background: 'var(--primary-light)', color: '#3B82F6', borderRadius: '8px', fontSize: '13px', fontWeight: '700', border: 'none', cursor: 'pointer' }}>
                      View Match →
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== MY SKILLS SECTION ===== */}
        <div id="my-skills">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--dark)', marginBottom: '5px' }}>My Skills</h3>
              <p style={{ fontSize: '13px', color: 'var(--gray)' }}>Manage skills you can teach and want to learn</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              style={{
                padding: '11px 22px',
                background: showForm ? 'var(--white)' : 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
                color: showForm ? 'var(--gray)' : '#fff',
                border: showForm ? '1px solid var(--border)' : 'none',
                borderRadius: '10px', fontSize: '14px', fontWeight: '700',
                boxShadow: showForm ? 'none' : '0 4px 12px rgba(59, 130, 246, 0.3)', cursor: 'pointer'
              }}
            >
              {showForm ? '✕ Cancel' : '+ Add New Skill'}
            </button>
          </div>

          {/* Add form */}
          {showForm && (
            <div style={{ background: 'var(--white)', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 14px rgba(0,0,0,0.08)', marginBottom: '30px', border: '1px solid var(--border)' }}>
              <h3 style={{ marginBottom: '20px', color: 'var(--dark)', fontSize: '18px', fontWeight: '700' }}>✨ Add a New Skill</h3>
              <form onSubmit={handleAddSkill}>
                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--dark)', fontSize: '14px', fontWeight: '600' }}>Skill Name</label>
                  <input
                    type="text" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} required
                    placeholder="e.g., React, Python, UI/UX Design"
                    style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', background: 'var(--light-gray)', color: 'var(--dark)' }}
                  />
                </div>
                <div style={{ marginBottom: '22px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--dark)', fontSize: '14px', fontWeight: '600' }}>Type</label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      type="button" onClick={() => setSkillType('Offer')}
                      style={{
                        flex: 1, padding: '12px', borderRadius: '10px', fontSize: '14px', fontWeight: '700',
                        background: skillType === 'Offer' ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)' : 'var(--light-gray)',
                        color: skillType === 'Offer' ? '#fff' : 'var(--gray)',
                        border: 'none', cursor: 'pointer'
                      }}
                    >
                      🎓 I can teach
                    </button>
                    <button
                      type="button" onClick={() => setSkillType('Request')}
                      style={{
                        flex: 1, padding: '12px', borderRadius: '10px', fontSize: '14px', fontWeight: '700',
                        background: skillType === 'Request' ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' : 'var(--light-gray)',
                        color: skillType === 'Request' ? '#fff' : 'var(--gray)',
                        border: 'none', cursor: 'pointer'
                      }}
                    >
                      📖 I want to learn
                    </button>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button type="submit" style={{ padding: '12px 30px', background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)', color: '#fff', borderRadius: '8px', fontSize: '15px', fontWeight: '600', border: 'none', cursor: 'pointer' }}>
                    Add Skill
                  </button>
                  <button type="button" onClick={() => setShowForm(false)} style={{ padding: '12px 30px', background: 'var(--light-gray)', color: 'var(--gray)', borderRadius: '8px', fontSize: '15px', fontWeight: '600', border: 'none', cursor: 'pointer' }}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Two cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {/* Skills I Can Teach */}
            <div style={{ background: 'var(--white)', borderRadius: '16px', padding: '24px', border: '1px solid var(--border)', borderTop: '4px solid #10B981' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <h4 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--dark)' }}>🎓 Skills I Can Teach</h4>
                <span style={{ background: '#D1FAE5', color: '#065F46', padding: '3px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '700' }}>{offeredSkills}</span>
              </div>
              {offeredSkills === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px 10px' }}>
                  <p style={{ fontSize: '13px', color: 'var(--gray)', marginBottom: '12px' }}>You haven't added any skills yet</p>
                  <button onClick={() => { setShowForm(true); setSkillType('Offer'); }} style={{ padding: '8px 18px', background: 'var(--light-gray)', color: 'var(--dark)', borderRadius: '8px', fontSize: '12px', fontWeight: '600', border: 'none', cursor: 'pointer' }}>
                    + Add a Skill
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {user.skillsOffered.map((skill, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--light-gray)', borderRadius: '10px', gap: '10px' }}>
                      <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--dark)' }}>{skill}</span>
                      <button
                        onClick={() => handleRemoveSkill(skill, 'Offer')}
                        style={{
                          padding: '5px 12px',
                          background: 'rgba(239, 68, 68, 0.1)',
                          color: '#EF4444',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          flexShrink: 0,
                          transition: 'all 0.2s'
                        }}
                        title="Remove skill"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Skills I Want to Learn */}
            <div style={{ background: 'var(--white)', borderRadius: '16px', padding: '24px', border: '1px solid var(--border)', borderTop: '4px solid #F59E0B' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <h4 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--dark)' }}>📖 Skills I Want to Learn</h4>
                <span style={{ background: '#FEF3C7', color: '#92400E', padding: '3px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '700' }}>{wantedSkills}</span>
              </div>
              {wantedSkills === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px 10px' }}>
                  <p style={{ fontSize: '13px', color: 'var(--gray)', marginBottom: '12px' }}>You haven't added any skills yet</p>
                  <button onClick={() => { setShowForm(true); setSkillType('Request'); }} style={{ padding: '8px 18px', background: 'var(--light-gray)', color: 'var(--dark)', borderRadius: '8px', fontSize: '12px', fontWeight: '600', border: 'none', cursor: 'pointer' }}>
                    + Add a Skill
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {user.skillsWanted.map((skill, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--light-gray)', borderRadius: '10px', gap: '10px' }}>
                      <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--dark)' }}>{skill}</span>
                      <button
                        onClick={() => handleRemoveSkill(skill, 'Request')}
                        style={{
                          padding: '5px 12px',
                          background: 'rgba(239, 68, 68, 0.1)',
                          color: '#EF4444',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          flexShrink: 0,
                          transition: 'all 0.2s'
                        }}
                        title="Remove skill"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default Dashboard;