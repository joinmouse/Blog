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
        // Escape bare <T> / <number> etc. in prose paragraphs so Vue's template
        // compiler doesn't treat them as unclosed custom tags. Fenced code
        // blocks are left untouched (markdown-it already escapes inside them).
        transforms: {
          before(code) {
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
              // Escape <Identifier...> patterns that look like generic types,
              // not real HTML tags. Heuristic: capitalised or all-lowercase
              // identifier, possibly with [], ., or commas inside.
              lines[i] = line.replace(
                /<([A-Za-z_][\w.,\[\]\s|]*)>/g,
                (match, inner) => {
                  // Preserve real HTML/Vue tags & known inline tags
                  const knownTags = new Set([
                    'a','b','i','u','s','em','strong','code','pre','br','hr',
                    'p','div','span','img','ul','ol','li','table','thead','tbody',
                    'tr','td','th','blockquote','h1','h2','h3','h4','h5','h6',
                    'sub','sup','mark','small','kbd','del','ins','figure','figcaption',
                    'video','audio','source','iframe','details','summary','script','style',
                  ]);
                  const tagName = inner.split(/[\s>/]/)[0].toLowerCase();
                  if (knownTags.has(tagName)) return match;
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
