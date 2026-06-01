import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { createRouter, createMemoryHistory } from 'vue-router';
import Home from '../src/pages/Home.vue';

function makeRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/:pathMatch(.*)*', component: { template: '<div />' } }],
  });
}

describe('Home page', () => {
  it('renders all posts', async () => {
    const router = makeRouter();
    const wrapper = mount(Home, { global: { plugins: [router] } });
    await router.isReady();

    const cards = wrapper.findAll('a.card');
    // at least the 26 GitHub issues; usually 26 + ~100 jianshu
    expect(cards.length).toBeGreaterThanOrEqual(26);
  });

  it('shows total count in lead text', async () => {
    const router = makeRouter();
    const wrapper = mount(Home, { global: { plugins: [router] } });
    await router.isReady();

    // total appears somewhere on the page
    expect(wrapper.text()).toMatch(/\d+/);
  });

  it('renders tag filter buttons including All + at least one tag', async () => {
    const router = makeRouter();
    const wrapper = mount(Home, { global: { plugins: [router] } });
    await router.isReady();

    const btns = wrapper.findAll('button.tag-btn');
    expect(btns.length).toBeGreaterThan(1);
    expect(btns[0].text()).toContain('All');
  });

  it('clicking a tag button filters the post list', async () => {
    const router = makeRouter();
    const wrapper = mount(Home, { global: { plugins: [router] } });
    await router.isReady();

    const tsBtn = wrapper
      .findAll('button.tag-btn')
      .find((b) => b.text().startsWith('TypeScript'));
    expect(tsBtn).toBeDefined();
    await tsBtn!.trigger('click');

    const cards = wrapper.findAll('a.card');
    expect(cards.length).toBe(11); // TypeScript has 11 posts
  });
});
