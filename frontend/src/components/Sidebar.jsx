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
        { path: '/sessions', label: 'My Sessions', icon: '📅', badge: 0 }
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
        { path: '/leaderboard', label: 'Leaderboard', icon: '🏆', comingSoon: true },
        { path: '/achievements', label: 'Achievements', icon: '🏅', comingSoon: true }
      ]
    },
    {
      section: 'Account',
      items: [
        { path: '/profile', label: 'Profile', icon: '👤' },
        { path: '/settings', label: 'Settings', icon: '⚙️', comingSoon: true }
      ]
    }
  ];

  return (
    <aside style={{
      width: '260px',
      background: '#0F172A',
      minHeight: '100vh',
      padding: '20px 15px',
      display: 'flex',
      flexDirection: 'column',
      position: 'sticky',
      top: 0,
      height: '100vh',
      overflowY: 'auto',
      flexShrink: 0
    }}>

      {/* User Profile Card */}
      <div style={{
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '14px',
        padding: '16px',
        marginBottom: '25px',
        border: '1px solid rgba(255,255,255,0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #3B82F6 0%, #A855F7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: '700',
            fontSize: '20px',
            flexShrink: 0,
            position: 'relative'
          }}>
            {user?.name?.charAt(0).toUpperCase()}
            <span style={{
              position: 'absolute',
              bottom: '0',
              right: '0',
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: '#10B981',
              border: '2px solid #0F172A'
            }} />
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{
              color: '#fff',
              fontSize: '14px',
              fontWeight: '700',
              marginBottom: '2px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {user?.name || 'User'}
            </p>
            <p style={{
              color: '#94A3B8',
              fontSize: '11px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {user?.university || 'Student'}
            </p>
          </div>
        </div>
      </div>

      {/* Menu Sections */}
      <div style={{ flex: 1 }}>
        {menuItems.map((section, sIdx) => (
          <div key={sIdx} style={{ marginBottom: '20px' }}>
            <p style={{
              color: '#64748B',
              fontSize: '10px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '8px',
              paddingLeft: '12px'
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
                  gap: '12px',
                  padding: '11px 12px',
                  borderRadius: '10px',
                  marginBottom: '3px',
                  background: isActive(item.path) && !item.comingSoon
                    ? 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)'
                    : 'transparent',
                  color: isActive(item.path) && !item.comingSoon
                    ? '#fff'
                    : '#94A3B8',
                  fontSize: '14px',
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
                <span style={{ fontSize: '16px', flexShrink: 0 }}>{item.icon}</span>
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge > 0 && (
                  <span style={{
                    background: '#EF4444',
                    color: '#fff',
                    fontSize: '10px',
                    fontWeight: '700',
                    padding: '2px 7px',
                    borderRadius: '10px',
                    minWidth: '18px',
                    textAlign: 'center'
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
          gap: '12px',
          padding: '12px',
          borderRadius: '10px',
          background: 'rgba(239, 68, 68, 0.1)',
          color: '#F87171',
          fontSize: '14px',
          fontWeight: '600',
          border: 'none',
          cursor: 'pointer',
          width: '100%',
          transition: 'all 0.2s ease',
          marginTop: '10px'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
        }}
      >
        <span style={{ fontSize: '16px' }}>🚪</span>
        <span>Log Out</span>
      </button>
    </aside>
  );
};

export default Sidebar;