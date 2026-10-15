import { useTheme } from '../context/ThemeContext';

const ResourceCard = ({ resource, currentUserId, onDownload, onDelete }) => {
  const { theme } = useTheme();
  const isOwner = resource.user?._id === currentUserId;

  // File icon based on mime type
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

  const getFileColor = (mimetype) => {
    if (mimetype?.includes('pdf')) return '#EF4444';
    if (mimetype?.includes('zip')) return '#F59E0B';
    if (mimetype?.startsWith('image/')) return '#A855F7';
    if (mimetype?.includes('word')) return '#3B82F6';
    if (mimetype?.includes('excel') || mimetype?.includes('sheet')) return '#10B981';
    if (mimetype?.includes('powerpoint')) return '#F97316';
    return '#6366F1';
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
  };

  const fileColor = getFileColor(resource.file.mimetype);
  const fileIcon = getFileIcon(resource.file.mimetype);

  return (
    <div
      className="card-hover"
      style={{
        background: 'var(--white)',
        borderRadius: '16px',
        padding: '20px',
        border: '1px solid var(--border)',
        boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        borderTop: `4px solid ${fileColor}`
      }}
    >
      {/* File Icon + Type Badge */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '14px'
      }}>
        <div style={{
          width: '54px',
          height: '54px',
          borderRadius: '14px',
          background: `${fileColor}15`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '26px',
          flexShrink: 0
        }}>
          {fileIcon}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
          <span style={{
            padding: '4px 10px',
            background: `${fileColor}15`,
            color: fileColor,
            borderRadius: '12px',
            fontSize: '10px',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            {resource.type}
          </span>
          <span style={{
            fontSize: '11px',
            color: 'var(--gray)',
            fontWeight: '600'
          }}>
            {formatSize(resource.file.size)}
          </span>
        </div>
      </div>

      {/* Title */}
      <h3 style={{
        fontSize: '16px',
        fontWeight: '800',
        color: 'var(--dark)',
        marginBottom: '8px',
        lineHeight: '1.3',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        minHeight: '42px'
      }}>
        {resource.title}
      </h3>

      {/* Description */}
      <p style={{
        fontSize: '13px',
        color: 'var(--gray)',
        lineHeight: '1.5',
        marginBottom: '12px',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden'
      }}>
        {resource.description}
      </p>

      {/* Skill Tags */}
      {resource.skillTags && resource.skillTags.length > 0 && (
        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '14px' }}>
          {resource.skillTags.slice(0, 3).map((tag, i) => (
            <span key={i} style={{
              background: 'var(--light-gray)',
              color: 'var(--gray)',
              padding: '3px 9px',
              borderRadius: '10px',
              fontSize: '10px',
              fontWeight: '600'
            }}>
              #{tag}
            </span>
          ))}
          {resource.skillTags.length > 3 && (
            <span style={{
              background: 'var(--light-gray)',
              color: 'var(--gray)',
              padding: '3px 9px',
              borderRadius: '10px',
              fontSize: '10px',
              fontWeight: '600'
            }}>
              +{resource.skillTags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Uploader Info */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '12px 0',
        borderTop: '1px solid var(--border)',
        marginTop: 'auto'
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #3B82F6 0%, #A855F7 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontWeight: '700',
          fontSize: '13px',
          flexShrink: 0,
          overflow: 'hidden'
        }}>
          {resource.user?.avatar ? (
            <img
              src={
                resource.user.avatar.startsWith('http')
                  ? resource.user.avatar
                  : `http://localhost:5000${resource.user.avatar}`
              }
              alt={resource.user.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => {
                e.target.style.visibility = 'hidden';
                e.target.parentElement.textContent = resource.user.name?.charAt(0).toUpperCase() || '?';
              }}
            />
          ) : (
            resource.user?.name?.charAt(0).toUpperCase() || '?'
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontSize: '12px',
            color: 'var(--dark)',
            fontWeight: '700',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {resource.user?.name || 'Unknown'}
          </p>
          <p style={{ fontSize: '10px', color: 'var(--gray)' }}>
            {resource.user?.university || formatDate(resource.createdAt)}
          </p>
        </div>
      </div>

      {/* Download Count + Actions */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '10px',
        paddingTop: '12px',
        borderTop: '1px solid var(--border)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '12px',
          color: 'var(--gray)',
          fontWeight: '700'
        }}>
          <span>⬇️</span>
          <span>{resource.downloads}</span>
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          {isOwner && (
            <button
              onClick={onDelete}
              style={{
                padding: '7px 12px',
                background: 'rgba(239, 68, 68, 0.1)',
                color: '#EF4444',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '700',
                border: 'none',
                cursor: 'pointer'
              }}
              title="Delete"
            >
              🗑️
            </button>
          )}
          <button
            onClick={onDownload}
            style={{
              padding: '7px 16px',
              background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
              color: '#fff',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: '700',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            ⬇️ Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;