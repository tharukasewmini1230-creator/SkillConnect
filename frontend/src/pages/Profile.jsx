import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';
import DashboardLayout from '../components/DashboardLayout';

const Profile = () => {
  const { user, updateProfile, uploadAvatar, deleteAvatar } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [university, setUniversity] = useState(user?.university || '');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);

  const fileInputRef = useRef(null);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowAvatarMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateProfile({ name, university });
      setToast({ message: 'Profile updated successfully!', type: 'success' });
      setTimeout(() => window.location.reload(), 1200);
    } catch (err) {
      setToast({
        message: err.response?.data?.message || 'Failed to update profile',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setToast({ message: 'File too large. Max 2MB.', type: 'error' });
      return;
    }

    if (!file.type.startsWith('image/')) {
      setToast({ message: 'Please select an image file.', type: 'error' });
      return;
    }

    setUploadingAvatar(true);
    setShowAvatarMenu(false);
    try {
      await uploadAvatar(file);
      setToast({ message: 'Profile photo updated!', type: 'success' });
    } catch (err) {
      setToast({
        message: err.response?.data?.message || 'Failed to upload photo',
        type: 'error'
      });
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAvatarRemove = async () => {
    setShowAvatarMenu(false);
    if (!window.confirm('Remove your profile photo?')) return;

    try {
      await deleteAvatar();
      setToast({ message: 'Profile photo removed!', type: 'success' });
    } catch (err) {
      setToast({
        message: err.response?.data?.message || 'Failed to remove photo',
        type: 'error'
      });
    }
  };

  const skillsOffered = user?.skillsOffered?.length || 0;
  const skillsWanted = user?.skillsWanted?.length || 0;
  const points = user?.points || 0;

  return (
    <DashboardLayout>
      <div style={{ background: 'var(--background)', paddingBottom: '60px' }}>

        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

        {/* HERO HEADER */}
        <div style={{
          background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 50%, #A855F7 100%)',
          padding: '50px 20px 80px',
          position: 'relative',
          overflow: 'visible'
        }}>
          <div style={{
            position: 'absolute', top: '-80px', right: '-80px',
            width: '250px', height: '250px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)',
            pointerEvents: 'none'
          }} />
          <div style={{
            position: 'absolute', bottom: '-100px', left: '-50px',
            width: '200px', height: '200px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
            pointerEvents: 'none'
          }} />

          <div style={{
            maxWidth: '900px',
            margin: '0 auto',
            textAlign: 'center',
            position: 'relative',
            zIndex: 1
          }}>

            {/* ===== AVATAR WITH CLICK MENU ===== */}
            <div
              ref={menuRef}
              style={{
                position: 'relative',
                width: '130px',
                height: '130px',
                margin: '0 auto 20px'
              }}
            >
              {/* Clickable Avatar Circle */}
              <div
                onClick={() => setShowAvatarMenu(!showAvatarMenu)}
                style={{
                  width: '130px',
                  height: '130px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.2)',
                  border: '4px solid rgba(255,255,255,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: '54px',
                  fontWeight: '800',
                  backdropFilter: 'blur(10px)',
                  overflow: 'hidden',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.03)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {user?.avatar ? (
                  <img
                    src={
                      user.avatar.startsWith('http')
                        ? user.avatar
                        : `http://localhost:5000${user.avatar}`
                    }
                    alt={user.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  user?.name?.charAt(0).toUpperCase()
                )}

                {/* Hover Overlay */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '50%',
                  background: 'rgba(0,0,0,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0,
                  transition: 'opacity 0.2s',
                  fontSize: '28px'
                }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}
                >
                  📷
                </div>
              </div>

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                style={{ display: 'none' }}
              />

              {/* Dropdown Menu */}
              {showAvatarMenu && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 10px)',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'var(--white)',
                  borderRadius: '14px',
                  boxShadow: '0 10px 30px rgba(15, 23, 42, 0.2)',
                  border: '1px solid var(--border)',
                  padding: '8px',
                  minWidth: '200px',
                  zIndex: 100
                }}>
                  {/* Upload Option */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingAvatar}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: 'var(--dark)',
                      background: 'transparent',
                      border: 'none',
                      cursor: uploadingAvatar ? 'wait' : 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--light-gray)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <span style={{ fontSize: '16px' }}>📷</span>
                    <span>{uploadingAvatar ? 'Uploading...' : 'Update Photo'}</span>
                  </button>

                  {/* Remove Option (only if avatar exists) */}
                  {user?.avatar && (
                    <>
                      <div style={{
                        height: '1px',
                        background: 'var(--border)',
                        margin: '4px 0'
                      }} />
                      <button
                        onClick={handleAvatarRemove}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '10px 14px',
                          borderRadius: '10px',
                          fontSize: '13px',
                          fontWeight: '600',
                          color: '#EF4444',
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all 0.15s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <span style={{ fontSize: '16px' }}>🗑️</span>
                        <span>Remove Photo</span>
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
            {/* ===== END AVATAR ===== */}

            <h1 style={{
              fontSize: '32px',
              color: '#fff',
              fontWeight: '800',
              marginBottom: '6px',
              letterSpacing: '-0.5px'
            }}>
              {user?.name}
            </h1>

            <p style={{
              color: 'rgba(255,255,255,0.9)',
              fontSize: '14px',
              marginBottom: '10px'
            }}>
              {user?.email}
            </p>

            {user?.university && (
              <p style={{
                color: 'rgba(255,255,255,0.85)',
                fontSize: '13px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(255,255,255,0.15)',
                padding: '6px 14px',
                borderRadius: '20px',
                backdropFilter: 'blur(10px)'
              }}>
                🎓 {user.university}
              </p>
            )}
          </div>
        </div>

        {/* STATS CARDS */}
        <div style={{
          maxWidth: '1200px',
          margin: '-50px auto 0',
          padding: '0 20px',
          position: 'relative',
          zIndex: 2
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px'
          }}>
            {[
              { icon: '🎓', label: 'Skills I Teach', value: skillsOffered, color: '#3B82F6' },
              { icon: '📖', label: 'Want to Learn', value: skillsWanted, color: '#A855F7' },
              { icon: '⭐', label: 'Points', value: points, color: '#F59E0B' }
            ].map((stat, i) => (
              <div key={i} style={{
                background: 'var(--white)',
                borderRadius: '16px',
                padding: '20px',
                border: '1px solid var(--border)',
                boxShadow: '0 8px 20px rgba(15, 23, 42, 0.06)',
                display: 'flex',
                alignItems: 'center',
                gap: '14px'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: `${stat.color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '22px',
                  flexShrink: 0
                }}>
                  {stat.icon}
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{
                    fontSize: '11px',
                    color: 'var(--gray)',
                    fontWeight: '600',
                    marginBottom: '3px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    {stat.label}
                  </p>
                  <p style={{
                    fontSize: '24px',
                    color: 'var(--dark)',
                    fontWeight: '800',
                    lineHeight: 1
                  }}>
                    {stat.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PROFILE FORM */}
        <div style={{
          maxWidth: '1200px',
          margin: '35px auto 0',
          padding: '0 20px'
        }}>
          <div style={{
            background: 'var(--white)',
            borderRadius: '20px',
            padding: '35px',
            border: '1px solid var(--border)',
            boxShadow: '0 4px 14px rgba(15, 23, 42, 0.06)'
          }}>

            {/* Section Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '28px',
              paddingBottom: '18px',
              borderBottom: '1px solid var(--border)'
            }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px'
              }}>
                ✏️
              </div>
              <div>
                <h2 style={{
                  fontSize: '20px',
                  color: 'var(--dark)',
                  fontWeight: '800',
                  marginBottom: '2px',
                  letterSpacing: '-0.3px'
                }}>
                  Edit Profile
                </h2>
                <p style={{
                  fontSize: '13px',
                  color: 'var(--gray)'
                }}>
                  Update your personal information
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Full Name */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: 'var(--dark)',
                  fontSize: '13px',
                  fontWeight: '700'
                }}>
                  Full Name
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: 'var(--light-gray)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  padding: '13px 16px'
                }}>
                  <span style={{ fontSize: '16px', color: 'var(--gray)' }}>👤</span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Your full name"
                    style={{
                      flex: 1,
                      border: 'none',
                      background: 'transparent',
                      fontSize: '14px',
                      color: 'var(--dark)',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Email (disabled) */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: 'var(--dark)',
                  fontSize: '13px',
                  fontWeight: '700'
                }}>
                  Email Address
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: 'var(--light-gray)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  padding: '13px 16px',
                  opacity: 0.7,
                  cursor: 'not-allowed'
                }}>
                  <span style={{ fontSize: '16px', color: 'var(--gray)' }}>✉️</span>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    style={{
                      flex: 1,
                      border: 'none',
                      background: 'transparent',
                      fontSize: '14px',
                      color: 'var(--gray)',
                      outline: 'none',
                      cursor: 'not-allowed'
                    }}
                  />
                  <span style={{
                    fontSize: '10px',
                    color: 'var(--gray)',
                    fontWeight: '700',
                    background: 'var(--border)',
                    padding: '3px 8px',
                    borderRadius: '6px'
                  }}>
                    LOCKED
                  </span>
                </div>
              </div>

              {/* University */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: 'var(--dark)',
                  fontSize: '13px',
                  fontWeight: '700'
                }}>
                  University
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: 'var(--light-gray)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  padding: '13px 16px'
                }}>
                  <span style={{ fontSize: '16px', color: 'var(--gray)' }}>🎓</span>
                  <input
                    type="text"
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    placeholder="e.g., University of Ruhuna"
                    style={{
                      flex: 1,
                      border: 'none',
                      background: 'transparent',
                      fontSize: '14px',
                      color: 'var(--dark)',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Info Box */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(168,85,247,0.08) 100%)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                borderRadius: '12px',
                padding: '16px 18px',
                marginBottom: '24px',
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-start'
              }}>
                <span style={{ fontSize: '18px', flexShrink: 0 }}>💡</span>
                <div>
                  <p style={{
                    fontSize: '13px',
                    color: 'var(--dark)',
                    fontWeight: '600',
                    marginBottom: '4px'
                  }}>
                    Manage your skills in Dashboard
                  </p>
                  <p style={{
                    fontSize: '12px',
                    color: 'var(--gray)',
                    lineHeight: '1.5'
                  }}>
                    Add or remove skills you can teach and want to learn from your{' '}
                    <Link to="/dashboard" style={{
                      color: '#3B82F6',
                      fontWeight: '700',
                      textDecoration: 'none'
                    }}>
                      Dashboard → My Skills
                    </Link>
                    {' '}section.
                  </p>
                </div>
              </div>

              {/* Save Button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '15px',
                  background: loading ? 'var(--gray)' : 'linear-gradient(135deg, #3B82F6 0%, #6366F1 50%, #A855F7 100%)',
                  color: '#fff',
                  borderRadius: '12px',
                  fontSize: '15px',
                  fontWeight: '700',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: loading ? 'none' : '0 8px 20px rgba(99, 102, 241, 0.3)',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                {loading ? 'Saving...' : '💾 Save Changes'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;