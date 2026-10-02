import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';

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

  // Custom Google Login using useGoogleLogin hook
  const googleSignup = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setError('');
      setGoogleLoading(true);
      try {
        console.log('Google tokenResponse:', tokenResponse);
        await googleLogin(tokenResponse.access_token);
        navigate('/');
      } catch (err) {
        setError(err.response?.data?.message || 'Google signup failed. Please try again.');
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: (err) => {
      console.error('Google signup error:', err);
      setError('Google signup was cancelled or failed. Please try again.');
    },
    flow: 'implicit',
  });

  const handleGoogleError = () => {
    setError('Google signup was cancelled or failed. Please try again.');
  };

  return (
    <div className="auth-container" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', minHeight: 'calc(100vh - 68px)' }}>

      {/* Left Side - Form */}
      <div style={{ background: '#fff', padding: '60px 50px', display: 'flex', alignItems: 'center', justifyContent: 'center', order: 2 }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <h2 style={{ fontSize: '30px', fontWeight: '800', color: '#1f2937', marginBottom: '8px' }}>Create Account</h2>
          <p style={{ color: '#6b7280', marginBottom: '30px', fontSize: '15px' }}>Join SkillSwap and start exchanging skills</p>

          {error && (
            <div style={{ background: '#fee', color: '#dc2626', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', fontSize: '14px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#374151', fontSize: '14px', fontWeight: '600' }}>Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Your full name"
                style={{ width: '100%', padding: '12px 16px', border: '1px solid #e5e7eb', borderRadius: '10px', fontSize: '15px', background: '#fafafa' }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#374151', fontSize: '14px', fontWeight: '600' }}>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                style={{ width: '100%', padding: '12px 16px', border: '1px solid #e5e7eb', borderRadius: '10px', fontSize: '15px', background: '#fafafa' }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#374151', fontSize: '14px', fontWeight: '600' }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="At least 6 characters"
                style={{ width: '100%', padding: '12px 16px', border: '1px solid #e5e7eb', borderRadius: '10px', fontSize: '15px', background: '#fafafa' }}
              />
            </div>

            <div style={{ marginBottom: '22px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#374151', fontSize: '14px', fontWeight: '600' }}>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Re-enter your password"
                style={{ width: '100%', padding: '12px 16px', border: '1px solid #e5e7eb', borderRadius: '10px', fontSize: '15px', background: '#fafafa' }}
              />
            </div>

            <button
              type="submit"
              disabled={loading || googleLoading}
              style={{
                width: '100%',
                padding: '14px',
                background: loading ? '#9ca3af' : 'linear-gradient(135deg, #3B82F6 0%, #A855F7 100%)',
                color: '#fff',
                borderRadius: '10px',
                fontSize: '16px',
                fontWeight: '700',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : '0 4px 14px rgba(59, 130, 246, 0.3)'
              }}
            >
              {loading ? 'Creating account...' : 'Create Account →'}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', margin: '22px 0' }}>
            <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
            <span style={{ color: '#9ca3af', fontSize: '13px', fontWeight: '600' }}>OR</span>
            <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
          </div>

                {/* Custom Google Button */}
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
          borderRadius: '10px',
          fontSize: '15px',
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
          <span>Signing you in with Google...</span>
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

          <p style={{ textAlign: 'center', marginTop: '22px', color: '#6b7280', fontSize: '14px' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#3B82F6', fontWeight: '700' }}>
              Login here
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Brand Section */}
      <div className="auth-brand-section" style={{ background: 'linear-gradient(135deg, #A855F7 0%, #3B82F6 100%)', color: '#fff', padding: '60px 50px', display: 'flex', flexDirection: 'column', justifyContent: 'center', order: 1 }}>
        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', marginBottom: '30px' }}>
            ✨
          </div>
          <h1 style={{ fontSize: '40px', fontWeight: '800', marginBottom: '20px', lineHeight: '1.2', letterSpacing: '-1px' }}>
            Start Your Skill Swap Journey
          </h1>
          <p style={{ fontSize: '17px', lineHeight: '1.7', opacity: 0.95, marginBottom: '40px' }}>
            Join hundreds of students already swapping skills and learning new things together.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
                💡
              </div>
              <div>
                <p style={{ fontWeight: '600', fontSize: '15px' }}>Free to Join</p>
                <p style={{ opacity: 0.8, fontSize: '13px' }}>No cost, just knowledge exchange</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
                🌍
              </div>
              <div>
                <p style={{ fontWeight: '600', fontSize: '15px' }}>Student Community</p>
                <p style={{ opacity: 0.8, fontSize: '13px' }}>Connect with peers from your university</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
                🚀
              </div>
              <div>
                <p style={{ fontWeight: '600', fontSize: '15px' }}>Boost Your Skills</p>
                <p style={{ opacity: 0.8, fontSize: '13px' }}>Learn new skills and teach others</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;