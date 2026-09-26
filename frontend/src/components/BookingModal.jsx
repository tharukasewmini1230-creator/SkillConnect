import { useState } from 'react';
import API from '../services/api';

const BookingModal = ({ mentor, skill, onClose, onSuccess }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [mode, setMode] = useState('Online');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await API.post('/sessions', {
        mentor: mentor._id,
        skill,
        message,
        date,
        time,
        mode
      });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book session');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px',
        backdropFilter: 'blur(4px)'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--white)',
          borderRadius: '16px',
          padding: '30px',
          maxWidth: '500px',
          width: '100%',
          boxShadow: '0 20px 50px rgba(15, 23, 42, 0.25)',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '25px' }}>
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--dark)', marginBottom: '5px' }}>
              📅 Book a Session
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--gray)' }}>
              with <strong style={{ color: 'var(--dark)' }}>{mentor.name}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'var(--light-gray)',
              color: 'var(--gray)',
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ✕
          </button>
        </div>

        {/* Skill being requested */}
        <div style={{
          background: 'var(--primary-light)',
          padding: '12px 16px',
          borderRadius: '10px',
          marginBottom: '20px'
        }}>
          <p style={{ fontSize: '12px', color: '#3B82F6', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
            Skill
          </p>
          <p style={{ fontSize: '15px', color: '#1E40AF', fontWeight: '700' }}>
            {skill}
          </p>
        </div>

        {error && (
          <div style={{
            background: 'var(--danger-light)',
            color: '#DC2626',
            padding: '12px 16px',
            borderRadius: '10px',
            marginBottom: '20px',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Date */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--dark)', fontSize: '14px', fontWeight: '600' }}>
              📅 Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              min={new Date().toISOString().split('T')[0]}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid var(--border)',
                borderRadius: '10px',
                fontSize: '15px',
                background: 'var(--light-gray)',
                color: 'var(--dark)'
              }}
            />
          </div>

          {/* Time */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--dark)', fontSize: '14px', fontWeight: '600' }}>
              ⏰ Time
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid var(--border)',
                borderRadius: '10px',
                fontSize: '15px',
                background: 'var(--light-gray)',
                color: 'var(--dark)'
              }}
            />
          </div>

          {/* Mode */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--dark)', fontSize: '14px', fontWeight: '600' }}>
              Mode
            </label>
            <div style={{ display: 'flex', gap: '10px' }}>
              {['Online', 'Physical'].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: '600',
                    background: mode === m ? 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)' : 'var(--light-gray)',
                    color: mode === m ? '#fff' : 'var(--gray)',
                    transition: 'all 0.2s'
                  }}
                >
                  {m === 'Online' ? '💻 Online' : '📍 Physical'}
                </button>
              ))}
            </div>
          </div>

          {/* Message */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--dark)', fontSize: '14px', fontWeight: '600' }}>
              Message (Optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows="3"
              placeholder="e.g., I would like to focus on hooks and state management..."
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid var(--border)',
                borderRadius: '10px',
                fontSize: '14px',
                background: 'var(--light-gray)',
                color: 'var(--dark)',
                resize: 'vertical',
                fontFamily: 'inherit'
              }}
            />
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                minWidth: '180px',
                padding: '14px 24px',
                background: loading ? 'var(--gray)' : 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
                color: '#fff',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: '700',
                boxShadow: loading ? 'none' : '0 4px 12px rgba(59, 130, 246, 0.3)',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Sending...' : 'Send Request'}
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '14px 24px',
                background: 'var(--light-gray)',
                color: 'var(--gray)',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: '600'
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;