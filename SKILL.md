---
name: prd-prototype
description: "将PRD文档转换为可交互的前端原型（Vue3 CDN组件化）+ Mock API Server + 标注反馈系统。前后端分离架构，开发只需实现后端API即可交付。触发词：'生成原型', '前端原型', '交互原型'。"
---

# PRD-Prototype v2.0

**前后端分离 · 组件化 · Mock API 驱动**

> 产品经理验证需求 → 开发实现后端 → 直接交付

---

## 核心理念

1. **前端 = 可运行的设计稿**：Vue3 CDN 组件化，无需构建，直接打开浏览器运行
2. **API = 契约**：前端通过统一 API 层调用，改一行 baseURL 即可切换 Mock/真实后端
3. **Mock Server = 后端蓝图**：提供完整 REST API + 自动生成的 OpenAPI 文档，后端照着实现即可
4. **标注驱动迭代**：产品经理在原型上标注 → Claude 自动修改前端 + 同步 PRD

---

## 架构

```
┌─────────────────────────────────────────────────────────────┐
│                        用户输入                              │
│              "生成原型 docs/prd/PRD-BU管理端.md"            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Claude 自动执行                         │
│  1. Read PRD                                                │
│  2. Read references (风格/组件/标注/前端架构/Mock API规范)   │
│  3. 生成前端代码 (Vue3 CDN 组件化)                           │
│  4. 生成 Mock API Server (Express + OpenAPI文档)            │
│  5. Write 所有文件                                          │
│  6. Bash: 启动 Mock Server + 标注 Server                   │
│  7. CronCreate: 监听标注循环                                │
│  8. 返回访问地址 + API文档地址                              │
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              │                               │
              ▼                               ▼
    ┌──────────────────┐          ┌──────────────────────┐
    │   产品经理        │          │      后端开发        │
    │  打开浏览器        │          │  阅读 openapi.json   │
    │  http://localhost  │          │  实现相同接口         │
    │  添加标注         │          │  改前端 config.js    │
    │  → 提交          │          │  一行切换真实后端     │
    └──────────────────┘          └──────────────────────┘
              │                               │
              │        改 baseURL             │
              │   ┌─────────────────────┐    │
              └──→│  前端 (Vue3 CDN)     │←───┘
                  │  src/api/config.js   │
                  │  BASE_URL 切换       │
                  └─────────────────────┘
                              │
                              ▼
                  ┌─────────────────────┐
                  │  Mock API Server    │
                  │  localhost:8089/api │
                  │  + OpenAPI 文档     │
                  └─────────────────────┘
```

---

## 输出目录结构

```
{output_dir}/
├── frontend/                    # 前端（Vue3 CDN，直接运行）
│   ├── index.html               # 入口：CDN引入Vue3 + Router + Pinia
│   ├── src/
│   │   ├── main.js              # Vue应用入口
│   │   ├── api/
│   │   │   ├── config.js        # ⭐ baseURL 配置（开发改这一行）
│   │   │   ├── request.js       # fetch封装（loading/error处理）
│   │   │   └── modules/
│   │   │       ├── courses.js   # 课程API：getCourses/createCourse/...
│   │   │       ├── tags.js      # 标签API
│   │   │       └── instructors.js # 讲师API
│   │   ├── components/          # 复用组件
│   │   │   ├── CourseCard.vue
│   │   │   ├── CourseForm.vue
│   │   │   ├── TagSelector.vue
│   │   │   ├── AnnotationPanel.vue
│   │   │   └── ...
│   │   ├── views/               # 页面级组件
│   │   │   ├── LoginView.vue
│   │   │   ├── DashboardView.vue
│   │   │   ├── CourseListView.vue
│   │   │   ├── TagManageView.vue
│   │   │   └── ...
│   │   ├── stores/              # Pinia状态管理
│   │   │   └── index.js
│   │   ├── router/
│   │   │   └── index.js
│   │   └── utils/
│   │       └── mockData.js      # Mock数据生成器
│   └── assets/
│       └── style.css            # 全局样式
│
├── backend/                     # Mock后端（Node.js Express）
│   ├── server.js                # Express入口
│   ├── routes/
│   │   ├── courses.js           # REST路由：GET/POST/PUT/DELETE
│   │   ├── tags.js
│   │   └── instructors.js
│   ├── models/
│   │   └── data.js              # 内存数据模型（数组+CRUD方法）
│   ├── middleware/
│   │   ├── cors.js
│   │   └── auth.js              # JWT模拟中间件
│   └── docs/
│       └── openapi.json         # ⭐ 自动生成的API文档（给后端看）
│
├── annotations.json             # 标注存储
└── README.md                    # 交付文档：如何切换真实后端
```

---

## 关键设计

### 前端：Vue3 CDN 组件化

**不需要 npm install / build**。直接打开 `index.html` 运行。

```html
<!-- index.html -->
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
<script src="https://unpkg.com/vue-router@4/dist/vue-router.global.js"></script>
<script src="https://unpkg.com/pinia@2/dist/pinia.iife.js"></script>
```

组件用**字符串模板**方式定义（无需构建工具）：

```javascript
// CourseCard.vue → CourseCard.js
const CourseCard = {
  props: ['course'],
  template: `
    <div class="course-card" @click="$emit('click', course)">
      <div class="course-header">
        <span class="course-name">{{ course.name }}</span>
        <span :class="['badge', course.status]">{{ statusText }}</span>
      </div>
      <div class="course-tags">
        <tag-item v-for="tag in course.tags" :key="tag.id" :tag="tag" />
      </div>
    </div>
  `,
  computed: {
    statusText() { return this.course.status === 'published' ? '已发布' : '草稿'; }
  }
};
```

### API 层：一键切换后端

```javascript
// src/api/config.js
// 开发只需改这一行
export const BASE_URL = 'http://localhost:8089/api';  // Mock
// export const BASE_URL = 'https://api.production.com/api';  // 真实后端

export const API_TIMEOUT = 10000;
export const TOKEN_KEY = 'bu_admin_token';
```

```javascript
// src/api/request.js
import { BASE_URL, API_TIMEOUT } from './config.js';

export async function request(url, options = {}) {
  const token = localStorage.getItem('bu_admin_token');
  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers
    }
  });
  const data = await res.json();
  if (data.code !== 0) throw new Error(data.message);
  return data.data;
}

export const get = (url) => request(url);
export const post = (url, body) => request(url, { method: 'POST', body: JSON.stringify(body) });
export const put = (url, body) => request(url, { method: 'PUT', body: JSON.stringify(body) });
export const del = (url) => request(url, { method: 'DELETE' });
```

```javascript
// src/api/modules/courses.js
import { get, post, put, del } from '../request.js';

export const CourseAPI = {
  getList: (params) => get(`/courses?${new URLSearchParams(params)}`),
  getById: (id) => get(`/courses/${id}`),
  create: (data) => post('/courses', data),
  update: (id, data) => put(`/courses/${id}`, data),
  delete: (id) => del(`/courses/${id}`),
  publish: (id) => post(`/courses/${id}/publish`),
  getSop: (id) => get(`/courses/${id}/sop`)
};
```

### Mock Server：RESTful API

```javascript
// backend/server.js
const express = require('express');
const app = express();
app.use(express.json());
app.use(require('./middleware/cors'));

// 自动加载路由
app.use('/api/courses', require('./routes/courses'));
app.use('/api/tags', require('./routes/tags'));
app.use('/api/instructors', require('./routes/instructors'));

// OpenAPI文档
app.get('/api/docs', (req, res) => {
  res.json(require('./docs/openapi.json'));
});

app.listen(8089, () => console.log('Mock API: http://localhost:8089/api'));
```

```javascript
// backend/routes/courses.js
const router = require('express').Router();
const { courses } = require('../models/data');

router.get('/', (req, res) => {
  const { keyword, tagIds, page = 1, pageSize = 20 } = req.query;
  let data = courses;
  if (keyword) data = data.filter(c => c.name.includes(keyword));
  // ...过滤逻辑
  res.json({ code: 0, data: { list: data, total: data.length } });
});

router.post('/', (req, res) => {
  const course = { id: Date.now(), ...req.body, status: 'draft', createdAt: new Date() };
  courses.unshift(course);
  res.json({ code: 0, data: course });
});

module.exports = router;
```

### 标注系统

前端标注通过 `fetch POST http://localhost:8088/annotations` 提交。
标注服务器独立运行，不影响 Mock API。

---

## 全自动执行流程

### Phase 1: 读取PRD

使用 Read 工具读取用户指定的 PRD 文档路径。

### Phase 2: 加载参考资料

按顺序读取：
```
references/style-{apple|minimal|tech}.md   → 视觉风格
references/component-library.md            → UI组件
references/annotation-system.md            → 标注系统
references/frontend-architecture.md        → 前端架构规范
references/mock-api-spec.md                → Mock API规范
```

### Phase 3: 生成前端代码

基于 PRD 和参考资料，生成完整的前端代码：

1. `frontend/index.html` — CDN引入Vue3 + Router + Pinia
2. `frontend/src/main.js` — Vue应用入口
3. `frontend/src/api/config.js` — baseURL配置
4. `frontend/src/api/request.js` — 请求封装
5. `frontend/src/api/modules/*.js` — 各模块API
6. `frontend/src/components/*.js` — 复用组件
7. `frontend/src/views/*.js` — 页面组件
8. `frontend/src/router/index.js` — 路由配置
9. `frontend/src/stores/index.js` — Pinia状态管理
10. `frontend/assets/style.css` — 全局样式

### Phase 4: 生成 Mock 后端

1. `backend/server.js` — Express入口
2. `backend/routes/*.js` — REST路由
3. `backend/models/data.js` — 内存数据模型
4. `backend/middleware/*.js` — 中间件
5. `backend/docs/openapi.json` — 自动生成的API文档

### Phase 5: 启动服务

使用 Bash 执行：
```bash
cd ~/.claude/skills/prd-prototype-skill
node prd-prototype.js --serve --output {output_dir} --port 8088
```

启动：
- 前端静态服务: `http://localhost:8088`（预览原型）
- Mock API服务: `http://localhost:8089/api`（前端调用）
- API文档: `http://localhost:8089/api/docs`（给后端看）
- 标注服务: `http://localhost:8088/annotations`（接收标注）

### Phase 6: 设置标注监听

使用 CronCreate 每分钟检查标注。

### Phase 7: 返回结果

向用户汇报：
- ✅ 前端原型: `http://localhost:8088`
- 📚 API文档: `http://localhost:8089/api/docs`
- 📌 标注系统已启用
- 🔄 标注监听已启动

---

## 开发交付流程

### 第一步：产品经理验证（已完成）

产品经理打开浏览器，在原型上验证需求、添加标注。

### 第二步：后端开发（只需做这些）

1. **阅读 API 文档**
   ```bash
   curl http://localhost:8089/api/docs
   # 或浏览器打开 http://localhost:8089/api/docs
   ```

2. **实现接口**
   按照 openapi.json 定义，用任意语言实现相同接口。

3. **切换前端到真实后端**
   ```javascript
   // frontend/src/api/config.js
   export const BASE_URL = 'https://api.your-domain.com/api';
   ```

4. **完成**
   前端无需任何改动，直接对接真实后端运行。

---

## 标注处理规则

当检测到新标注时：

| 标注类型 | 处理方式 |
|---------|---------|
| 纯UI调整 | 仅修改前端组件 |
| 功能逻辑/文案/流程 | 修改前端 + 同步PRD + 更新openapi.json |
| 新增/删除API | 修改前端API层 + Mock路由 + openapi.json + PRD |

---

## 脚本职责

`prd-prototype.js` 只负责启动服务：
- 前端静态文件服务（8088）
- Mock API服务（8089）
- 标注接收服务（8088/annotations）

**Claude 负责所有代码生成。**

---

## 示例

```
用户: 生成原型 docs/prd/PRD-BU管理端.md

Claude:
  1. Read PRD
  2. Read references
  3. 生成 frontend/ 和 backend/ 所有文件
  4. Write 所有文件
  5. Bash: node prd-prototype.js --serve --output ./prototype
  6. CronCreate: 监听标注

返回:
  ✅ 前端原型: http://localhost:8088
  📚 API文档: http://localhost:8089/api/docs
  📌 标注已启用
  🔄 监听中
```
