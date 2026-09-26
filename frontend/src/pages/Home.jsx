import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [activeTab, setActiveTab] = useState('All'); // 'All' | 'Offer' | 'Request'

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

  // Count of offers and requests
  const offerCount = skills.filter((s) => s.type === 'Offer').length;
  const requestCount = skills.filter((s) => s.type === 'Request').length;

  // Filter skills based on tab, search and category filter
  const filteredSkills = skills.filter((skill) => {
    const matchesTab = activeTab === 'All' || skill.type === activeTab;
    const matchesSearch =
      skill.title.toLowerCase().includes(search.toLowerCase()) ||
      skill.description.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'All' || skill.category === filter;
    return matchesTab && matchesSearch && matchesFilter;
  });

  const categories = ['All', 'Programming', 'Design', 'Languages', 'Music', 'Academic', 'Other'];

  // Tabs configuration
  const tabs = [
    { key: 'All', label: 'All Skills', icon: '🌐', count: skills.length },
    { key: 'Offer', label: 'Offers', icon: '🎓', count: offerCount },
    { key: 'Request', label: 'Requests', icon: '📖', count: requestCount }
  ];

  return (
    <div className="container" style={{ padding: '40px 20px' }}>

      {/* Hero Section */}
      <div style={{ textAlign: 'center', marginBottom: '50px', padding: '50px 30px', background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', borderRadius: '20px', color: '#fff', boxShadow: '0 10px 30px rgba(99, 102, 241, 0.25)' }}>
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

      {/* Tabs Section - Offer / Request / All */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', background: '#fff', padding: '8px', borderRadius: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', width: 'fit-content', flexWrap: 'wrap' }}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '12px 24px',
              borderRadius: '10px',
              fontSize: '15px',
              fontWeight: '600',
              background: activeTab === tab.key
                ? tab.key === 'Offer'
                  ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                  : tab.key === 'Request'
                  ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                  : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
                : 'transparent',
              color: activeTab === tab.key ? '#fff' : '#4b5563',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.25s ease',
              boxShadow: activeTab === tab.key ? '0 4px 12px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
            <span style={{
              background: activeTab === tab.key ? 'rgba(255,255,255,0.25)' : '#f3f4f6',
              color: activeTab === tab.key ? '#fff' : '#6b7280',
              padding: '2px 9px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: '700'
            }}>
              {tab.count}
            </span>
          </button>
        ))}
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

      {/* Section Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <h2 style={{ fontSize: '24px', color: '#1f2937', fontWeight: '700' }}>
          {activeTab === 'All' && '🌐 All Skills'}
          {activeTab === 'Offer' && '🎓 Skills Being Offered'}
          {activeTab === 'Request' && '📖 Skills Being Requested'}
          <span style={{ marginLeft: '12px', fontSize: '14px', color: '#6b7280', fontWeight: '500', background: '#f3f4f6', padding: '4px 12px', borderRadius: '20px' }}>
            {filteredSkills.length} {filteredSkills.length === 1 ? 'result' : 'results'}
          </span>
        </h2>
      </div>

      {/* Skills Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div className="spinner"></div>
          <p style={{ color: '#6b7280', marginTop: '15px' }}>Loading skills...</p>
        </div>
      ) : filteredSkills.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', background: '#fff', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: '56px', marginBottom: '15px' }}>
            {activeTab === 'Offer' ? '🎓' : activeTab === 'Request' ? '📖' : '🔍'}
          </div>
          <p style={{ color: '#1f2937', fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
            {activeTab === 'Offer'
              ? 'No skills are being offered yet'
              : activeTab === 'Request'
              ? 'No skills are being requested yet'
              : 'No skills found'}
          </p>
          <p style={{ color: '#6b7280', fontSize: '15px' }}>
            {search || filter !== 'All'
              ? 'Try adjusting your search or filter.'
              : user
              ? 'Be the first to post one!'
              : 'Login to add a skill!'}
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
                <span style={{
                  padding: '5px 14px',
                  background: skill.type === 'Offer' ? '#d1fae5' : '#fef3c7',
                  color: skill.type === 'Offer' ? '#065f46' : '#92400e',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
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