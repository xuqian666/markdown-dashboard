import React from 'react';
import { TableData, ProgressData, StatusIndicator } from '../types/dashboard';

interface TableComponentProps {
  data: TableData;
}

interface ProgressComponentProps {
  data: ProgressData[];
}

interface StatusComponentProps {
  data: StatusIndicator[];
}

const statusColors = {
  success: { bg: '#f6ffed', border: '#b7eb8f', text: '#52c41a', icon: '✓' },
  warning: { bg: '#fffbe6', border: '#ffe58f', text: '#faad14', icon: '!' },
  error: { bg: '#fff2f0', border: '#ffccc7', text: '#ff4d4f', icon: '✕' },
  info: { bg: '#e6f7ff', border: '#91d5ff', text: '#1890ff', icon: 'ℹ' }
};

// ========== 表格组件 ==========
export const TableComponent: React.FC<TableComponentProps> = ({ data }) => {
  const { title, columns, rows } = data;
  
  const styles: Record<string, React.CSSProperties> = {
    container: {
      background: 'white',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      overflow: 'auto'
    },
    header: {
      marginBottom: '16px'
    },
    title: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#333',
      margin: 0
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: '14px'
    },
    th: {
      textAlign: 'left',
      padding: '12px 16px',
      background: '#fafafa',
      borderBottom: '2px solid #e8e8e8',
      color: '#666',
      fontWeight: '600',
      whiteSpace: 'nowrap'
    },
    td: {
      padding: '12px 16px',
      borderBottom: '1px solid #e8e8e8',
      color: '#333'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>{title}</h3>
      </div>
      <table style={styles.table}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} style={{ ...styles.th, textAlign: col.align || 'left' }}>
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr 
              key={rowIndex}
              onMouseEnter={(e) => e.currentTarget.style.background = '#fafafa'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              {columns.map((col) => (
                <td key={col.key} style={{ ...styles.td, textAlign: col.align || 'left' }}>
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ========== 进度条组件 ==========
export const ProgressComponent: React.FC<ProgressComponentProps> = ({ data }) => {
  const getBarStyle = (color: string, width: number): React.CSSProperties => ({
    height: '100%',
    width: `${Math.min(100, Math.max(0, width))}%`,
    background: `linear-gradient(90deg, ${color}, ${color}88)`,
    borderRadius: '4px',
    transition: 'width 0.5s ease'
  });

  const styles: Record<string, React.CSSProperties> = {
    container: {
      display: 'grid',
      gap: '16px'
    },
    progressItem: {
      background: 'white',
      borderRadius: '12px',
      padding: '16px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '12px'
    },
    title: {
      fontSize: '14px',
      color: '#666',
      margin: 0
    },
    percentage: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#333'
    },
    barContainer: {
      height: '8px',
      background: '#f0f0f0',
      borderRadius: '4px',
      overflow: 'hidden'
    }
  };

  const getProgressColor = (value: number, customColor?: string) => {
    if (customColor) return customColor;
    if (value >= 80) return '#52c41a';
    if (value >= 50) return '#faad14';
    return '#ff4d4f';
  };

  return (
    <div style={styles.container}>
      {data.map((item) => {
        const color = getProgressColor(item.value, item.color);
        return (
          <div key={item.id} style={styles.progressItem}>
            <div style={styles.header}>
              <span style={styles.title}>{item.title}</span>
              {item.showPercentage && (
                <span style={styles.percentage}>{item.value}%</span>
              )}
            </div>
            <div style={styles.barContainer}>
              <div style={getBarStyle(color, item.value)} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ========== 状态指示器组件 ==========
export const StatusComponent: React.FC<StatusComponentProps> = ({ data }) => {
  const getStatusItemStyle = (status: keyof typeof statusColors): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px 16px',
    background: statusColors[status].bg,
    border: `1px solid ${statusColors[status].border}`,
    borderRadius: '8px',
    transition: 'transform 0.2s'
  });

  const getIconStyle = (status: keyof typeof statusColors): React.CSSProperties => ({
    fontSize: '18px',
    color: statusColors[status].text,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '24px',
    height: '24px',
    background: statusColors[status].text + '15',
    borderRadius: '50%'
  });

  const styles: Record<string, React.CSSProperties> = {
    container: {
      display: 'grid',
      gap: '12px'
    },
    content: {
      flex: 1
    },
    label: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#333',
      margin: '0 0 2px 0'
    },
    message: {
      fontSize: '12px',
      color: '#666',
      margin: 0
    }
  };

  return (
    <div style={styles.container}>
      {data.map((item) => {
        const status = item.status as keyof typeof statusColors;
        const colors = statusColors[status];
        return (
          <div key={item.id} style={getStatusItemStyle(status)}>
            <div style={getIconStyle(status)}>{colors.icon}</div>
            <div style={styles.content}>
              <p style={styles.label}>{item.label}</p>
              {item.message && <p style={styles.message}>{item.message}</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TableComponent;
