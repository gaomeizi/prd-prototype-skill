# Mock Templates Reference

常用mock数据和API服务的具体模板，可直接复用。

---

## Common Data Templates

### Users

```javascript
const mockUsers = [
  { id: 'USER-001', name: '张三', email: 'zhangsan@example.com', role: '管理员', status: 'active', avatar: '👤' },
  { id: 'USER-002', name: '李明', email: 'liming@example.com', role: '普通用户', status: 'active', avatar: '👤' },
  { id: 'USER-003', name: '王芳', email: 'wangfang@example.com', role: '普通用户', status: 'inactive', avatar: '👤' },
  { id: 'USER-004', name: '赵强', email: 'zhaoqiang@example.com', role: '审核员', status: 'active', avatar: '👤' },
  { id: 'USER-005', name: '陈雪', email: 'chenxue@example.com', role: '普通用户', status: 'pending', avatar: '👤' }
];
```

### Products / Items

```javascript
const mockProducts = [
  { id: 'PROD-001', name: '商品A', category: '电子产品', price: 199, stock: 50, status: '在售' },
  { id: 'PROD-002', name: '商品B', category: '家居用品', price: 599, stock: 20, status: '在售' },
  { id: 'PROD-003', name: '商品C', category: '服装', price: 89, stock: 100, status: '热销' },
  { id: 'PROD-004', name: '商品D', category: '电子产品', price: 1299, stock: 5, status: '缺货' }
];
```

### Orders

```javascript
const mockOrders = [
  { id: 'ORD-001', userId: 'USER-002', product: '商品A', quantity: 2, totalPrice: 398, status: '已完成', createdAt: '2024-01-15 10:30:00' },
  { id: 'ORD-002', userId: 'USER-003', product: '商品B', quantity: 1, totalPrice: 599, status: '进行中', createdAt: '2024-01-16 14:20:00' },
  { id: 'ORD-003', userId: 'USER-001', product: '商品C', quantity: 3, totalPrice: 267, status: '待支付', createdAt: '2024-01-17 09:45:00' },
  { id: 'ORD-004', userId: 'USER-005', product: '商品D', quantity: 1, totalPrice: 1299, status: '已取消', createdAt: '2024-01-18 16:10:00' }
];
```

### Tasks / Workflow

```javascript
const mockTasks = [
  { id: 'TASK-001', title: '处理用户申诉', assignee: '张三', priority: '高', status: '进行中', deadline: '2024-01-20' },
  { id: 'TASK-002', title: '审核退款申请', assignee: '赵强', priority: '中', status: '待处理', deadline: '2024-01-22' },
  { id: 'TASK-003', title: '更新产品信息', assignee: '李明', priority: '低', status: '已完成', deadline: '2024-01-19' }
];
```

### Evaluations / Assessments

```javascript
const mockEvaluations = [
  {
    id: 'EVAL-001',
    scenario: '商品质量申诉',
    round: 1,
    score: 65,
    status: '不合格',
    dimensions: { 功能完整性: 75, 交互质量: 60, 流程合规: 85, 问题解决: 50 },
    redLines: ['遗漏 create_ticket 调用'],
    suggestions: ['添加工单登记强制要求', '增加同理心表达引导']
  },
  {
    id: 'EVAL-002',
    scenario: '退款处理流程',
    round: 2,
    score: 85,
    status: '合格',
    dimensions: { 功能完整性: 90, 交互质量: 80, 流程合规: 95, 问题解决: 85 },
    redLines: [],
    suggestions: []
  }
];
```

### Messages / Chat

```javascript
const mockMessages = [
  { id: 'MSG-001', role: 'evaluator', content: '已获取评估用例，开始执行测试...', time: '14:30:01' },
  { id: 'MSG-002', role: 'worker', content: '收到测试输入，开始执行...', time: '14:30:05' },
  { id: 'MSG-003', role: 'system', content: '测试用例执行完成', time: '14:30:10' },
  { id: 'MSG-004', role: 'user', content: '确认执行改进', time: '14:35:00' }
];
```

### Trace / Execution Log

```javascript
const mockTrace = [
  { step: 1, time: '14:30:01', action: '接收测试输入', status: 'done' },
  { step: 2, time: '14:30:05', action: '开始安抚用户', status: 'done' },
  { step: 3, time: '14:30:10', action: '判断退换标准', status: 'running' },
  { step: 4, time: '14:30:15', action: '遗漏: create_ticket', status: 'error' },
  { step: 5, time: '14:30:20', action: '闭环确认', status: 'pending' }
];
```

---

## API Response Templates

### Success Response

```javascript
function successResponse(data, message = '操作成功') {
  return {
    success: true,
    message: message,
    data: data,
    timestamp: new Date().toISOString()
  };
}
```

### Error Response

```javascript
function errorResponse(code, message, details = null) {
  return {
    success: false,
    error: {
      code: code,
      message: message,
      details: details
    },
    timestamp: new Date().toISOString()
  };
}
```

### Paginated Response

```javascript
function paginatedResponse(data, page, pageSize, total) {
  return {
    success: true,
    data: data,
    pagination: {
      page: page,
      pageSize: pageSize,
      total: total,
      totalPages: Math.ceil(total / pageSize)
    }
  };
}
```

---

## In-HTML Mock Service

完整的前端mock服务模板：

```javascript
// ============ Mock Data ============
const MOCK_DATA = {
  users: [...mockUsers],
  orders: [...mockOrders],
  evaluations: [...mockEvaluations]
};

// ============ Mock API ============
const mockApi = {
  // Users
  getUsers: () => Promise.resolve(MOCK_DATA.users),
  getUser: (id) => Promise.resolve(MOCK_DATA.users.find(u => u.id === id)),
  createUser: (data) => {
    const user = { id: `USER-${MOCK_DATA.users.length + 1}`, ...data };
    MOCK_DATA.users.push(user);
    return Promise.resolve(user);
  },

  // Orders
  getOrders: () => Promise.resolve(MOCK_DATA.orders),
  getOrder: (id) => Promise.resolve(MOCK_DATA.orders.find(o => o.id === id)),
  createOrder: (data) => {
    const order = {
      id: `ORD-${MOCK_DATA.orders.length + 1}`,
      ...data,
      status: '待处理',
      createdAt: new Date().toISOString()
    };
    MOCK_DATA.orders.push(order);
    return Promise.resolve(order);
  },
  updateOrderStatus: (id, status) => {
    const order = MOCK_DATA.orders.find(o => o.id === id);
    if (order) order.status = status;
    return Promise.resolve(order);
  },

  // Evaluations
  getEvaluations: () => Promise.resolve(MOCK_DATA.evaluations),
  submitEvaluation: (data) => {
    const eval = {
      id: `EVAL-${MOCK_DATA.evaluations.length + 1}`,
      ...data,
      round: 1
    };
    MOCK_DATA.evaluations.push(eval);
    return Promise.resolve(eval);
  }
};

// ============ Helper ============
function withDelay(fn, delay = 500) {
  return new Promise(resolve => {
    setTimeout(() => resolve(fn()), delay);
  });
}

// ============ Usage ============
// 在组件中使用
mockApi.getUsers().then(users => renderUserList(users));
mockApi.createOrder({ userId: 'USER-001', product: '商品A' }).then(order => showToast('订单创建成功'));
```

---

## Express Mock Server Template

完整的Express mock服务器：

```javascript
// mock-server.js
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// ============ Routes ============

// Users
app.get('/api/users', (req, res) => res.json(mockUsers));
app.get('/api/users/:id', (req, res) => {
  const user = mockUsers.find(u => u.id === req.params.id);
  res.json(user || errorResponse(404, '用户不存在'));
});
app.post('/api/users', (req, res) => {
  const user = { id: `USER-${mockUsers.length + 1}`, ...req.body };
  mockUsers.push(user);
  res.json(successResponse(user, '用户创建成功'));
});

// Orders
app.get('/api/orders', (req, res) => res.json(mockOrders));
app.get('/api/orders/:id', (req, res) => {
  const order = mockOrders.find(o => o.id === req.params.id);
  res.json(order || errorResponse(404, '订单不存在'));
});
app.post('/api/orders', (req, res) => {
  const order = {
    id: `ORD-${mockOrders.length + 1}`,
    ...req.body,
    createdAt: new Date().toISOString()
  };
  mockOrders.push(order);
  res.json(successResponse(order, '订单创建成功'));
});
app.patch('/api/orders/:id/status', (req, res) => {
  const order = mockOrders.find(o => o.id === req.params.id);
  if (order) {
    order.status = req.body.status;
    res.json(successResponse(order, '状态更新成功'));
  } else {
    res.json(errorResponse(404, '订单不存在'));
  }
});

// ============ Start ============
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Mock server running on http://localhost:${PORT}`);
});
```

---

## Time Utilities

```javascript
// 生成当前时间附近的时间戳
function mockTime(offsetSeconds = 0) {
  const now = new Date();
  return new Date(now.getTime() - offsetSeconds * 1000).toLocaleTimeString('zh-CN');
}

// 生成当前日期附近的日期
function mockDate(offsetDays = 0) {
  const now = new Date();
  return new Date(now.getTime() - offsetDays * 86400000).toLocaleDateString('zh-CN');
}

// 示例使用
const traceTime = mockTime(0);    // "14:30:01" (当前时间)
const traceTime2 = mockTime(60);  // "14:29:01" (1分钟前)
const orderDate = mockDate(2);    // "2024/1/15" (2天前)
```