import React from 'react';
import ReactDOM from 'react-dom/client';
import { MarkdownDashboard } from './index';
import { generateExampleMarkdown } from './utils/parser';

// 示例应用 - 展示如何使用 MarkdownDashboard 组件
const App: React.FC = () => {
  const exampleMarkdown = generateExampleMarkdown();

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <MarkdownDashboard markdown={exampleMarkdown} />
    </div>
  );
};

export default App;
