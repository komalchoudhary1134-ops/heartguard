import React from 'react';

const StatsCard = ({ icon, label, value, sub }) => {
  return (
    <div className="stat-card-dashboard" style={{ 
      background: 'white', 
      padding: '1.5rem', 
      borderRadius: '15px', 
      display: 'flex', 
      alignItems: 'center', 
      gap: '1rem', 
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
      transition: 'transform 0.3s'
    }}>
      <div className="stat-icon">
        <i className={icon} style={{ fontSize: '2.5rem', color: '#dc2626' }}></i>
      </div>
      <div className="stat-info">
        <h3 style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '0.5rem' }}>{label}</h3>
        <p style={{ fontSize: '1.8rem', fontWeight: '700', color: '#1e293b', margin: 0 }}>{value}</p>
        <small style={{ color: '#64748b' }}>{sub}</small>
      </div>
    </div>
  );
};

export default StatsCard;