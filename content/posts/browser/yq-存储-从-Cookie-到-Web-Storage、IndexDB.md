---
title: "存储 | 从 Cookie 到 Web Storage、IndexDB"
date: 2021-01-01
tags: ["浏览器存储"]
---

1、Cookie

Cookie的起源
在 Web 开发的早期，人们亟需解决的一个问题就是状态管理的问题：HTTP 协议是一个无状态协议，服务器接收客户端的请求，返回一个响应，故事到此就结束了，服务器并没有记录下关于客户端的任何信息。那么下次请求的时候，如何让服务器知道"我是我"呢？在这样的背景下，就发明了Cookie。

Cookie的运用
cookie的出现的目的开始并不是为了存储，而是"维持状态"。
第一次访问服务器的时候，服务端一般通过响应头的Set-Cookie来制定要存储的cookie值(键值对)，默认情况下，domain 被设置为设置 Cookie 页面的主机名，我们也可以手动设置 domain 的值。客户端收到响应头信息会将cookie存储在浏览器中，接下来的访问都会在响应头中携带cookie信息

HTTPCopy912// 服务端设置响应头信息Set-Cookie: name=jojnmouse; domain=demo.com
Cookie的弊端
- cookie体积的上限是4kb, 一般只用于存储少量的信息
- 同一域名下的所有请求，都会带上cookie。图片和一些css文件作为静态资源没必要每次请求的时候带上cookie,随着请求的增加，携带不必要的cookie会带来额外的开销

Cookie的乱用
随着前端应用复杂度的提高，Cookie 也渐渐演化为了一个“存储多面手”——它不仅仅被用于维持状态，还被塞入了一些乱七八糟的其它信息，被迫承担起了本地存储的“重任”。在没有更好的本地存储解决方案的年代里, Cookie 小小的身体里承载了 4KB 内存所不能承受的压力。

为了弥补 Cookie 的局限性，让“专业的人做专业的事情”，Web Storage 出现了。

2、Web Storage
Web Storage 是 HTML5 专门为浏览器存储而提供的数据存储机制，不与服务端进行通信。分为 localStorage 与 sessionStorage

生命周期
- sessionStorage存储的数据只在页面当前会话期间可用，它是会话级别的存储，当会话结束（页面被关闭）时，存储内容也随之被释放，同样域名下新开的窗口就不可用。
- localStorage 是持久化的本地存储，存储在其中的数据是永远不会过期的，浏览器关闭后打开依旧存在，使其消失的唯一办法是手动删除

基本操作

sessionStorage和localStorage是通过键值对的方式存储数据的，通过window.sessionStorage和window.localStorage属性使用的，具有相同的方法。

JavaScriptRun CodeCopy9912345678910111213// 存储数据window.localStorage.setItem('username', 'joinmouse')window.sessionStorage.setItem('username', 'joinmouse')
// 读取数据window.localStorage.getItem('username')   //joinmousewindow.sessionStorage.getItem('username') //joinmouse
//删除某键下的数据window.sessionStorage.removeItem('username')
//清空数据window.sessionStorage.clear()
使用场景
localStorage 在存储方面没有什么特别的限制，理论上 Cookie 无法胜任的、可以用简单的键值对来存取的数据存储任务，都可以交给 Local Storage 来做。举个例子，考虑到 Local Storage 的特点之一是持久，有时我们更倾向于用它来存储一些内容稳定的资源。比如图片内容丰富的电商网站会用它来存储 Base64 格式的图片字符串。

sessionStorage 更适合用来存储生命周期和它同步的会话级别的信息。这些信息只适用于当前会话，当你开启新的会话时，它也需要相应的更新或释放。比如微博的 Session Storage 就主要是存储你本次会话的浏览足迹。

局限性
Web Storage 是一个从定义到使用都非常简单的东西。它使用键值对的形式进行存储，这种模式有点类似于对象，却甚至连对象都不是——它只能存储字符串，要想得到对象，我们还需要先对字符串进行一轮解析。
说到底，Web Storage 是对 Cookie 的拓展，它只能用于存储少量的简单数据。当遇到大规模的、结构复杂的数据时，这时候我们就要清楚我们的终极大 boss——IndexedDB！

3、IndexedDB

IndexedDB是一个运行在浏览器上一个数据库，可以被网页脚本创建和操作。IndexedDB允许存储大量的数据，提供查找接口，还能建立索引。

创建/打开一个数据库

执行上面的js代码后，我们就可以发现在IndexedDB中增加我们这样一个数据库

![image.png](https://cdn.nlark.com/yuque/0/2019/png/158659/1571371531737-eb9f820b-db3c-4bdf-9063-895144f0c51c.png)

创建一个object store(对标数据库的"表")

onupgradeneeded事件会在初始化数据库或版本更新时被调用，我们在监听函数中创建object store, 新增一张person的表，主键是id

通过事务来执行一些数据库的操作(增删改查)

4、indexedDB存储和localStorage存储的对比
- indexedDB存储IE10+支持，localStorage存储IE8+支持，后者兼容性更好；
- indexedDB存储比较适合键值对较多的数据，我之前不少项目需要存储多个字段，使用的是localStorage存储，结果每次写入和写出都要字符串化和对象化，很麻烦，如果使用indexedDB会轻松很多，因为无需数据转换。
- indexedDB存储可以在workers中使用，localStorage貌似不可以。这就使得在进行PWA开发的时候，数据存储的技术选型落在了indexedDB存储上面。

若浏览器主窗体线程开发，同时存储数据结构简单，例如，就存个true/false， 显然localStorage上上选；如果数据结构比较复杂，同时对浏览器兼容性没什么要求，可以考虑使用indexedDB；
若是在Service Workers中开发应用，只能使用indexedDB数据存储。

参考链接
http://www.ruanyifeng.com/blog/2018/07/indexeddb.html
https://www.zhangxinxu.com/wordpress/2017/07/html5-indexeddb-js-example/
