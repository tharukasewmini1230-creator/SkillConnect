import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';

const BookSession = () => {
  const { mentorId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [mentor, setMentor] = useState(null);
  const [skills, setSkills] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    mode: 'Online',
    message: ''
  });

  useEffect(() => {
    fetchMentorData();
  }, [mentorId]);

    const fetchMentorData = async () => {
    try {
      // Check if user is trying to book themselves
      if (mentorId === user?._id) {
        setToast({ message: 'You cannot book a session with yourself! 😅', type: 'error' });
        setLoading(false);
        return;
      }

      // Get all users to find the mentor
      const usersRes = await API.get('/skills');
      
      // Find a skill post from this mentor to get their user info
      const mentorSkillPost = usersRes.data.find(
        (s) => String(s.user?._id) === String(mentorId)
      );

      if (!mentorSkillPost) {
        // If no skill posts, try to get mentor info from matches API
        const matchesRes = await API.get('/match');
        const match = matchesRes.data.find(
          (m) => String(m.user?._id) === String(mentorId)
        );

        if (!match) {
          setToast({ message: 'Mentor not found', type: 'error' });
          setLoading(false);
          return;
        }

        // Use match data
        setMentor(match.user);
        
        // Use the skills they can teach (from match data)
        if (match.theyCanTeachMe && match.theyCanTeachMe.length > 0) {
          setSkills(match.theyCanTeachMe.map((skill, i) => ({
            _id: `skill-${i}`,
            title: skill,
            type: 'Offer'
          })));
          setSelectedSkill(match.theyCanTeachMe[0]);
        } else {
          setToast({ message: 'This mentor has no offered skills yet', type: 'error' });
        }
        
        setLoading(false);
        return;
      }

      // If mentor has skill posts, use those
      setMentor(mentorSkillPost.user);
      
      const mentorOfferedSkills = usersRes.data.filter(
        (s) => String(s.user?._id) === String(mentorId) && s.type === 'Offer'
      );
      
      if (mentorOfferedSkills.length > 0) {
        setSkills(mentorOfferedSkills);
        setSelectedSkill(mentorOfferedSkills[0].title);
      } else {
        // Fallback to match API
        const matchesRes = await API.get('/match');
        const match = matchesRes.data.find(
          (m) => String(m.user?._id) === String(mentorId)
        );
        
        if (match && match.theyCanTeachMe && match.theyCanTeachMe.length > 0) {
          setSkills(match.theyCanTeachMe.map((skill, i) => ({
            _id: `skill-${i}`,
            title: skill,
            type: 'Offer'
          })));
          setSelectedSkill(match.theyCanTeachMe[0]);
        } else {
          setToast({ message: 'This mentor has no offered skills yet', type: 'error' });
        }
      }
    } catch (err) {
      console.error('Error fetching mentor:', err);
      setToast({ message: 'Failed to load mentor data', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.date || !formData.time) {
      setToast({ message: 'Please select date and time', type: 'error' });
      return;
    }

    setSubmitting(true);

    try {
      await API.post('/sessions', {
        mentor: mentorId,
        skill: selectedSkill,
        message: formData.message,
        date: formData.date,
        time: formData.time,
        mode: formData.mode
      });

      setToast({ message: 'Session request sent successfully!', type: 'success' });

      setTimeout(() => {
        navigate('/sessions');
      }, 1500);
    } catch (err) {
      setToast({
        message: err.response?.data?.message || 'Failed to send request',
        type: 'error'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getTimeSlots = () => {
    return [
      '09:00 AM', '10:00 AM', '11:00 AM',
      '12:00 PM', '01:00 PM', '02:00 PM',
      '03:00 PM', '04:00 PM', '05:00 PM',
      '06:00 PM', '07:00 PM', '08:00 PM'
    ];
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Not selected';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (!mentor) {
    return (
      <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <p style={{ fontSize: '18px', color: 'var(--gray)', marginBottom: '20px' }}>
          Mentor not found
        </p>
        <Link to="/matches">
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
            ← Back to Matches
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--background)', minHeight: '100vh', paddingBottom: '60px' }}>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      {/* HEADER BANNER */}
      <div style={{
        background: 'linear-gradient(135deg, #EFF6FF 0%, #EEF2FF 50%, #FAF5FF 100%)',
        padding: '30px 20px 60px',
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '1px solid var(--border)'
      }}>
        <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.08)' }} />

        <div className="container" style={{ maxWidth: '1200px', position: 'relative', zIndex: 1 }}>
          <Link to="/matches" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: '#3B82F6',
            fontSize: '14px',
            fontWeight: '600',
            textDecoration: 'none',
            marginBottom: '20px'
          }}>
            ← Back to Explore
          </Link>

          <h1 style={{
            fontSize: '42px',
            fontWeight: '800',
            color: 'var(--dark)',
            marginBottom: '10px',
            letterSpacing: '-1px'
          }}>
            Book a <span style={{
              background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 50%, #A855F7 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>Learning Session</span>
          </h1>

          <p style={{ fontSize: '16px', color: 'var(--gray)', maxWidth: '500px', lineHeight: '1.6' }}>
            Connect with a peer, schedule a session, and learn something new.
            Build your skills, share your knowledge, and grow together.
          </p>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="container" style={{
        maxWidth: '1200px',
        padding: '0 20px',
        marginTop: '-40px',
        position: 'relative',
        zIndex: 2
      }}>

        {/* SKILL + MENTOR CARD */}
        <div style={{
          background: 'var(--white)',
          borderRadius: '20px',
          padding: '30px',
          boxShadow: '0 4px 20px rgba(15, 23, 42, 0.08)',
          border: '1px solid var(--border)',
          marginBottom: '30px',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)',
          gap: '35px',
          alignItems: 'center'
        }}>

          {/* Left: Skill Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '18px', marginBottom: '18px' }}>
              <div style={{
                width: '72px',
                height: '72px',
                borderRadius: '18px',
                background: 'var(--primary-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '36px',
                flexShrink: 0
              }}>
                📚
              </div>
              <div>
                <h2 style={{
                  fontSize: '26px',
                  fontWeight: '800',
                  color: 'var(--dark)',
                  marginBottom: '8px',
                  letterSpacing: '-0.5px'
                }}>
                  {selectedSkill}
                </h2>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{
                    padding: '4px 12px',
                    background: 'var(--primary-light)',
                    color: '#3B82F6',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    💻 Programming
                  </span>
                  <span style={{
                    padding: '4px 12px',
                    background: '#FEF3C7',
                    color: '#92400E',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    Beginner
                  </span>
                  <span style={{
                    padding: '4px 12px',
                    background: '#D1FAE5',
                    color: '#065F46',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    🎓 Offer
                  </span>
                </div>
              </div>
            </div>

            <p style={{ fontSize: '14px', color: 'var(--gray)', lineHeight: '1.7', marginBottom: '15px' }}>
              Learn the fundamentals through peer-to-peer sessions. Your mentor will guide you through hands-on practice and real-world examples.
            </p>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '14px',
              color: 'var(--dark)',
              fontWeight: '600'
            }}>
              ⭐ 4.8 <span style={{ color: 'var(--gray)', fontWeight: '400' }}>(12 reviews)</span>
            </div>
          </div>

          {/* Right: Mentor Info */}
          <div style={{
            background: 'var(--light-gray)',
            borderRadius: '16px',
            padding: '22px',
            border: '1px solid var(--border)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #3B82F6 0%, #A855F7 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: '800',
                fontSize: '22px',
                flexShrink: 0
              }}>
                {mentor.name?.charAt(0).toUpperCase()}
              </div>
              <div style={{ minWidth: 0 }}>
                <h3 style={{
                  fontSize: '17px',
                  fontWeight: '700',
                  color: 'var(--dark)',
                  marginBottom: '3px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {mentor.name} ✓
                </h3>
                <p style={{
                  fontSize: '12px',
                  color: 'var(--gray)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {mentor.university || 'Student'}
                </p>
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '10px',
              marginBottom: '15px'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--dark)' }}>12+</div>
                <div style={{ fontSize: '10px', color: 'var(--gray)', fontWeight: '600' }}>Sessions</div>
              </div>
              <div style={{ textAlign: 'center', borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)' }}>
                <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--dark)' }}>5y</div>
                <div style={{ fontSize: '10px', color: 'var(--gray)', fontWeight: '600' }}>Experience</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--dark)' }}>28</div>
                <div style={{ fontSize: '10px', color: 'var(--gray)', fontWeight: '600' }}>Students</div>
              </div>
            </div>

            <div style={{
              background: 'var(--white)',
              padding: '12px 14px',
              borderRadius: '10px',
              fontSize: '12px',
              color: 'var(--gray)',
              lineHeight: '1.6',
              fontStyle: 'italic',
              borderLeft: '3px solid #3B82F6'
            }}>
              "I love teaching and helping students build real projects. Let's learn together!"
            </div>
          </div>
        </div>

        {/* MAIN GRID: Form (Left) + Summary (Right) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.6fr) minmax(0, 1fr)',
          gap: '25px'
        }}>

          {/* LEFT: FORM */}
          <form onSubmit={handleSubmit}>

            {/* SKILL SELECTOR (if multiple skills) */}
            {skills.length > 1 && (
              <div style={{
                background: 'var(--white)',
                borderRadius: '16px',
                padding: '22px',
                boxShadow: '0 2px 8px rgba(15, 23, 42, 0.05)',
                border: '1px solid var(--border)',
                marginBottom: '20px'
              }}>
                <h3 style={{
                  fontSize: '15px',
                  fontWeight: '700',
                  color: 'var(--dark)',
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  🎯 Select a Skill
                </h3>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {skills.map((s) => (
                    <button
                      key={s._id}
                      type="button"
                      onClick={() => setSelectedSkill(s.title)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '20px',
                        fontSize: '13px',
                        fontWeight: '600',
                        background: selectedSkill === s.title
                          ? 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)'
                          : 'var(--light-gray)',
                        color: selectedSkill === s.title ? '#fff' : 'var(--gray)',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      {s.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* DATE PICKER */}
            <div style={{
              background: 'var(--white)',
              borderRadius: '16px',
              padding: '22px',
              boxShadow: '0 2px 8px rgba(15, 23, 42, 0.05)',
              border: '1px solid var(--border)',
              marginBottom: '20px'
            }}>
              <h3 style={{
                fontSize: '15px',
                fontWeight: '700',
                color: 'var(--dark)',
                marginBottom: '15px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                📅 Select Date
              </h3>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
                min={new Date().toISOString().split('T')[0]}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: '1px solid var(--border)',
                  borderRadius: '10px',
                  fontSize: '15px',
                  background: 'var(--light-gray)',
                  color: 'var(--dark)',
                  cursor: 'pointer'
                }}
              />
            </div>

            {/* TIME SLOTS */}
            <div style={{
              background: 'var(--white)',
              borderRadius: '16px',
              padding: '22px',
              boxShadow: '0 2px 8px rgba(15, 23, 42, 0.05)',
              border: '1px solid var(--border)',
              marginBottom: '20px'
            }}>
              <h3 style={{
                fontSize: '15px',
                fontWeight: '700',
                color: 'var(--dark)',
                marginBottom: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px'
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  🕐 Select Time
                </span>
                <span style={{ fontSize: '11px', color: 'var(--gray)', fontWeight: '500' }}>
                  (1-hour sessions)
                </span>
              </h3>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '10px'
              }}>
                {getTimeSlots().map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setFormData({ ...formData, time: slot })}
                    style={{
                      padding: '12px 8px',
                      borderRadius: '10px',
                      fontSize: '13px',
                      fontWeight: '600',
                      background: formData.time === slot
                        ? 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)'
                        : 'var(--light-gray)',
                      color: formData.time === slot ? '#fff' : 'var(--dark)',
                      border: formData.time === slot ? 'none' : '1px solid var(--border)',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    🕐 {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* MODE SELECTOR */}
            <div style={{
              background: 'var(--white)',
              borderRadius: '16px',
              padding: '22px',
              boxShadow: '0 2px 8px rgba(15, 23, 42, 0.05)',
              border: '1px solid var(--border)',
              marginBottom: '20px'
            }}>
              <h3 style={{
                fontSize: '15px',
                fontWeight: '700',
                color: 'var(--dark)',
                marginBottom: '15px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                👥 Session Mode
              </h3>

              <div style={{ display: 'flex', gap: '10px' }}>
                {['Online', 'Physical'].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setFormData({ ...formData, mode: m })}
                    style={{
                      flex: 1,
                      padding: '14px',
                      borderRadius: '10px',
                      fontSize: '14px',
                      fontWeight: '700',
                      background: formData.mode === m
                        ? 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)'
                        : 'var(--light-gray)',
                      color: formData.mode === m ? '#fff' : 'var(--gray)',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {m === 'Online' ? '💻 Online' : '📍 Physical'}
                  </button>
                ))}
              </div>
            </div>

            {/* MESSAGE */}
            <div style={{
              background: 'var(--white)',
              borderRadius: '16px',
              padding: '22px',
              boxShadow: '0 2px 8px rgba(15, 23, 42, 0.05)',
              border: '1px solid var(--border)',
              marginBottom: '20px'
            }}>
              <h3 style={{
                fontSize: '15px',
                fontWeight: '700',
                color: 'var(--dark)',
                marginBottom: '15px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                💬 Add a Message <span style={{ fontSize: '11px', color: 'var(--gray)', fontWeight: '400' }}>(Optional)</span>
              </h3>

              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows="4"
                maxLength="500"
                placeholder={`Hi ${mentor.name?.split(' ')[0]}, I'm interested in learning ${selectedSkill}. I'd love to discuss the basics and get some project guidance...`}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: '1px solid var(--border)',
                  borderRadius: '10px',
                  fontSize: '14px',
                  background: 'var(--light-gray)',
                  color: 'var(--dark)',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  lineHeight: '1.6'
                }}
              />
              <p style={{ fontSize: '11px', color: 'var(--gray)', marginTop: '6px', textAlign: 'right' }}>
                {formData.message.length}/500
              </p>
            </div>

          </form>

          {/* RIGHT: SUMMARY (STICKY) */}
          <div>
            <div style={{
              background: 'var(--white)',
              borderRadius: '16px',
              padding: '25px',
              boxShadow: '0 4px 20px rgba(15, 23, 42, 0.08)',
              border: '1px solid var(--border)',
              position: 'sticky',
              top: '90px'
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '800',
                color: 'var(--dark)',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                📋 Session Summary
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--gray)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    🎯 Skill
                  </span>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--dark)', textAlign: 'right', maxWidth: '60%' }}>
                    {selectedSkill}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--gray)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    👨‍🏫 Mentor
                  </span>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--dark)', textAlign: 'right' }}>
                    {mentor.name}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--gray)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    📅 Date
                  </span>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: formData.date ? 'var(--dark)' : 'var(--gray)', textAlign: 'right', maxWidth: '60%' }}>
                    {formData.date ? formatDate(formData.date) : 'Not selected'}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--gray)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    🕐 Time
                  </span>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: formData.time ? 'var(--dark)' : 'var(--gray)', textAlign: 'right' }}>
                    {formData.time || 'Not selected'}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--gray)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {formData.mode === 'Online' ? '💻' : '📍'} Mode
                  </span>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--dark)' }}>
                    {formData.mode}
                  </span>
                </div>
              </div>

              <div style={{
                padding: '14px 0',
                borderTop: '1px solid var(--border)',
                borderBottom: '1px solid var(--border)',
                marginBottom: '20px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', color: 'var(--gray)', fontWeight: '600' }}>
                    Duration
                  </span>
                  <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--dark)' }}>
                    1 Hour
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting || !formData.date || !formData.time}
                style={{
                  width: '100%',
                  padding: '15px',
                  background: submitting || !formData.date || !formData.time
                    ? 'var(--gray)'
                    : 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
                  color: '#fff',
                  borderRadius: '12px',
                  fontSize: '15px',
                  fontWeight: '700',
                  border: 'none',
                  cursor: submitting || !formData.date || !formData.time ? 'not-allowed' : 'pointer',
                  boxShadow: submitting || !formData.date || !formData.time ? 'none' : '0 6px 18px rgba(59, 130, 246, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginBottom: '14px',
                  transition: 'all 0.2s'
                }}
              >
                {submitting ? '⏳ Sending...' : '✈️ Send Request'}
              </button>

              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                fontSize: '11px',
                color: 'var(--gray)',
                lineHeight: '1.5'
              }}>
                <span>ℹ️</span>
                <span>
                  Your request will be sent to the mentor. They will confirm if the time works for them.
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default BookSession;