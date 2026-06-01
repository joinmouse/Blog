---
title: "解读 | document.readyState"
date: 2022-06-15
tags: ["语雀"]
source_kind: yuque
---

关于页面的加载状态我们经常听到load、DomContentLoaded等各种事件，总是很难记住他们的具体含
义。最近了解了documen.readyState这个API，觉得写的很好，就分享在下面，MDN上关于这个API的
介绍是
总共有三种状态，分别是：loading、interactive、complete
loading状态表示，表示document"正在加载"状态，
表示"可交互"状态，此时正在加载的状态已经结束了，但是图像、样式、框架之类的资源还在加载中
文档和所有子资源已完成加载。表示load状态的事件即将被触发
当上面的属性状态发生变化的时候，就会触发document对象上面的readystatechange事件，我们可以
用readystatechange来模拟DomContentLoaded 
Document.readyState
 
属性描述了document的加载状态
1、loading状态
2、interactive状态
3、complete状态
4、模拟DOMContentLoaded事件的readystatechange
// 模拟 DOMContentLoaded/ jquery ready
document .onreadystatechange  = function  () {
  if (document .readyState  === "interactive" ) {
    initApplication ();
  }
}1
JavaScript

110附：Performance的timing属性各项的解释5、模拟load事件的readystatechange
// 模拟 load 事件
document .onreadystatechange  = function  () {
  if (document .readyState  === "complete" ) {
    initApplication ();
  }
}1
JavaScript
名称 作用（这里所有时间戳都代表UNIX毫秒时间戳）
connectEnd 浏览器与服务器之间的连接建立时的时间戳，连
接建立指的是所有握手和认证过程全部结束
connectStart HTTP请求开始向服务器发送时的时间戳，如果
是持久连接，则等同于fetchStart。
domComplete 当前网页DOM结构生成时，也就是
Document.readyState属性变为“complete”,并
且相应的readystatechange事件触发时的时间
戳。
domContentLoadedEventEnd 当前网页DOMContentLoaded事件发生时，也
就是DOM结构解析完毕、所有脚本运行完成时的
时间戳。
domContentLoadedEventStart 当前网页DOMContentLoaded事件发生时，也
就是DOM结构解析完毕、所有脚本开始运行时的
时间戳。
domInteractive 当前网页DOM结构结束解析、开始加载内嵌资源
时，也就是Document.readyState属性变
为“interactive”、并且相应的readystatechange
事件触发时的时间戳。

111domLoading 当前网页DOM结构开始解析时,也就是
Document.readyState属性变为“loading”、并
且相应的readystatechange事件触发时的时间
戳。
domainLookupEnd 域名查询结束时的时间戳。如果使用持久连接，
或者从本地缓存获取信息的，等同于fetchStart
domainLookupStart 域名查询开始时的时间戳。如果使用持久连接，
或者从本地缓存获取信息的，等同于fetchStart
fetchStart 浏览器准备通过HTTP请求去获取页面的时间
戳。在检查应用缓存之前发生。
loadEventEnd 当前网页load事件的回调函数结束时的时间戳。
如果该事件还没有发生，返回0。
loadEventStart 当前网页load事件的回调函数开始时的时间戳。
如果该事件还没有发生，返回0。
navigationStart 当前浏览器窗口的前一个网页关闭，发生unload
事件时的时间戳。如果没有前一个网页，就等于
fetchStart
redirectEnd 最后一次重定向完成，也就是Http响应的最后一
个字节返回时的时间戳。如果没有重定向，或者
上次重定向不是同源的。则为0
redirectStart 第一次重定向开始时的时间戳，如果没有重定
向，或者上次重定向不是同源的。则为0
requestStart 浏览器向服务器发出HTTP请求时（或开始读取
本地缓存时）的时间戳。
responseEnd 浏览器从服务器收到（或从本地缓存读取）最后
一个字节时（如果在此之前HTTP连接已经关
闭，则返回关闭时）的时间戳
responseStart 浏览器从服务器收到（或从本地缓存读取）第一
个字节时的时间戳。
secureConnectionStart 浏览器与服务器开始安全链接的握手时的时间
戳。如果当前网页不要求安全连接，则返回0。

112参考：https://segmentfault.com/a/1190000014479800unloadEventEnd 如果前一个网页与当前网页属于同一个域下，则
表示前一个网页的unload回调结束时的时间戳。
如果没有前一个网页，或者之前的网页跳转不是
属于同一个域内，则返回值为0。
unloadEventStart 如果前一个网页与当前网页属于同一个域下，则
表示前一个网页的unload事件发生时的时间戳。
如果没有前一个网页，或者之前的网页跳转不是
属于同一个域内，则返回值为0。
