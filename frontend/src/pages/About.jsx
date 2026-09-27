import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const About = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: '🤝',
      title: 'Skill Matching',
      description: 'Smart algorithm connects you with students who can teach what you want to learn.'
    },
    {
      icon: '📅',
      title: 'Session Booking',
      description: 'Schedule learning sessions with peers at your convenience — online or in person.'
    },
    {
      icon: '⭐',
      title: 'Reviews & Ratings',
      description: 'Build your reputation and find the best mentors through community reviews.'
    },
    {
      icon: '🎓',
      title: 'Learn & Teach',
      description: 'Share what you know and learn new skills from fellow students, all for free.'
    },
    {
      icon: '🔒',
      title: 'Secure Authentication',
      description: 'Your account is protected with JWT-based authentication and password hashing.'
    },
    {
      icon: '📱',
      title: 'Responsive Design',
      description: 'Works beautifully on desktop, tablet, and mobile devices.'
    }
  ];

  return (
    <div style={{ background: 'var(--background)', minHeight: '100vh' }}>

      {/* HERO SECTION */}
      <section style={{
        background: 'linear-gradient(135deg, #EFF6FF 0%, #EEF2FF 50%, #FAF5FF 100%)',
        padding: '70px 20px',
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '1px solid var(--border)'
      }}>
        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.08)' }} />
        <div style={{ position: 'absolute', bottom: '-100px', left: '-100px', width: '350px', height: '350px', borderRadius: '50%', background: 'rgba(168, 85, 247, 0.08)' }} />

        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '800px' }}>
          <div style={{
            display: 'inline-block',
            background: 'rgba(59, 130, 246, 0.1)',
            color: '#3B82F6',
            padding: '8px 20px',
            borderRadius: '30px',
            fontSize: '13px',
            fontWeight: '700',
            marginBottom: '20px',
            border: '1px solid rgba(59, 130, 246, 0.2)'
          }}>
            ℹ️ About Us
          </div>

          <h1 style={{
            fontSize: '48px',
            fontWeight: '800',
            marginBottom: '20px',
            lineHeight: '1.15',
            letterSpacing: '-1.5px',
            color: 'var(--dark)'
          }}>
            About <span style={{
              background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 50%, #A855F7 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>SkillConnect</span>
          </h1>

          <p style={{
            fontSize: '18px',
            color: 'var(--gray)',
            lineHeight: '1.7',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            A student-powered platform built to make learning accessible, collaborative, and free.
          </p>
        </div>
      </section>

      {/* MISSION SECTION */}
      <section className="container" style={{ padding: '70px 20px', maxWidth: '900px' }}>
        <div style={{
          background: 'var(--white)',
          borderRadius: '24px',
          padding: '50px 40px',
          boxShadow: '0 4px 16px rgba(15, 23, 42, 0.06)',
          border: '1px solid var(--border)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '56px', marginBottom: '20px' }}>🎯</div>

          <h2 style={{
            fontSize: '30px',
            fontWeight: '800',
            color: 'var(--dark)',
            marginBottom: '20px',
            letterSpacing: '-0.5px'
          }}>
            Our Mission
          </h2>

          <p style={{
            fontSize: '16px',
            color: 'var(--gray)',
            lineHeight: '1.8',
            maxWidth: '700px',
            margin: '0 auto'
          }}>
            We believe that knowledge should be shared, not bought. SkillConnect was created to solve
            a simple problem - students want to learn new skills but often cannot afford expensive courses.
            At the same time, many students already have valuable skills that they could teach others.
            Our mission is to connect these two groups and create a community where everyone grows together.
          </p>
        </div>
      </section>

      {/* WHO WE ARE */}
      <section className="container" style={{ padding: '0 20px 70px', maxWidth: '900px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 50%, #A855F7 100%)',
          borderRadius: '24px',
          padding: '50px 40px',
          color: '#fff',
          boxShadow: '0 20px 40px rgba(79, 70, 229, 0.20)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '250px', height: '250px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />

          <div style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '40px', alignItems: 'center' }}>
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '56px',
              border: '4px solid rgba(255,255,255,0.3)'
            }}>
              👨‍💻
            </div>

            <div>
              <h2 style={{
                fontSize: '28px',
                fontWeight: '800',
                marginBottom: '15px',
                letterSpacing: '-0.5px'
              }}>
                Who We Are
              </h2>

              <p style={{
                fontSize: '16px',
                lineHeight: '1.8',
                opacity: 0.95,
                marginBottom: '20px'
              }}>
                SkillConnect is a project created by <strong>Tharuka Sewmini</strong> as part of the
                <strong> EC4307 - Web Application Development</strong> module. It is a full-stack web
                application built using the MERN stack.
              </p>

              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                <div style={{
                  background: 'rgba(255,255,255,0.15)',
                  padding: '10px 18px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  🎓 EC4307
                </div>
                <div style={{
                  background: 'rgba(255,255,255,0.15)',
                  padding: '10px 18px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  💻 MERN Stack
                </div>
                <div style={{
                  background: 'rgba(255,255,255,0.15)',
                  padding: '10px 18px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  🌐 Full-Stack
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT WE OFFER */}
      <section className="container" style={{ padding: '0 20px 70px' }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <div style={{
            display: 'inline-block',
            background: 'var(--primary-light)',
            color: '#3B82F6',
            padding: '7px 16px',
            borderRadius: '30px',
            fontSize: '12px',
            fontWeight: '700',
            marginBottom: '15px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            What We Offer
          </div>

          <h2 style={{
            fontSize: '36px',
            fontWeight: '800',
            color: 'var(--dark)',
            marginBottom: '12px',
            letterSpacing: '-0.8px'
          }}>
            Everything you need to exchange skills
          </h2>

          <p style={{
            fontSize: '16px',
            color: 'var(--gray)',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Powerful features designed for students, by students.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px'
        }}>
          {features.map((feature, index) => (
            <div
              key={index}
              className="card-hover"
              style={{
                background: 'var(--white)',
                borderRadius: '16px',
                padding: '28px 24px',
                border: '1px solid var(--border)',
                boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
                transition: 'all 0.25s ease'
              }}
            >
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '14px',
                background: 'var(--primary-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                marginBottom: '18px'
              }}>
                {feature.icon}
              </div>

              <h3 style={{
                fontSize: '16px',
                fontWeight: '700',
                color: 'var(--dark)',
                marginBottom: '8px'
              }}>
                {feature.title}
              </h3>

              <p style={{
                fontSize: '14px',
                color: 'var(--gray)',
                lineHeight: '1.6',
                margin: 0
              }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section className="container" style={{ padding: '0 20px 70px', maxWidth: '800px' }}>
        <div style={{
          background: 'var(--white)',
          borderRadius: '24px',
          padding: '50px 40px',
          boxShadow: '0 4px 16px rgba(15, 23, 42, 0.06)',
          border: '1px solid var(--border)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '56px', marginBottom: '20px' }}>📧</div>

          <h2 style={{
            fontSize: '28px',
            fontWeight: '800',
            color: 'var(--dark)',
            marginBottom: '15px',
            letterSpacing: '-0.5px'
          }}>
            Get in Touch
          </h2>

          <p style={{
            fontSize: '16px',
            color: 'var(--gray)',
            lineHeight: '1.7',
            marginBottom: '25px'
          }}>
            Have questions, feedback, or want to collaborate? We'd love to hear from you.
          </p>

          <a
            href="mailto:tharuka@skillconnect.lk"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '14px 28px',
              background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
              color: '#fff',
              borderRadius: '50px',
              textDecoration: 'none',
              fontSize: '15px',
              fontWeight: '700',
              boxShadow: '0 8px 20px rgba(59, 130, 246, 0.25)'
            }}
          >
            📧 tharuka@skillconnect.lk
          </a>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="container" style={{ padding: '0 20px 80px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 50%, #A855F7 100%)',
          borderRadius: '24px',
          padding: '50px 40px',
          textAlign: 'center',
          color: '#fff',
          boxShadow: '0 20px 40px rgba(79, 70, 229, 0.25)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <h2 style={{
            fontSize: '32px',
            fontWeight: '800',
            marginBottom: '15px',
            letterSpacing: '-0.5px',
            position: 'relative',
            zIndex: 1
          }}>
            Join the SkillConnect community
          </h2>

          <p style={{
            fontSize: '16px',
            opacity: 0.95,
            maxWidth: '500px',
            margin: '0 auto 30px',
            lineHeight: '1.7',
            position: 'relative',
            zIndex: 1
          }}>
            Start exchanging skills and grow together with students from around the world.
          </p>

          {!user ? (
            <Link to="/register" style={{ textDecoration: 'none', position: 'relative', zIndex: 1 }}>
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
            <Link to="/dashboard" style={{ textDecoration: 'none', position: 'relative', zIndex: 1 }}>
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
                Go to Dashboard →
              </button>
            </Link>
          )}
        </div>
      </section>

    </div>
  );
};

export default About;