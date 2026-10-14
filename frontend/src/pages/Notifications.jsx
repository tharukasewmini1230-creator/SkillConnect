import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all | unread

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await API.get('/notifications');
      setNotifications(response.data.notifications);
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

  const deleteNotification = async (id) => {
    try {
      await API.delete(`/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error('Error deleting notification:', err);
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
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const getTypeColor = (type) => {
    const colors = {
      session_request: '#3B82F6',
      session_accepted: '#10B981',
      session_rejected: '#EF4444',
      session_completed: '#A855F7',
      new_message: '#06B6D4',
      new_review: '#F59E0B',
      new_match: '#EC4899',
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
      new_match: '🎯',
    };
    return icons[type] || '🔔';
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const filteredNotifications = filter === 'unread'
    ? notifications.filter((n) => !n.read)
    : notifications;

  return (
    <DashboardLayout>
      <div style={{ padding: '30px 35px', maxWidth: '900px' }}>

        {/* HEADER */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '25px',
          flexWrap: 'wrap',
          gap: '15px'
        }}>
          <div>
            <h1 style={{
              fontSize: '32px',
              color: 'var(--dark)',
              fontWeight: '800',
              marginBottom: '5px',
              letterSpacing: '-0.5px'
            }}>
              🔔 Notifications
            </h1>
            <p style={{ color: 'var(--gray)', fontSize: '15px' }}>
              {unreadCount > 0
                ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
                : 'You are all caught up!'}
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              style={{
                padding: '10px 20px',
                background: 'var(--primary-light)',
                color: '#3B82F6',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: '700',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              ✓ Mark all as read
            </button>
          )}
        </div>

        {/* FILTER TABS */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '20px',
          background: 'var(--white)',
          padding: '6px',
          borderRadius: '12px',
          width: 'fit-content',
          border: '1px solid var(--border)'
        }}>
          {[
            { key: 'all', label: 'All', count: notifications.length },
            { key: 'unread', label: 'Unread', count: unreadCount }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              style={{
                padding: '8px 18px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '600',
                background: filter === tab.key
                  ? 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)'
                  : 'transparent',
                color: filter === tab.key ? '#fff' : 'var(--gray)',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>{tab.label}</span>
              <span style={{
                background: filter === tab.key ? 'rgba(255,255,255,0.25)' : 'var(--light-gray)',
                color: filter === tab.key ? '#fff' : 'var(--gray)',
                padding: '1px 8px',
                borderRadius: '10px',
                fontSize: '11px',
                fontWeight: '700'
              }}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* NOTIFICATIONS LIST */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div className="spinner"></div>
            <p style={{ color: 'var(--gray)', marginTop: '15px' }}>Loading notifications...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '80px 20px',
            background: 'var(--white)',
            borderRadius: '16px',
            border: '1px solid var(--border)'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '15px' }}>🔕</div>
            <p style={{
              color: 'var(--dark)',
              fontSize: '18px',
              fontWeight: '700',
              marginBottom: '8px'
            }}>
              {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
            </p>
            <p style={{ color: 'var(--gray)', fontSize: '14px' }}>
              {filter === 'unread'
                ? 'Great! You are all caught up.'
                : "We'll notify you when something happens."}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filteredNotifications.map((notification) => (
              <div
                key={notification._id}
                style={{
                  background: notification.read ? 'var(--white)' : 'var(--primary-light)',
                  borderRadius: '14px',
                  padding: '18px 20px',
                  border: '1px solid var(--border)',
                  borderLeft: `4px solid ${getTypeColor(notification.type)}`,
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '14px',
                  position: 'relative'
                }}
              >
                {/* Icon */}
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: `${getTypeColor(notification.type)}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '22px',
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
                    gap: '10px',
                    marginBottom: '4px'
                  }}>
                    <p style={{
                      fontSize: '15px',
                      fontWeight: '700',
                      color: 'var(--dark)',
                      flex: 1
                    }}>
                      {notification.title}
                      {!notification.read && (
                        <span style={{
                          display: 'inline-block',
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: '#3B82F6',
                          marginLeft: '8px',
                          verticalAlign: 'middle'
                        }} />
                      )}
                    </p>
                    <span style={{
                      fontSize: '12px',
                      color: 'var(--gray)',
                      flexShrink: 0
                    }}>
                      {formatTime(notification.createdAt)}
                    </span>
                  </div>

                  <p style={{
                    fontSize: '14px',
                    color: 'var(--gray)',
                    lineHeight: '1.5',
                    marginBottom: '10px'
                  }}>
                    {notification.message}
                  </p>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {notification.link && (
                      <Link
                        to={notification.link}
                        onClick={() => !notification.read && markAsRead(notification._id)}
                        style={{
                          padding: '6px 14px',
                          background: 'var(--primary-light)',
                          color: '#3B82F6',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: '700',
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        View →
                      </Link>
                    )}

                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification._id)}
                        style={{
                          padding: '6px 14px',
                          background: 'transparent',
                          color: 'var(--gray)',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: '600',
                          border: '1px solid var(--border)',
                          cursor: 'pointer'
                        }}
                      >
                        Mark as read
                      </button>
                    )}

                    <button
                      onClick={() => deleteNotification(notification._id)}
                      style={{
                        padding: '6px 14px',
                        background: 'transparent',
                        color: '#EF4444',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: '600',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        cursor: 'pointer'
                      }}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default Notifications;