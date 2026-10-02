import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import heroIllustration from '../assets/hero-illustration.png';

const Home = () => {
  const { user } = useAuth();

  const popularSkills = [
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
  ];

  return (
    <div style={{ paddingBottom: '40px' }}>

      {/* ============================================
          HERO SECTION
          ============================================ */}
      <div style={{
        background: 'var(--hero-bg, linear-gradient(135deg, #EFF6FF 0%, #EEF2FF 50%, #F5F3FF 100%))',
        padding: '10px 20px',
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
              }}>Skill Swap</span> and Learning Platform
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

                  <Link to="/matches" style={{ textDecoration: 'none', display: 'inline-block' }}>
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
          <Link to="/matches" style={{ textDecoration: 'none' }}>
            <button
              style={{
                background: 'transparent',
                color: '#3B82F6',
                fontSize: '14px',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              View All Skills →
            </button>
          </Link>
        </div>

        <div className="popular-skills-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '18px'
        }}>
          {popularSkills.map((skill, index) => (
            <Link
              key={index}
              to={`/matches?skill=${encodeURIComponent(skill.name.split(' ')[0])}`}
              style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
            >
              <div
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
                  gap: '15px',
                  height: '100%'
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
                  borderTop: '1px solid var(--border)',
                  marginTop: 'auto'
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
            </Link>
          ))}
        </div>
      </div>

      {/* ============================================
          FINAL CTA SECTION
          ============================================ */}
      <div className="container" style={{ marginTop: '80px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 50%, #A855F7 100%)',
          borderRadius: '24px',
          padding: '60px 40px',
          textAlign: 'center',
          color: '#fff',
          boxShadow: '0 20px 40px rgba(59, 130, 246, 0.25)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
          <div style={{ position: 'absolute', bottom: '-100px', left: '-100px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{
              fontSize: '36px',
              fontWeight: '800',
              marginBottom: '15px',
              letterSpacing: '-0.5px'
            }}>
              Ready to swap your skills?
            </h2>

            <p style={{
              fontSize: '17px',
              opacity: 0.95,
              maxWidth: '500px',
              margin: '0 auto 30px',
              lineHeight: '1.7'
            }}>
              Join hundreds of students already swapping skills and growing together.
            </p>

            {!user ? (
              <Link to="/register" style={{ textDecoration: 'none' }}>
                <button style={{
                  padding: '16px 36px',
                  background: '#fff',
                  color: '#3B82F6',
                  borderRadius: '50px',
                  fontSize: '16px',
                  fontWeight: '700',
                  border: 'none',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                  cursor: 'pointer'
                }}>
                  Get Started Free →
                </button>
              </Link>
            ) : (
              <Link to="/matches" style={{ textDecoration: 'none' }}>
                <button style={{
                  padding: '16px 36px',
                  background: '#fff',
                  color: '#3B82F6',
                  borderRadius: '50px',
                  fontSize: '16px',
                  fontWeight: '700',
                  border: 'none',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                  cursor: 'pointer'
                }}>
                  Find Matches →
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default Home;