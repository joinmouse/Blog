import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default defineConfig(async (env) => {
  const base = await (typeof viteConfig === 'function' ? viteConfig(env) : viteConfig);
  return mergeConfig(base, {
    test: {
      environment: 'happy-dom',
      globals: true,
      include: ['tests/**/*.test.ts'],
      // import.meta.glob in posts.ts uses absolute path /content/posts;
      // vitest reuses our vite resolve config so it works automatically.
    },
  });
});
