---
title: "脚手架lerna"
date: 2021-01-01
tags: ["工程化"]
---

- 熟悉Yargs脚手架开发框架
- 熟悉多package管理工具Lerna的使用和基本原理
- Node.js模块路径解析流程

Yargs
- 脚手架构成
 bind： package.json中配置bin，npm link本地安装
command：命令
 options: 参数(boolean/string)
 文件顶部增加 #!/user/bin/env node

- 脚手架初始化流程
 构造函数 Yargs
 常用方法
1、Yargs.options
2、Yargs.group
 脚手架参数解析方法
 命令注册

Lerna
- lerna是基于git+npm的多package项目管理工具
- 实现原理
通过import-local优先调用本地lerna命令
通过yargs生成脚手架，先注册全局属性，再注册命令，最后通过parse方法解析参数
lerna命令注册时需要传入builder和handler两个方法，builder方法用于注册

Node路径依赖分析
