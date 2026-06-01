---
title: "Node文档笔记-path模块"
date: 2017-09-21
slug_jianshu: 29a462d94f58
tags: ["简书"]
state: open
source: "https://www.jianshu.com/p/29a462d94f58"
source_kind: jianshu
---
path模块提供一些工具函数，用于处理文件与目录的路径，使用方式:

`const path = require('path')`

* * *

### 1、基本API使用

-   （1）`path.basename(path[,ext])`  
    返回一个path的最后一部分，直接看demo

```
ath.basename('/foo/bar/baz/asdf/quux.html');
// 返回: 'quux.html'

path.basename('/foo/bar/baz/asdf/quux.html', '.html');
// 返回: 'quux'
```

-   （2）`path.dirname(path)`  
    返回一个path的目录名，看demo

```
path.dirname('/foo/bar/baz/asdf/quux');
// 返回: '/foo/bar/baz/asdf'
```

-   （3）`path.extname(path)`  
    返回path的拓展名， 若path 的最后一部分没有 . 或 path 的文件名（见 `path.basename()`）的第一个字符是 .，则返回一个空字符串。看demo

```
path.extname('index.html');
// 返回: '.html'

path.extname('index.coffee.md');
// 返回: '.md'

path.extname('index.');
// 返回: '.'

path.extname('index');
// 返回空字符串: ''

path.extname('.index');
// 返回空字符串: ''

```

-   （4）`path.parse(path)`  
    返回一个对象，对象的属性表示path的元素，Linux下的demo

```
path.parse('/home/user/dir/file.txt');
// 返回:
// { root: '/',
//   dir: '/home/user/dir',
//   base: 'file.txt',
//   ext: '.txt',
//   name: 'file' }
```

### 2、组合path路径API

-   （1）、`path.join([...paths])`  
    path.join() 方法使用平台特定的分隔符把全部给定的 path 片段连接到一起，并规范化生成的路径。看demo

```
path.join('/foo', 'bar', 'baz/asdf', 'quux', '..');
// 返回: '/foo/bar/baz/asdf'

path.join('foo', {}, 'bar');
// 抛出 'TypeError: Path must be a string. Received {}'

path.join(__dirname,'public')
//__dirname表示当前文件的路径
```

-   （2）、`path.resolve([...paths])`  
    path.resolve() 方法会把一个路径或路径片段的序列解析为一个绝对路径。给定的路径的序列是从右往左被处理的，后面每个 path 被依次解析，直到构造完成一个绝对路径(一般在实际开发中使用较多)

```
path.resolve('/foo/bar', './baz');
// 返回: '/foo/bar/baz'

path.resolve('/foo/bar', '/tmp/file/');
// 返回: '/tmp/file'  
```
