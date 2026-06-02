<script setup lang="ts">
import { computed, ref } from 'vue';
import { getAllProjects, getAllProjectTags } from '../lib/projects';
import type { ProjectMeta } from '../lib/projects';

const allProjects = getAllProjects();
const allTags = getAllProjectTags();

const activeTag = ref<string | null>(null);

const filtered = computed(() => {
  if (!activeTag.value) return allProjects;
  return allProjects.filter((p) => p.tags.includes(activeTag.value!));
});

function toggleTag(tag: string) {
  activeTag.value = activeTag.value === tag ? null : tag;
}

function projectLink(p: ProjectMeta): string {
  return p.url || p.github || '';
}
</script>

<template>
  <section>
    <header class="intro">
      <h1>Projects</h1>
      <p class="lead">
        AI 时代的作品集 —— 工具、模型与实验。
        共 <strong>{{ allProjects.length }}</strong> 个。
      </p>
    </header>

    <div v-if="allTags.length > 1" class="filter">
      <button
        class="tag-btn"
        :class="{ active: activeTag === null }"
        @click="activeTag = null"
      >
        All<span class="count">·{{ allProjects.length }}</span>
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

    <div class="grid">
      <a
        v-for="p in filtered"
        :key="p.slug"
        :href="projectLink(p)"
        target="_blank"
        rel="noopener"
        class="card"
      >
        <div v-if="p.image" class="card-image">
          <img :src="p.image" :alt="p.title" />
        </div>
        <div class="card-body">
          <h2 class="card-title">{{ p.title }}</h2>
          <p class="card-desc">{{ p.description }}</p>
          <div class="card-footer">
            <div class="card-tags">
              <span v-for="tag in p.tags" :key="tag" class="pill">{{ tag }}</span>
            </div>
            <span class="card-arrow">↗</span>
          </div>
        </div>
      </a>
    </div>
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
  cursor: pointer;
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

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.card {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
  background: var(--bg);
  text-decoration: none;
  color: inherit;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.card:hover {
  border-color: var(--accent);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.card-image {
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: var(--bg-soft);
}
.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-body {
  padding: 16px 18px 18px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.card-title {
  font-family: var(--font-serif);
  font-size: 17px;
  font-weight: 600;
  margin-bottom: 6px;
  line-height: 1.4;
}

.card-desc {
  color: var(--text-soft);
  font-size: 13px;
  line-height: 1.6;
  margin-bottom: 14px;
  flex: 1;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-tags {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}

.pill {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 999px;
  background: var(--bg-soft);
  color: var(--text-faint);
  border: 1px solid var(--border-soft);
}

.card-arrow {
  color: var(--text-faint);
  font-size: 16px;
  transition: color 0.15s ease, transform 0.15s ease;
}
.card:hover .card-arrow {
  color: var(--accent);
  transform: translate(2px, -2px);
}

@media (max-width: 600px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
