import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={{ background: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.08)', position: 'sticky', top: 0, zIndex: 100 }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px' }}>
        <Link to="/" style={{ fontSize: '22px', fontWeight: '700', color: '#4f46e5' }}>
          SkillConnect
        </Link>

        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Link to="/" style={{ color: '#4b5563', fontSize: '15px', fontWeight: '500' }}>
            Home
          </Link>

          {user ? (
            <>
              <Link to="/dashboard" style={{ color: '#4b5563', fontSize: '15px', fontWeight: '500' }}>
                Dashboard
              </Link>
              <span style={{ color: '#6b7280', fontSize: '14px' }}>
                Hi, <strong style={{ color: '#1f2937' }}>{user.name}</strong>
              </span>
              <button
                onClick={handleLogout}
                style={{ padding: '8px 18px', background: '#ef4444', color: '#fff', borderRadius: '6px', fontSize: '14px', fontWeight: '500' }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ color: '#4b5563', fontSize: '15px', fontWeight: '500' }}>
                Login
              </Link>
              <Link to="/register">
                <button style={{ padding: '8px 18px', background: '#4f46e5', color: '#fff', borderRadius: '6px', fontSize: '14px', fontWeight: '500' }}>
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