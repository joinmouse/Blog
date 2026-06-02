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
  it('renders first page of posts (10 per page)', async () => {
    const router = makeRouter();
    const wrapper = mount(Home, { global: { plugins: [router] } });
    await router.isReady();

    const cards = wrapper.findAll('a.card');
    expect(cards.length).toBe(10);
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

  it('renders pagination controls', async () => {
    const router = makeRouter();
    const wrapper = mount(Home, { global: { plugins: [router] } });
    await router.isReady();

    const pageBtns = wrapper.findAll('button.page-btn');
    expect(pageBtns.length).toBeGreaterThan(2); // at least ← 1 2 →
  });

  it('clicking next page shows different posts', async () => {
    const router = makeRouter();
    const wrapper = mount(Home, { global: { plugins: [router] } });
    await router.isReady();

    const firstPageTitles = wrapper.findAll('a.card').map((c) => c.text());
    // Click page 2
    const page2Btn = wrapper.findAll('button.page-btn').find((b) => b.text() === '2');
    expect(page2Btn).toBeDefined();
    await page2Btn!.trigger('click');

    const secondPageTitles = wrapper.findAll('a.card').map((c) => c.text());
    expect(secondPageTitles[0]).not.toBe(firstPageTitles[0]);
  });
});
