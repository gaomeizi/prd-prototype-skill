# Apple Style Reference

苹果设计风格的完整CSS规范。适用于生成简洁、现代、易用的原型界面。

## Design Philosophy

- **留白充足**：间距大，元素不拥挤
- **圆角柔和**：12px-20px圆角
- **阴影轻柔**：多层次柔和阴影，不突兀
- **色彩克制**：主色鲜明，背景和中性色偏灰白
- **字体清晰**：系统字体，层级分明

---

## Color Palette

```css
:root {
  /* --- PRIMARY --- */
  --primary: #0071e3;
  --primary-hover: #0077ed;

  /* --- SEMANTIC --- */
  --success: #34c759;
  --warning: #ff9500;
  --danger: #ff3b30;

  /* --- BACKGROUND --- */
  --bg-base: #f5f5f7;
  --bg-card: #ffffff;
  --bg-panel: #ffffff;

  /* --- TEXT --- */
  --text: #1d1d1f;
  --text-secondary: #6e6e73;
  --text-muted: #86868b;

  /* --- BORDER --- */
  --border: #d2d2d7;

  /* --- SHADOW --- */
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.04);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.08);
  --shadow-lg: 0 8px 24px rgba(0,0,0,0.12);
}
```

---

## Typography

```css
:root {
  --font: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Type Scale */
.title-lg    { font-size: 20px; font-weight: 600; }
.title-md    { font-size: 16px; font-weight: 600; }
.title-sm    { font-size: 14px; font-weight: 600; }
.body        { font-size: 14px; font-weight: 400; line-height: 1.6; }
.body-sm     { font-size: 13px; font-weight: 400; }
.caption     { font-size: 12px; font-weight: 500; }
.label       { font-size: 12px; font-weight: 500; color: var(--text-secondary); }
```

---

## Spacing

```css
/* Page Layout */
.page-padding: 48px;       /* 页面左右边距 */
.section-gap: 24px;        /* 模块间距 */
.module-gap: 16px;         /* 模块内部间距 */

/* Component Padding */
.card-padding: 16px 20px;
.button-padding: 12px 24px;
.input-padding: 12px 18px;
.list-item-padding: 12px 16px;
```

---

## Layout

```css
/* Page Grid */
.page-grid {
  display: grid;
  grid-template-rows: 80px 1fr;
  height: 100vh;
  gap: 24px;
  padding: 24px 48px;
  max-width: 1600px;
  margin: 0 auto;
}

/* Content Grid */
.content-grid {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 24px;
}

/* Flex Align */
.flex-center  { display: flex; align-items: center; justify-content: center; }
.flex-between { display: flex; align-items: center; justify-content: space-between; }
.flex-start   { display: flex; align-items: center; justify-content: flex-start; }
```

---

## Components

### Header / Navigation Bar

```css
.header {
  background: var(--bg-card);
  border-radius: 20px;
  padding: 0 40px;
  box-shadow: var(--shadow-md);
  display: flex;
  align-items: center;
}

.header-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--text);
}

.header-subtitle {
  font-size: 13px;
  color: var(--text-secondary);
}
```

### Card

```css
.card {
  background: var(--bg-base);
  border-radius: 16px;
  padding: 16px 20px;
  box-shadow: var(--shadow-sm);
}

.card-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 14px;
}

.card-content {
  font-size: 14px;
  color: var(--text-secondary);
}
```

### Button

```css
.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-primary {
  background: var(--primary);
  color: #fff;
}

.btn-primary:hover {
  background: var(--primary-hover);
  transform: translateY(-1px);
}

.btn-ghost {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text-secondary);
}

.btn-ghost:hover {
  background: var(--bg-base);
}

.btn-danger {
  background: var(--danger);
  color: #fff;
}
```

### Input / Form

```css
.input-field {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 12px 18px;
  font-size: 14px;
  color: var(--text);
}

.input-field:focus {
  border-color: var(--primary);
  outline: none;
  box-shadow: 0 0 0 3px rgba(0, 113, 227, 0.2);
}

.input-label {
  font-size: 12px;
  color: var(--text-secondary);
  font-weight: 500;
  margin-bottom: 8px;
}
```

### Badge / Tag

```css
.badge {
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 6px;
  font-weight: 500;
}

.badge-primary  { background: rgba(0, 113, 227, 0.1); color: var(--primary); }
.badge-success  { background: rgba(52, 199, 89, 0.1); color: var(--success); }
.badge-warning  { background: rgba(255, 149, 0, 0.1); color: var(--warning); }
.badge-danger   { background: rgba(255, 59, 48, 0.1); color: var(--danger); }
```

### List Item

```css
.list-item {
  background: var(--bg-card);
  border-radius: 10px;
  padding: 12px 16px;
  box-shadow: var(--shadow-sm);
  margin-bottom: 8px;
}
```

### Progress / Step Indicator

```css
.step-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--bg-card);
  border: 2px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-muted);
}

.step-circle.done {
  background: var(--success);
  border-color: var(--success);
  color: #fff;
}

.step-circle.active {
  background: var(--primary);
  border-color: var(--primary);
  color: #fff;
  box-shadow: 0 0 0 4px rgba(0, 113, 227, 0.2);
}
```

### Modal / Dialog

```css
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(4px);
}

.modal {
  background: var(--bg-card);
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}
```

---

## Scrollbar

```css
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #d2d2d7;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a1a1a6;
}
```

---

## Animation

```css
/* Hover */
.btn:hover { transform: translateY(-1px); }

/* Focus */
.input-field:focus { box-shadow: 0 0 0 3px rgba(0, 113, 227, 0.2); }

/* Transition */
* { transition: all 0.2s ease; }
```