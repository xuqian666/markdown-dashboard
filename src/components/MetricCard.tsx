import React from 'react';
import { MetricCard } from '../types/dashboard';

interface MetricCardProps {
  card: MetricCard;
}

const statusColors = {
  positive: '#52c41a',
  negative: '#ff4d4f',
  neutral: '#8c8c8c'
};

const statusIcons = {
  positive: '↑',
  negative: '↓',
  neutral: '-'
};

export const MetricCardComponent: React.FC<MetricCardProps> = ({ card }) => {
  const { title, value, change, changeType = 'neutral', icon } = card;
  
  const styles: Record<string, React.CSSProperties> = {
    container: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '12px',
      padding: '20px',
      color: 'white',
      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      position: 'relative',
      overflow: 'hidden'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '12px'
    },
    title: {
      fontSize: '14px',
      fontWeight: '500',
      opacity: 0.9,
      margin: 0
    },
    icon: {
      fontSize: '24px',
      background: 'rgba(255,255,255,0.2)',
      borderRadius: '50%',
      width: '40px',
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    value: {
      fontSize: '32px',
      fontWeight: 'bold',
      marginBottom: '8px'
    },
    change: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      fontSize: '13px',
      background: 'rgba(255,255,255,0.2)',
      padding: '4px 8px',
      borderRadius: '12px'
    },
    bgDecoration: {
      position: 'absolute',
      right: '-20px',
      bottom: '-20px',
      fontSize: '100px',
      opacity: 0.1,
      transform: 'rotate(-15deg)'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>{title}</h3>
        {icon && (
          <div style={styles.icon}>{icon}</div>
        )}
      </div>
      <div style={styles.value}>{value}</div>
      {change !== undefined && (
        <div style={{ ...styles.change, color: statusColors[changeType] }}>
          <span>{statusIcons[changeType]}</span>
          <span>{change}</span>
        </div>
      )}
      <div style={styles.bgDecoration}>📊</div>
    </div>
  );
};

export default MetricCardComponent;
