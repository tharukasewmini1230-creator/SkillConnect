import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      background: 'var(--white)',
      boxShadow: '0 1px 3px rgba(15, 23, 42, 0.06)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      borderBottom: '1px solid var(--border)'
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '14px 20px',
        gap: '20px'
      }}>

        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: '800',
            fontSize: '20px',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
          }}>
            S
          </div>
          <span style={{
            fontSize: '20px',
            fontWeight: '800',
            color: 'var(--dark)',
            letterSpacing: '-0.5px'
          }}>
            Skill<span style={{ color: '#3B82F6' }}>Connect</span>
          </span>
        </Link>

        {/* Search Bar (Desktop only) */}
        {user && (
          <form onSubmit={handleSearch} style={{
            flex: 1,
            maxWidth: '400px',
            display: 'flex',
            alignItems: 'center',
            background: 'var(--light-gray)',
            borderRadius: '10px',
            padding: '8px 15px',
            gap: '10px'
          }}>
            <span style={{ fontSize: '16px', color: 'var(--gray)' }}>🔍</span>
            <input
              type="text"
              placeholder="Search skills, people..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                border: 'none',
                background: 'transparent',
                fontSize: '14px',
                color: 'var(--dark)',
                outline: 'none'
              }}
            />
          </form>
        )}

        {/* Right Side */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>

          <Link to="/" style={{
            color: isActive('/') ? '#3B82F6' : 'var(--gray)',
            fontSize: '15px',
            fontWeight: '600',
            padding: '8px 12px',
            borderRadius: '8px',
            background: isActive('/') ? 'var(--primary-light)' : 'transparent',
            transition: 'all 0.2s'
          }}>
            Home
          </Link>

          {user ? (
            <>
              <Link to="/dashboard" style={{
                color: isActive('/dashboard') ? '#3B82F6' : 'var(--gray)',
                fontSize: '15px',
                fontWeight: '600',
                padding: '8px 12px',
                borderRadius: '8px',
                background: isActive('/dashboard') ? 'var(--primary-light)' : 'transparent',
                transition: 'all 0.2s'
              }}>
                Dashboard
              </Link>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: theme === 'light' ? 'var(--light-gray)' : '#334155',
                  color: theme === 'light' ? 'var(--gray)' : '#FBBF24',
                  fontSize: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease'
                }}
              >
                {theme === 'light' ? '🌙' : '☀️'}
              </button>

              {/* User Menu */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 12px 6px 6px',
                    background: 'var(--light-gray)',
                    borderRadius: '30px',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: '700',
                    fontSize: '14px'
                  }}>
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span style={{
                    color: 'var(--dark)',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    {user.name?.split(' ')[0]}
                  </span>
                  <span style={{ fontSize: '10px', color: 'var(--gray)' }}>
                    {showUserMenu ? '▲' : '▼'}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 10px)',
                    right: 0,
                    background: 'var(--white)',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(15, 23, 42, 0.12)',
                    border: '1px solid var(--border)',
                    minWidth: '220px',
                    padding: '8px',
                    zIndex: 1000,
                    animation: 'fadeIn 0.2s ease-out'
                  }}>
                    <div style={{
                      padding: '12px',
                      borderBottom: '1px solid var(--border)',
                      marginBottom: '5px'
                    }}>
                      <p style={{ fontSize: '14px', fontWeight: '700', color: 'var(--dark)', marginBottom: '3px' }}>
                        {user.name}
                      </p>
                      <p style={{ fontSize: '12px', color: 'var(--gray)' }}>{user.email}</p>
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={() => setShowUserMenu(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        fontSize: '14px',
                        color: 'var(--dark)',
                        fontWeight: '500',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--light-gray)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      📊 Dashboard
                    </Link>

                    <Link
                      to="/profile"
                      onClick={() => setShowUserMenu(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        fontSize: '14px',
                        color: 'var(--dark)',
                        fontWeight: '500',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--light-gray)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      👤 My Profile
                    </Link>

                    <div style={{ borderTop: '1px solid var(--border)', marginTop: '5px', paddingTop: '5px' }}>
                      <button
                        onClick={handleLogout}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '10px 12px',
                          borderRadius: '8px',
                          fontSize: '14px',
                          color: '#EF4444',
                          fontWeight: '600',
                          background: 'transparent',
                          textAlign: 'left',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--danger-light)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        🚪 Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <button
                onClick={toggleTheme}
                title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: theme === 'light' ? 'var(--light-gray)' : '#334155',
                  color: theme === 'light' ? 'var(--gray)' : '#FBBF24',
                  fontSize: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease'
                }}
              >
                {theme === 'light' ? '🌙' : '☀️'}
              </button>

              <Link to="/login" style={{
                color: isActive('/login') ? '#3B82F6' : 'var(--gray)',
                fontSize: '15px',
                fontWeight: '600',
                padding: '8px 12px',
                borderRadius: '8px',
                transition: 'all 0.2s'
              }}>
                Login
              </Link>

              <Link to="/register">
                <button style={{
                  padding: '9px 20px',
                  background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
                  color: '#fff',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '700',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                }}>
                  Sign Up
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