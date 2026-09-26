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
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h1 style={{ fontSize: '42px', color: '#1f2937', marginBottom: '15px' }}>
          Welcome to <span style={{ color: '#4f46e5' }}>SkillConnect</span>
        </h1>
        <p style={{ fontSize: '18px', color: '#6b7280', marginBottom: '25px' }}>
          Exchange skills with fellow students. Teach what you know, learn what you don't.
        </p>
        {!user && (
          <Link to="/register">
            <button style={{ padding: '14px 30px', background: '#4f46e5', color: '#fff', borderRadius: '8px', fontSize: '16px', fontWeight: '600' }}>
              Get Started
            </button>
          </Link>
        )}
      </div>

      {/* Search and Filter */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search skills..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: '1', minWidth: '250px', padding: '12px 18px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '15px' }}
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ padding: '12px 18px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '15px', background: '#fff' }}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Skills Grid */}
      {loading ? (
        <p style={{ textAlign: 'center', color: '#888' }}>Loading skills...</p>
      ) : filteredSkills.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fff', borderRadius: '10px' }}>
          <p style={{ color: '#888', fontSize: '16px' }}>No skills found. {user ? 'Be the first to post one!' : 'Login to add a skill!'}</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {filteredSkills.map((skill) => (
            <div key={skill._id} style={{ background: '#fff', padding: '25px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderTop: `4px solid ${skill.type === 'Offer' ? '#10b981' : '#f59e0b'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ padding: '4px 12px', background: '#eef2ff', color: '#4f46e5', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                  {skill.category}
                </span>
                <span style={{ padding: '4px 12px', background: skill.type === 'Offer' ? '#d1fae5' : '#fef3c7', color: skill.type === 'Offer' ? '#065f46' : '#92400e', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                  {skill.type}
                </span>
              </div>
              <h3 style={{ fontSize: '18px', color: '#1f2937', marginBottom: '10px' }}>{skill.title}</h3>
              <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '15px', lineHeight: '1.5' }}>{skill.description}</p>
              <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: '#4b5563', fontWeight: '500' }}>By {skill.user?.name || 'Unknown'}</span>
                <span style={{ fontSize: '12px', color: '#9ca3af' }}>{new Date(skill.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;