// 数据看板组件的类型定义

/**
 * 指标卡片数据类型
 */
export interface MetricCard {
  id: string;
  title: string;
  value: string | number;
  change?: string | number;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: string;
}

/**
 * 图表数据类型 - 支持多种图表
 */
export interface ChartData {
  id: string;
  title: string;
  type: 'line' | 'bar' | 'pie' | 'area';
  data: Array<{
    label: string;
    value: number;
    [key: string]: any;
  }>;
  colors?: string[];
}

/**
 * 表格列定义
 */
export interface TableColumn {
  key: string;
  title: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

/**
 * 表格数据类型
 */
export interface TableData {
  id: string;
  title: string;
  columns: TableColumn[];
  rows: Array<Record<string, any>>;
}

/**
 * 进度条数据类型
 */
export interface ProgressData {
  id: string;
  title: string;
  value: number; // 0-100
  color?: string;
  showPercentage?: boolean;
}

/**
 * 状态指示器类型
 */
export interface StatusIndicator {
  id: string;
  label: string;
  status: 'success' | 'warning' | 'error' | 'info';
  message?: string;
}

/**
 * 看板区块类型
 */
export type DashboardBlock = 
  | { type: 'metrics'; data: MetricCard[] }
  | { type: 'chart'; data: ChartData }
  | { type: 'table'; data: TableData }
  | { type: 'progress'; data: ProgressData[] }
  | { type: 'status'; data: StatusIndicator[] };

/**
 * 看板整体数据结构
 */
export interface DashboardData {
  title?: string;
  blocks: DashboardBlock[];
  theme?: 'light' | 'dark' | 'auto';
}

/**
 * Markdown 自定义语法解析结果
 */
export interface ParsedDashboard {
  dashboard: DashboardData;
  rawMarkdown: string;
}
