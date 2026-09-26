import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const { user } = useAuth();

  // Fetch all skills on component load
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await API.get('/skills');
        setSkills(response.data);
      } catch (err) {
        console.error('Error fetching skills:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  // Filter skills based on search and category filter
  const filteredSkills = skills.filter((skill) => {
    const matchesSearch =
      skill.title.toLowerCase().includes(search.toLowerCase()) ||
      skill.description.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'All' || skill.category === filter;
    return matchesSearch && matchesFilter;
  });

  const categories = ['All', 'Programming', 'Design', 'Languages', 'Music', 'Academic', 'Other'];

  return (
    <div className="container" style={{ padding: '40px 20px' }}>

      {/* Hero Section */}
      <div style={{ textAlign: 'center', marginBottom: '60px', padding: '50px 30px', background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', borderRadius: '20px', color: '#fff', boxShadow: '0 10px 30px rgba(99, 102, 241, 0.25)' }}>
        <h1 style={{ fontSize: '46px', fontWeight: '800', marginBottom: '15px', letterSpacing: '-1px' }}>
          Welcome to <span style={{ color: '#fde68a' }}>SkillConnect</span>
        </h1>
        <p style={{ fontSize: '18px', marginBottom: '30px', opacity: 0.95, maxWidth: '600px', margin: '0 auto 30px', lineHeight: '1.6' }}>
          Exchange skills with fellow students. Teach what you know, learn what you don't.
        </p>
        {!user && (
          <Link to="/register">
            <button style={{ padding: '14px 36px', background: '#fff', color: '#4f46e5', borderRadius: '10px', fontSize: '16px', fontWeight: '700', boxShadow: '0 4px 14px rgba(0,0,0,0.15)' }}>
              Get Started →
            </button>
          </Link>
        )}
        {user && (
          <Link to="/dashboard">
            <button style={{ padding: '14px 36px', background: '#fff', color: '#4f46e5', borderRadius: '10px', fontSize: '16px', fontWeight: '700', boxShadow: '0 4px 14px rgba(0,0,0,0.15)' }}>
              Go to Dashboard →
            </button>
          </Link>
        )}
      </div>

      {/* Section Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '10px' }}>
        <h2 style={{ fontSize: '26px', color: '#1f2937', fontWeight: '700' }}>
          Browse Skills
          <span style={{ marginLeft: '12px', fontSize: '15px', color: '#6b7280', fontWeight: '500', background: '#f3f4f6', padding: '4px 12px', borderRadius: '20px' }}>
            {filteredSkills.length} {filteredSkills.length === 1 ? 'skill' : 'skills'}
          </span>
        </h2>
      </div>

      {/* Search and Filter */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="🔍  Search skills by title or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: '1', minWidth: '250px', padding: '14px 20px', border: '1px solid #e5e7eb', borderRadius: '10px', fontSize: '15px', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ padding: '14px 20px', border: '1px solid #e5e7eb', borderRadius: '10px', fontSize: '15px', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', minWidth: '180px', cursor: 'pointer' }}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat === 'All' ? '📂  All Categories' : cat}</option>
          ))}
        </select>
      </div>

      {/* Skills Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div className="spinner"></div>
          <p style={{ color: '#6b7280', marginTop: '15px' }}>Loading skills...</p>
        </div>
      ) : filteredSkills.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', background: '#fff', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: '56px', marginBottom: '15px' }}>🔍</div>
          <p style={{ color: '#1f2937', fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
            No skills found
          </p>
          <p style={{ color: '#6b7280', fontSize: '15px' }}>
            {search || filter !== 'All'
              ? 'Try adjusting your search or filter.'
              : user
              ? 'Be the first to post a skill!'
              : 'Login to add your first skill!'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {filteredSkills.map((skill) => (
            <div
              key={skill._id}
              className="card-hover"
              style={{
                background: '#fff',
                padding: '25px',
                borderRadius: '16px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                borderTop: `4px solid ${skill.type === 'Offer' ? '#10b981' : '#f59e0b'}`,
                transition: 'all 0.25s ease',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <span style={{ padding: '5px 14px', background: '#eef2ff', color: '#4f46e5', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                  {skill.category}
                </span>
                <span style={{ padding: '5px 14px', background: skill.type === 'Offer' ? '#d1fae5' : '#fef3c7', color: skill.type === 'Offer' ? '#065f46' : '#92400e', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                  {skill.type === 'Offer' ? '🎓 Offer' : '📖 Request'}
                </span>
              </div>

              <h3 style={{ fontSize: '18px', color: '#1f2937', marginBottom: '10px', fontWeight: '700', lineHeight: '1.3' }}>
                {skill.title}
              </h3>

              <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '20px', lineHeight: '1.6', flex: 1 }}>
                {skill.description}
              </p>

              <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '600', fontSize: '12px' }}>
                    {skill.user?.name?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <span style={{ fontSize: '13px', color: '#4b5563', fontWeight: '500' }}>
                    {skill.user?.name || 'Unknown'}
                  </span>
                </div>
                <span style={{ fontSize: '12px', color: '#9ca3af' }}>
                  {new Date(skill.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;