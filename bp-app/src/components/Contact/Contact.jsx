import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { submitContact } from '../../services/api';

const Contact = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setError('Please fill in all fields');
      return;
    }
    
    setLoading(true);
    
    try {
      await submitContact({
        ...formData,
        userId: user?.id || null
      });
      
      setSubmitted(true);
      setFormData({ name: user?.name || '', email: user?.email || '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 3000);
      
    } catch (err) {
      setError(err.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const faqs = [
    { q: 'How often should I measure my BP?', a: 'Measure twice daily: morning and evening for most accurate tracking.' },
    { q: 'What is normal blood pressure?', a: 'Normal blood pressure is below 120/80 mmHg.' },
    { q: 'Is my data secure?', a: 'Yes, your data is stored in encrypted cloud database.' },
    { q: 'Can I export my data?', a: 'Yes, you can generate PDF reports from your dashboard.' },
  ];

  return (
    <div>
      {/* Header */}
      <div className="top-bar">
        <h1>Contact Support</h1>
        <div className="user-info">
          <span>{user?.name?.split(' ')[0] || 'Guest'}</span>
          <i className="fas fa-user-circle"></i>
        </div>
      </div>

      {/* Success Message */}
      {submitted && (
        <div style={{ 
          background: '#d1fae5', 
          color: '#065f46', 
          padding: '1rem', 
          borderRadius: '12px', 
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <i className="fas fa-check-circle"></i>
          <span>✅ Message sent successfully! We'll get back to you soon.</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div style={{ 
          background: '#fee2e2', 
          color: '#991b1b', 
          padding: '1rem', 
          borderRadius: '12px', 
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <i className="fas fa-exclamation-circle"></i>
          <span>{error}</span>
        </div>
      )}

      {/* Two Column Layout */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(2, 1fr)', 
        gap: '2rem', 
        marginBottom: '2rem' 
      }}>
        
        {/* Left Column - Contact Info */}
        <div style={{ 
          background: 'white', 
          borderRadius: '16px', 
          padding: '1.8rem', 
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <i className="fas fa-map-marker-alt" style={{ color: '#dc2626', fontSize: '1.3rem' }}></i>
            <h2 style={{ fontSize: '1.3rem', margin: 0 }}>Get in Touch</h2>
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ width: '35px', height: '35px', background: '#fee2e2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fas fa-map-marker-alt" style={{ color: '#dc2626', fontSize: '0.9rem' }}></i>
              </div>
              <span style={{ color: '#475569' }}>123 Health Street, Medical District, NY 10001</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ width: '35px', height: '35px', background: '#fee2e2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fas fa-phone" style={{ color: '#dc2626', fontSize: '0.9rem' }}></i>
              </div>
              <span style={{ color: '#475569' }}>+1 (555) 123-4567</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ width: '35px', height: '35px', background: '#fee2e2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fas fa-envelope" style={{ color: '#dc2626', fontSize: '0.9rem' }}></i>
              </div>
              <span style={{ color: '#475569' }}>support@heartguard.com</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '35px', height: '35px', background: '#fee2e2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fas fa-clock" style={{ color: '#dc2626', fontSize: '0.9rem' }}></i>
              </div>
              <span style={{ color: '#475569' }}>24/7 Emergency Support Available</span>
            </div>
          </div>

          {/* Social Links */}
          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem' }}>
            <h4 style={{ marginBottom: '1rem', color: '#1e293b' }}>Follow Us</h4>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <a href="#" style={{ width: '38px', height: '38px', background: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#dc2626', transition: 'all 0.3s', textDecoration: 'none' }}>
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" style={{ width: '38px', height: '38px', background: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#dc2626', transition: 'all 0.3s', textDecoration: 'none' }}>
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" style={{ width: '38px', height: '38px', background: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#dc2626', transition: 'all 0.3s', textDecoration: 'none' }}>
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a href="#" style={{ width: '38px', height: '38px', background: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#dc2626', transition: 'all 0.3s', textDecoration: 'none' }}>
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Right Column - Contact Form */}
        <div style={{ 
          background: 'white', 
          borderRadius: '16px', 
          padding: '1.8rem', 
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <i className="fas fa-paper-plane" style={{ color: '#dc2626', fontSize: '1.3rem' }}></i>
            <h2 style={{ fontSize: '1.3rem', margin: 0 }}>Send us a Message</h2>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#1e293b' }}>Your Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                style={{ 
                  width: '100%', 
                  padding: '0.8rem', 
                  border: '2px solid #e2e8f0', 
                  borderRadius: '10px', 
                  fontSize: '0.95rem',
                  outline: 'none',
                  transition: 'all 0.3s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#dc2626'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                required
              />
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#1e293b' }}>Your Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                style={{ 
                  width: '100%', 
                  padding: '0.8rem', 
                  border: '2px solid #e2e8f0', 
                  borderRadius: '10px', 
                  fontSize: '0.95rem',
                  outline: 'none',
                  transition: 'all 0.3s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#dc2626'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                required
              />
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#1e293b' }}>Subject *</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="What is this regarding?"
                style={{ 
                  width: '100%', 
                  padding: '0.8rem', 
                  border: '2px solid #e2e8f0', 
                  borderRadius: '10px', 
                  fontSize: '0.95rem',
                  outline: 'none',
                  transition: 'all 0.3s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#dc2626'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                required
              />
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#1e293b' }}>Message *</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Please describe your query or feedback..."
                rows="5"
                style={{ 
                  width: '100%', 
                  padding: '0.8rem', 
                  border: '2px solid #e2e8f0', 
                  borderRadius: '10px', 
                  fontSize: '0.95rem',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  outline: 'none',
                  transition: 'all 0.3s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#dc2626'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                required
              ></textarea>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="btn-submit"
              style={{ 
                width: '100%', 
                padding: '0.8rem', 
                background: '#dc2626', 
                color: 'white', 
                border: 'none', 
                borderRadius: '10px', 
                fontSize: '1rem', 
                fontWeight: '600', 
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                transition: 'all 0.3s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-paper-plane"></i>} 
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>

      {/* FAQ Section */}
      <div style={{ 
        background: 'white', 
        borderRadius: '16px', 
        padding: '1.8rem', 
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <i className="fas fa-question-circle" style={{ color: '#f59e0b', fontSize: '1.3rem' }}></i>
          <h2 style={{ fontSize: '1.3rem', margin: 0 }}>Frequently Asked Questions</h2>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {faqs.map((faq, i) => (
            <div 
              key={i} 
              style={{ 
                background: '#f8fafc', 
                borderRadius: '12px', 
                padding: '1rem',
                borderLeft: '3px solid #dc2626'
              }}
            >
              <strong style={{ color: '#1e293b', display: 'block', marginBottom: '0.5rem' }}>
                <i className="fas fa-question" style={{ color: '#dc2626', marginRight: '0.5rem', fontSize: '0.8rem' }}></i>
                {faq.q}
              </strong>
              <p style={{ color: '#64748b', margin: 0, lineHeight: '1.5' }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Responsive CSS */}
      <style>{`
        @media (max-width: 768px) {
          [style*="grid-template-columns: repeat(2, 1fr)"] {
            grid-template-columns: 1fr !important;
            gap: 1rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Contact;