import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';

const BPChart = ({ readings }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    
    const ctx = chartRef.current.getContext('2d');
    const last7Days = readings.slice(0, 7).reverse();
    
    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: last7Days.map(r => new Date(r.date).toLocaleDateString()),
        datasets: [
          {
            label: 'Systolic',
            data: last7Days.map(r => r.systolic),
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239,68,68,0.1)',
            tension: 0.4,
            fill: true,
            borderWidth: 2
          },
          {
            label: 'Diastolic',
            data: last7Days.map(r => r.diastolic),
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59,130,246,0.1)',
            tension: 0.4,
            fill: true,
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { position: 'top' },
          title: { display: true, text: 'Blood Pressure Trends' }
        },
        scales: {
          y: {
            title: { display: true, text: 'mmHg' },
            min: 40,
            max: 200
          }
        }
      }
    });
    
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [readings]);

  return (
    <div className="chart-container" style={{ background: 'white', padding: '1.5rem', borderRadius: '15px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default BPChart;