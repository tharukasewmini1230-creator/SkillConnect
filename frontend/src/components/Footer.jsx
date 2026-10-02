import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ background: '#1f2937', color: '#d1d5db', marginTop: '60px', padding: '50px 20px 20px' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '40px', marginBottom: '40px' }}>

          {/* Brand Column */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'linear-gradient(135deg, #3B82F6 0%, #A855F7 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '700', fontSize: '18px' }}>
                S
              </div>
              <span style={{ fontSize: '20px', fontWeight: '700', color: '#fff' }}>
                Skill<span style={{ color: '#A855F7' }}>Swap</span>
              </span>
            </div>
            <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#9ca3af' }}>
              A student skill exchange platform. Teach what you know, learn what you don't.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '15px', fontWeight: '700', marginBottom: '18px' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li><Link to="/" style={{ fontSize: '14px', color: '#9ca3af', transition: 'color 0.2s' }}>Home</Link></li>
              <li><Link to="/login" style={{ fontSize: '14px', color: '#9ca3af', transition: 'color 0.2s' }}>Login</Link></li>
              <li><Link to="/register" style={{ fontSize: '14px', color: '#9ca3af', transition: 'color 0.2s' }}>Register</Link></li>
              <li><Link to="/dashboard" style={{ fontSize: '14px', color: '#9ca3af', transition: 'color 0.2s' }}>Dashboard</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '15px', fontWeight: '700', marginBottom: '18px' }}>Categories</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li style={{ fontSize: '14px', color: '#9ca3af' }}>💻 Programming</li>
              <li style={{ fontSize: '14px', color: '#9ca3af' }}>🎨 Design</li>
              <li style={{ fontSize: '14px', color: '#9ca3af' }}>🌍 Languages</li>
              <li style={{ fontSize: '14px', color: '#9ca3af' }}>🎵 Music</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '15px', fontWeight: '700', marginBottom: '18px' }}>Contact</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li style={{ fontSize: '14px', color: '#9ca3af' }}>📧 info@skillswap.lk</li>
              <li style={{ fontSize: '14px', color: '#9ca3af' }}>📍 Sri Lanka</li>
              <li style={{ fontSize: '14px', color: '#9ca3af' }}>🎓 EC4307 Project</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{ borderTop: '1px solid #374151', paddingTop: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
          <p style={{ fontSize: '13px', color: '#6b7280' }}>
            © {currentYear} SkillSwap. All rights reserved.
          </p>
          <p style={{ fontSize: '13px', color: '#6b7280' }}>
            Built with ❤️ for EC4307 - Web Application Development
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;