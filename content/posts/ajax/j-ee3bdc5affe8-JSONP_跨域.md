---
title: "JSONP_跨域"
date: 2017-05-20
slug_jianshu: ee3bdc5affe8
tags: ["简书"]
state: open
source: "https://www.jianshu.com/p/ee3bdc5affe8"
source_kind: jianshu
---
#### 1、同源策略

同源策略是众多的安全策略之一，是在web层面上的策略。同源策略规定：  
**不同域的客户端脚本在没有明确授权的情况下，不能读写对方的资源**，注意关键词：不同域、客户端脚本、授权、读写、资源

-   不同域：同域指的是要求两个站点同协议、同域名、同端口，如判断下列站点与`http://www.foo.com`是否同域？

```
https://www.foo.com             不同域(协议不同)
http://team.foo.com             不同域（team子域与www子域不同）
http://foo.com                  不同域（顶级域与www子域不是一个概念）
http://www.foo.com              不同域（端口不同，默认为80端口）
http://www.foo.com/a            同域
```

-   客户端脚本：一般指JavaScript
-   授权：HTML5标准中关于Ajax跨域访问的情况，默认情况下是不允许跨域访问的，只有目标站点（默认[http://www.foo.com](https://link.jianshu.com?t=http://www.foo.com)) 明确的返回HTTP响应头`Access-Control-Allow-Origin:http://www.foo1.com`,那么[www.foo1.com](https://link.jianshu.com?t=http://www.foo1.com)站点上的客户端脚本就有权通过Ajax对目标站点（[www.foo.com](https://link.jianshu.com?t=http://www.foo.com)）上的数据进行读写操作
-   读写权限：web上的资源很多，有的只有读权限，有的同时有读写权限。如请求头的Referer只读，而document.cookie具备读写权限，这主要是从安全的角度区分的  
    \-资源：同源策略中资源指的是客户端的资源，常见的有HTTP消息头、DOM树、浏览器存储等。在同一个域内，客户端的脚本可以任意读写同域内的资源，前提是这个资源是可读写的

#### 2、 跨域和跨域有几种实现形式？

跨域：允许不同域的接口进行交互  
实现形式：JSOP、CORS、降域、postMessage

#### 3、 JSONP 的原理是什么？

客户端

服务端

-   1、首先在客户端脚本中定义一个数据处理函数fun",
-   2、在上述定义的脚本中使用DOM创建script标签，src的地址执行后端接口，最后加参数callback=fun",
-   3、服务端在收到请求，解析参数，返回fun(data)字符串",
-   4、function（data）会放在script标签作为js执行，此时调用fun函数，将data作为参数"

#### 4、 CORS

在HTML5标准中关于Ajax跨域访问的情况，默认情况下是不允许跨域访问的，只有目标站点（默认[http://www.foo.com](https://link.jianshu.com?t=http://www.foo.com)) 明确的返回HTTP响应头`Access-Control-Allow-Origin:http://www.foo1.com`,那么[www.foo1.com](https://link.jianshu.com?t=http://www.foo1.com)站点上的客户端脚本就有权通过Ajax对目标站点（[www.foo.com](https://link.jianshu.com?t=http://www.foo.com)）上的数据进行读写操作

#### 5、总结跨域解决方式

[https://github.com/joinmouse/hello-world](https://link.jianshu.com?t=https://github.com/joinmouse/hello-world)
