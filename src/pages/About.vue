<script setup lang="ts"></script>

<template>
  <section class="about">
    <h1>About</h1>

    <p>
      我是 joinmouse，一个在杭州写代码的人。从前端入行，现在也在做 AI 相关的事——NLP、内容风控、开发者工具，什么都想碰一碰。
    </p>

    <p>
      这个站点是我的数字花园。Blog 里是这些年攒下的编程笔记，从 JavaScript 原型链到区块链合约，从浏览器渲染到 React Fiber；Projects 里是 AI 时代做的一些东西；Life 里放一些与技术无关的链接。
    </p>

    <p>
      站点用 Vue 3 + Vite 构建，主题取自 Claude.ai 的暖米色调，刻意保留大量留白与极少的视觉装饰。希望读起来像翻一本旧的笔记本，而不是浏览一个网页。
    </p>

    <p>
      原始笔记沉淀在
      <a href="https://github.com/joinmouse/Blog" target="_blank" rel="noopener">GitHub</a>，源码也在那里。欢迎找到我。
    </p>

    <ul class="links">
      <li>
        <a href="https://github.com/joinmouse" target="_blank" rel="noopener">GitHub</a>
      </li>
      <li>
        <a href="mailto:joinmouse@foxmail.com">Email</a>
      </li>
    </ul>

    <p class="sig">— joinmouse, Hangzhou</p>
  </section>
</template>

<style scoped>
.about {
  max-width: var(--content-max);
  margin: 0 auto;
}
.about h1 {
  font-family: var(--font-serif);
  font-size: 2.4rem;
  font-weight: 500;
  letter-spacing: -0.02em;
  margin-bottom: 24px;
}
.about p {
  color: var(--text);
  font-size: 16.5px;
  line-height: 1.78;
  margin-bottom: 1.1em;
}
.about a {
  color: var(--text);
  text-decoration: underline;
  text-decoration-color: var(--border);
  text-underline-offset: 3px;
  transition: all 0.15s ease;
}
.about a:hover {
  color: var(--accent);
  text-decoration-color: var(--accent);
}

.links {
  list-style: none;
  padding: 0;
  display: flex;
  gap: 20px;
  margin-bottom: 1.1em;
}
.links a {
  font-size: 14px;
  color: var(--text-soft);
  text-decoration: none;
  transition: color 0.15s ease;
}
.links a:hover {
  color: var(--accent);
}

.sig {
  margin-top: 2.4em;
  color: var(--text-soft);
  font-style: italic;
}
</style>
