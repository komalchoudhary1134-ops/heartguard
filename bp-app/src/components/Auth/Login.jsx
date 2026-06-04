import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const result = await login(email, password);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.message || 'Invalid email or password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
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
        maxWidth: '400px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        animation: 'fadeIn 0.3s ease-out'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <i className="fas fa-heartbeat" style={{ fontSize: '3rem', color: '#dc2626' }}></i>
          <h2 style={{ marginTop: '0.5rem', color: '#1e293b' }}>Welcome Back</h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Login to track your blood pressure</p>
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
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#1e293b' }}>Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '0.8rem', 
                border: '2px solid #e2e8f0', 
                borderRadius: '10px', 
                fontSize: '1rem',
                outline: 'none',
                transition: 'all 0.3s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#dc2626'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              required
            />
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#1e293b' }}>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '0.8rem', 
                border: '2px solid #e2e8f0', 
                borderRadius: '10px', 
                fontSize: '1rem',
                outline: 'none',
                transition: 'all 0.3s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#dc2626'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
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
            {loading ? <i className="fas fa-spinner fa-spin"></i> : 'Login'}
          </button>
        </form>
        
        <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
          <p style={{ color: '#64748b' }}>
            Don't have an account?{' '}
            <a href="/signup" style={{ color: '#dc2626', textDecoration: 'none', fontWeight: '500' }}>Sign up</a>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 480px) {
          .auth-card {
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

export default Login;