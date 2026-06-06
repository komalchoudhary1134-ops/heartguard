import React from 'react';

const RecentReadings = ({ readings, onDelete }) => {
  // Check screen size for responsive layout
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
  const isSmallMobile = typeof window !== 'undefined' && window.innerWidth <= 480;

  // Responsive styles
  const styles = {
    container: {
      background: 'white',
      padding: isSmallMobile ? '0.8rem' : (isMobile ? '1rem' : '1.5rem'),
      borderRadius: '15px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
      width: '100%',
      boxSizing: 'border-box',
      overflowX: 'auto'
    },
    title: {
      marginBottom: isSmallMobile ? '0.8rem' : '1rem',
      fontSize: isSmallMobile ? '1.1rem' : (isMobile ? '1.2rem' : '1.3rem'),
      marginTop: 0
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      minWidth: isMobile ? '500px' : 'auto',
      fontSize: isSmallMobile ? '0.75rem' : (isMobile ? '0.8rem' : '0.9rem')
    },
    th: {
      padding: isSmallMobile ? '0.5rem' : (isMobile ? '0.7rem' : '1rem'),
      textAlign: 'left',
      background: '#f8fafc',
      fontWeight: '600',
      whiteSpace: 'nowrap'
    },
    td: {
      padding: isSmallMobile ? '0.5rem' : (isMobile ? '0.7rem' : '1rem'),
      borderBottom: '1px solid #e2e8f0',
      whiteSpace: 'nowrap'
    },
    emptyMessage: {
      textAlign: 'center',
      padding: isSmallMobile ? '1rem' : '2rem',
      color: '#64748b',
      fontSize: isSmallMobile ? '0.8rem' : '0.9rem'
    },
    statusBadge: {
      padding: isSmallMobile ? '2px 8px' : '4px 12px',
      borderRadius: '20px',
      fontSize: isSmallMobile ? '0.7rem' : '0.8rem',
      display: 'inline-block',
      whiteSpace: 'nowrap'
    },
    deleteButton: {
      background: '#ef4444',
      color: 'white',
      border: 'none',
      padding: isSmallMobile ? '4px 8px' : '5px 12px',
      borderRadius: '5px',
      cursor: 'pointer',
      transition: 'all 0.3s',
      fontSize: isSmallMobile ? '0.7rem' : '0.8rem',
      whiteSpace: 'nowrap'
    },
    cardView: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.8rem'
    },
    readingCard: {
      background: '#f8fafc',
      borderRadius: '10px',
      padding: '0.8rem',
      borderBottom: '1px solid #e2e8f0'
    },
    cardRow: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '0.5rem',
      flexWrap: 'wrap',
      gap: '0.5rem'
    },
    cardLabel: {
      fontWeight: '600',
      color: '#4b5563',
      fontSize: '0.75rem'
    },
    cardValue: {
      fontSize: '0.85rem'
    },
    cardActions: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginTop: '0.5rem'
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    const statusLower = (status || 'normal').toLowerCase();
    if (statusLower.includes('normal')) return '#10b981';
    if (statusLower.includes('elevated')) return '#f59e0b';
    if (statusLower.includes('high')) return '#ef4444';
    return '#6b7280';
  };

  // Card view for mobile (shows less columns)
  const renderMobileCardView = () => {
    const displayReadings = (readings || []).slice(0, 10);
    
    return (
      <div style={styles.cardView}>
        {displayReadings.map((r, index) => {
          const readingId = r._id || r.id || index;
          const statusColor = getStatusColor(r.status);
          
          return (
            <div key={readingId} style={styles.readingCard}>
              <div style={styles.cardRow}>
                <span style={styles.cardLabel}> Date</span>
                <span style={styles.cardValue}>{new Date(r.date).toLocaleString()}</span>
              </div>
              <div style={styles.cardRow}>
                <span style={styles.cardLabel}> BP Reading</span>
                <span style={styles.cardValue}>{r.systolic}/{r.diastolic} mmHg</span>
              </div>
              <div style={styles.cardRow}>
                <span style={styles.cardLabel}> Heart Rate</span>
                <span style={styles.cardValue}>{r.heartRate || '-'} BPM</span>
              </div>
              <div style={styles.cardRow}>
                <span style={styles.cardLabel}> Status</span>
                <span style={{ ...styles.statusBadge, background: `${statusColor}20`, color: statusColor }}>
                  {r.status || 'Normal'}
                </span>
              </div>
              <div style={styles.cardActions}>
                <button 
                  onClick={() => onDelete(readingId)} 
                  style={styles.deleteButton}
                  onMouseEnter={(e) => e.target.style.background = '#dc2626'}
                  onMouseLeave={(e) => e.target.style.background = '#ef4444'}
                >
                  <i className="fas fa-trash"></i> Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Table view for desktop
  const renderTableView = () => {
    const displayReadings = (readings || []).slice(0, 10);
    
    return (
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Date</th>
            <th style={styles.th}>Systolic</th>
            <th style={styles.th}>Diastolic</th>
            <th style={styles.th}>Heart Rate</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {displayReadings.map((r, index) => {
            const readingId = r._id || r.id || index;
            const statusColor = getStatusColor(r.status);
            
            return (
              <tr key={readingId}>
                <td style={styles.td}>{new Date(r.date).toLocaleString()}</td>
                <td style={styles.td}>{r.systolic}</td>
                <td style={styles.td}>{r.diastolic}</td>
                <td style={styles.td}>{r.heartRate || '-'}</td>
                <td style={styles.td}>
                  <span style={{ ...styles.statusBadge, background: `${statusColor}20`, color: statusColor }}>
                    {r.status || 'Normal'}
                  </span>
                </td>
                <td style={styles.td}>
                  <button 
                    onClick={() => onDelete(readingId)} 
                    style={styles.deleteButton}
                    onMouseEnter={(e) => e.target.style.background = '#dc2626'}
                    onMouseLeave={(e) => e.target.style.background = '#ef4444'}
                  >
                    <i className="fas fa-trash"></i> Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  return (
    <div className="readings-history" style={styles.container}>
      <h2 style={styles.title}>
        <i className="fas fa-history"></i> Recent Readings
      </h2>
      <div className="table-container">
        {!readings || readings.length === 0 ? (
          <div style={styles.emptyMessage}>
            <i className="fas fa-clipboard-list" style={{ fontSize: '2rem', marginBottom: '0.5rem', display: 'block', opacity: 0.5 }}></i>
            No readings yet. Add your first reading!
          </div>
        ) : (
          isMobile ? renderMobileCardView() : renderTableView()
        )}
      </div>
    </div>
  );
};

export default RecentReadings;