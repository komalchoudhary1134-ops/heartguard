import React, { useState } from 'react';

const AddReading = ({ onAdd }) => {
  const [formData, setFormData] = useState({ 
    systolic: '', 
    diastolic: '', 
    heartRate: '', 
    notes: '' 
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.systolic || !formData.diastolic) {
      alert('Please enter both systolic and diastolic values');
      return;
    }
    
    setLoading(true);
    
    try {
      const readingData = {
        systolic: parseInt(formData.systolic),
        diastolic: parseInt(formData.diastolic),
        heartRate: formData.heartRate ? parseInt(formData.heartRate) : null,
        notes: formData.notes
      };
      
      await onAdd(readingData);
      
      // Clear form
      setFormData({ systolic: '', diastolic: '', heartRate: '', notes: '' });
      
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to add reading');
    } finally {
      setLoading(false);
    }
  };

  // Mobile responsive styles
  const isMobile = window.innerWidth <= 768;
  const isSmallMobile = window.innerWidth <= 480;

  const styles = {
    container: {
      background: 'white',
      padding: isSmallMobile ? '0.8rem' : (isMobile ? '1rem' : '1.5rem'),
      borderRadius: '15px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
      width: '100%',
      boxSizing: 'border-box'
    },
    title: {
      marginBottom: isSmallMobile ? '0.8rem' : (isMobile ? '1rem' : '1rem'),
      fontSize: isSmallMobile ? '1.1rem' : (isMobile ? '1.2rem' : '1.5rem'),
      marginTop: 0
    },
    inputsGrid: {
      display: 'grid',
      gap: isSmallMobile ? '0.8rem' : (isMobile ? '1rem' : '1rem'),
      margin: isSmallMobile ? '1rem 0' : (isMobile ? '1.2rem 0' : '1.5rem 0')
    },
    inputField: {
      width: '100%'
    },
    label: {
      display: 'block',
      marginBottom: '0.5rem',
      fontWeight: '500',
      fontSize: isSmallMobile ? '0.85rem' : (isMobile ? '0.9rem' : '1rem')
    },
    input: {
      width: '100%',
      padding: isSmallMobile ? '0.5rem' : (isMobile ? '0.7rem' : '0.8rem'),
      border: '2px solid #e2e8f0',
      borderRadius: '10px',
      fontSize: isSmallMobile ? '0.85rem' : (isMobile ? '0.9rem' : '1rem'),
      boxSizing: 'border-box'
    },
    button: {
      width: '100%',
      padding: isSmallMobile ? '0.6rem' : (isMobile ? '0.7rem' : '0.8rem'),
      background: '#dc2626',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      fontSize: isSmallMobile ? '0.85rem' : (isMobile ? '0.9rem' : '1rem'),
      fontWeight: '600',
      cursor: loading ? 'not-allowed' : 'pointer',
      opacity: loading ? 0.7 : 1,
      transition: 'all 0.3s'
    }
  };

  return (
    <div className="add-reading" style={styles.container}>
      <h2 style={styles.title}>
        <i className="fas fa-plus-circle"></i> Add New Reading
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="bp-inputs" style={styles.inputsGrid}>
          <div className="input-field" style={styles.inputField}>
            <label style={styles.label}>Systolic (mmHg)</label>
            <input 
              type="number"
              name="systolic"
              value={formData.systolic}
              onChange={handleChange}
              placeholder="e.g., 120"
              style={styles.input}
              required
            />
          </div>
          <div className="input-field" style={styles.inputField}>
            <label style={styles.label}>Diastolic (mmHg)</label>
            <input 
              type="number"
              name="diastolic"
              value={formData.diastolic}
              onChange={handleChange}
              placeholder="e.g., 80"
              style={styles.input}
              required
            />
          </div>
          <div className="input-field" style={styles.inputField}>
            <label style={styles.label}>Heart Rate (BPM)</label>
            <input 
              type="number"
              name="heartRate"
              value={formData.heartRate}
              onChange={handleChange}
              placeholder="e.g., 72"
              style={styles.input}
            />
          </div>
          <div className="input-field" style={styles.inputField}>
            <label style={styles.label}>Notes</label>
            <input 
              type="text"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Any notes..."
              style={styles.input}
            />
          </div>
        </div>
        <button 
          type="submit" 
          disabled={loading}
          className="btn-submit"
          style={styles.button}
          onMouseEnter={(e) => {
            if (!loading) e.target.style.background = '#b91c1c';
          }}
          onMouseLeave={(e) => {
            if (!loading) e.target.style.background = '#dc2626';
          }}
        >
          {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-save"></i>} 
          {loading ? 'Saving...' : 'Save Reading'}
        </button>
      </form>
    </div>
  );
};

export default AddReading;