<script setup lang="ts">
defineProps<{
  title: string;
  url: string;
  description?: string;
}>();
</script>

<template>
  <a :href="url" target="_blank" rel="noopener" class="link-card">
    <div class="link-card-body">
      <span class="link-card-title">{{ title }}</span>
      <span v-if="description" class="link-card-desc">{{ description }}</span>
      <span class="link-card-url">{{ url }}</span>
    </div>
    <span class="link-card-arrow">↗</span>
  </a>
</template>

<style scoped>
.link-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 18px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--bg);
  text-decoration: none;
  color: inherit;
  margin: 1.2em 0;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.link-card:hover {
  border-color: var(--accent);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}
.link-card:hover .link-card-title {
  color: var(--accent);
}

.link-card-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.link-card-title {
  font-weight: 500;
  font-size: 15px;
  color: var(--text);
  transition: color 0.15s ease;
}

.link-card-desc {
  font-size: 13px;
  color: var(--text-soft);
  line-height: 1.5;
}

.link-card-url {
  font-size: 12px;
  font-family: var(--font-mono);
  color: var(--text-faint);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.link-card-arrow {
  flex-shrink: 0;
  font-size: 18px;
  color: var(--text-faint);
  transition: color 0.15s ease;
}
.link-card:hover .link-card-arrow {
  color: var(--accent);
}
</style>
