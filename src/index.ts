// 导出所有类型
export * from './types/dashboard';

// 导出解析工具
export { parseDashboardMarkdown, generateExampleMarkdown } from './utils/parser';

// 导出组件
export { Dashboard } from './components/Dashboard';
export { MarkdownDashboard } from './components/MarkdownDashboard';
export { MetricCardComponent } from './components/MetricCard';
export { ChartComponent } from './components/Chart';
export { TableComponent, ProgressComponent, StatusComponent } from './components/TableAndProgress';

// 默认导出
export { Dashboard as default } from './components/Dashboard';
