#!/usr/bin/env node
/**
 * Pull all issues from joinmouse/Blog and write each one as a markdown file
 * into content/posts/, with YAML frontmatter.
 *
 * Usage:
 *   node scripts/fetch-issues.mjs
 *   GITHUB_TOKEN=ghp_xxx node scripts/fetch-issues.mjs   (recommended, avoids rate limit)
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'content', 'posts');

const REPO = 'joinmouse/Blog';
const TOKEN = process.env.GITHUB_TOKEN || '';

const headers = {
  'Accept': 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  'User-Agent': 'blog-redesign-fetcher',
};
if (TOKEN) headers.Authorization = `Bearer ${TOKEN}`;

async function gh(url) {
  const res = await fetch(url, { headers });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GitHub API ${res.status}: ${body.slice(0, 300)}`);
  }
  return res.json();
}

function slugify(s) {
  // strip non-alphanum-CJK, collapse spaces to dashes, lowercase ascii
  return s
    .toLowerCase()
    .replace(/[\s\/\\:|]+/g, '-')
    .replace(/[^a-z0-9\-\u4e00-\u9fa5]+/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60) || 'untitled';
}

function pad4(n) {
  return String(n).padStart(4, '0');
}

function rewriteIssueLinks(body, slugByNumber) {
  if (!body) return '';
  // [#2](https://github.com/joinmouse/Blog/issues/2)  -> [#2](/posts/{slug})
  return body.replace(
    /\(https:\/\/github\.com\/joinmouse\/Blog\/issues\/(\d+)\)/g,
    (_, num) => {
      const slug = slugByNumber.get(Number(num));
      return slug ? `(/posts/${slug})` : `(https://github.com/joinmouse/Blog/issues/${num})`;
    },
  );
}

function escapeYaml(str) {
  // wrap in double quotes, escape \ and "
  return `"${String(str).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });

  console.log(`Fetching issues from ${REPO}…`);
  if (!TOKEN) {
    console.warn('⚠  No GITHUB_TOKEN set — using anonymous (60 req/h limit). Set GITHUB_TOKEN to be safe.');
  }

  // Pull all issues (state=all, paginate)
  const all = [];
  let page = 1;
  while (true) {
    const url = `https://api.github.com/repos/${REPO}/issues?state=all&per_page=100&page=${page}`;
    const batch = await gh(url);
    if (!Array.isArray(batch) || batch.length === 0) break;
    // Filter out PRs (issues API returns PRs too)
    all.push(...batch.filter((it) => !it.pull_request));
    if (batch.length < 100) break;
    page++;
  }

  console.log(`Got ${all.length} issues.`);

  // Build slug map first so we can rewrite cross-issue links
  const slugByNumber = new Map();
  for (const it of all) {
    slugByNumber.set(it.number, `${pad4(it.number)}-${slugify(it.title)}`);
  }

  let written = 0;
  for (const it of all) {
    const slug = slugByNumber.get(it.number);
    const date = (it.created_at || '').slice(0, 10);
    const tags = (it.labels || []).map((l) => (typeof l === 'string' ? l : l.name)).filter(Boolean);
    const body = rewriteIssueLinks(it.body || '', slugByNumber);

    const frontmatter = [
      '---',
      `title: ${escapeYaml(it.title)}`,
      `date: ${date}`,
      `issue_number: ${it.number}`,
      `tags: [${tags.map((t) => escapeYaml(t)).join(', ')}]`,
      `state: ${it.state}`,
      `source: ${escapeYaml(it.html_url)}`,
      '---',
      '',
    ].join('\n');

    const filePath = path.join(OUT_DIR, `${slug}.md`);
    await fs.writeFile(filePath, frontmatter + body + '\n', 'utf8');
    written++;
  }

  console.log(`✓ Wrote ${written} markdown files to content/posts/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
