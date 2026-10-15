import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { useTheme } from '../context/ThemeContext';
import Toast from '../components/Toast';
import DashboardLayout from '../components/DashboardLayout';

const UploadResource = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Programming',
    type: 'Notes',
    skillTags: ''
  });

  const headingColor = theme === 'dark' ? '#F8FAFC' : '#0F172A';

  const categories = ['Programming', 'Design', 'Languages', 'Music', 'Academic', 'Other'];
  const types = ['Notes', 'Cheat Sheet', 'Book', 'Tutorial', 'Reference', 'Other'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate size — 20 MB
    if (file.size > 20 * 1024 * 1024) {
      setToast({ message: 'File too large. Max 20 MB.', type: 'error' });
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setSelectedFile(file);
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const getFileIcon = (mimetype) => {
    if (mimetype?.includes('pdf')) return '📄';
    if (mimetype?.includes('zip') || mimetype?.includes('compressed')) return '🗜️';
    if (mimetype?.startsWith('image/')) return '🖼️';
    if (mimetype?.includes('word')) return '📝';
    if (mimetype?.includes('excel') || mimetype?.includes('sheet')) return '📊';
    if (mimetype?.includes('powerpoint') || mimetype?.includes('presentation')) return '📽️';
    if (mimetype === 'text/plain') return '📃';
    return '📎';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      setToast({ message: 'Please select a file to upload', type: 'error' });
      return;
    }

    if (!formData.title.trim() || !formData.description.trim()) {
      setToast({ message: 'Please fill in all required fields', type: 'error' });
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append('file', selectedFile);
      data.append('title', formData.title.trim());
      data.append('description', formData.description.trim());
      data.append('category', formData.category);
      data.append('type', formData.type);
      data.append('skillTags', formData.skillTags);

      await API.post('/resources', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setToast({ message: 'Resource uploaded successfully! 🎉', type: 'success' });

      setTimeout(() => {
        navigate('/study-hub');
      }, 1200);
    } catch (err) {
      console.error('Upload error:', err);
      setToast({
        message: err.response?.data?.message || 'Upload failed. Please try again.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div style={{ padding: '30px 35px', maxWidth: '900px', margin: '0 auto', paddingBottom: '60px' }}>
        {toast && (
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        )}

        {/* BACK LINK */}
        <Link to="/study-hub" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          color: '#3B82F6',
          fontSize: '14px',
          fontWeight: '600',
          textDecoration: 'none',
          marginBottom: '20px'
        }}>
          ← Back to Study Hub
        </Link>

        {/* HEADER */}
        <div style={{ marginBottom: '25px' }}>
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
            📤 Upload Resource
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--gray)' }}>
            Share your notes, guides, or study materials with the community
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit}>
          <div style={{
            background: 'var(--white)',
            borderRadius: '20px',
            padding: '30px',
            border: '1px solid var(--border)',
            boxShadow: '0 4px 14px rgba(15, 23, 42, 0.06)',
            marginBottom: '20px'
          }}>

            {/* FILE UPLOAD AREA */}
            <div style={{ marginBottom: '25px' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '700',
                color: 'var(--dark)',
                marginBottom: '10px'
              }}>
                📎 File <span style={{ color: '#EF4444' }}>*</span>
              </label>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip,.txt,image/*"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />

              {selectedFile ? (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '16px 20px',
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(168, 85, 247, 0.08) 100%)',
                  border: '1px solid rgba(99, 102, 241, 0.25)',
                  borderRadius: '12px'
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: 'var(--white)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    flexShrink: 0
                  }}>
                    {getFileIcon(selectedFile.type)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      color: 'var(--dark)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {selectedFile.name}
                    </p>
                    <p style={{ fontSize: '12px', color: 'var(--gray)', fontWeight: '600' }}>
                      {formatSize(selectedFile.size)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'rgba(239, 68, 68, 0.1)',
                      color: '#EF4444',
                      border: 'none',
                      fontSize: '14px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    width: '100%',
                    padding: '40px 20px',
                    background: 'var(--light-gray)',
                    border: '2px dashed var(--border)',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '10px',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#3B82F6';
                    e.currentTarget.style.background = 'rgba(59, 130, 246, 0.04)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.background = 'var(--light-gray)';
                  }}
                >
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '26px'
                  }}>
                    📤
                  </div>
                  <p style={{ fontSize: '15px', fontWeight: '700', color: 'var(--dark)' }}>
                    Click to select a file
                  </p>
                  <p style={{ fontSize: '12px', color: 'var(--gray)' }}>
                    PDF, DOC, PPT, XLS, ZIP, Images • Max 20 MB
                  </p>
                </button>
              )}
            </div>

            {/* TITLE */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '700',
                color: 'var(--dark)',
                marginBottom: '8px'
              }}>
                📝 Title <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                maxLength={150}
                placeholder="e.g., Python Basics Complete Guide"
                style={{
                  width: '100%',
                  padding: '13px 16px',
                  border: '1px solid var(--border)',
                  borderRadius: '10px',
                  fontSize: '14px',
                  background: 'var(--light-gray)',
                  color: 'var(--dark)',
                  outline: 'none'
                }}
              />
            </div>

            {/* DESCRIPTION */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '700',
                color: 'var(--dark)',
                marginBottom: '8px'
              }}>
                📄 Description <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                maxLength={1000}
                placeholder="Describe what this resource contains..."
                style={{
                  width: '100%',
                  padding: '13px 16px',
                  border: '1px solid var(--border)',
                  borderRadius: '10px',
                  fontSize: '14px',
                  background: 'var(--light-gray)',
                  color: 'var(--dark)',
                  outline: 'none',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  lineHeight: '1.6'
                }}
              />
              <p style={{ fontSize: '11px', color: 'var(--gray)', marginTop: '6px', textAlign: 'right' }}>
                {formData.description.length}/1000
              </p>
            </div>

            {/* CATEGORY + TYPE */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              marginBottom: '20px'
            }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '700',
                  color: 'var(--dark)',
                  marginBottom: '8px'
                }}>
                  📂 Category <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '13px 16px',
                    border: '1px solid var(--border)',
                    borderRadius: '10px',
                    fontSize: '14px',
                    background: 'var(--light-gray)',
                    color: 'var(--dark)',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '700',
                  color: 'var(--dark)',
                  marginBottom: '8px'
                }}>
                  📝 Type <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '13px 16px',
                    border: '1px solid var(--border)',
                    borderRadius: '10px',
                    fontSize: '14px',
                    background: 'var(--light-gray)',
                    color: 'var(--dark)',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {types.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* SKILL TAGS */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '700',
                color: 'var(--dark)',
                marginBottom: '8px'
              }}>
                🏷️ Skill Tags <span style={{ fontSize: '11px', color: 'var(--gray)', fontWeight: '500' }}>(separate with commas)</span>
              </label>
              <input
                type="text"
                name="skillTags"
                value={formData.skillTags}
                onChange={handleChange}
                placeholder="e.g., python, basics, oop, algorithms"
                style={{
                  width: '100%',
                  padding: '13px 16px',
                  border: '1px solid var(--border)',
                  borderRadius: '10px',
                  fontSize: '14px',
                  background: 'var(--light-gray)',
                  color: 'var(--dark)',
                  outline: 'none'
                }}
              />
              <p style={{ fontSize: '11px', color: 'var(--gray)', marginTop: '6px' }}>
                These help others find your resource when searching
              </p>
            </div>

          </div>

          {/* SUBMIT BUTTON */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                minWidth: '200px',
                padding: '15px',
                background: loading ? 'var(--gray)' : 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
                color: '#fff',
                borderRadius: '12px',
                fontSize: '15px',
                fontWeight: '700',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : '0 8px 20px rgba(99, 102, 241, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {loading ? '⏳ Uploading...' : '📤 Upload Resource'}
            </button>

            <Link to="/study-hub" style={{ textDecoration: 'none', flex: 1, minWidth: '140px' }}>
              <button
                type="button"
                style={{
                  width: '100%',
                  padding: '15px',
                  background: 'var(--light-gray)',
                  color: 'var(--gray)',
                  borderRadius: '12px',
                  fontSize: '15px',
                  fontWeight: '700',
                  border: '1px solid var(--border)',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </Link>
          </div>

        </form>
      </div>
    </DashboardLayout>
  );
};

export default UploadResource;