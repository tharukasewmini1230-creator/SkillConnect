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
  const [showNotifications, setShowNotifications] = useState(false);

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

  const navLinks = [
    { path: '/', label: 'Home', requireAuth: false },
    { path: '/matches', label: 'Explore', requireAuth: true },
    { path: '/dashboard', label: 'My Skills', requireAuth: true },
    { path: '/sessions', label: 'Sessions' },
    { path: '/community', label: 'Community', comingSoon: true }
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
        gap: '20px'
      }}>

        {/* ============================================
            LOGO WITH TAGLINE
            ============================================ */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0, textDecoration: 'none' }}>
          {/* People Icon SVG */}
          <svg width="42" height="42" viewBox="0 0 42 42" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#A855F7" />
              </linearGradient>
            </defs>
            {/* Left person (blue) */}
            <circle cx="15" cy="14" r="5" fill="#3B82F6" />
            <path d="M5 32c0-5.5 4.5-10 10-10s10 4.5 10 10v2H5v-2z" fill="#3B82F6" />
            {/* Right person (purple) */}
            <circle cx="28" cy="14" r="5" fill="#A855F7" />
            <path d="M18 32c0-5.5 4.5-10 10-10s10 4.5 10 10v2H18v-2z" fill="#A855F7" />
          </svg>

          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
            <span style={{
              fontSize: '22px',
              fontWeight: '800',
              color: '#0F172A',
              letterSpacing: '-0.5px',
              marginBottom: '3px'
            }}>
              Skill<span style={{
                background: 'linear-gradient(135deg, #3B82F6 0%, #A855F7 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>Connect</span>
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

        {/* ============================================
            NAV LINKS
            ============================================ */}
        <div style={{
          display: 'flex',
          gap: '4px',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          {navLinks
            .filter((link) => !link.requireAuth || user)
            .map((link) => (
              <Link
                key={link.path}
                to={link.comingSoon ? '#' : link.path}
                onClick={(e) => {
                  if (link.comingSoon) {
                    e.preventDefault();
                    alert(`${link.label} page is coming soon! 🚀`);
                  }
                }}
                style={{
                  color: isActive(link.path) ? '#3B82F6' : 'var(--gray)',
                  fontSize: '14px',
                  fontWeight: '600',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  background: isActive(link.path) ? 'var(--primary-light)' : 'transparent',
                  transition: 'all 0.2s',
                  position: 'relative'
                }}
              >
                {link.label}
                {isActive(link.path) && (
                  <span style={{
                    position: 'absolute',
                    bottom: '-12px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '20px',
                    height: '3px',
                    borderRadius: '2px',
                    background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)'
                  }} />
                )}
              </Link>
            ))}
        </div>

        {/* ============================================
            SEARCH BAR
            ============================================ */}
        {user && (
          <form onSubmit={handleSearch} style={{
            flex: 1,
            maxWidth: '300px',
            display: 'flex',
            alignItems: 'center',
            background: 'var(--light-gray)',
            borderRadius: '10px',
            padding: '9px 15px',
            gap: '10px',
            border: '1px solid transparent',
            transition: 'all 0.2s'
          }}>
            <span style={{ fontSize: '15px', color: 'var(--gray)' }}>🔍</span>
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

        {/* ============================================
            RIGHT SIDE - NOTIFICATIONS, THEME, USER
            ============================================ */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>

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
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease'
            }}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

          {user ? (
            <>
              {/* Notification Bell */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    setShowUserMenu(false);
                  }}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: 'var(--light-gray)',
                    color: 'var(--gray)',
                    fontSize: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative'
                  }}
                >
                  🔔
                  <span style={{
                    position: 'absolute',
                    top: '-3px',
                    right: '-3px',
                    background: '#EF4444',
                    color: '#fff',
                    fontSize: '10px',
                    fontWeight: '700',
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid var(--white)'
                  }}>
                    3
                  </span>
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 10px)',
                    right: 0,
                    background: 'var(--white)',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(15, 23, 42, 0.12)',
                    border: '1px solid var(--border)',
                    minWidth: '300px',
                    padding: '15px',
                    zIndex: 1000,
                    animation: 'fadeIn 0.2s ease-out'
                  }}>
                    <h4 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--dark)', marginBottom: '12px' }}>
                      Notifications
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ padding: '10px', borderRadius: '8px', background: 'var(--light-gray)' }}>
                        <p style={{ fontSize: '13px', color: 'var(--dark)', fontWeight: '500' }}>
                          🎉 Welcome to SkillConnect!
                        </p>
                        <p style={{ fontSize: '11px', color: 'var(--gray)', marginTop: '3px' }}>
                          Just now
                        </p>
                      </div>
                      <div style={{ padding: '10px', borderRadius: '8px' }}>
                        <p style={{ fontSize: '13px', color: 'var(--dark)', fontWeight: '500' }}>
                          ✨ Add your skills to find matches
                        </p>
                        <p style={{ fontSize: '11px', color: 'var(--gray)', marginTop: '3px' }}>
                          Yesterday
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* User Menu */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => {
                    setShowUserMenu(!showUserMenu);
                    setShowNotifications(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '5px 12px 5px 5px',
                    background: 'var(--light-gray)',
                    borderRadius: '30px',
                    transition: 'all 0.2s'
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

                {/* User Dropdown */}
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
                      📊 My Skills
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
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--light-gray)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      🎯 Explore Matches
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
                  background: 'linear-gradient(135deg, #3B82F6 0%, #A855F7 100%)',
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