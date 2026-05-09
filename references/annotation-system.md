# Annotation System Reference

标注系统设计规范。所有生成的原型HTML必须包含标注系统，让用户能直观提出修改意见。

## Design Philosophy

标注系统必须：
- **不干扰正常交互**：用户验证交互时，不会误触发标注
- **操作简单**：悬停显示图标，点击即可标注
- **反馈清晰**：已标注元素有视觉提示
- **提交方便**：一键导出或WebSocket实时提交

---

## Annotation Trigger Methods

### Method 1: Hover Icon

用户悬停在可标注元素上，显示标注图标：

```css
.annotate-icon {
  position: absolute;
  right: 12px;
  top: 12px;
  width: 26px;
  height: 26px;
  background: var(--primary);
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s;
  z-index: 10;
}

.annotatable:hover .annotate-icon {
  opacity: 1;
}
```

### Method 2: Double Click

双击元素触发标注：

```javascript
el.addEventListener('dblclick', function(e) {
  e.stopPropagation();
  addAnnotation(this.dataset.section, this);
});
```

---

## Annotation Panel

标注面板显示所有已添加的标注：

```css
.annotation-panel {
  position: fixed;
  right: 420px;
  top: 100px;
  width: 300px;
  background: var(--bg-card);
  border-radius: 16px;
  box-shadow: var(--shadow-lg);
  z-index: 999;
}

.annotation-header {
  padding: 16px 20px;
  background: var(--primary);
  color: #fff;
  font-weight: 600;
}

.annotation-list {
  max-height: 320px;
  overflow-y: auto;
  padding: 20px;
}

.annotation-item {
  background: rgba(255, 149, 0, 0.1);
  border: 1px solid rgba(255, 149, 0, 0.3);
  padding: 12px 16px;
  border-radius: 10px;
  margin-bottom: 10px;
}
```

---

## Annotation Data Structure

每个标注包含：

```javascript
{
  section: "顶部导航栏",       // 标注区域名称
  comment: "间距太大，需要调整", // 用户修改意见
  element: HTMLElement        // 标注元素（可选）
}
```

---

## Annotation Export Format

导出为Markdown格式，方便用户粘贴给AI：

```markdown
# 前端原型标注导出

## 标注列表

### 标注 1
- **界面位置**: 顶部导航栏
- **修改意见**: 间距太大，需要调整

### 标注 2
- **界面位置**: 提交按钮
- **修改意见**: 按钮颜色不够明显
```

---

## WebSocket Submission

标注通过WebSocket实时提交：

```javascript
// HTML端
const ws = new WebSocket('ws://localhost:8089');

function submitAnnotations() {
  ws.send(JSON.stringify({
    type: 'annotations',
    data: annotations,
    timestamp: Date.now()
  }));
}

// Skill端（annotation-server.js）
wss.on('connection', ws => {
  ws.on('message', message => {
    const data = JSON.parse(message);
    if (data.type === 'annotations') {
      // Claude读取标注，修改MD + HTML
    }
  });
});
```

---

## Marking Annotated Elements

已标注元素需要视觉提示：

```css
.annotatable.has-annotation {
  border-color: var(--warning) !important;
}

.annotatable.has-annotation .annotate-icon {
  background: var(--warning);
  opacity: 1;
}
```

---

## Implementation Code

完整标注系统JavaScript实现：

```javascript
let annotations = [];

// 添加标注图标
document.querySelectorAll('.annotatable').forEach(el => {
  const icon = document.createElement('span');
  icon.className = 'annotate-icon';
  icon.innerHTML = '📌';
  icon.onclick = function(e) {
    e.stopPropagation();
    const section = el.dataset.section;
    addAnnotation(section, el);
  };
  el.appendChild(icon);

  // 双击标注
  el.addEventListener('dblclick', function(e) {
    e.stopPropagation();
    addAnnotation(this.dataset.section, this);
  });
});

function addAnnotation(section, element) {
  const text = prompt('修改意见:');
  if (!text) return;
  annotations.push({ section: section, comment: text });
  element.classList.add('has-annotation');
  updateAnnotationList();
}

function updateAnnotationList() {
  const listEl = document.getElementById('annotationList');
  const countEl = document.getElementById('annotationCount');
  countEl.textContent = annotations.length;

  if (annotations.length === 0) {
    listEl.innerHTML = '<p>悬停显示图标添加标注<br>或双击元素添加标注</p>';
    return;
  }

  listEl.innerHTML = annotations.map(a => `
    <div class="annotation-item">
      <div style="font-weight: 500;">📍 ${a.section}</div>
      <div style="margin-top: 6px;">${a.comment}</div>
    </div>
  `).join('');
}

function exportAnnotations() {
  if (annotations.length === 0) {
    alert('暂无标注');
    return;
  }
  let text = '# 前端原型标注导出\n\n## 标注列表\n\n';
  annotations.forEach((a, i) => {
    text += `### 标注 ${i + 1}\n- **界面位置**: ${a.section}\n- **修改意见**: ${a.comment}\n\n`;
  });
  navigator.clipboard.writeText(text);
  alert('标注已导出！请粘贴给AI处理。');
}

function submitToWebSocket() {
  const ws = new WebSocket('ws://localhost:8089');
  ws.onopen = () => {
    ws.send(JSON.stringify(annotations));
    alert('标注已提交！AI正在处理...');
  };
}
```

---

## Marking Elements for Annotation

HTML中哪些元素可以标注？

所有需要用户反馈的元素都应添加：
- `class="annotatable"`
- `data-section="区域名称"`

示例：

```html
<div class="header annotatable" data-section="顶部导航栏">
  ...
</div>

<button class="btn btn-primary annotatable" data-section="提交按钮">
  提交
</button>

<div class="card annotatable" data-section="用户信息卡片">
  ...
</div>
```

---

## Annotation Panel Position

标注面板位置根据风格调整：

| 风格 | 面板位置 |
|------|---------|
| Apple | 固定右侧，top: 100px |
| Minimal | 固定右上角 |
| Tech | 固定左侧，暗色背景 |

---

## Best Practices

1. **关键交互元素标注**：按钮、表单、卡片
2. **布局区域标注**：header、sidebar、main content
3. **数据展示区域标注**：表格、列表、图表
4. **避免标注过于细节**：不要给每个小元素都添加标注能力
5. **标注区域命名清晰**：data-section用中文描述，易于理解