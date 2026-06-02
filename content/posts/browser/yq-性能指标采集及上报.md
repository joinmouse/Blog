---
title: "性能指标采集及上报"
date: 2021-01-01
tags: ["性能优化"]
---

Proformance性能指标
![image.png](https://cdn.nlark.com/yuque/0/2021/png/158659/1614758855756-c20b1a1b-fb0b-4848-80b3-d94e74a38641.png)
Proformance各项指标参考：https://segmentfault.com/a/1190000014479800

## 一、首屏时间
服务端模板应用采集(包SSR)
页面加载流程如下：

当初始的 HTML 文档被完全加载和解析完成之后，DOMContentLoaded 事件被触发，而无需等待样式表、图像和子框架的完全加载。

补充说明一下load的触发时间：当整个页面及所有依赖资源如样式表和图片都已完成加载时，将触发load事件。它与DOMContentLoaded 不同，后者只要页面DOM加载完成就触发，无需等待依赖资源的加载。

对应我们如果利用Performance来采集，对应的时间采集就是：
首屏时间=DOMContentLoaded时间=domContentLoadedEventEnd−fetchStart

- fetchStart 页面初始进入的时间点

SPA单页面应用的采集
以Vue为例：用户请求一个页面时，页面会先加载 index.html，加载完成后，就会触发 DOMContentLoaded 和 load。而这个时候，页面展示的只是个空白页。此时根本不算真正意义的首屏。接下来，页面会加载相关脚本资源并通过 axios 异步请求数据，使用数据渲染页面主题部分，这个时候首屏才渲染完成。

这样我们使用Performance接口来获取到的时间就并不准确，对应单页应用我们一般使用MutationObserver 这个API来采集，下面是MDN对这个接口的定义：

MutationObserver 接口提供了监视对 DOM 树所做更改的能力。它被设计为旧的 Mutation Events 功能的替代品，该功能是 DOM3 Events 规范的一部分。

## 二、白屏时间
定义：从输入内容回车(包括刷新、跳转)后，到页面开始出现一个字符的时间

单页面完整加载过程
客户端发起请求 -> 下载 HTML 及 JS/CSS 资源 -> 解析 JS 执行 -> JS 请求数据 -> 客户端解析 DOM 并渲染 -> 下载渲染图片-> 完成渲整体染

这个过程中客户端渲染之前的时间，都算白屏时间。白屏时间 = 页面开始展示时间点 - 开始请求时间点，使用Performance采集时间如下：
白屏时间FP=domLoading−navigationStart

如果是App内，就需要加上webview的一个初始化时间

## 三、卡顿

## 四、网络环境

