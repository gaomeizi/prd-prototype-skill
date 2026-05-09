# Tech Style Reference

科技感风格，深色背景，渐变边框，适合数据可视化、监控面板、技术工具场景。

## Design Philosophy

- **深色背景**：暗色系背景，高对比度
- **渐变边框**：用渐变和发光效果
- **数据密集**：适合展示大量数据
- **动感元素**：脉冲动画、发光效果

---

## Color Palette

```css
:root {
  /* --- PRIMARY --- */
  --primary: #00d4ff;
  --primary-dark: #0099cc;

  /* --- SEMANTIC --- */
  --success: #00ff88;
  --warning: #ffb800;
  --danger: #ff3366;

  /* --- BACKGROUND --- */
  --bg-dark: #0a0a1a;
  --bg-card: #12122a;
  --bg-panel: #1a1a3a;

  /* --- TEXT --- */
  --text: #e0e0e0;
  --text-muted: #808090;

  /* --- BORDER --- */
  --border: #2a2a4a;

  /* --- SHADOW --- */
  --shadow-sm: 0 2px 4px rgba(0, 212, 255, 0.1);
  --shadow-md: 0 4px 12px rgba(0, 212, 255, 0.2);
  --shadow-glow: 0 0 20px rgba(0, 212, 255, 0.5);
}
```

---

## Typography

```css
:root {
  --font: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
}

/* Type Scale */
.title-lg    { font-size: 18px; font-weight: 600; letter-spacing: 1px; }
.title-md    { font-size: 14px; font-weight: 600; }
.body        { font-size: 13px; line-height: 1.6; }
.body-sm     { font-size: 12px; }
.code        { font-family: var(--font-mono); font-size: 12px; }
```

---

## Components

### Header

```css
.header {
  background: linear-gradient(180deg, #1a1a3a 0%, #12122a 100%);
  border-bottom: 2px solid var(--primary);
  padding: 0 24px;
}

.header-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--primary);
  letter-spacing: 1px;
}
```

### Card

```css
.card {
  background: var(--bg-panel);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 14px;
}

.card-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--primary);
}

/* Gradient Border Card */
.card-gradient {
  border: 1px solid;
  border-image: linear-gradient(135deg, var(--primary), var(--success)) 1;
}
```

### Button

```css
.btn {
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
}

.btn-primary {
  background: var(--primary);
  color: #0a0a1a;
}

.btn-primary:hover {
  box-shadow: 0 0 12px rgba(0, 212, 255, 0.4);
}

.btn-ghost {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text-muted);
}

.btn-ghost:hover {
  border-color: var(--primary);
  color: var(--primary);
}
```

### Badge

```css
.badge {
  font-size: 10px;
  padding: 3px 8px;
  border-radius: 4px;
}

.badge-primary  { background: rgba(0, 212, 255, 0.2); color: var(--primary); }
.badge-success  { background: rgba(0, 255, 136, 0.2); color: var(--success); }
.badge-danger   { background: rgba(255, 51, 102, 0.2); color: var(--danger); }
```

### Progress / Pipeline

```css
.step-circle {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--bg-card);
  border: 2px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
}

.step-circle.active {
  background: var(--primary);
  border-color: var(--primary);
  color: #0a0a1a;
  box-shadow: 0 0 12px rgba(0, 212, 255, 0.5);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { box-shadow: 0 0 12px rgba(0, 212, 255, 0.5); }
  50% { box-shadow: 0 0 20px rgba(0, 212, 255, 0.8); }
}
```

### Trace / Data List

```css
.trace-entry {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  background: var(--bg-dark);
  border-radius: 6px;
  margin-bottom: 6px;
}

.trace-status {
  width: 20px;
  height: 20px;
  font-size: 10px;
}

.trace-status.done    { color: var(--success); }
.trace-status.running { color: var(--primary); }
.trace-status.error   { color: var(--danger); }
```