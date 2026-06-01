<script setup lang="ts">
defineProps<{
  type?: 'tip' | 'info' | 'warning' | 'note';
}>();

const icons: Record<string, string> = {
  tip: '💡',
  info: 'ℹ️',
  warning: '⚠️',
  note: '📝',
};
</script>

<template>
  <div class="callout" :class="`callout-${type || 'note'}`">
    <span class="callout-icon">{{ icons[type || 'note'] }}</span>
    <div class="callout-body">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.callout {
  display: flex;
  gap: 12px;
  padding: 16px 18px;
  border-radius: 8px;
  margin: 1.4em 0;
  font-size: 15px;
  line-height: 1.7;
  border: 1px solid var(--border);
}
.callout-icon {
  flex-shrink: 0;
  font-size: 18px;
  line-height: 1.7;
}
.callout-body {
  flex: 1;
  min-width: 0;
}
.callout-body :deep(p) {
  margin: 0;
}
.callout-body :deep(p + p) {
  margin-top: 0.6em;
}

.callout-tip {
  background: #f0faf0;
  border-color: #c3e6c3;
}
.callout-info {
  background: #eff6ff;
  border-color: #bfdbfe;
}
.callout-warning {
  background: #fffbeb;
  border-color: #fde68a;
}
.callout-note {
  background: var(--bg-soft);
  border-color: var(--border);
}
</style>
