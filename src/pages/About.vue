<script setup lang="ts"></script>

<template>
  <section class="about">
    <h1>About</h1>
    <p>
      这是一份个人前端笔记的安静角落 —— 关于 JavaScript、TypeScript、Vue
      响应式原理，以及一些零散的思考。原内容沉淀在
      <a href="https://github.com/joinmouse/Blog" target="_blank" rel="noopener">GitHub Issues</a>
      上，本站只是它们的一个更舒适的阅读视图。
    </p>
    <p>
      站点用 Vue3 + Vite 构建，主题取自 Claude.ai
      的暖米色调，刻意保留大量留白与极少的视觉装饰。希望读起来像翻一本旧的笔记本，而不是浏览一个网页。
    </p>
    <p class="sig">— joinmouse</p>
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
.sig {
  margin-top: 2.4em;
  color: var(--text-soft);
  font-style: italic;
}
</style>
