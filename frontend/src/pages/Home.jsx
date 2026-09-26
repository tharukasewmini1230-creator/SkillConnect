import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import heroIllustration from '../assets/hero-illustration.png';

const Home = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [activeTab, setActiveTab] = useState('All');

  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const urlSearch = searchParams.get('search');
    if (urlSearch) {
      setSearch(urlSearch);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await API.get('/skills');
        setSkills(response.data);
      } catch (err) {
        console.error('Error fetching skills:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  const offerCount = skills.filter((s) => s.type === 'Offer').length;
  const requestCount = skills.filter((s) => s.type === 'Request').length;

  const filteredSkills = skills.filter((skill) => {
    const matchesTab = activeTab === 'All' || skill.type === activeTab;
    const matchesSearch =
      skill.title.toLowerCase().includes(search.toLowerCase()) ||
      skill.description.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'All' || skill.category === filter;
    return matchesTab && matchesSearch && matchesFilter;
  });

  const categories = ['All', 'Programming', 'Design', 'Languages', 'Music', 'Academic', 'Other'];

  const tabs = [
    { key: 'All', label: 'All Skills', icon: '🌐', count: skills.length },
    { key: 'Offer', label: 'Offers', icon: '🎓', count: offerCount },
    { key: 'Request', label: 'Requests', icon: '📖', count: requestCount }
  ];

  return (
    <div style={{ paddingBottom: '40px' }}>

      {/* ============================================
          HERO SECTION
          ============================================ */}
      <div style={{
        background: 'linear-gradient(135deg, #EFF6FF 0%, #EEF2FF 50%, #F5F3FF 100%)',
        padding: '60px 20px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.08)' }} />
        <div style={{ position: 'absolute', bottom: '-100px', left: '-100px', width: '350px', height: '350px', borderRadius: '50%', background: 'rgba(168, 85, 247, 0.08)' }} />

        <div className="container" style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
          gap: '50px',
          alignItems: 'center',
          position: 'relative',
          zIndex: 1
        }}>

          {/* Left Side - Text */}
          <div>
            <div style={{
              display: 'inline-block',
              background: 'rgba(59, 130, 246, 0.1)',
              color: '#3B82F6',
              padding: '8px 18px',
              borderRadius: '30px',
              fontSize: '13px',
              fontWeight: '700',
              marginBottom: '20px',
              border: '1px solid rgba(59, 130, 246, 0.2)'
            }}>
              ✨ Learn • Share • Grow
            </div>

            <h1 style={{
              fontSize: '52px',
              fontWeight: '800',
              marginBottom: '20px',
              lineHeight: '1.15',
              letterSpacing: '-1.5px',
              color: 'var(--dark)'
            }}>
              Student <span style={{
                background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 50%, #A855F7 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>Skill Exchange</span> and Learning Platform
            </h1>

            <p style={{
              fontSize: '18px',
              marginBottom: '35px',
              color: 'var(--gray)',
              lineHeight: '1.7',
              maxWidth: '500px'
            }}>
              Learn from peers. Share your skills. Grow together.
            </p>

            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                            {!user ? (
                <>
                  <Link to="/register" style={{ textDecoration: 'none', display: 'inline-block' }}>
                    <button style={{
                      padding: '16px 36px',
                      background: 'linear-gradient(135deg, #3B82F6 0%, #A855F7 100%)',
                      color: '#fff',
                      borderRadius: '999px',
                      fontSize: '16px',
                      fontWeight: '700',
                      boxShadow: '0 8px 20px rgba(59, 130, 246, 0.35)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '10px',
                      border: 'none',
                      cursor: 'pointer'
                    }}>
                      <span style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.25)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '13px',
                        lineHeight: 1
                      }}>↗</span>
                      <span>Get Started</span>
                    </button>
                  </Link>

                  <Link to="/login" style={{ textDecoration: 'none', display: 'inline-block' }}>
                    <button style={{
                      padding: '16px 36px',
                      background: '#fff',
                      color: '#3B82F6',
                      borderRadius: '999px',
                      fontSize: '16px',
                      fontWeight: '700',
                      border: '2px solid #3B82F6',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '10px',
                      cursor: 'pointer'
                    }}>
                      <span style={{ fontSize: '16px', lineHeight: 1 }}>🔍</span>
                      <span>Explore Skills</span>
                    </button>
                  </Link>
                </>
              ) : (
                <Link to="/dashboard" style={{ textDecoration: 'none', display: 'inline-block' }}>
                  <button style={{
                    padding: '16px 36px',
                    background: 'linear-gradient(135deg, #3B82F6 0%, #A855F7 100%)',
                    color: '#fff',
                    borderRadius: '999px',
                    fontSize: '16px',
                    fontWeight: '700',
                    boxShadow: '0 8px 20px rgba(59, 130, 246, 0.35)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    border: 'none',
                    cursor: 'pointer'
                  }}>
                    <span style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '13px',
                      lineHeight: 1
                    }}>↗</span>
                    <span>Go to Dashboard</span>
                  </button>
                </Link>
              )}
            </div>
          </div>

          {/* Right Side - Illustration */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <img
              src={heroIllustration}
              alt="Students learning together"
              style={{
                width: '100%',
                maxWidth: '500px',
                height: 'auto'
              }}
            />
          </div>
        </div>
      </div>

      {/* ============================================
          FEATURE CARDS
          ============================================ */}
      <div className="container" style={{ marginTop: '50px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px'
        }}>
          {[
            { icon: '🎯', title: 'Find Your Match', desc: 'Discover students who can teach and learn with you', color: '#3B82F6' },
            { icon: '📅', title: 'Book Sessions', desc: 'Schedule flexible learning sessions at your convenience', color: '#6366F1' },
            { icon: '🏆', title: 'Earn Points', desc: 'Build your profile and climb the leaderboard', color: '#A855F7' },
            { icon: '🤝', title: 'Community', desc: 'Connect, collaborate, and grow your network', color: '#10B981' }
          ].map((feature, index) => (
            <div key={index} className="card-hover" style={{
              background: 'var(--white)',
              padding: '28px 24px',
              borderRadius: '16px',
              boxShadow: '0 4px 16px rgba(15, 23, 42, 0.06)',
              textAlign: 'center',
              border: '1px solid var(--border)'
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '14px',
                background: `${feature.color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '26px',
                margin: '0 auto 16px'
              }}>
                {feature.icon}
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--dark)', marginBottom: '8px' }}>
                {feature.title}
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--gray)', lineHeight: '1.6' }}>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ============================================
          POPULAR SKILLS SECTION
          ============================================ */}
      <div className="container" style={{ marginTop: '70px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
          <div>
            <h2 style={{ fontSize: '32px', fontWeight: '800', color: 'var(--dark)', marginBottom: '8px', letterSpacing: '-0.5px' }}>
              Popular Skills
            </h2>
            <p style={{ fontSize: '15px', color: 'var(--gray)' }}>
              Explore the most in-demand skills in our community
            </p>
          </div>
          <button
            onClick={() => {
              const skillsSection = document.getElementById('browse-skills');
              if (skillsSection) skillsSection.scrollIntoView({ behavior: 'smooth' });
            }}
            style={{
              background: 'transparent',
              color: '#3B82F6',
              fontSize: '14px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '8px'
            }}
          >
            View All Skills →
          </button>
        </div>

        <div className="popular-skills-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '18px'
        }}>
          {[
            {
              name: 'Python Programming',
              category: 'Programming',
              level: 'Intermediate',
              icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
              color: '#3B82F6',
              count: 124
            },
            {
              name: 'React Development',
              category: 'Web Development',
              level: 'Advanced',
              icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
              color: '#06B6D4',
              count: 98
            },
            {
              name: 'UI/UX Design',
              category: 'Design',
              level: 'Beginner',
              icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg',
              color: '#A855F7',
              count: 76
            },
            {
              name: 'Java Programming',
              category: 'Programming',
              level: 'Intermediate',
              icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
              color: '#EF4444',
              count: 62
            },
            {
              name: 'Data Analysis',
              category: 'Data Science',
              level: 'Intermediate',
              icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg',
              color: '#8B5CF6',
              count: 54
            }
          ].map((skill, index) => (
            <div
              key={index}
              className="card-hover"
              style={{
                background: 'var(--white)',
                padding: '22px',
                borderRadius: '16px',
                boxShadow: '0 2px 8px rgba(15, 23, 42, 0.06)',
                border: '1px solid var(--border)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '15px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: `${skill.color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '10px'
                }}>
                  <img
                    src={skill.icon}
                    alt={skill.name}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                </div>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'var(--light-gray)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  color: 'var(--gray)'
                }}>
                  →
                </div>
              </div>

              <div>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '700',
                  color: 'var(--dark)',
                  marginBottom: '10px',
                  lineHeight: '1.3'
                }}>
                  {skill.name}
                </h3>

                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <span style={{
                    padding: '3px 10px',
                    background: 'var(--primary-light)',
                    color: '#3B82F6',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: '600'
                  }}>
                    {skill.category}
                  </span>
                  <span style={{
                    padding: '3px 10px',
                    background: 'var(--light-gray)',
                    color: 'var(--gray)',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: '600'
                  }}>
                    {skill.level}
                  </span>
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                paddingTop: '12px',
                borderTop: '1px solid var(--border)'
              }}>
                <div style={{ display: 'flex', marginRight: '5px' }}>
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${skill.color} 0%, ${skill.color}80 100%)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontSize: '10px',
                        fontWeight: '700',
                        border: '2px solid var(--white)',
                        marginLeft: i > 1 ? '-8px' : '0'
                      }}
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <span style={{ fontSize: '12px', color: 'var(--gray)', fontWeight: '500' }}>
                  {skill.count}+ people
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ============================================
          SKILLS BROWSING SECTION
          ============================================ */}
      <div className="container" id="browse-skills" style={{ marginTop: '70px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '36px', fontWeight: '800', color: 'var(--dark)', marginBottom: '10px', letterSpacing: '-0.5px' }}>
            Browse Skills
          </h2>
          <p style={{ fontSize: '16px', color: 'var(--gray)' }}>
            Discover what your peers are offering and requesting
          </p>
        </div>

        <div className="tabs-container" style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '30px',
          background: 'var(--white)',
          padding: '8px',
          borderRadius: '14px',
          boxShadow: '0 2px 8px rgba(15, 23, 42, 0.05)',
          width: 'fit-content',
          margin: '0 auto 30px',
          flexWrap: 'wrap',
          border: '1px solid var(--border)'
        }}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: '12px 22px',
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
                boxShadow: activeTab === tab.key ? '0 4px 12px rgba(59, 130, 246, 0.25)' : 'none'
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              <span style={{
                background: activeTab === tab.key ? 'rgba(255,255,255,0.25)' : 'var(--light-gray)',
                color: activeTab === tab.key ? '#fff' : 'var(--gray)',
                padding: '2px 9px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '700'
              }}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="🔍  Search skills by title or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: '1',
              minWidth: '250px',
              padding: '14px 20px',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              fontSize: '15px',
              background: 'var(--white)',
              color: 'var(--dark)',
              boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)'
            }}
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{
              padding: '14px 20px',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              fontSize: '15px',
              background: 'var(--white)',
              color: 'var(--dark)',
              boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
              minWidth: '180px',
              cursor: 'pointer'
            }}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat === 'All' ? '📂  All Categories' : cat}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div className="spinner"></div>
            <p style={{ color: 'var(--gray)', marginTop: '15px' }}>Loading skills...</p>
          </div>
        ) : filteredSkills.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '80px 20px',
            background: 'var(--white)',
            borderRadius: '16px',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.06)',
            border: '1px solid var(--border)'
          }}>
            <div style={{ fontSize: '56px', marginBottom: '15px' }}>
              {activeTab === 'Offer' ? '🎓' : activeTab === 'Request' ? '📖' : '🔍'}
            </div>
            <p style={{ color: 'var(--dark)', fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
              No skills found
            </p>
            <p style={{ color: 'var(--gray)', fontSize: '15px' }}>
              {search || filter !== 'All'
                ? 'Try adjusting your search or filter.'
                : user
                  ? 'Be the first to post a skill!'
                  : 'Login to add a skill!'}
            </p>
          </div>
        ) : (
          <div className="skills-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            {filteredSkills.map((skill) => (
              <div
                key={skill._id}
                className="card-hover"
                style={{
                  background: 'var(--white)',
                  padding: '25px',
                  borderRadius: '16px',
                  boxShadow: '0 2px 8px rgba(15, 23, 42, 0.06)',
                  border: '1px solid var(--border)',
                  borderTop: `4px solid ${skill.type === 'Offer' ? '#10B981' : '#F59E0B'}`,
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <span style={{
                    padding: '5px 14px',
                    background: 'var(--primary-light)',
                    color: '#3B82F6',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    {skill.category}
                  </span>
                  <span style={{
                    padding: '5px 14px',
                    background: skill.type === 'Offer' ? '#D1FAE5' : '#FEF3C7',
                    color: skill.type === 'Offer' ? '#065F46' : '#92400E',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    {skill.type === 'Offer' ? '🎓 Offer' : '📖 Request'}
                  </span>
                </div>

                <h3 style={{
                  fontSize: '18px',
                  color: 'var(--dark)',
                  marginBottom: '10px',
                  fontWeight: '700',
                  lineHeight: '1.3'
                }}>
                  {skill.title}
                </h3>

                <p style={{
                  fontSize: '14px',
                  color: 'var(--gray)',
                  marginBottom: '20px',
                  lineHeight: '1.6',
                  flex: 1
                }}>
                  {skill.description}
                </p>

                <div style={{
                  borderTop: '1px solid var(--border)',
                  paddingTop: '15px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontWeight: '600',
                      fontSize: '12px'
                    }}>
                      {skill.user?.name?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <span style={{ fontSize: '13px', color: 'var(--dark)', fontWeight: '500' }}>
                      {skill.user?.name || 'Unknown'}
                    </span>
                  </div>
                  <span style={{ fontSize: '12px', color: 'var(--gray)' }}>
                    {new Date(skill.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;