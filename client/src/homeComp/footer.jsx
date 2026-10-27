import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="footer-content">
        <div className="footer-col">
          <div className="brand-logo" style={{ color: "white", marginBottom: "1rem" }}>
            <div className="logo-icon">🚀</div>
            <span style={{ color: "white" }}>NexStore</span>
          </div>
          <p style={{ fontSize: "0.9rem", lineHeight: "1.6", color: "#94a3b8" }}>
            A high-performance modern MERN Stack web application built for college Continuous Assessment CA-03.
            Featuring Node.js, Express, React, and MongoDB Compass.
          </p>
        </div>

        <div className="footer-col">
          <h4>Navigation</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">All Products</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/contact">Contact Support</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Account</h4>
          <ul>
            <li><Link to="/login">Sign In</Link></li>
            <li><Link to="/signup">Register Account</Link></li>
            <li><Link to="/cart">Shopping Cart</Link></li>
            <li><Link to="/profile">User Profile</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Tech Stack</h4>
          <ul>
            <li>🟢 Node.js & Express</li>
            <li>⚛️ React + Vite</li>
            <li>🍃 MongoDB Compass</li>
            <li>🔐 bCrypt & JWT</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} NexStore — Developed by Soham Samudra (B.Tech CSE, SIT Nagpur).</p>
        <p>Continuous Assessment (CA-03) Submission</p>
      </div>
    </footer>
  );
};

export default Footer;
