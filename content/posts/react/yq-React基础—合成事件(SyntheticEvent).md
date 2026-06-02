---
title: "React基础—合成事件(SyntheticEvent)"
date: 2021-01-01
tags: ["React"]
---

思考： 合成事件是什么？

- 1、event是syntheticEvent , 模拟出来 DOM 事件的所有能力
- 2、event.nativeEvent 是原生事件能力
- 3、所有事件都被挂载到document上
- 4、和DOM 事件不一样，和Vue事件也不一样

![image.png](https://cdn.nlark.com/yuque/0/2021/png/158659/1613799144967-7b367dea-b2ba-428d-a69c-386b4151b7ad.png)

思考：为什么要有合成事件？

- 更好的兼容性和跨平台
- 挂载document，减少内存消耗，避免频繁解绑
- 方便事件的统一管理(如事务机制)
