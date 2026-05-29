<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import { getPostBySlug } from '../lib/posts';
import TagPill from '../components/TagPill.vue';

const route = useRoute();
const slug = computed(() => route.params.slug as string);
const post = computed(() => getPostBySlug(slug.value));

function formatDate(d: string): string {
  if (!d) return '';
  const [y, m, day] = d.split('-');
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December'];
  const mi = parseInt(m, 10) - 1;
  if (mi < 0 || mi > 11) return d;
  return `${months[mi]} ${parseInt(day, 10)}, ${y}`;
}
</script>

<template>
  <article v-if="post" class="article">
    <header class="post-header">
      <div class="back">
        <RouterLink to="/">← All posts</RouterLink>
      </div>

      <div v-if="post.tags.length" class="tags-top">
        <TagPill v-for="t in post.tags" :key="t" :tag="t" />
      </div>

      <h1 class="title">{{ post.title }}</h1>

      <div class="meta">
        <time :datetime="post.date" class="date">{{ formatDate(post.date) }}</time>
        <span v-if="post.source" class="dot">·</span>
        <a v-if="post.source" :href="post.source" target="_blank" rel="noopener" class="src">
          GitHub ↗
        </a>
      </div>
    </header>

    <div class="body">
      <component :is="post.component" />
    </div>

    <footer class="post-footer">
      <RouterLink to="/" class="back-link">← Back to all posts</RouterLink>
    </footer>
  </article>

  <div v-else class="not-found">
    <h1>404</h1>
    <p>Post not found.</p>
    <RouterLink to="/">← Back to home</RouterLink>
  </div>
</template>

<style scoped>
.article {
  max-width: var(--content-max);
  margin: 0 auto;
}

.post-header {
  margin-bottom: 40px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--border);
}

.back {
  margin-bottom: 24px;
  font-size: 13px;
}
.back a {
  color: var(--text-soft);
  text-decoration: none;
  transition: color 0.15s ease;
}
.back a:hover {
  color: var(--accent);
}

.title {
  font-family: var(--font-serif);
  font-size: 2.1rem;
  font-weight: 500;
  line-height: 1.25;
  letter-spacing: -0.01em;
  margin-bottom: 16px;
  color: var(--text);
}

.tags-top {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-mono);
  font-size: 12.5px;
  color: var(--text-faint);
  flex-wrap: wrap;
}
.date {
  color: var(--text-soft);
  letter-spacing: 0.02em;
}
.dot {
  color: var(--text-faint);
}
.src {
  color: var(--text-soft);
  text-decoration: none;
  transition: color 0.15s ease;
}
.src:hover {
  color: var(--accent);
}

.body {
  margin-bottom: 64px;
}

.post-footer {
  border-top: 1px solid var(--border);
  padding-top: 24px;
}
.back-link {
  font-size: 13px;
  color: var(--text-soft);
  text-decoration: none;
  transition: color 0.15s ease;
}
.back-link:hover {
  color: var(--accent);
}

.not-found {
  text-align: center;
  padding: 80px 0;
}
.not-found h1 {
  font-family: var(--font-serif);
  font-size: 4rem;
  color: var(--text-faint);
}
.not-found p {
  color: var(--text-soft);
  margin: 16px 0 24px;
}
.not-found a {
  color: var(--accent);
  text-decoration: underline;
  text-underline-offset: 3px;
}

@media (max-width: 600px) {
  .title {
    font-size: 1.6rem;
  }
}
</style>
