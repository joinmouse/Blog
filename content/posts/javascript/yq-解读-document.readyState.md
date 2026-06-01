---
title: "解读 | document.readyState"
date: 2022-06-15
tags: ["语雀"]
source_kind: yuque
---

关于页面的加载状态我们经常听到 load、DOMContentLoaded 等各种事件，总是很难记住他们的具体含义。最近了解了 `document.readyState` 这个 API，觉得写的很好，就分享在下面。

MDN 上关于这个 API 的介绍是：`Document.readyState` 属性描述了 document 的加载状态。

总共有三种状态，分别是：loading、interactive、complete。

## 1、loading 状态

loading 状态表示 document "正在加载"状态。

## 2、interactive 状态

表示"可交互"状态，此时正在加载的状态已经结束了，但是图像、样式、框架之类的资源还在加载中。

## 3、complete 状态

文档和所有子资源已完成加载。表示 load 状态的事件即将被触发。

## 4、模拟 DOMContentLoaded 事件的 readystatechange

当上面的属性状态发生变化的时候，就会触发 document 对象上面的 readystatechange 事件，我们可以用 readystatechange 来模拟 DOMContentLoaded：

```javascript
// 模拟 DOMContentLoaded / jquery ready
document.onreadystatechange = function () {
  if (document.readyState === "interactive") {
    initApplication();
  }
}
```

## 5、模拟 load 事件的 readystatechange

```javascript
// 模拟 load 事件
document.onreadystatechange = function () {
  if (document.readyState === "complete") {
    initApplication();
  }
}
```

## 附：Performance 的 timing 属性各项解释

下表中所有时间戳都代表 UNIX 毫秒时间戳。

| 名称 | 作用 |
| --- | --- |
| connectEnd | 浏览器与服务器之间的连接建立时的时间戳，连接建立指的是所有握手和认证过程全部结束 |
| connectStart | HTTP 请求开始向服务器发送时的时间戳，如果是持久连接，则等同于 fetchStart |
| domComplete | 当前网页 DOM 结构生成时，也就是 `Document.readyState` 属性变为 "complete"，并且相应的 readystatechange 事件触发时的时间戳 |
| domContentLoadedEventEnd | 当前网页 DOMContentLoaded 事件发生时，也就是 DOM 结构解析完毕、所有脚本运行完成时的时间戳 |
| domContentLoadedEventStart | 当前网页 DOMContentLoaded 事件发生时，也就是 DOM 结构解析完毕、所有脚本开始运行时的时间戳 |
| domInteractive | 当前网页 DOM 结构结束解析、开始加载内嵌资源时，也就是 `Document.readyState` 属性变为 "interactive"、并且相应的 readystatechange 事件触发时的时间戳 |
| domLoading | 当前网页 DOM 结构开始解析时，也就是 `Document.readyState` 属性变为 "loading"、并且相应的 readystatechange 事件触发时的时间戳 |
| domainLookupEnd | 域名查询结束时的时间戳。如果使用持久连接，或者从本地缓存获取信息的，等同于 fetchStart |
| domainLookupStart | 域名查询开始时的时间戳。如果使用持久连接，或者从本地缓存获取信息的，等同于 fetchStart |
| fetchStart | 浏览器准备通过 HTTP 请求去获取页面的时间戳。在检查应用缓存之前发生 |
| loadEventEnd | 当前网页 load 事件的回调函数结束时的时间戳。如果该事件还没有发生，返回 0 |
| loadEventStart | 当前网页 load 事件的回调函数开始时的时间戳。如果该事件还没有发生，返回 0 |
| navigationStart | 当前浏览器窗口的前一个网页关闭，发生 unload 事件时的时间戳。如果没有前一个网页，就等于 fetchStart |
| redirectEnd | 最后一次重定向完成，也就是 HTTP 响应的最后一个字节返回时的时间戳。如果没有重定向，或者上次重定向不是同源的，则为 0 |
| redirectStart | 第一次重定向开始时的时间戳，如果没有重定向，或者上次重定向不是同源的，则为 0 |
| requestStart | 浏览器向服务器发出 HTTP 请求时（或开始读取本地缓存时）的时间戳 |
| responseEnd | 浏览器从服务器收到（或从本地缓存读取）最后一个字节时（如果在此之前 HTTP 连接已经关闭，则返回关闭时）的时间戳 |
| responseStart | 浏览器从服务器收到（或从本地缓存读取）第一个字节时的时间戳 |
| secureConnectionStart | 浏览器与服务器开始安全链接的握手时的时间戳。如果当前网页不要求安全连接，则返回 0 |
| unloadEventEnd | 如果前一个网页与当前网页属于同一个域下，则表示前一个网页的 unload 回调结束时的时间戳。如果没有前一个网页，或者之前的网页跳转不是属于同一个域内，则返回值为 0 |
| unloadEventStart | 如果前一个网页与当前网页属于同一个域下，则表示前一个网页的 unload 事件发生时的时间戳。如果没有前一个网页，或者之前的网页跳转不是属于同一个域内，则返回值为 0 |

参考：https://segmentfault.com/a/1190000014479800
