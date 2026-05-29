import { describe, it, expect } from 'vitest';
import { getAllPosts, getAllTags, getPostBySlug, getPostsByTag } from '../src/lib/posts';

describe('posts library', () => {
  it('loads all 26 posts from content/posts/', () => {
    const posts = getAllPosts();
    expect(posts.length).toBe(26);
  });

  it('every post has the required metadata', () => {
    for (const p of getAllPosts()) {
      expect(p.slug).toMatch(/^\d{4}$/); // four-digit slug
      expect(p.title).toBeTruthy();
      expect(p.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(Array.isArray(p.tags)).toBe(true);
    }
  });

  it('posts are sorted by slug descending (newest first)', () => {
    const slugs = getAllPosts().map((p) => p.slug);
    const sorted = [...slugs].sort().reverse();
    expect(slugs).toEqual(sorted);
    expect(slugs[0]).toBe('0026');
    expect(slugs[slugs.length - 1]).toBe('0001');
  });

  it('looks up a post by slug', () => {
    const post = getPostBySlug('0026');
    expect(post).toBeDefined();
    expect(post!.title).toContain('闭包');
  });

  it('returns undefined for unknown slug', () => {
    expect(getPostBySlug('9999')).toBeUndefined();
  });

  it('aggregates tags with correct counts', () => {
    const tags = getAllTags();
    expect(tags.length).toBeGreaterThan(0);
    // TypeScript tag should have 11 posts (issues 14-24)
    const ts = tags.find((t) => t.tag === 'TypeScript');
    expect(ts).toBeDefined();
    expect(ts!.count).toBe(11);
  });

  it('filters posts by tag', () => {
    const tsPosts = getPostsByTag('TypeScript');
    expect(tsPosts.length).toBe(11);
    expect(tsPosts.every((p) => p.tags.includes('TypeScript'))).toBe(true);
  });
});
