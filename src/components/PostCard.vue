<script setup lang="ts">
import { RouterLink } from 'vue-router';
import type { PostMeta } from '../lib/posts';

defineProps<{ post: PostMeta }>();

function formatDate(d: string): string {
  // "2019-08-21" -> "Aug 21, 2019"
  if (!d) return '';
  const [y, m, day] = d.split('-');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const mi = parseInt(m, 10) - 1;
  if (mi < 0 || mi > 11) return d;
  return `${months[mi]} ${parseInt(day, 10)}, ${y}`;
}
</script>

<template>
  <RouterLink :to="`/posts/${post.slug}`" class="card">
    <div class="row">
      <h3 class="title">{{ post.title }}</h3>
      <time class="date" :datetime="post.date">{{ formatDate(post.date) }}</time>
    </div>
    <div v-if="post.tags.length" class="tags">
      <span v-for="(t, i) in post.tags" :key="t" class="tag">
        <span v-if="i > 0" class="sep">·</span>{{ t }}
      </span>
    </div>
  </RouterLink>
</template>

<style scoped>
.card {
  display: block;
  padding: 18px 14px;
  margin: 0 -14px;
  border-bottom: 1px solid var(--border-soft);
  transition: background 0.15s ease;
  text-decoration: none;
  color: inherit;
  border-radius: 6px;
}
.card:hover {
  background: var(--bg-soft);
}
.card:hover .title {
  color: var(--accent);
}

.row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
}
.title {
  font-family: var(--font-serif);
  font-size: 17px;
  font-weight: 500;
  color: var(--text);
  transition: color 0.15s ease;
  flex: 1;
  min-width: 0;
  line-height: 1.4;
}

.date {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--text-faint);
  flex-shrink: 0;
  white-space: nowrap;
  letter-spacing: 0.02em;
}
.tags {
  display: flex;
  gap: 4px;
  margin-top: 6px;
  flex-wrap: wrap;
  font-size: 12px;
  color: var(--text-soft);
}
.tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.sep {
  color: var(--text-faint);
}

@media (max-width: 600px) {
  .row {
    flex-direction: column;
    gap: 4px;
  }
  .date {
    font-size: 11px;
  }
}
</style>
