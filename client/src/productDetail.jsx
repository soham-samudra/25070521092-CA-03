import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Footer from './homeComp/footer';
import './App.css';

const DEFAULT_IMAGE = "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22600%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20600%20400%22%20fill%3D%22%23e2e8f0%22%3E%3Crect%20width%3D%22600%22%20height%3D%22400%22%20fill%3D%22%23f1f5f9%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20font-family%3D%22sans-serif%22%20font-size%3D%2220%22%20fill%3D%22%2394a3b8%22%3ENexStore%20Product%20Image%3C%2Ftext%3E%3C%2Fsvg%3E";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:5000/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Product fetch failed");
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setLoading(false);

        // Fetch related products in same category
        if (data.category) {
          fetch(`http://localhost:5000/products?category=${encodeURIComponent(data.category)}`)
            .then((r) => r.json())
            .then((catList) => {
              if (Array.isArray(catList)) {
                setRelatedProducts(catList.filter((p) => String(p._id) !== String(id)).slice(0, 3));
              }
            })
            .catch(() => {});
        }
      })
      .catch((err) => {
        console.warn("Detail fetch offline fallback:", err.message);
        setLoading(false);
      });
  }, [id]);

  const addToCart = (itemToAdd = product, qty = quantity) => {
    if (!itemToAdd) return;
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingIndex = cart.findIndex((item) => item._id === itemToAdd._id);
    const currentInCart = existingIndex > -1 ? (cart[existingIndex].quantity || 1) : 0;
    const maxStock = itemToAdd.stock !== undefined ? itemToAdd.stock : 999;

    if (currentInCart + qty > maxStock) {
      alert(`Cannot add more. Available stock limit is ${maxStock}.`);
      return;
    }

    if (existingIndex > -1) {
      cart[existingIndex].quantity = currentInCart + qty;
    } else {
      cart.push({ ...itemToAdd, quantity: qty });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('storage'));
    alert(`🛒 ${qty}x "${itemToAdd.name}" added to your cart!`);
  };

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = DEFAULT_IMAGE;
  };

  if (loading) {
    return (
      <div className="page-wrapper" style={{ textAlign: 'center', padding: '5rem' }}>
        <h2>Loading product details from MongoDB Compass...</h2>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="page-wrapper" style={{ textAlign: 'center', padding: '5rem' }}>
        <h2>Product Not Found</h2>
        <p style={{ color: '#64748b', marginTop: '0.5rem' }}>The product you requested could not be retrieved from the database.</p>
        <Link to="/products" className="btn-primary" style={{ marginTop: '1.5rem' }}>
          Back to Products Catalog
        </Link>
      </div>
    );
  }

  const maxAvailable = product.stock !== undefined ? product.stock : 10;

  return (
    <div className="fade-in">
      <div className="page-wrapper">
        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'none',
            color: '#4f46e5',
            fontWeight: 600,
            marginBottom: '1.5rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.95rem'
          }}
        >
          &larr; Back to Products
        </button>

        <div className="detail-grid">
          <div>
            <img
              src={product.image || DEFAULT_IMAGE}
              alt={product.name}
              className="detail-img"
              onError={handleImageError}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <span className="card-category">{product.category}</span>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', margin: '0.4rem 0 0.8rem 0', lineHeight: 1.2 }}>
              {product.name}
            </h1>

            <div className="card-rating" style={{ fontSize: '1rem', marginBottom: '1.2rem' }}>
              <span>★ {product.rating || '4.8'}</span>
              <span className="review-count">({product.reviewsCount || '100+'} customer reviews)</span>
              <span style={{ color: maxAvailable > 0 ? '#10b981' : '#ef4444', marginLeft: '1rem', fontWeight: 600 }}>
                ● {maxAvailable > 0 ? `In Stock (${maxAvailable} units available)` : 'Out of Stock'}
              </span>
            </div>

            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem' }}>
              ₹{Number(product.price).toLocaleString('en-IN')}
            </div>

            <p style={{ color: '#475569', fontSize: '1.02rem', lineHeight: '1.7', marginBottom: '2rem' }}>
              {product.description}
            </p>

            {maxAvailable > 0 ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '10px', overflow: 'hidden' }}>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    style={{ padding: '0.6rem 1rem', background: '#f8fafc', fontSize: '1.1rem', fontWeight: 'bold' }}
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span style={{ padding: '0.6rem 1.2rem', fontWeight: 700, minWidth: '40px', textAlign: 'center' }}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(maxAvailable, quantity + 1))}
                    style={{ padding: '0.6rem 1rem', background: '#f8fafc', fontSize: '1.1rem', fontWeight: 'bold' }}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <button onClick={() => addToCart(product, quantity)} className="btn-primary" style={{ padding: '0.85rem 2rem' }}>
                  🛒 Add to Cart
                </button>
              </div>
            ) : (
              <div className="alert-box alert-danger" style={{ marginBottom: '2rem' }}>
                ⚠️ This item is currently out of stock in MongoDB collection.
              </div>
            )}

            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.88rem', color: '#64748b' }}>
              <div>📦 <b>Free Dispatch</b> within 24 hours</div>
              <div>🔄 <b>30-Day Easy Returns</b> simulated</div>
              <div>🛡️ <b>1 Year Brand Coverage</b> demonstration</div>
              <div>🍃 <b>MongoDB ID:</b> <code>{product._id}</code></div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div style={{ marginTop: '4rem' }}>
            <div className="section-header" style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
              <span className="section-tag">More from {product.category}</span>
              <h2 className="section-title" style={{ fontSize: '1.7rem' }}>Related Products</h2>
            </div>

            <div className="products-grid">
              {relatedProducts.map((rel) => (
                <div key={rel._id} className="product-card fade-in">
                  <div className="card-img-wrapper" style={{ height: '180px' }}>
                    <img
                      src={rel.image || DEFAULT_IMAGE}
                      alt={rel.name}
                      onError={handleImageError}
                      loading="lazy"
                    />
                  </div>
                  <div className="card-body">
                    <span className="card-category">{rel.category}</span>
                    <h4 className="card-title" style={{ fontSize: '1.05rem' }}>
                      <Link to={`/product/${rel._id}`}>{rel.name}</Link>
                    </h4>
                    <div className="card-footer" style={{ marginTop: '0.8rem' }}>
                      <div className="card-price" style={{ fontSize: '1.15rem' }}>
                        ₹{Number(rel.price).toLocaleString('en-IN')}
                      </div>
                      <button onClick={() => addToCart(rel, 1)} className="btn-add-cart" style={{ padding: '0.4rem 0.8rem' }}>
                        + Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;
