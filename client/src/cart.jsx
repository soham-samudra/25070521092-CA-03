import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from './homeComp/footer';
import './App.css';

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('cart');
    if (saved) {
      try {
        setCartItems(JSON.parse(saved));
      } catch (e) {
        setCartItems([]);
      }
    }
  }, []);

  const updateQuantity = (id, delta) => {
    const updated = cartItems.map((item) => {
      if (item._id === id) {
        const maxStock = item.stock !== undefined ? item.stock : 99;
        const newQty = (item.quantity || 1) + delta;
        if (newQty > maxStock) {
          alert(`Maximum available stock for "${item.name}" is ${maxStock}.`);
          return item;
        }
        return { ...item, quantity: Math.max(1, newQty) };
      }
      return item;
    });
    setCartItems(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
  };

  const removeItem = (id) => {
    const updated = cartItems.filter((item) => item._id !== id);
    setCartItems(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
  };

  const clearCart = () => {
    if (window.confirm("Are you sure you want to clear all items from your cart?")) {
      setCartItems([]);
      localStorage.removeItem('cart');
      window.dispatchEvent(new Event('storage'));
    }
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (coupon.trim().toUpperCase() === 'STUDENT50') {
      setDiscount(0.1); // 10% discount
      alert("🎉 Coupon Applied! 10% Student Discount activated.");
    } else {
      alert("Invalid coupon code. Try 'STUDENT50'");
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
  const discountAmount = Math.round(subtotal * discount);
  const delivery = subtotal > 1000 || subtotal === 0 ? 0 : 99;
  const grandTotal = subtotal - discountAmount + delivery;

  return (
    <div className="fade-in">
      <div className="page-wrapper">
        <div className="section-header" style={{ textAlign: 'left', marginBottom: '2rem' }}>
          <span className="section-tag">Checkout Flow</span>
          <h1 className="section-title">Your Shopping Cart</h1>
          <p className="section-desc" style={{ margin: '0.4rem 0 0 0' }}>
            Review items, modify quantities, and proceed to secure checkout.
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div style={{ textAlign: 'center', background: 'white', padding: '4rem 2rem', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛒</div>
            <h2>Your Cart is Currently Empty</h2>
            <p style={{ color: '#64748b', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
              Explore our wide variety of electronics and add them to your cart!
            </p>
            <Link to="/products" className="btn-primary">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="cart-layout">
            {/* Items List */}
            <div className="cart-items-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                <h3 style={{ margin: 0, color: '#0f172a' }}>
                  Cart Items ({cartItems.reduce((acc, i) => acc + (i.quantity || 1), 0)})
                </h3>
                <button
                  type="button"
                  onClick={clearCart}
                  style={{
                    background: '#fee2e2',
                    color: '#b91c1c',
                    padding: '0.35rem 0.8rem',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 600
                  }}
                >
                  Clear Cart
                </button>
              </div>

              {cartItems.map((item) => (
                <div key={item._id} className="cart-item-row">
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200'}
                    alt={item.name}
                    className="cart-item-img"
                  />
                  <div className="cart-item-details">
                    <h4>{item.name}</h4>
                    <p style={{ color: '#4f46e5', fontWeight: 600 }}>{item.category}</p>
                    <div style={{ fontWeight: 700, fontSize: '1.1rem', marginTop: '0.2rem' }}>
                      ₹{Number(item.price).toLocaleString('en-IN')}
                    </div>

                    <div className="qty-counter">
                      <button className="qty-btn" onClick={() => updateQuantity(item._id, -1)}>-</button>
                      <span style={{ fontWeight: 700, padding: '0 0.4rem' }}>{item.quantity || 1}</span>
                      <button className="qty-btn" onClick={() => updateQuantity(item._id, 1)}>+</button>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 800, fontSize: '1.15rem', color: '#0f172a' }}>
                      ₹{(item.price * (item.quantity || 1)).toLocaleString('en-IN')}
                    </div>
                    <button
                      onClick={() => removeItem(item._id)}
                      style={{
                        background: 'none',
                        color: '#ef4444',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        marginTop: '0.8rem'
                      }}
                    >
                      🗑️ Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary & Checkout */}
            <div className="cart-summary-card">
              <h3 style={{ marginBottom: '1.2rem', color: '#0f172a' }}>Order Summary</h3>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem', color: '#64748b' }}>
                <span>Subtotal:</span>
                <span style={{ fontWeight: 700, color: '#1e293b' }}>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              {discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem', color: '#10b981' }}>
                  <span>Discount (10%):</span>
                  <span style={{ fontWeight: 700 }}>-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem', color: '#64748b' }}>
                <span>Delivery:</span>
                <span style={{ fontWeight: 700, color: delivery === 0 ? '#10b981' : '#1e293b' }}>
                  {delivery === 0 ? 'FREE' : `₹${delivery}`}
                </span>
              </div>

              <div style={{ borderTop: '2px dashed #e2e8f0', margin: '1rem 0' }}></div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                <span>Total Amount:</span>
                <span>₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>

              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <input
                  type="text"
                  placeholder="Coupon (e.g. STUDENT50)"
                  className="form-control"
                  style={{ padding: '0.5rem 0.8rem', fontSize: '0.85rem' }}
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                />
                <button type="submit" style={{ background: '#1e293b', color: 'white', padding: '0.5rem 0.9rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600 }}>
                  Apply
                </button>
              </form>

              <button
                onClick={() => navigate('/checkout')}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '0.9rem' }}
              >
                Proceed to Checkout &rarr;
              </button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Cart;
