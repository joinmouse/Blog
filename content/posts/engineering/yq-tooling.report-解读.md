---
title: "tooling.report 解读"
date: 2021-01-01
tags: ["构建工具"]
---

tooling.report : [https://bundlers.tooling.report](https://bundlers.tooling.report/) 是一个开源的项目，用来对主流的构建工具定量分析.

简介
tooling.reports 主要测试的特性有 6 大种类
![image.png](https://cdn.nlark.com/yuque/0/2022/png/158659/1642584756540-99405f5d-beac-45c5-9008-f02d14bec86c.png)
- code splitting :  代码分离，抽出公共的依赖避免重复打包
- Hashing : 给长期缓存(long-term caching) 生成哈希 URL
- Importing Modules : 是否支持不同的模块格式导入(CommonJS && ECMAScript Modules)
- Non-JavaScript resources : 是否支持在 JavaScript 中其他类型文件(CSS、HTML、Images、Service worker等)
- Output module formats : 是否支持不同模块的导出(CommonJS && ECMAScript Modules)
- Transformations : 是否支持对代码和资源模块的转换，如Compress Images/SVG等

1、Code splitting
![image.png](https://cdn.nlark.com/yuque/0/2022/png/158659/1642663281393-2177f41b-9757-4541-a521-88eb9c68d3e5.png)

2、Hash
![image.png](https://cdn.nlark.com/yuque/0/2022/png/158659/1642664279006-f9c06fb9-5e4c-4fb3-a33f-abc398094932.png)

3、Importing Modules
![image.png](https://cdn.nlark.com/yuque/0/2022/png/158659/1642664344476-afd3d426-af27-4c01-bbc7-73a5e163e87c.png)

4、Non-JavaScript Resources
![image.png](https://cdn.nlark.com/yuque/0/2022/png/158659/1642664397892-fa6ec1a0-9997-443f-9b18-62345e034236.png)

5、Output Module Formats
![image.png](https://cdn.nlark.com/yuque/0/2022/png/158659/1642664449623-3beb6cfb-e09c-488e-9d0c-8bb64860c8d3.png)

6、Transformations
![image.png](https://cdn.nlark.com/yuque/0/2022/png/158659/1642664480099-0cb2c147-c97c-4c0f-9b48-4189944dcd07.png)

