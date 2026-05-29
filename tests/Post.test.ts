import { describe, it, expect } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createRouter, createMemoryHistory } from 'vue-router';
import Post from '../src/pages/Post.vue';

function makeRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/posts/:slug', component: Post, props: true },
      { path: '/:pathMatch(.*)*', component: { template: '<div />' } },
    ],
  });
}

describe('Post page', () => {
  it('renders the article when slug matches a real post', async () => {
    const router = makeRouter();
    router.push('/posts/0026');
    await router.isReady();

    const wrapper = mount(Post, { global: { plugins: [router] } });
    await flushPromises();

    expect(wrapper.text()).toContain('闭包');
    expect(wrapper.find('article.article').exists()).toBe(true);
  });

  it('shows the formatted date in long form', async () => {
    const router = makeRouter();
    router.push('/posts/0026');
    await router.isReady();

    const wrapper = mount(Post, { global: { plugins: [router] } });
    await flushPromises();

    // post 0026 is dated 2019-08-21 → "August 21, 2019"
    expect(wrapper.text()).toMatch(/August 21, 2019/);
  });

  it('shows 404 view when slug does not exist', async () => {
    const router = makeRouter();
    router.push('/posts/9999');
    await router.isReady();

    const wrapper = mount(Post, { global: { plugins: [router] } });
    await flushPromises();

    expect(wrapper.text()).toContain('404');
    expect(wrapper.text()).toContain('not found');
    expect(wrapper.find('article.article').exists()).toBe(false);
  });
});
