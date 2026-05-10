# PRD-Prototype-Skill

将 PRD 需求文档一键转换为可交互的前端原型 + Mock API Server。

前后端分离、组件化架构，**开发只需实现后端 API，改一行 baseURL 即可交付**。

## 核心能力

| 能力 | 说明 |
|------|------|
| **PRD → 前端原型** | 读取 PRD，生成 Vue3 CDN 组件化前端，浏览器直接运行 |
| **Mock API** | 自动生成 Express REST API + OpenAPI 文档 |
| **标注反馈** | 产品经理在原型上标注 → AI 自动处理修改 |
| **一键交付** | 开发实现后端后，改 `config.js` 一行 baseURL 即可 |

## 架构

```
┌──────────┐     ┌─────────────────┐     ┌────────────────┐
│  产品经理  │────→│  Vue3 CDN 前端   │←────│  后端开发       │
│  标注反馈  │     │  (零构建)        │     │  阅读 openapi   │
└──────────┘     └────────┬────────┘     └───────┬────────┘
                          │                      │
                          │  改 BASE_URL          │ 实现接口
                          │                      │
                   ┌──────▼──────┐        ┌──────▼──────┐
                   │  Mock API   │        │  真实后端    │
                   │  Express    │        │  任意语言    │
                   │  内存存储   │        │              │
                   └─────────────┘        └──────────────┘
```

## 触发词

在 Claude Code 对话中输入以下关键词即可触发：

- `生成原型` / `前端原型` / `交互原型`

## 使用方式

```
用户: 生成原型 docs/prd/PRD-BU管理端.md

Claude 自动执行：
1. Read PRD → 提取前端设计
2. Read references → 加载风格/组件/架构规范
3. 生成 frontend/ → Vue3 CDN 组件化代码
4. 生成 backend/ → Express Mock API + OpenAPI
5. Bash → 启动服务
6. CronCreate → 监听标注循环
7. 返回访问地址
```

## 启动服务

```bash
cd prd-prototype-skill
npm install
node prd-prototype.js --serve --output ./prototype --port 8088
```

| 服务 | 地址 |
|------|------|
| 前端原型 | http://localhost:8088 |
| Mock API | http://localhost:8089/api |
| API 文档 | http://localhost:8089/api/docs |
| 标注接收 | http://localhost:8089/annotations |

## 目录结构

```
prd-prototype-skill/
├── prd-prototype.js              # 服务启动脚本（前端静态 + Mock API + 标注）
├── SKILL.md                      # Skill 定义文档（Claude 执行参考）
├── package.json                  # 依赖（express）
├── README.md                     # 本文件
└── references/                   # 参考资料
    ├── style-apple.md            # Apple 风格规范
    ├── style-minimal.md          # 简约风格规范
    ├── style-tech.md             # 科技风格规范
    ├── component-library.md      # UI 组件模板
    ├── annotation-system.md      # 标注系统规范
    ├── frontend-architecture.md  # Vue3 CDN 组件化架构
    ├── mock-api-spec.md          # Mock API 规范
    ├── mock-patterns.md          # Mock 数据模式
    └── mock-templates.md         # Mock 数据模板
```

## 输出目录结构

```
{output_dir}/
├── frontend/                     # Vue3 CDN 前端（零构建）
│   ├── index.html
│   ├── assets/style.css
│   └── src/
│       ├── main.js
│       ├── api/
│       │   ├── config.js         # ⭐ BASE_URL（改这一行切换后端）
│       │   ├── request.js
│       │   └── modules/
│       ├── components/
│       ├── views/
│       ├── router/
│       └── stores/
├── backend/                      # Express Mock API
│   ├── server.js
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   └── docs/openapi.json         # API 文档（给后端看）
├── annotations.json              # 标注存储
└── README.md                     # 交付文档
```

## 开发交付流程

1. **产品经理验证** — 打开浏览器，在原型上标注修改意见
2. **后端开发** — `curl http://localhost:8089/api/docs` 阅读 API 规范，实现接口
3. **切换后端** — 改 `frontend/src/api/config.js` 中的 `BASE_URL`
4. **完成** — 前端无需任何改动，直接对接真实后端

## 技术栈

- **前端**: Vue 3 (CDN) + Vue Router 4 (CDN) + Pinia (CDN) + 原生 CSS
- **后端**: Node.js + Express
- **数据**: 内存存储（重启丢失，仅用于原型验证）
- **文档**: OpenAPI 3.0 JSON

## 标注系统

前端内置标注能力：
- 悬停元素显示 📌 图标，点击添加标注
- 双击任意标注元素添加标注
- 标注提交到 `http://localhost:8089/annotations`
- Claude 自动监听并处理修改

## 安装

```bash
git clone https://github.com/gaomeizi/prd-prototype-skill.git
cd prd-prototype-skill
npm install
```

## License

MIT
