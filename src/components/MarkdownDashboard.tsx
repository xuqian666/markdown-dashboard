import React, { useState, useEffect } from 'react';
import { parseDashboardMarkdown } from '../utils/parser';
import { Dashboard } from './Dashboard';
import { DashboardData } from '../types/dashboard';

interface MarkdownDashboardProps {
  markdown: string;
  className?: string;
  onParseError?: (error: Error) => void;
}

/**
 * 流式输出的 Markdown 数据看板组件
 * 支持实时解析 Markdown 并渲染为可视化看板
 */
export const MarkdownDashboard: React.FC<MarkdownDashboardProps> = ({
  markdown,
  className = '',
  onParseError
}) => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      const result = parseDashboardMarkdown(markdown);
      if (result) {
        setDashboardData(result.dashboard);
        setError(null);
      } else {
        // 如果没有解析到看板数据，可能是 Markdown 还在流式传输中
        setDashboardData(null);
      }
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Failed to parse dashboard');
      setError(err);
      onParseError?.(err);
    }
  }, [markdown, onParseError]);

  if (error) {
    return (
      <div style={{
        padding: '20px',
        background: '#fff2f0',
        border: '1px solid #ffccc7',
        borderRadius: '8px',
        color: '#ff4d4f'
      }}>
        <strong>解析错误:</strong> {error.message}
      </div>
    );
  }

  if (!dashboardData) {
    // 在流式输出过程中显示加载状态
    return (
      <div style={{
        padding: '40px',
        textAlign: 'center',
        background: '#fafafa',
        borderRadius: '12px',
        border: '2px dashed #d9d9d9'
      }}>
        <div style={{
          display: 'inline-block',
          width: '40px',
          height: '40px',
          border: '3px solid #667eea',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <p style={{ marginTop: '16px', color: '#666' }}>正在解析数据看板...</p>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return <Dashboard data={dashboardData} className={className} />;
};

export default MarkdownDashboard;
