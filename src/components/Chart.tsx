import React from 'react';
import { ChartData } from '../types/dashboard';

interface ChartComponentProps {
  data: ChartData;
}

const chartColors = [
  '#667eea',
  '#764ba2',
  '#f093fb',
  '#f5576c',
  '#4facfe',
  '#00f2fe',
  '#43e97b',
  '#38f9d7'
];

export const ChartComponent: React.FC<ChartComponentProps> = ({ data }) => {
  const { title, type, data: chartData } = data;
  
  const maxValue = Math.max(...chartData.map(d => d.value));
  const minValue = Math.min(...chartData.map(d => d.value));
  
  const getBarStyle = (color: string, height: number): React.CSSProperties => ({
    width: '40px',
    height: `${height}%`,
    background: `linear-gradient(180deg, ${color} 0%, ${color}88 100%)`,
    borderRadius: '4px 4px 0 0',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    position: 'relative',
    minHeight: '4px'
  });

  const styles: Record<string, React.CSSProperties> = {
    container: {
      background: 'white',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      overflow: 'hidden'
    },
    header: {
      marginBottom: '20px'
    },
    title: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#333',
      margin: 0
    },
    chartContainer: {
      position: 'relative',
      height: '200px',
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-around',
      paddingBottom: '30px',
      borderBottom: '1px solid #eee'
    },
    label: {
      position: 'absolute',
      bottom: '-25px',
      left: '50%',
      transform: 'translateX(-50%)',
      fontSize: '12px',
      color: '#666',
      whiteSpace: 'nowrap'
    },
    value: {
      position: 'absolute',
      top: '-20px',
      left: '50%',
      transform: 'translateX(-50%)',
      fontSize: '11px',
      color: '#333',
      fontWeight: '600'
    },
    lineContainer: {
      position: 'relative',
      height: '200px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      paddingBottom: '30px',
      borderBottom: '1px solid #eee'
    },
    lineSvg: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%'
    }
  };

  // 渲染柱状图/条形图
  const renderBarChart = () => (
    <div style={styles.chartContainer}>
      {chartData.map((item, index) => {
        const height = ((item.value - minValue) / (maxValue - minValue || 1)) * 80 + 10;
        const color = chartColors[index % chartColors.length];
        
        return (
          <div key={item.label} style={{ position: 'relative', flex: 1, display: 'flex', justifyContent: 'center' }}>
            <div style={getBarStyle(color, height)} />
            <span style={styles.value}>{item.value}</span>
            <span style={styles.label}>{item.label}</span>
          </div>
        );
      })}
    </div>
  );

  // 渲染折线图
  const renderLineChart = () => {
    const points = chartData.map((item, index) => {
      const x = (index / (chartData.length - 1 || 1)) * 100;
      const y = 100 - ((item.value - minValue) / (maxValue - minValue || 1)) * 80 - 10;
      return `${x},${y}`;
    }).join(' ');

    const areaPoints = `0,100 ${points} 100,100`;

    return (
      <div style={styles.lineContainer}>
        <svg style={styles.lineSvg} viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#667eea" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#667eea" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polygon points={areaPoints} fill="url(#lineGradient)" />
          <polyline
            points={points}
            fill="none"
            stroke="#667eea"
            strokeWidth="0.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {chartData.map((item, index) => {
            const x = (index / (chartData.length - 1 || 1)) * 100;
            const y = 100 - ((item.value - minValue) / (maxValue - minValue || 1)) * 80 - 10;
            return (
              <circle
                key={item.label}
                cx={x}
                cy={y}
                r="1"
                fill="white"
                stroke="#667eea"
                strokeWidth="0.5"
              />
            );
          })}
        </svg>
        {chartData.map((item, index) => {
          const x = (index / (chartData.length - 1 || 1)) * 100;
          return (
            <div
              key={item.label}
              style={{
                position: 'absolute',
                bottom: '-25px',
                left: `${x}%`,
                transform: 'translateX(-50%)',
                fontSize: '11px',
                color: '#666'
              }}
            >
              {item.label}
            </div>
          );
        })}
      </div>
    );
  };

  // 渲染饼图
  const renderPieChart = () => {
    const total = chartData.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = 0;

    const slices = chartData.map((item, index) => {
      const percentage = item.value / total;
      const angle = percentage * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;
      currentAngle = endAngle;

      const startRad = (startAngle - 90) * (Math.PI / 180);
      const endRad = (endAngle - 90) * (Math.PI / 180);

      const x1 = 50 + 40 * Math.cos(startRad);
      const y1 = 50 + 40 * Math.sin(startRad);
      const x2 = 50 + 40 * Math.cos(endRad);
      const y2 = 50 + 40 * Math.sin(endRad);

      const largeArcFlag = angle > 180 ? 1 : 0;

      const pathData = `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

      return {
        path: pathData,
        color: chartColors[index % chartColors.length],
        label: item.label,
        value: item.value,
        percentage: (percentage * 100).toFixed(1)
      };
    });

    return (
      <div style={{ ...styles.chartContainer, height: '250px', alignItems: 'center' }}>
        <svg viewBox="0 0 100 100" style={{ height: '180px', width: '180px' }}>
          {slices.map((slice, index) => (
            <path
              key={index}
              d={slice.path}
              fill={slice.color}
              stroke="white"
              strokeWidth="0.5"
              style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
            />
          ))}
        </svg>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px', justifyContent: 'center' }}>
          {slices.map((slice, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: slice.color }} />
              <span>{slice.label}: {slice.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>{title}</h3>
      </div>
      {type === 'bar' && renderBarChart()}
      {type === 'line' && renderLineChart()}
      {type === 'pie' && renderPieChart()}
      {type === 'area' && renderLineChart()}
    </div>
  );
};

export default ChartComponent;
