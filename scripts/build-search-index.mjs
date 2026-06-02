// Build-time script: generates public/search-index.json from content/posts/**/*.md
import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { join, basename } from 'node:path';

const POSTS_DIR = 'content/posts';
const OUTPUT = 'public/search-index.json';

function extractFrontmatter(content) {
  if (!content.startsWith('---')) return { fm: {}, body: content };
  const end = content.indexOf('---', 3);
  if (end === -1) return { fm: {}, body: content };
  const fmRaw = content.slice(3, end).trim();
  const body = content.slice(end + 3).trim();
  const fm = {};
  for (const line of fmRaw.split('\n')) {
    const m = line.match(/^(\w+):\s*(.*)/);
    if (m) fm[m[1]] = m[2].trim().replace(/^['"]|['"]$/g, '');
  }
  // Parse tags array
  if (fm.tags) {
    const inner = fm.tags.replace(/^\[|\]$/g, '');
    fm.tags = inner.split(',').map(t => t.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean);
  } else {
    fm.tags = [];
  }
  return { fm, body };
}

function stripMarkdown(body) {
  return body
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, '')
    // Remove inline code
    .replace(/`[^`]+`/g, '')
    // Remove images
    .replace(/!\[.*?\]\(.*?\)/g, '')
    // Remove links but keep text
    .replace(/\[([^\]]*)\]\(.*?\)/g, '$1')
    // Remove headings markers
    .replace(/^#{1,6}\s+/gm, '')
    // Remove bold/italic
    .replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, '$1')
    // Remove HTML tags
    .replace(/<[^>]+>/g, '')
    // Collapse whitespace
    .replace(/\s+/g, ' ')
    .trim();
}

function slugFromFilename(filename) {
  if (/^\d+-/.test(filename)) {
    return filename.match(/^\d+/)[0];
  }
  if (/^j-/.test(filename)) {
    return filename.match(/^j-[A-Za-z0-9]+/)[0];
  }
  return filename;
}

function categoryFromPath(filepath) {
  const parts = filepath.replace(/\.md$/, '').split('/');
  const postsIdx = parts.indexOf('posts');
  return parts.length > postsIdx + 2 ? parts[postsIdx + 1] : undefined;
}

// Walk directory recursively
function walkDir(dir) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) results.push(...walkDir(full));
    else if (entry.endsWith('.md')) results.push(full);
  }
  return results;
}

const files = walkDir(POSTS_DIR);
const documents = [];

for (const filepath of files) {
  const content = readFileSync(filepath, 'utf8');
  const { fm, body } = extractFrontmatter(content);
  const filename = basename(filepath, '.md');
  const slug = slugFromFilename(filename);
  const category = categoryFromPath(filepath);

  const plainBody = stripMarkdown(body);
  // Truncate body for index size (first 2000 chars is enough for search)
  const truncated = plainBody.slice(0, 2000);

  documents.push({
    id: slug,
    slug,
    title: fm.title || slug,
    date: (fm.date || '').slice(0, 10),
    tags: Array.isArray(fm.tags) ? fm.tags.join(' ') : '',
    category: category || '',
    body: truncated,
  });
}

mkdirSync('public', { recursive: true });
writeFileSync(OUTPUT, JSON.stringify(documents));
console.log(`Search index: ${documents.length} documents → ${OUTPUT} (${(Buffer.byteLength(JSON.stringify(documents)) / 1024).toFixed(1)} KB)`);
