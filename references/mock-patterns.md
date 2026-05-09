# Mock Patterns Reference

Mock数据和API服务生成规则。

---

## Mock Data Rules

### 真实感原则

Mock数据必须看起来像真实业务数据：

| 类型 | 规则 | 示例 |
|------|------|------|
| 用户名 | 中文姓名 | 张三、李明、王芳 |
| 产品名 | 中文产品名 | 商品A、订单编号 |
| 时间戳 | 当前日期附近 | 14:30:01（模拟当前时间） |
| 状态值 | 业务合理值 | 进行中、已完成、待审核 |
| 数量 | 合理范围 | 列表5-10条，评分60-100 |
| ID | 格式统一 | TC-001, USER-123 |

### 数据结构模板

```javascript
// 用户数据
const mockUsers = [
  { id: 'USER-001', name: '张三', role: '管理员', status: 'active' },
  { id: 'USER-002', name: '李明', role: '普通用户', status: 'active' },
  { id: 'USER-003', name: '王芳', role: '普通用户', status: 'inactive' }
];

// 订单数据
const mockOrders = [
  { id: 'ORD-001', product: '商品A', quantity: 2, price: 199, status: '已完成' },
  { id: 'ORD-002', product: '商品B', quantity: 1, price: 599, status: '进行中' }
];

// 评估数据
const mockEvaluations = [
  { id: 'EVAL-001', score: 85, dimensions: { 功能: 90, 交互: 80 }, status: '合格' },
  { id: 'EVAL-002', score: 65, dimensions: { 功能: 75, 交互: 60 }, status: '不合格' }
];
```

---

## API Mock Patterns

### RESTful API Mock

```javascript
// 模拟GET请求
function mockGetUser(id) {
  return mockUsers.find(u => u.id === id);
}

// 模拟POST请求
function mockCreateOrder(data) {
  const newOrder = {
    id: `ORD-${mockOrders.length + 1}`,
    ...data,
    status: '待处理',
    createdAt: new Date().toISOString()
  };
  mockOrders.push(newOrder);
  return newOrder;
}

// 模拟异步延迟
function mockApiCall(fn, delay = 500) {
  return new Promise(resolve => {
    setTimeout(() => resolve(fn()), delay);
  });
}
```

### GraphQL Mock

```javascript
const mockResolvers = {
  Query: {
    user: (_, { id }) => mockUsers.find(u => u.id === id),
    orders: () => mockOrders,
    evaluation: (_, { id }) => mockEvaluations.find(e => e.id === id)
  },
  Mutation: {
    createOrder: (_, { input }) => mockCreateOrder(input),
    updateStatus: (_, { id, status }) => {
      const order = mockOrders.find(o => o.id === id);
      if (order) order.status = status;
      return order;
    }
  }
};
```

---

## Mock Server Templates

### Simple JSON Server

```javascript
// mock-server.js
const express = require('express');
const app = express();
app.use(express.json());

// GET /api/users
app.get('/api/users', (req, res) => {
  res.json(mockUsers);
});

// GET /api/users/:id
app.get('/api/users/:id', (req, res) => {
  const user = mockUsers.find(u => u.id === req.params.id);
  res.json(user || { error: 'Not found' });
});

// POST /api/orders
app.post('/api/orders', (req, res) => {
  const order = mockCreateOrder(req.body);
  res.json(order);
});

app.listen(3000, () => console.log('Mock server running on port 3000'));
```

### In-HTML Mock (无需额外服务)

```javascript
// 直接在HTML内模拟API
const mockApi = {
  getUsers: () => Promise.resolve(mockUsers),
  getUser: (id) => Promise.resolve(mockUsers.find(u => u.id === id)),
  createOrder: (data) => Promise.resolve(mockCreateOrder(data))
};

// 使用方式
mockApi.getUsers().then(users => {
  renderUserList(users);
});
```

---

## Mock for Different Scenarios

### 评估场景

```javascript
const mockEvaluation = {
  scenario: '商品质量申诉',
  testCases: [
    { id: 'TC-001', input: '商品质量问题', expected: '安抚→判断→决策→工单→闭环' },
    { id: 'TC-002', input: '退款申请', expected: '审核→执行→通知' }
  ],
  dimensions: [
    { name: '功能完整性', weight: 25, threshold: 60 },
    { name: '交互质量', weight: 30, threshold: 60 },
    { name: '流程合规', weight: 15, threshold: 60 },
    { name: '问题解决', weight: 20, threshold: 60 }
  ],
  redLines: ['create_ticket 必须调用']
};
```

### 审批流程

```javascript
const mockApprovalFlow = {
  steps: ['提交申请', '初审', '复审', '最终审批'],
  currentStep: 2,
  approvers: [
    { step: 1, name: '初审员', status: '已完成' },
    { step: 2, name: '复审员', status: '进行中' },
    { step: 3, name: '终审员', status: '待处理' }
  ],
  documents: ['申请表', '附件1', '附件2']
};
```

---

## Mock Generation from PRD

从PRD文档提取mock数据规则：

1. **识别数据实体**
   - 查找PRD中的"数据结构"、"数据字典"、"实体定义"

2. **提取字段**
   - 字段名、类型、枚举值

3. **生成示例数据**
   - 基于字段类型生成合理示例

4. **关联关系**
   - 主键关联、外键关联

---

## Gotchas

| 问题 | 解决方案 |
|------|---------|
| PRD无数据定义 | 根据业务场景推断合理数据 |
| API响应格式不明 | 使用常见RESTful格式 |
| 数据量不确定 | 默认5-10条，足够展示交互 |
| 时间相关数据 | 使用当前时间附近，模拟真实 |