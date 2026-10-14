import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';

const Profile = () => {
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [university, setUniversity] = useState(user?.university || '');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Saving profile:', { name, university });

      const result = await updateProfile({
        name,
        university
      });

      console.log('Profile updated:', result);

      setToast({ message: 'Profile updated successfully!', type: 'success' });

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      console.error('Profile update error:', err);
      setToast({
        message: err.response?.data?.message || 'Failed to update profile',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #3B82F6 0%, #A855F7 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: '40px',
          fontWeight: '700',
          margin: '0 auto 20px',
          boxShadow: '0 10px 25px rgba(99, 102, 241, 0.3)'
        }}>
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <h1 style={{ fontSize: '30px', color: 'var(--dark)', fontWeight: '800', marginBottom: '5px' }}>
          {user?.name}
        </h1>
        <p style={{ color: 'var(--gray)', fontSize: '15px' }}>{user?.email}</p>
      </div>

      {/* Profile Form */}
      <div style={{
        background: 'var(--white)',
        padding: '35px',
        borderRadius: '16px',
        boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
        border: '1px solid var(--border)'
      }}>
        <h2 style={{ fontSize: '22px', color: 'var(--dark)', fontWeight: '700', marginBottom: '25px' }}>
          Edit Profile
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--dark)', fontSize: '14px', fontWeight: '600' }}>
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--border)', borderRadius: '10px', fontSize: '15px', background: 'var(--light-gray)', color: 'var(--dark)' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--dark)', fontSize: '14px', fontWeight: '600' }}>
              Email (cannot be changed)
            </label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--border)', borderRadius: '10px', fontSize: '15px', background: 'var(--light-gray)', color: 'var(--gray)', cursor: 'not-allowed' }}
            />
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--dark)', fontSize: '14px', fontWeight: '600' }}>
              University
            </label>
            <input
              type="text"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              placeholder="e.g., University of Ruhuna"
              style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--border)', borderRadius: '10px', fontSize: '15px', background: 'var(--light-gray)', color: 'var(--dark)' }}
            />
          </div>

          {/* Info Box */}
          <div style={{
            background: 'var(--primary-light)',
            borderRadius: '10px',
            padding: '14px 18px',
            marginBottom: '22px',
            fontSize: '13px',
            color: '#1E40AF',
            display: 'flex',
            gap: '10px',
            alignItems: 'flex-start',
            lineHeight: '1.5'
          }}>
            <span>💡</span>
            <span>
              To manage your skills, go to your <strong>Dashboard → My Skills</strong> section.
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              background: loading ? 'var(--gray)' : 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
              color: '#fff',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: '700',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 4px 14px rgba(59, 130, 246, 0.3)',
              border: 'none'
            }}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;