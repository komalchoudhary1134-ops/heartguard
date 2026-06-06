import React from 'react';

const StatsCard = ({ icon, label, value, sub }) => {
  // Check screen size for responsive layout
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
  const isSmallMobile = typeof window !== 'undefined' && window.innerWidth <= 480;

  // Responsive styles
  const styles = {
    container: {
      background: 'white',
      padding: isSmallMobile ? '0.8rem' : (isMobile ? '1rem' : '1.5rem'),
      borderRadius: isSmallMobile ? '12px' : '15px',
      display: 'flex',
      alignItems: 'center',
      gap: isSmallMobile ? '0.6rem' : (isMobile ? '0.8rem' : '1rem'),
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
      transition: 'transform 0.3s, box-shadow 0.3s',
      cursor: 'pointer',
      width: '100%',
      boxSizing: 'border-box'
    },
    icon: {
      fontSize: isSmallMobile ? '1.5rem' : (isMobile ? '1.8rem' : '2.5rem'),
      color: '#dc2626',
      minWidth: isSmallMobile ? '35px' : (isMobile ? '40px' : 'auto')
    },
    info: {
      flex: 1
    },
    label: {
      fontSize: isSmallMobile ? '0.7rem' : (isMobile ? '0.8rem' : '0.9rem'),
      color: '#64748b',
      marginBottom: isSmallMobile ? '0.3rem' : '0.5rem',
      fontWeight: '500'
    },
    value: {
      fontSize: isSmallMobile ? '1.2rem' : (isMobile ? '1.4rem' : '1.8rem'),
      fontWeight: '700',
      color: '#1e293b',
      margin: 0,
      lineHeight: 1.2
    },
    subText: {
      fontSize: isSmallMobile ? '0.65rem' : (isMobile ? '0.7rem' : '0.75rem'),
      color: '#64748b',
      display: 'block',
      marginTop: isSmallMobile ? '0.2rem' : '0.3rem'
    }
  };

  const handleMouseEnter = (e) => {
    e.currentTarget.style.transform = 'translateY(-5px)';
    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
  };

  return (
    <div 
      className="stat-card-dashboard" 
      style={styles.container}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="stat-icon" style={styles.icon}>
        <i className={icon} style={{ fontSize: 'inherit', color: '#dc2626' }}></i>
      </div>
      <div className="stat-info" style={styles.info}>
        <h3 style={styles.label}>{label}</h3>
        <p style={styles.value}>
          {value === '--/--' ? (
            <span style={{ fontSize: isSmallMobile ? '0.9rem' : (isMobile ? '1rem' : '1.2rem') }}>--/--</span>
          ) : (
            value
          )}
        </p>
        {sub && <small style={styles.subText}>{sub}</small>}
      </div>
    </div>
  );
};

export default StatsCard;