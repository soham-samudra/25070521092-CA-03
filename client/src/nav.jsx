import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';

const Nav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sync user state and cart counter from localStorage
  const syncNavState = () => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        setUser(null);
      }
    } else {
      setUser(null);
    }

    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const items = JSON.parse(savedCart);
        const count = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
        setCartCount(count);
      } catch (e) {
        setCartCount(0);
      }
    } else {
      setCartCount(0);
    }
  };

  useEffect(() => {
    syncNavState();
    window.addEventListener('storage', syncNavState);
    return () => window.removeEventListener('storage', syncNavState);
  }, [location.pathname]);

  // Close mobile menu on page transition
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('user');
    setUser(null);
    window.dispatchEvent(new Event('storage'));
    navigate('/login');
  };

  return (
    <nav className="my-nav">
      <div className="nav-container">
        {/* Brand Logo */}
        <Link to="/" className="brand-logo" aria-label="NexStore Home">
          <div className="logo-icon">🚀</div>
          <span>Nex<b>Store</b></span>
        </Link>

        {/* Desktop Navigation Links (Professor's d-flex structure) */}
        <ul className="d-flex desktop-nav-links" style={{ listStyle: "none" }}>
          <li>
            <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
          </li>
          <li>
            <Link to="/products" className={location.pathname === '/products' ? 'active' : ''}>Products</Link>
          </li>
          <li>
            <Link to="/orders" className={location.pathname === '/orders' ? 'active' : ''}>Orders</Link>
          </li>
          <li>
            <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>About</Link>
          </li>
          <li>
            <Link to="/services" className={location.pathname === '/services' ? 'active' : ''}>Services</Link>
          </li>
          <li>
            <Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>Contact!</Link>
          </li>
        </ul>

        {/* Right Actions: Cart & Auth Buttons */}
        <div className="nav-right-actions">
          <Link to="/cart" className="cart-btn" title="View Shopping Cart">
            🛒 <span className="cart-text">Cart</span> <span className="cart-badge">{cartCount}</span>
          </Link>

          {user ? (
            <div className="user-controls">
              <Link to="/profile" className="user-badge" title="Go to User Profile">
                👤 <span className="user-name-text">{user.name || user.subject || 'Profile'}</span>
              </Link>
              <button onClick={handleLogout} className="btn-logout" title="Sign Out">
                Logout
              </button>
            </div>
          ) : (
            <div className="guest-controls">
              <Link to="/login" className="btn-login-nav">
                Login
              </Link>
              <Link to="/signup" className="btn-signup-nav">
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            className="mobile-menu-btn"
            aria-label="Toggle Navigation Menu"
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer fade-in">
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            <li>
              <Link to="/" className={location.pathname === '/' ? 'active' : ''}>🏠 Home</Link>
            </li>
            <li>
              <Link to="/products" className={location.pathname === '/products' ? 'active' : ''}>🛍️ Products Catalog</Link>
            </li>
            <li>
              <Link to="/orders" className={location.pathname === '/orders' ? 'active' : ''}>📦 My Orders</Link>
            </li>
            <li>
              <Link to="/cart" className={location.pathname === '/cart' ? 'active' : ''}>🛒 Cart ({cartCount})</Link>
            </li>
            <li>
              <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>ℹ️ About Project</Link>
            </li>
            <li>
              <Link to="/services" className={location.pathname === '/services' ? 'active' : ''}>⚡ Services</Link>
            </li>
            <li>
              <Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>✉️ Contact!</Link>
            </li>
            {user ? (
              <>
                <li style={{ borderTop: '1px solid #e2e8f0', marginTop: '0.5rem', paddingTop: '0.5rem' }}>
                  <Link to="/profile">👤 Account Profile ({user.name || 'User'})</Link>
                </li>
                <li>
                  <button onClick={handleLogout} className="btn-logout" style={{ width: '100%', textAlign: 'center', marginTop: '0.5rem' }}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li style={{ borderTop: '1px solid #e2e8f0', marginTop: '0.5rem', paddingTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                <Link to="/login" className="btn-primary" style={{ flex: 1, textAlign: 'center', padding: '0.6rem' }}>
                  Login
                </Link>
                <Link to="/signup" className="btn-secondary" style={{ flex: 1, textAlign: 'center', padding: '0.6rem', color: '#1e293b' }}>
                  Sign Up
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Nav;
