import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import educationIllustration from '../assets/education-illustration.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const googleSignin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setError('');
      setGoogleLoading(true);
      try {
        await googleLogin(tokenResponse.access_token);
        navigate('/');
      } catch (err) {
        setError(err.response?.data?.message || 'Google login failed. Please try again.');
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: () => {
      setError('Google login was cancelled or failed. Please try again.');
    },
    flow: 'implicit',
  });

  return (
    <div style={{
      minHeight: 'calc(100vh - 68px)',
      background: 'linear-gradient(135deg, #EEF2FF 0%, #F5F3FF 50%, #FAF5FF 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '30px 20px', position: 'relative', overflow: 'hidden'
    }} className="login-page-bg">
      <div style={{
        position: 'absolute', top: '-150px', right: '-150px',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute', bottom: '-150px', left: '-150px',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <div style={{
        background: 'var(--white)',
        borderRadius: '24px',
        boxShadow: '0 20px 60px rgba(15, 23, 42, 0.08)',
        maxWidth: '1100px', width: '100%',
        display: 'grid', gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 1fr)',
        overflow: 'hidden', position: 'relative', zIndex: 1,
        border: '1px solid var(--border)'
      }}>

        {/* ====== LEFT — Brand Section ====== */}
        <div style={{
          background: 'linear-gradient(160deg, #F8FAFF 0%, #EFF3FF 50%, #F5F0FF 100%)',
          padding: '45px 40px',
          display: 'flex', flexDirection: 'column',
          borderRight: '1px solid var(--border)'
        }} className="login-brand-section">
          <div style={{ marginBottom: '20px' }}>
            <p style={{
              fontSize: '12px', fontWeight: '700', color: '#6366F1',
              letterSpacing: '2px', marginBottom: '12px'
            }}>
              WELCOME BACK
            </p>
            <h1 className="login-left-heading" style={{
              fontSize: '34px', fontWeight: '800',
              lineHeight: '1.2', letterSpacing: '-1px', marginBottom: '14px'
            }}>
              Learn from peers.<br />
              Build <span style={{
                background: 'linear-gradient(135deg, #3B82F6 0%, #A855F7 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
              }}>your future.</span>
            </h1>
            
          </div>

          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', minHeight: '220px' }}>
            <img src={educationIllustration} alt="Students learning" style={{ width: '100%', maxWidth: '360px', height: 'auto', objectFit: 'contain' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginTop: 'auto' }}>
            {[
              { icon: '👥', title: 'Find Your Match', desc: 'Connect with students who can teach and learn with you.' },
              { icon: '📅', title: 'Book Sessions', desc: 'Schedule flexible learning sessions at your convenience.' },
              { icon: '🏆', title: 'Earn Points', desc: 'Build your profile and climb the leaderboard.' },
              { icon: '🤝', title: 'Community', desc: 'Collaborate, share and grow your network.' }
            ].map((f, i) => (
              <div key={i} style={{
                background: 'var(--white)',
                borderRadius: '12px', padding: '14px',
                border: '1px solid var(--border)',
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
                <p style={{ fontSize: '12px', fontWeight: '700', color: 'var(--dark)', marginBottom: '3px' }}>{f.title}</p>
                <p style={{ fontSize: '10px', color: 'var(--gray)', lineHeight: '1.4' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ====== RIGHT — Form Section ====== */}
        <div style={{
          padding: '45px 45px',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          background: 'var(--white)',
          position: 'relative'
        }}>

          {/* Top-right: Don't have an account? */}
          <div style={{
            position: 'absolute', top: '30px', right: '45px',
            fontSize: '13px', color: 'var(--gray)'
          }}>
            Don't have an account?{' '}
            <Link to="/register" style={{
              fontSize: '13px', color: '#3B82F6', fontWeight: '700',
              textDecoration: 'none'
            }}>
              Create Account
            </Link>
          </div>

          {/* Heading */}
          <h2 style={{
            fontSize: '28px', fontWeight: '800', color: 'var(--dark)',
            marginBottom: '30px', letterSpacing: '-0.5px'
          }}>
            Login to SkillSwap
          </h2>

          {/* Error */}
          {error && (
            <div style={{
              background: 'var(--danger-light)', color: '#DC2626',
              padding: '12px 16px', borderRadius: '10px',
              marginBottom: '20px', fontSize: '13px', fontWeight: '500',
              display: 'flex', alignItems: 'center', gap: '8px',
              border: '1px solid rgba(220, 38, 38, 0.2)'
            }}>
              <span>⚠️</span><span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--dark)', fontSize: '13px', fontWeight: '600' }}>
                Email Address
              </label>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                background: 'var(--light-gray)', border: '1px solid var(--border)',
                borderRadius: '12px', padding: '12px 16px'
              }}>
                <span style={{ fontSize: '16px', color: 'var(--gray)' }}>✉️</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email address"
                  style={{
                    flex: 1, border: 'none', background: 'transparent',
                    fontSize: '14px', color: 'var(--dark)', outline: 'none'
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--dark)', fontSize: '13px', fontWeight: '600' }}>
                Password
              </label>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                background: 'var(--light-gray)', border: '1px solid var(--border)',
                borderRadius: '12px', padding: '12px 16px'
              }}>
                <span style={{ fontSize: '16px', color: 'var(--gray)' }}>🔒</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  style={{
                    flex: 1, border: 'none', background: 'transparent',
                    fontSize: '14px', color: 'var(--dark)', outline: 'none'
                  }}
                />
              </div>
            </div>

            <div style={{ textAlign: 'right', marginBottom: '22px' }}>
              <Link to="/forgot-password" style={{
                fontSize: '13px', color: '#3B82F6', fontWeight: '600',
                textDecoration: 'none'
              }}>
                Forgot password?
              </Link>
            </div>

            <button type="submit" disabled={loading || googleLoading} style={{
              width: '100%', padding: '14px',
              background: loading ? 'var(--gray)' : 'linear-gradient(135deg, #3B82F6 0%, #6366F1 50%, #A855F7 100%)',
              color: '#fff', borderRadius: '12px', fontSize: '15px', fontWeight: '700',
              border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 8px 20px rgba(99, 102, 241, 0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
            }}>
              {loading ? 'Logging in...' : (<><span>Login</span><span>→</span></>)}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', margin: '22px 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
            <span style={{ color: 'var(--gray)', fontSize: '12px', fontWeight: '500' }}>or</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
          </div>

          <button type="button" onClick={() => googleSignin()} disabled={googleLoading || loading} style={{
            width: '100%', padding: '13px 16px',
            background: 'var(--white)', color: 'var(--dark)',
            border: '1px solid var(--border)', borderRadius: '12px',
            fontSize: '14px', fontWeight: '600',
            cursor: googleLoading ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
            opacity: googleLoading ? 0.6 : 1, marginBottom: '12px'
          }}>
            {googleLoading ? <span>Signing in with Google...</span> : (
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

          <button type="button" onClick={() => setError('GitHub login coming soon!')} style={{
            width: '100%', padding: '13px 16px',
            background: 'var(--white)', color: 'var(--dark)',
            border: '1px solid var(--border)', borderRadius: '12px',
            fontSize: '14px', fontWeight: '600',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0.297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
            </svg>
            <span>Continue with GitHub</span>
          </button>

          <p style={{ fontSize: '12px', color: 'var(--gray)', textAlign: 'center', marginTop: '25px', lineHeight: '1.6' }}>
            By continuing, you agree to our{' '}
            <Link to="/terms" style={{ color: '#3B82F6', fontWeight: '600', textDecoration: 'none' }}>Terms of Service</Link>
            {' '}·{' '}
            <Link to="/privacy" style={{ color: '#3B82F6', fontWeight: '600', textDecoration: 'none' }}>Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;