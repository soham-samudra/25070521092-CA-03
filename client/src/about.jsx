import Footer from './homeComp/footer';
import { Link } from 'react-router-dom';
import './App.css';

const About = () => {
  const stats = [
    { label: "Products Catalog", value: "20" },
    { label: "Product Categories", value: "5" },
    { label: "MongoDB Collections", value: "4" },
    { label: "CA-03 Marks Target", value: "100%" }
  ];

  return (
    <div className="fade-in">
      <div className="page-wrapper">
        <div className="section-header">
          <span className="section-tag">About NexStore</span>
          <h1 className="section-title">Academic Project CA-03</h1>
          <p className="section-desc">
            A full-stack e-commerce web application engineered with Node.js, Express, React, and MongoDB.
          </p>
        </div>

        {/* Academic Project Information Card */}
        <div style={{
          background: 'linear-gradient(135deg, #1e1b4b, #312e81)',
          color: 'white',
          borderRadius: '24px',
          padding: '2.5rem',
          margin: '2rem 0 3.5rem 0',
          boxShadow: '0 20px 25px -5px rgba(49, 46, 129, 0.25)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.2rem' }}>
            <span style={{ fontSize: '1.8rem' }}>🎓</span>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: 'white' }}>
                Academic Project Information
              </h2>
              <span style={{ fontSize: '0.85rem', color: '#c7d2fe' }}>
                Continuous Assessment (CA-03) Submission
              </span>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.2rem',
            background: 'rgba(255, 255, 255, 0.08)',
            padding: '1.5rem',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.12)'
          }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: '#a5b4fc', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Project Title</span>
              <p style={{ fontWeight: 700, fontSize: '1.1rem', marginTop: '0.2rem', color: 'white' }}>NexStore E-Commerce</p>
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', color: '#a5b4fc', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Student Author</span>
              <p style={{ fontWeight: 700, fontSize: '1.1rem', marginTop: '0.2rem', color: '#38bdf8' }}>Soham Samudra</p>
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', color: '#a5b4fc', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Institution</span>
              <p style={{ fontWeight: 700, fontSize: '1.05rem', marginTop: '0.2rem', color: 'white' }}>Symbiosis Institute of Technology, Nagpur</p>
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', color: '#a5b4fc', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Programme & Class</span>
              <p style={{ fontWeight: 700, fontSize: '1.05rem', marginTop: '0.2rem', color: 'white' }}>B.Tech CSE — Semester III, Section B</p>
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', color: '#a5b4fc', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Assessment Unit</span>
              <p style={{ fontWeight: 700, fontSize: '1.05rem', marginTop: '0.2rem', color: 'white' }}>Continuous Assessment (CA-03)</p>
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', color: '#a5b4fc', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Technology Stack</span>
              <p style={{ fontWeight: 700, fontSize: '1.05rem', marginTop: '0.2rem', color: '#86efac' }}>React, Vite, Node.js, Express, MongoDB</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          margin: '0 0 4rem 0'
        }}>
          {stats.map((s, idx) => (
            <div key={idx} style={{
              background: 'white',
              padding: '2rem 1.5rem',
              borderRadius: '16px',
              textAlign: 'center',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)'
            }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#4f46e5' }}>{s.value}</div>
              <div style={{ color: '#64748b', fontWeight: 600, marginTop: '0.4rem', fontSize: '0.9rem' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Story Section */}
        <div style={{
          background: 'white',
          borderRadius: '24px',
          padding: '3rem',
          border: '1px solid #e2e8f0',
          marginBottom: '4rem'
        }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>
            Project Overview & Engineering Purpose
          </h2>
          <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: '1.8', marginBottom: '1.5rem' }}>
            This application is engineered for Continuous Assessment <b>CA-03</b> to illustrate real-world
            full-stack MERN development competencies. The application features a component-driven client in
            React 18, a RESTful API in Node.js and Express, and MongoDB Compass as the underlying database.
          </p>
          <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: '1.8' }}>
            Security is implemented via <b>bCrypt</b> password hashing with 10 salt rounds and <b>JSON Web Tokens (JWT)</b> for session authorization.
            The product catalog is stored and managed dynamically in MongoDB with complete Create, Read, Update, and Delete (CRUD) operations.
          </p>
        </div>

        {/* Architecture Stack */}
        <div className="section-header">
          <span className="section-tag">Technology Blueprint</span>
          <h2 className="section-title">Core Architecture Layers</h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '4rem'
        }}>
          <div className="perk-card">
            <div className="perk-icon">⚛️</div>
            <div className="perk-info">
              <h4>Frontend Client</h4>
              <p>React 18, Vite, React Router DOM, dynamic components, and responsive CSS with focus states.</p>
            </div>
          </div>

          <div className="perk-card">
            <div className="perk-icon">🟢</div>
            <div className="perk-info">
              <h4>Backend Server</h4>
              <p>Node.js runtime, Express framework, CORS, and Body-Parser processing on port 5000.</p>
            </div>
          </div>

          <div className="perk-card">
            <div className="perk-icon">🍃</div>
            <div className="perk-info">
              <h4>Database Layer</h4>
              <p>MongoDB Compass with native driver, targeting database <code>sitSecB</code> and 4 collections.</p>
            </div>
          </div>

          <div className="perk-card">
            <div className="perk-icon">🔐</div>
            <div className="perk-info">
              <h4>Auth & Security</h4>
              <p>bCrypt password salting (10 rounds) and stateless JSON Web Token (JWT) verification.</p>
            </div>
          </div>
        </div>

        {/* Project Attribution */}
        <div style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '20px',
          padding: '2.5rem',
          textAlign: 'center',
          marginBottom: '2rem'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.8rem' }}>👨‍💻</div>
          <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>
            Developed by Soham Samudra
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.95rem', marginTop: '0.4rem' }}>
            B.Tech Computer Science and Engineering | Symbiosis Institute of Technology, Nagpur
          </p>
          <div style={{ marginTop: '1.5rem' }}>
            <Link to="/products" className="btn-primary">
              Explore Products Catalog &rarr;
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;
