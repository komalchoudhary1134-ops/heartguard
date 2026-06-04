import React from 'react';

const RecentReadings = ({ readings, onDelete }) => {
  return (
    <div className="readings-history" style={{ background: 'white', padding: '1.5rem', borderRadius: '15px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
      <h2 style={{ marginBottom: '1rem' }}><i className="fas fa-history"></i> Recent Readings</h2>
      <div className="table-container" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Date</th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Systolic</th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Diastolic</th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Heart Rate</th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Status</th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {!readings || readings.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                  No readings yet. Add your first reading!
                </td>
              </tr>
            ) : (
              readings.slice(0, 10).map((r, index) => {
                const readingId = r._id || r.id || index;
                return (
                  <tr key={readingId} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '1rem' }}>{new Date(r.date).toLocaleString()}</td>
                    <td style={{ padding: '1rem' }}>{r.systolic}</td>
                    <td style={{ padding: '1rem' }}>{r.diastolic}</td>
                    <td style={{ padding: '1rem' }}>{r.heartRate || '-'}</td>
                    <td style={{ padding: '1rem' }}>
                      <span className={`status-badge status-${(r.status || 'normal').toLowerCase().replace(/ /g, '-')}`} style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem' }}>
                        {r.status || 'Normal'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <button 
                        onClick={() => onDelete(readingId)} 
                        className="btn-delete"
                        style={{ background: '#ef4444', color: 'white', border: 'none', padding: '5px 12px', borderRadius: '5px', cursor: 'pointer', transition: 'all 0.3s' }}
                      >
                        <i className="fas fa-trash"></i> Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentReadings;