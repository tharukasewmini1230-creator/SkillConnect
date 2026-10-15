import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Sidebar from './Sidebar';
import NotificationDropdown from './NotificationDropdown';
import API from '../services/api';

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  // Fetch notification count
  useEffect(() => {
    const fetchNotificationCount = async () => {
      if (!user) return;
      try {
        const response = await API.get('/notifications/unread-count');
        setNotificationCount(response.data.count);
      } catch (err) {
        console.error('Error fetching notification count:', err);
      }
    };

    fetchNotificationCount();

    // Poll every 30 seconds
    const interval = setInterval(fetchNotificationCount, 30000);
    return () => clearInterval(interval);
  }, [user]);

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: 'var(--background)'
    }}>

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0
      }}>

        {/* TOP BAR */}
        <header style={{
          background: 'var(--white)',
          borderBottom: '1px solid var(--border)',
          padding: '15px 30px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px',
          position: 'sticky',
          top: 0,
          zIndex: 50
        }}>

          {/* Search Bar */}
          <form onSubmit={handleSearch} style={{
            flex: 1,
            maxWidth: '400px',
            display: 'flex',
            alignItems: 'center',
            background: 'var(--light-gray)',
            borderRadius: '30px',
            padding: '10px 20px',
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
                fontSize: '14px',
                color: 'var(--dark)',
                outline: 'none'
              }}
            />
          </form>

          {/* Right Side */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>

            {/* Points Badge */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
              borderRadius: '30px',
              border: '1px solid rgba(245, 158, 11, 0.3)'
            }}>
              <span style={{ fontSize: '15px' }}>⭐</span>
              <span style={{
                color: '#92400E',
                fontSize: '14px',
                fontWeight: '700'
              }}>
                {user?.points || 0}
              </span>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: 'var(--light-gray)',
                color: theme === 'light' ? 'var(--gray)' : '#FBBF24',
                fontSize: '17px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>

            {/* Notifications */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowUserMenu(false);
                }}
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: showNotifications ? 'var(--primary-light)' : 'var(--light-gray)',
                  color: showNotifications ? '#3B82F6' : 'var(--gray)',
                  fontSize: '17px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                🔔
                {notificationCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '0',
                    right: '0',
                    background: '#EF4444',
                    color: '#fff',
                    fontSize: '10px',
                    fontWeight: '700',
                    minWidth: '20px',
                    height: '20px',
                    padding: '0 4px',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid var(--white)'
                  }}>
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <NotificationDropdown
                  onClose={() => setShowNotifications(false)}
                />
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
                  gap: '10px',
                  padding: '5px 14px 5px 5px',
                  background: 'var(--light-gray)',
                  borderRadius: '30px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #3B82F6 0%, #A855F7 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: '700',
                  fontSize: '15px',
                  overflow: 'hidden',
                  flexShrink: 0
                }}>
                  {user?.avatar && user.avatar.trim() !== '' ? (
                    <img
                      src={
                        user.avatar.startsWith('http')
                          ? user.avatar
                          : `http://localhost:5000${user.avatar}`
                      }
                      alt={user.name || 'User'}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        if (e.target.parentElement) {
                          e.target.parentElement.textContent = user?.name?.charAt(0).toUpperCase() || '?';
                        }
                      }}
                    />
                  ) : (
                    user?.name?.charAt(0).toUpperCase() || '?'
                  )}
                </div>
                <span style={{
                  color: 'var(--dark)',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  {user?.name?.split(' ')[0]}
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
                  minWidth: '230px',
                  padding: '8px',
                  zIndex: 1000
                }}>
                  <div style={{
                    padding: '14px',
                    borderBottom: '1px solid var(--border)',
                    marginBottom: '5px'
                  }}>
                    <p style={{ fontSize: '14px', fontWeight: '700', color: 'var(--dark)', marginBottom: '3px' }}>
                      {user?.name}
                    </p>
                    <p style={{ fontSize: '12px', color: 'var(--gray)' }}>{user?.email}</p>
                  </div>

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

                  <Link
                    to="/achievements"
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
                    🏅 Achievements
                  </Link>

                  <Link
                    to="/how-it-works"
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
                    📖 How It Works
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
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      🚪 Logout
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* PAGE CONTENT */}
        <main style={{
          flex: 1,
          overflow: 'auto'
        }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;