---
title: "webpack性能优化"
date: 2021-01-01
tags: ["性能优化", "Webpack"]
---

利用webpack打包优化，主要的优化是两个方面：打包体积、打包速度

体积优化
webpack自带优化
- tree-sharking:  import将没用的代码自动删除掉
- scope-hoisting:  作用域提升

优化网络解析时长和执行时长
- 添加DNS预解析
- 延时执行影响页面的渲染代码

提取公共代码
将第三方库和应用(web app)分开打包，第三库作为公共代码库

优化webpack产出
- 优化代码重复打包
- 去掉不必要的import
- babel-preset-env 和 autoprefix 配置优化
- webpack runtime文件inline
- 去除不必要的async语句
- 优化第三方依赖
- lodash按需引入

速度优化
多线程打包，利用happypack实现，注意当体积较小的时候打包时间更长

