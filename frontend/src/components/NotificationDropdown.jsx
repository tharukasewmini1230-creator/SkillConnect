import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';

const NotificationDropdown = ({ onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchNotifications();

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await API.get('/notifications');
      setNotifications(response.data.notifications.slice(0, 10)); // Show latest 10
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await API.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await API.put('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
  };

  const getTypeColor = (type) => {
    const colors = {
      session_request: '#3B82F6',
      session_accepted: '#10B981',
      session_rejected: '#EF4444',
      session_completed: '#A855F7',
      new_message: '#06B6D4',
      new_review: '#F59E0B',
      new_match: '#EC4899'
    };
    return colors[type] || '#6B7280';
  };

  const getTypeIcon = (type) => {
    const icons = {
      session_request: '📅',
      session_accepted: '✅',
      session_rejected: '❌',
      session_completed: '🎉',
      new_message: '💬',
      new_review: '⭐',
      new_match: '🎯'
    };
    return icons[type] || '🔔';
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div
      ref={dropdownRef}
      style={{
        position: 'absolute',
        top: 'calc(100% + 10px)',
        right: 0,
        width: '380px',
        maxHeight: '500px',
        background: 'var(--white)',
        borderRadius: '16px',
        boxShadow: '0 10px 40px rgba(15, 23, 42, 0.15)',
        border: '1px solid var(--border)',
        overflow: 'hidden',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Header */}
      <div style={{
        padding: '18px 20px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '800',
            color: 'var(--dark)',
            marginBottom: '2px'
          }}>
            Notifications
          </h3>
          {unreadCount > 0 && (
            <p style={{ fontSize: '12px', color: 'var(--gray)' }}>
              {unreadCount} unread
            </p>
          )}
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#3B82F6',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              padding: '5px 8px',
              borderRadius: '6px'
            }}
          >
            Mark all read
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div style={{ overflowY: 'auto', flex: 1 }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div className="spinner" style={{ width: '30px', height: '30px' }}></div>
          </div>
        ) : notifications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px 20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '10px' }}>🔔</div>
            <p style={{ fontSize: '14px', color: 'var(--dark)', fontWeight: '600', marginBottom: '5px' }}>
              No notifications yet
            </p>
            <p style={{ fontSize: '12px', color: 'var(--gray)' }}>
              We'll notify you when something happens
            </p>
          </div>
        ) : (
          notifications.map((notification) => (
            <Link
              key={notification._id}
              to={notification.link}
              onClick={() => {
                if (!notification.read) markAsRead(notification._id);
                onClose();
              }}
              style={{
                display: 'flex',
                gap: '12px',
                padding: '15px 20px',
                borderBottom: '1px solid var(--border)',
                textDecoration: 'none',
                background: notification.read ? 'transparent' : 'var(--primary-light)',
                transition: 'background 0.2s',
                cursor: 'pointer'
              }}
            >
              {/* Icon */}
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: `${getTypeColor(notification.type)}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                flexShrink: 0
              }}>
                {getTypeIcon(notification.type)}
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '8px',
                  marginBottom: '4px'
                }}>
                  <p style={{
                    fontSize: '13px',
                    fontWeight: '700',
                    color: 'var(--dark)',
                    lineHeight: '1.3'
                  }}>
                    {notification.title}
                  </p>
                  {!notification.read && (
                    <span style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#3B82F6',
                      flexShrink: 0,
                      marginTop: '5px'
                    }} />
                  )}
                </div>
                <p style={{
                  fontSize: '12px',
                  color: 'var(--gray)',
                  lineHeight: '1.5',
                  marginBottom: '4px',
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical'
                }}>
                  {notification.message}
                </p>
                <p style={{
                  fontSize: '10px',
                  color: 'var(--gray)',
                  fontWeight: '500'
                }}>
                  {formatTime(notification.createdAt)}
                </p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;