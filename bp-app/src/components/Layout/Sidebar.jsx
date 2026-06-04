import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const closeSidebar = () => setIsOpen(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/dashboard', icon: 'fas fa-tachometer-alt', label: 'Dashboard' },
    { path: '/insights', icon: 'fas fa-brain', label: 'Insights' },
    { path: '/healthy-tips', icon: 'fas fa-leaf', label: 'Healthy Tips' },
    { path: '/contact', icon: 'fas fa-envelope', label: 'Contact' },
  ];

  const sidebarContent = (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem', padding: '0 1rem' }}>
        <i className="fas fa-heartbeat" style={{ fontSize: '2rem', color: '#ef4444' }}></i>
        <span style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>HeartGuard</span>
      </div>

      <ul style={{ listStyle: 'none' }}>
        {menuItems.map(item => (
          <li
            key={item.path}
            onClick={() => { navigate(item.path); closeSidebar(); }}
            style={{
              padding: '12px 16px',
              margin: '8px 0',
              borderRadius: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              transition: 'all 0.3s',
              background: location.pathname === item.path ? '#ef4444' : 'transparent',
              color: location.pathname === item.path ? 'white' : '#94a3b8'
            }}
          >
            <i className={item.icon}></i>
            <span>{item.label}</span>
          </li>
        ))}
      </ul>

      <div style={{ position: 'absolute', bottom: '2rem', left: '1rem', right: '1rem' }}>
        <div style={{ padding: '0.5rem 1rem', marginBottom: '1rem', borderBottom: '1px solid #334155' }}>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Logged in as</p>
          <p style={{ fontWeight: '500' }}>{user?.name || 'User'}</p>
        </div>
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            padding: '12px',
            background: 'rgba(239,68,68,0.2)',
            color: '#ef4444',
            border: '1px solid #ef4444',
            borderRadius: '12px',
            cursor: 'pointer',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            transition: 'all 0.3s'
          }}
        >
          <i className="fas fa-sign-out-alt"></i> Logout
        </button>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <>
        <button
          className="menu-btn"
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            top: '15px',
            left: '15px',
            zIndex: 1001,
            background: '#dc2626',
            color: 'white',
            border: 'none',
            width: '45px',
            height: '45px',
            borderRadius: '8px',
            fontSize: '1.2rem',
            cursor: 'pointer',
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
          }}
        >
          <i className="fas fa-bars"></i>
        </button>
        <div
          className={`sidebar-overlay ${isOpen ? 'active' : ''}`}
          onClick={closeSidebar}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 999,
            display: isOpen ? 'block' : 'none'
          }}
        ></div>
        <nav
          className={`sidebar ${isOpen ? 'open' : ''}`}
          style={{
            width: '280px',
            background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
            color: 'white',
            padding: '2rem 1rem',
            position: 'fixed',
            height: '100vh',
            overflowY: 'auto',
            zIndex: 1000,
            left: isOpen ? '0' : '-280px',
            top: 0,
            transition: 'left 0.3s ease'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
            <button onClick={closeSidebar} style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.2rem', cursor: 'pointer' }}>
              <i className="fas fa-times"></i>
            </button>
          </div>
          {sidebarContent}
        </nav>
      </>
    );
  }

  return (
    <nav className="sidebar" style={{
      width: '280px',
      background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
      color: 'white',
      padding: '2rem 1rem',
      position: 'fixed',
      height: '100vh',
      overflowY: 'auto',
      left: 0,
      top: 0
    }}>
      {sidebarContent}
    </nav>
  );
};

export default Sidebar;