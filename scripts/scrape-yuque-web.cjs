/**
 * 语雀 web-wiki 知识库爬取脚本 v3 — 断点续传模式
 *
 * 用法:
 *   node scrape-yuque-web.cjs          # 默认每次最多抓 8 篇新文章
 *   node scrape-yuque-web.cjs 20       # 每次最多抓 20 篇
 *
 * 脚本自动跳过已存在的 yq-*.md 文件，多次运行即可全部抓完。
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const POSTS_DIR = path.join(__dirname, '..', 'content', 'posts');
const YUQUE_BASE = 'https://www.yuque.com/joinmouse/web';
const MAX_FETCH = parseInt(process.argv[2], 10) || 8;

function sanitizeFilename(title) {
  return title
    .replace(/[/\\:*?"<>|]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[，。！？：；""''《》（）【】\[\]]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}

function getCategory(title) {
  if (/react|fiber|redux|hooks|jsx|next/i.test(title)) return 'engineering';
  if (/vue|vuex|pinia|响应式/i.test(title)) return 'vue';
  if (/typescript|ts类型|泛型/i.test(title)) return 'typescript';
  if (/css|样式|布局|flex|grid|居中|盒模型|sass|scss|less|bfc/i.test(title)) return 'css';
  if (/node|express|koa|npm|yarn/i.test(title)) return 'node';
  if (/webpack|vite|babel|rollup|esbuild|monorepo|工程化|构建/i.test(title)) return 'engineering';
  if (/浏览器|chrome|渲染|dom|bom|事件循环|event.?loop|性能|缓存|http|https|tcp|网络|安全|xss|csrf|html/i.test(title)) return 'browser';
  if (/区块链|blockchain|solidity|合约|defi|web3|erc/i.test(title)) return 'blockchain';
  if (/java(?!script)/i.test(title)) return 'java';
  if (/go(?:lang)?[\s-]|rust|ruby|python/i.test(title)) return 'engineering';
  if (/jquery/i.test(title)) return 'jquery';
  if (/ajax|fetch|axios|跨域|jsonp/i.test(title)) return 'ajax';
  return 'javascript';
}

const vueComponents = new Set(['Callout', 'CodeGroup', 'LinkCard', 'Steps', 'template', 'slot']);

function escapeAngleBrackets(body) {
  const lines = body.split('\n');
  let inFence = false;
  for (let j = 0; j < lines.length; j++) {
    if (/^\s*```/.test(lines[j])) { inFence = !inFence; continue; }
    if (inFence) continue;
    lines[j] = lines[j].replace(/<(\/?[A-Za-z_][^>]*)>/g, (match, inner) => {
      const tagName = inner.replace(/^\//, '').split(/[\s.]/)[0];
      if (vueComponents.has(tagName)) return match;
      return '&lt;' + inner + '&gt;';
    });
  }
  return lines.join('\n');
}

async function extractArticleContent(page) {
  return page.evaluate(() => {
    const h1 = document.querySelector('h1');
    const title = h1 ? h1.textContent.trim() : '';
    const timeEl = document.querySelector('time') || document.querySelector('[class*="date"]');
    const date = timeEl ? (timeEl.getAttribute('datetime') || timeEl.textContent.trim()) : '';

    const article = document.querySelector('article') ||
      document.querySelector('[class*="doc-content"]') ||
      document.querySelector('[class*="reader"]') ||
      document.querySelector('main');
    if (!article) return { title, date, body: '' };

    function nodeToMd(node) {
      if (node.nodeType === 3) return node.textContent || '';
      if (node.nodeType !== 1) return '';
      const el = node;
      const tag = el.tagName.toLowerCase();
      const kids = () => Array.from(el.childNodes).map(c => nodeToMd(c)).join('');
      switch (tag) {
        case 'h1': return '\n# ' + kids().trim() + '\n\n';
        case 'h2': return '\n## ' + kids().trim() + '\n\n';
        case 'h3': return '\n### ' + kids().trim() + '\n\n';
        case 'h4': return '\n#### ' + kids().trim() + '\n\n';
        case 'p': return kids().trim() + '\n\n';
        case 'br': return '\n';
        case 'hr': return '\n---\n\n';
        case 'strong': case 'b': return '**' + kids().trim() + '**';
        case 'em': case 'i': return '*' + kids().trim() + '*';
        case 'del': case 's': return '~~' + kids().trim() + '~~';
        case 'code': {
          if (el.parentElement && el.parentElement.tagName.toLowerCase() === 'pre') return kids();
          return '`' + kids().trim() + '`';
        }
        case 'pre': {
          const codeEl = el.querySelector('code');
          const lang = codeEl ? (Array.from(codeEl.classList).find(c => c.startsWith('language-'))?.replace('language-', '') || '') : '';
          const code = codeEl ? codeEl.textContent : el.textContent;
          return '\n```' + lang + '\n' + code.trim() + '\n```\n\n';
        }
        case 'a': {
          const href = el.getAttribute('href') || '';
          const text = kids().trim();
          if (!text || text === href) return href;
          return '[' + text + '](' + href + ')';
        }
        case 'img': {
          const src = el.getAttribute('src') || '';
          const alt = el.getAttribute('alt') || '';
          return '![' + alt + '](' + src + ')';
        }
        case 'blockquote': return '> ' + kids().trim().replace(/\n/g, '\n> ') + '\n\n';
        case 'ul': case 'ol': return '\n' + kids();
        case 'li': {
          const isOl = el.parentElement && el.parentElement.tagName.toLowerCase() === 'ol';
          return (isOl ? '1. ' : '- ') + kids().trim() + '\n';
        }
        case 'table': {
          const rows = el.querySelectorAll('tr');
          if (!rows.length) return kids();
          let md = '\n';
          rows.forEach((row, idx) => {
            const cells = row.querySelectorAll('td, th');
            md += '| ' + Array.from(cells).map(c => c.textContent.trim()).join(' | ') + ' |\n';
            if (idx === 0) md += '| ' + Array.from(cells).map(() => '---').join(' | ') + ' |\n';
          });
          return md + '\n';
        }
        case 'script': case 'style': case 'nav': case 'button': case 'svg': return '';
        default: return kids();
      }
    }

    return {
      title,
      date,
      body: nodeToMd(article).replace(/\n{3,}/g, '\n\n').replace(/\u200b/g, '').replace(/\u00a0/g, ' ').trim()
    };
  });
}

/** 检查文件是否已存在（按 yq- + sanitized title 匹配） */
function fileExists(cat, filename) {
  return fs.existsSync(path.join(POSTS_DIR, cat, filename));
}

/** 快速扫描已有的 yq-*.md 文件，返回所有已存在的 filename set */
function getExistingFiles() {
  const existing = new Set();
  for (const dir of fs.readdirSync(POSTS_DIR)) {
    const full = path.join(POSTS_DIR, dir);
    if (!fs.statSync(full).isDirectory()) continue;
    for (const f of fs.readdirSync(full)) {
      if (f.startsWith('yq-') && f.endsWith('.md')) existing.add(f);
    }
  }
  return existing;
}

async function main() {
  console.log(`[v3 断点续传] 每次最多抓 ${MAX_FETCH} 篇新文章`);
  const existingFiles = getExistingFiles();
  console.log(`已有 ${existingFiles.size} 个 yuque 文件`);

  const userDataDir = path.join(__dirname, '..', '.playwright-data');
  const context = await chromium.launchPersistentContext(userDataDir, {
    headless: false,
    viewport: { width: 1280, height: 900 },
    locale: 'zh-CN',
  });
  const page = await context.newPage();

  // 检查登录
  await page.goto(YUQUE_BASE, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);

  const isLoggedIn = await page.evaluate(() => {
    return document.querySelectorAll('a[href*="/joinmouse/web/"]').length > 0;
  });

  if (!isLoggedIn) {
    console.log('未登录，请在浏览器中登录语雀（5分钟内完成）...');
    await page.goto('https://www.yuque.com/login');
    try {
      await page.waitForURL(url => !url.toString().includes('/login'), { timeout: 300000 });
    } catch (e) {
      console.log('URL 检测超时，尝试继续...');
    }
    console.log('检测到登录成功！');
  } else {
    console.log('已登录 ✓');
  }

  // Step 1: 收集所有文章链接
  console.log('正在收集文章列表...');
  await page.goto(YUQUE_BASE, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);

  const topLinks = await page.evaluate(() => {
    const seen = new Set();
    const results = [];
    for (const a of document.querySelectorAll('a[href]')) {
      const href = a.href;
      const title = a.textContent.trim();
      if (!href || !title || title.length < 2 || title.length > 120) continue;
      if (!href.includes('/joinmouse/web/')) continue;
      if (href === window.location.href) continue;
      if (href.includes('#')) continue;
      if (seen.has(href)) continue;
      seen.add(href);
      results.push({ title, href });
    }
    return results;
  });

  console.log(`首页找到 ${topLinks.length} 个顶级条目`);

  const allArticles = [];
  for (const topLink of topLinks) {
    console.log(`  📁 ${topLink.title}`);
    await page.goto(topLink.href, { waitUntil: 'networkidle', timeout: 20000 });
    await page.waitForTimeout(1500);

    const subLinks = await page.evaluate((parentHref) => {
      const seen = new Set();
      const results = [];
      for (const a of document.querySelectorAll('a[href]')) {
        const href = a.href;
        const title = a.textContent.trim();
        if (!href || !title || title.length < 2 || title.length > 120) continue;
        if (!href.includes('/joinmouse/web/')) continue;
        if (href === parentHref || href === window.location.href) continue;
        if (href.includes('#')) continue;
        if (seen.has(href)) continue;
        seen.add(href);
        results.push({ title, href });
      }
      return results;
    }, topLink.href);

    if (subLinks.length > 0) {
      console.log(`    └ ${subLinks.length} 个子文档`);
      allArticles.push(...subLinks);
    }
    allArticles.push(topLink);
  }

  // 去重
  const seen = new Set();
  const uniqueArticles = allArticles.filter(a => {
    if (seen.has(a.href)) return false;
    seen.add(a.href);
    return true;
  });

  // 过滤掉已存在的文件
  const newArticles = uniqueArticles.filter(a => {
    const rawTitle = a.title.replace(/\d{4}-\d{2}-\d{2}\s*\d{2}:\d{2}.*$/, '').trim();
    const safeTitle = sanitizeFilename(rawTitle);
    const filename = `yq-${safeTitle}.md`;
    return !existingFiles.has(filename);
  });

  console.log(`\n共 ${uniqueArticles.length} 篇，已存在 ${uniqueArticles.length - newArticles.length} 篇，待抓 ${newArticles.length} 篇`);
  console.log(`本轮最多抓 ${MAX_FETCH} 篇\n`);

  if (newArticles.length === 0) {
    console.log('✅ 所有文章已抓取完毕！');
    await context.close();
    return;
  }

  // Step 2: 抓取文章（限量）
  let saved = 0, skipped = 0;
  const toFetch = newArticles.slice(0, MAX_FETCH);

  for (let i = 0; i < toFetch.length; i++) {
    const article = toFetch[i];
    const rawTitle = article.title.replace(/\d{4}-\d{2}-\d{2}\s*\d{2}:\d{2}.*$/, '').trim();
    console.log(`[${i + 1}/${toFetch.length}] ${rawTitle}`);

    try {
      await page.goto(article.href, { waitUntil: 'networkidle', timeout: 20000 });
      await page.waitForTimeout(1500);

      const data = await extractArticleContent(page);

      if (!data.body || data.body.length < 50) {
        console.log(`  ⚠ 内容太短(${data.body.length}), 跳过`);
        skipped++;
        continue;
      }

      const title = (data.title || rawTitle).replace(/\d{4}-\d{2}-\d{2}\s*\d{2}:\d{2}.*$/, '').trim();
      const dateMatch = article.title.match(/(\d{4}-\d{2}-\d{2})/);
      const date = dateMatch ? dateMatch[1] : (data.date || '2021-01-01');
      const cat = getCategory(title);
      const safeTitle = sanitizeFilename(title);
      const filename = `yq-${safeTitle}.md`;
      const catDir = path.join(POSTS_DIR, cat);

      if (!fs.existsSync(catDir)) fs.mkdirSync(catDir, { recursive: true });

      const filepath = path.join(catDir, filename);
      if (fs.existsSync(filepath)) {
        console.log(`  已存在，跳过`);
        skipped++;
        continue;
      }

      const body = escapeAngleBrackets(data.body);
      const frontmatter = `---\ntitle: "${title.replace(/"/g, '\\"')}"\ndate: ${date}\ntags: []\nsource_kind: yuque\n---\n\n`;

      fs.writeFileSync(filepath, frontmatter + body, 'utf-8');
      console.log(`  ✓ ${cat}/${filename} (${body.length} chars)`);
      saved++;
    } catch (err) {
      console.log(`  ✗ ${err.message}`);
      skipped++;
    }
  }

  console.log(`\n✅ 本轮完成！保存 ${saved} 篇，跳过 ${skipped} 篇`);

  const stillRemaining = newArticles.length - MAX_FETCH;
  if (stillRemaining > 0) {
    console.log(`还剩 ${stillRemaining} 篇待抓，再运行一次即可继续`);
  } else {
    console.log('所有文章已抓取完毕！');
  }

  await context.close();
}

main().catch(console.error);
