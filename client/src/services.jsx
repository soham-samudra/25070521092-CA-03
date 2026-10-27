import Footer from './homeComp/footer';
import { Link } from 'react-router-dom';
import './App.css';

const Services = () => {
  const serviceOfferings = [
    {
      icon: "⚡",
      title: "Express Tech Dispatch",
      desc: "Guaranteed same-day shipping on orders placed before 2 PM, with real-time GPS tracking and SMS alerts.",
      features: ["Next-day delivery guarantee", "Live location updates", "Tamper-evident packaging"]
    },
    {
      icon: "🛡️",
      title: "Comprehensive Warranty",
      desc: "All electronics and audio gear come with a minimum 1-year brand replacement warranty against manufacturing defects.",
      features: ["Zero-paperwork claims", "Doorstep pickup & replace", "Official brand authorization"]
    },
    {
      icon: "🔄",
      title: "Hassle-Free 30-Day Returns",
      desc: "Not fully satisfied with your purchase? Return any unopened or defective product within 30 days for 100% refund.",
      features: ["Instant refund processing", "Free return shipping", "No hidden restocking fees"]
    },
    {
      icon: "🤝",
      title: "Bulk & Educational Licensing",
      desc: "Special discounted rates for university departments, student coding clubs, and corporate office orders.",
      features: ["Volume pricing tiers", "GST invoice compliance", "Dedicated account manager"]
    },
    {
      icon: "🛠️",
      title: "Hardware Diagnostics & Repair",
      desc: "Certified technicians ready to assist with firmware upgrades, component installation, and troubleshooting.",
      features: ["Original spare parts", "Diagnostic report included", "Express 48hr repair turnaround"]
    },
    {
      icon: "🔐",
      title: "Enterprise REST API Integration",
      desc: "Full RESTful backend endpoints built with Node.js and MongoDB Compass for external inventory syncing.",
      features: ["JSON Web Token authentication", "High concurrency throughput", "Detailed API documentation"]
    }
  ];

  return (
    <div className="fade-in">
      <div className="page-wrapper">
        <div className="section-header">
          <span className="section-tag">Demonstration Showcase</span>
          <h1 className="section-title">E-Commerce Capabilities & Services</h1>
          <p className="section-desc">
            Simulated service modules and technical integrations designed for academic evaluation in CA-03.
          </p>
        </div>

        {/* Services Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem',
          margin: '2rem 0 4rem 0'
        }}>
          {serviceOfferings.map((service, index) => (
            <div key={index} style={{
              background: 'white',
              borderRadius: '20px',
              padding: '2rem',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)',
              display: 'flex',
              flexDirection: 'column',
              transition: 'all 0.3s ease'
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '14px',
                background: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.8rem',
                marginBottom: '1.2rem'
              }}>
                {service.icon}
              </div>

              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.6rem' }}>
                {service.title}
              </h3>

              <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.5rem', flexGrow: 1 }}>
                {service.desc}
              </p>

              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {service.features.map((feat, fIdx) => (
                    <li key={fIdx} style={{
                      padding: '0.3rem 0',
                      fontSize: '0.88rem',
                      color: '#334155',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span> {feat}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div style={{
          background: 'linear-gradient(135deg, #1e1b4b, #4338ca)',
          borderRadius: '24px',
          padding: '3rem 2rem',
          textAlign: 'center',
          color: 'white',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.8rem' }}>
            Need Custom Technical Support or Inquiries?
          </h2>
          <p style={{ color: '#c7d2fe', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto 1.8rem auto' }}>
            Our engineering team is always ready to answer any questions regarding product specifications or assignment details.
          </p>
          <Link to="/contact" className="btn-primary" style={{ background: 'white', color: '#4338ca', fontWeight: 700 }}>
            Contact Support Team &rarr;
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Services;
