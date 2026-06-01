/**
 * 语雀知识库爬取脚本
 * 用法：node scripts/scrape-yuque.mjs
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const POSTS_DIR = path.join(__dirname, '..', 'content', 'posts');
const YUQUE_USER = 'joinmouse';
const YUQUE_REPO = 'blog';
const YUQUE_BASE = `https://www.yuque.com/${YUQUE_USER}/${YUQUE_REPO}`;

async function main() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    locale: 'zh-CN',
  });
  const page = await context.newPage();

  // Step 1: 登录 - 自动检测登录成功
  console.log('请在浏览器中登录语雀...');
  await page.goto('https://www.yuque.com/login');

  // 等待登录成功（URL 变为首页或 dashboard）
  await page.waitForURL(url => {
    const u = url.toString();
    return !u.includes('/login') && (u.includes('yuque.com') || u.includes('dashboard'));
  }, { timeout: 120000 });
  console.log('检测到登录成功！');

  // Step 2: 访问知识库首页，获取目录
  console.log('正在访问知识库首页...');
  await page.goto(YUQUE_BASE, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);

  // 尝试获取知识库目录树
  const tocItems = await page.evaluate(() => {
    const selectors = [
      '.catalog-tree a',
      '.yuque-toc a',
      '[class*="catalog"] a',
      '[class*="toc"] a',
      '[class*="sidebar"] a',
      'nav a',
    ];

    for (const sel of selectors) {
      const links = document.querySelectorAll(sel);
      if (links.length > 0) {
        return Array.from(links).map(a => ({
          title: a.textContent.trim() || '',
          href: a.href || '',
        })).filter(item => item.href && item.title);
      }
    }
    return [];
  });

  console.log(`找到 ${tocItems.length} 个目录项`);

  let articles = [];

  if (tocItems.length > 0) {
    articles = tocItems;
  } else {
    console.log('目录未找到，尝试获取文档链接...');
    articles = await page.evaluate((base) => {
      const links = document.querySelectorAll('a[href]');
      return Array.from(links)
        .map(a => ({
          title: a.textContent.trim() || '',
          href: a.href || '',
        }))
        .filter(item =>
          item.href.includes(`/${base}/`) &&
          item.href !== window.location.href &&
          item.title &&
          !item.href.includes('#') &&
          item.title.length < 100
        );
    }, `${YUQUE_USER}/${YUQUE_REPO}`);
  }

  console.log(`共找到 ${articles.length} 篇文章`);
  console.log(articles.map((a, i) => `${i + 1}. ${a.title}`).join('\n'));

  // Step 3: 逐篇抓取文章内容
  for (let i = 0; i < articles.length; i++) {
    const article = articles[i];
    console.log(`\n[${i + 1}/${articles.length}] 抓取: ${article.title}`);

    try {
      await page.goto(article.href, { waitUntil: 'networkidle', timeout: 20000 });
      await page.waitForTimeout(2000);

      const articleData = await page.evaluate(() => {
        const bodySelectors = [
          '.article-content',
          '.yuque-doc-content',
          '[class*="article-body"]',
          '[class*="doc-content"]',
          '[class*="reader-content"]',
          'article',
          '.content',
          'main',
        ];

        let body = '';
        for (const sel of bodySelectors) {
          const el = document.querySelector(sel);
          if (el && el.innerHTML.length > 100) {
            body = el.innerHTML;
            break;
          }
        }

        const titleEl = document.querySelector('h1') || document.querySelector('[class*="title"]');
        const title = titleEl ? titleEl.textContent.trim() : '';

        const timeEl = document.querySelector('time') || document.querySelector('[class*="date"]') || document.querySelector('[class*="time"]');
        const date = timeEl ? (timeEl.getAttribute('datetime') || timeEl.textContent.trim()) : '';

        return { body, title, date };
      });

      if (!articleData.body || articleData.body.length < 50) {
        console.log(`  ⚠ 内容为空，跳过`);
        continue;
      }

      const markdown = htmlToMarkdown(articleData.body);
      const title = articleData.title || article.title;
      const date = articleData.date || new Date().toISOString().slice(0, 10);

      const slug = article.href.split('/').pop() || `yq-${Date.now()}`;

      const frontmatter = `---
title: "${title.replace(/"/g, '\\"')}"
date: ${date}
slug_yuque: ${slug}
tags: ["语雀"]
source: "${article.href}"
source_kind: yuque
---

`;
      const content = frontmatter + markdown;

      const miscDir = path.join(POSTS_DIR, 'misc');
      if (!fs.existsSync(miscDir)) fs.mkdirSync(miscDir, { recursive: true });

      const safeTitle = title
        .replace(/[/\\:*?"<>|]/g, '')
        .replace(/\s+/g, '-')
        .replace(/，/g, '').replace(/。/g, '').replace(/！/g, '').replace(/？/g, '')
        .replace(/：/g, '').replace(/；/g, '')
        .replace(/-+/g, '-').replace(/^-|-$/g, '');
      const filename = `yq-${slug}-${safeTitle}.md`;
      const filepath = path.join(miscDir, filename);

      fs.writeFileSync(filepath, content, 'utf-8');
      console.log(`  ✓ 已保存: ${filename}`);

    } catch (err) {
      console.log(`  ✗ 抓取失败: ${err.message}`);
    }
  }

  console.log('\n✅ 爬取完成！');
  await browser.close();
}

function htmlToMarkdown(html) {
  let md = html;

  md = md.replace(/<pre[^>]*><code[^>]*class="language-(\w+)"[^>]*>([\s\S]*?)<\/code><\/pre>/g, '```$1\n$2\n```');
  md = md.replace(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/g, '```\n$1\n```');
  md = md.replace(/<code[^>]*>([\s\S]*?)<\/code>/g, '`$1`');

  md = md.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/g, '# $1\n');
  md = md.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/g, '## $1\n');
  md = md.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/g, '### $1\n');
  md = md.replace(/<h4[^>]*>([\s\S]*?)<\/h4>/g, '#### $1\n');
  md = md.replace(/<h5[^>]*>([\s\S]*?)<\/h5>/g, '##### $1\n');
  md = md.replace(/<h6[^>]*>([\s\S]*?)<\/h6>/g, '###### $1\n');

  md = md.replace(/<strong[^>]*>([\s\S]*?)<\/strong>/g, '**$1**');
  md = md.replace(/<em[^>]*>([\s\S]*?)<\/em>/g, '*$1*');

  md = md.replace(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g, '[$2]($1)');
  md = md.replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>/g, '![$2]($1)');
  md = md.replace(/<img[^>]*src="([^"]*)"[^>]*\/?>/g, '![]($1)');

  md = md.replace(/<li[^>]*>([\s\S]*?)<\/li>/g, '- $1\n');
  md = md.replace(/<\/?[uo]l[^>]*>/g, '\n');

  md = md.replace(/<p[^>]*>([\s\S]*?)<\/p>/g, '$1\n\n');
  md = md.replace(/<br\s*\/?>/g, '\n');
  md = md.replace(/<hr\s*\/?>/g, '\n---\n');
  md = md.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/g, '> $1\n');

  md = md.replace(/<[^>]+>/g, '');

  md = md.replace(/&lt;/g, '<');
  md = md.replace(/&gt;/g, '>');
  md = md.replace(/&amp;/g, '&');
  md = md.replace(/&quot;/g, '"');
  md = md.replace(/&#39;/g, "'");
  md = md.replace(/&nbsp;/g, ' ');

  md = md.replace(/\n{3,}/g, '\n\n');

  return md.trim();
}

main().catch(console.error);
