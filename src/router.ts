import { createRouter, createWebHistory } from 'vue-router';
import Home from './pages/Home.vue';
import Post from './pages/Post.vue';
import Tag from './pages/Tag.vue';
import About from './pages/About.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: Home },
    { path: '/posts/:slug', name: 'post', component: Post, props: true },
    { path: '/tags/:tag', name: 'tag', component: Tag, props: true },
    { path: '/about', name: 'about', component: About },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  scrollBehavior(to, _from, saved) {
    if (saved) return saved;
    if (to.hash) return { el: to.hash, top: 80 };
    return { top: 0 };
  },
});

export default router;
