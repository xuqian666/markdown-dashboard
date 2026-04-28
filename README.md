# Markdown Dashboard

基于 Markdown 的自定义 UI 渲染能力，实现一个用于 AI 流式输出里面展示的 React 数据看板组件。

## 特性

- 📊 **多种可视化组件**: 指标卡片、图表（折线/柱状/饼图）、表格、进度条、状态指示器
- 📝 **Markdown 语法**: 使用简单的 Markdown 扩展语法定义看板内容
- ⚡ **流式支持**: 专为 AI 流式输出设计，支持实时解析和渲染
- 🎨 **美观设计**: 现代化渐变配色，响应式布局
- 🔧 **易于集成**: 纯 React 组件，无额外依赖

## 安装

```bash
npm install markdown-dashboard
```

## 快速开始

### 基本用法

```tsx
import { MarkdownDashboard } from 'markdown-dashboard';

function App() {
  const markdown = `
:::dashboard{title="销售数据看板"}

## metrics
{"id": "m1", "title": "总销售额", "value": "¥128,430", "change": "+12.5%", "changeType": "positive"}
{"id": "m2", "title": "订单数", "value": "1,234", "change": "+8.2%", "changeType": "positive"}

## chart{"type": "line", "title": "销售趋势"}
[{"label": "周一", "value": 120}, {"label": "周二", "value": 200}, {"label": "周三", "value": 150}]

:::
  `;

  return <MarkdownDashboard markdown={markdown} />;
}
```

### 在 AI 流式输出中使用

```tsx
import { useState, useEffect } from 'react';
import { MarkdownDashboard } from 'markdown-dashboard';

function ChatWithDashboard({ aiResponse }) {
  // aiResponse 是流式输出的累积内容
  return (
    <div>
      <MarkdownDashboard markdown={aiResponse} />
    </div>
  );
}
```

## Markdown 语法

### 看板容器

```markdown
:::dashboard{title="看板标题"}
// 看板内容
:::
```

### 指标卡片 (metrics)

```markdown
## metrics
{"id": "m1", "title": "总销售额", "value": "¥128,430", "change": "+12.5%", "changeType": "positive"}
{"id": "m2", "title": "订单数", "value": "1,234", "change": "-3.2%", "changeType": "negative"}
```

参数说明:
- `id`: 唯一标识
- `title`: 指标名称
- `value`: 指标值
- `change`: 变化值（可选）
- `changeType`: 变化类型 `positive` | `negative` | `neutral`
- `icon`: 图标（可选）

### 图表 (chart)

```markdown
## chart{"type": "line", "title": "销售趋势"}
[{"label": "周一", "value": 120}, {"label": "周二", "value": 200}, {"label": "周三", "value": 150}]
```

图表类型:
- `line`: 折线图
- `bar`: 柱状图
- `pie`: 饼图
- `area`: 面积图

### 表格 (table)

```markdown
## table{"title": "产品排行"}
| 排名 | 产品 | 销量 |
|------|------|------|
| 1 | 产品 A | 1,234 |
| 2 | 产品 B | 987 |
```

### 进度条 (progress)

```markdown
## progress
{"id": "p1", "title": "目标完成率", "value": 75, "showPercentage": true}
```

### 状态指示器 (status)

```markdown
## status
{"id": "s1", "label": "系统状态", "status": "success", "message": "运行正常"}
{"id": "s2", "label": "警告信息", "status": "warning", "message": "需要关注"}
```

状态类型: `success` | `warning` | `error` | `info`

## 组件 API

### MarkdownDashboard

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| markdown | string | - | Markdown 格式的看板内容 |
| className | string | '' | 自定义类名 |
| onParseError | (error: Error) => void | - | 解析错误回调 |

### Dashboard

直接使用已解析的数据:

```tsx
import { Dashboard, parseDashboardMarkdown } from 'markdown-dashboard';

const result = parseDashboardMarkdown(markdown);
if (result) {
  return <Dashboard data={result.dashboard} />;
}
```

## 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建库
npm run build
```

## 许可证

ISC
