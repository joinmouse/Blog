/**
 * Loads all markdown posts at build time via import.meta.glob.
 * Each .md file is compiled by unplugin-vue-markdown into a Vue component,
 * with frontmatter exposed as `frontmatter` on the module.
 */

import type { Component } from 'vue';

interface MarkdownModule {
  default: Component;
  // unplugin-vue-markdown 会将 frontmatter 字段作为命名导出
  frontmatter?: Record<string, any>;
  title?: string;
  date?: string;
  issue_number?: number;
  tags?: string[];
  source?: string;
  state?: string;
  [key: string]: any;
}

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  source?: string;
}

export interface PostFull extends PostMeta {
  component: Component;
}

const modules = import.meta.glob<MarkdownModule>('/content/posts/*.md', { eager: true });

const posts: PostFull[] = Object.entries(modules).map(([filepath, mod]) => {
  // unplugin-vue-markdown 在 build 时把 frontmatter 放在 mod.frontmatter，
  // 但在 vitest 环境下会展平到 mod 顶层。两种都兼容。
  const fm = (mod.frontmatter as Record<string, any>) || (mod as Record<string, any>);
  // 从文件名提取前缀数字作为 slug，例如 0001-xxx.md -> "0001"
  const filename = filepath.split('/').pop() || '';
  const slug = filename.replace(/^(\d+)-.*\.md$/, '$1');
  // date 可能是 string ("2018-01-25") 或 Date 对象（YAML 解析后）。
  // 统一规整为 YYYY-MM-DD 字符串。
  let date = '';
  const rawDate = fm.date;
  if (rawDate instanceof Date) {
    date = rawDate.toISOString().slice(0, 10);
  } else if (typeof rawDate === 'string') {
    date = rawDate.slice(0, 10);
  }
  return {
    slug,
    title: fm.title || slug,
    date,
    tags: Array.isArray(fm.tags) ? fm.tags : [],
    source: fm.source,
    component: mod.default,
  };
});

// Sort by slug desc (newest = highest number)
posts.sort((a, b) => b.slug.localeCompare(a.slug));

export function getAllPosts(): PostMeta[] {
  return posts.map(({ component, ...meta }) => meta);
}

export function getPostBySlug(slug: string): PostFull | undefined {
  return posts.find((p) => p.slug === slug);
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

export function getPostsByTag(tag: string): PostMeta[] {
  return getAllPosts().filter((p) => p.tags.includes(tag));
}
