import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from './homeComp/footer';
import './App.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    let emailParam = '';
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        setUser(u);
        if (u.email) {
          emailParam = `?email=${encodeURIComponent(u.email)}`;
        }
      } catch (e) {}
    }

    fetch(`http://localhost:5000/orders${emailParam}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch orders");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setOrders(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.warn("Orders fetch fallback:", err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="fade-in">
      <div className="page-wrapper">
        <div className="section-header" style={{ textAlign: 'left', marginBottom: '2rem' }}>
          <span className="section-tag">Order Management</span>
          <h1 className="section-title">My Orders History</h1>
          <p className="section-desc" style={{ margin: '0.4rem 0 0 0' }}>
            Live orders retrieved directly from MongoDB Compass collection <code>orders</code>.
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
            <h3>Loading orders from MongoDB...</h3>
          </div>
        ) : orders.length === 0 ? (
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '4rem 2rem',
            textAlign: 'center',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>📦</div>
            <h2>No Orders Found Yet</h2>
            <p style={{ color: '#64748b', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
              You haven't placed any orders in this session. Add products to your cart and complete checkout!
            </p>
            <Link to="/products" className="btn-primary">
              Browse Products Catalog &rarr;
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {orders.map((ord, idx) => (
              <div key={ord._id || idx} style={{
                background: 'white',
                borderRadius: '18px',
                border: '1px solid #e2e8f0',
                padding: '1.8rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  paddingBottom: '1rem',
                  borderBottom: '1px solid #f1f5f9'
                }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Order Tracking ID</span>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#4f46e5', margin: 0 }}>
                      {ord.orderId || `ORD-${idx + 1}`}
                    </h3>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Date Placed</span>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem' }}>
                      {ord.orderDate ? new Date(ord.orderDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recent'}
                    </p>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Payment Mode</span>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem' }}>
                      {ord.paymentMethod || 'Simulated Cash on Delivery'}
                    </p>
                  </div>
                  <div>
                    <span style={{
                      background: '#dcfce7',
                      color: '#15803d',
                      padding: '0.3rem 0.8rem',
                      borderRadius: '999px',
                      fontSize: '0.82rem',
                      fontWeight: 700
                    }}>
                      ✓ {ord.status || 'Confirmed'}
                    </span>
                  </div>
                </div>

                {/* Items in order */}
                <div style={{ padding: '1rem 0' }}>
                  <h4 style={{ fontSize: '0.95rem', color: '#334155', marginBottom: '0.8rem' }}>Ordered Products:</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.8rem' }}>
                    {(ord.items || []).map((item, i) => (
                      <div key={i} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.8rem',
                        background: '#f8fafc',
                        padding: '0.6rem 0.8rem',
                        borderRadius: '10px'
                      }}>
                        <img
                          src={item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'}
                          alt={item.name}
                          style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '8px' }}
                        />
                        <div style={{ flexGrow: 1 }}>
                          <p style={{ margin: 0, fontSize: '0.88rem', fontWeight: 600, color: '#0f172a' }}>{item.name}</p>
                          <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Qty: {item.quantity || 1} × ₹{Number(item.price).toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '1rem',
                  borderTop: '1px solid #f1f5f9',
                  flexWrap: 'wrap',
                  gap: '0.5rem'
                }}>
                  <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                    Shipped to: <b>{ord.customer?.fullName || 'Customer'}</b> ({ord.customer?.address || 'Nagpur'})
                  </div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                    Total: <span style={{ color: '#4f46e5' }}>₹{Number(ord.totalAmount).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Orders;
