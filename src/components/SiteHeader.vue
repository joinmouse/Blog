<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<template>
  <header class="site-header">
    <RouterLink to="/" class="brand">
      <span class="brand-dot" />
      <span class="brand-name">joinmouse</span>
      <span class="brand-sub">/ Blog</span>
    </RouterLink>
    <nav class="nav">
      <RouterLink to="/" exact-active-class="active">Posts</RouterLink>
      <RouterLink to="/about" active-class="active">About</RouterLink>
    </nav>
  </header>
</template>

<style scoped>
.site-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28px 0 24px;
  border-bottom: 1px solid var(--border);
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-serif);
  font-size: 18px;
  font-weight: 500;
  color: var(--text);
}
.brand-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent);
  display: inline-block;
}
.brand-sub {
  color: var(--text-soft);
  font-style: italic;
  font-weight: 400;
}

.nav {
  display: flex;
  gap: 24px;
  font-size: 14px;
}
.nav a {
  color: var(--text-soft);
  transition: color 0.15s ease;
  position: relative;
}
.nav a:hover {
  color: var(--text);
}
.nav a.active {
  color: var(--text);
}
.nav a.active::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -6px;
  height: 1px;
  background: var(--accent);
}
</style>
