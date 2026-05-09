# Style Inherit Reference

继承已有项目风格的规则。用于已有项目或用户提供风格参考URL的情况。

## When to Use

- 用户选择"继承已有项目风格"
- 用户提供风格参考URL
- 用户要求与现有前端保持一致

---

## Style Extraction Process

### From Existing Frontend Code

1. **定位CSS文件**
   - 查找 `styles.css`, `main.css`, `app.css`, `index.css`
   - 或Vue/React组件内的style标签

2. **提取CSS变量**
   ```css
   :root {
     --primary: #xxx;
     --bg-base: #xxx;
     --text: #xxx;
     --border: #xxx;
     ...
   }
   ```

3. **识别设计模式**
   - 圆角大小（border-radius）
   - 阴影样式（box-shadow）
   - 间距规范（padding, gap）
   - 字体设置（font-family）

4. **应用继承样式**
   - 将提取的CSS变量应用到生成的HTML
   - 保持组件风格一致性

### From Reference URL

1. **访问URL**
2. **分析页面设计**
   - 主色调、背景色、文字颜色
   - 按钮、卡片、表单样式
   - 整体视觉风格

3. **生成CSS变量**
   - 根据分析结果创建CSS变量
   - 应用到生成的HTML

---

## Inheritance Rules

### Must Inherit

| 元素 | 说明 |
|------|------|
| Primary Color | 主色调，决定整体风格 |
| Background | 背景色，影响整体观感 |
| Text Color | 文字颜色，影响可读性 |
| Border Radius | 圆角大小，影响视觉柔和度 |
| Font Family | 字体，影响整体风格 |

### Can Override

| 元素 | 说明 |
|------|------|
| 标注系统样式 | 标注图标和面板可保持统一 |
| WebSocket通知 | 实时提示样式可保持统一 |
| Mock数据展示 | 数据展示样式可灵活调整 |

---

## Style Merging Strategy

当原项目样式与标注系统冲突时：

```css
/* 原项目样式优先 */
.card {
  /* 使用原项目的卡片样式 */
}

/* 标注系统叠加 */
.card.annotatable:hover {
  /* 标注hover效果，不影响原样式 */
  outline: 2px dashed var(--warning);
}

.annotate-icon {
  /* 标注图标统一样式，不受原项目影响 */
  background: var(--primary);
  color: #fff;
}
```

---

## Example: Extracting from Existing Code

```javascript
// 分析现有CSS
const existingStyles = {
  colors: {
    primary: extractColor('.btn-primary'),
    background: extractColor('.main-container'),
    text: extractColor('body'),
    border: extractBorderColor('.card')
  },
  spacing: {
    cardPadding: extractPadding('.card'),
    buttonPadding: extractPadding('.btn'),
    gap: extractGap('.grid-layout')
  },
  radius: {
    cardRadius: extractRadius('.card'),
    buttonRadius: extractRadius('.btn')
  },
  shadows: {
    cardShadow: extractShadow('.card'),
    buttonShadow: extractShadow('.btn:hover')
  }
};

// 应用到生成HTML
function applyInheritedStyles(existingStyles) {
  const cssVars = `
    :root {
      --primary: ${existingStyles.colors.primary};
      --bg-base: ${existingStyles.colors.background};
      --text: ${existingStyles.colors.text};
      --border: ${existingStyles.colors.border};
      --card-padding: ${existingStyles.spacing.cardPadding};
      --radius-card: ${existingStyles.radius.cardRadius};
      --shadow-card: ${existingStyles.shadows.cardShadow};
    }
  `;
  return cssVars;
}
```

---

## Handling Style Conflicts

**原则：原项目样式优先，标注系统功能不妥协**

| 场景 | 解决方案 |
|------|---------|
| 原项目使用暗色主题 | 继承暗色，标注图标用亮色对比 |
| 原项目无CSS变量 | 从具体样式提取，生成变量 |
| 原项目样式不完整 | 继承已有样式，缺失部分用默认值 |
| 原项目使用特殊字体 | 继承字体，但保持标注系统可读性 |

---

## Default Fallback

当无法提取样式时，使用苹果风格作为fallback：

```css
/* 无法继承时，使用默认样式 */
:root {
  --primary: #0071e3;
  --bg-base: #f5f5f7;
  --text: #1d1d1f;
  --border: #d2d2d7;
}
```