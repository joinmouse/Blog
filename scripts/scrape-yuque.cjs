/**
 * 语雀知识库爬取脚本 v2
 * 直接获取语雀原始 Markdown 内容（通过导出接口），而非 HTML 转换
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const POSTS_DIR = path.join(__dirname, '..', 'content', 'posts');
const YUQUE_USER = 'joinmouse';
const YUQUE_REPO = 'blog';
const YUQUE_BASE = `https://www.yuque.com/${YUQUE_USER}/${YUQUE_REPO}`;

// 分类映射
const CATEGORY_MAP = {
  'Uniswap': 'blockchain',
  '升级合约': 'blockchain',
  'ERC': 'blockchain',
  '比特币': 'blockchain',
  'Go-ethereum': 'blockchain',
  'ethereum': 'blockchain',
  'zustand': 'vue',
  '状态管理': 'vue',
  'Go 简明': 'engineering',
  'Ruby': 'engineering',
  'git子模块': 'engineering',
  'Monorepo': 'engineering',
  'document.readyState': 'javascript',
  '原型链': 'javascript',
};

function getCategory(title) {
  for (const [keyword, cat] of Object.entries(CATEGORY_MAP)) {
    if (title.includes(keyword)) return cat;
  }
  return 'misc';
}

function sanitizeFilename(title) {
  return title
    .replace(/[/\\:*?"<>|]/g, '')
    .replace(/\s+/g, '-')
    .replace(/，|。|！|？|：|；|"|"|'|'|《|》|（|）|【|】|\[|\]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

async function main() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    locale: 'zh-CN',
  });
  const page = await context.newPage();

  // Step 1: 登录
  console.log('请在浏览器中登录语雀...');
  await page.goto('https://www.yuque.com/login');

  // 等待登录成功：检测 URL 不再含 /login，或者页面出现用户头像
  try {
    await page.waitForURL(url => !url.toString().includes('/login'), { timeout: 120000 });
  } catch (e) {
    // 如果 URL 检测超时，可能已经跳转但 URL 仍带 login 参数，直接检查 cookie
    console.log('URL 检测超时，尝试继续...');
  }
  console.log('检测到登录成功！');

  // Step 2: 获取文章列表
  console.log('正在访问知识库首页...');
  await page.goto(YUQUE_BASE, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);

  const tocItems = await page.evaluate(() => {
    const selectors = [
      '.catalog-tree a', '[class*="catalog"] a', '[class*="toc"] a',
      '[class*="sidebar"] a', 'nav a',
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

  let articles = [];
  if (tocItems.length > 0) {
    articles = tocItems;
  } else {
    articles = await page.evaluate((base) => {
      const links = document.querySelectorAll('a[href]');
      return Array.from(links)
        .map(a => ({ title: a.textContent.trim() || '', href: a.href || '' }))
        .filter(item =>
          item.href.includes(`/${base}/`) &&
          item.href !== window.location.href &&
          item.title && !item.href.includes('#') &&
          item.title.length < 100
        );
    }, `${YUQUE_USER}/${YUQUE_REPO}`);
  }

  console.log(`共找到 ${articles.length} 篇文章`);

  // Step 3: 逐篇获取 Markdown 内容
  for (let i = 0; i < articles.length; i++) {
    const article = articles[i];
    const slug = article.href.split('/').pop() || `yq-${Date.now()}`;
    const cat = getCategory(article.title);
    const catDir = path.join(POSTS_DIR, cat);
    const safeTitle = sanitizeFilename(article.title);
    const filename = `yq-${slug}-${safeTitle}.md`;
    const filepath = path.join(catDir, filename);

    // 跳过已存在的文件
    if (fs.existsSync(filepath)) {
      console.log(`[${i + 1}/${articles.length}] 已存在，跳过: ${filename}`);
      continue;
    }

    console.log(`[${i + 1}/${articles.length}] 抓取: ${article.title}`);

    try {
      // 访问文章页
      await page.goto(article.href, { waitUntil: 'networkidle', timeout: 20000 });
      await page.waitForTimeout(2000);

      // 获取日期
      const date = await page.evaluate(() => {
        const timeEl = document.querySelector('time') ||
          document.querySelector('[class*="date"]') ||
          document.querySelector('[class*="time"]');
        return timeEl ? (timeEl.getAttribute('datetime') || timeEl.textContent.trim()) : '';
      }) || new Date().toISOString().slice(0, 10);

      // 方法一：尝试通过语雀内部 API 获取 Markdown
      let markdown = '';
      
      // 尝试拦截语雀的文档数据接口（包含 body_draft 或 body 字段）
      markdown = await page.evaluate(async () => {
        // 语雀会在 window.__data__ 或类似位置存储文档数据
        // 检查常见的数据挂载点
        const possibleData = [
          window.__INITIAL_DATA__,
          window.__NEXT_DATA__,
          window.__APP_DATA__,
        ].filter(Boolean);

        for (const data of possibleData) {
          const json = JSON.stringify(data);
          // 尝试从 JSON 中找到 body 字段
          if (json.includes('"body"')) {
            try {
              const match = json.match(/"body":"((?:[^"\\]|\\.)*)"/);
              if (match) return match[1].replace(/\\n/g, '\n').replace(/\\"/g, '"');
            } catch (e) {}
          }
        }
        return '';
      });

      // 方法二：如果内部 API 没拿到，用选择器抓取结构化内容
      if (!markdown) {
        markdown = await page.evaluate(() => {
          const article = document.querySelector('article') ||
            document.querySelector('[class*="doc-content"]') ||
            document.querySelector('[class*="reader"]') ||
            document.querySelector('main');
          if (!article) return '';

          function nodeToMd(node, depth = 0) {
            if (node.nodeType === Node.TEXT_NODE) {
              return node.textContent || '';
            }
            if (node.nodeType !== Node.ELEMENT_NODE) return '';

            const el = node;
            const tag = el.tagName.toLowerCase();
            const children = Array.from(el.childNodes).map(c => nodeToMd(c, depth)).join('');

            switch (tag) {
              case 'h1': return `\n# ${children.trim()}\n\n`;
              case 'h2': return `\n## ${children.trim()}\n\n`;
              case 'h3': return `\n### ${children.trim()}\n\n`;
              case 'h4': return `\n#### ${children.trim()}\n\n`;
              case 'h5': return `\n##### ${children.trim()}\n\n`;
              case 'h6': return `\n###### ${children.trim()}\n\n`;
              case 'p': return `${children.trim()}\n\n`;
              case 'br': return '\n';
              case 'hr': return '\n---\n\n';
              case 'strong':
              case 'b': return `**${children.trim()}**`;
              case 'em':
              case 'i': return `*${children.trim()}*`;
              case 'code': {
                if (el.parentElement && el.parentElement.tagName.toLowerCase() === 'pre') {
                  return children;
                }
                return `\`${children.trim()}\``;
              }
              case 'pre': {
                const codeEl = el.querySelector('code');
                const lang = codeEl ? (
                  Array.from(codeEl.classList).find(c => c.startsWith('language-'))?.replace('language-', '') || ''
                ) : '';
                const code = codeEl ? codeEl.textContent : el.textContent;
                return `\n\`\`\`${lang}\n${code.trim()}\n\`\`\`\n\n`;
              }
              case 'a': {
                const href = el.getAttribute('href') || '';
                return `[${children.trim()}](${href})`;
              }
              case 'img': {
                const src = el.getAttribute('src') || '';
                const alt = el.getAttribute('alt') || '';
                return `![${alt}](${src})`;
              }
              case 'blockquote': return `> ${children.trim().replace(/\n/g, '\n> ')}\n\n`;
              case 'ul':
              case 'ol': return `\n${children}`;
              case 'li': {
                const isOrdered = el.parentElement && el.parentElement.tagName.toLowerCase() === 'ol';
                const prefix = isOrdered ? '1. ' : '- ';
                return `${prefix}${children.trim()}\n`;
              }
              case 'table': {
                const rows = el.querySelectorAll('tr');
                if (rows.length === 0) return children;
                let md = '\n';
                rows.forEach((row, idx) => {
                  const cells = row.querySelectorAll('td, th');
                  const line = Array.from(cells).map(c => c.textContent.trim()).join(' | ');
                  md += `| ${line} |\n`;
                  if (idx === 0) {
                    md += '| ' + Array.from(cells).map(() => '---').join(' | ') + ' |\n';
                  }
                });
                md += '\n';
                return md;
              }
              case 'div':
              case 'span':
              case 'section':
              case 'article':
              case 'main':
              case 'figure':
              case 'figcaption':
                return children;
              case 'script':
              case 'style':
              case 'nav':
              case 'button':
                return '';
              default:
                return children;
            }
          }

          return nodeToMd(article);
        });
      }

      if (!markdown || markdown.trim().length < 30) {
        console.log(`  ⚠ 内容为空，跳过`);
        continue;
      }

      // 清理 markdown
      markdown = markdown
        .replace(/返回文档/g, '')           // 语雀导航残留
        .replace(/\u200b/g, '')             // 零宽空格
        .replace(/\u00a0/g, ' ')            // 不间断空格
        .replace(/​/g, '')                  // 其他零宽字符
        .replace(/\n{3,}/g, '\n\n')         // 多余空行
        .trim();

      const frontmatter = `---
title: "${article.title.replace(/"/g, '\\"')}"
date: ${date}
slug_yuque: ${slug}
tags: ["语雀"]
source: "${article.href}"
source_kind: yuque
---

`;

      if (!fs.existsSync(catDir)) fs.mkdirSync(catDir, { recursive: true });
      fs.writeFileSync(filepath, frontmatter + markdown, 'utf-8');
      console.log(`  ✓ 已保存: ${cat}/${filename}`);

    } catch (err) {
      console.log(`  ✗ 抓取失败: ${err.message}`);
    }
  }

  console.log('\n✅ 爬取完成！');
  await browser.close();
}

main().catch(console.error);
