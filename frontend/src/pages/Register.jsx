import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import educationIllustration from '../assets/education-illustration.png';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const { register, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Google signup
  const googleSignup = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setError('');
      setGoogleLoading(true);
      try {
        await googleLogin(tokenResponse.access_token);
        navigate('/');
      } catch (err) {
        setError(err.response?.data?.message || 'Google signup failed. Please try again.');
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: () => {
      setError('Google signup was cancelled or failed. Please try again.');
    },
    flow: 'implicit',
  });

  return (
    <div style={{
      minHeight: 'calc(100vh - 68px)',
      background: 'linear-gradient(135deg, #EEF2FF 0%, #F5F3FF 50%, #FAF5FF 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '30px 20px',
      position: 'relative',
      overflow: 'hidden'
    }}>

      {/* Background decorative blobs */}
      <div style={{
        position: 'absolute', top: '-150px', left: '-150px',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute', bottom: '-150px', right: '-150px',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      {/* Main card */}
      <div style={{
        background: 'var(--white)',
        borderRadius: '24px',
        boxShadow: '0 20px 60px rgba(15, 23, 42, 0.08)',
        maxWidth: '1100px',
        width: '100%',
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 1fr)',   // ← Swap කරන්න
        overflow: 'hidden',
        position: 'relative',
        zIndex: 1,
        border: '1px solid var(--border)'
      }}>

        {/* ====== LEFT SIDE — Form Section ====== */}
        <div style={{
          padding: '45px 45px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: '#fff',
          order: 2
        }}>

          {/* Top: Already have account link */}
          <div style={{ textAlign: 'right', marginBottom: '25px' }}>
            <span style={{ fontSize: '13px', color: '#64748B' }}>
              Already have an account?{' '}
            </span>
            <Link to="/login" style={{
              fontSize: '13px', color: '#3B82F6', fontWeight: '700',
              textDecoration: 'none'
            }}>
              Login
            </Link>
          </div>

          {/* Heading */}
          <h2 style={{
            fontSize: '28px', fontWeight: '800', color: '#0F172A',
            marginBottom: '8px', letterSpacing: '-0.5px'
          }}>
            Create Account
          </h2>
          <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '25px', lineHeight: '1.6' }}>
            Join SkillSwap and start exchanging skills
          </p>

          {/* Error */}
          {error && (
            <div style={{
              background: '#FEF2F2', color: '#DC2626', padding: '12px 16px',
              borderRadius: '10px', marginBottom: '18px', fontSize: '13px',
              fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px',
              border: '1px solid #FEE2E2'
            }}>
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#0F172A', fontSize: '13px', fontWeight: '600' }}>
                Full Name
              </label>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                background: '#F8FAFC', border: '1px solid #E2E8F0',
                borderRadius: '12px', padding: '12px 16px'
              }}>
                <span style={{ fontSize: '16px', color: '#94A3B8' }}>👤</span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Your full name"
                  style={{
                    flex: 1, border: 'none', background: 'transparent',
                    fontSize: '14px', color: '#0F172A', outline: 'none'
                  }}
                />
              </div>
            </div>

            {/* Email */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#0F172A', fontSize: '13px', fontWeight: '600' }}>
                Email Address
              </label>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                background: '#F8FAFC', border: '1px solid #E2E8F0',
                borderRadius: '12px', padding: '12px 16px'
              }}>
                <span style={{ fontSize: '16px', color: '#94A3B8' }}>✉️</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  style={{
                    flex: 1, border: 'none', background: 'transparent',
                    fontSize: '14px', color: '#0F172A', outline: 'none'
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#0F172A', fontSize: '13px', fontWeight: '600' }}>
                Password
              </label>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                background: '#F8FAFC', border: '1px solid #E2E8F0',
                borderRadius: '12px', padding: '12px 16px'
              }}>
                <span style={{ fontSize: '16px', color: '#94A3B8' }}>🔒</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="At least 6 characters"
                  style={{
                    flex: 1, border: 'none', background: 'transparent',
                    fontSize: '14px', color: '#0F172A', outline: 'none'
                  }}
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div style={{ marginBottom: '22px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#0F172A', fontSize: '13px', fontWeight: '600' }}>
                Confirm Password
              </label>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                background: '#F8FAFC', border: '1px solid #E2E8F0',
                borderRadius: '12px', padding: '12px 16px'
              }}>
                <span style={{ fontSize: '16px', color: '#94A3B8' }}>🔒</span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Re-enter your password"
                  style={{
                    flex: 1, border: 'none', background: 'transparent',
                    fontSize: '14px', color: '#0F172A', outline: 'none'
                  }}
                />
              </div>
            </div>

            {/* Create Account Button */}
            <button
              type="submit"
              disabled={loading || googleLoading}
              style={{
                width: '100%',
                padding: '14px',
                background: loading ? '#94A3B8' : 'linear-gradient(135deg, #3B82F6 0%, #6366F1 50%, #A855F7 100%)',
                color: '#fff',
                borderRadius: '12px',
                fontSize: '15px',
                fontWeight: '700',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : '0 8px 20px rgba(99, 102, 241, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {loading ? 'Creating account...' : (
                <>
                  <span>Create Account</span>
                  <span>→</span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '14px',
            margin: '20px 0'
          }}>
            <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
            <span style={{ color: '#94A3B8', fontSize: '12px', fontWeight: '500' }}>or</span>
            <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
          </div>

          {/* Google Button */}
          <button
            type="button"
            onClick={() => googleSignup()}
            disabled={googleLoading || loading}
            style={{
              width: '100%',
              padding: '13px 16px',
              background: '#fff',
              color: '#3c4043',
              border: '1px solid #dadce0',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: googleLoading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              transition: 'all 0.2s',
              opacity: googleLoading ? 0.6 : 1
            }}
            onMouseEnter={(e) => {
              if (!googleLoading) {
                e.currentTarget.style.background = '#f8f9fa';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(60,64,67,0.15)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#fff';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {googleLoading ? (
              <span>Signing up with Google...</span>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
                <span>Continue with Google</span>
              </>
            )}
          </button>

        </div>

        {/* ====== Brand Section (Left after reorder) ====== */}
        <div style={{
          background: 'linear-gradient(160deg, #F8FAFF 0%, #EFF3FF 50%, #F5F0FF 100%)',
          padding: '45px 40px',
          display: 'flex', flexDirection: 'column',
          borderRight: '1px solid var(--border)',   
          order: 1   
        }} className="login-brand-section">

          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', marginBottom: '30px' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '12px',
              background: 'linear-gradient(135deg, #3B82F6 0%, #A855F7 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: '800', fontSize: '20px'
            }}>
              S
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
              <span style={{ fontSize: '20px', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.5px' }}>
                Skill<span style={{
                  background: 'linear-gradient(135deg, #3B82F6 0%, #A855F7 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>Swap</span>
              </span>
              <span style={{ fontSize: '10px', color: '#64748B', fontWeight: '600', marginTop: '3px', letterSpacing: '0.3px' }}>
                Student Skill Exchange and Learning Platform
              </span>
            </div>
          </Link>

          {/* Headline */}
          <div style={{ marginBottom: '20px' }}>
            <p style={{
              fontSize: '12px', fontWeight: '700', color: '#6366F1',
              letterSpacing: '2px', marginBottom: '12px'
            }}>
              JOIN THE COMMUNITY
            </p>
            <h1 style={{
              fontSize: '34px', fontWeight: '800', color: '#0F172A',
              lineHeight: '1.2', letterSpacing: '-1px', marginBottom: '14px'
            }}>
              Start your skill<br />
              swap <span style={{
                background: 'linear-gradient(135deg, #3B82F6 0%, #A855F7 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>journey.</span>
            </h1>
            <p style={{ fontSize: '14px', color: '#64748B', lineHeight: '1.7', maxWidth: '380px' }}>
              Join hundreds of students already swapping skills and learning new things together.
            </p>
          </div>

          {/* Illustration */}
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
            minHeight: '220px'
          }}>
            <img
              src={educationIllustration}
              alt="Students learning together"
              style={{
                width: '100%',
                maxWidth: '360px',
                height: 'auto',
                display: 'block',
                objectFit: 'contain'
              }}
            />
          </div>

          {/* Feature grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '14px',
            marginTop: 'auto'
          }}>
            {[
              { icon: '💡', title: 'Free to Join', desc: 'No cost, just knowledge exchange' },
              { icon: '🌍', title: 'Student Community', desc: 'Connect with peers from your university' },
              { icon: '🚀', title: 'Boost Your Skills', desc: 'Learn new skills and teach others' },
              { icon: '🏆', title: 'Earn Rewards', desc: 'Points, badges and leaderboard' }
            ].map((f, i) => (
              <div key={i} style={{
                background: '#fff',
                borderRadius: '12px',
                padding: '14px',
                border: '1px solid #EEF2FF',
                boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)'
              }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '8px',
                  background: 'linear-gradient(135deg, #DBEAFE 0%, #EDE9FE 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '16px', marginBottom: '8px'
                }}>
                  {f.icon}
                </div>
                <p style={{ fontSize: '12px', fontWeight: '700', color: '#0F172A', marginBottom: '3px' }}>
                  {f.title}
                </p>
                <p style={{ fontSize: '10px', color: '#64748B', lineHeight: '1.4' }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;