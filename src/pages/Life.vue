<script setup lang="ts">
const links = [
  {
    title: '漫长人生告慰书',
    desc: '知乎圆桌 · 关于漫长人生里那些值得被记录和告慰的事',
    url: 'https://www.zhihu.com/roundtable/longlife',
  },
];
</script>

<template>
  <section class="life">
    <h1>Life</h1>
    <p class="lead">技术之外，生活之内。</p>

    <ul class="link-list">
      <li v-for="l in links" :key="l.url">
        <a :href="l.url" target="_blank" rel="noopener" class="link-card">
          <span class="link-title">{{ l.title }} ↗</span>
          <span class="link-desc">{{ l.desc }}</span>
        </a>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.life {
  max-width: var(--content-max);
  margin: 0 auto;
}
.life h1 {
  font-family: var(--font-serif);
  font-size: 2.4rem;
  font-weight: 500;
  letter-spacing: -0.02em;
  margin-bottom: 12px;
}
.lead {
  color: var(--text-soft);
  font-size: 15px;
  margin-bottom: 32px;
}

.link-list {
  list-style: none;
  padding: 0;
}

.link-card {
  display: block;
  padding: 20px 16px;
  margin: 0 -16px;
  border-bottom: 1px solid var(--border-soft);
  text-decoration: none;
  color: inherit;
  border-radius: 6px;
  transition: background 0.15s ease;
}
.link-card:hover {
  background: var(--bg-soft);
}
.link-card:hover .link-title {
  color: var(--accent);
}

.link-title {
  display: block;
  font-family: var(--font-serif);
  font-size: 17px;
  font-weight: 500;
  color: var(--text);
  transition: color 0.15s ease;
  margin-bottom: 4px;
}
.link-desc {
  display: block;
  font-size: 13px;
  color: var(--text-soft);
  line-height: 1.5;
}
</style>
