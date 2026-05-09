# Component Library Reference

预定义UI组件模板。生成HTML时优先使用这些组件，减少交互成本。

---

## Page Layout

### Standard Layout

```html
<div class="page-grid">
  <!-- Header -->
  <div class="header">
    <div class="header-title">页面标题</div>
    <div class="header-subtitle">副标题</div>
    <div class="header-actions">
      <button class="btn btn-primary">主要操作</button>
    </div>
  </div>

  <!-- Main Content -->
  <div class="content-grid">
    <!-- Left: Main Area -->
    <div class="main-section">
      ...
    </div>

    <!-- Right: Sidebar -->
    <div class="sidebar-section">
      ...
    </div>
  </div>
</div>
```

---

## Header / Navigation

### With Progress

```html
<div class="header annotatable" data-section="顶部导航">
  <div class="nav-left">
    <div class="header-title">AI 评估系统</div>
    <div class="progress-indicator annotatable" data-section="进度指示器">
      <div class="step-pipeline">
        <div class="step-node">
          <div class="step-circle done">1</div>
          <span class="step-label">步骤1</span>
        </div>
        <div class="step-connector done"></div>
        <div class="step-node">
          <div class="step-circle active">2</div>
          <span class="step-label active">步骤2</span>
        </div>
        <div class="step-connector"></div>
        <div class="step-node">
          <div class="step-circle">3</div>
          <span class="step-label">步骤3</span>
        </div>
      </div>
    </div>
  </div>
  <div class="nav-right">
    <button class="btn btn-ghost">设置</button>
  </div>
</div>
```

---

## Card / Panel

### Info Card

```html
<div class="card annotatable" data-section="信息卡片">
  <div class="card-header">
    <div class="card-title">卡片标题</div>
    <div class="badge badge-primary">状态</div>
  </div>
  <div class="card-body">
    <div class="data-item">
      <div class="data-label">字段1</div>
      <div class="data-value">值1</div>
    </div>
    <div class="data-item">
      <div class="data-label">字段2</div>
      <div class="data-value">值2</div>
    </div>
  </div>
</div>
```

### Interaction Card (需用户操作)

```html
<div class="interaction-card annotatable" data-section="交互卡片">
  <div class="card-header">
    <span class="card-icon warning">⚠️</span>
    <span class="card-title">需要用户操作</span>
  </div>
  <div class="card-body">
    描述用户需要做什么...
  </div>
  <div class="card-actions">
    <button class="btn btn-primary" onclick="confirmAction()">确认</button>
    <button class="btn btn-ghost" onclick="cancelAction()">取消</button>
  </div>
</div>
```

---

## List / Table

### Data List

```html
<div class="list-section annotatable" data-section="数据列表">
  <div class="list-item">
    <div class="list-icon">●</div>
    <div class="list-title">项目1</div>
    <div class="list-status">状态1</div>
  </div>
  <div class="list-item">
    <div class="list-icon">●</div>
    <div class="list-title">项目2</div>
    <div class="list-status">状态2</div>
  </div>
</div>
```

### Trace List (执行步骤)

```html
<div class="trace-list annotatable" data-section="执行Trace">
  <div class="trace-entry">
    <div class="trace-status done">✓</div>
    <div class="trace-time">14:30:01</div>
    <div class="trace-action">接收测试输入</div>
  </div>
  <div class="trace-entry">
    <div class="trace-status running">◐</div>
    <div class="trace-time">14:30:05</div>
    <div class="trace-action">正在处理...</div>
  </div>
  <div class="trace-entry">
    <div class="trace-status error">✗</div>
    <div class="trace-time">14:30:10</div>
    <div class="trace-action" style="color: var(--danger);">错误: xxx</div>
  </div>
</div>
```

---

## Tabs

### Tab Navigation

```html
<div class="tabs-section annotatable" data-section="Tab切换">
  <div class="tabs-header">
    <button class="tab-btn active" data-tab="tab1" onclick="switchTab('tab1')">Tab 1</button>
    <button class="tab-btn" data-tab="tab2" onclick="switchTab('tab2')">Tab 2</button>
    <button class="tab-btn" data-tab="tab3" onclick="switchTab('tab3')">Tab 3</button>
  </div>
  <div class="tabs-body">
    <div class="tab-content active" id="tab1">内容1</div>
    <div class="tab-content" id="tab2">内容2</div>
    <div class="tab-content" id="tab3">内容3</div>
  </div>
</div>

<script>
function switchTab(tabName) {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabName);
  });
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.toggle('active', content.id === tabName);
  });
}
</script>
```

---

## Form / Input

### Input Field

```html
<div class="form-group annotatable" data-section="输入字段">
  <div class="input-label">字段名称</div>
  <input type="text" class="input-field" placeholder="请输入..." />
</div>
```

### Select

```html
<div class="form-group annotatable" data-section="下拉选择">
  <div class="input-label">选择选项</div>
  <select class="input-field">
    <option value="1">选项1</option>
    <option value="2">选项2</option>
    <option value="3">选项3</option>
  </select>
</div>
```

### Textarea

```html
<div class="form-group annotatable" data-section="文本输入">
  <div class="input-label">描述</div>
  <textarea class="input-field" rows="4" placeholder="请输入详细描述..."></textarea>
</div>
```

---

## Chat / Message

### Message Block

```html
<div class="message-block">
  <div class="message-header">
    <div class="role-badge evaluator">
      <div class="role-dot evaluator"></div>
      EVALUATOR
    </div>
  </div>
  <div class="message-body annotatable" data-section="消息内容">
    消息文本内容...
  </div>
</div>
```

### Chat Input Bar

```html
<div class="chat-input-bar annotatable" data-section="输入区">
  <input type="text" class="input-field" placeholder="输入消息..." />
  <button class="btn btn-primary">发送</button>
</div>
```

---

## Modal / Dialog

### Alert Modal

```html
<div class="modal-overlay hidden" id="alertModal">
  <div class="modal">
    <div class="modal-header">
      <div class="modal-title">提示</div>
      <div class="modal-close" onclick="closeModal()">×</div>
    </div>
    <div class="modal-body">
      提示内容...
    </div>
    <div class="modal-footer">
      <button class="btn btn-primary" onclick="closeModal()">确定</button>
    </div>
  </div>
</div>

<script>
function showModal() {
  document.getElementById('alertModal').classList.remove('hidden');
}
function closeModal() {
  document.getElementById('alertModal').classList.add('hidden');
}
</script>
```

---

## Score / Evaluation

### Score Display

```html
<div class="score-section annotatable" data-section="评估得分">
  <div class="score-value">85</div>
  <div class="score-label">/ 100</div>
  <div class="score-result pass">合格</div>
</div>
```

### Dimension Grid

```html
<div class="dimension-grid annotatable" data-section="评估维度">
  <div class="dimension-item">
    <div class="dimension-name">功能完整性</div>
    <div class="dimension-score pass">90</div>
  </div>
  <div class="dimension-item">
    <div class="dimension-name">交互质量</div>
    <div class="dimension-score warning">75</div>
  </div>
  <div class="dimension-item">
    <div class="dimension-name">流程合规</div>
    <div class="dimension-score pass">85</div>
  </div>
  <div class="dimension-item">
    <div class="dimension-name">问题解决</div>
    <div class="dimension-score fail">50</div>
  </div>
</div>
```

---

## Mock Data Template

Mock数据模板，生成真实感数据：

```javascript
// Mock用户数据
const mockUsers = [
  { id: 1, name: '张三', role: '管理员', status: 'active' },
  { id: 2, name: '李四', role: '普通用户', status: 'active' },
  { id: 3, name: '王五', role: '普通用户', status: 'inactive' }
];

// Mock时间戳
function mockTime() {
  const now = new Date();
  const offset = Math.floor(Math.random() * 10);
  return new Date(now - offset * 60000).toLocaleTimeString('zh-CN');
}

// Mock状态
const mockStatuses = ['进行中', '已完成', '待处理', '已取消'];

// Mock得分 (60-100)
function mockScore() {
  return Math.floor(Math.random() * 40) + 60;
}
```