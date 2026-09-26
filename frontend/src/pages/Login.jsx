import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
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

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', minHeight: 'calc(100vh - 68px)' }}>

      {/* Left Side - Brand Section */}
      <div style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', color: '#fff', padding: '60px 50px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', marginBottom: '30px' }}>
            🎓
          </div>
          <h1 style={{ fontSize: '40px', fontWeight: '800', marginBottom: '20px', lineHeight: '1.2', letterSpacing: '-1px' }}>
            Welcome Back to SkillConnect
          </h1>
          <p style={{ fontSize: '17px', lineHeight: '1.7', opacity: 0.95, marginBottom: '40px' }}>
            Continue your learning journey. Connect with fellow students, exchange skills, and grow together.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
                🎯
              </div>
              <div>
                <p style={{ fontWeight: '600', fontSize: '15px' }}>Share Your Skills</p>
                <p style={{ opacity: 0.8, fontSize: '13px' }}>Teach what you know best</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
                📚
              </div>
              <div>
                <p style={{ fontWeight: '600', fontSize: '15px' }}>Learn New Things</p>
                <p style={{ opacity: 0.8, fontSize: '13px' }}>Discover skills you want to learn</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
                🤝
              </div>
              <div>
                <p style={{ fontWeight: '600', fontSize: '15px' }}>Grow Together</p>
                <p style={{ opacity: 0.8, fontSize: '13px' }}>Build a community of learners</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div style={{ background: '#fff', padding: '60px 50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <h2 style={{ fontSize: '30px', fontWeight: '800', color: '#1f2937', marginBottom: '8px' }}>Login</h2>
          <p style={{ color: '#6b7280', marginBottom: '35px', fontSize: '15px' }}>Enter your credentials to access your account</p>

          {error && (
            <div style={{ background: '#fee', color: '#dc2626', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', fontSize: '14px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#374151', fontSize: '14px', fontWeight: '600' }}>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                style={{ width: '100%', padding: '13px 16px', border: '1px solid #e5e7eb', borderRadius: '10px', fontSize: '15px', background: '#fafafa' }}
              />
            </div>

            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#374151', fontSize: '14px', fontWeight: '600' }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                style={{ width: '100%', padding: '13px 16px', border: '1px solid #e5e7eb', borderRadius: '10px', fontSize: '15px', background: '#fafafa' }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                background: loading ? '#9ca3af' : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                color: '#fff',
                borderRadius: '10px',
                fontSize: '16px',
                fontWeight: '700',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : '0 4px 14px rgba(99, 102, 241, 0.3)'
              }}
            >
              {loading ? 'Logging in...' : 'Login →'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '25px', color: '#6b7280', fontSize: '14px' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#4f46e5', fontWeight: '700' }}>
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;