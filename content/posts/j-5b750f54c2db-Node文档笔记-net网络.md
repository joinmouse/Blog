---
title: "Node文档笔记-net网络"
date: 2017-09-19
slug_jianshu: 5b750f54c2db
tags: ["简书"]
state: open
source: "https://www.jianshu.com/p/5b750f54c2db"
source_kind: jianshu
---
本来是打算写http这个模块的，但在读文档的时候发现http.Server这个我们使用是继承之net模块，故就先读一下net这个模块

* * *

### 1、简介

**net**模块提供了创建基于流的TCP或IPC（ Windows 上支持命名管道 IPC）**服务器(`net.createServer()`)和客户端(`net.createConnection()`)的异步网络API**

引入方式：`const net = require('net')`

### 2、net.Server类

该类用户创建TCP或IPC server

-   `server.address()`  
    当在IP socket上监听，则返回绑定的ip地址、 地址族和操作系统报告的服务端口。在找到操作系统分配的地址时，找到指定的端口是有用的.返回一个有 port, family, 和 address 属性: { port: 12346, family: 'IPv4', address: '127.0.0.1' }的对象

```
//创建一个socket服务
const server = net.createServer((socket) => {
  socket.end('goodbye\n');
}).on('error', (err) => {
  // handle errors here
  throw err;
});

server.listen(() => {
  console.log('opened server on', server.address());
});
```
