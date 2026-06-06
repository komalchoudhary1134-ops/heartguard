import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getReadings, getStats } from '../../services/api';
import { getAverageBP } from '../../utils/helpers';

const Insights = () => {
  const { user } = useAuth();
  const [readings, setReadings] = useState([]);
  const [stats, setStats] = useState({ avgSys: 0, avgDia: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  // Check screen size for responsive layout
  const [isMobile, setIsMobile] = useState(false);
  const [isSmallMobile, setIsSmallMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
      setIsSmallMobile(window.innerWidth <= 480);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Load data from backend
  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [readingsData, statsData] = await Promise.all([
        getReadings(),
        getStats()
      ]);
      setReadings(readingsData || []);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading insights data:', error);
      setReadings([]);
    } finally {
      setLoading(false);
    }
  };

  const { avgSys, avgDia } = getAverageBP(readings);
  
  const getFilteredReadings = () => {
    const now = new Date();
    const filtered = readings.filter(r => {
      const date = new Date(r.date);
      if (selectedPeriod === 'week') {
        const weekAgo = new Date(now);
        weekAgo.setDate(now.getDate() - 7);
        return date > weekAgo;
      } else if (selectedPeriod === 'month') {
        const monthAgo = new Date(now);
        monthAgo.setMonth(now.getMonth() - 1);
        return date > monthAgo;
      }
      return true;
    });
    return filtered;
  };

  const filteredReadings = getFilteredReadings();
  const periodAvg = getAverageBP(filteredReadings);
  
  const last7 = readings.slice(0, 7);
  const weekAvg = last7.length ? {
    sys: Math.round(last7.reduce((s, r) => s + r.systolic, 0) / last7.length),
    dia: Math.round(last7.reduce((s, r) => s + r.diastolic, 0) / last7.length)
  } : { sys: 0, dia: 0 };

  const normalCount = readings.filter(r => r.status === 'Normal').length;
  const elevatedCount = readings.filter(r => r.status === 'Elevated').length;
  const highCount = readings.filter(r => r.status && r.status.includes('High')).length;

  let risk = 'Low';
  let riskColor = '#10b981';
  let riskMsg = 'Your blood pressure is in good range. Keep it up!';
  let riskIcon = '✅';
  
  if (stats.avgSys >= 140 || stats.avgDia >= 90) {
    risk = 'High';
    riskColor = '#ef4444';
    riskMsg = 'Consult your doctor immediately!';
    riskIcon = '🚨';
  } else if (stats.avgSys >= 130 || stats.avgDia >= 80) {
    risk = 'Moderate';
    riskColor = '#f97316';
    riskMsg = 'Lifestyle changes recommended.';
    riskIcon = '⚠️';
  } else if (stats.avgSys >= 120) {
    risk = 'Mild';
    riskColor = '#f59e0b';
    riskMsg = 'Monitor regularly and reduce salt.';
    riskIcon = '📊';
  }

  // Doctor Advice based on readings
  const getDoctorAdvice = () => {
    if (readings.length === 0) {
      return {
        title: 'Start Tracking',
        message: 'Add your first BP reading to get personalized doctor advice.',
        icon: '📝'
      };
    }
    
    if (stats.avgSys >= 140 || stats.avgDia >= 90) {
      return {
        title: 'Immediate Attention Needed',
        message: 'Your BP is consistently high. Please consult a doctor this week.',
        icon: '🏥'
      };
    } else if (stats.avgSys >= 130 || stats.avgDia >= 80) {
      return {
        title: 'Consult Recommended',
        message: 'Your BP is in the elevated range. Schedule a checkup with your doctor.',
        icon: '👨‍⚕️'
      };
    } else {
      return {
        title: 'Keep Up the Good Work',
        message: 'Your BP is well managed. Continue with regular monitoring.',
        icon: '💪'
      };
    }
  };

  const doctorAdvice = getDoctorAdvice();

  let recommendations = [];
  if (readings.length === 0) {
    recommendations = ['📊 Start tracking your blood pressure to get personalized insights.'];
  } else {
    if (stats.avgSys > 130) {
      recommendations.push('⚠️ Your average blood pressure is above normal range. Consider consulting a doctor.');
      recommendations.push('🥗 Reduce sodium intake and increase physical activity.');
    } else {
      recommendations.push('✅ Your blood pressure is well maintained! Keep up the healthy habits.');
    }
    recommendations.push('💪 Regular exercise and stress management can help maintain healthy blood pressure.');
    recommendations.push('🍎 Eat a balanced diet rich in fruits, vegetables, and whole grains.');
  }

  // Calendar functions
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };
  
  const getReadingForDate = (year, month, day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const reading = readings.find(r => new Date(r.date).toISOString().split('T')[0] === dateStr);
    return reading;
  };
  
  const getReadingColor = (reading) => {
    if (!reading) return '#e2e8f0';
    if (reading.status === 'Normal') return '#10b981';
    if (reading.status === 'Elevated') return '#f59e0b';
    return '#ef4444';
  };
  
  const getBPValue = (reading) => {
    if (!reading) return '--/--';
    return `${reading.systolic}/${reading.diastolic}`;
  };
  
  const prevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };
  
  const nextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };
  
  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
    const firstDay = getFirstDayOfMonth(selectedYear, selectedMonth);
    const calendarDays = [];
    
    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(
        <div key={`empty-${i}`} style={{ 
          padding: isSmallMobile ? '4px' : '8px', 
          background: '#f8fafc', 
          borderRadius: '8px', 
          minHeight: isSmallMobile ? '50px' : '70px' 
        }}></div>
      );
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const reading = getReadingForDate(selectedYear, selectedMonth, day);
      const color = getReadingColor(reading);
      const bpValue = getBPValue(reading);
      
      calendarDays.push(
        <div 
          key={day} 
          style={{ 
            padding: isSmallMobile ? '4px' : '8px', 
            background: color, 
            borderRadius: '8px', 
            minHeight: isSmallMobile ? '50px' : '70px',
            color: reading ? 'white' : '#475569',
            cursor: reading ? 'pointer' : 'default'
          }}
          title={reading ? `${reading.status}: ${bpValue}` : 'No reading'}
        >
          <div style={{ fontWeight: 'bold', fontSize: isSmallMobile ? '0.7rem' : '0.9rem' }}>{day}</div>
          {reading && (
            <div style={{ fontSize: isSmallMobile ? '0.6rem' : '0.7rem', marginTop: isSmallMobile ? '2px' : '4px' }}>
              {bpValue}
            </div>
          )}
        </div>
      );
    }
    
    return calendarDays;
  };

  if (loading) {
    return <div style={{ padding: '1rem', textAlign: 'center', fontSize: isMobile ? '0.85rem' : '1rem' }}>Loading insights...</div>;
  }

  // Responsive styles
  const styles = {
    container: { padding: isMobile ? '0.5rem' : '0' },
    topBar: {
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      justifyContent: 'space-between',
      alignItems: isMobile ? 'flex-start' : 'center',
      gap: isMobile ? '0.5rem' : '0',
      marginBottom: isMobile ? '1rem' : '1.5rem'
    },
    title: { fontSize: isSmallMobile ? '1.2rem' : (isMobile ? '1.3rem' : '1.5rem') },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: isSmallMobile ? '1fr' : (isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)'),
      gap: isMobile ? '0.8rem' : '1rem',
      marginBottom: isMobile ? '1rem' : '1.5rem'
    },
    periodSelector: {
      display: 'flex',
      gap: isMobile ? '0.5rem' : '1rem',
      marginBottom: isMobile ? '1rem' : '2rem',
      flexWrap: 'wrap'
    },
    periodBtn: (isActive) => ({
      padding: isSmallMobile ? '0.4rem 0.8rem' : (isMobile ? '0.4rem 0.8rem' : '0.5rem 1rem'),
      borderRadius: '20px',
      border: 'none',
      background: isActive ? '#dc2626' : '#e2e8f0',
      color: isActive ? 'white' : '#475569',
      cursor: 'pointer',
      fontSize: isSmallMobile ? '0.7rem' : (isMobile ? '0.75rem' : '0.85rem'),
      flex: isSmallMobile ? 1 : 'auto'
    }),
    card: {
      background: 'white',
      borderRadius: '15px',
      padding: isSmallMobile ? '1rem' : (isMobile ? '1.2rem' : '1.5rem'),
      marginBottom: isMobile ? '1rem' : '2rem',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
    },
    twoColumn: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
      gap: isMobile ? '1rem' : '1.5rem',
      marginBottom: isMobile ? '1rem' : '2rem'
    },
    calendarHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1rem',
      flexWrap: 'wrap',
      gap: '0.5rem'
    },
    calendarGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: isSmallMobile ? '4px' : '8px'
    },
    quickTipsGrid: {
      display: 'grid',
      gridTemplateColumns: isSmallMobile ? '1fr' : (isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)'),
      gap: '0.8rem'
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div className="top-bar" style={styles.topBar}>
        <h1 style={styles.title}>Health Insights</h1>
        <div className="user-info" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>{user?.name?.split(' ')[0] || 'Guest'}</span>
          <i className="fas fa-user-circle"></i>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid" style={styles.statsGrid}>
        <div className="stat-card-dashboard" style={{ background: 'white', padding: isSmallMobile ? '0.8rem' : '1rem', borderRadius: '15px' }}>
          <div className="stat-icon"><i className="fas fa-chart-line"></i></div>
          <div className="stat-info">
            <h3 style={{ fontSize: isSmallMobile ? '0.7rem' : '0.8rem' }}>Overall Avg</h3>
            <p style={{ fontSize: isSmallMobile ? '1.1rem' : '1.3rem', fontWeight: 'bold' }}>{stats.avgSys || '--'}/{stats.avgDia || '--'}</p>
            <small>mmHg</small>
          </div>
        </div>
        <div className="stat-card-dashboard" style={{ background: 'white', padding: isSmallMobile ? '0.8rem' : '1rem', borderRadius: '15px' }}>
          <div className="stat-icon"><i className="fas fa-calendar-week"></i></div>
          <div className="stat-info">
            <h3 style={{ fontSize: isSmallMobile ? '0.7rem' : '0.8rem' }}>Weekly Avg</h3>
            <p style={{ fontSize: isSmallMobile ? '1.1rem' : '1.3rem', fontWeight: 'bold' }}>{weekAvg.sys}/{weekAvg.dia}</p>
            <small>Last 7 days</small>
          </div>
        </div>
        <div className="stat-card-dashboard" style={{ background: 'white', padding: isSmallMobile ? '0.8rem' : '1rem', borderRadius: '15px' }}>
          <div className="stat-icon"><i className="fas fa-chart-pie"></i></div>
          <div className="stat-info">
            <h3 style={{ fontSize: isSmallMobile ? '0.7rem' : '0.8rem' }}>Total Readings</h3>
            <p style={{ fontSize: isSmallMobile ? '1.1rem' : '1.3rem', fontWeight: 'bold' }}>{stats.total || 0}</p>
            <small>All time</small>
          </div>
        </div>
        <div className="stat-card-dashboard" style={{ background: 'white', padding: isSmallMobile ? '0.8rem' : '1rem', borderRadius: '15px' }}>
          <div className="stat-icon"><i className="fas fa-heartbeat"></i></div>
          <div className="stat-info">
            <h3 style={{ fontSize: isSmallMobile ? '0.7rem' : '0.8rem' }}>BP Status</h3>
            <p style={{ fontSize: isSmallMobile ? '1rem' : '1.2rem', fontWeight: 'bold', color: riskColor }}>{risk}</p>
            <small>{readings.length} readings</small>
          </div>
        </div>
      </div>

      {/* Period Selector */}
      <div style={styles.periodSelector}>
        <button onClick={() => setSelectedPeriod('week')} style={styles.periodBtn(selectedPeriod === 'week')}>Last 7 Days</button>
        <button onClick={() => setSelectedPeriod('month')} style={styles.periodBtn(selectedPeriod === 'month')}>Last 30 Days</button>
        <button onClick={() => setSelectedPeriod('all')} style={styles.periodBtn(selectedPeriod === 'all')}>All Time</button>
      </div>

      {/* AI Recommendations Card */}
      <div style={styles.card}>
        <h2 style={{ fontSize: isMobile ? '1.1rem' : '1.3rem', marginBottom: '1rem' }}>
          <i className="fas fa-robot" style={{ color: '#dc2626' }}></i> AI Health Recommendations
        </h2>
        <div style={{ background: '#f8fafc', padding: isMobile ? '0.8rem' : '1rem', borderRadius: '10px' }}>
          {recommendations.map((rec, i) => (
            <p key={i} style={{ margin: '0.5rem 0', padding: '0.3rem 0', borderBottom: i !== recommendations.length - 1 ? '1px solid #e2e8f0' : 'none', fontSize: isMobile ? '0.85rem' : '0.95rem' }}>
              <i className="fas fa-lightbulb" style={{ color: '#f59e0b', marginRight: '0.5rem' }}></i> {rec}
            </p>
          ))}
        </div>
      </div>

      {/* Doctor Advice Card */}
      <div style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', borderRadius: '15px', padding: isMobile ? '1rem' : '1.5rem', marginBottom: isMobile ? '1rem' : '2rem', color: 'white' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: isMobile ? '1.5rem' : '2rem' }}>{doctorAdvice.icon}</span>
          <h2 style={{ fontSize: isMobile ? '1.1rem' : '1.3rem', margin: 0 }}>{doctorAdvice.title}</h2>
        </div>
        <p style={{ marginBottom: 0, fontSize: isMobile ? '0.85rem' : '1rem' }}>{doctorAdvice.message}</p>
      </div>

      {/* Two Column Layout */}
      <div style={styles.twoColumn}>
        {/* Risk Assessment */}
        <div style={styles.card}>
          <h3 style={{ fontSize: isMobile ? '1rem' : '1.1rem' }}>
            <i className="fas fa-exclamation-triangle" style={{ color: '#f59e0b' }}></i> Risk Assessment
          </h3>
          <div style={{ textAlign: 'center', padding: '0.5rem' }}>
            <div style={{ fontSize: isMobile ? '2rem' : '2.5rem' }}>{riskIcon}</div>
            <p style={{ fontSize: isMobile ? '1.2rem' : '1.5rem', fontWeight: 'bold', color: riskColor }}>{risk} Risk</p>
            <p style={{ fontSize: isMobile ? '0.85rem' : '1rem' }}>{riskMsg}</p>
            <div style={{ marginTop: '1rem', padding: '0.5rem', background: '#f8fafc', borderRadius: '10px' }}>
              <small>Based on {stats.total || 0} reading{stats.total !== 1 ? 's' : ''}</small>
            </div>
          </div>
        </div>

        {/* Period Average */}
        <div style={styles.card}>
          <h3 style={{ fontSize: isMobile ? '1rem' : '1.1rem' }}>
            <i className="fas fa-chart-simple" style={{ color: '#3b82f6' }}></i> {selectedPeriod === 'week' ? 'Weekly' : selectedPeriod === 'month' ? 'Monthly' : 'Overall'} Average
          </h3>
          <div style={{ textAlign: 'center', padding: '0.5rem' }}>
            <p style={{ fontSize: isMobile ? '1.8rem' : '2.5rem', fontWeight: 'bold' }}>{periodAvg.avgSys || '--'}/{periodAvg.avgDia || '--'}</p>
            <p>mmHg</p>
            <div style={{ marginTop: '1rem', padding: '0.5rem', background: '#f8fafc', borderRadius: '10px' }}>
              <small>Based on {filteredReadings.length} reading{filteredReadings.length !== 1 ? 's' : ''}</small>
            </div>
          </div>
        </div>
      </div>

      {/* BP Calendar View */}
      <div style={styles.card}>
        <div style={styles.calendarHeader}>
          <h2 style={{ fontSize: isMobile ? '1.1rem' : '1.3rem', margin: 0 }}>
            <i className="fas fa-calendar-alt" style={{ color: '#dc2626' }}></i> BP Calendar View
          </h2>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={prevMonth} style={{ background: '#dc2626', color: 'white', border: 'none', padding: isSmallMobile ? '4px 8px' : '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: isSmallMobile ? '0.7rem' : '0.8rem' }}>
              <i className="fas fa-chevron-left"></i> Prev
            </button>
            <span style={{ padding: isSmallMobile ? '4px 8px' : '6px 12px', background: '#f8fafc', borderRadius: '6px', fontWeight: '500', fontSize: isSmallMobile ? '0.75rem' : '0.85rem' }}>
              {months[selectedMonth]} {selectedYear}
            </span>
            <button onClick={nextMonth} style={{ background: '#dc2626', color: 'white', border: 'none', padding: isSmallMobile ? '4px 8px' : '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: isSmallMobile ? '0.7rem' : '0.8rem' }}>
              Next <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
        
        {/* Calendar Legend */}
        <div style={{ display: 'flex', gap: isSmallMobile ? '0.5rem' : '1rem', marginBottom: '1rem', flexWrap: 'wrap', padding: '0.5rem', background: '#f8fafc', borderRadius: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <div style={{ width: isSmallMobile ? '15px' : '20px', height: isSmallMobile ? '15px' : '20px', background: '#10b981', borderRadius: '4px' }}></div>
            <span style={{ fontSize: isSmallMobile ? '0.7rem' : '0.8rem' }}>Normal</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <div style={{ width: isSmallMobile ? '15px' : '20px', height: isSmallMobile ? '15px' : '20px', background: '#f59e0b', borderRadius: '4px' }}></div>
            <span style={{ fontSize: isSmallMobile ? '0.7rem' : '0.8rem' }}>Elevated</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <div style={{ width: isSmallMobile ? '15px' : '20px', height: isSmallMobile ? '15px' : '20px', background: '#ef4444', borderRadius: '4px' }}></div>
            <span style={{ fontSize: isSmallMobile ? '0.7rem' : '0.8rem' }}>High</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <div style={{ width: isSmallMobile ? '15px' : '20px', height: isSmallMobile ? '15px' : '20px', background: '#e2e8f0', borderRadius: '4px' }}></div>
            <span style={{ fontSize: isSmallMobile ? '0.7rem' : '0.8rem' }}>No Reading</span>
          </div>
        </div>
        
        {/* Weekday Headers */}
        <div style={styles.calendarGrid}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} style={{ textAlign: 'center', fontWeight: 'bold', padding: isSmallMobile ? '4px' : '8px', background: '#f1f5f9', borderRadius: '8px', fontSize: isSmallMobile ? '0.7rem' : '0.85rem' }}>
              {isSmallMobile ? day.charAt(0) : day}
            </div>
          ))}
        </div>
        
        {/* Calendar Days */}
        <div style={styles.calendarGrid}>
          {renderCalendar()}
        </div>
        
        <p style={{ fontSize: isSmallMobile ? '0.6rem' : '0.7rem', color: '#64748b', marginTop: '1rem', textAlign: 'center' }}>
          <i className="fas fa-info-circle"></i> Colored days show BP readings. Hover to see details.
        </p>
      </div>

      {/* BP Categories and Distribution */}
      <div style={styles.twoColumn}>
        {/* BP Categories Guide */}
        <div style={styles.card}>
          <h3 style={{ fontSize: isMobile ? '1rem' : '1.1rem' }}>
            <i className="fas fa-heartbeat" style={{ color: '#dc2626' }}></i> BP Categories Guide
          </h3>
          <div style={{ background: '#d1fae5', padding: isSmallMobile ? '0.4rem' : '0.6rem', borderRadius: '8px', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', fontSize: isSmallMobile ? '0.75rem' : '0.85rem' }}>
            <span>🟢 Normal</span><span>&lt; 120/80</span>
          </div>
          <div style={{ background: '#fed7aa', padding: isSmallMobile ? '0.4rem' : '0.6rem', borderRadius: '8px', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', fontSize: isSmallMobile ? '0.75rem' : '0.85rem' }}>
            <span>🟡 Elevated</span><span>120-129/&lt;80</span>
          </div>
          <div style={{ background: '#fecaca', padding: isSmallMobile ? '0.4rem' : '0.6rem', borderRadius: '8px', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', fontSize: isSmallMobile ? '0.75rem' : '0.85rem' }}>
            <span>🔴 Stage 1</span><span>130-139/80-89</span>
          </div>
          <div style={{ background: '#fecaca', padding: isSmallMobile ? '0.4rem' : '0.6rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', fontSize: isSmallMobile ? '0.75rem' : '0.85rem' }}>
            <span>🔴 Stage 2</span><span>≥140/≥90</span>
          </div>
        </div>

        {/* Your BP Distribution */}
        {readings.length > 0 && (
          <div style={styles.card}>
            <h3 style={{ fontSize: isMobile ? '1rem' : '1.1rem' }}>
              <i className="fas fa-chart-pie" style={{ color: '#8b5cf6' }}></i> Your BP Distribution
            </h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <div style={{ flex: 1, textAlign: 'center', background: '#d1fae5', padding: isSmallMobile ? '0.4rem' : '0.6rem', borderRadius: '10px' }}>
                <div style={{ fontSize: isSmallMobile ? '0.7rem' : '0.8rem' }}>🟢 Normal</div>
                <div style={{ fontSize: isSmallMobile ? '1rem' : '1.3rem', fontWeight: 'bold' }}>{normalCount}</div>
              </div>
              <div style={{ flex: 1, textAlign: 'center', background: '#fed7aa', padding: isSmallMobile ? '0.4rem' : '0.6rem', borderRadius: '10px' }}>
                <div style={{ fontSize: isSmallMobile ? '0.7rem' : '0.8rem' }}>🟡 Elevated</div>
                <div style={{ fontSize: isSmallMobile ? '1rem' : '1.3rem', fontWeight: 'bold' }}>{elevatedCount}</div>
              </div>
              <div style={{ flex: 1, textAlign: 'center', background: '#fecaca', padding: isSmallMobile ? '0.4rem' : '0.6rem', borderRadius: '10px' }}>
                <div style={{ fontSize: isSmallMobile ? '0.7rem' : '0.8rem' }}>🔴 High</div>
                <div style={{ fontSize: isSmallMobile ? '1rem' : '1.3rem', fontWeight: 'bold' }}>{highCount}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Health Tips */}
      <div style={styles.card}>
        <h3 style={{ fontSize: isMobile ? '1rem' : '1.1rem' }}>
          <i className="fas fa-lightbulb" style={{ color: '#f59e0b' }}></i> Quick Health Tips
        </h3>
        <div style={styles.quickTipsGrid}>
          <p style={{ fontSize: isMobile ? '0.8rem' : '0.85rem', margin: '0.3rem 0' }}>
            <i className="fas fa-clock" style={{ color: '#3b82f6', width: '25px' }}></i> Measure at same time daily
          </p>
          <p style={{ fontSize: isMobile ? '0.8rem' : '0.85rem', margin: '0.3rem 0' }}>
            <i className="fas fa-utensils" style={{ color: '#10b981', width: '25px' }}></i> Reduce salt - use herbs
          </p>
          <p style={{ fontSize: isMobile ? '0.8rem' : '0.85rem', margin: '0.3rem 0' }}>
            <i className="fas fa-tint" style={{ color: '#06b6d4', width: '25px' }}></i> Drink 8-10 glasses water
          </p>
          <p style={{ fontSize: isMobile ? '0.8rem' : '0.85rem', margin: '0.3rem 0' }}>
            <i className="fas fa-walking" style={{ color: '#f59e0b', width: '25px' }}></i> Walk 30 minutes daily
          </p>
          <p style={{ fontSize: isMobile ? '0.8rem' : '0.85rem', margin: '0.3rem 0' }}>
            <i className="fas fa-bed" style={{ color: '#8b5cf6', width: '25px' }}></i> Sleep 7-8 hours nightly
          </p>
          <p style={{ fontSize: isMobile ? '0.8rem' : '0.85rem', margin: '0.3rem 0' }}>
            <i className="fas fa-hand-peace" style={{ color: '#ef4444', width: '25px' }}></i> Meditate to reduce stress
          </p>
        </div>
      </div>
    </div>
  );
};

export default Insights;