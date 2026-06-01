---
title: "解读 | document.readyState"
date: 2026-06-01
tags: ["语雀"]
source_kind: yuque
---

关于⻚⾯的加载状态我们经常听到load、DomContentLoaded等各种事件，总是很难记住他们的具体含
义。最近了解了documen.readyState这个API，觉得写的很好，就分享在下⾯，MDN上关于这个API的
介绍是
总共有三种状态，分别是：loading、interactive、complete
loading状态表示，表示document"正在加载"状态，
表示"可交互"状态，此时正在加载的状态已经结束了，但是图像、样式、框架之类的资源还在加载中
⽂档和所有⼦资源已完成加载。表示load状态的事件即将被触发
当上⾯的属性状态发⽣变化的时候，就会触发document对象上⾯的readystatechange事件，我们可以
⽤readystatechange来模拟DomContentLoaded 
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
3
5
JavaScript

110附：Performance的timing属性各项的解释5、模拟load事件的readystatechange
// 模拟 load 事件
document .onreadystatechange  = function  () {
  if (document .readyState  === "complete" ) {
    initApplication ();
  }
}1
3
5
JavaScript
名称 作⽤（这⾥所有时间戳都代表UNIX毫秒时间戳）
connectEnd 浏览器与服务器之间的连接建⽴时的时间戳，连
接建⽴指的是所有握⼿和认证过程全部结束
connectStart HTTP请求开始向服务器发送时的时间戳，如果
是持久连接，则等同于fetchStart。
domComplete 当前⽹⻚DOM结构⽣成时，也就是
Document.readyState属性变为“complete”,并
且相应的readystatechange事件触发时的时间
戳。
domContentLoadedEventEnd 当前⽹⻚DOMContentLoaded事件发⽣时，也
就是DOM结构解析完毕、所有脚本运⾏完成时的
时间戳。
domContentLoadedEventStart 当前⽹⻚DOMContentLoaded事件发⽣时，也
就是DOM结构解析完毕、所有脚本开始运⾏时的
时间戳。
domInteractive 当前⽹⻚DOM结构结束解析、开始加载内嵌资源
时，也就是Document.readyState属性变
为“interactive”、并且相应的readystatechange
事件触发时的时间戳。

111domLoading 当前⽹⻚DOM结构开始解析时,也就是
Document.readyState属性变为“loading”、并
且相应的readystatechange事件触发时的时间
戳。
domainLookupEnd 域名查询结束时的时间戳。如果使⽤持久连接，
或者从本地缓存获取信息的，等同于fetchStart
domainLookupStart 域名查询开始时的时间戳。如果使⽤持久连接，
或者从本地缓存获取信息的，等同于fetchStart
fetchStart 浏览器准备通过HTTP请求去获取⻚⾯的时间
戳。在检查应⽤缓存之前发⽣。
loadEventEnd 当前⽹⻚load事件的回调函数结束时的时间戳。
如果该事件还没有发⽣，返回0。
loadEventStart 当前⽹⻚load事件的回调函数开始时的时间戳。
如果该事件还没有发⽣，返回0。
navigationStart 当前浏览器窗⼝的前⼀个⽹⻚关闭，发⽣unload
事件时的时间戳。如果没有前⼀个⽹⻚，就等于
fetchStart
redirectEnd 最后⼀次重定向完成，也就是Http响应的最后⼀
个字节返回时的时间戳。如果没有重定向，或者
上次重定向不是同源的。则为0
redirectStart 第⼀次重定向开始时的时间戳，如果没有重定
向，或者上次重定向不是同源的。则为0
requestStart 浏览器向服务器发出HTTP请求时（或开始读取
本地缓存时）的时间戳。
responseEnd 浏览器从服务器收到（或从本地缓存读取）最后
⼀个字节时（如果在此之前HTTP连接已经关
闭，则返回关闭时）的时间戳
responseStart 浏览器从服务器收到（或从本地缓存读取）第⼀
个字节时的时间戳。
secureConnectionStart 浏览器与服务器开始安全链接的握⼿时的时间
戳。如果当前⽹⻚不要求安全连接，则返回0。

112参考：https://segmentfault.com/a/1190000014479800unloadEventEnd 如果前⼀个⽹⻚与当前⽹⻚属于同⼀个域下，则
表示前⼀个⽹⻚的unload回调结束时的时间戳。
如果没有前⼀个⽹⻚，或者之前的⽹⻚跳转不是
属于同⼀个域内，则返回值为0。
unloadEventStart 如果前⼀个⽹⻚与当前⽹⻚属于同⼀个域下，则
表示前⼀个⽹⻚的unload事件发⽣时的时间戳。
如果没有前⼀个⽹⻚，或者之前的⽹⻚跳转不是
属于同⼀个域内，则返回值为0。

113