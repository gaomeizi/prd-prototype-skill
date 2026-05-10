# Mock API 规范

## 设计原则

1. **RESTful**：标准 HTTP 方法 + 资源路径
2. **统一响应格式**：`{ code: 0, data: ..., message: "" }`
3. **内存存储**：数据存在 Node.js 内存中，重启丢失
4. **自动生成文档**：OpenAPI 3.0 JSON 规范

---

## 统一响应格式

```json
{
  "code": 0,          // 0=成功，非0=错误码
  "data": {},         // 业务数据
  "message": ""       // 提示信息
}
```

错误响应：
```json
{
  "code": 400001,
  "data": null,
  "message": "课程名称不能为空"
}
```

---

## 目录结构

```
backend/
├── server.js           # Express入口
├── routes/             # 路由模块
│   ├── courses.js
│   ├── tags.js
│   └── instructors.js
├── models/
│   └── data.js         # 内存数据 + CRUD方法
├── middleware/
│   ├── cors.js
│   └── auth.js         # JWT模拟
└── docs/
    └── openapi.json    # OpenAPI文档
```

---

## 数据模型

```javascript
// models/data.js
let courses = [
  { id: 1, name: '安全操作规范', tags: [1,2], materials: { video: 1, ppt: 1 }, status: 'published', createdAt: '2026-04-20' }
];
let tags = [
  { id: 1, name: '安全', color: '#ff3b30', courses: 2, status: 'active' }
];
let instructors = [
  { id: 1, name: '张建国', phone: '138****5678', status: 'active' }
];

module.exports = {
  courses, tags, instructors,
  // CRUD helpers
  findById(list, id) { return list.find(x => x.id == id); },
  remove(list, id) { const i = list.findIndex(x => x.id == id); if (i > -1) list.splice(i, 1); },
  nextId(list) { return list.length > 0 ? Math.max(...list.map(x => x.id)) + 1 : 1; }
};
```

---

## 路由规范

### 通用模式

```javascript
const router = require('express').Router();
const { courses, findById, remove, nextId } = require('../models/data');

// GET /api/courses        → 列表（支持keyword/tagIds分页）
// GET /api/courses/:id    → 详情
// POST /api/courses       → 创建
// PUT /api/courses/:id    → 更新
// DELETE /api/courses/:id → 删除
// POST /api/courses/:id/publish → 发布
```

### 列表接口（分页 + 筛选）

```javascript
router.get('/', (req, res) => {
  const { keyword, tagIds, page = 1, pageSize = 20 } = req.query;
  let data = [...courses];

  if (keyword) {
    data = data.filter(c => c.name.toLowerCase().includes(keyword.toLowerCase()));
  }
  if (tagIds) {
    const ids = tagIds.split(',').map(Number);
    data = data.filter(c => c.tags.some(t => ids.includes(t)));
  }

  const total = data.length;
  const start = (page - 1) * pageSize;
  const list = data.slice(start, start + parseInt(pageSize));

  res.json({ code: 0, data: { list, total, page: parseInt(page), pageSize: parseInt(pageSize) } });
});
```

### 创建接口

```javascript
router.post('/', (req, res) => {
  const { name, tags: tagIds, materials } = req.body;
  if (!name) {
    return res.status(400).json({ code: 400001, message: '课程名称不能为空' });
  }

  const course = {
    id: nextId(courses),
    name,
    tags: tagIds || [],
    materials: materials || { video: 0, ppt: 0 },
    status: 'draft',
    createdAt: new Date().toLocaleString('zh-CN')
  };
  courses.unshift(course);
  res.json({ code: 0, data: course });
});
```

### 更新接口

```javascript
router.put('/:id', (req, res) => {
  const course = findById(courses, req.params.id);
  if (!course) {
    return res.status(404).json({ code: 404001, message: '课程不存在' });
  }
  Object.assign(course, req.body);
  res.json({ code: 0, data: course });
});
```

### 删除接口

```javascript
router.delete('/:id', (req, res) => {
  const course = findById(courses, req.params.id);
  if (!course) {
    return res.status(404).json({ code: 404001, message: '课程不存在' });
  }
  remove(courses, req.params.id);
  res.json({ code: 0, data: null });
});
```

---

## 中间件

### CORS

```javascript
// middleware/cors.js
module.exports = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
};
```

### JWT 模拟

```javascript
// middleware/auth.js
module.exports = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ code: 401001, message: '未登录' });
  }
  // 模拟验证：任何token都通过
  req.user = { id: 1, role: 'bu_admin' };
  next();
};
```

---

## OpenAPI 文档生成

从路由代码自动生成 OpenAPI 3.0 JSON：

```javascript
// docs/openapi-generator.js
function generateOpenAPI() {
  return {
    openapi: '3.0.0',
    info: { title: '培训系统 API', version: '1.0.0' },
    servers: [{ url: 'http://localhost:8089/api' }],
    paths: {
      '/courses': {
        get: {
          summary: '课程列表',
          parameters: [
            { name: 'keyword', in: 'query', schema: { type: 'string' } },
            { name: 'tagIds', in: 'query', schema: { type: 'string' } },
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'pageSize', in: 'query', schema: { type: 'integer', default: 20 } }
          ],
          responses: {
            '200': {
              description: '成功',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      code: { type: 'integer' },
                      data: {
                        type: 'object',
                        properties: {
                          list: { type: 'array', items: { $ref: '#/components/schemas/Course' } },
                          total: { type: 'integer' },
                          page: { type: 'integer' },
                          pageSize: { type: 'integer' }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        post: {
          summary: '创建课程',
          requestBody: {
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CourseInput' }
              }
            }
          },
          responses: { '200': { description: '成功' } }
        }
      }
    },
    components: {
      schemas: {
        Course: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            tags: { type: 'array', items: { type: 'integer' } },
            materials: {
              type: 'object',
              properties: {
                video: { type: 'integer' },
                ppt: { type: 'integer' }
              }
            },
            status: { type: 'string', enum: ['draft', 'published'] },
            createdAt: { type: 'string' }
          }
        },
        CourseInput: {
          type: 'object',
          properties: {
            name: { type: 'string', description: '课程名称' },
            tags: { type: 'array', items: { type: 'integer' } },
            materials: {
              type: 'object',
              properties: {
                video: { type: 'integer' },
                ppt: { type: 'integer' }
              }
            }
          },
          required: ['name']
        }
      }
    }
  };
}

module.exports = { generateOpenAPI };
```

---

## 服务器入口

```javascript
// server.js
const express = require('express');
const app = express();
const path = require('path');

app.use(express.json());
app.use(require('./middleware/cors'));

// 路由
app.use('/api/courses', require('./routes/courses'));
app.use('/api/tags', require('./routes/tags'));
app.use('/api/instructors', require('./routes/instructors'));

// 静态文件（前端）
app.use(express.static(path.join(__dirname, '../frontend')));

// API文档
const { generateOpenAPI } = require('./docs/openapi-generator');
app.get('/api/docs', (req, res) => {
  res.json(generateOpenAPI());
});

// 标注接收
app.post('/annotations', (req, res) => {
  const fs = require('fs');
  const file = path.join(__dirname, '../annotations.json');
  const existing = JSON.parse(fs.readFileSync(file, 'utf8') || '[]');
  existing.push(...req.body);
  fs.writeFileSync(file, JSON.stringify(existing, null, 2));
  res.json({ code: 0 });
});

app.listen(8089, () => {
  console.log('Mock API: http://localhost:8089/api');
  console.log('API Docs: http://localhost:8089/api/docs');
  console.log('Frontend: http://localhost:8089');
});
```
