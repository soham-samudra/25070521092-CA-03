import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './App.css';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: 21,
    status: 'Student'
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg("Passwords do not match! Please verify.");
      return;
    }

    if (formData.password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      // Connect to Node.js backend /create endpoint (Exact match to professor code)
      const response = await fetch("http://localhost:5000/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          age: Number(formData.age),
          status: formData.status
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMsg("🎉 Registration Successful! Document saved in MongoDB Compass database 'sitSecB'.");
        
        // If JWT token returned, log them in directly
        if (data.jwtToken) {
          localStorage.setItem("jwtToken", data.jwtToken);
          localStorage.setItem("user", JSON.stringify(data.user || { name: formData.name, email: formData.email }));
          window.dispatchEvent(new Event('storage'));
        }

        setTimeout(() => {
          navigate("/products");
        }, 1500);
      } else {
        setErrorMsg(data.msg || "Failed to create account. Please try again.");
      }
    } catch (err) {
      console.error("Signup fetch error:", err);
      setErrorMsg("Unable to reach backend server. Please verify Node.js server is running on port 5000.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper fade-in">
      <div className="auth-card" style={{ maxWidth: '500px' }}>
        <div className="auth-header">
          <div className="logo-icon" style={{ margin: '0 auto 1rem auto' }}>✨</div>
          <h2>Create Your Account</h2>
          <p>Compulsory CA-03 Authentication Module with MongoDB</p>
        </div>

        {errorMsg && (
          <div className="alert-box alert-danger">
            ⚠️ {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="alert-box alert-success">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSignup}>
          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              name="name"
              required
              className="form-control"
              placeholder="e.g. Soham Samudra"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>College / Personal Email Address *</label>
            <input
              type="email"
              name="email"
              required
              className="form-control"
              placeholder="e.g. soham@college.edu"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Age</label>
              <input
                type="number"
                name="age"
                className="form-control"
                value={formData.age}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Role / Status</label>
              <select
                name="status"
                className="form-control"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Student">Student</option>
                <option value="Admin">Admin</option>
                <option value="Customer">Customer</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Password *</label>
              <input
                type="password"
                name="password"
                required
                className="form-control"
                placeholder="Min 6 chars"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Confirm Password *</label>
              <input
                type="password"
                name="confirmPassword"
                required
                className="form-control"
                placeholder="Re-enter password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="auth-btn">
            {loading ? "Encrypting & Storing in MongoDB..." : "Sign Up & Register"}
          </button>
        </form>

        <div className="auth-footer">
          Already registered? <Link to="/login">Sign In Instead</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
