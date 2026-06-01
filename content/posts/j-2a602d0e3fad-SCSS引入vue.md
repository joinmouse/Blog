---
title: "SCSS引入vue"
date: 2017-10-12
slug_jianshu: 2a602d0e3fad
tags: ["简书"]
state: open
source: "https://www.jianshu.com/p/2a602d0e3fad"
source_kind: jianshu
---
之前一般写的CSS样式都是CSS，现在想加上CSS预处理，这里就直接参考[http://vuejs-templates.github.io/webpack/pre-processors.html](https://link.jianshu.com?t=http://vuejs-templates.github.io/webpack/pre-processors.html)的示例.

# 1、

但为了让node-sass顺利安装，先在命令行下运行：  
`export SASS_BINARY_SITE="https://npm.taobao.org/mirrors/node-sass"`

# 2、安装

npm install --save sass-loader node-sass

# 3、拓展

尝试Stylus / LESS（目前我用的很少，和个人习惯有关），相信见的 bug 越多，你改 bug 就改得越快。
