# Minimal Style Reference

极简主义风格，黑白灰配色，极简设计。适用于专业、严肃的业务场景。

## Design Philosophy

- **极简配色**：黑白灰为主，无彩色
- **边框分明**：用边框区分区域，不用阴影
- **间距紧凑**：元素紧凑，信息密度高
- **无装饰**：无圆角渐变，纯功能导向

---

## Color Palette

```css
:root {
  /* --- PRIMARY --- */
  --primary: #000000;
  --primary-hover: #333333;

  /* --- SEMANTIC --- */
  --success: #008000;
  --warning: #666666;
  --danger: #cc0000;

  /* --- BACKGROUND --- */
  --bg-base: #ffffff;
  --bg-card: #ffffff;
  --bg-panel: #f8f8f8;

  /* --- TEXT --- */
  --text: #000000;
  --text-secondary: #666666;
  --text-muted: #999999;

  /* --- BORDER --- */
  --border: #cccccc;
  --border-dark: #999999;

  /* --- NO SHADOW --- */
  --shadow-sm: none;
  --shadow-md: none;
  --shadow-lg: none;
}
```

---

## Typography

```css
:root {
  --font: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
}

/* Type Scale */
.title-lg    { font-size: 18px; font-weight: 700; }
.title-md    { font-size: 14px; font-weight: 700; }
.title-sm    { font-size: 13px; font-weight: 700; }
.body        { font-size: 14px; font-weight: 400; line-height: 1.5; }
.body-sm     { font-size: 13px; font-weight: 400; }
.caption     { font-size: 12px; font-weight: 400; }
```

---

## Spacing

```css
/* Page Layout */
.page-padding: 24px;
.section-gap: 16px;
.module-gap: 12px;

/* Component Padding */
.card-padding: 12px 16px;
.button-padding: 8px 16px;
.input-padding: 8px 12px;
```

---

## Components

### Header

```css
.header {
  background: var(--bg-card);
  border-bottom: 1px solid var(--border);
  padding: 0 24px;
}

.header-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--text);
}
```

### Card

```css
.card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 0;
  padding: 12px 16px;
}

.card-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--text);
  border-bottom: 1px solid var(--border);
  padding-bottom: 8px;
  margin-bottom: 12px;
}
```

### Button

```css
.btn {
  padding: 8px 16px;
  border: 1px solid var(--border);
  border-radius: 0;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
}

.btn-primary {
  background: var(--primary);
  color: #fff;
  border-color: var(--primary);
}

.btn-ghost {
  background: transparent;
  color: var(--text-secondary);
}
```

### Input

```css
.input-field {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 0;
  padding: 8px 12px;
  font-size: 13px;
}

.input-field:focus {
  border-color: var(--primary);
  outline: none;
}
```

### Badge

```css
.badge {
  font-size: 11px;
  padding: 2px 8px;
  border: 1px solid;
  border-radius: 0;
}

.badge-primary  { color: var(--primary); border-color: var(--primary); }
.badge-success  { color: var(--success); border-color: var(--success); }
.badge-danger   { color: var(--danger); border-color: var(--danger); }
```