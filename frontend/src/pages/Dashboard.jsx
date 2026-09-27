import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';
import DashboardLayout from '../components/DashboardLayout';

const Dashboard = () => {
  const { user, refreshUser } = useAuth();

  const [skills, setSkills] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState('All');
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Programming',
    type: 'Offer'
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [skillsRes, sessionsRes, matchesRes] = await Promise.all([
        API.get('/skills'),
        API.get('/sessions'),
        API.get('/match')
      ]);

      const mySkills = skillsRes.data.filter(
        (skill) => skill.user?._id === user?._id
      );

      setSkills(mySkills);
      setSessions(sessionsRes.data);
      setMatches(matchesRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMySkills = async () => {
    try {
      const response = await API.get('/skills');
      const mySkills = response.data.filter(
        (skill) => skill.user?._id === user?._id
      );
      setSkills(mySkills);
    } catch (err) {
      console.error('Error fetching skills:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await API.put(`/skills/${editingId}`, formData);
        setToast({ message: 'Skill updated successfully!', type: 'success' });
      } else {
        await API.post('/skills', formData);
        setToast({ message: 'Skill added successfully!', type: 'success' });
      }
      resetForm();
      fetchMySkills();
      await refreshUser();
    } catch (err) {
      setToast({
        message: err.response?.data?.message || 'Something went wrong',
        type: 'error'
      });
    }
  };

  const handleEdit = (skill) => {
    setFormData({
      title: skill.title,
      description: skill.description,
      category: skill.category,
      type: skill.type
    });
    setEditingId(skill._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this skill?')) return;

    try {
      await API.delete(`/skills/${id}`);
      setToast({ message: 'Skill deleted successfully!', type: 'success' });
      fetchMySkills();
    } catch (err) {
      setToast({ message: 'Failed to delete skill', type: 'error' });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'Programming',
      type: 'Offer'
    });
    setEditingId(null);
    setShowForm(false);
  };

  const categories = ['Programming', 'Design', 'Languages', 'Music', 'Academic', 'Other'];

  const offeredSkills = user?.skillsOffered?.length || 0;
  const wantedSkills = user?.skillsWanted?.length || 0;

  // Sessions stats
  const completedSessions = sessions.filter((s) => s.status === 'Completed').length;
  const acceptedSessions = sessions.filter((s) => s.status === 'Accepted').length;
  const pendingSessions = sessions.filter((s) => s.status === 'Pending').length;

  // Upcoming session - accepted sessions where user is requester or mentor
  const upcomingSessions = sessions
    .filter((s) => s.status === 'Accepted')
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  const nextSession = upcomingSessions[0];

  // Recommended matches - top 4
  const topMatches = matches.slice(0, 4);

  // Greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Points (dummy for now)
  const userPoints = user?.points || 0;

  return (
    <DashboardLayout>
      <div style={{ padding: '30px 35px' }}>

        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}

                {/* GREETING with Decorative Text */}
        <div style={{
          marginBottom: '30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '20px',
          flexWrap: 'wrap'
        }}>
          {/* Left: Greeting */}
          <div>
            <h1 style={{
              fontSize: '32px',
              color: 'var(--dark)',
              fontWeight: '800',
              marginBottom: '5px',
              letterSpacing: '-0.5px'
            }}>
              {getGreeting()}, {user?.name?.split(' ')[0]}! 👋
            </h1>
            <p style={{ color: 'var(--gray)', fontSize: '15px' }}>
              Here's what's happening with your learning journey.
            </p>
          </div>

          {/* Right: Decorative Text */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 22px',
            background: 'linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(168,85,247,0.08) 100%)',
            borderRadius: '14px',
            border: '1px dashed rgba(99,102,241,0.35)',
            position: 'relative'
          }}>
            {/* Decorative sparkles */}
            <span style={{
              position: 'absolute',
              top: '-10px',
              left: '-10px',
              fontSize: '16px',
              color: '#A855F7'
            }}>✦</span>
            <span style={{
              position: 'absolute',
              bottom: '-10px',
              right: '-10px',
              fontSize: '16px',
              color: '#6366F1'
            }}>✦</span>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1px',
              alignItems: 'flex-end'
            }}>
              <span style={{
                fontSize: '18px',
                fontWeight: '800',
                fontStyle: 'italic',
                background: 'linear-gradient(135deg, #3B82F6 0%, #A855F7 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-0.3px',
                fontFamily: 'Georgia, serif',
                lineHeight: 1.2
              }}>
                Better Skills
              </span>
              <span style={{
                fontSize: '18px',
                fontWeight: '800',
                fontStyle: 'italic',
                background: 'linear-gradient(135deg, #A855F7 0%, #6366F1 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-0.3px',
                fontFamily: 'Georgia, serif',
                lineHeight: 1.2
              }}>
                Brighter Future
              </span>
            </div>
          </div>
        </div>

        {/* STATS CARDS */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '18px',
          marginBottom: '30px'
        }}>

          {/* Skills I Teach */}
          <div style={{
            background: 'var(--white)',
            padding: '24px',
            borderRadius: '16px',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.05)',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            gap: '18px'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '26px',
              flexShrink: 0
            }}>
              🎓
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                color: 'var(--gray)',
                fontSize: '12px',
                fontWeight: '600',
                marginBottom: '4px'
              }}>
                Skills I Teach
              </p>
              <p style={{
                fontSize: '30px',
                fontWeight: '800',
                color: 'var(--dark)',
                lineHeight: 1
              }}>
                {offeredSkills}
              </p>
              <p style={{ color: 'var(--gray)', fontSize: '11px', marginTop: '5px' }}>
                Skills you can teach others
              </p>
            </div>
          </div>

          {/* Skills I Want to Learn */}
          <div style={{
            background: 'var(--white)',
            padding: '24px',
            borderRadius: '16px',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.05)',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            gap: '18px'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #E9D5FF 0%, #D8B4FE 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '26px',
              flexShrink: 0
            }}>
              📖
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                color: 'var(--gray)',
                fontSize: '12px',
                fontWeight: '600',
                marginBottom: '4px'
              }}>
                Skills I Want to Learn
              </p>
              <p style={{
                fontSize: '30px',
                fontWeight: '800',
                color: 'var(--dark)',
                lineHeight: 1
              }}>
                {wantedSkills}
              </p>
              <p style={{ color: 'var(--gray)', fontSize: '11px', marginTop: '5px' }}>
                Skills you want to learn
              </p>
            </div>
          </div>

          {/* Sessions Completed */}
          <div style={{
            background: 'var(--white)',
            padding: '24px',
            borderRadius: '16px',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.05)',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            gap: '18px'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '26px',
              flexShrink: 0
            }}>
              📅
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                color: 'var(--gray)',
                fontSize: '12px',
                fontWeight: '600',
                marginBottom: '4px'
              }}>
                Sessions Completed
              </p>
              <p style={{
                fontSize: '30px',
                fontWeight: '800',
                color: 'var(--dark)',
                lineHeight: 1
              }}>
                {completedSessions}
              </p>
              <p style={{ color: 'var(--gray)', fontSize: '11px', marginTop: '5px' }}>
                Total sessions completed
              </p>
            </div>
          </div>

          {/* Points */}
          <div style={{
            background: 'var(--white)',
            padding: '24px',
            borderRadius: '16px',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.05)',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            gap: '18px'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '26px',
              flexShrink: 0
            }}>
              ⭐
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                color: 'var(--gray)',
                fontSize: '12px',
                fontWeight: '600',
                marginBottom: '4px'
              }}>
                Points
              </p>
              <p style={{
                fontSize: '30px',
                fontWeight: '800',
                color: 'var(--dark)',
                lineHeight: 1
              }}>
                {userPoints}
              </p>
              <p style={{ color: 'var(--gray)', fontSize: '11px', marginTop: '5px' }}>
                Your total points
              </p>
            </div>
          </div>

        </div>

        {/* UPCOMING + RECENT ACTIVITY ROW */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)',
          gap: '20px',
          marginBottom: '30px'
        }}>

          {/* Upcoming Session */}
          <div style={{
            background: 'var(--white)',
            padding: '25px',
            borderRadius: '16px',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.05)',
            border: '1px solid var(--border)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--dark)' }}>
                Upcoming Session
              </h3>
              <Link
                to="/sessions"
                style={{
                  color: '#3B82F6',
                  fontSize: '13px',
                  fontWeight: '600',
                  textDecoration: 'none'
                }}
              >
                View All →
              </Link>
            </div>

            {nextSession ? (
              <div style={{
                background: 'var(--light-gray)',
                padding: '20px',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '18px'
              }}>
                <div style={{
                  width: '70px',
                  height: '70px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '32px',
                  flexShrink: 0
                }}>
                  📚
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4 style={{
                    fontSize: '17px',
                    fontWeight: '700',
                    color: 'var(--dark)',
                    marginBottom: '6px'
                  }}>
                    {nextSession.skill}
                  </h4>

                  <p style={{
                    fontSize: '13px',
                    color: 'var(--gray)',
                    marginBottom: '10px'
                  }}>
                    With: {nextSession.mentor?._id === user?._id
                      ? nextSession.requester?.name
                      : nextSession.mentor?.name || 'Unknown'}
                  </p>

                  <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                    <span style={{
                      fontSize: '12px',
                      color: 'var(--gray)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}>
                      📅 {nextSession.date}
                    </span>
                    <span style={{
                      fontSize: '12px',
                      color: 'var(--gray)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}>
                      ⏰ {nextSession.time}
                    </span>
                    <span style={{
                      fontSize: '12px',
                      color: 'var(--gray)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}>
                      {nextSession.mode === 'Online' ? '💻' : '📍'} {nextSession.mode}
                    </span>
                  </div>
                </div>

                <Link to="/sessions" style={{ textDecoration: 'none' }}>
                  <button style={{
                    padding: '10px 20px',
                    background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
                    color: '#fff',
                    borderRadius: '10px',
                    fontSize: '13px',
                    fontWeight: '700',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.25)'
                  }}>
                    View Details →
                  </button>
                </Link>
              </div>
            ) : (
              <div style={{
                background: 'var(--light-gray)',
                padding: '40px 20px',
                borderRadius: '14px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '10px' }}>📅</div>
                <p style={{ fontSize: '14px', color: 'var(--gray)', marginBottom: '5px' }}>
                  No upcoming sessions
                </p>
                <p style={{ fontSize: '12px', color: 'var(--gray)' }}>
                  Book a session with your matches!
                </p>
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div style={{
            background: 'var(--white)',
            padding: '25px',
            borderRadius: '16px',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.05)',
            border: '1px solid var(--border)'
          }}>
            <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--dark)', marginBottom: '20px' }}>
              Recent Activity
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

              {pendingSessions > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: '#FEF3C7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    flexShrink: 0
                  }}>
                    ⏳
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: '13px', color: 'var(--dark)', fontWeight: '600' }}>
                      You have {pendingSessions} pending session{pendingSessions > 1 ? 's' : ''}
                    </p>
                    <p style={{ fontSize: '11px', color: 'var(--gray)', marginTop: '2px' }}>
                      Check your sessions
                    </p>
                  </div>
                </div>
              )}

              {acceptedSessions > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: '#DBEAFE',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    flexShrink: 0
                  }}>
                    ✅
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: '13px', color: 'var(--dark)', fontWeight: '600' }}>
                      {acceptedSessions} accepted session{acceptedSessions > 1 ? 's' : ''}
                    </p>
                    <p style={{ fontSize: '11px', color: 'var(--gray)', marginTop: '2px' }}>
                      Ready to learn
                    </p>
                  </div>
                </div>
              )}

              {completedSessions > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: '#D1FAE5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    flexShrink: 0
                  }}>
                    🎉
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: '13px', color: 'var(--dark)', fontWeight: '600' }}>
                      {completedSessions} session{completedSessions > 1 ? 's' : ''} completed
                    </p>
                    <p style={{ fontSize: '11px', color: 'var(--gray)', marginTop: '2px' }}>
                      Great progress!
                    </p>
                  </div>
                </div>
              )}

              {matches.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: '#E9D5FF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    flexShrink: 0
                  }}>
                    🎯
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: '13px', color: 'var(--dark)', fontWeight: '600' }}>
                      {matches.length} skill match{matches.length > 1 ? 'es' : ''} found
                    </p>
                    <p style={{ fontSize: '11px', color: 'var(--gray)', marginTop: '2px' }}>
                      <Link to="/matches" style={{ color: '#3B82F6', textDecoration: 'none' }}>
                        View matches →
                      </Link>
                    </p>
                  </div>
                </div>
              )}

              {pendingSessions === 0 && acceptedSessions === 0 && completedSessions === 0 && matches.length === 0 && (
                <div style={{
                  textAlign: 'center',
                  padding: '20px 10px'
                }}>
                  <div style={{ fontSize: '40px', marginBottom: '10px' }}>📭</div>
                  <p style={{ fontSize: '13px', color: 'var(--gray)' }}>
                    No recent activity yet
                  </p>
                </div>
              )}

            </div>
          </div>

        </div>

        {/* RECOMMENDED FOR YOU */}
        {topMatches.length > 0 && (
          <div style={{ marginBottom: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--dark)' }}>
                Recommended for You
              </h3>
              <Link
                to="/matches"
                style={{
                  color: '#3B82F6',
                  fontSize: '13px',
                  fontWeight: '600',
                  textDecoration: 'none'
                }}
              >
                View All →
              </Link>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '16px'
            }}>
              {topMatches.map((match) => (
                <div
                  key={match.user._id}
                  className="card-hover"
                  style={{
                    background: 'var(--white)',
                    borderRadius: '16px',
                    padding: '20px',
                    boxShadow: '0 2px 8px rgba(15, 23, 42, 0.05)',
                    border: '1px solid var(--border)',
                    transition: 'all 0.25s ease'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '15px'
                  }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #3B82F6 0%, #A855F7 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontWeight: '700',
                      fontSize: '16px',
                      flexShrink: 0
                    }}>
                      {match.user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <p style={{
                        fontSize: '14px',
                        fontWeight: '700',
                        color: 'var(--dark)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {match.user.name}
                      </p>
                      <p style={{
                        fontSize: '11px',
                        color: 'var(--gray)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {match.user.university || 'Student'}
                      </p>
                    </div>
                  </div>

                  <div style={{
                    display: 'inline-block',
                    background: match.isPerfectMatch ? '#D1FAE5' : '#FEF3C7',
                    color: match.isPerfectMatch ? '#065F46' : '#92400E',
                    padding: '5px 12px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: '700',
                    marginBottom: '12px'
                  }}>
                    🎯 {match.matchScore}% Match
                  </div>

                  <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '15px' }}>
                    {match.theyCanTeachMe.slice(0, 2).map((skill, i) => (
                      <span key={i} style={{
                        background: '#D1FAE5',
                        color: '#065F46',
                        padding: '3px 10px',
                        borderRadius: '12px',
                        fontSize: '10px',
                        fontWeight: '600'
                      }}>
                        {skill}
                      </span>
                    ))}
                    {match.iCanTeachThem.slice(0, 2).map((skill, i) => (
                      <span key={i} style={{
                        background: '#DBEAFE',
                        color: '#1E40AF',
                        padding: '3px 10px',
                        borderRadius: '12px',
                        fontSize: '10px',
                        fontWeight: '600'
                      }}>
                        {skill}
                      </span>
                    ))}
                  </div>

                  <Link to="/matches" style={{ textDecoration: 'none' }}>
                    <button style={{
                      width: '100%',
                      padding: '9px',
                      background: 'var(--primary-light)',
                      color: '#3B82F6',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '700',
                      border: 'none',
                      cursor: 'pointer'
                    }}>
                      View Match →
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MY SKILLS SECTION */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--dark)', marginBottom: '5px' }}>
                My Skills
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--gray)' }}>
                Manage your skill posts
              </p>
            </div>

            <button
              onClick={() => { resetForm(); setShowForm(!showForm); }}
              style={{
                padding: '11px 22px',
                background: showForm ? 'var(--white)' : 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
                color: showForm ? 'var(--gray)' : '#fff',
                border: showForm ? '1px solid var(--border)' : 'none',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '700',
                boxShadow: showForm ? 'none' : '0 4px 12px rgba(59, 130, 246, 0.3)',
                cursor: 'pointer'
              }}
            >
              {showForm ? '✕ Cancel' : '+ Add New Skill'}
            </button>
          </div>

          {/* ADD/EDIT FORM */}
          {showForm && (
            <div style={{
              background: 'var(--white)',
              padding: '30px',
              borderRadius: '16px',
              boxShadow: '0 4px 14px rgba(0,0,0,0.08)',
              marginBottom: '30px',
              border: '1px solid var(--border)'
            }}>
              <h3 style={{ marginBottom: '25px', color: 'var(--dark)', fontSize: '20px', fontWeight: '700' }}>
                {editingId ? '✏️ Edit Skill' : '✨ Add New Skill'}
              </h3>

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--dark)', fontSize: '14px', fontWeight: '600' }}>Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Python Programming Help"
                    style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', background: 'var(--light-gray)', color: 'var(--dark)' }}
                  />
                </div>

                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--dark)', fontSize: '14px', fontWeight: '600' }}>Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows="4"
                    placeholder="Describe what you can teach or what you want to learn..."
                    style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', resize: 'vertical', background: 'var(--light-gray)', color: 'var(--dark)' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', marginBottom: '25px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--dark)', fontSize: '14px', fontWeight: '600' }}>Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', background: 'var(--light-gray)', color: 'var(--dark)', cursor: 'pointer' }}
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--dark)', fontSize: '14px', fontWeight: '600' }}>Type</label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', background: 'var(--light-gray)', color: 'var(--dark)', cursor: 'pointer' }}
                    >
                      <option value="Offer">🎓 Offer (I can teach)</option>
                      <option value="Request">📖 Request (I want to learn)</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <button
                    type="submit"
                    style={{ padding: '12px 30px', background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)', color: '#fff', borderRadius: '8px', fontSize: '15px', fontWeight: '600', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.25)', border: 'none', cursor: 'pointer' }}
                  >
                    {editingId ? 'Update Skill' : 'Add Skill'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    style={{ padding: '12px 30px', background: 'var(--light-gray)', color: 'var(--gray)', borderRadius: '8px', fontSize: '15px', fontWeight: '600', border: 'none', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TABS */}
          {skills.length > 0 && (
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
              {[
                { key: 'All', label: 'All', icon: '🌐', count: skills.length },
                { key: 'Offer', label: 'Offers', icon: '🎓', count: offeredSkills },
                { key: 'Request', label: 'Requests', icon: '📖', count: wantedSkills }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: '600',
                    background: activeTab === tab.key
                      ? tab.key === 'Offer'
                        ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                        : tab.key === 'Request'
                          ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)'
                          : 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)'
                      : 'transparent',
                    color: activeTab === tab.key ? '#fff' : 'var(--gray)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.25s ease',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                  <span style={{
                    background: activeTab === tab.key ? 'rgba(255,255,255,0.25)' : 'var(--light-gray)',
                    color: activeTab === tab.key ? '#fff' : 'var(--gray)',
                    padding: '2px 8px',
                    borderRadius: '10px',
                    fontSize: '12px',
                    fontWeight: '700'
                  }}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* SKILLS LIST */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div className="spinner"></div>
              <p style={{ color: 'var(--gray)', marginTop: '15px' }}>Loading...</p>
            </div>
          ) : skills.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              background: 'var(--white)',
              borderRadius: '16px',
              border: '1px solid var(--border)'
            }}>
              <div style={{ fontSize: '56px', marginBottom: '15px' }}>📝</div>
              <p style={{ color: 'var(--dark)', fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>
                You haven't posted any skills yet
              </p>
              <p style={{ color: 'var(--gray)', fontSize: '14px', marginBottom: '20px' }}>
                Share your knowledge or ask for help!
              </p>
              <button
                onClick={() => setShowForm(true)}
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
                + Add Your First Skill
              </button>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '18px'
            }}>
              {skills
                .filter((s) => activeTab === 'All' || s.type === activeTab)
                .map((skill) => (
                  <div
                    key={skill._id}
                    className="card-hover"
                    style={{
                      background: 'var(--white)',
                      padding: '22px',
                      borderRadius: '16px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                      border: '1px solid var(--border)',
                      borderTop: `4px solid ${skill.type === 'Offer' ? '#10B981' : '#F59E0B'}`,
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{
                        padding: '4px 12px',
                        background: 'var(--primary-light)',
                        color: '#3B82F6',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: '600'
                      }}>
                        {skill.category}
                      </span>
                      <span style={{
                        padding: '4px 12px',
                        background: skill.type === 'Offer' ? '#D1FAE5' : '#FEF3C7',
                        color: skill.type === 'Offer' ? '#065F46' : '#92400E',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: '600'
                      }}>
                        {skill.type === 'Offer' ? '🎓 Offer' : '📖 Request'}
                      </span>
                    </div>

                    <h4 style={{
                      fontSize: '16px',
                      color: 'var(--dark)',
                      marginBottom: '8px',
                      fontWeight: '700',
                      lineHeight: '1.3'
                    }}>
                      {skill.title}
                    </h4>

                    <p style={{
                      fontSize: '13px',
                      color: 'var(--gray)',
                      marginBottom: '18px',
                      lineHeight: '1.6',
                      flex: 1
                    }}>
                      {skill.description}
                    </p>

                    <div style={{ display: 'flex', gap: '8px', paddingTop: '14px', borderTop: '1px solid var(--border)' }}>
                      <button
                        onClick={() => handleEdit(skill)}
                        style={{
                          flex: 1,
                          padding: '9px',
                          background: 'var(--primary-light)',
                          color: '#3B82F6',
                          borderRadius: '8px',
                          fontSize: '13px',
                          fontWeight: '600',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(skill._id)}
                        style={{
                          flex: 1,
                          padding: '9px',
                          background: 'var(--danger-light)',
                          color: '#DC2626',
                          borderRadius: '8px',
                          fontSize: '13px',
                          fontWeight: '600',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
};

export default Dashboard;