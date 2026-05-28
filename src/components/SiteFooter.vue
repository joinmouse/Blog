<script setup lang="ts"></script>

<template>
  <footer class="site-footer">
    <div>© {{ new Date().getFullYear() }} joinmouse</div>
    <div class="meta">
      <a href="https://github.com/joinmouse/Blog" target="_blank" rel="noopener">Source on GitHub</a>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 0;
  border-top: 1px solid var(--border);
  font-size: 13px;
  color: var(--text-faint);
}
.meta a {
  color: var(--text-soft);
  text-decoration: none;
  transition: color 0.15s ease;
}
.meta a:hover {
  color: var(--accent);
}
@media (max-width: 600px) {
  .site-footer {
    flex-direction: column;
    gap: 8px;
    text-align: center;
  }
}
</style>
