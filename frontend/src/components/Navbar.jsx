import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{ background: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.06)', position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid #e5e7eb' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '700', fontSize: '18px' }}>
            S
          </div>
          <span style={{ fontSize: '20px', fontWeight: '700', color: '#4f46e5' }}>SkillConnect</span>
        </Link>

        <div style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
          <Link to="/" style={{ color: isActive('/') ? '#4f46e5' : '#4b5563', fontSize: '15px', fontWeight: '500', padding: '5px 0', borderBottom: isActive('/') ? '2px solid #4f46e5' : '2px solid transparent', transition: 'all 0.2s' }}>
            Home
          </Link>

          {user ? (
            <>
              <Link to="/dashboard" style={{ color: isActive('/dashboard') ? '#4f46e5' : '#4b5563', fontSize: '15px', fontWeight: '500', padding: '5px 0', borderBottom: isActive('/dashboard') ? '2px solid #4f46e5' : '2px solid transparent', transition: 'all 0.2s' }}>
                Dashboard
              </Link>
              <Link to="/profile" style={{ color: isActive('/profile') ? '#4f46e5' : '#4b5563', fontSize: '15px', fontWeight: '500', padding: '5px 0', borderBottom: isActive('/profile') ? '2px solid #4f46e5' : '2px solid transparent', transition: 'all 0.2s' }}>
                Profile
              </Link>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', background: '#eef2ff', borderRadius: '20px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '600', fontSize: '13px' }}>
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ color: '#4f46e5', fontSize: '14px', fontWeight: '600' }}>{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  style={{ padding: '8px 18px', background: '#fee', color: '#dc2626', borderRadius: '6px', fontSize: '14px', fontWeight: '600' }}
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" style={{ color: isActive('/login') ? '#4f46e5' : '#4b5563', fontSize: '15px', fontWeight: '500', padding: '5px 0', borderBottom: isActive('/login') ? '2px solid #4f46e5' : '2px solid transparent', transition: 'all 0.2s' }}>
                Login
              </Link>
              <Link to="/register">
                <button style={{ padding: '9px 22px', background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', color: '#fff', borderRadius: '8px', fontSize: '14px', fontWeight: '600', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)' }}>
                  Register
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;