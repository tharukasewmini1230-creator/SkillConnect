import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import API from '../services/api';
import Toast from '../components/Toast';
import DashboardLayout from '../components/DashboardLayout';

const Settings = () => {
  const { user, updateProfile, refreshUser, setPassword } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');
  const [toast, setToast] = useState(null);

  // Profile form state
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    university: user?.university || ''
  });
  const [profileLoading, setProfileLoading] = useState(false);

  // Password change form state (for users who already have a password)
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Set password form state (for Google users without password)
  const [googlePasswordData, setGooglePasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [googlePasswordLoading, setGooglePasswordLoading] = useState(false);

  // Check if user is a Google user
  const isGoogleUser = user?.authProvider === 'google';

  // Notification preferences (localStorage only)
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('notificationPrefs');
    return saved ? JSON.parse(saved) : {
      emailSessionRequests: true,
      emailReviews: true,
      emailNewMatches: false,
      pushAll: true
    };
  });

  // Handle profile update
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);

    try {
      await updateProfile(profileData);
      await refreshUser();
      setToast({ message: 'Profile updated successfully!', type: 'success' });
    } catch (err) {
      setToast({
        message: err.response?.data?.message || 'Failed to update profile',
        type: 'error'
      });
    } finally {
      setProfileLoading(false);
    }
  };

  // Handle password change (for local users)
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setToast({ message: 'New passwords do not match', type: 'error' });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setToast({ message: 'Password must be at least 6 characters', type: 'error' });
      return;
    }

    setPasswordLoading(true);

    try {
      await API.put('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      setToast({ message: 'Password changed successfully!', type: 'success' });
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      setToast({
        message: err.response?.data?.message || 'Failed to change password',
        type: 'error'
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  // Handle set password (for Google users)
  const handleSetPasswordSubmit = async (e) => {
    e.preventDefault();

    if (googlePasswordData.newPassword !== googlePasswordData.confirmPassword) {
      setToast({ message: 'Passwords do not match', type: 'error' });
      return;
    }

    if (googlePasswordData.newPassword.length < 6) {
      setToast({ message: 'Password must be at least 6 characters', type: 'error' });
      return;
    }

    setGooglePasswordLoading(true);

    try {
      const response = await setPassword(
        googlePasswordData.newPassword,
        googlePasswordData.confirmPassword
      );

      setToast({
        message: response.message || 'Password set successfully! You can now login with email & password.',
        type: 'success'
      });

      setGooglePasswordData({ newPassword: '', confirmPassword: '' });

      // Refresh user
      await refreshUser();
    } catch (err) {
      setToast({
        message: err.response?.data?.message || 'Failed to set password',
        type: 'error'
      });
    } finally {
      setGooglePasswordLoading(false);
    }
  };

  // Handle notification toggle
  const handleNotificationToggle = (key) => {
    const updated = { ...notifications, [key]: !notifications[key] };
    setNotifications(updated);
    localStorage.setItem('notificationPrefs', JSON.stringify(updated));
    setToast({ message: 'Preferences saved!', type: 'success' });
  };

  // Tabs
  const tabs = [
    { key: 'profile', label: 'Profile', icon: '👤' },
    { key: 'password', label: 'Password', icon: '🔒' },
    { key: 'notifications', label: 'Notifications', icon: '🔔' },
    { key: 'appearance', label: 'Appearance', icon: '🎨' }
  ];

  return (
    <DashboardLayout>
      <div style={{ padding: '30px 35px', maxWidth: '100%' }}>

        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}

        {/* HEADER */}
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{
            fontSize: '32px',
            color: 'var(--dark)',
            fontWeight: '800',
            marginBottom: '5px',
            letterSpacing: '-0.5px'
          }}>
            ⚙️ Settings
          </h1>
          <p style={{ color: 'var(--gray)', fontSize: '15px' }}>
            Manage your account preferences
          </p>
        </div>

        {/* TABS */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '30px',
          background: 'var(--white)',
          padding: '8px',
          borderRadius: '14px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          width: '100%',
          justifyContent: 'center', 
          flexWrap: 'wrap',
          border: '1px solid var(--border)'
        }}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: '10px 18px',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '600',
                background: activeTab === tab.key
                  ? 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)'
                  : 'transparent',
                color: activeTab === tab.key ? '#fff' : 'var(--gray)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.25s ease',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <div style={{
            background: 'var(--white)',
            borderRadius: '16px',
            padding: '30px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            border: '1px solid var(--border)'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--dark)', marginBottom: '8px' }}>
              Profile Information
            </h2>
            <p style={{ color: 'var(--gray)', fontSize: '14px', marginBottom: '25px' }}>
              Update your personal information
            </p>

            <form onSubmit={handleProfileSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--dark)', fontSize: '14px', fontWeight: '600' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  required
                  style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--border)', borderRadius: '10px', fontSize: '15px', background: 'var(--light-gray)', color: 'var(--dark)' }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--dark)', fontSize: '14px', fontWeight: '600' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--border)', borderRadius: '10px', fontSize: '15px', background: 'var(--light-gray)', color: 'var(--gray)', cursor: 'not-allowed' }}
                />
                <p style={{ fontSize: '12px', color: 'var(--gray)', marginTop: '6px' }}>
                  Email cannot be changed
                </p>
              </div>

              <div style={{ marginBottom: '25px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--dark)', fontSize: '14px', fontWeight: '600' }}>
                  University
                </label>
                <input
                  type="text"
                  value={profileData.university}
                  onChange={(e) => setProfileData({ ...profileData, university: e.target.value })}
                  placeholder="e.g., University of Ruhuna"
                  style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--border)', borderRadius: '10px', fontSize: '15px', background: 'var(--light-gray)', color: 'var(--dark)' }}
                />
              </div>

              <button
                type="submit"
                disabled={profileLoading}
                style={{
                  padding: '12px 30px',
                  background: profileLoading ? 'var(--gray)' : 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
                  color: '#fff',
                  borderRadius: '10px',
                  fontSize: '15px',
                  fontWeight: '700',
                  border: 'none',
                  cursor: profileLoading ? 'not-allowed' : 'pointer',
                  boxShadow: profileLoading ? 'none' : '0 4px 12px rgba(59, 130, 246, 0.25)'
                }}
              >
                {profileLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        )}

        {/* PASSWORD TAB */}
        {activeTab === 'password' && (
          <>
            {isGoogleUser ? (
              /* Google user — Set Password form */
              <div style={{
                background: 'var(--white)',
                borderRadius: '16px',
                padding: '30px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                border: '1px solid var(--border)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px'
                  }}>
                    🔐
                  </div>
                  <div>
                    <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--dark)', marginBottom: '2px' }}>
                      Set a Password
                    </h2>
                    <p style={{ color: 'var(--gray)', fontSize: '13px' }}>
                      You signed up with Google
                    </p>
                  </div>
                </div>

                <p style={{ color: 'var(--gray)', fontSize: '14px', marginBottom: '20px', marginTop: '12px' }}>
                  Set a password to login with email + password too.
                </p>

                <div style={{
                  background: 'var(--primary-light)',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  marginBottom: '22px',
                  fontSize: '13px',
                  color: '#1E40AF',
                  display: 'flex',
                  gap: '8px',
                  alignItems: 'flex-start',
                  lineHeight: '1.5'
                }}>
                  <span>💡</span>
                  <span>
                    Currently you can only login with <strong>Google</strong>. Setting a password lets you login with <strong>email + password</strong> too.
                  </span>
                </div>

                <form onSubmit={handleSetPasswordSubmit}>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--dark)', fontSize: '14px', fontWeight: '600' }}>
                      New Password
                    </label>
                    <input
                      type="password"
                      value={googlePasswordData.newPassword}
                      onChange={(e) => setGooglePasswordData({ ...googlePasswordData, newPassword: e.target.value })}
                      required
                      placeholder="At least 6 characters"
                      style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--border)', borderRadius: '10px', fontSize: '15px', background: 'var(--light-gray)', color: 'var(--dark)' }}
                    />
                  </div>

                  <div style={{ marginBottom: '25px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--dark)', fontSize: '14px', fontWeight: '600' }}>
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      value={googlePasswordData.confirmPassword}
                      onChange={(e) => setGooglePasswordData({ ...googlePasswordData, confirmPassword: e.target.value })}
                      required
                      placeholder="Re-enter your password"
                      style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--border)', borderRadius: '10px', fontSize: '15px', background: 'var(--light-gray)', color: 'var(--dark)' }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={googlePasswordLoading}
                    style={{
                      padding: '12px 30px',
                      background: googlePasswordLoading ? 'var(--gray)' : 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
                      color: '#fff',
                      borderRadius: '10px',
                      fontSize: '15px',
                      fontWeight: '700',
                      border: 'none',
                      cursor: googlePasswordLoading ? 'not-allowed' : 'pointer',
                      boxShadow: googlePasswordLoading ? 'none' : '0 4px 12px rgba(59, 130, 246, 0.25)'
                    }}
                  >
                    {googlePasswordLoading ? 'Setting password...' : '🔐 Set Password'}
                  </button>
                </form>
              </div>
            ) : (
              /* Local user — Change Password form */
              <div style={{
                background: 'var(--white)',
                borderRadius: '16px',
                padding: '30px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                border: '1px solid var(--border)'
              }}>
                <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--dark)', marginBottom: '8px' }}>
                  Change Password
                </h2>
                <p style={{ color: 'var(--gray)', fontSize: '14px', marginBottom: '25px' }}>
                  Update your password to keep your account secure
                </p>

                <form onSubmit={handlePasswordSubmit}>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--dark)', fontSize: '14px', fontWeight: '600' }}>
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      required
                      placeholder="Enter current password"
                      style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--border)', borderRadius: '10px', fontSize: '15px', background: 'var(--light-gray)', color: 'var(--dark)' }}
                    />
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--dark)', fontSize: '14px', fontWeight: '600' }}>
                      New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      required
                      placeholder="At least 6 characters"
                      style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--border)', borderRadius: '10px', fontSize: '15px', background: 'var(--light-gray)', color: 'var(--dark)' }}
                    />
                  </div>

                  <div style={{ marginBottom: '25px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--dark)', fontSize: '14px', fontWeight: '600' }}>
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      required
                      placeholder="Re-enter new password"
                      style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--border)', borderRadius: '10px', fontSize: '15px', background: 'var(--light-gray)', color: 'var(--dark)' }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={passwordLoading}
                    style={{
                      padding: '12px 30px',
                      background: passwordLoading ? 'var(--gray)' : 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                      color: '#fff',
                      borderRadius: '10px',
                      fontSize: '15px',
                      fontWeight: '700',
                      border: 'none',
                      cursor: passwordLoading ? 'not-allowed' : 'pointer',
                      boxShadow: passwordLoading ? 'none' : '0 4px 12px rgba(245, 158, 11, 0.25)'
                    }}
                  >
                    {passwordLoading ? 'Changing...' : '🔒 Change Password'}
                  </button>
                </form>
              </div>
            )}
          </>
        )}

        {/* NOTIFICATIONS TAB */}
        {activeTab === 'notifications' && (
          <div style={{
            background: 'var(--white)',
            borderRadius: '16px',
            padding: '30px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            border: '1px solid var(--border)'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--dark)', marginBottom: '8px' }}>
              Notification Preferences
            </h2>
            <p style={{ color: 'var(--gray)', fontSize: '14px', marginBottom: '25px' }}>
              Choose what notifications you want to receive
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { key: 'emailSessionRequests', icon: '📅', title: 'Session Requests', desc: 'Get notified when someone requests a session with you' },
                { key: 'emailReviews', icon: '⭐', title: 'New Reviews', desc: 'Get notified when you receive a review' },
                { key: 'emailNewMatches', icon: '🎯', title: 'New Matches', desc: 'Get notified when a new skill match is found' },
                { key: 'pushAll', icon: '🔔', title: 'Push Notifications', desc: 'Enable all push notifications' }
              ].map((pref) => (
                <div
                  key={pref.key}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '16px',
                    background: 'var(--light-gray)',
                    borderRadius: '12px'
                  }}
                >
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: 'var(--white)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    flexShrink: 0
                  }}>
                    {pref.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '14px', fontWeight: '700', color: 'var(--dark)', marginBottom: '3px' }}>
                      {pref.title}
                    </p>
                    <p style={{ fontSize: '12px', color: 'var(--gray)' }}>
                      {pref.desc}
                    </p>
                  </div>
                  <button
                    onClick={() => handleNotificationToggle(pref.key)}
                    style={{
                      width: '48px',
                      height: '26px',
                      borderRadius: '13px',
                      background: notifications[pref.key] ? 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)' : 'var(--border)',
                      border: 'none',
                      cursor: 'pointer',
                      position: 'relative',
                      transition: 'all 0.3s ease',
                      flexShrink: 0
                    }}
                  >
                    <span style={{
                      position: 'absolute',
                      top: '3px',
                      left: notifications[pref.key] ? '25px' : '3px',
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: '#fff',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.15)'
                    }} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* APPEARANCE TAB */}
        {activeTab === 'appearance' && (
          <div style={{
            background: 'var(--white)',
            borderRadius: '16px',
            padding: '30px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            border: '1px solid var(--border)'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--dark)', marginBottom: '8px' }}>
              Appearance
            </h2>
            <p style={{ color: 'var(--gray)', fontSize: '14px', marginBottom: '25px' }}>
              Customize how SkillSwap looks
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              {/* Light Mode */}
              <button
                onClick={() => theme === 'dark' && toggleTheme()}
                style={{
                  padding: '20px',
                  background: '#FFFFFF',
                  border: theme === 'light' ? '3px solid #3B82F6' : '2px solid var(--border)',
                  borderRadius: '14px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{
                  width: '100%',
                  height: '80px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #EFF6FF 0%, #F8FAFC 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '32px',
                  marginBottom: '12px'
                }}>
                  ☀️
                </div>
                <p style={{ fontSize: '15px', fontWeight: '700', color: '#0F172A', marginBottom: '4px' }}>
                  Light Mode
                </p>
                <p style={{ fontSize: '12px', color: '#64748B' }}>
                  Bright and clean
                </p>
                {theme === 'light' && (
                  <p style={{ fontSize: '12px', color: '#3B82F6', fontWeight: '700', marginTop: '8px' }}>
                    ✓ Active
                  </p>
                )}
              </button>

              {/* Dark Mode */}
              <button
                onClick={() => theme === 'light' && toggleTheme()}
                style={{
                  padding: '20px',
                  background: '#1F2937',
                  border: theme === 'dark' ? '3px solid #3B82F6' : '2px solid var(--border)',
                  borderRadius: '14px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{
                  width: '100%',
                  height: '80px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #0F172A 0%, #1F2937 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '32px',
                  marginBottom: '12px'
                }}>
                  🌙
                </div>
                <p style={{ fontSize: '15px', fontWeight: '700', color: '#F9FAFB', marginBottom: '4px' }}>
                  Dark Mode
                </p>
                <p style={{ fontSize: '12px', color: '#9CA3AF' }}>
                  Easy on the eyes
                </p>
                {theme === 'dark' && (
                  <p style={{ fontSize: '12px', color: '#60A5FA', fontWeight: '700', marginTop: '8px' }}>
                    ✓ Active
                  </p>
                )}
              </button>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default Settings;