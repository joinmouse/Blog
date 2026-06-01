---
title: "webpack基础知识"
date: 2017-06-26
slug_jianshu: ed7f615bc346
tags: ["简书"]
state: open
source: "https://www.jianshu.com/p/ed7f615bc346"
source_kind: jianshu
---
#### 1： 如何全局安装一个 node 应用?

npm install -g xxx  
npm===>node package manager

#### 题目2： package.json 有什么作用？

> 配合npm使用，用来定义模块包，主要包括以下几点:

-   定义模块包的依赖管理\[devDependencies/dependencies\]、
-   定义包的基本描述信息\[description、name、version等\]
-   定义包的使用方式\[npm scripts\]
-   定义包的主程序入口模块标示\[main\]
-   定义包的可执行文件地址\[bin\]
-   定义包的bug、people、issue、license等其他信息

#### 题目3： npm install --save app 与 npm install --save-dev app有什么区别?

> 相同点：都会在项目的node\_modules目录下安装app

-   \--save 将产品运行时（或生产环境）需要的依赖模块添加到 package.json 的 dependencies 中，在发布后还需要继续使用，否则就运行不了。
-   \--save-dev 将产品的开发环境需要的依赖模块添加到 package.json 的 devDependencies 中，只在开发时才用到，发布后用不到它。

#### 题目4： node\_modules的查找路径是怎样的?

> 当require('xxx'),这个模块的xxx不是nodejs的内建模块(比如http、path、fs等)，并且模块标识不以路径开始('../ , ./')。  
> 则nodejs会不断的上一级目录递归查找node\_modules目录，若一直未找到模块的xxx，则会抛错。

#### 题目5： npm3与 npm2相比有什么改进？yarn和 npm 相比有什么优势? (选做题目)

> npm3的对npm2优化点在于对于以字母序安装npm包的时候，优先安装在node\_modules第一层级目录。这样做的好处是如果后续包有相关依赖则不需要重复安装。

#### 题目6： webpack是什么？和其他同类型工具比有什么优势？

> webpack是一种模块加载器兼打包工具，可以将各种资源；例如JS（含JSX）、coffee、样式（含less/sass）、图片等都作为模块来使用和处理。

webpack

优势：

-   webpack以 commonJS 的形式来书写脚本滴，但对 AMD/CMD 的支持也很全面，很方便旧项目进行代码迁移。
-   能被模块化的不仅仅是 JS 了，还有CSS、图片静态资源等等
-   开发便捷，能替代部分 grunt/gulp 的工作，比如打包、压缩混淆、图片转base64等。

#### 题目7：npm script是什么？如何使用？

> npm script 是package.json的一个属性，可以在scripts里面定义一些脚本命令，一般使用npm run xxx执行。如：

```
"script" : {
  "new": "mkdir test"           //新建一个test文件夹
}
```

执行命令：`npm run new`

#### 题目8： 使用 webpack 替换 入门-任务15中模块化使用的 requriejs

[webpack-demo](https://link.jianshu.com?t=https://joinmouse.github.io/webpack-demo/index.html)  
[代码](https://link.jianshu.com?t=https://github.com/joinmouse/webpack-demo)

#### 题目9：gulp是什么？使用 gulp 实现图片压缩、CSS 压缩合并、JS 压缩合并\]

> gulp是一种基于流的前端构建工具，可以实现流程化的对代码进行检测，压缩，修改，打包等，而不必在每个步骤分别去处理文件，大大地减少了处理时间。

使用：  
1、安装gulp

```
npm install -g gulp
npm install --save-dev gulp
```

2、项目根目录下新建一个gulpfile.js文件

```
var gulp = require('gulp');
var cssnano = require('gulp-cssnano');
var uglify = require('gulp-uglify');
var imgmin = require('gulp-imagemin');
var concat  = require('gulp-concat');
//当我们需要使用一个功能时，需要先在bash安装这个模块，
//然后在使用前require它，最后在gulp.task中定义这个功能。

//图片压缩
gulp.task('imagemin',function(){
  return gulp.src('图片地址')
  .pipe(imagemin())
  .pipe(gulp.dest('输出目录')
})

//css压缩合并
gulp.task('cssnano',function(){
  return gulp.src([css1地址,css2地址...])
  .pipe(cssnano())       //压缩
  .pipie(concat(新文件名))  //合并
  .pipe(gulp.dest(输出目录))
})

//js压缩合并
gulp.task('uglify',function(){
  return gulp.src([js1地址,js2地址,....])
  .pipe(uglify())      //压缩
  .pipie(concat(新文件名))   //合并
  .pipe(gulp.dest(输出目录))
})
```
