/**
 * Post metadata is loaded from a build-time manifest (posts-manifest.json).
 * Post components are lazy-loaded via import.meta.glob so they are split
 * into their own chunks instead of being bundled into the main JS bundle.
 */

import type { Component } from 'vue';

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  source?: string;
  category?: string;
}

export interface PostFull extends PostMeta {
  component: Component;
}

interface ManifestEntry extends PostMeta {
  filepath: string;
}

// --- Metadata from manifest (tiny, synchronous) ---

import manifest from './posts-manifest.json';

const posts: PostMeta[] = manifest as ManifestEntry[];

// --- Lazy component loading ---

const postModules = import.meta.glob('/content/posts/**/*.md');

// Build filepath -> importFn map (strip leading / to match manifest format)
const filepathToImport: Record<string, () => Promise<{ default: Component }>> = {};
for (const [key, importFn] of Object.entries(postModules)) {
  filepathToImport[key.replace(/^\//, '')] = importFn as () => Promise<{ default: Component }>;
}

// --- Public API ---

export function getAllPosts(): PostMeta[] {
  return posts;
}

export function getPostMeta(slug: string): PostMeta | undefined {
  return posts.find((p) => p.slug === slug);
}

export async function getPostBySlug(slug: string): Promise<PostFull | undefined> {
  const entry = (manifest as ManifestEntry[]).find((p) => p.slug === slug);
  if (!entry || !entry.filepath) return undefined;

  const importFn = filepathToImport[entry.filepath];
  if (!importFn) return undefined;

  const mod = await importFn();
  const component = (mod as any).default || mod;

  return { ...entry, component: component as Component };
}

export function getAllTags(): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const p of posts) {
    for (const t of p.tags) {
      counts.set(t, (counts.get(t) || 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

export function getAllCategories(): { category: string; count: number; label: string }[] {
  const labels: Record<string, string> = {
    javascript: 'JavaScript',
    typescript: 'TypeScript',
    css: 'CSS',
    jquery: 'jQuery',
    ajax: 'Ajax & HTTP',
    vue: 'Vue',
    engineering: '工程化',
    browser: '浏览器',
    java: 'Java',
    node: 'Node.js',
    react: 'React',
    blockchain: 'Blockchain',
  };
  const counts = new Map<string, number>();
  for (const p of posts) {
    if (p.category) counts.set(p.category, (counts.get(p.category) || 0) + 1);
  }
  return [...counts.entries()]
    .map(([category, count]) => ({
      category,
      count,
      label: labels[category] || category,
    }))
    .sort((a, b) => b.count - a.count);
}

export function getPostsByCategory(category: string): PostMeta[] {
  return getAllPosts().filter((p) => p.category === category);
}

export function getPostsByTag(tag: string): PostMeta[] {
  return getAllPosts().filter((p) => p.tags.includes(tag));
}
