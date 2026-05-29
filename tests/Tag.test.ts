import { describe, it, expect } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createRouter, createMemoryHistory } from 'vue-router';
import Tag from '../src/pages/Tag.vue';

describe('Tag page', () => {
  it('shows posts matching the tag in the URL', async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/tags/:tag', component: Tag, props: true },
        { path: '/:pathMatch(.*)*', component: { template: '<div />' } },
      ],
    });
    router.push('/tags/TypeScript');
    await router.isReady();

    const wrapper = mount(Tag, { global: { plugins: [router] } });
    await flushPromises();

    const cards = wrapper.findAll('a.card');
    expect(cards.length).toBe(11);
    expect(wrapper.text()).toContain('TypeScript');
    expect(wrapper.text()).toContain('11');
  });

  it('shows zero posts for an unknown tag', async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/tags/:tag', component: Tag, props: true },
        { path: '/:pathMatch(.*)*', component: { template: '<div />' } },
      ],
    });
    router.push('/tags/NoSuchTag');
    await router.isReady();

    const wrapper = mount(Tag, { global: { plugins: [router] } });
    await flushPromises();

    expect(wrapper.findAll('a.card').length).toBe(0);
    expect(wrapper.text()).toContain('NoSuchTag');
    expect(wrapper.text()).toContain('0');
  });
});
