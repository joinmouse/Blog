# joinmouse

个人博客，内容涵盖编程、AI 与一些思考。

网站: https://joinmouse.pages.dev/

## 技术栈

- Vue 3 + Vite + TypeScript
- Vue Router
- unplugin-vue-markdown (Markdown → Vue 组件)
- shiki (代码高亮)
- Cloudflare Pages 部署

## 目录结构

```
src/
├── components/     可复用组件
├── lib/            工具函数、数据处理
├── pages/          页面组件
├── router.ts       路由配置
└── style.css       全局样式

content/
├── posts/          博客文章 (按分类子目录组织)
└── projects/       作品展示

public/             静态资源
```
