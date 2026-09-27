import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    {
      section: 'Main',
      items: [
        { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
        { path: '/dashboard', label: 'My Skills', icon: '🎓' },
        { path: '/matches', label: 'Find Skills', icon: '🔍' },
        { path: '/sessions', label: 'My Sessions', icon: '📅' }
      ]
    },
    {
      section: 'Connect',
      items: [
        { path: '/messages', label: 'Messages', icon: '💬', badge: 3, comingSoon: true },
        { path: '/notifications', label: 'Notifications', icon: '🔔', badge: 2, comingSoon: true }
      ]
    },
    {
      section: 'Progress',
      items: [
        { path: '/leaderboard', label: 'Leaderboard', icon: '🏆' },
        { path: '/achievements', label: 'Achievements', icon: '🏅', comingSoon: true }
      ]
    },
    {
      section: 'Account',
      items: [
        { path: '/profile', label: 'Profile', icon: '👤' },
        { path: '/settings', label: 'Settings', icon: '⚙️' }
      ]
    }
  ];

  return (
    <aside style={{
      width: '260px',
      minWidth: '260px',
      maxWidth: '260px',
      background: '#0F172A',
      padding: '16px 12px',
      display: 'flex',
      flexDirection: 'column',
      position: 'sticky',
      top: 0,
      height: '100vh',
      overflowY: 'auto',
      flexShrink: 0,
      boxSizing: 'border-box'
    }}>

      {/* User Profile Card */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(59,130,246,0.15) 0%, rgba(168,85,247,0.15) 100%)',
        borderRadius: '12px',
        padding: '14px',
        marginBottom: '18px',
        border: '1px solid rgba(99,102,241,0.25)',
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box',
        width: '100%',
        minHeight: 'fit-content'
      }}>
        {/* Decorative circle */}
        <div style={{
          position: 'absolute',
          top: '-25px',
          right: '-25px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'rgba(168, 85, 247, 0.15)',
          pointerEvents: 'none'
        }} />

        {/* Avatar + Info Row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          position: 'relative',
          zIndex: 1,
          marginBottom: '10px'
        }}>
          {/* Avatar */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #3B82F6 0%, #A855F7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: '800',
              fontSize: '16px',
              border: '2px solid #0F172A'
            }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <span style={{
              position: 'absolute',
              bottom: '-1px',
              right: '-1px',
              width: '11px',
              height: '11px',
              borderRadius: '50%',
              background: '#10B981',
              border: '2px solid #0F172A'
            }} />
          </div>

          {/* Info */}
          <div style={{ minWidth: 0, flex: 1, overflow: 'hidden' }}>
            <p style={{
              color: '#fff',
              fontSize: '13px',
              fontWeight: '700',
              margin: 0,
              marginBottom: '2px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {user?.name || 'User'}
            </p>
            <p style={{
              color: '#94A3B8',
              fontSize: '10px',
              fontWeight: '500',
              margin: 0,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {user?.university || 'Student'}
            </p>
          </div>
        </div>

        {/* Online Badge Row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '5px',
            background: 'rgba(16, 185, 129, 0.15)',
            padding: '4px 10px',
            borderRadius: '12px',
            whiteSpace: 'nowrap'
          }}>
            <span style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#10B981',
              flexShrink: 0,
              boxShadow: '0 0 6px rgba(16, 185, 129, 0.6)'
            }} />
            <span style={{
              color: '#10B981',
              fontSize: '10px',
              fontWeight: '700',
              letterSpacing: '0.6px',
              lineHeight: 1
            }}>
              ONLINE
            </span>
          </div>
        </div>
      </div>

      {/* Menu Sections */}
      <div style={{ flex: 1 }}>
        {menuItems.map((section, sIdx) => (
          <div key={sIdx} style={{ marginBottom: '18px' }}>
            <p style={{
              color: '#64748B',
              fontSize: '10px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              margin: 0,
              marginBottom: '6px',
              paddingLeft: '10px'
            }}>
              {section.section}
            </p>

            {section.items.map((item, iIdx) => (
              <Link
                key={iIdx}
                to={item.comingSoon ? '#' : item.path}
                onClick={(e) => {
                  if (item.comingSoon) {
                    e.preventDefault();
                    alert(`${item.label} page is coming soon! 🚀`);
                  }
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  marginBottom: '2px',
                  background: isActive(item.path) && !item.comingSoon
                    ? 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)'
                    : 'transparent',
                  color: isActive(item.path) && !item.comingSoon
                    ? '#fff'
                    : '#94A3B8',
                  fontSize: '13.5px',
                  fontWeight: isActive(item.path) && !item.comingSoon ? '600' : '500',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  if (!isActive(item.path) || item.comingSoon) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                    e.currentTarget.style.color = '#fff';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive(item.path) || item.comingSoon) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#94A3B8';
                  }
                }}
              >
                <span style={{ fontSize: '15px', flexShrink: 0 }}>{item.icon}</span>
                <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.label}
                </span>
                {item.badge > 0 && (
                  <span style={{
                    background: '#EF4444',
                    color: '#fff',
                    fontSize: '10px',
                    fontWeight: '700',
                    padding: '2px 6px',
                    borderRadius: '10px',
                    minWidth: '16px',
                    textAlign: 'center',
                    flexShrink: 0
                  }}>
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>
        ))}
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '11px',
          borderRadius: '8px',
          background: 'rgba(239, 68, 68, 0.1)',
          color: '#F87171',
          fontSize: '13.5px',
          fontWeight: '600',
          border: 'none',
          cursor: 'pointer',
          width: '100%',
          transition: 'all 0.2s ease',
          marginTop: '8px',
          flexShrink: 0
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
        }}
      >
        <span style={{ fontSize: '15px' }}>🚪</span>
        <span>Log Out</span>
      </button>
    </aside>
  );
};

export default Sidebar;