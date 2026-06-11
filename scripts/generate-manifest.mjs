import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const POSTS_DIR = join(ROOT, 'content', 'posts');
const OUTPUT = join(ROOT, 'src', 'lib', 'posts-manifest.json');

/**
 * Recursively find all .md files in a directory.
 */
function walk(dir) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      results.push(...walk(fullPath));
    } else if (extname(entry) === '.md') {
      results.push(fullPath);
    }
  }
  return results;
}

/**
 * Parse YAML frontmatter (subset: flat keys, string values, and string arrays).
 * Does not use any dependencies. Handles the structure used in this blog's posts.
 */
function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};

  const yaml = match[1];
  const result = {};

  const lines = yaml.split('\n');
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    // Skip empty lines and comments
    if (!line.trim() || line.trim().startsWith('#')) {
      i++;
      continue;
    }

    const kvMatch = line.match(/^([\w_]+)\s*:\s*(.*)/);
    if (kvMatch) {
      const key = kvMatch[1];
      const rawValue = kvMatch[2].trim();

      // Inline JSON array: tags: ["item1", "item2"] or tags: [item1, item2]
      if (rawValue.startsWith('[') && rawValue.endsWith(']')) {
        try {
          result[key] = JSON.parse(rawValue);
        } catch {
          result[key] = rawValue;
        }
        i++;
        continue;
      }

      // Empty value may indicate an array on following indented lines
      if (rawValue === '') {
        if (i + 1 < lines.length && lines[i + 1].match(/^\s+-\s+/)) {
          const arr = [];
          i++;
          while (i < lines.length && lines[i].match(/^\s+-\s+(.*)/)) {
            let item = lines[i].match(/^\s+-\s+(.*)/)[1].trim();
            item = item.replace(/^["'](.*)["']$/, '$1');
            arr.push(item);
            i++;
          }
          result[key] = arr;
          continue;
        }
        result[key] = '';
      } else {
        // Remove surrounding quotes, handle numbers
        let value = rawValue.replace(/^["'](.*)["']$/, '$1');
        // Convert numeric-looking values to numbers
        if (/^\d+(\.\d+)?$/.test(value)) {
          value = Number(value);
        }
        result[key] = value;
      }
    }
    i++;
  }
  return result;
}

/**
 * Extract slug from filename, following the same rules as src/lib/posts.ts.
 */
function extractSlug(filename, fm) {
  if (/^\d+-/.test(filename)) return filename.match(/^\d+/)[0];
  if (/^j-/.test(filename)) return filename.match(/^j-[A-Za-z0-9]+/i)[0];
  if (/^yq-/.test(filename)) return filename.match(/^yq-.+/)[0];
  if (fm.slug_jianshu) return `j-${fm.slug_jianshu}`;
  return filename;
}

// --- Main ---

const files = walk(POSTS_DIR);
const manifest = files.map((filepath) => {
  const content = readFileSync(filepath, 'utf-8');
  const fm = parseFrontmatter(content);

  // Relative filepath from project root (e.g. "content/posts/javascript/0001-xxx.md")
  const relPath = filepath.slice(ROOT.length + 1);

  // Category from subdirectory
  const parts = relPath.split('/');
  const postsIdx = parts.indexOf('posts');
  const category = parts.length > postsIdx + 2 ? parts[postsIdx + 1] : undefined;

  // Slug
  const filename = parts[parts.length - 1].replace(/\.md$/, '');
  const slug = extractSlug(filename, fm);

  // Date normalization (YAML dates are strings in our parser, e.g. "2019-08-21")
  let date = '';
  if (fm.date) {
    date = String(fm.date).slice(0, 10);
  }

  return {
    slug,
    title: fm.title || slug,
    date,
    tags: Array.isArray(fm.tags) ? fm.tags : [],
    source: fm.source || undefined,
    category,
    filepath: relPath,
  };
});

// Sort by date desc, then slug desc as tiebreaker
manifest.sort((a, b) => b.date.localeCompare(a.date) || b.slug.localeCompare(a.slug));

writeFileSync(OUTPUT, JSON.stringify(manifest, null, 2));
console.log(`Generated posts-manifest.json with ${manifest.length} posts`);
