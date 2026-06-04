import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout/Layout';
import Dashboard from './components/Dashboard/Dashboard';
import Insights from './components/Insights/Insights';
import HealthyTips from './components/HealthyTips/HealthyTips';
import Contact from './components/Contact/Contact';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import './styles/global.css';

function AppRoutes() {
  const { user } = useAuth();
  const isAuthenticated = !!user;

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/" element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}>
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="insights" element={<Insights />} />
        <Route path="healthy-tips" element={<HealthyTips />} />
        <Route path="contact" element={<Contact />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;