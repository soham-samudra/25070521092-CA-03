import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './App.css';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      // Connect to Node.js backend /login endpoint
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok && data.jwtToken) {
        // Save JWT Token & User Profile in localStorage
        localStorage.setItem("jwtToken", data.jwtToken);
        localStorage.setItem("user", JSON.stringify(data.user || { email, name: email.split('@')[0] }));
        
        setSuccessMsg("🎉 Authentication successful! Redirecting to products...");
        window.dispatchEvent(new Event('storage'));

        setTimeout(() => {
          navigate("/products");
        }, 1200);
      } else {
        setErrorMsg(data.msg || "Invalid credentials. Please verify your email and password.");
      }
    } catch (err) {
      console.error("Login fetch error:", err);
      setErrorMsg("Unable to reach backend server. Please verify Node.js server is running on port 5000.");
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail("soham@college.edu");
    setPassword("password123");
  };

  return (
    <div className="auth-wrapper fade-in">
      <div className="auth-card">
        <div className="auth-header">
          <div className="logo-icon" style={{ margin: '0 auto 1rem auto' }}>🔐</div>
          <h2>Welcome Back</h2>
          <p>Sign in to your account with JWT Authentication</p>
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

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>College / Personal Email Address *</label>
            <input
              type="email"
              required
              className="form-control"
              placeholder="e.g. soham@college.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Password *</label>
            <input
              type="password"
              required
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" disabled={loading} className="auth-btn">
            {loading ? "Verifying with MongoDB..." : "Sign In & Get JWT Token"}
          </button>
        </form>

        <div className="demo-credentials-box">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <b>Demo Testing Account:</b>
            <button
              type="button"
              onClick={handleFillDemo}
              style={{
                background: '#e0e7ff',
                color: '#4338ca',
                padding: '0.2rem 0.6rem',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontWeight: 600
              }}
            >
              Autofill Demo
            </button>
          </div>
          <p style={{ marginTop: '0.3rem', fontSize: '0.8rem' }}>
            If not registered yet, create one in <Link to="/signup" style={{ color: '#4f46e5', fontWeight: 600 }}>Sign Up</Link> first.
          </p>
        </div>

        <div className="auth-footer">
          Don't have an account? <Link to="/signup">Register Here</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
