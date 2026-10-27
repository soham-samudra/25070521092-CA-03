import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Footer from './homeComp/footer';
import './App.css';

// SVG Fallback for broken/missing product images
const DEFAULT_IMAGE = "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22600%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20600%20400%22%20fill%3D%22%23e2e8f0%22%3E%3Crect%20width%3D%22600%22%20height%3D%22400%22%20fill%3D%22%23f1f5f9%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20font-family%3D%22sans-serif%22%20font-size%3D%2220%22%20fill%3D%22%2394a3b8%22%3ENexStore%20Product%20Image%3C%2Ftext%3E%3C%2Fsvg%3E";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCat = searchParams.get('category') || 'All';

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCat);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [visibleCount, setVisibleCount] = useState(8);
  const [loading, setLoading] = useState(true);

  // CRUD Modals State
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // New Product Form State
  const [newProd, setNewProd] = useState({
    name: '',
    category: 'Smartphones',
    price: '',
    description: '',
    image: '',
    stock: 15,
    tag: 'New'
  });

  const categories = ['All', 'Smartphones', 'Laptops', 'Audio', 'Accessories', 'Wearables'];

  const fetchProducts = () => {
    setLoading(true);
    fetch("http://localhost:5000/products")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data);
          setFilteredProducts(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.warn("Products fetch offline note:", err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter & Search Logic
  useEffect(() => {
    let result = [...products];

    // Filter by Category
    if (selectedCategory !== 'All') {
      result = result.filter(
        (p) => p.category && p.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by Search Query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          (p.name && p.name.toLowerCase().includes(q)) ||
          (p.description && p.description.toLowerCase().includes(q))
      );
    }

    // Sorting
    if (sortBy === 'price-low') {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortBy === 'rating') {
      result.sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0));
    } else if (sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    setFilteredProducts(result);
    setVisibleCount(8); // Reset pagination on filter change
  }, [selectedCategory, searchQuery, sortBy, products]);

  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat);
    if (cat === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingIndex = cart.findIndex((item) => item._id === product._id);
    const currentQtyInCart = existingIndex > -1 ? (cart[existingIndex].quantity || 1) : 0;

    if (product.stock !== undefined && currentQtyInCart >= product.stock) {
      alert(`Sorry, only ${product.stock} units of "${product.name}" are in stock!`);
      return;
    }

    if (existingIndex > -1) {
      cart[existingIndex].quantity = currentQtyInCart + 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('storage'));
    alert(`🛒 "${product.name}" added to cart!`);
  };

  // CREATE: Add Product to MongoDB
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (Number(newProd.price) <= 0) {
      alert("Please enter a valid price greater than 0.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProd)
      });
      const data = await res.json();
      if (res.ok) {
        alert("✅ Product successfully created and stored in MongoDB Compass collection 'products'!");
        setShowAddModal(false);
        setNewProd({
          name: '',
          category: 'Smartphones',
          price: '',
          description: '',
          image: '',
          stock: 15,
          tag: 'New'
        });
        fetchProducts();
      } else {
        alert(data.msg || "Failed to create product.");
      }
    } catch (err) {
      alert("Error contacting backend server: " + err.message);
    }
  };

  // UPDATE: Edit Product in MongoDB
  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      const res = await fetch(`http://localhost:5000/products/${editingProduct._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingProduct)
      });
      const data = await res.json();
      if (res.ok) {
        alert("✅ Product updated successfully in MongoDB!");
        setEditingProduct(null);
        fetchProducts();
      } else {
        alert(data.msg || "Failed to update product.");
      }
    } catch (err) {
      alert("Error updating product: " + err.message);
    }
  };

  // DELETE: Delete Product from MongoDB
  const handleDeleteProduct = async (productId, productName) => {
    const confirmed = window.confirm(`Are you sure you want to delete "${productName}" from MongoDB?`);
    if (!confirmed) return;

    try {
      const res = await fetch(`http://localhost:5000/products/${productId}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (res.ok) {
        alert("🗑️ Product deleted from MongoDB Compass collection 'products'!");
        fetchProducts();
      } else {
        alert(data.msg || "Failed to delete product.");
      }
    } catch (err) {
      alert("Error deleting product: " + err.message);
    }
  };

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = DEFAULT_IMAGE;
  };

  return (
    <div className="fade-in">
      <div className="page-wrapper">
        {/* Page Header */}
        <div className="section-header" style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
          <span className="section-tag">NexStore Catalog</span>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <h1 className="section-title">All Products ({filteredProducts.length})</h1>
            <button
              onClick={() => setShowAddModal(!showAddModal)}
              className="btn-primary"
              style={{ fontSize: '0.9rem', padding: '0.6rem 1.2rem' }}
            >
              {showAddModal ? "✕ Close Form" : "+ Add New Product (MongoDB)"}
            </button>
          </div>
          <p className="section-desc" style={{ margin: '0.4rem 0 0 0' }}>
            Live MongoDB database collection <code>products</code> with real-time CRUD synchronization.
          </p>
        </div>

        {/* CREATE MODAL: Add New Product */}
        {showAddModal && (
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '20px',
            border: '2px solid #818cf8',
            marginBottom: '2rem',
            boxShadow: '0 10px 25px -5px rgba(79, 70, 229, 0.1)'
          }}>
            <h3 style={{ marginBottom: '1rem', color: '#1e293b' }}>
              ➕ Create New Product Record (MongoDB Compass)
            </h3>
            <form onSubmit={handleCreateProduct}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label>Product Name *</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="e.g. Sony WH-CH720N"
                    value={newProd.name}
                    onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Category *</label>
                  <select
                    className="form-control"
                    value={newProd.category}
                    onChange={(e) => setNewProd({ ...newProd, category: e.target.value })}
                  >
                    <option value="Smartphones">Smartphones</option>
                    <option value="Laptops">Laptops</option>
                    <option value="Audio">Audio</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Wearables">Wearables</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Price (₹ INR) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    className="form-control"
                    placeholder="e.g. 9999"
                    value={newProd.price}
                    onChange={(e) => setNewProd({ ...newProd, price: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Stock Quantity</label>
                  <input
                    type="number"
                    min="0"
                    className="form-control"
                    placeholder="e.g. 15"
                    value={newProd.stock}
                    onChange={(e) => setNewProd({ ...newProd, stock: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Image URL</label>
                  <input
                    type="url"
                    className="form-control"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={newProd.image}
                    onChange={(e) => setNewProd({ ...newProd, image: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Promo Badge Tag</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Trending, Best Seller"
                    value={newProd.tag}
                    onChange={(e) => setNewProd({ ...newProd, tag: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  rows="3"
                  className="form-control"
                  placeholder="Key hardware specs, warranty, features..."
                  value={newProd.description}
                  onChange={(e) => setNewProd({ ...newProd, description: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.8rem' }}>
                <button type="submit" className="btn-primary">
                  💾 Save to MongoDB Collection
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary"
                  style={{ background: '#f1f5f9', color: '#475569' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* UPDATE MODAL: Edit Product */}
        {editingProduct && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            padding: '1rem'
          }}>
            <div style={{
              background: 'white',
              width: '100%',
              maxWidth: '560px',
              borderRadius: '20px',
              padding: '2rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                <h3 style={{ margin: 0, color: '#0f172a' }}>✏️ Edit Product in MongoDB</h3>
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  style={{ background: 'none', fontSize: '1.4rem', color: '#64748b' }}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleUpdateProduct}>
                <div className="form-group">
                  <label>Product Name *</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    value={editingProduct.name || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label>Category</label>
                    <select
                      className="form-control"
                      value={editingProduct.category || 'Smartphones'}
                      onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    >
                      <option value="Smartphones">Smartphones</option>
                      <option value="Laptops">Laptops</option>
                      <option value="Audio">Audio</option>
                      <option value="Accessories">Accessories</option>
                      <option value="Wearables">Wearables</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Price (₹) *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      className="form-control"
                      value={editingProduct.price || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label>Stock Quantity</label>
                    <input
                      type="number"
                      min="0"
                      className="form-control"
                      value={editingProduct.stock || 0}
                      onChange={(e) => setEditingProduct({ ...editingProduct, stock: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Tag / Badge</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editingProduct.tag || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, tag: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Image URL</label>
                  <input
                    type="url"
                    className="form-control"
                    value={editingProduct.image || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    rows="3"
                    className="form-control"
                    value={editingProduct.description || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1.5rem' }}>
                  <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                    Update Record in MongoDB
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="btn-secondary"
                    style={{ background: '#f1f5f9', color: '#475569' }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Filter and Search Bar */}
        <div className="filter-bar">
          <div className="filter-group">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => handleCategoryClick(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="🔍 Search products..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <select
              className="search-input"
              style={{ width: '160px' }}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="featured">Sort by: Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
            <h3>Loading products from MongoDB Compass...</h3>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.8rem' }}>🔍</div>
            <h3>No products found</h3>
            <p style={{ color: '#64748b', marginTop: '0.5rem' }}>
              No matches found for "{searchQuery}". Try adjusting your filters.
            </p>
            <button
              onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
              className="btn-primary"
              style={{ marginTop: '1rem' }}
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <>
            <div className="products-grid">
              {filteredProducts.slice(0, visibleCount).map((product) => (
                <div key={product._id} className="product-card fade-in">
                  <div className="card-img-wrapper">
                    <img
                      src={product.image || DEFAULT_IMAGE}
                      alt={product.name}
                      onError={handleImageError}
                      loading="lazy"
                    />
                    {product.tag && <span className="product-tag">{product.tag}</span>}
                  </div>

                  <div className="card-body">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                      <span className="card-category">{product.category}</span>
                      <span style={{ fontSize: '0.78rem', color: (product.stock || 0) > 5 ? '#15803d' : '#b45309', fontWeight: 600 }}>
                        {(product.stock || 0) > 0 ? `● ${product.stock} in stock` : '○ Out of stock'}
                      </span>
                    </div>

                    <h3 className="card-title">
                      <Link to={`/product/${product._id}`}>{product.name}</Link>
                    </h3>
                    <p className="card-desc">{product.description}</p>

                    <div className="card-rating">
                      <span>★ {product.rating || '4.8'}</span>
                      <span className="review-count">({product.reviewsCount || '80+'} reviews)</span>
                    </div>

                    <div className="card-footer">
                      <div className="card-price">₹{Number(product.price).toLocaleString('en-IN')}</div>
                      <button
                        onClick={() => addToCart(product)}
                        className="btn-add-cart"
                        disabled={Number(product.stock) <= 0}
                      >
                        + Add to Cart
                      </button>
                    </div>

                    {/* Admin / Demonstration CRUD Actions */}
                    <div style={{
                      display: 'flex',
                      gap: '0.4rem',
                      marginTop: '0.8rem',
                      paddingTop: '0.6rem',
                      borderTop: '1px dashed #e2e8f0',
                      justifyContent: 'flex-end'
                    }}>
                      <button
                        onClick={() => setEditingProduct(product)}
                        style={{
                          background: '#f1f5f9',
                          color: '#475569',
                          padding: '0.25rem 0.6rem',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: 600
                        }}
                        title="Edit product in MongoDB"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product._id, product.name)}
                        style={{
                          background: '#fee2e2',
                          color: '#b91c1c',
                          padding: '0.25rem 0.6rem',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: 600
                        }}
                        title="Delete product from MongoDB"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Pagination */}
            {visibleCount < filteredProducts.length && (
              <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
                <button
                  onClick={() => setVisibleCount((prev) => prev + 6)}
                  className="btn-primary"
                  style={{ padding: '0.8rem 2rem' }}
                >
                  Load More Products ({filteredProducts.length - visibleCount} remaining) ↓
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Products;
