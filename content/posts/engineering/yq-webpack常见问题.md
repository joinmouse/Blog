---
title: "webpack常见问题"
date: 2021-01-01
tags: ["Webpack"]
---

![image.png](https://cdn.nlark.com/yuque/0/2021/png/158659/1620541304016-1ab60fe4-fafd-4e63-aae7-b8127719f414.png)
1、module chunk bundle的区别
- module 各源码文件，webpack中一切皆模块
- chunk 多模块合并成的，webpack分析entry、splitChunk
- bundle 最终的输出文件

2、文件指纹策略：hash、chunkhash、contenthash的区别
- hash：和整个项目的构建有关，只要项目文件有修改，整个项目构建的hash值就会更改
- chunkhash：和webpack打包的chunk有关，不同的entry会生成不同的chunkhash值(一般JS文件指纹)
- contenthash：依据文件内容定义的hash，文件内容不变，则contenthash不变(一般CSS文件指纹)

