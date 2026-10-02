import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HowItWorks = () => {
  const { user } = useAuth();

  const steps = [
    {
      number: '01',
      icon: '🔐',
      color: '#3B82F6',
      title: 'Create Your Account',
      description:
        'Sign up for free with your email. Tell us a bit about yourself - your name, university, and what you are passionate about.',
      details: [
        'Click "Sign Up" on the top right',
        'Enter your name, email & password',
        'You are ready to go in seconds!'
      ]
    },
    {
      number: '02',
      icon: '🎓',
      color: '#6366F1',
      title: 'Add Your Skills',
      description:
        'Tell us what you can teach and what you want to learn. This helps us connect you with the right people.',
      details: [
        'Go to your Profile page',
        'Add skills you can teach (e.g. Python, Java)',
        'Add skills you want to learn (e.g. React, UI/UX)'
      ]
    },
    {
      number: '03',
      icon: '🎯',
      color: '#A855F7',
      title: 'Find Your Match',
      description:
        'Our smart matching system finds students who can teach what you want to learn and want to learn what you can teach.',
      details: [
        'Visit the Explore page',
        'See students with the highest match score',
        'Find your perfect skill swap partner'
      ]
    },
    {
      number: '04',
      icon: '📅',
      color: '#10B981',
      title: 'Book a Session',
      description:
        'Request a learning session with your match. Choose a date, time, and whether it is online or in person.',
      details: [
        'Click "Request Session" on any match',
        'Select date, time and mode',
        'Wait for your partner to accept'
      ]
    },
    {
      number: '05',
      icon: '⭐',
      color: '#F59E0B',
      title: 'Learn & Review',
      description:
        'Attend your session, learn something new, and leave a review to help others find great mentors.',
      details: [
        'Complete your session',
        'Rate your experience (1-5 stars)',
        'Write a review for the community'
      ]
    }
  ];

  return (
    <div style={{ background: 'var(--background)', minHeight: '100vh' }}>

      {/* HERO SECTION */}
      <section style={{
        background: 'var(--hero-bg, linear-gradient(135deg, #EFF6FF 0%, #EEF2FF 50%, #FAF5FF 100%))',
        padding: '60px 20px',
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
            📖 Guide
          </div>

          <h1 style={{
            fontSize: '48px',
            fontWeight: '800',
            marginBottom: '20px',
            lineHeight: '1.15',
            letterSpacing: '-1.5px',
            color: 'var(--dark)'
          }}>
            How <span style={{
              background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 50%, #A855F7 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>SkillSwap</span> Works
          </h1>

          <p style={{
            fontSize: '18px',
            color: 'var(--gray)',
            lineHeight: '1.7',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Learn how to swap skills with fellow students in just 5 simple steps.
            From signing up to leaving your first review, we've got you covered.
          </p>
        </div>
      </section>

      {/* WELCOME SECTION */}
      <section className="container" style={{ padding: '60px 20px', maxWidth: '900px' }}>
        <div style={{
          background: 'var(--white)',
          borderRadius: '20px',
          padding: '40px',
          boxShadow: '0 4px 16px rgba(15, 23, 42, 0.06)',
          border: '1px solid var(--border)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '56px', marginBottom: '15px' }}>👋</div>
          <h2 style={{
            fontSize: '28px',
            fontWeight: '800',
            color: 'var(--dark)',
            marginBottom: '15px'
          }}>
            Welcome to SkillSwap!
          </h2>
          <p style={{
            fontSize: '16px',
            color: 'var(--gray)',
            lineHeight: '1.7',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            SkillSwap is a student-powered skill exchange platform. Instead of paying for courses,
            you teach what you know and learn what you want - all from fellow students.
            Here's how to get started in 5 easy steps.
          </p>
        </div>
      </section>

      {/* STEPS SECTION */}
      <section className="container" style={{ padding: '0 20px 80px', maxWidth: '900px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="card-hover"
              style={{
                background: 'var(--white)',
                borderRadius: '20px',
                padding: '35px',
                boxShadow: '0 4px 16px rgba(15, 23, 42, 0.06)',
                border: '1px solid var(--border)',
                display: 'grid',
                gridTemplateColumns: 'auto 1fr',
                gap: '30px',
                alignItems: 'flex-start'
              }}
            >
              {/* Icon */}
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '20px',
                background: `${step.color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '40px',
                flexShrink: 0
              }}>
                {step.icon}
              </div>

              {/* Content */}
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '12px'
                }}>
                  <span style={{
                    fontSize: '12px',
                    fontWeight: '800',
                    color: step.color,
                    background: `${step.color}15`,
                    padding: '4px 12px',
                    borderRadius: '20px',
                    letterSpacing: '0.5px'
                  }}>
                    STEP {step.number}
                  </span>
                </div>

                <h3 style={{
                  fontSize: '22px',
                  fontWeight: '800',
                  color: 'var(--dark)',
                  marginBottom: '12px'
                }}>
                  {step.title}
                </h3>

                <p style={{
                  fontSize: '15px',
                  color: 'var(--gray)',
                  lineHeight: '1.7',
                  marginBottom: '18px'
                }}>
                  {step.description}
                </p>

                <div style={{
                  background: 'var(--light-gray)',
                  borderRadius: '12px',
                  padding: '16px 20px'
                }}>
                  <p style={{
                    fontSize: '12px',
                    fontWeight: '700',
                    color: 'var(--dark)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '10px'
                  }}>
                    What to do:
                  </p>
                  <ul style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}>
                    {step.details.map((detail, i) => (
                      <li
                        key={i}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '10px',
                          fontSize: '14px',
                          color: 'var(--dark)',
                          lineHeight: '1.5'
                        }}
                      >
                        <span style={{
                          color: step.color,
                          fontWeight: '700',
                          flexShrink: 0
                        }}>
                          ✓
                        </span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="container" style={{ padding: '0 20px 80px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 50%, #A855F7 100%)',
          borderRadius: '24px',
          padding: '50px 40px',
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
              fontSize: '32px',
              fontWeight: '800',
              marginBottom: '15px',
              letterSpacing: '-0.5px'
            }}>
              Ready to start learning?
            </h2>

            <p style={{
              fontSize: '16px',
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
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  Get Started Free →
                </button>
              </Link>
            ) : (
              <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                <button style={{
                  padding: '16px 36px',
                  background: '#fff',
                  color: '#3B82F6',
                  borderRadius: '50px',
                  fontSize: '16px',
                  fontWeight: '700',
                  border: 'none',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  Go to Dashboard →
                </button>
              </Link>
            )}
          </div>
        </div>
      </section>

    </div>
  );
};

export default HowItWorks;