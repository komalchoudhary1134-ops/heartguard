import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';

const BPChart = ({ readings }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  // Check screen size for responsive adjustments
  const isMobile = window.innerWidth <= 768;
  const isSmallMobile = window.innerWidth <= 480;

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    
    const ctx = chartRef.current.getContext('2d');
    const last7Days = readings.slice(0, 7).reverse();
    
    // Responsive chart options
    const chartOptions = {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { 
          position: isMobile ? 'bottom' : 'top',
          labels: {
            font: {
              size: isSmallMobile ? 10 : (isMobile ? 11 : 12)
            },
            boxWidth: isSmallMobile ? 10 : 12
          }
        },
        title: { 
          display: true, 
          text: 'Blood Pressure Trends',
          font: {
            size: isSmallMobile ? 12 : (isMobile ? 14 : 16)
          }
        },
        tooltip: {
          titleFont: {
            size: isSmallMobile ? 10 : 12
          },
          bodyFont: {
            size: isSmallMobile ? 10 : 12
          }
        }
      },
      scales: {
        x: {
          ticks: {
            font: {
              size: isSmallMobile ? 8 : (isMobile ? 10 : 12)
            },
            maxRotation: isSmallMobile ? 45 : 30,
            minRotation: isSmallMobile ? 45 : 30
          }
        },
        y: {
          title: { 
            display: !isSmallMobile, 
            text: 'mmHg',
            font: {
              size: isSmallMobile ? 10 : 12
            }
          },
          ticks: {
            font: {
              size: isSmallMobile ? 8 : (isMobile ? 10 : 12)
            }
          },
          min: 40,
          max: 200
        }
      }
    };

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: last7Days.map(r => {
          const date = new Date(r.date);
          if (isSmallMobile) {
            return date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' });
          }
          return date.toLocaleDateString();
        }),
        datasets: [
          {
            label: 'Systolic',
            data: last7Days.map(r => r.systolic),
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239,68,68,0.1)',
            tension: 0.4,
            fill: true,
            borderWidth: isSmallMobile ? 1.5 : 2,
            pointRadius: isSmallMobile ? 2 : (isMobile ? 3 : 4),
            pointHoverRadius: isSmallMobile ? 4 : 6
          },
          {
            label: 'Diastolic',
            data: last7Days.map(r => r.diastolic),
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59,130,246,0.1)',
            tension: 0.4,
            fill: true,
            borderWidth: isSmallMobile ? 1.5 : 2,
            pointRadius: isSmallMobile ? 2 : (isMobile ? 3 : 4),
            pointHoverRadius: isSmallMobile ? 4 : 6
          }
        ]
      },
      options: chartOptions
    });
    
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [readings, isMobile, isSmallMobile]);

  // Responsive container styles
  const containerStyles = {
    background: 'white',
    padding: isSmallMobile ? '0.8rem' : (isMobile ? '1rem' : '1.5rem'),
    borderRadius: '15px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    width: '100%',
    overflowX: 'auto',
    boxSizing: 'border-box'
  };

  const canvasStyles = {
    width: '100%',
    height: 'auto',
    minHeight: isSmallMobile ? '250px' : (isMobile ? '300px' : '400px')
  };

  return (
    <div className="chart-container" style={containerStyles}>
      {readings.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '2rem', 
          color: '#6b7280',
          fontSize: isSmallMobile ? '0.85rem' : '1rem'
        }}>
          <i className="fas fa-chart-line" style={{ fontSize: '2rem', marginBottom: '0.5rem', display: 'block' }}></i>
          No data available. Add your first reading to see the chart!
        </div>
      ) : (
        <canvas ref={chartRef} style={canvasStyles}></canvas>
      )}
    </div>
  );
};

export default BPChart;