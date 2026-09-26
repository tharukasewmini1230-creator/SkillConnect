import { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Programming',
    type: 'Offer'
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch only the current user's skills
  useEffect(() => {
    fetchMySkills();
  }, []);

  const fetchMySkills = async () => {
    try {
      const response = await API.get('/skills');
      // Filter skills posted by the logged-in user
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
    setError('');
    setSuccess('');

    try {
      if (editingId) {
        // Update existing skill
        await API.put(`/skills/${editingId}`, formData);
        setSuccess('Skill updated successfully!');
      } else {
        // Create new skill
        await API.post('/skills', formData);
        setSuccess('Skill added successfully!');
      }
      resetForm();
      fetchMySkills();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
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
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this skill?')) return;

    try {
      await API.delete(`/skills/${id}`);
      setSuccess('Skill deleted successfully!');
      fetchMySkills();
    } catch (err) {
      setError('Failed to delete skill');
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

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h1 style={{ fontSize: '32px', color: '#1f2937' }}>My Dashboard</h1>
          <p style={{ color: '#6b7280', marginTop: '5px' }}>Manage your skill posts here</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(!showForm); }}
          style={{ padding: '12px 24px', background: '#4f46e5', color: '#fff', borderRadius: '8px', fontSize: '15px', fontWeight: '600' }}
        >
          {showForm ? 'Cancel' : '+ Add New Skill'}
        </button>
      </div>

      {success && (
        <div style={{ background: '#d1fae5', color: '#065f46', padding: '12px', borderRadius: '6px', marginBottom: '20px' }}>
          {success}
        </div>
      )}
      {error && (
        <div style={{ background: '#fee', color: '#c33', padding: '12px', borderRadius: '6px', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      {/* Add/Edit Skill Form */}
      {showForm && (
        <div style={{ background: '#fff', padding: '30px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '20px', color: '#1f2937' }}>
            {editingId ? 'Edit Skill' : 'Add New Skill'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '6px', color: '#555', fontSize: '14px', fontWeight: '500' }}>Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g., Python Programming Help"
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '6px', color: '#555', fontSize: '14px', fontWeight: '500' }}>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="4"
                placeholder="Describe what you can teach or what you want to learn..."
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', color: '#555', fontSize: '14px', fontWeight: '500' }}>Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', background: '#fff' }}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', color: '#555', fontSize: '14px', fontWeight: '500' }}>Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', background: '#fff' }}
                >
                  <option value="Offer">Offer (I can teach)</option>
                  <option value="Request">Request (I want to learn)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              style={{ padding: '12px 30px', background: '#4f46e5', color: '#fff', borderRadius: '6px', fontSize: '15px', fontWeight: '600' }}
            >
              {editingId ? 'Update Skill' : 'Add Skill'}
            </button>
          </form>
        </div>
      )}

      {/* My Skills List */}
      {loading ? (
        <p style={{ textAlign: 'center', color: '#888' }}>Loading...</p>
      ) : skills.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fff', borderRadius: '10px' }}>
          <p style={{ color: '#888', fontSize: '16px' }}>You haven't posted any skills yet.</p>
          <p style={{ color: '#9ca3af', fontSize: '14px', marginTop: '8px' }}>Click "+ Add New Skill" to get started!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {skills.map((skill) => (
            <div key={skill._id} style={{ background: '#fff', padding: '25px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderTop: `4px solid ${skill.type === 'Offer' ? '#10b981' : '#f59e0b'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ padding: '4px 12px', background: '#eef2ff', color: '#4f46e5', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                  {skill.category}
                </span>
                <span style={{ padding: '4px 12px', background: skill.type === 'Offer' ? '#d1fae5' : '#fef3c7', color: skill.type === 'Offer' ? '#065f46' : '#92400e', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                  {skill.type}
                </span>
              </div>
              <h3 style={{ fontSize: '18px', color: '#1f2937', marginBottom: '10px' }}>{skill.title}</h3>
              <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '15px', lineHeight: '1.5' }}>{skill.description}</p>
              <div style={{ display: 'flex', gap: '10px', borderTop: '1px solid #f3f4f6', paddingTop: '15px' }}>
                <button
                  onClick={() => handleEdit(skill)}
                  style={{ flex: 1, padding: '8px', background: '#eef2ff', color: '#4f46e5', borderRadius: '6px', fontSize: '14px', fontWeight: '500' }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(skill._id)}
                  style={{ flex: 1, padding: '8px', background: '#fee', color: '#c33', borderRadius: '6px', fontSize: '14px', fontWeight: '500' }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;