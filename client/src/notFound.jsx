import { Link } from 'react-router-dom';
import Footer from './homeComp/footer';
import './App.css';

const NotFound = () => {
  return (
    <div className="fade-in">
      <div className="page-wrapper" style={{ textAlign: 'center', padding: '5rem 1rem' }}>
        <div style={{ fontSize: '5rem', fontWeight: 900, color: '#4f46e5', letterSpacing: '-2px' }}>
          404
        </div>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.8rem' }}>
          Page Not Found
        </h2>
        <p style={{ color: '#64748b', fontSize: '1.05rem', maxWidth: '500px', margin: '0 auto 2rem auto' }}>
          The page you are looking for does not exist or may have been moved.
        </p>
        <Link to="/" className="btn-primary">
          &larr; Return to Homepage
        </Link>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
