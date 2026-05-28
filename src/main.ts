import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import './styles/reset.css';
import './styles/tokens.css';
import './styles/prose.css';

createApp(App).use(router).mount('#app');
