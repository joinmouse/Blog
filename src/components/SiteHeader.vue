<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { search, type SearchResult } from '../lib/search';

const router = useRouter();
const open = ref(false);
const query = ref('');
const results = ref<SearchResult[]>([]);
const loading = ref(false);
let debounceTimer: ReturnType<typeof setTimeout> | null = null;

const inputRef = ref<HTMLInputElement | null>(null);

function toggleSearch() {
  open.value = !open.value;
  if (open.value) {
    setTimeout(() => inputRef.value?.focus(), 50);
  } else {
    query.value = '';
    results.value = [];
  }
}

function closeSearch() {
  open.value = false;
  query.value = '';
  results.value = [];
}

watch(query, (q) => {
  if (debounceTimer) clearTimeout(debounceTimer);
  if (!q.trim()) {
    results.value = [];
    return;
  }
  debounceTimer = setTimeout(async () => {
    loading.value = true;
    try {
      results.value = await search(q);
    } catch {
      results.value = [];
    }
    loading.value = false;
  }, 300);
});

function goResult(slug: string) {
  closeSearch();
  router.push(`/posts/${slug}`);
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') closeSearch();
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    toggleSearch();
  }
}

onMounted(() => document.addEventListener('keydown', onKeydown));
onUnmounted(() => document.removeEventListener('keydown', onKeydown));
</script>

<template>
  <header class="site-header">
    <RouterLink to="/" class="brand">
      <span class="brand-dot" />
      <span class="brand-name">joinmouse</span>
    </RouterLink>

    <div class="header-right">
      <!-- Search trigger -->
      <button class="search-btn" @click="toggleSearch" title="搜索 (⌘K)">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
      </button>

      <nav class="nav">
        <RouterLink to="/" exact-active-class="active">Blog</RouterLink>
        <RouterLink to="/projects" active-class="active">Projects</RouterLink>
        <RouterLink to="/life" active-class="active">Life</RouterLink>
        <RouterLink to="/about" active-class="active">About</RouterLink>
      </nav>
    </div>

    <!-- Search overlay -->
    <Teleport to="body">
      <div v-if="open" class="search-overlay" @click.self="closeSearch">
        <div class="search-modal">
          <div class="search-input-wrap">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              ref="inputRef"
              v-model="query"
              type="text"
              placeholder="搜索文章..."
              class="search-input"
            />
            <kbd class="search-kbd">ESC</kbd>
          </div>
          <div v-if="results.length || loading" class="search-results">
            <div v-if="loading" class="search-loading">搜索中...</div>
            <div v-else-if="results.length === 0 && query.trim()" class="search-empty">
              未找到相关文章
            </div>
            <button
              v-for="r in results"
              :key="r.slug"
              class="search-result"
              @click="goResult(r.slug)"
            >
              <div class="search-result-title">{{ r.title }}</div>
              <div class="search-result-meta">
                <span v-if="r.category" class="search-result-cat">{{ r.category }}</span>
                <span class="search-result-date">{{ r.date }}</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </header>
</template>

<style scoped>
.site-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28px 0 24px;
  border-bottom: 1px solid var(--border);
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-serif);
  font-size: 18px;
  font-weight: 500;
  color: var(--text);
  text-decoration: none;
}
.brand-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent);
  display: inline-block;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.search-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--bg);
  color: var(--text-faint);
  cursor: pointer;
  transition: all 0.15s ease;
}
.search-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.nav {
  display: flex;
  gap: 24px;
  font-size: 14px;
}
.nav a {
  color: var(--text-soft);
  transition: color 0.15s ease;
  position: relative;
  text-decoration: none;
}
.nav a:hover {
  color: var(--text);
}
.nav a.active {
  color: var(--text);
}
.nav a.active::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -6px;
  height: 1px;
  background: var(--accent);
}

/* Overlay */
.search-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(0, 0, 0, 0.25);
  display: flex;
  justify-content: center;
  padding-top: 15vh;
}

.search-modal {
  width: 90%;
  max-width: 520px;
  background: var(--bg);
  border-radius: 12px;
  border: 1px solid var(--border);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  height: fit-content;
  max-height: 60vh;
  display: flex;
  flex-direction: column;
}

.search-input-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  border-bottom: 1px solid var(--border-soft);
  color: var(--text-faint);
}
.search-input {
  flex: 1;
  border: none;
  outline: none;
  background: none;
  font-size: 16px;
  font-family: var(--font-sans);
  color: var(--text);
}
.search-input::placeholder {
  color: var(--text-faint);
}
.search-kbd {
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid var(--border);
  color: var(--text-faint);
  font-family: var(--font-sans);
}

.search-results {
  overflow-y: auto;
}

.search-loading,
.search-empty {
  padding: 20px;
  text-align: center;
  font-size: 14px;
  color: var(--text-faint);
}

.search-result {
  display: block;
  width: 100%;
  text-align: left;
  padding: 12px 16px;
  border: none;
  background: none;
  cursor: pointer;
  transition: background 0.15s ease;
  font-family: var(--font-sans);
}
.search-result:hover {
  background: var(--bg-soft);
}

.search-result-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--text);
  margin-bottom: 3px;
}

.search-result-meta {
  display: flex;
  gap: 8px;
  font-size: 12px;
  color: var(--text-faint);
}

.search-result-cat {
  color: var(--accent);
}

@media (max-width: 600px) {
  .nav {
    gap: 16px;
    font-size: 13px;
  }
  .search-btn {
    width: 28px;
    height: 28px;
  }
}
</style>
