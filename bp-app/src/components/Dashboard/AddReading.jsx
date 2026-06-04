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

  return (
    <div className="add-reading" style={{ background: 'white', padding: '1.5rem', borderRadius: '15px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
      <h2 style={{ marginBottom: '1rem' }}><i className="fas fa-plus-circle"></i> Add New Reading</h2>
      <form onSubmit={handleSubmit}>
        <div className="bp-inputs" style={{ display: 'grid', gap: '1rem', margin: '1.5rem 0' }}>
          <div className="input-field">
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Systolic (mmHg)</label>
            <input 
              type="number"
              name="systolic"
              value={formData.systolic}
              onChange={handleChange}
              placeholder="e.g., 120"
              style={{ width: '100%', padding: '0.8rem', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '1rem' }}
              required
            />
          </div>
          <div className="input-field">
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Diastolic (mmHg)</label>
            <input 
              type="number"
              name="diastolic"
              value={formData.diastolic}
              onChange={handleChange}
              placeholder="e.g., 80"
              style={{ width: '100%', padding: '0.8rem', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '1rem' }}
              required
            />
          </div>
          <div className="input-field">
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Heart Rate (BPM)</label>
            <input 
              type="number"
              name="heartRate"
              value={formData.heartRate}
              onChange={handleChange}
              placeholder="e.g., 72"
              style={{ width: '100%', padding: '0.8rem', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '1rem' }}
            />
          </div>
          <div className="input-field">
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Notes</label>
            <input 
              type="text"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Any notes..."
              style={{ width: '100%', padding: '0.8rem', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '1rem' }}
            />
          </div>
        </div>
        <button 
          type="submit" 
          disabled={loading}
          className="btn-submit"
          style={{ 
            width: '100%', 
            padding: '0.8rem', 
            background: '#dc2626', 
            color: 'white', 
            border: 'none', 
            borderRadius: '10px', 
            fontSize: '1rem', 
            fontWeight: '600', 
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            transition: 'all 0.3s'
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