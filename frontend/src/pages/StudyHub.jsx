import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Toast from '../components/Toast';
import DashboardLayout from '../components/DashboardLayout';
import ResourceCard from '../components/ResourceCard';

const StudyHub = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [type, setType] = useState('All');

  const headingColor = theme === 'dark' ? '#F8FAFC' : '#0F172A';

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const response = await API.get('/resources');
      setResources(response.data);
    } catch (err) {
      console.error('Error fetching resources:', err);
      setToast({ message: 'Failed to load resources', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (resource) => {
    try {
      // Increment counter
      await API.get(`/resources/${resource._id}/download`);
      
      // Trigger download
      const link = document.createElement('a');
      link.href = `http://localhost:5000/api/resources/${resource._id}/download`;
      // For protected routes, we need the token
      // Actually — download route is public (no protect)
      // So direct link works
      window.open(`http://localhost:5000/api/resources/${resource._id}/download`, '_blank');
      
      setToast({ message: `Downloading ${resource.file.originalName}...`, type: 'success' });
      
      // Refresh to update count
      setTimeout(fetchResources, 1000);
    } catch (err) {
      console.error('Download error:', err);
      setToast({ message: 'Download failed', type: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resource?')) return;

    try {
      await API.delete(`/resources/${id}`);
      setToast({ message: 'Resource deleted', type: 'success' });
      fetchResources();
    } catch (err) {
      setToast({
        message: err.response?.data?.message || 'Failed to delete',
        type: 'error'
      });
    }
  };

  // Client-side filter
  const filteredResources = resources.filter((r) => {
    const matchesSearch = !search || 
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase()) ||
      r.skillTags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory = category === 'All' || r.category === category;
    const matchesType = type === 'All' || r.type === type;

    return matchesSearch && matchesCategory && matchesType;
  });

  const clearFilters = () => {
    setSearch('');
    setCategory('All');
    setType('All');
    setSearchParams({});
  };

  const categories = ['All', 'Programming', 'Design', 'Languages', 'Music', 'Academic', 'Other'];
  const types = ['All', 'Notes', 'Cheat Sheet', 'Book', 'Tutorial', 'Reference', 'Other'];
  const hasActiveFilters = search || category !== 'All' || type !== 'All';

  return (
    <DashboardLayout>
      <div style={{ padding: '30px 35px', paddingBottom: '60px' }}>
        {toast && (
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        )}

        {/* HEADER */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '25px',
          flexWrap: 'wrap',
          gap: '15px'
        }}>
          <div>
            <h1 style={{
              fontSize: '30px',
              fontWeight: '800',
              color: headingColor,
              marginBottom: '6px',
              letterSpacing: '-0.5px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              📚 Study Hub
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--gray)' }}>
              Free community-shared study materials — notes, guides, and PDFs
            </p>
          </div>

          <Link to="/study-hub/upload" style={{ textDecoration: 'none' }}>
            <button style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
            }}>
              <span style={{ fontSize: '16px' }}>📤</span>
              Upload Resource
            </button>
          </Link>
        </div>

        {/* SEARCH + FILTER BAR */}
        <div style={{
          background: 'var(--white)',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '25px',
          border: '1px solid var(--border)',
          boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)'
        }}>
          {/* Search Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'var(--light-gray)',
            borderRadius: '12px',
            padding: '12px 18px',
            marginBottom: '16px',
            border: '1px solid transparent'
          }}>
            <span style={{ fontSize: '16px', color: 'var(--gray)' }}>🔍</span>
            <input
              type="text"
              placeholder="Search by title, description, or skill..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                flex: 1,
                border: 'none',
                background: 'transparent',
                fontSize: '14px',
                color: 'var(--dark)',
                outline: 'none'
              }}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--gray)',
                  fontSize: '16px',
                  cursor: 'pointer',
                  padding: '4px 8px'
                }}
              >
                ✕
              </button>
            )}
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '160px' }}>
              <label style={{
                display: 'block',
                fontSize: '11px',
                fontWeight: '700',
                color: 'var(--gray)',
                marginBottom: '6px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                📂 Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: '1px solid var(--border)',
                  background: 'var(--light-gray)',
                  color: 'var(--dark)',
                  fontSize: '13px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div style={{ flex: 1, minWidth: '160px' }}>
              <label style={{
                display: 'block',
                fontSize: '11px',
                fontWeight: '700',
                color: 'var(--gray)',
                marginBottom: '6px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                📝 Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: '1px solid var(--border)',
                  background: 'var(--light-gray)',
                  color: 'var(--dark)',
                  fontSize: '13px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                {types.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {hasActiveFilters && (
              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <button
                  onClick={clearFilters}
                  style={{
                    padding: '10px 18px',
                    background: 'var(--light-gray)',
                    color: 'var(--dark)',
                    border: '1px solid var(--border)',
                    borderRadius: '10px',
                    fontSize: '13px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  ✕ Clear
                </button>
              </div>
            )}
          </div>
        </div>

        {/* RESULTS HEADER */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <p style={{ fontSize: '14px', color: 'var(--gray)', fontWeight: '600' }}>
            {filteredResources.length} {filteredResources.length === 1 ? 'resource' : 'resources'} found
          </p>
        </div>

        {/* RESOURCES GRID */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div className="spinner"></div>
            <p style={{ color: 'var(--gray)', marginTop: '15px' }}>Loading resources...</p>
          </div>
        ) : filteredResources.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '80px 20px',
            background: 'var(--white)',
            borderRadius: '16px',
            border: '1px solid var(--border)',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '15px' }}>
              {hasActiveFilters ? '🔍' : '📚'}
            </div>
            <p style={{ color: 'var(--dark)', fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>
              {hasActiveFilters ? 'No resources found' : 'No resources yet'}
            </p>
            <p style={{ color: 'var(--gray)', fontSize: '14px', marginBottom: '20px' }}>
              {hasActiveFilters
                ? 'Try a different search or clear the filters.'
                : 'Be the first to share a study resource!'}
            </p>
            {hasActiveFilters ? (
              <button
                onClick={clearFilters}
                style={{
                  padding: '12px 28px',
                  background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
                  color: '#fff',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '700',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Clear Filters
              </button>
            ) : (
              <Link to="/study-hub/upload" style={{ textDecoration: 'none' }}>
                <button style={{
                  padding: '12px 28px',
                  background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
                  color: '#fff',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '700',
                  border: 'none',
                  cursor: 'pointer'
                }}>
                  📤 Upload First Resource
                </button>
              </Link>
            )}
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '18px'
          }}>
            {filteredResources.map((resource) => (
              <ResourceCard
                key={resource._id}
                resource={resource}
                currentUserId={user?._id}
                onDownload={() => handleDownload(resource)}
                onDelete={() => handleDelete(resource._id)}
              />
            ))}
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default StudyHub;