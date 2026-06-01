/**
 * 从 PDF 提取的语雀文本 → Markdown 文件
 * 按文章标题分割，生成干净的 frontmatter + 内容
 */

const fs = require('fs');
const path = require('path');

const POSTS_DIR = path.join(__dirname, '..', 'content', 'posts');

// 读取清理后的文本
const raw = fs.readFileSync('/tmp/yuque-clean.txt', 'utf-8');

// 从第 1 页提取目录
const page1Match = raw.match(/===PAGE 1===([\s\S]*?)===PAGE 2===/);
const page2Match = raw.match(/===PAGE 2===([\s\S]*?)===PAGE 3===/);
const tocText = (page1Match ? page1Match[1] : '') + '\n' + (page2Match ? page2Match[1] : '');

// 提取目录中的文章标题列表
const tocLines = tocText.split('\n')
  .map(l => l.trim())
  .filter(l => l && !l.match(/^[\d]+$/) && l !== '博客专栏' && !l.includes('记录') && l.length > 2);

console.log(`目录中发现 ${tocLines.length} 个条目:`);
tocLines.forEach((t, i) => console.log(`  ${i + 1}. ${t}`));

// 分类映射
function getCategory(title) {
  if (/Uniswap|ERC\d|合约|比特币|⽐特币|以太坊|ethereum|区块链|DeFi|Solidity/i.test(title)) return 'blockchain';
  if (/TypeScript|typescript/i.test(title)) return 'typescript';
  if (/Vue|vue|响应式/i.test(title)) return 'vue';
  if (/React|Fiber|requestIdleCallback|requestAnimationFrame|不可变数据/i.test(title)) return 'engineering';
  if (/浏览器|Chrome|渲染|RAIL|关键渲染/i.test(title)) return 'browser';
  if (/JavaScript|JS|js|异步编程|事件循环|消息队列|运[⾏行]机制|原型|作[⽤用]域|闭包|执[⾏行]上下[⽂文]|async|await|Promise|回调|微任务|readyState/i.test(title)) return 'javascript';
  if (/CSS|css|样式|布局|Flex|居中|盒模型/i.test(title)) return 'css';
  if (/Go |Go-|golang|git|Monorepo|模块化|MVC|Flux|webpack|Ruby|Ocsp|状态管理|zustand/i.test(title)) return 'engineering';
  if (/Node|node|Express/i.test(title)) return 'node';
  if (/jQuery|jquery/i.test(title)) return 'jquery';
  return 'misc';
}

function sanitizeFilename(title) {
  return title
    .replace(/[/\\:*?"<>|]/g, '')
    .replace(/\s+/g, '-')
    .replace(/，|。|！|？|：|；|"|"|'|'|《|》|（|）|【|】|\[|\]|⾃|⼰|⼀|⽤|⼯|⻋|⽕|⻔|⻩|⽜|⻆|⾊|⽅|⽐|⻓|⾼|⾦|⽣|⼈|⼤|⼩|⾯/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}

// 将所有 ===PAGE N=== 标记去掉，合并成连续文本
let fullText = raw.replace(/\n===PAGE \d+===\n/g, '\n');
// 去掉每页开头的页码数字行
fullText = fullText.replace(/\n\d{1,3}\n/g, '\n');

// 按目录标题分割文章
// 先跳过目录页（前两页），从第 3 页的内容开始
const page3Start = raw.indexOf('===PAGE 3===');
if (page3Start === -1) {
  console.error('找不到 PAGE 3');
  process.exit(1);
}

let contentText = raw.slice(page3Start);
contentText = contentText.replace(/\n===PAGE \d+===\n/g, '\n');
contentText = contentText.replace(/\n\d{1,3}\n/g, '\n');

// 尝试按标题分割
// 语雀 PDF 中每篇文章的标题通常独占一行，可以用目录标题来匹配
const articles = [];

for (let i = 0; i < tocLines.length; i++) {
  const title = tocLines[i];
  // 用于匹配的标题（去掉特殊字符，处理全角/半角）
  const escapedTitle = title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  
  const idx = contentText.indexOf(title);
  if (idx === -1) {
    // 尝试模糊匹配（去掉空格）
    const titleNoSpace = title.replace(/\s+/g, '');
    const contentNoSpace = contentText.replace(/\s+/g, '');
    const fuzzyIdx = contentNoSpace.indexOf(titleNoSpace);
    if (fuzzyIdx === -1) {
      console.log(`  ⚠ 找不到文章起始位置: ${title}`);
      continue;
    }
  }
  
  articles.push({ title, startIdx: idx === -1 ? -1 : idx });
}

// 排序并提取内容
articles.sort((a, b) => a.startIdx - b.startIdx);

let saved = 0;
let skipped = 0;

for (let i = 0; i < articles.length; i++) {
  const { title, startIdx } = articles[i];
  if (startIdx === -1) { skipped++; continue; }
  
  const endIdx = i + 1 < articles.length && articles[i + 1].startIdx !== -1
    ? articles[i + 1].startIdx
    : contentText.length;
  
  let body = contentText.slice(startIdx + title.length, endIdx).trim();
  
  if (body.length < 50) {
    console.log(`  ⚠ 内容太短，跳过: ${title} (${body.length} chars)`);
    skipped++;
    continue;
  }
  
  // 清理正文
  body = body
    .replace(/^\n+/, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  
  const cat = getCategory(title);
  const safeTitle = sanitizeFilename(title);
  const slug = `yq-${safeTitle.toLowerCase().slice(0, 30)}`;
  const filename = `yq-${safeTitle}.md`;
  
  const frontmatter = `---
title: "${title.replace(/"/g, '\\"')}"
date: 2026-06-01
tags: ["语雀"]
source_kind: yuque
---

`;
  
  const catDir = path.join(POSTS_DIR, cat);
  if (!fs.existsSync(catDir)) fs.mkdirSync(catDir, { recursive: true });
  
  const filepath = path.join(catDir, filename);
  
  // 跳过已存在的旧文件
  if (fs.existsSync(filepath)) {
    console.log(`  已存在，覆盖: ${cat}/${filename}`);
  }
  
  fs.writeFileSync(filepath, frontmatter + body, 'utf-8');
  console.log(`  ✓ ${cat}/${filename} (${body.length} chars)`);
  saved++;
}

console.log(`\n✅ 完成: 保存 ${saved} 篇, 跳过 ${skipped} 篇`);
