# Blog

个人前端技术博客，内容涵盖 JavaScript、TypeScript、Vue、CSS 等。

## 技术栈

- Vue 3 + Vite + TypeScript
- unplugin-vue-markdown (Markdown → Vue 组件)
- shiki (代码高亮)
- Cloudflare Pages 部署

## 内容来源

- **GitHub Issues** — 较深入的原理性文章（JavaScript 深入浅出、TypeScript 类型系统、Vue 响应式原理等）
- **简书** — 早期学习笔记和基础整理

## 目录结构

```
content/posts/
├── javascript/    JavaScript 核心、ES6、异步、闭包等
├── typescript/    TypeScript 类型系统
├── vue/           Vue 响应式原理、组件、双向绑定
├── css/           CSS 居中、盒模型、Flex、可视化格式模型
├── jquery/        jQuery 源码解读
├── ajax/          HTTP 协议、跨域、axios 封装
├── engineering/   前端路由、模块化、MVC
├── browser/       浏览器渲染、URL 到页面展示
├── java/          Java 面向对象
├── node/          Express 框架
└── misc/          其他
```

## 本地开发

```bash
npm install
npm run dev      # 启动开发服务器
npm test         # 运行测试
npm run build    # 构建
npm run deploy   # 构建并部署到 Cloudflare Pages
```

## License

MIT
