---
title: "linux(ubuntu16.04)下SCSS的安装"
date: 2017-09-10
slug_jianshu: 28e5b278a4ba
tags: ["简书"]
state: open
source: "https://www.jianshu.com/p/28e5b278a4ba"
source_kind: jianshu
---
一般我们在开发的项目中会用到CSSDE预处理，如LESS/SCSS/Stylus等，这里我记录下SCSS的安装，为后面踩到坑的同学提供一点思路。

由于最近在开发vue的项目，因此是在vue-cli这个脚手架下的安装包下npm的。

首先为了让node-sass顺利安装(折腾了小编一个多小时)，需要现在命令行执行一下：  
`export SASS_BINARY_SITE="https://npm.taobao.org/mirrors/node-sass"`

然后安装就好了  
`npm install sass-loader node-sass --save-dev`

最后给大家一个参考链接吧，关于vue框架下SCSS的使用，[http://vuejs-templates.github.io/webpack/pre-processors.html](https://link.jianshu.com?t=http://vuejs-templates.github.io/webpack/pre-processors.html)
