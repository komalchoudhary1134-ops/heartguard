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

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading dashboard...</div>;
  }

  return (
    <div>
      <div className="top-bar">
        <h1>Blood Pressure Tracker</h1>
        <div className="user-info">
          <span>{user?.name?.split(' ')[0] || 'Guest'}</span>
          <i className="fas fa-user-circle"></i>
        </div>
      </div>

      <div className="stats-grid">
        {statCards.map((card, i) => <StatsCard key={i} {...card} />)}
      </div>

      <div className="tracker-section">
        <AddReading onAdd={addReading} />
        <BPChart readings={readings} />
      </div>

      <RecentReadings readings={readings} onDelete={deleteReading} />
    </div>
  );
};

export default Dashboard;