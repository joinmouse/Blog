import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import './styles/reset.css';
import './styles/tokens.css';
import './styles/prose.css';

// Prose components — available in all markdown files
import Callout from './components/prose/Callout.vue';
import CodeGroup from './components/prose/CodeGroup.vue';
import LinkCard from './components/prose/LinkCard.vue';
import Steps from './components/prose/Steps.vue';

const app = createApp(App);
app.component('Callout', Callout);
app.component('CodeGroup', CodeGroup);
app.component('LinkCard', LinkCard);
app.component('Steps', Steps);
app.use(router).mount('#app');
