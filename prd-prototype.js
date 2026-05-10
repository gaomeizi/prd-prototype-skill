#!/usr/bin/env node

/**
 * PRD-Prototype 服务启动脚本
 *
 * 职责：启动前端静态服务 + Mock API 服务 + 标注接收服务
 * Claude 负责：读取PRD、生成前后端代码、监听标注、处理修改
 *
 * Usage:
 *   node prd-prototype.js --serve --output ./prototype --port 8088 --api-port 8089
 */

const fs = require('fs');
const path = require('path');
const http = require('http');

// 尝试加载 Express，用于 Mock API
let express;
try {
  express = require('express');
} catch (e) {
  console.error('⚠️  express 未安装，Mock API 服务将不可用。如需 Mock API，请运行：npm install express');
}

function parseArgs() {
  const args = process.argv.slice(2);
  const config = { serve: false, output: './prototype', port: 8088, apiPort: 8089 };
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--serve': config.serve = true; break;
      case '--output': config.output = args[++i]; break;
      case '--port': config.port = parseInt(args[++i]); break;
      case '--api-port': config.apiPort = parseInt(args[++i]); break;
    }
  }
  return config;
}

/**
 * 前端静态文件服务
 * - 优先从 {output}/frontend/ 目录提供（新架构）
 * - 回退到 {output}/ 目录（旧架构单文件）
 */
function startFrontendServer(outputDir, port) {
  const frontendDir = path.join(outputDir, 'frontend');
  const staticDir = fs.existsSync(frontendDir) ? frontendDir : outputDir;
  const indexFile = fs.existsSync(path.join(staticDir, 'index.html')) ? 'index.html' : 'prototype.html';

  const server = http.createServer((req, res) => {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

    const filePath = path.join(staticDir, req.url === '/' ? indexFile : req.url);
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath);
      const ct = {
        '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript',
        '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg',
        '.svg': 'image/svg+xml', '.ico': 'image/x-icon'
      }[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': ct });
      res.end(fs.readFileSync(filePath));
    } else {
      res.writeHead(404); res.end('Not Found');
    }
  });

  server.listen(port, () => {
    console.log(`  🌐 前端服务: http://localhost:${port}`);
    console.log(`     静态目录: ${staticDir}`);
  });
  return server;
}

/**
 * Mock API + 标注接收服务（Express）
 */
function startMockApiServer(outputDir, port) {
  if (!express) {
    console.log('  ⚠️  Mock API 服务未启动（express 未安装）');
    return null;
  }

  const app = express();
  app.use(express.json());

  // CORS 中间件
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') return res.sendStatus(204);
    next();
  });

  const backendDir = path.join(outputDir, 'backend');
  const hasBackend = fs.existsSync(backendDir);

  // 加载后端路由（新架构）
  if (hasBackend) {
    const routesDir = path.join(backendDir, 'routes');
    if (fs.existsSync(routesDir)) {
      fs.readdirSync(routesDir).forEach(file => {
        if (file.endsWith('.js')) {
          const name = file.replace('.js', '');
          const routePath = `/api/${name}`;
          try {
            app.use(routePath, require(path.join(routesDir, file)));
            console.log(`  📡 API路由: ${routePath}`);
          } catch (e) {
            console.error(`  ⚠️  加载路由失败 ${routePath}: ${e.message}`);
          }
        }
      });
    }

    // OpenAPI 文档
    app.get('/api/docs', (req, res) => {
      const openapiPath = path.join(backendDir, 'docs', 'openapi.json');
      if (fs.existsSync(openapiPath)) {
        res.json(require(openapiPath));
      } else {
        res.status(404).json({ code: 404001, message: 'OpenAPI 文档未找到' });
      }
    });
  }

  // 标注接收（兼容旧架构和新架构）
  const annotationsFile = path.join(outputDir, 'annotations.json');
  if (!fs.existsSync(annotationsFile)) fs.writeFileSync(annotationsFile, '[]');

  app.post('/annotations', (req, res) => {
    try {
      const existing = JSON.parse(fs.readFileSync(annotationsFile, 'utf8') || '[]');
      const merged = existing.concat(req.body);
      fs.writeFileSync(annotationsFile, JSON.stringify(merged, null, 2));
      res.json({ code: 0, success: true });
    } catch (e) {
      res.status(400).json({ code: 400001, message: e.message });
    }
  });

  app.get('/annotations', (req, res) => {
    res.json(JSON.parse(fs.readFileSync(annotationsFile, 'utf8') || '[]'));
  });

  app.delete('/annotations', (req, res) => {
    fs.writeFileSync(annotationsFile, '[]');
    res.json({ code: 0, success: true });
  });

  app.listen(port, () => {
    console.log(`  🔌 Mock API: http://localhost:${port}/api`);
    if (hasBackend) {
      console.log(`  📚 API文档: http://localhost:${port}/api/docs`);
    }
    console.log(`  📌 标注服务: http://localhost:${port}/annotations`);
  });

  return app;
}

function main() {
  const config = parseArgs();
  fs.mkdirSync(config.output, { recursive: true });

  console.log('\n🚀 启动 PRD-Prototype 服务...');
  console.log(`  📁 输出目录: ${path.resolve(config.output)}`);

  startFrontendServer(config.output, config.port);
  startMockApiServer(config.output, config.apiPort);

  console.log('\n按 Ctrl+C 停止服务\n');
}

main();
