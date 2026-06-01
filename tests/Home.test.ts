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
    expect(cards.length).toBeGreaterThanOrEqual(26);
  });

  it('shows total count in lead text', async () => {
    const router = makeRouter();
    const wrapper = mount(Home, { global: { plugins: [router] } });
    await router.isReady();

    expect(wrapper.text()).toMatch(/\d+/);
  });

  it('renders category filter buttons including All + at least one category', async () => {
    const router = makeRouter();
    const wrapper = mount(Home, { global: { plugins: [router] } });
    await router.isReady();

    const btns = wrapper.findAll('button.cat-btn');
    expect(btns.length).toBeGreaterThan(1);
    expect(btns[0].text()).toContain('All');
  });

  it('clicking a category button filters the post list', async () => {
    const router = makeRouter();
    const wrapper = mount(Home, { global: { plugins: [router] } });
    await router.isReady();

    const jsBtn = wrapper
      .findAll('button.cat-btn')
      .find((b) => b.text().startsWith('JavaScript'));
    expect(jsBtn).toBeDefined();
    await jsBtn!.trigger('click');

    const cards = wrapper.findAll('a.card');
    // javascript subdirectory has 24 jianshu articles
    expect(cards.length).toBeGreaterThanOrEqual(20);
  });
});
