import { DashboardData, ParsedDashboard } from '../types/dashboard';

/**
 * 从 Markdown 自定义语法解析数据看板
 * 
 * 支持的语法格式:
 * 
 * :::dashboard{title="看板标题"}
 * 
 * ## metrics
 * {"id": "m1", "title": "总销售额", "value": "¥128,430", "change": "+12.5%", "changeType": "positive"}
 * {"id": "m2", "title": "订单数", "value": "1,234", "change": "+8.2%", "changeType": "positive"}
 * 
 * ## chart{"type": "line", "title": "销售趋势"}
 * [{"label": "周一", "value": 120}, {"label": "周二", "value": 200}, {"label": "周三", "value": 150}]
 * 
 * ## table{"title": "产品排行"}
 * | 排名 | 产品 | 销量 | 增长率 |
 * |------|------|------|--------|
 * | 1 | 产品 A | 1,234 | +12% |
 * | 2 | 产品 B | 987 | +8% |
 * 
 * ## progress
 * {"id": "p1", "title": "目标完成率", "value": 75}
 * 
 * ## status
 * {"id": "s1", "label": "系统状态", "status": "success", "message": "运行正常"}
 * 
 * :::
 */
export function parseDashboardMarkdown(markdown: string): ParsedDashboard | null {
  const dashboardRegex = /:::dashboard(?:\{title="([^"]+)"\})?\n([\s\S]*?)\n:::/;
  const match = markdown.match(dashboardRegex);
  
  if (!match) {
    return null;
  }
  
  const title = match[1] || undefined;
  const content = match[2];
  
  const blocks: DashboardData['blocks'] = [];
  
  // 解析指标卡片
  const metricsSection = content.match(/## metrics\n([\s\S]*?)(?=## |$)/);
  if (metricsSection && metricsSection[1]) {
    const metricsLines = metricsSection[1].trim().split('\n').filter(line => line.trim());
    const metrics: MetricCard[] = [];
    metricsLines.forEach((line, index) => {
      try {
        const data = JSON.parse(line);
        metrics.push({
          id: data.id || `metric-${index}`,
          title: data.title,
          value: data.value,
          change: data.change,
          changeType: data.changeType as 'positive' | 'negative' | 'neutral' | undefined,
          icon: data.icon
        });
      } catch (e) {
        console.warn('Failed to parse metric:', line);
      }
    });
    
    if (metrics.length > 0) {
      blocks.push({ type: 'metrics', data: metrics });
    }
  }
  
  // 解析图表
  const chartMatch = content.match(/## chart(?:\{([^}]+)\})?\n([\s\S]*?)(?=## |$)/);
  if (chartMatch) {
    const configStr = chartMatch[1];
    const dataStr = chartMatch[2].trim();
    
    let chartType: 'line' | 'bar' | 'pie' | 'area' = 'line';
    let chartTitle = '图表';
    
    if (configStr) {
      try {
        const config = JSON.parse(`{${configStr}}`);
        chartType = config.type || 'line';
        chartTitle = config.title || '图表';
      } catch (e) {
        console.warn('Failed to parse chart config:', configStr);
      }
    }
    
    try {
      const chartData = JSON.parse(dataStr);
      blocks.push({
        type: 'chart',
        data: {
          id: 'chart-1',
          title: chartTitle,
          type: chartType,
          data: chartData
        }
      });
    } catch (e) {
      console.warn('Failed to parse chart data:', dataStr);
    }
  }
  
  // 解析表格
  const tableMatch = content.match(/## table(?:\{title="([^"]+)"\})?\n([\s\S]*?)(?=## |$)/);
  if (tableMatch) {
    const tableTitle = tableMatch[1] || '表格';
    const tableContent = tableMatch[2].trim();
    
    const lines = tableContent.split('\n').filter(line => line.trim());
    if (lines.length >= 3) {
      const headerLine = lines[0];
      const dataLines = lines.slice(2);
      
      const headers = headerLine.split('|').map(h => h.trim()).filter(h => h);
      const columns = headers.map((title, index) => ({
        key: `col-${index}`,
        title,
        align: 'left' as const
      }));
      
      const rows = dataLines.map((line, rowIndex) => {
        const cells = line.split('|').map(c => c.trim()).filter(c => c);
        const row: Record<string, any> = {};
        cells.forEach((cell, colIndex) => {
          row[columns[colIndex]?.key] = cell;
        });
        return row;
      });
      
      blocks.push({
        type: 'table',
        data: {
          id: 'table-1',
          title: tableTitle,
          columns,
          rows
        }
      });
    }
  }
  
  // 解析进度条
  const progressSection = content.match(/## progress\n([\s\S]*?)(?=## |$)/);
  if (progressSection && progressSection[1]) {
    const progressLines = progressSection[1].trim().split('\n').filter(line => line.trim());
    const progresses = progressLines.map((line, index) => {
      try {
        const data = JSON.parse(line);
        return {
          id: data.id || `progress-${index}`,
          title: data.title,
          value: data.value,
          color: data.color,
          showPercentage: data.showPercentage !== false
        };
      } catch (e) {
        console.warn('Failed to parse progress:', line);
        return null;
      }
    }).filter(Boolean);
    
    if (progresses.length > 0) {
      blocks.push({ type: 'progress', data: progresses });
    }
  }
  
  // 解析状态指示器
  const statusSection = content.match(/## status\n([\s\S]*?)(?=## |$)/);
  if (statusSection && statusSection[1]) {
    const statusLines = statusSection[1].trim().split('\n').filter(line => line.trim());
    const statuses = statusLines.map((line, index) => {
      try {
        const data = JSON.parse(line);
        return {
          id: data.id || `status-${index}`,
          label: data.label,
          status: data.status as 'success' | 'warning' | 'error' | 'info',
          message: data.message
        };
      } catch (e) {
        console.warn('Failed to parse status:', line);
        return null;
      }
    }).filter(Boolean);
    
    if (statuses.length > 0) {
      blocks.push({ type: 'status', data: statuses });
    }
  }
  
  return {
    dashboard: {
      title,
      blocks,
      theme: 'auto'
    },
    rawMarkdown: markdown
  };
}

/**
 * 生成示例 Markdown
 */
export function generateExampleMarkdown(): string {
  return `:::dashboard{title="销售数据看板"}

## metrics
{"id": "m1", "title": "总销售额", "value": "¥128,430", "change": "+12.5%", "changeType": "positive"}
{"id": "m2", "title": "订单数", "value": "1,234", "change": "+8.2%", "changeType": "positive"}
{"id": "m3", "title": "客单价", "value": "¥104", "change": "-2.1%", "changeType": "negative"}
{"id": "m4", "title": "转化率", "value": "3.2%", "change": "0", "changeType": "neutral"}

## chart{"type": "line", "title": "近 7 日销售趋势"}
[{"label": "周一", "value": 120}, {"label": "周二", "value": 200}, {"label": "周三", "value": 150}, {"label": "周四", "value": 180}, {"label": "周五", "value": 220}, {"label": "周六", "value": 280}, {"label": "周日", "value": 250}]

## table{"title": "产品销量排行"}
| 排名 | 产品名称 | 销量 | 销售额 | 增长率 |
|------|----------|------|--------|--------|
| 1 | 无线耳机 | 1,234 | ¥123,400 | +15% |
| 2 | 智能手表 | 987 | ¥98,700 | +8% |
| 3 | 蓝牙音箱 | 756 | ¥75,600 | +12% |

## progress
{"id": "p1", "title": "月度目标完成率", "value": 75, "showPercentage": true}
{"id": "p2", "title": "季度目标完成率", "value": 45, "showPercentage": true}

## status
{"id": "s1", "label": "库存状态", "status": "success", "message": "库存充足"}
{"id": "s2", "label": "物流状态", "status": "warning", "message": "部分区域延迟"}
{"id": "s3", "label": "支付系统", "status": "success", "message": "运行正常"}

:::`;
}
