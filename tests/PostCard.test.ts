import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { createRouter, createMemoryHistory } from 'vue-router';
import PostCard from '../src/components/PostCard.vue';
import type { PostMeta } from '../src/lib/posts';

function makeRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/:any(.*)', component: { template: '<div />' } }],
  });
}

const samplePost: PostMeta = {
  slug: '0007',
  title: 'JavaScript之数组去重引发的思考',
  date: '2018-05-12',
  tags: ['JS深入浅出', 'Best Practice'],
  source: 'https://github.com/joinmouse/Blog/issues/7',
};

describe('PostCard', () => {
  it('renders the post title', async () => {
    const router = makeRouter();
    const wrapper = mount(PostCard, {
      props: { post: samplePost },
      global: { plugins: [router] },
    });
    await router.isReady();

    expect(wrapper.text()).toContain('JavaScript之数组去重引发的思考');
  });

  it('formats the date in human form (e.g. "May 12, 2018")', async () => {
    const router = makeRouter();
    const wrapper = mount(PostCard, {
      props: { post: samplePost },
      global: { plugins: [router] },
    });
    await router.isReady();

    expect(wrapper.text()).toContain('May 12, 2018');
  });

  it('renders all tags', async () => {
    const router = makeRouter();
    const wrapper = mount(PostCard, {
      props: { post: samplePost },
      global: { plugins: [router] },
    });
    await router.isReady();

    const text = wrapper.text();
    expect(text).toContain('JS深入浅出');
    expect(text).toContain('Best Practice');
  });

  it('links to /posts/<slug>', async () => {
    const router = makeRouter();
    const wrapper = mount(PostCard, {
      props: { post: samplePost },
      global: { plugins: [router] },
    });
    await router.isReady();

    const link = wrapper.find('a');
    expect(link.attributes('href')).toBe('/posts/0007');
  });
});
