import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dob: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 4) {
      setError('Password must be at least 4 characters');
      return;
    }
    
    setLoading(true);
    
    try {
      const result = await signup(formData);
      if (result.success) {
        navigate('/login');
      } else {
        setError(result.message || 'Signup failed');
      }
    } catch (err) {
      setError('Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      background: 'linear-gradient(135deg, #667eea, #764ba2)', 
      padding: '1rem' 
    }}>
      <div style={{ 
        background: 'white', 
        borderRadius: '20px', 
        padding: '2rem', 
        width: '100%', 
        maxWidth: '480px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        animation: 'fadeIn 0.3s ease-out'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <i className="fas fa-heartbeat" style={{ fontSize: '2.5rem', color: '#dc2626' }}></i>
          <h2 style={{ marginTop: '0.5rem', color: '#1e293b' }}>Create Account</h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Start your health journey today</p>
        </div>
        
        {error && (
          <div style={{ 
            background: '#fef2f2', 
            color: '#dc2626', 
            padding: '0.75rem', 
            borderRadius: '10px', 
            marginBottom: '1rem', 
            textAlign: 'center',
            fontSize: '0.9rem'
          }}>
            <i className="fas fa-exclamation-circle"></i> {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '0.8rem' }}>
            <input
              type="text"
              name="name"
              placeholder="Full name"
              value={formData.name}
              onChange={handleChange}
              style={{ 
                width: '100%', 
                padding: '0.8rem', 
                border: '2px solid #e2e8f0', 
                borderRadius: '10px', 
                fontSize: '1rem',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#dc2626'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              required
            />
          </div>
          
          <div style={{ marginBottom: '0.8rem' }}>
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              style={{ 
                width: '100%', 
                padding: '0.8rem', 
                border: '2px solid #e2e8f0', 
                borderRadius: '10px', 
                fontSize: '1rem',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#dc2626'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              required
            />
          </div>
          
          <div style={{ marginBottom: '0.8rem' }}>
            <input
              type="tel"
              name="phone"
              placeholder="Phone number"
              value={formData.phone}
              onChange={handleChange}
              style={{ 
                width: '100%', 
                padding: '0.8rem', 
                border: '2px solid #e2e8f0', 
                borderRadius: '10px', 
                fontSize: '1rem',
                outline: 'none'
              }}
              required
            />
          </div>
          
          <div style={{ marginBottom: '0.8rem' }}>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              style={{ 
                width: '100%', 
                padding: '0.8rem', 
                border: '2px solid #e2e8f0', 
                borderRadius: '10px', 
                fontSize: '1rem',
                outline: 'none'
              }}
              required
            />
          </div>
          
          <div style={{ marginBottom: '0.8rem' }}>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              style={{ 
                width: '100%', 
                padding: '0.8rem', 
                border: '2px solid #e2e8f0', 
                borderRadius: '10px', 
                fontSize: '1rem',
                outline: 'none'
              }}
              required
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
              style={{ 
                width: '100%', 
                padding: '0.8rem', 
                border: '2px solid #e2e8f0', 
                borderRadius: '10px', 
                fontSize: '1rem',
                outline: 'none'
              }}
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
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
              transition: 'all 0.3s'
            }}
          >
            {loading ? <i className="fas fa-spinner fa-spin"></i> : 'Create Account'}
          </button>
        </form>
        
        <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
          <p style={{ color: '#64748b' }}>
            Already have an account?{' '}
            <a href="/login" style={{ color: '#dc2626', textDecoration: 'none', fontWeight: '500' }}>Login</a>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 480px) {
          .signup-card {
            padding: 1.5rem !important;
          }
          h2 {
            font-size: 1.5rem !important;
          }
          input, button {
            padding: 0.6rem !important;
            font-size: 0.9rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Signup;