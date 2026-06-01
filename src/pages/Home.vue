<script setup lang="ts">
import { computed, ref } from 'vue';
import { getAllPosts, getAllCategories } from '../lib/posts';
import PostCard from '../components/PostCard.vue';

const allPosts = getAllPosts();
const allCategories = getAllCategories();

const activeCategory = ref<string | null>(null);

const filtered = computed(() => {
  if (!activeCategory.value) return allPosts;
  return allPosts.filter((p) => (p.category || 'github') === activeCategory.value);
});

function toggleCategory(cat: string) {
  activeCategory.value = activeCategory.value === cat ? null : cat;
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
        class="cat-btn"
        :class="{ active: activeCategory === null }"
        @click="activeCategory = null"
      >
        All<span class="count">·{{ allPosts.length }}</span>
      </button>
      <button
        v-for="c in allCategories"
        :key="c.category"
        class="cat-btn"
        :class="{ active: activeCategory === c.category }"
        @click="toggleCategory(c.category)"
      >
        {{ c.label }}<span class="count">·{{ c.count }}</span>
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

.cat-btn {
  font-size: 12px;
  padding: 5px 12px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: var(--bg);
  color: var(--text-soft);
  font-family: var(--font-sans);
  transition: all 0.15s ease;
  cursor: pointer;
}
.cat-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}
.cat-btn.active {
  background: var(--accent);
  color: white;
  border-color: var(--accent);
}
.cat-btn.active .count {
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
