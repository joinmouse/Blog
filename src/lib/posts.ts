/**
 * Loads all markdown posts at build time via import.meta.glob.
 * Each .md file is compiled by unplugin-vue-markdown into a Vue component,
 * with frontmatter exposed as `frontmatter` on the module.
 */

import type { Component } from 'vue';

interface MarkdownModule {
  default: Component;
  frontmatter: Record<string, any>;
}

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  issueNumber: number;
  tags: string[];
  source?: string;
}

export interface PostFull extends PostMeta {
  component: Component;
}

const modules = import.meta.glob<MarkdownModule>('/content/posts/*.md', { eager: true });

const posts: PostFull[] = Object.entries(modules).map(([filepath, mod]) => {
  const fm = mod.frontmatter || {};
  const issueNumber = Number(fm.issue_number) || 0;
  // URL slug = issue number, e.g. /posts/26
  const slug = String(issueNumber);
  return {
    slug,
    title: fm.title || slug,
    date: fm.date || '',
    issueNumber,
    tags: Array.isArray(fm.tags) ? fm.tags : [],
    source: fm.source,
    component: mod.default,
  };
});

// Sort by issue_number desc (newest = highest issue number)
posts.sort((a, b) => b.issueNumber - a.issueNumber);

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
