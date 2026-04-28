import React from 'react';
import { DashboardData } from '../types/dashboard';
import { MetricCardComponent } from './MetricCard';
import { ChartComponent } from './Chart';
import { TableComponent, ProgressComponent, StatusComponent } from './TableAndProgress';

interface DashboardProps {
  data: DashboardData;
  className?: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ data, className = '' }) => {
  const { title, blocks, theme = 'auto' } = data;

  const styles: Record<string, React.CSSProperties> = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    },
    header: {
      marginBottom: '24px',
      textAlign: 'center'
    },
    title: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#333',
      margin: '0 0 8px 0',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    },
    subtitle: {
      fontSize: '14px',
      color: '#999'
    },
    metricsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: '20px',
      marginBottom: '24px'
    },
    block: {
      marginBottom: '24px'
    },
    blockTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#333',
      marginBottom: '12px'
    },
    chartGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
      gap: '20px',
      marginBottom: '24px'
    },
    progressGrid: {
      marginBottom: '24px'
    },
    statusGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '16px',
      marginBottom: '24px'
    }
  };

  const renderBlock = (block: DashboardData['blocks'][number], index: number) => {
    switch (block.type) {
      case 'metrics':
        return (
          <div key={index} style={styles.metricsGrid}>
            {block.data.map((metric, i) => (
              <MetricCardComponent key={metric.id || i} card={metric} />
            ))}
          </div>
        );
      
      case 'chart':
        return (
          <div key={index} style={styles.chartGrid}>
            <ChartComponent data={block.data} />
          </div>
        );
      
      case 'table':
        return (
          <div key={index} style={styles.block}>
            <TableComponent data={block.data} />
          </div>
        );
      
      case 'progress':
        return (
          <div key={index} style={styles.progressGrid}>
            <ProgressComponent data={block.data} />
          </div>
        );
      
      case 'status':
        return (
          <div key={index} style={styles.statusGrid}>
            <StatusComponent data={block.data} />
          </div>
        );
      
      default:
        return null;
    }
  };

  // 根据主题计算样式
  const getThemeStyles = () => {
    if (theme === 'dark') {
      return {
        container: {
          ...styles.container,
          background: '#1a1a2e',
          minHeight: '100vh'
        }
      };
    }
    return {};
  };

  const themeStyles = getThemeStyles();

  return (
    <div style={{ ...styles.container, ...themeStyles.container }} className={className}>
      {title && (
        <header style={styles.header}>
          <h1 style={styles.title}>{title}</h1>
          <p style={styles.subtitle}>实时数据看板</p>
        </header>
      )}
      
      {blocks.map((block, index) => renderBlock(block, index))}
    </div>
  );
};

export default Dashboard;
