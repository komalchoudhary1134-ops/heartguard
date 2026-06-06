import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getReadings, addReading as apiAddReading, deleteReading as apiDeleteReading, getStats } from '../../services/api';
import StatsCard from './StatsCard';
import AddReading from './AddReading';
import BPChart from './BPChart';
import RecentReadings from './RecentReading';

const Dashboard = () => {
  const { user } = useAuth();
  const [readings, setReadings] = useState([]);
  const [stats, setStats] = useState({ avgSys: 0, avgDia: 0, total: 0, latest: null });
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  // Check screen size for responsive layout
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
  const isSmallMobile = typeof window !== 'undefined' && window.innerWidth <= 480;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      console.log('🔄 Loading dashboard data...');
      
      const [readingsData, statsData] = await Promise.all([
        getReadings(),
        getStats()
      ]);
      
      console.log('📊 Readings count:', readingsData?.length || 0);
      console.log('📈 Stats:', statsData);
      
      setReadings(Array.isArray(readingsData) ? readingsData : []);
      setStats(statsData || { avgSys: 0, avgDia: 0, total: 0, latest: null });
      
    } catch (error) {
      console.error('❌ Load error:', error);
      setReadings([]);
    } finally {
      setLoading(false);
    }
  };

  const addReading = async (readingData) => {
    if (isAdding) return;
    setIsAdding(true);
    
    try {
      console.log('➕ Adding reading:', readingData);
      const result = await apiAddReading(readingData);
      console.log('✅ Add result:', result);
      
      if (result.success) {
        await loadData();
      } else {
        alert(result.message || 'Failed to add reading');
      }
    } catch (error) {
      console.error('❌ Add error:', error);
      alert('Failed to add reading');
    } finally {
      setIsAdding(false);
    }
  };

  const deleteReading = async (id) => {
    try {
      console.log('🗑️ Deleting:', id);
      const result = await apiDeleteReading(id);
      console.log('✅ Delete result:', result);
      
      if (result.success) {
        await loadData();
      }
    } catch (error) {
      console.error('❌ Delete error:', error);
      alert('Failed to delete reading');
    }
  };

  const statCards = [
    { icon: 'fas fa-tachometer-alt', label: 'Latest Reading', value: stats.latest ? `${stats.latest.systolic}/${stats.latest.diastolic}` : '--/--', sub: '' },
    { icon: 'fas fa-chart-line', label: 'Average SYS', value: stats.avgSys || '--', sub: 'mmHg' },
    { icon: 'fas fa-heart', label: 'Average DIA', value: stats.avgDia || '--', sub: 'mmHg' },
    { icon: 'fas fa-flag-checkered', label: 'Total Readings', value: stats.total || 0, sub: 'Total' }
  ];

  // Responsive styles
  const styles = {
    loadingContainer: {
      padding: isSmallMobile ? '1rem' : '2rem',
      textAlign: 'center',
      fontSize: isSmallMobile ? '0.85rem' : '1rem'
    },
    topBar: {
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      justifyContent: 'space-between',
      alignItems: isMobile ? 'flex-start' : 'center',
      gap: isMobile ? '0.5rem' : '0',
      marginBottom: isMobile ? '1rem' : '1.5rem',
      padding: isSmallMobile ? '0.5rem' : '0'
    },
    title: {
      fontSize: isSmallMobile ? '1.2rem' : (isMobile ? '1.3rem' : '1.5rem'),
      margin: 0
    },
    userInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      fontSize: isSmallMobile ? '0.85rem' : '0.9rem',
      background: isMobile ? '#f3f4f6' : 'transparent',
      padding: isMobile ? '0.3rem 0.8rem' : '0',
      borderRadius: '20px'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: isSmallMobile ? 'repeat(2, 1fr)' : (isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)'),
      gap: isSmallMobile ? '0.8rem' : (isMobile ? '1rem' : '1.5rem'),
      marginBottom: isMobile ? '1rem' : '1.5rem'
    },
    trackerSection: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
      gap: isMobile ? '1rem' : '1.5rem',
      marginBottom: isMobile ? '1rem' : '1.5rem'
    }
  };

  if (loading) {
    return <div style={styles.loadingContainer}>Loading dashboard...</div>;
  }

  return (
    <div>
      <div className="top-bar" style={styles.topBar}>
        <h1 style={styles.title}>Blood Pressure Tracker</h1>
        <div className="user-info" style={styles.userInfo}>
          <span>{user?.name?.split(' ')[0] || 'Guest'}</span>
          <i className="fas fa-user-circle"></i>
        </div>
      </div>

      <div className="stats-grid" style={styles.statsGrid}>
        {statCards.map((card, i) => <StatsCard key={i} {...card} />)}
      </div>

      <div className="tracker-section" style={styles.trackerSection}>
        <AddReading onAdd={addReading} />
        <BPChart readings={readings} />
      </div>

      <RecentReadings readings={readings} onDelete={deleteReading} />
    </div>
  );
};

export default Dashboard;