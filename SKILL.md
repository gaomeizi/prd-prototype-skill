---
name: prd-prototype
description: "将PRD文档转换为可交互的前端原型，支持用户标注修改意见，AI实时响应修改。用于新项目（从PRD生成原型）和已有项目（为现有前端添加标注系统）。触发词：'生成原型', '前端原型', '标注修改', '可视化需求', '交互原型', '评审前端', 'mock-api', '生成mock'。"
---

# PRD-Prototype

将PRD需求文档转换为可交互的前端原型HTML，让产品经理和开发者能直观验证交互逻辑，并通过标注系统直接提出修改意见，AI自动响应修改。

## First-Run Welcome

首次触发时，向用户介绍：

> **我可以将PRD文档转换为可交互的前端原型，让你直观验证交互逻辑，并直接标注修改意见。**
>
> 使用方式：
> - **生成原型**：提供PRD文档路径，生成完整交互原型
> - **标注已有前端**：提供前端代码路径，添加标注系统
> - **仅生成mock**：提供PRD或API描述，生成mock数据
>
> 启动后进入监听模式，用户在HTML页面标注 → 提交 → AI自动处理（无需额外触发）

---

## Three Entry Points

### Entry 1: Generate Prototype (完整流程)

触发词：`生成原型`, `前端原型`, `交互原型`

```
用户输入: 生成原型 docs/product-design.md

执行流程:
Phase 1: Analysis → 读取PRD，提取前端设计
Phase 2: Style → 选择风格（询问或默认apple）
Phase 3: Mock → 生成mock数据
Phase 4: HTML → 生成交互原型 + 标注系统
Phase 5: Service → 启动HTTP + 标注监听 + 进入loop模式
```

### Entry 2: Add Annotation (已有项目)

触发词：`标注修改`, `评审前端`

```
用户输入: 为 src/pages/dashboard.vue 添加标注系统

执行流程:
Phase 1: Analysis → 分析现有代码和样式
Phase 2: Inherit → 继承原有风格
Phase 3: Inject → 注入标注系统（不破坏原有交互）
Phase 4: Service → 启动服务 + 进入loop模式
```

### Entry 3: Mock Only (独立调用)

触发词：`mock-api`, `生成mock`

```
用户输入: mock-api docs/api-design.md

执行流程:
Phase 1: Analysis → 分析API设计
Phase 2: Mock → 生成mock数据和服务
Phase 3: Output → 输出mock-data.json + mock-server.js
（不生成前端，不启动loop）
```

---

## The Process

### Phase 1: Analysis

**新项目（PRD文档）：**
- 定位前端设计章节
- 提取：页面布局、交互流程、表单字段、按钮动作、数据展示
- 分析场景和用例

**已有项目（前端代码）：**
- 识别主要页面和组件
- 提取现有样式和交互逻辑
- 理解API调用模式

**Mock Only：**
- 分析API描述或PRD中的API章节
- 提取：接口路径、请求参数、响应结构

详细规则见 `references/mock-patterns.md`

### Phase 2: Style Decision

默认使用苹果风格。用户可选：
- `minimal` - 简约（黑白灰）
- `apple` - 苹果（圆角、留白）
- `tech` - 科技（深色、渐变）
- `inherit` - 继承已有项目

风格规范见 `references/style-*.md`

### Phase 3: Mock Generation

生成真实感mock数据：
- 中文姓名、产品名
- 当前日期附近时间戳
- 合理数量和数值

Mock模板见 `references/mock-templates.md`

### Phase 4: HTML Generation

使用预定义组件生成原型：
- 结构：header + main + sidebar
- 交互：按钮可点击、表单可填写、流程可执行
- 标注系统：悬停图标 + 提交按钮 + 写入json

组件模板见 `references/component-library.md`
标注系统见 `references/annotation-system.md`

### Phase 5: Service & Loop

启动服务并进入监听模式：

```bash
# 后台启动HTTP服务
python3 -m http.server 8088 --directory ./prototype &

# 后台启动标注监听（写入json）
# 内置于HTML，提交时写入annotations.json

# 进入loop模式
ScheduleWakeup(60秒) → 检查annotations.json → 有内容则处理
```

---

## Loop Mode

进入监听模式后，Claude自动响应标注：

```
每60秒唤醒:
  检查 annotations.json 是否存在且有内容
  有 → 读取标注 → 分析修改类型 → 修改HTML（必要时同步修改PRD文档）→ 清空json → 继续等待
  无 → 继续等待
```

**标注处理详细流程：**

```
检测到标注后:
1. 读取annotations.json，解析所有标注
2. 对每个标注进行分析:
   a. 判断是否涉及需求修改（功能逻辑、文案、流程等）
   b. 如果涉及需求 → 同时修改HTML + PRD文档
   c. 如果纯UI调整 → 仅修改HTML
3. 清空annotations.json
4. 继续监听
```

**用户无需任何触发，标注提交后最多60秒自动处理。**

---

## Output Structure

```
prototype/
├── prototype.html      # 主原型（含CSS + JS + Mock + 标注系统）
├── annotations.json    # 标注存储（提交时写入）
└── mock-data.json      # Mock数据（可选）
```

---

## Mandatory Requirements

生成的HTML必须包含：

1. **完整CSS**（基于选定风格）
2. **Mock数据**（真实感数据）
3. **标注系统**（悬停图标、提交按钮、写入json功能）—— **必须内置，不可省略**
4. **交互逻辑**（按钮可点击、流程可执行）
5. **标注服务器**（Node.js服务器接收POST请求并写入annotations.json）

**标注系统是核心功能，所有生成的原型HTML都必须默认包含完整的标注能力。**

---

## Annotation Processing Rules

当检测到标注内容时，按以下规则处理：

### 1. 判断是否涉及需求修改

| 标注类型 | 处理方式 |
|---------|---------|
| 纯UI/交互调整（样式、布局、按钮位置等） | 仅修改HTML |
| 功能逻辑调整（流程变更、新增功能、删除功能等） | 同时修改HTML + PRD文档 |
| 文案调整（标题、提示语、按钮文字等） | 同时修改HTML + PRD文档 |
| 新增Mock数据或交互 | 仅修改HTML |

### 2. 同步修改PRD文档

当标注涉及需求修改时：

```
处理流程:
1. 解析标注内容，识别修改类型
2. 定位PRD文档中对应章节
3. 修改HTML原型
4. 同步修改PRD文档对应内容
5. 在PRD文档末尾添加修改记录（可选）

修改记录格式:
---
## 修改记录
- 2026-05-09: [标注ID] 修改XX功能 → YY（来源：用户标注）
---
```

### 3. 保持文档一致性

- HTML与PRD文档保持同步
- 用户可从PRD文档追溯到HTML原型
- 修改日志记录每次标注变更

---

## Gotchas

| 问题 | 解决方案 |
|------|---------|
| PRD无前端设计 | 询问是否AI生成设计建议 |
| 前端代码复杂 | 提取主要页面，简化原型 |
| 用户未选风格 | 默认apple风格 |
| 标注交互冲突 | 悬停图标触发，不影响正常交互 |
| Loop期间用户输入 | ScheduleWakeup只在idle时触发，不打断 |

---

## Example

**完整流程：**
```
User: 生成原型 docs/product-design.md

Claude:
1. 读取PRD，分析前端设计
2. 风格：apple（默认）
3. 生成mock数据
4. 输出 prototype.html
5. 启动服务: http://localhost:8088
6. 进入loop模式，每60秒检查标注

（用户在浏览器标注 → 提交 → Claude自动处理 → 页面刷新）
```

**仅Mock：**
```
User: mock-api docs/api-design.md

Claude:
1. 分析API设计
2. 输出 mock-data.json + mock-server.js
（不启动loop，不生成前端）
```