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

  // Links visible to everyone
  const publicLinks = [
    { path: '/', label: 'Home' },
    { path: '/how-it-works', label: 'How It Works' },
    { path: '/about', label: 'About' }
  ];

  // Links visible only when logged in
  const privateLinks = [
    { path: '/matches', label: 'Explore' },
    { path: '/sessions', label: 'Sessions' }
  ];

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
        padding: '12px 20px',
        gap: '15px'
      }}>

        {/* LOGO */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0, textDecoration: 'none' }}>
          <svg width="42" height="42" viewBox="0 0 42 42" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#A855F7" />
              </linearGradient>
            </defs>
            <rect x="2" y="2" width="38" height="38" rx="10" fill="url(#logoGrad)" />
            <circle cx="15" cy="17" r="4.5" fill="#FFFFFF" />
            <path d="M7 30c0-4.4 3.6-8 8-8s8 3.6 8 8v1H7v-1z" fill="#FFFFFF" />
            <circle cx="28" cy="17" r="4.5" fill="#FFFFFF" opacity="0.85" />
            <path d="M20 30c0-4.4 3.6-8 8-8s8 3.6 8 8v1H20v-1z" fill="#FFFFFF" opacity="0.85" />
          </svg>

          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
            <span style={{
              fontSize: '22px',
              fontWeight: '800',
              color: 'var(--dark)',
              letterSpacing: '-0.5px',
              marginBottom: '3px'
            }}>
              Skill<span style={{
                background: 'linear-gradient(135deg, #3B82F6 0%, #A855F7 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>Swap</span>
            </span>
            <span style={{
              fontSize: '10px',
              color: 'var(--gray)',
              fontWeight: '600',
              letterSpacing: '0.5px'
            }}>
              Learn • Share • Grow
            </span>
          </div>
        </Link>

        {/* NAV LINKS */}
        <div style={{
          display: 'flex',
          gap: '4px',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          {publicLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              style={{
                color: isActive(link.path) ? '#3B82F6' : 'var(--gray)',
                fontSize: '14px',
                fontWeight: '600',
                padding: '8px 14px',
                borderRadius: '8px',
                background: isActive(link.path) ? 'var(--primary-light)' : 'transparent',
                transition: 'all 0.2s',
                textDecoration: 'none'
              }}
            >
              {link.label}
            </Link>
          ))}

          {user && privateLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              style={{
                color: isActive(link.path) ? '#3B82F6' : 'var(--gray)',
                fontSize: '14px',
                fontWeight: '600',
                padding: '8px 14px',
                borderRadius: '8px',
                background: isActive(link.path) ? 'var(--primary-light)' : 'transparent',
                transition: 'all 0.2s',
                textDecoration: 'none'
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* SEARCH BAR (only when logged in) */}
        {user && (
          <form onSubmit={handleSearch} style={{
            flex: 1,
            maxWidth: '280px',
            display: 'flex',
            alignItems: 'center',
            background: 'var(--light-gray)',
            borderRadius: '30px',
            padding: '9px 18px',
            gap: '10px',
            border: '1px solid transparent',
            transition: 'all 0.2s'
          }}>
            <span style={{ fontSize: '14px', color: 'var(--gray)' }}>🔍</span>
            <input
              type="text"
              placeholder="Search skills, people..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                border: 'none',
                background: 'transparent',
                fontSize: '13px',
                color: 'var(--dark)',
                outline: 'none'
              }}
            />
          </form>
        )}

        {/* RIGHT SIDE */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'var(--light-gray)',
              color: theme === 'light' ? 'var(--gray)' : '#FBBF24',
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

          {user ? (
            <>
              {/* User Menu */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '5px 12px 5px 5px',
                    background: 'var(--light-gray)',
                    borderRadius: '30px',
                    transition: 'all 0.2s',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #3B82F6 0%, #A855F7 100%)',
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
                    zIndex: 1000
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
                        textDecoration: 'none'
                      }}
                    >
                      📊 My Dashboard
                    </Link>

                    <Link
                      to="/matches"
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
                        textDecoration: 'none'
                      }}
                    >
                      🎯 Explore Matches
                    </Link>

                    <Link
                      to="/notifications"
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
                        textDecoration: 'none'
                      }}
                    >
                      🔔 Notifications
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
                        textDecoration: 'none'
                      }}
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
                          border: 'none',
                          cursor: 'pointer'
                        }}
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
              {/* Login Button - White with Border */}
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <button style={{
                  padding: '10px 24px',
                  background: '#fff',
                  color: '#3B82F6',
                  borderRadius: '50px',
                  fontSize: '14px',
                  fontWeight: '700',
                  border: '2px solid #3B82F6',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}>
                  Login
                </button>
              </Link>

              {/* Sign Up Button - Gradient */}
              <Link to="/register" style={{ textDecoration: 'none' }}>
                <button style={{
                  padding: '10px 24px',
                  background: 'linear-gradient(135deg, #3B82F6 0%, #A855F7 100%)',
                  color: '#fff',
                  borderRadius: '50px',
                  fontSize: '14px',
                  fontWeight: '700',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                  transition: 'all 0.2s ease'
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