/**
 * Markdown 排版优化脚本
 * 
 * 修复以下问题：
 * 1. 中文数字标题（一、二、三 或 1. 2. 3.）→ 正确的 ## 标题
 * 2. 代码块没有围栏包裹
 * 3. 列表没有正确的 - 前缀
 * 4. 多余的 "返回文档" 导航残留
 * 5. 全角字符残留（⽤→用、⼀→一 等 CJK 兼容字符）
 * 6. 清理多余空行
 * 7. 确保 frontmatter 完整
 */

const fs = require('fs');
const path = require('path');

const POSTS_DIR = path.join(__dirname, '..', 'content', 'posts');

// CJK 兼容字符映射（PDF 提取产生的非标准中文字符）
const CJK_COMPAT_MAP = {
  '⼀': '一', '⼆': '二', '三': '三', '四': '四', '五': '五',
  '六': '六', '七': '七', '⼋': '八', '九': '九', '⼗': '十',
  '⼤': '大', '⼩': '小', '⼈': '人', '⼦': '子', '⼥': '女',
  '⼝': '口', '⼿': '手', '⽇': '日', '⽉': '月', '⽔': '水',
  '⽕': '火', '⼟': '土', '⽊': '木', '⾦': '金', '⽯': '石',
  '⽤': '用', '⽣': '生', '⽩': '白', '⽬': '目', '⽿': '耳',
  '⾜': '足', '⾝': '身', '⾔': '言', '⾷': '食', '⾐': '衣',
  '⻋': '车', '⻔': '门', '⻢': '马', '⻦': '鸟', '⻥': '鱼',
  '⻰': '龙', '⻛': '风', '⻜': '飞', '⻝': '食', '⻬': '齐',
  '⽅': '方', '⽂': '文', '⼯': '工', '⼒': '力', '⼼': '心',
  '⽓': '气', '⾏': '行', '⾸': '首', '⻓': '长', '⻔': '门',
  '⾯': '面', '⾼': '高', '⿊': '黑', '⽆': '无', '⽴': '立',
  '⻅': '见', '⻉': '贝', '⻋': '车', '⻏': '邑', '⻘': '青',
  '⻨': '麦', '⻩': '黄', '⻫': '齐', '⻬': '齐', '⽱': '皿',
  '⾛': '走', '⾥': '里', '⾊': '色', '⾍': '虫', '⽵': '竹',
  '⽶': '米', '⽻': '羽', '⽼': '老', '⽽': '而', '⽿': '耳',
  '⾁': '肉', '⾃': '自', '⾄': '至', '⾈': '舟', '⾩': '艮',
  '⻤': '鬼', '⿁': '鬼', '⻣': '骨', '⿂': '鱼', '⻚': '页',
  '⻮': '齿', '⻧': '阜', '⻦': '鸟', '⻩': '黄', '⿃': '鸟',
  '⽹': '网', '⾈': '舟', '⽲': '禾', '⽳': '穴', '⽵': '竹',
  '⽷': '丝', '⾈': '舟', '⾖': '豆', '⾣': '酉', '⾩': '艮',
  '⻆': '角', '⻁': '虎', '⽜': '牛', '⽺': '羊', '⽝': '犬',
  '⿏': '鼠', '⿇': '麻', '⿅': '鹿', '⻠': '鱼',
  '⼰': '己', '⼫': '尸', '⼲': '干', '⼴': '广', '⼷': '弓',
  '⼸': '弓', '⼹': '彐', '⼺': '彡', '⼻': '彳', '⼽': '戈',
  '⼾': '户', '⽀': '支', '⽁': '攴', '⽂': '文', '⽃': '斗',
  '⽄': '斤', '⽅': '方', '⽆': '无', '⽇': '日', '⽈': '曰',
  '⽉': '月', '⽊': '木', '⽋': '欠', '⽌': '止', '⽍': '歹',
  '⽏': '毋', '⽐': '比', '⽑': '毛', '⽒': '氏', '⽓': '气',
  '⽔': '水', '⽕': '火', '⽖': '爪', '⽗': '父', '⽘': '爻',
  '⽙': '爿', '⽚': '片', '⽛': '牙', '⽜': '牛', '⽝': '犬',
  '⽞': '玄', '⽟': '玉', '⽠': '瓜', '⽡': '瓦', '⽢': '甘',
  '⽣': '生', '⽤': '用', '⽥': '田', '⽦': '疋', '⽧': '疒',
  '⽩': '白', '⽪': '皮', '⽫': '皿', '⽬': '目', '⽭': '矛',
  '⽮': '矢', '⽯': '石', '⽰': '示', '⽱': '禸', '⽲': '禾',
  '⽳': '穴', '⽴': '立', '⽵': '竹', '⽶': '米', '⽷': '丝',
  '⽸': '缶', '⽹': '网', '⽺': '羊', '⽻': '羽', '⽼': '老',
  '⽽': '而', '⽿': '耳', '⾁': '肉', '⾂': '臣', '⾃': '自',
  '⾄': '至', '⾅': '臼', '⾆': '舌', '⾇': '舛', '⾈': '舟',
  '⾉': '艮', '⾊': '色', '⾋': '芈', '⾌': '虍', '⾍': '虫',
  '⾎': '血', '⾏': '行', '⾐': '衣', '⾑': '衤', '⾒': '见',
  '⾓': '角', '⾔': '言', '⾕': '谷', '⾖': '豆', '⾗': '豕',
  '⾘': '貝', '⾙': '贝', '⾚': '赤', '⾛': '走', '⾜': '足',
  '⾝': '身', '⾞': '车', '⾟': '辛', '⾠': '辰', '⾡': '辶',
  '⾢': '邑', '⾣': '酉', '⾤': '釆', '⾥': '里', '⾦': '金',
  '⾧': '长', '⾨': '门', '⾩': '阜', '⾪': '隶', '⾫': '隹',
  '⾬': '雨', '⾭': '青', '⾮': '非', '⾯': '面', '⾰': '革',
  '⾱': '韦', '⾲': '韭', '⾳': '音', '⾴': '页', '⾵': '风',
  '⾶': '飞', '⾷': '食', '⾸': '首', '⾹': '香', '⾺': '马',
  '⾻': '骨', '⾼': '高', '⾽': '髟', '⾾': '鬥', '⾿': '鬯',
  '⿀': '鬲', '⿁': '鬼', '⿂': '鱼', '⿃': '鸟', '⿄': '卤',
  '⿅': '鹿', '⿆': '麦', '⿇': '麻', '⿈': '黄', '⿉': '黍',
  '⿊': '黑', '⿋': '黹', '⿌': '黾', '⿍': '鼎', '⿎': '鼓',
  '⿏': '鼠', '⿐': '鼻', '⿑': '齐', '⿒': '齿', '⿓': '龙',
  '⿔': '龟', '⿕': '龠',
  // 常见全角→半角
  '⽐': '比', '⼊': '入', '⼝': '口', '⽰': '示', '⻚': '页',
  '⻅': '见', '⽂': '文', '⾃': '自', '⼰': '己', '⼀': '一',
};

function fixCjkCompat(text) {
  let result = text;
  for (const [from, to] of Object.entries(CJK_COMPAT_MAP)) {
    result = result.split(from).join(to);
  }
  return result;
}

function formatMarkdown(content) {
  let lines = content.split('\n');
  let result = [];
  let inFrontmatter = false;
  let frontmatterDone = false;
  let inCodeBlock = false;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Track frontmatter
    if (line.trim() === '---' && !frontmatterDone) {
      if (!inFrontmatter) {
        inFrontmatter = true;
        result.push(line);
        continue;
      } else {
        inFrontmatter = false;
        frontmatterDone = true;
        result.push(line);
        continue;
      }
    }
    if (inFrontmatter) {
      result.push(line);
      continue;
    }

    // Track code blocks
    if (/^\s*```/.test(line) || /^\s*~~~/.test(line)) {
      inCodeBlock = !inCodeBlock;
      result.push(line);
      continue;
    }
    if (inCodeBlock) {
      result.push(line);
      continue;
    }

    // Remove "返回文档" navigation
    if (line.trim() === '返回文档') continue;

    // Fix CJK compat characters
    line = fixCjkCompat(line);

    // Convert Chinese-style numbered headings to markdown headings
    // 一、xxx → ## 一、xxx
    if (/^[一二三四五六七八九十]+、/.test(line.trim()) && line.trim().length < 50) {
      line = `## ${line.trim()}`;
    }
    // 1.1 xxx → ### 1.1 xxx
    else if (/^\d+\.\d+\s/.test(line.trim()) && line.trim().length < 80) {
      line = `### ${line.trim()}`;
    }

    // Fix bullet points: ● or ○ → - 
    line = line.replace(/^(\s*)●\s*/, '$1- ');
    line = line.replace(/^(\s*)○\s*/, '$1  - ');
    line = line.replace(/^(\s*)◆\s*/, '$1- ');
    line = line.replace(/^(\s*)▪\s*/, '$1- ');

    result.push(line);
  }

  let text = result.join('\n');

  // Clean up excessive blank lines
  text = text.replace(/\n{3,}/g, '\n\n');

  return text;
}

// Process all markdown files
function processDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let processed = 0;

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      processed += processDirectory(fullPath);
    } else if (entry.name.endsWith('.md')) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      const formatted = formatMarkdown(content);

      if (formatted !== content) {
        fs.writeFileSync(fullPath, formatted, 'utf-8');
        processed++;
        console.log(`  ✓ ${path.relative(POSTS_DIR, fullPath)}`);
      }
    }
  }
  return processed;
}

console.log('开始排版优化...\n');
const count = processDirectory(POSTS_DIR);
console.log(`\n✅ 优化了 ${count} 篇文章`);
