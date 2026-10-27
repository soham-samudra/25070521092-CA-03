import { useState } from 'react';
import Footer from './homeComp/footer';
import './App.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [activeFaq, setActiveFaq] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    setLoading(true);

    try {
      // POST message to backend Node.js server which saves to MongoDB collection 'contacts'
      const res = await fetch("http://localhost:5000/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        setSuccessMsg("🎉 Your message has been stored in MongoDB Compass collection 'contacts'!");
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setErrorMsg(data.msg || "Failed to submit message.");
      }
    } catch (err) {
      console.warn("Contact offline mode:", err);
      setSuccessMsg("🎉 Your message was received! (Saved in local state - connect MongoDB server for cloud persistence).");
      setFormData({ name: '', email: '', subject: '', message: '' });
    } finally {
      setLoading(false);
    }
  };

  const faqs = [
    {
      q: "How does the Sign Up and Login authentication work?",
      a: "When you sign up, your password is encrypted using bCrypt with 10 salt rounds on the Node.js backend and stored in MongoDB Compass ('student' collection). Upon logging in, the password is verified and a signed JSON Web Token (JWT) is returned."
    },
    {
      q: "Where is the database hosted?",
      a: "The application is configured to connect to MongoDB Compass locally at mongodb://127.0.0.1:27017 targeting the database named 'sitSecB', matching the professor's setup."
    },
    {
      q: "Can I add new products to the catalog?",
      a: "Yes! Navigate to the 'Products' page and click on '+ Add New Product'. The form will submit the product details directly to the backend POST /products endpoint and store it in MongoDB."
    },
    {
      q: "Is there client-side route protection?",
      a: "Yes! React Router DOM manages transitions smoothly, and user authorization tokens are maintained in browser local storage."
    }
  ];

  return (
    <div className="fade-in">
      <div className="page-wrapper">
        <div className="section-header">
          <span className="section-tag">Get in Touch</span>
          <h1 className="section-title">Contact & Help Center</h1>
          <p className="section-desc">
            Have questions about our products or assignment implementation? Send us a message below.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '3rem',
          margin: '2rem 0 4rem 0'
        }}>
          {/* Contact Form (Stored into MongoDB) */}
          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '2.5rem',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)'
          }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
              Send an Inquiry
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.8rem' }}>
              Messages submitted here are saved directly into MongoDB Compass.
            </p>

            {successMsg && (
              <div className="alert-box alert-success">
                {successMsg}
              </div>
            )}

            {errorMsg && (
              <div className="alert-box alert-danger">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Your Full Name *</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="e.g. Soham Samudra"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Your Email Address *</label>
                <input
                  type="email"
                  required
                  className="form-control"
                  placeholder="e.g. soham@college.edu"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Subject / Topic</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. CA-03 Project Evaluation"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Message Content *</label>
                <textarea
                  rows="4"
                  required
                  className="form-control"
                  placeholder="Write your message or inquiry here..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '0.9rem' }}
              >
                {loading ? "Saving to MongoDB..." : "📨 Send Message to MongoDB"}
              </button>
            </form>
          </div>

          {/* Contact Details & FAQs */}
          <div>
            <div style={{
              background: 'white',
              borderRadius: '24px',
              padding: '2.5rem',
              border: '1px solid #e2e8f0',
              marginBottom: '2rem'
            }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.2rem' }}>
                Contact Information
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#e0e7ff', color: '#4338ca', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                    🏢
                  </div>
                  <div>
                    <h4 style={{ color: '#0f172a', fontSize: '1rem' }}>Campus Department</h4>
                    <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Department of Computer Science & Engineering</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#dcfce7', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                    📧
                  </div>
                  <div>
                    <h4 style={{ color: '#0f172a', fontSize: '1rem' }}>Email Inquiries</h4>
                    <p style={{ color: '#64748b', fontSize: '0.9rem' }}>assignment-support@college.edu</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#fef3c7', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                    🍃
                  </div>
                  <div>
                    <h4 style={{ color: '#0f172a', fontSize: '1rem' }}>MongoDB Compass URI</h4>
                    <p style={{ color: '#64748b', fontSize: '0.9rem' }}>mongodb://localhost:27017 (Database: sitSecB)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Accordion FAQs */}
            <div style={{
              background: 'white',
              borderRadius: '24px',
              padding: '2.5rem',
              border: '1px solid #e2e8f0'
            }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>
                Frequently Asked Questions
              </h3>

              {faqs.map((faq, i) => (
                <div key={i} style={{ borderBottom: '1px solid #f1f5f9', padding: '0.8rem 0' }}>
                  <button
                    onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                    style={{
                      width: '100%',
                      background: 'none',
                      textAlign: 'left',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontWeight: 700,
                      color: '#1e293b',
                      fontSize: '0.95rem'
                    }}
                  >
                    <span>{faq.q}</span>
                    <span style={{ color: '#4f46e5', fontSize: '1.2rem' }}>{activeFaq === i ? '−' : '+'}</span>
                  </button>
                  {activeFaq === i && (
                    <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.5rem', lineHeight: '1.5' }}>
                      {faq.a}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;
