<script setup lang="ts">
import { RouterLink } from 'vue-router';

defineProps<{
  tag: string;
  active?: boolean;
  count?: number;
  asLink?: boolean;
}>();
</script>

<template>
  <RouterLink
    v-if="asLink !== false"
    :to="`/tags/${encodeURIComponent(tag)}`"
    class="pill"
    :class="{ active }"
  >
    {{ tag }}<span v-if="count != null" class="count">·{{ count }}</span>
  </RouterLink>
  <span v-else class="pill" :class="{ active }">{{ tag }}</span>
</template>

<style scoped>
.pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  padding: 3px 10px;
  border: 1px solid var(--border);
  border-radius: 999px;
  color: var(--text-soft);
  background: var(--bg-soft);
  transition: all 0.15s ease;
  white-space: nowrap;
  text-decoration: none;
  font-family: var(--font-sans);
}
.pill:hover {
  border-color: var(--accent);
  color: var(--accent);
  background: var(--bg);
}
.pill.active {
  border-color: var(--accent);
  background: var(--accent-soft);
  color: var(--accent-hover);
}
.count {
  color: var(--text-faint);
  font-size: 11px;
}
</style>
