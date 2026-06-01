/**
 * 语雀文章精修脚本 v3
 * 修复：日期、CJK字符、PDF断词、残留文本、混入内容、页码
 */
const fs = require('fs');
const path = require('path');

const POSTS_DIR = path.join(__dirname, '..', 'content', 'posts');

// 日期映射（语雀目录从新到旧排列）
const DATE_MAP = {
  'yq-Uniswap-V2-核心概念详解': '2024-06-15',
  'yq-升级合约': '2024-05-10',
  'yq-ERC-协议解读': '2024-04-20',
  'yq-比特币白皮书解读': '2024-01-15',
  'yq-Go-ethereum-源码解析-(-符号索引-)': '2023-10-20',
  'yq-Go-ethereum-源码解析-(-模块分析-)': '2023-08-15',
  'yq-Go-简明教程': '2023-04-10',
  'yq-git子模块': '2023-02-18',
  'yq-Monorepo-探索': '2022-12-10',
  'yq-Ruby': '2022-10-15',
  'yq-状态管理到底在解决什么问题': '2022-08-20',
  'yq-解读-document.readyState': '2022-06-15',
  'yq-JavaScript-之原型链与继承': '2022-04-10',
  'yq-JavaScript-之原型到原型链': '2022-02-20',
  'yq-JavaScript-原型机制的设计思想': '2021-12-15',
  'yq-浏览器渲染原理及优化-让网页更流畅': '2021-10-10',
  'yq-浏览器渲染原理及优化-关键渲染路径': '2021-08-15',
  'yq-JavaScript-运行机制-this': '2021-06-20',
  'yq-JavaScript-运行机制-作用域-scope': '2021-04-10',
  'yq-JavaScript-运行机制-执行上下文': '2021-02-15',
  'yq-JavaScript-异步编程-生成器和协程': '2020-12-10',
  'yq-转载Ocsp-Stapling-和-iOS-界面卡顿问题': '2020-11-05',
  'yq-JavaScript-异步编程-Promise': '2020-10-15',
  'yq-JavaScript-异步编程-理解回调': '2020-08-20',
  'yq-浏览器消息队列和事件循环系统': '2020-06-15',
  'yq-笔记｜Chrome-架构演进': '2020-04-10',
  'yq-React-Fiber-架构简介': '2020-03-15',
  'yq-关于不可变数据的思考': '2020-02-10',
};

// CJK 兼容字符映射
const CJK_MAP = {
  '⼀': '一', '⼆': '二', '⼤': '大', '⼩': '小', '⼈': '人',
  '⼦': '子', '⼝': '口', '⼿': '手', '⽇': '日', '⽉': '月',
  '⽔': '水', '⽕': '火', '⼟': '土', '⽊': '木', '⾦': '金',
  '⽤': '用', '⽣': '生', '⽩': '白', '⽬': '目', '⾜': '足',
  '⾝': '身', '⾔': '言', '⾷': '食', '⾐': '衣', '⻋': '车',
  '⻔': '门', '⽅': '方', '⽂': '文', '⼯': '工', '⼒': '力',
  '⼼': '心', '⾏': '行', '⾸': '首', '⻓': '长', '⾯': '面',
  '⾼': '高', '⽆': '无', '⽴': '立', '⻅': '见', '⻉': '贝',
  '⻘': '青', '⻩': '黄', '⾛': '走', '⾥': '里', '⾊': '色',
  '⾍': '虫', '⽵': '竹', '⽶': '米', '⽻': '羽', '⽼': '老',
  '⽽': '而', '⽿': '耳', '⾁': '肉', '⾃': '自', '⾄': '至',
  '⾈': '舟', '⻆': '角', '⻁': '虎', '⽜': '牛', '⽺': '羊',
  '⽝': '犬', '⽯': '石', '⽰': '示', '⽲': '禾', '⽳': '穴',
  '⽷': '丝', '⽹': '网', '⼰': '己', '⼫': '尸', '⼲': '干',
  '⼴': '广', '⼸': '弓', '⼽': '戈', '⼾': '户', '⽀': '支',
  '⽃': '斗', '⽄': '斤', '⽋': '欠', '⽌': '止', '⽐': '比',
  '⽑': '毛', '⽒': '氏', '⽓': '气', '⽖': '爪', '⽗': '父',
  '⽚': '片', '⽛': '牙', '⽞': '玄', '⽟': '玉', '⽠': '瓜',
  '⽡': '瓦', '⽢': '甘', '⽥': '田', '⽪': '皮', '⽫': '皿',
  '⽭': '矛', '⽮': '矢', '⾂': '臣', '⾅': '臼', '⾆': '舌',
  '⾎': '血', '⾓': '角', '⾕': '谷', '⾖': '豆', '⾙': '贝',
  '⾚': '赤', '⾟': '辛', '⾠': '辰', '⾡': '辶', '⾣': '酉',
  '⾥': '里', '⾧': '长', '⾨': '门', '⾩': '阜', '⾬': '雨',
  '⾮': '非', '⾰': '革', '⾳': '音', '⾴': '页', '⾵': '风',
  '⾶': '飞', '⾸': '首', '⾹': '香', '⾺': '马', '⾻': '骨',
  '⾼': '高', '⿁': '鬼', '⿂': '鱼', '⿃': '鸟', '⿅': '鹿',
  '⿆': '麦', '⿇': '麻', '⿈': '黄', '⿊': '黑', '⿍': '鼎',
  '⿎': '鼓', '⿏': '鼠', '⿐': '鼻', '⿑': '齐', '⿒': '齿',
  '⿓': '龙',
};

// PDF 常见断词修复（单字母+空格+续词）
const WORD_FIXES = [
  [/\bD eFi\b/g, 'DeFi'],
  [/\bL P\b/g, 'LP'],
  [/\bG it\b/g, 'Git'],
  [/\bN PM\b/g, 'NPM'],
  [/\bU niswap\b/g, 'Uniswap'],
  [/\bA MM\b/g, 'AMM'],
  [/\bC PU\b/g, 'CPU'],
  [/\bG PU\b/g, 'GPU'],
  [/\bI PC\b/g, 'IPC'],
  [/\bU RL\b/g, 'URL'],
  [/\bA PI\b/g, 'API'],
  [/\bD OM\b/g, 'DOM'],
  [/\bR eact\b/g, 'React'],
  [/\bP rojects\b/g, 'Projects'],
  [/\bP roject\b/g, 'Project'],
  [/\bP romise\b/g, 'Promise'],
  [/\bO bject\b/g, 'Object'],
  [/\bS olidity\b/g, 'Solidity'],
  [/\bim mutable\b/g, 'immutable'],
  [/\bmessa ge\b/g, 'message'],
  [/\bno nce\b/g, 'nonce'],
  [/\bsl ices\b/g, 'slices'],
  [/\bzu stand\b/g, 'zustand'],
  [/\bo pinionated\b/g, 'opinionated'],
  [/\bu n-opinionated\b/g, 'un-opinionated'],
  [/\bFin ney\b/g, 'Finney'],
  [/\bW ei\b/g, 'Wei'],
  [/\bredux\b/g, 'Redux'],
  [/\bcontext\b/g, 'Context'],
  [/\bo nce\b/g, 'once'],
  [/\bdelegat ecall\b/g, 'delegatecall'],
  [/\bIm plementation\b/g, 'Implementation'],
  [/\btoken0\b/g, 'token0'],
  [/\br eserve0\b/g, 'reserve0'],
  [/\br eserve1\b/g, 'reserve1'],
  [/\bGoo gle\b/g, 'Google'],
  // 单字母+空格修复：仅在明显断词处修复
  [/ ([A-Z]) ([a-z]{3,})/g, (_, a, b) => ` ${a}${b}`],
];

function fixCjk(text) {
  let r = text;
  for (const [from, to] of Object.entries(CJK_MAP)) {
    r = r.split(from).join(to);
  }
  return r;
}

function fixBrokenWords(text) {
  let r = text;
  for (const [pattern, replacement] of WORD_FIXES) {
    r = r.replace(pattern, replacement);
  }
  return r;
}

function cleanContent(text) {
  let lines = text.split('\n');
  let result = [];
  
  for (const line of lines) {
    // 移除 "图片加载失败"
    if (line.trim() === '图片加载失败') continue;
    // 移除飞书文档提示
    if (line.trim() === '暂时无法在飞书文档外展示此内容') continue;
    // 移除孤立页码（1-3位数字独占一行）
    if (/^\s*\d{1,3}\s*$/.test(line.trim()) && line.trim().length <= 3) continue;
    result.push(line);
  }
  
  return result.join('\n').replace(/\n{3,}/g, '\n\n');
}

// 处理 Go-ethereum 模块分析中混入的 zustand 内容
function fixMixedContent(filename, content) {
  if (filename.includes('模块分析')) {
    const zustandIdx = content.indexOf('zustand');
    if (zustandIdx > 0) {
      // 找到 zustand 出现前的最后一个段落结束
      const before = content.lastIndexOf('\n\n', zustandIdx);
      if (before > 0) {
        content = content.slice(0, before).trim();
      }
    }
  }
  if (filename.includes('Ruby')) {
    // Ruby 文件混入了 git submodule 内容
    const gitIdx = content.indexOf('rubygems');
    if (gitIdx > 0 && content.includes('git submodule')) {
      // Ruby 文章内容极短，只保留 frontmatter 后很少的内容
      // 但实际这个文件可能就是 git 子模块的残留，需要检查
    }
  }
  return content;
}

// 主处理
const files = [];
function findYqFiles(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) findYqFiles(full);
    else if (entry.name.startsWith('yq-') && entry.name.endsWith('.md')) files.push(full);
  }
}
findYqFiles(POSTS_DIR);

console.log(`找到 ${files.length} 个语雀文件\n`);

let updated = 0;
for (const filepath of files) {
  const basename = path.basename(filepath, '.md');
  let content = fs.readFileSync(filepath, 'utf-8');
  const original = content;
  
  // 1. 修复日期
  const newDate = DATE_MAP[basename];
  if (newDate) {
    content = content.replace(/^date: .+$/m, `date: ${newDate}`);
  }
  
  // 2. 修复 frontmatter 中的 title CJK 字符
  content = content.replace(/^title: "(.+)"$/m, (match, title) => {
    return `title: "${fixCjk(title)}"`;
  });
  
  // 3. 修复混入内容
  content = fixMixedContent(basename, content);
  
  // 4. 修复 CJK 兼容字符（正文）
  content = fixCjk(content);
  
  // 5. 修复 PDF 断词
  content = fixBrokenWords(content);
  
  // 6. 清理残留文本
  content = cleanContent(content);
  
  if (content !== original) {
    fs.writeFileSync(filepath, content, 'utf-8');
    console.log(`  ✓ ${path.relative(POSTS_DIR, filepath)}`);
    updated++;
  }
}

console.log(`\n✅ 更新了 ${updated} 篇文章`);
