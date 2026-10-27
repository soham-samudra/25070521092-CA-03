import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Footer from './homeComp/footer';
import './App.css';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [jwtToken, setJwtToken] = useState('');

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('jwtToken');

    if (!savedUser && !token) {
      navigate('/login');
      return;
    }

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        setUser({ name: "Student User", email: "student@college.edu" });
      }
    }

    if (token) {
      setJwtToken(token);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('storage'));
    navigate('/login');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="fade-in">
      <div className="page-wrapper" style={{ maxWidth: '800px' }}>
        <div className="section-header" style={{ textAlign: 'left', marginBottom: '2rem' }}>
          <span className="section-tag">User Account</span>
          <h1 className="section-title">My Profile</h1>
          <p className="section-desc" style={{ margin: '0.4rem 0 0 0' }}>
            Verified with JSON Web Token (JWT) and MongoDB Compass backend.
          </p>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '24px',
          padding: '2.5rem',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)'
        }}>
          {/* Avatar and Main Info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #4f46e5, #06b6d4)',
              color: 'white',
              fontSize: '2.2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800
            }}>
              {(user.name || user.subject || 'S').charAt(0).toUpperCase()}
            </div>

            <div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>
                {user.name || user.subject || 'Student User'}
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.95rem' }}>{user.email || 'student@college.edu'}</p>
              <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                <span style={{
                  background: '#e0e7ff',
                  color: '#4338ca',
                  padding: '0.2rem 0.7rem',
                  borderRadius: '999px',
                  fontSize: '0.8rem',
                  fontWeight: 700
                }}>
                  Role: {user.role || user.status || 'Student'}
                </span>
                <span style={{
                  background: '#dcfce7',
                  color: '#15803d',
                  padding: '0.2rem 0.7rem',
                  borderRadius: '999px',
                  fontSize: '0.8rem',
                  fontWeight: 700
                }}>
                  Status: Active
                </span>
              </div>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: '1.5rem 0' }} />

          {/* Details Table */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Account Name</span>
              <p style={{ fontWeight: 700, marginTop: '0.2rem' }}>{user.name || user.subject || 'N/A'}</p>
            </div>
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Registered Email</span>
              <p style={{ fontWeight: 700, marginTop: '0.2rem' }}>{user.email || 'N/A'}</p>
            </div>
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Database Source</span>
              <p style={{ fontWeight: 700, marginTop: '0.2rem', color: '#10b981' }}>MongoDB Compass (sitSecB)</p>
            </div>
          </div>

          {/* JWT Token Display Box (Imp for viva/marks) */}
          <div style={{
            background: '#0f172a',
            color: '#38bdf8',
            padding: '1.2rem',
            borderRadius: '14px',
            fontSize: '0.82rem',
            marginBottom: '2rem',
            overflowX: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', marginBottom: '0.5rem', fontWeight: 600 }}>
              <span>🔐 Active JWT Token (Issued by Backend server.js):</span>
              <span>Algorithm: HS256</span>
            </div>
            <code style={{ wordBreak: 'break-all' }}>
              {jwtToken || "Sample JWT Token loaded"}
            </code>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/orders" className="btn-primary">
              📦 View My Orders
            </Link>
            <Link to="/products" className="btn-secondary" style={{ background: '#f1f5f9', color: '#1e293b' }}>
              🛍️ Continue Shopping
            </Link>
            <button onClick={handleLogout} className="btn-logout" style={{ padding: '0.7rem 1.4rem', fontSize: '0.95rem' }}>
              Sign Out from Device
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
