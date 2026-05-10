# 前端架构规范

## 技术栈

- **Vue 3** (CDN global build)
- **Vue Router 4** (CDN)
- **Pinia** (CDN) — 状态管理
- **原生 CSS** — 无预处理器
- **Fetch API** — 请求（无axios依赖）

## 约束

- 零构建：不依赖 npm install / vite / webpack
- 单入口：打开 `index.html` 直接运行
- 组件用字符串模板（`template: \`...\``）
- 所有代码在浏览器直接执行

---

## 目录结构

```
frontend/
├── index.html              # 入口
├── src/
│   ├── main.js             # Vue应用入口
│   ├── api/
│   │   ├── config.js       # ⭐ baseURL（开发改这一行）
│   │   ├── request.js      # fetch封装
│   │   └── modules/        # 各模块API
│   │       ├── courses.js
│   │       ├── tags.js
│   │       └── instructors.js
│   ├── components/         # 复用组件
│   │   ├── CourseCard.js
│   │   ├── CourseForm.js
│   │   ├── TagSelector.js
│   │   └── AnnotationPanel.js
│   ├── views/              # 页面级组件
│   │   ├── LoginView.js
│   │   ├── DashboardView.js
│   │   └── ...
│   ├── stores/             # Pinia stores
│   │   └── index.js
│   ├── router/
│   │   └── index.js
│   └── utils/
│       └── helpers.js
└── assets/
    └── style.css
```

---

## API 层规范

### config.js — 唯一需要后端开发修改的文件

```javascript
// src/api/config.js
export const BASE_URL = 'http://localhost:8089/api';
// export const BASE_URL = 'https://api.production.com/api'; // 真实后端

export const API_TIMEOUT = 10000;
export const TOKEN_KEY = 'app_token';
```

### request.js — 统一请求封装

```javascript
// src/api/request.js
import { BASE_URL, TOKEN_KEY } from './config.js';

async function request(url, options = {}) {
  const token = localStorage.getItem(TOKEN_KEY);
  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers
    }
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || `HTTP ${res.status}`);
  }

  const data = await res.json();
  if (data.code !== 0) throw new Error(data.message);
  return data.data;
}

export const get = (url) => request(url);
export const post = (url, body) => request(url, { method: 'POST', body: JSON.stringify(body) });
export const put = (url, body) => request(url, { method: 'PUT', body: JSON.stringify(body) });
export const del = (url) => request(url, { method: 'DELETE' });
```

### 模块API — 按PRD功能拆分

```javascript
// src/api/modules/courses.js
import { get, post, put, del } from '../request.js';

export const CourseAPI = {
  getList: (params = {}) => get(`/courses?${new URLSearchParams(params)}`),
  getById: (id) => get(`/courses/${id}`),
  create: (data) => post('/courses', data),
  update: (id, data) => put(`/courses/${id}`, data),
  delete: (id) => del(`/courses/${id}`),
  publish: (id) => post(`/courses/${id}/publish`),
  getSop: (id) => get(`/courses/${id}/sop`)
};
```

---

## 组件规范

### 基础组件

```javascript
// components/CourseCard.js
export const CourseCard = {
  name: 'CourseCard',
  props: {
    course: { type: Object, required: true }
  },
  emits: ['edit', 'delete', 'publish', 'click'],
  template: `
    <div class="course-card" @click="$emit('click', course)">
      <div class="course-header">
        <span class="course-name">{{ course.name }}</span>
        <span :class="['badge', course.status]">{{ statusText }}</span>
      </div>
      <div class="course-tags">
        <span v-for="tag in course.tags" :key="tag.id"
              class="tag-item" :style="tagStyle(tag)">
          {{ tag.name }}
        </span>
      </div>
      <div class="course-meta">
        <span>📎 {{ materialCount }} 个素材</span>
        <span>🕐 {{ formatDate(course.createdAt) }}</span>
      </div>
      <div class="course-actions">
        <button class="btn btn-ghost btn-sm" @click.stop="$emit('edit', course)">✏️ 编辑</button>
        <button class="btn btn-primary btn-sm" @click.stop="$emit('publish', course)">
          {{ course.status === 'published' ? '🔄 重新发布' : '🚀 发布' }}
        </button>
        <button class="btn btn-danger btn-sm" @click.stop="$emit('delete', course)">🗑️</button>
      </div>
    </div>
  `,
  computed: {
    statusText() {
      return this.course.status === 'published' ? '已发布' : '草稿';
    },
    materialCount() {
      return (this.course.materials?.video || 0) + (this.course.materials?.ppt || 0);
    }
  },
  methods: {
    tagStyle(tag) {
      return { background: tag.color + '15', color: tag.color };
    },
    formatDate(dt) {
      return dt ? dt.split(' ')[0] : '-';
    }
  }
};
```

### 页面组件

```javascript
// views/CourseListView.js
import { CourseCard } from '../components/CourseCard.js';
import { CourseForm } from '../components/CourseForm.js';
import { CourseAPI } from '../api/modules/courses.js';

export const CourseListView = {
  name: 'CourseListView',
  components: { CourseCard, CourseForm },
  template: `
    <div class="page course-list-page">
      <div class="search-bar">
        <input v-model="search" class="input-field" placeholder="搜索课程..." @input="handleSearch" />
        <button class="btn btn-primary" @click="showCreateModal = true">+ 创建课程</button>
      </div>
      <div class="course-list">
        <CourseCard v-for="course in courses" :key="course.id"
                    :course="course"
                    @edit="handleEdit"
                    @delete="handleDelete"
                    @publish="handlePublish" />
      </div>
      <CourseForm v-if="showCreateModal" @close="showCreateModal = false" @submit="handleCreate" />
    </div>
  `,
  data() {
    return { courses: [], search: '', showCreateModal: false };
  },
  async mounted() {
    this.courses = await CourseAPI.getList();
  },
  methods: {
    async handleSearch() {
      this.courses = await CourseAPI.getList({ keyword: this.search });
    },
    async handleCreate(data) {
      await CourseAPI.create(data);
      this.showCreateModal = false;
      this.courses = await CourseAPI.getList();
    },
    async handleEdit(course) { /* ... */ },
    async handleDelete(course) {
      if (confirm('确认删除？')) {
        await CourseAPI.delete(course.id);
        this.courses = this.courses.filter(c => c.id !== course.id);
      }
    },
    async handlePublish(course) {
      await CourseAPI.publish(course.id);
      course.status = 'published';
    }
  }
};
```

---

## 路由规范

```javascript
// router/index.js
import { LoginView } from '../views/LoginView.js';
import { CourseListView } from '../views/CourseListView.js';
import { TagManageView } from '../views/TagManageView.js';
import { InstructorManageView } from '../views/InstructorManageView.js';

export const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: LoginView },
    { path: '/courses', component: CourseListView, meta: { requiresAuth: true } },
    { path: '/tags', component: TagManageView, meta: { requiresAuth: true } },
    { path: '/instructors', component: InstructorManageView, meta: { requiresAuth: true } }
  ]
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('app_token');
  if (to.meta.requiresAuth && !token) {
    next('/login');
  } else {
    next();
  }
});
```

---

## 状态管理（Pinia）

```javascript
// stores/index.js
const { createPinia, defineStore } = Pinia;

export const useCourseStore = defineStore('courses', {
  state: () => ({
    courses: [],
    loading: false,
    search: '',
    selectedTags: []
  }),
  getters: {
    filteredCourses: (state) => {
      let data = state.courses;
      if (state.search) {
        data = data.filter(c => c.name.toLowerCase().includes(state.search.toLowerCase()));
      }
      return data;
    }
  },
  actions: {
    async fetchCourses() {
      this.loading = true;
      const { CourseAPI } = await import('../api/modules/courses.js');
      this.courses = await CourseAPI.getList();
      this.loading = false;
    }
  }
});

export const pinia = createPinia();
```

---

## 入口文件

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>原型预览</title>
  <!-- Vue 3 -->
  <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
  <!-- Vue Router -->
  <script src="https://unpkg.com/vue-router@4/dist/vue-router.global.js"></script>
  <!-- Pinia -->
  <script src="https://unpkg.com/pinia@2/dist/pinia.iife.js"></script>
  <link rel="stylesheet" href="assets/style.css">
</head>
<body>
  <div id="app"></div>
  <script type="module" src="src/main.js"></script>
</body>
</html>
```

```javascript
// main.js
import { router } from './router/index.js';
import { pinia } from './stores/index.js';
import { App } from './components/App.js';

const { createApp } = Vue;

createApp(App)
  .use(router)
  .use(pinia)
  .mount('#app');
```

---

## 标注系统规范

标注系统作为独立组件注入：

```javascript
// components/AnnotationPanel.js
export const AnnotationPanel = {
  template: `
    <div class="annotation-toggle" @click="togglePanel">📌
      <span v-if="count > 0" class="count">{{ count }}</span>
    </div>
    <div v-if="visible" class="annotation-panel">
      <!-- 标注列表、导出、保存按钮 -->
    </div>
  `,
  data() { return { visible: false, annotations: [] }; },
  computed: { count() { return this.annotations.length; } },
  methods: {
    async submit() {
      await fetch('http://localhost:8088/annotations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.annotations)
      });
    }
  }
};
```

所有关键元素添加标注能力：
```javascript
// 在组件 mounted 时注入
mounted() {
  this.$el.querySelectorAll('.annotatable').forEach(el => {
    const icon = document.createElement('span');
    icon.className = 'annotate-icon';
    icon.innerHTML = '📌';
    icon.onclick = (e) => { e.stopPropagation(); this.addAnnotation(el.dataset.section); };
    el.appendChild(icon);
  });
}
```
