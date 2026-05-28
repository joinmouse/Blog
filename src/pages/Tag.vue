<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import { getPostsByTag } from '../lib/posts';
import PostCard from '../components/PostCard.vue';

const route = useRoute();
const tag = computed(() => decodeURIComponent(route.params.tag as string));
const posts = computed(() => getPostsByTag(tag.value));
</script>

<template>
  <section>
    <div class="back">
      <RouterLink to="/">← All posts</RouterLink>
    </div>
    <h1 class="title">
      <span class="hash">#</span>{{ tag }}
    </h1>
    <p class="meta">{{ posts.length }} 篇文章</p>

    <ul class="posts">
      <li v-for="p in posts" :key="p.slug">
        <PostCard :post="p" />
      </li>
    </ul>
  </section>
</template>

<style scoped>
.back {
  margin-bottom: 24px;
  font-size: 13px;
}
.back a {
  color: var(--text-soft);
  text-decoration: none;
}
.back a:hover {
  color: var(--accent);
}

.title {
  font-family: var(--font-serif);
  font-size: 2rem;
  font-weight: 500;
  letter-spacing: -0.01em;
  margin-bottom: 8px;
}
.hash {
  color: var(--accent);
  margin-right: 4px;
}
.meta {
  color: var(--text-soft);
  font-size: 14px;
  margin-bottom: 32px;
}

.posts {
  list-style: none;
  padding: 0;
}
</style>
