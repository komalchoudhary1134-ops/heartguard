import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as apiLogin, signup as apiSignup, logout as apiLogout, getCurrentUser } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    const currentToken = localStorage.getItem('token');
    setUser(currentUser);
    setToken(currentToken);
    setLoading(false);
  }, []);

  const signup = async (userData) => {
    try {
      const result = await apiSignup(userData);
      console.log('Signup result:', result);
      
      if (result.success && result.token) {
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        setUser(result.user);
        setToken(result.token);
      } else if (result.token) {
        // Fallback if success flag not present
        localStorage.setItem('token', result.token);
        if (result.user) {
          localStorage.setItem('user', JSON.stringify(result.user));
          setUser(result.user);
        }
        setToken(result.token);
      }
      return result;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const result = await apiLogin(email, password);
      console.log('Login result:', result);
      
      if (result.success && result.token) {
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        setUser(result.user);
        setToken(result.token);
      } else if (result.token) {
        // Fallback if success flag not present
        localStorage.setItem('token', result.token);
        if (result.user) {
          localStorage.setItem('user', JSON.stringify(result.user));
          setUser(result.user);
        }
        setToken(result.token);
      }
      return result;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    apiLogout();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};