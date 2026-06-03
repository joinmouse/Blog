import { createRouter, createWebHistory } from 'vue-router';

const Home = () => import('./pages/Home.vue');
const Post = () => import('./pages/Post.vue');
const Tag = () => import('./pages/Tag.vue');
const About = () => import('./pages/About.vue');
const Life = () => import('./pages/Life.vue');
const Projects = () => import('./pages/Projects.vue');

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: Home },
    { path: '/posts/:slug', name: 'post', component: Post, props: true },
    { path: '/tags/:tag', name: 'tag', component: Tag, props: true },
    { path: '/about', name: 'about', component: About },
    { path: '/projects', name: 'projects', component: Projects },
    { path: '/life', name: 'life', component: Life },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  scrollBehavior(to, _from, saved) {
    if (saved) return saved;
    if (to.hash) return { el: to.hash, top: 80 };
    return { top: 0 };
  },
});

export default router;
