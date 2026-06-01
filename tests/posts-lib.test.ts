import { describe, it, expect } from 'vitest';
import { getAllPosts, getAllTags, getPostBySlug, getPostsByTag } from '../src/lib/posts';

describe('posts library', () => {
  it('loads all posts from content/posts/', () => {
    const posts = getAllPosts();
    // 26 from GitHub Issues + 105 from jianshu = 131
    expect(posts.length).toBeGreaterThanOrEqual(26);
  });

  it('every post has the required metadata', () => {
    for (const p of getAllPosts()) {
      // GitHub posts: 4-digit slug like "0026"; jianshu: "j-xxxxxxxx"
      expect(p.slug).toMatch(/^(\d{4}|j-[a-z0-9]+)$/);
      expect(p.title).toBeTruthy();
      expect(p.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(Array.isArray(p.tags)).toBe(true);
    }
  });

  it('posts are sorted by date descending', () => {
    const dates = getAllPosts().map((p) => p.date);
    const sorted = [...dates].sort().reverse();
    expect(dates).toEqual(sorted);
  });

  it('looks up a GitHub post by slug', () => {
    const post = getPostBySlug('0026');
    expect(post).toBeDefined();
    expect(post!.title).toContain('闭包');
  });

  it('looks up a jianshu post by slug', () => {
    const post = getPostBySlug('j-0fc76e1b1558');
    expect(post).toBeDefined();
    expect(post!.tags).toContain('简书');
  });

  it('returns undefined for unknown slug', () => {
    expect(getPostBySlug('9999')).toBeUndefined();
  });

  it('aggregates tags with correct counts', () => {
    const tags = getAllTags();
    expect(tags.length).toBeGreaterThan(0);
    // TypeScript tag should still have 11 (from GitHub Issues)
    const ts = tags.find((t) => t.tag === 'TypeScript');
    expect(ts).toBeDefined();
    expect(ts!.count).toBe(11);
    // 简书 tag should match the imported jianshu count
    const js = tags.find((t) => t.tag === '简书');
    expect(js).toBeDefined();
    expect(js!.count).toBeGreaterThanOrEqual(40);
  });

  it('filters posts by tag', () => {
    const tsPosts = getPostsByTag('TypeScript');
    expect(tsPosts.length).toBe(11);
    expect(tsPosts.every((p) => p.tags.includes('TypeScript'))).toBe(true);
  });
});
