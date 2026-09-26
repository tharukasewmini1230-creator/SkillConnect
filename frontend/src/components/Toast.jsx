import { useEffect } from 'react';

const Toast = ({ message, type = 'success', onClose }) => {
  // Auto close after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const colors = {
    success: { bg: '#d1fae5', color: '#065f46', border: '#10b981', icon: '✅' },
    error: { bg: '#fee', color: '#dc2626', border: '#ef4444', icon: '❌' },
    info: { bg: '#eef2ff', color: '#4f46e5', border: '#6366f1', icon: 'ℹ️' },
    warning: { bg: '#fef3c7', color: '#92400e', border: '#f59e0b', icon: '⚠️' }
  };

  const style = colors[type] || colors.success;

  return (
    <div
      style={{
        position: 'fixed',
        top: '85px',
        right: '20px',
        zIndex: 9999,
        background: style.bg,
        color: style.color,
        padding: '14px 20px',
        borderRadius: '12px',
        borderLeft: `4px solid ${style.border}`,
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontWeight: '600',
        fontSize: '14px',
        minWidth: '280px',
        maxWidth: '400px',
        animation: 'slideIn 0.3s ease-out'
      }}
    >
      <span style={{ fontSize: '18px' }}>{style.icon}</span>
      <span style={{ flex: 1 }}>{message}</span>
      <button
        onClick={onClose}
        style={{
          background: 'transparent',
          border: 'none',
          color: style.color,
          fontSize: '18px',
          cursor: 'pointer',
          padding: '0 5px',
          opacity: 0.6
        }}
      >
        ✕
      </button>
    </div>
  );
};

export default Toast;