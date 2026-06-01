import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import Markdown from 'unplugin-vue-markdown/vite';
import MarkdownItAnchor from 'markdown-it-anchor';
import Shiki from '@shikijs/markdown-it';
import path from 'node:path';

export default defineConfig(async () => {
  const shiki = await Shiki({
    themes: { light: 'min-light', dark: 'min-light' },
  });

  return {
    base: '/',
    plugins: [
      vue({ include: [/\.vue$/, /\.md$/] }),
      Markdown({
        include: [/\.md$/],
        headEnabled: false,
        markdownItOptions: {
          html: true,
          linkify: true,
          typographer: true,
        },
        markdownItSetup(md) {
          md.use(MarkdownItAnchor, {
            permalink: MarkdownItAnchor.permalink.linkInsideHeader({
              symbol: '#',
              placement: 'before',
            }),
          });
          md.use(shiki);
        },
        wrapperClasses: 'prose',
        // Escape bare <X> in prose paragraphs so Vue's template compiler
        // doesn't treat them as unclosed custom tags. Fenced code blocks
        // are left untouched (markdown-it already escapes inside them).
        // Heuristic: anything that looks like <Identifier...> in regular
        // markdown body gets escaped. We don't try to preserve "real" HTML
        // tags — discussion text like "<div> 元素" is far more common in
        // these notes than authored inline HTML.
        transforms: {
          before(code) {
            // Vue components that should NOT be escaped
            const vueComponents = new Set([
              'Callout', 'CodeGroup', 'LinkCard', 'Steps',
              'template', 'slot',
            ]);
            const lines = code.split('\n');
            let inFence = false;
            for (let i = 0; i < lines.length; i++) {
              const line = lines[i];
              if (/^\s*```/.test(line) || /^\s*~~~/.test(line)) {
                inFence = !inFence;
                continue;
              }
              if (inFence) continue;
              // Skip indented (4-space) code blocks — leave alone
              if (/^ {4,}/.test(line)) continue;
              // Escape every <Identifier...> occurrence EXCEPT Vue components
              lines[i] = line.replace(
                /<(\/?[A-Za-z_][\w.,\[\]\s|=":'\/@?&!#%^*(){}\\$_+~-]*)>/g,
                (match, inner) => {
                  const tagName = inner.replace(/^\//, '').split(/[\s.]/)[0];
                  if (vueComponents.has(tagName)) return match;
                  return `&lt;${inner}&gt;`;
                },
              );
            }
            return lines.join('\n');
          },
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@content': path.resolve(__dirname, 'content'),
      },
    },
    server: {
      port: 5173,
    },
  };
});
