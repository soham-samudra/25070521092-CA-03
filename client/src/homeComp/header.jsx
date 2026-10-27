import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="hero-banner fade-in">
      <div className="hero-content">
        <span className="hero-badge">⚡ Continuous Assessment CA-03 Project</span>
        <h1 className="hero-title">
          Next-Gen Tech & Lifestyle <span>Products</span>
        </h1>
        <p className="hero-subtitle">
          Discover handpicked premium electronics, audio gear, and accessories.
          Powered by React, Node.js, Express, and MongoDB Compass.
        </p>
        <div className="hero-buttons">
          <Link to="/products" className="btn-primary">
            🛍️ Browse All Products
          </Link>
          <Link to="/signup" className="btn-secondary">
            ✨ Create Free Account
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
