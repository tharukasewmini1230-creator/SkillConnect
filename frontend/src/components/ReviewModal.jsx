import { useState } from 'react';
import API from '../services/api';

const ReviewModal = ({ session, reviewee, onClose, onSuccess }) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await API.post('/reviews', {
        sessionId: session._id,
        rating,
        comment
      });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
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
              ⭐ Leave a Review
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--gray)' }}>
              How was your session with <strong style={{ color: 'var(--dark)' }}>{reviewee.name}</strong>?
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

        {/* Session Info */}
        <div style={{
          background: 'var(--primary-light)',
          padding: '12px 16px',
          borderRadius: '10px',
          marginBottom: '20px'
        }}>
          <p style={{ fontSize: '12px', color: '#3B82F6', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
            Session
          </p>
          <p style={{ fontSize: '15px', color: '#1E40AF', fontWeight: '700' }}>
            {session.skill}
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
          {/* Star Rating */}
          <div style={{ marginBottom: '20px', textAlign: 'center' }}>
            <label style={{ display: 'block', marginBottom: '12px', color: 'var(--dark)', fontSize: '14px', fontWeight: '600' }}>
              Your Rating
            </label>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    fontSize: '40px',
                    cursor: 'pointer',
                    padding: '0',
                    transform: (hoverRating || rating) >= star ? 'scale(1.15)' : 'scale(1)',
                    transition: 'transform 0.15s ease',
                    filter: (hoverRating || rating) >= star ? 'none' : 'grayscale(1) opacity(0.3)'
                  }}
                >
                  ⭐
                </button>
              ))}
            </div>
            <p style={{ fontSize: '14px', color: 'var(--gray)', marginTop: '8px', fontWeight: '600' }}>
              {rating === 1 && 'Poor'}
              {rating === 2 && 'Fair'}
              {rating === 3 && 'Good'}
              {rating === 4 && 'Very Good'}
              {rating === 5 && 'Excellent!'}
            </p>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--dark)', fontSize: '14px', fontWeight: '600' }}>
              Your Review
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              rows="4"
              maxLength="500"
              placeholder="Share your experience. What did you learn? How was the mentor?"
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
            <p style={{ fontSize: '11px', color: 'var(--gray)', marginTop: '5px', textAlign: 'right' }}>
              {comment.length}/500 characters
            </p>
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
                background: loading ? 'var(--gray)' : 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                color: '#fff',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: '700',
                boxShadow: loading ? 'none' : '0 4px 12px rgba(245, 158, 11, 0.3)',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
            {loading ? 'Submitting...' : '⭐ Submit Review'}
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

export default ReviewModal;