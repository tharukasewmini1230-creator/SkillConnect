import { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';
import DashboardLayout from '../components/DashboardLayout';

const Dashboard = () => {
  const { user } = useAuth();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState('All');
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Programming',
    type: 'Offer'
  });

  useEffect(() => {
    fetchMySkills();
  }, []);

  const fetchMySkills = async () => {
    try {
      const response = await API.get('/skills');
      const mySkills = response.data.filter(
        (skill) => skill.user?._id === user?._id
      );
      setSkills(mySkills);
    } catch (err) {
      console.error('Error fetching skills:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await API.put(`/skills/${editingId}`, formData);
        setToast({ message: 'Skill updated successfully!', type: 'success' });
      } else {
        await API.post('/skills', formData);
        setToast({ message: 'Skill added successfully!', type: 'success' });
      }
      resetForm();
      fetchMySkills();
    } catch (err) {
      setToast({
        message: err.response?.data?.message || 'Something went wrong',
        type: 'error'
      });
    }
  };

  const handleEdit = (skill) => {
    setFormData({
      title: skill.title,
      description: skill.description,
      category: skill.category,
      type: skill.type
    });
    setEditingId(skill._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this skill?')) return;

    try {
      await API.delete(`/skills/${id}`);
      setToast({ message: 'Skill deleted successfully!', type: 'success' });
      fetchMySkills();
    } catch (err) {
      setToast({ message: 'Failed to delete skill', type: 'error' });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'Programming',
      type: 'Offer'
    });
    setEditingId(null);
    setShowForm(false);
  };

  const categories = ['Programming', 'Design', 'Languages', 'Music', 'Academic', 'Other'];

  const offerCount = skills.filter((s) => s.type === 'Offer').length;
  const requestCount = skills.filter((s) => s.type === 'Request').length;

  const filteredSkills = skills.filter(
    (s) => activeTab === 'All' || s.type === activeTab
  );

  const tabs = [
    { key: 'All', label: 'All', icon: '🌐', count: skills.length },
    { key: 'Offer', label: 'Offers', icon: '🎓', count: offerCount },
    { key: 'Request', label: 'Requests', icon: '📖', count: requestCount }
  ];

  return (
    <DashboardLayout>
      <div style={{ padding: '30px 35px' }}>

        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}

        {/* Header */}
        <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
          <div>
            <h1 style={{ fontSize: '32px', color: 'var(--dark)', fontWeight: '800', marginBottom: '5px' }}>
              Hi, {user?.name?.split(' ')[0]} 👋
            </h1>
            <p style={{ color: 'var(--gray)', fontSize: '15px' }}>Manage your skill posts from your dashboard</p>
          </div>
          <button
            onClick={() => { resetForm(); setShowForm(!showForm); }}
            style={{
              padding: '12px 24px',
              background: showForm ? 'var(--white)' : 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
              color: showForm ? 'var(--gray)' : '#fff',
              border: showForm ? '1px solid var(--border)' : 'none',
              borderRadius: '10px',
              fontSize: '15px',
              fontWeight: '600',
              boxShadow: showForm ? 'none' : '0 4px 12px rgba(59, 130, 246, 0.3)',
              cursor: 'pointer'
            }}
          >
            {showForm ? '✕ Cancel' : '+ Add New Skill'}
          </button>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '30px' }}>
          <div style={{ background: 'var(--white)', padding: '22px', borderRadius: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', borderLeft: '4px solid #3B82F6' }}>
            <p style={{ color: 'var(--gray)', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Total Skills</p>
            <p style={{ fontSize: '32px', fontWeight: '800', color: 'var(--dark)' }}>{skills.length}</p>
          </div>
          <div style={{ background: 'var(--white)', padding: '22px', borderRadius: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', borderLeft: '4px solid #10B981' }}>
            <p style={{ color: 'var(--gray)', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Offers</p>
            <p style={{ fontSize: '32px', fontWeight: '800', color: '#10B981' }}>{offerCount}</p>
          </div>
          <div style={{ background: 'var(--white)', padding: '22px', borderRadius: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', borderLeft: '4px solid #F59E0B' }}>
            <p style={{ color: 'var(--gray)', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Requests</p>
            <p style={{ fontSize: '32px', fontWeight: '800', color: '#F59E0B' }}>{requestCount}</p>
          </div>
        </div>

        {/* Add/Edit Skill Form */}
        {showForm && (
          <div style={{ background: 'var(--white)', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 14px rgba(0,0,0,0.08)', marginBottom: '30px', border: '1px solid var(--border)' }}>
            <h3 style={{ marginBottom: '25px', color: 'var(--dark)', fontSize: '20px', fontWeight: '700' }}>
              {editingId ? '✏️ Edit Skill' : '✨ Add New Skill'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--dark)', fontSize: '14px', fontWeight: '600' }}>Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Python Programming Help"
                  style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', background: 'var(--light-gray)', color: 'var(--dark)' }}
                />
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--dark)', fontSize: '14px', fontWeight: '600' }}>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="4"
                  placeholder="Describe what you can teach or what you want to learn..."
                  style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', resize: 'vertical', background: 'var(--light-gray)', color: 'var(--dark)' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', marginBottom: '25px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--dark)', fontSize: '14px', fontWeight: '600' }}>Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', background: 'var(--light-gray)', color: 'var(--dark)', cursor: 'pointer' }}
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--dark)', fontSize: '14px', fontWeight: '600' }}>Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', background: 'var(--light-gray)', color: 'var(--dark)', cursor: 'pointer' }}
                  >
                    <option value="Offer">🎓 Offer (I can teach)</option>
                    <option value="Request">📖 Request (I want to learn)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button
                  type="submit"
                  style={{ padding: '12px 30px', background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)', color: '#fff', borderRadius: '8px', fontSize: '15px', fontWeight: '600', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.25)', border: 'none', cursor: 'pointer' }}
                >
                  {editingId ? 'Update Skill' : 'Add Skill'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  style={{ padding: '12px 30px', background: 'var(--light-gray)', color: 'var(--gray)', borderRadius: '8px', fontSize: '15px', fontWeight: '600', border: 'none', cursor: 'pointer' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tabs */}
        {skills.length > 0 && (
          <div className="tabs-container" style={{ display: 'flex', gap: '10px', marginBottom: '25px', background: 'var(--white)', padding: '8px', borderRadius: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', width: 'fit-content', flexWrap: 'wrap', border: '1px solid var(--border)' }}>
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  padding: '10px 20px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '600',
                  background: activeTab === tab.key
                    ? tab.key === 'Offer'
                      ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                      : tab.key === 'Request'
                        ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)'
                        : 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)'
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
                <span style={{
                  background: activeTab === tab.key ? 'rgba(255,255,255,0.25)' : 'var(--light-gray)',
                  color: activeTab === tab.key ? '#fff' : 'var(--gray)',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  fontSize: '12px',
                  fontWeight: '700'
                }}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* My Skills List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div className="spinner"></div>
            <p style={{ color: 'var(--gray)', marginTop: '15px' }}>Loading your skills...</p>
          </div>
        ) : skills.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', background: 'var(--white)', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '64px', marginBottom: '15px' }}>📝</div>
            <p style={{ color: 'var(--dark)', fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>
              You haven't posted any skills yet
            </p>
            <p style={{ color: 'var(--gray)', fontSize: '15px', marginBottom: '25px' }}>
              Share your knowledge or ask for help from fellow students!
            </p>
            <button
              onClick={() => setShowForm(true)}
              style={{ padding: '14px 32px', background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)', color: '#fff', borderRadius: '10px', fontSize: '15px', fontWeight: '600', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)', border: 'none', cursor: 'pointer' }}
            >
              + Add Your First Skill
            </button>
          </div>
        ) : filteredSkills.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--white)', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid var(--border)' }}>
            <p style={{ color: 'var(--gray)', fontSize: '16px' }}>
              No {activeTab.toLowerCase()} skills to display.
            </p>
          </div>
        ) : (
          <div className="skills-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
            {filteredSkills.map((skill) => (
              <div
                key={skill._id}
                className="card-hover"
                style={{
                  background: 'var(--white)',
                  padding: '25px',
                  borderRadius: '16px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  border: '1px solid var(--border)',
                  borderTop: `4px solid ${skill.type === 'Offer' ? '#10B981' : '#F59E0B'}`,
                  transition: 'all 0.25s ease',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <span style={{ padding: '5px 14px', background: 'var(--primary-light)', color: '#3B82F6', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                    {skill.category}
                  </span>
                  <span style={{
                    padding: '5px 14px',
                    background: skill.type === 'Offer' ? '#D1FAE5' : '#FEF3C7',
                    color: skill.type === 'Offer' ? '#065F46' : '#92400E',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    {skill.type === 'Offer' ? '🎓 Offer' : '📖 Request'}
                  </span>
                </div>

                <h3 style={{ fontSize: '18px', color: 'var(--dark)', marginBottom: '10px', fontWeight: '700', lineHeight: '1.3' }}>
                  {skill.title}
                </h3>

                <p style={{ fontSize: '14px', color: 'var(--gray)', marginBottom: '20px', lineHeight: '1.6', flex: 1 }}>
                  {skill.description}
                </p>

                <div style={{ display: 'flex', gap: '10px', borderTop: '1px solid var(--border)', paddingTop: '15px' }}>
                  <button
                    onClick={() => handleEdit(skill)}
                    style={{ flex: 1, padding: '10px', background: 'var(--primary-light)', color: '#3B82F6', borderRadius: '8px', fontSize: '14px', fontWeight: '600', border: 'none', cursor: 'pointer' }}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(skill._id)}
                    style={{ flex: 1, padding: '10px', background: 'var(--danger-light)', color: '#DC2626', borderRadius: '8px', fontSize: '14px', fontWeight: '600', border: 'none', cursor: 'pointer' }}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default Dashboard;