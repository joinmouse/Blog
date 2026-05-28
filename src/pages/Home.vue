<script setup lang="ts">
import { computed, ref } from 'vue';
import { getAllPosts, getAllTags } from '../lib/posts';
import PostCard from '../components/PostCard.vue';

const allPosts = getAllPosts();
const allTags = getAllTags();

const activeTag = ref<string | null>(null);

const filtered = computed(() => {
  if (!activeTag.value) return allPosts;
  return allPosts.filter((p) => p.tags.includes(activeTag.value!));
});

function toggleTag(t: string) {
  activeTag.value = activeTag.value === t ? null : t;
}
</script>

<template>
  <section>
    <header class="intro">
      <h1>Notes</h1>
      <p class="lead">
        前端工程的小笔记 —— JavaScript、TypeScript、Vue 与一些杂感。
        共 <strong>{{ allPosts.length }}</strong> 篇。
      </p>
    </header>

    <div class="filter">
      <button
        class="tag-btn"
        :class="{ active: activeTag === null }"
        @click="activeTag = null"
      >
        All<span class="count">·{{ allPosts.length }}</span>
      </button>
      <button
        v-for="t in allTags"
        :key="t.tag"
        class="tag-btn"
        :class="{ active: activeTag === t.tag }"
        @click="toggleTag(t.tag)"
      >
        {{ t.tag }}<span class="count">·{{ t.count }}</span>
      </button>
    </div>

    <ul class="posts">
      <li v-for="p in filtered" :key="p.slug">
        <PostCard :post="p" />
      </li>
    </ul>
  </section>
</template>

<style scoped>
.intro {
  margin-bottom: 40px;
}
.intro h1 {
  font-family: var(--font-serif);
  font-size: 2.4rem;
  font-weight: 500;
  letter-spacing: -0.02em;
  margin-bottom: 12px;
}
.lead {
  color: var(--text-soft);
  font-size: 15px;
  max-width: 540px;
  line-height: 1.7;
}

.filter {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border-soft);
}

.tag-btn {
  font-size: 12px;
  padding: 5px 12px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: var(--bg);
  color: var(--text-soft);
  font-family: var(--font-sans);
  transition: all 0.15s ease;
}
.tag-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}
.tag-btn.active {
  background: var(--accent);
  color: white;
  border-color: var(--accent);
}
.tag-btn.active .count {
  color: rgba(255, 255, 255, 0.75);
}
.count {
  color: var(--text-faint);
  margin-left: 3px;
  font-size: 11px;
}

.posts {
  list-style: none;
  padding: 0;
}
</style>
