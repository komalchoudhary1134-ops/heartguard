import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getReadings, getHealthData, updateBMI, updateWaterIntake, updateChallenge } from '../../services/api';

const HealthyTips = () => {
  const { user } = useAuth();
  const [readings, setReadings] = useState([]);
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // BMI State
  const [bmiHeight, setBmiHeight] = useState('');
  const [bmiWeight, setBmiWeight] = useState('');
  const [bmiResult, setBmiResult] = useState(null);
  
  // Water Tracker State
  const [waterCount, setWaterCount] = useState(0);
  
  // Weekly Challenge State
  const [completedDays, setCompletedDays] = useState([]);
  const [showCelebration, setShowCelebration] = useState(false);
  
  const [dailyTip, setDailyTip] = useState('');

  // Load data from backend
  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [readingsData, healthDataRes] = await Promise.all([
        getReadings(),
        getHealthData()
      ]);
      
      setReadings(readingsData || []);
      setHealthData(healthDataRes);
      
      // Load water count
      if (healthDataRes?.waterIntake?.count !== undefined) {
        setWaterCount(healthDataRes.waterIntake.count);
      }
      
      // Load challenge completed days
      if (healthDataRes?.weeklyChallenge?.completedDays) {
        setCompletedDays(healthDataRes.weeklyChallenge.completedDays);
      }
      
      // Load BMI if exists
      if (healthDataRes?.bmi?.value) {
        setBmiResult({
          value: healthDataRes.bmi.value,
          category: healthDataRes.bmi.category,
          color: '#10b981',
          advice: 'Saved in database'
        });
        setBmiHeight(healthDataRes.bmi.height || '');
        setBmiWeight(healthDataRes.bmi.weight || '');
      }
      
    } catch (error) {
      console.error('Error loading health data:', error);
    } finally {
      setLoading(false);
    }
  };

  const dailyTips = [
    "💊 Take medicines at the same time daily for better results",
    "🥗 One banana a day can help lower blood pressure",
    "🚶 30 minutes of walking reduces BP by 4-9 mmHg",
    "💧 Dehydration can cause blood pressure to drop",
    "😴 Lack of sleep can increase blood pressure",
    "🧘 10 minutes of meditation reduces stress and BP",
    "🍎 An apple a day keeps the doctor away!",
  ];

  const weeklyChallenges = [
    { day: 1, task: 'Drink 8 glasses of water', icon: '💧' },
    { day: 2, task: 'Walk for 30 minutes', icon: '🚶' },
    { day: 3, task: 'Avoid salt in one meal', icon: '🧂' },
    { day: 4, task: 'Eat one banana or fruit', icon: '🍌' },
    { day: 5, task: 'Meditate for 10 minutes', icon: '🧘' },
    { day: 6, task: 'Sleep 7-8 hours', icon: '😴' },
    { day: 7, task: 'Check and log your BP', icon: '❤️' }
  ];

  useEffect(() => {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
    const tipIndex = dayOfYear % dailyTips.length;
    setDailyTip(dailyTips[tipIndex]);
  }, []);

  useEffect(() => {
    if (completedDays.length === 7 && !showCelebration) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 5000);
    }
  }, [completedDays]);

  const foodTips = [
    { name: 'Leafy greens (Spinach, Kale)', category: 'eat', desc: 'Rich in potassium - helps lower BP' },
    { name: 'Berries (Blueberries, Strawberries)', category: 'eat', desc: 'High in antioxidants' },
    { name: 'Bananas', category: 'eat', desc: 'Rich in potassium' },
    { name: 'Beetroot', category: 'eat', desc: 'Contains nitrates' },
    { name: 'Oats & Whole grains', category: 'eat', desc: 'High in fiber' },
    { name: 'Fatty fish (Salmon, Mackerel)', category: 'eat', desc: 'Rich in omega-3' },
    { name: 'Nuts & seeds', category: 'eat', desc: 'Healthy fats' },
    { name: 'Garlic & Turmeric', category: 'eat', desc: 'Helps relax blood vessels' },
    { name: 'Avocados', category: 'eat', desc: 'Rich in potassium' },
    { name: 'Processed foods', category: 'avoid', desc: 'High in sodium' },
    { name: 'Fast food', category: 'avoid', desc: 'High in salt' },
    { name: 'Canned soups', category: 'avoid', desc: 'Very high sodium' },
    { name: 'Red meat', category: 'avoid', desc: 'High in saturated fat' },
    { name: 'Sugary beverages', category: 'avoid', desc: 'Increases obesity risk' },
    { name: 'Alcohol', category: 'avoid', desc: 'Can raise BP' },
    { name: 'Excess caffeine', category: 'avoid', desc: 'Temporary spikes' },
  ];

  const filteredTips = foodTips.filter(tip => 
    tip.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (activeCategory === 'all' || tip.category === activeCategory)
  );

  const exercises = [
    { name: 'Brisk Walking', duration: '30 min daily', effect: 'Reduces BP by 4-9 mmHg', icon: 'fas fa-walking' },
    { name: 'Swimming', duration: '30 min, 3-4/week', effect: 'Full body workout', icon: 'fas fa-swimmer' },
    { name: 'Cycling', duration: '20-30 min daily', effect: 'Strengthens heart', icon: 'fas fa-bicycle' },
    { name: 'Yoga & Meditation', duration: '15-20 min daily', effect: 'Reduces stress', icon: 'fas fa-hand-peace' },
  ];

  const lifestyleTips = [
    'Monitor BP daily at the same time',
    'Reduce salt - use herbs and spices instead',
    'Quit smoking completely',
    'Manage stress with meditation',
    'Sleep 7-8 hours every night',
    'Drink 8-10 glasses of water daily',
    'Limit caffeine intake',
    'Maintain a healthy weight',
    'Limit alcohol consumption',
    'Take medications as prescribed',
  ];

  const completeDay = async (day) => {
    if (!completedDays.includes(day)) {
      const newCompleted = [...completedDays, day];
      setCompletedDays(newCompleted);
      await updateChallenge(newCompleted);
    }
  };

  const resetChallenge = async () => {
    if (window.confirm('Reset challenge? All progress will be lost.')) {
      setCompletedDays([]);
      setShowCelebration(false);
      await updateChallenge([]);
    }
  };

  const calculateBMI = async () => {
    if (!bmiHeight || !bmiWeight) return;
    const heightInMeters = bmiHeight / 100;
    const bmi = (bmiWeight / (heightInMeters * heightInMeters)).toFixed(1);
    
    let category = '', color = '#10b981', advice = '';
    if (bmi < 18.5) {
      category = 'Underweight'; color = '#3b82f6';
      advice = 'You may need to gain weight.';
    } else if (bmi >= 18.5 && bmi <= 24.9) {
      category = 'Normal weight'; color = '#10b981';
      advice = 'Great! Maintain healthy habits.';
    } else if (bmi >= 25 && bmi <= 29.9) {
      category = 'Overweight'; color = '#f59e0b';
      advice = 'Regular exercise recommended.';
    } else {
      category = 'Obese'; color = '#ef4444';
      advice = 'Please consult a doctor.';
    }
    
    const result = { value: bmi, category, color, advice };
    setBmiResult(result);
    
    await updateBMI({
      height: parseFloat(bmiHeight),
      weight: parseFloat(bmiWeight),
      value: parseFloat(bmi),
      category
    });
  };

  const addWater = async () => {
    if (waterCount < 8) {
      const newCount = waterCount + 1;
      setWaterCount(newCount);
      await updateWaterIntake(newCount);
    }
  };
  
  const resetWater = async () => {
    setWaterCount(0);
    await updateWaterIntake(0);
  };

  const currentDayChallenge = weeklyChallenges.find(c => !completedDays.includes(c.day));

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading healthy tips...</div>;
  }

  return (
    <div>
      {showCelebration && (
        <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', padding: '2rem', borderRadius: '20px', textAlign: 'center', zIndex: 10000 }}>
          <i className="fas fa-trophy" style={{ fontSize: '3rem', marginBottom: '1rem' }}></i>
          <h2>🎉 Congratulations! 🎉</h2>
          <p>You completed the 7-day health challenge!</p>
        </div>
      )}

      <div className="top-bar">
        <h1>Healthy Living Guide</h1>
        <div className="user-info">
          <span>{user?.name?.split(' ')[0] || 'Guest'}</span>
          <i className="fas fa-user-circle"></i>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card-dashboard">
          <div className="stat-icon"><i className="fas fa-apple-alt" style={{ color: '#10b981' }}></i></div>
          <div className="stat-info"><h3>Healthy Foods</h3><p>20+</p><small>To eat</small></div>
        </div>
        <div className="stat-card-dashboard">
          <div className="stat-icon"><i className="fas fa-dumbbell" style={{ color: '#3b82f6' }}></i></div>
          <div className="stat-info"><h3>Exercises</h3><p>4+</p><small>Recommended</small></div>
        </div>
        <div className="stat-card-dashboard">
          <div className="stat-icon"><i className="fas fa-lightbulb" style={{ color: '#f59e0b' }}></i></div>
          <div className="stat-info"><h3>Lifestyle Tips</h3><p>10+</p><small>Daily habits</small></div>
        </div>
        <div className="stat-card-dashboard">
          <div className="stat-icon"><i className="fas fa-chart-line" style={{ color: '#dc2626' }}></i></div>
          <div className="stat-info"><h3>Your Readings</h3><p>{readings.length}</p><small>Total tracked</small></div>
        </div>
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ position: 'relative' }}>
          <i className="fas fa-search" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}></i>
          <input
            type="text"
            placeholder="Search foods, exercises, tips..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '10px 10px 10px 35px', border: '2px solid #e2e8f0', borderRadius: '25px', fontSize: '0.9rem', outline: 'none' }}
          />
        </div>
      </div>

      {/* Daily Tip */}
      <div style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', borderRadius: '12px', padding: '0.8rem', marginBottom: '1rem', color: 'white', textAlign: 'center' }}>
        <i className="fas fa-star" style={{ color: '#fbbf24' }}></i> Daily Health Tip <i className="fas fa-star" style={{ color: '#fbbf24' }}></i>
        <p style={{ marginTop: '0.3rem', marginBottom: 0, fontSize: '0.85rem' }}>{dailyTip}</p>
      </div>

      {/* Weekly Challenge */}
      <div style={{ background: 'white', borderRadius: '12px', padding: '1rem', marginBottom: '1rem', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <h4 style={{ margin: 0 }}><i className="fas fa-calendar-week" style={{ color: '#dc2626' }}></i> 7-Day Challenge</h4>
          <button onClick={resetChallenge} style={{ background: '#f1f5f9', border: 'none', padding: '3px 8px', borderRadius: '5px', cursor: 'pointer', fontSize: '0.7rem' }}>Reset</button>
        </div>
        
        {completedDays.length !== 7 ? (
          <>
            {currentDayChallenge && (
              <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '0.5rem', marginBottom: '0.5rem' }}>
                <p style={{ fontSize: '0.7rem', color: '#64748b' }}>Today's Challenge</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1rem' }}>{currentDayChallenge.icon}</span>
                  <span style={{ fontSize: '0.8rem' }}>Day {currentDayChallenge.day}: {currentDayChallenge.task}</span>
                </div>
              </div>
            )}
            
            <div style={{ display: 'grid', gap: '0.3rem', marginBottom: '0.5rem' }}>
              {weeklyChallenges.map(challenge => (
                <div key={challenge.day} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.4rem', background: completedDays.includes(challenge.day) ? '#d1fae5' : '#f8fafc', borderRadius: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>{challenge.icon}</span>
                    <span style={{ fontSize: '0.75rem' }}>Day {challenge.day}: {challenge.task}</span>
                  </div>
                  {!completedDays.includes(challenge.day) ? (
                    <button onClick={() => completeDay(challenge.day)} style={{ background: '#dc2626', color: 'white', border: 'none', padding: '2px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.65rem' }}>Done</button>
                  ) : (
                    <span style={{ color: '#10b981', fontSize: '0.7rem' }}>✅</span>
                  )}
                </div>
              ))}
            </div>
            
            <div style={{ background: '#f8fafc', borderRadius: '6px', padding: '0.3rem', textAlign: 'center' }}>
              <span style={{ fontSize: '0.7rem' }}>Progress: {completedDays.length}/7 days</span>
              <div style={{ background: '#e2e8f0', borderRadius: '3px', height: '3px', marginTop: '0.2rem' }}>
                <div style={{ width: `${(completedDays.length / 7) * 100}%`, background: '#dc2626', height: '100%' }}></div>
              </div>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '0.5rem', background: '#d1fae5', borderRadius: '8px' }}>
            <i className="fas fa-trophy" style={{ color: '#f59e0b' }}></i>
            <h5 style={{ margin: '0.3rem 0', color: '#065f46' }}>Challenge Complete! 🎉</h5>
          </div>
        )}
      </div>

      {/* BMI and Water Tracker */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
        
        <div style={{ background: 'white', borderRadius: '12px', padding: '0.8rem', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
          <h5 style={{ marginBottom: '0.5rem' }}><i className="fas fa-weight-scale" style={{ color: '#dc2626' }}></i> BMI Calculator</h5>
          <div style={{ display: 'flex', gap: '0.3rem', marginBottom: '0.3rem', flexWrap: 'wrap' }}>
            <input type="number" placeholder="Height (cm)" value={bmiHeight} onChange={(e) => setBmiHeight(e.target.value)} style={{ flex: 1, padding: '0.4rem', border: '2px solid #e2e8f0', borderRadius: '6px', minWidth: '80px', fontSize: '0.8rem' }} />
            <input type="number" placeholder="Weight (kg)" value={bmiWeight} onChange={(e) => setBmiWeight(e.target.value)} style={{ flex: 1, padding: '0.4rem', border: '2px solid #e2e8f0', borderRadius: '6px', minWidth: '80px', fontSize: '0.8rem' }} />
            <button onClick={calculateBMI} style={{ background: '#dc2626', color: 'white', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.7rem' }}>Calc</button>
          </div>
          {bmiResult && (
            <div style={{ textAlign: 'center', padding: '0.3rem', background: '#f8fafc', borderRadius: '6px' }}>
              <p style={{ fontSize: '1rem', fontWeight: 'bold', margin: 0, color: bmiResult.color }}>{bmiResult.value}</p>
              <p style={{ fontWeight: 'bold', color: bmiResult.color, fontSize: '0.7rem' }}>{bmiResult.category}</p>
              <p style={{ fontSize: '0.6rem', color: '#64748b' }}>{bmiResult.advice}</p>
            </div>
          )}
        </div>

        <div style={{ background: 'white', borderRadius: '12px', padding: '0.8rem', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
            <h5 style={{ margin: 0 }}><i className="fas fa-tint" style={{ color: '#06b6d4' }}></i> Water Tracker</h5>
            <button onClick={resetWater} style={{ background: '#f1f5f9', border: 'none', padding: '2px 5px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.6rem' }}>Reset</button>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
            <span style={{ fontSize: '0.7rem' }}>Daily Goal: 8 glasses</span>
            <span style={{ fontWeight: 'bold', fontSize: '0.8rem' }}>{waterCount}/8</span>
          </div>
          <div style={{ background: '#e2e8f0', borderRadius: '4px', height: '5px', marginBottom: '0.3rem' }}>
            <div style={{ width: `${(waterCount / 8) * 100}%`, background: '#06b6d4', height: '100%' }}></div>
          </div>
          <button onClick={addWater} disabled={waterCount >= 8} style={{ width: '100%', padding: '0.3rem', background: waterCount >= 8 ? '#94a3b8' : '#06b6d4', color: 'white', border: 'none', borderRadius: '6px', cursor: waterCount >= 8 ? 'not-allowed' : 'pointer', fontSize: '0.7rem' }}>
            + Add Glass
          </button>
        </div>
      </div>

      {/* Filter Buttons */}
      <div style={{ marginBottom: '0.8rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button onClick={() => setActiveCategory('all')} style={{ padding: '0.3rem 1rem', borderRadius: '20px', border: 'none', background: activeCategory === 'all' ? '#dc2626' : '#e2e8f0', color: activeCategory === 'all' ? 'white' : '#475569', cursor: 'pointer', fontSize: '0.75rem' }}>All</button>
        <button onClick={() => setActiveCategory('eat')} style={{ padding: '0.3rem 1rem', borderRadius: '20px', border: 'none', background: activeCategory === 'eat' ? '#10b981' : '#e2e8f0', color: activeCategory === 'eat' ? 'white' : '#475569', cursor: 'pointer', fontSize: '0.75rem' }}>✅ Eat</button>
        <button onClick={() => setActiveCategory('avoid')} style={{ padding: '0.3rem 1rem', borderRadius: '20px', border: 'none', background: activeCategory === 'avoid' ? '#ef4444' : '#e2e8f0', color: activeCategory === 'avoid' ? 'white' : '#475569', cursor: 'pointer', fontSize: '0.75rem' }}>❌ Avoid</button>
      </div>

      {/* DASH Diet */}
      <div style={{ background: 'white', borderRadius: '12px', padding: '0.8rem', marginBottom: '1rem', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
        <h5 style={{ marginBottom: '0.5rem' }}><i className="fas fa-utensils" style={{ color: '#10b981' }}></i> DASH Diet</h5>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.3rem' }}>
          {filteredTips.map((tip, i) => (
            <div key={i} style={{ background: tip.category === 'eat' ? '#f0fdf4' : '#fef2f2', padding: '0.3rem', borderRadius: '6px', borderLeft: `2px solid ${tip.category === 'eat' ? '#10b981' : '#ef4444'}` }}>
              <strong style={{ fontSize: '0.7rem', color: tip.category === 'eat' ? '#065f46' : '#991b1b' }}>{tip.name}</strong>
              <p style={{ fontSize: '0.6rem', color: '#64748b', margin: 0 }}>{tip.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Exercises */}
      <div style={{ background: 'white', borderRadius: '12px', padding: '0.8rem', marginBottom: '1rem', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
        <h5 style={{ marginBottom: '0.5rem' }}><i className="fas fa-dumbbell" style={{ color: '#ef4444' }}></i> Best Exercises</h5>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.5rem' }}>
          {exercises.map((ex, i) => (
            <div key={i} style={{ textAlign: 'center', padding: '0.4rem', background: '#f8fafc', borderRadius: '8px' }}>
              <i className={ex.icon} style={{ fontSize: '1rem', color: '#dc2626' }}></i>
              <h6 style={{ margin: '0.2rem 0', fontSize: '0.7rem' }}>{ex.name}</h6>
              <p style={{ fontSize: '0.6rem' }}>{ex.duration}</p>
              <p style={{ fontSize: '0.55rem', color: '#64748b' }}>{ex.effect}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Lifestyle Tips */}
      <div style={{ background: 'white', borderRadius: '12px', padding: '0.8rem', marginBottom: '1rem', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
        <h5 style={{ marginBottom: '0.5rem' }}><i className="fas fa-lightbulb" style={{ color: '#f59e0b' }}></i> Lifestyle Tips</h5>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.3rem' }}>
          {lifestyleTips.map((tip, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: '#f8fafc', padding: '0.3rem', borderRadius: '6px' }}>
              <div style={{ width: '18px', height: '18px', background: '#dc2626', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.55rem', fontWeight: 'bold' }}>{i + 1}</div>
              <span style={{ fontSize: '0.7rem' }}>{tip}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Alert */}
      <div style={{ background: 'linear-gradient(135deg, #991b1b, #7f1d1d)', borderRadius: '10px', padding: '0.6rem', textAlign: 'center', color: 'white' }}>
        <i className="fas fa-ambulance" style={{ marginRight: '0.3rem' }}></i>
        <strong style={{ fontSize: '0.75rem' }}>EMERGENCY:</strong>
        <span style={{ fontSize: '0.7rem' }}> If BP &gt; 180/120, call emergency!</span>
      </div>
    </div>
  );
};

export default HealthyTips;