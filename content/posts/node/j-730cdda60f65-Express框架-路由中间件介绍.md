---
title: "Express框架-路由、中间件介绍"
date: 2017-09-21
slug_jianshu: 730cdda60f65
tags: ["Express", "Node.js"]
state: open
source: "https://www.jianshu.com/p/730cdda60f65"
source_kind: jianshu
---
最近在学习Node，接触到了[Express](https://link.jianshu.com?t=http://www.expressjs.com.cn/guide/routing.html)的时候觉得这个框架真的很好，Express 是一个自身功能极简，完全是由路由和中间件构成一个的 web 开发框架：从本质上来说，一个 Express 应用就是在调用各种中间件。

* * *

### 1、基本路由

路由是指如何定义应用的端点（URIs）以及如何响应客户端的请求。还是先直接看一个demo：基本的路由示例

```
//引入express框架，调用express()方法
const express = require('express');
const app = express();

//路由的get请求,参数由路径和回调函数(请求、响应)组成
app.get('/', function(req, res) {
  res.send('hello world');
});
```

在上面的demo中，当我们访问'/'这个路径的时候，服务端响应返回一个`'hello world'`,其实这就是一个基本的路由。

**路由是由一个 URI、HTTP 请求（GET、POST等）和若干个句柄组成，它的结构如下： app.method(path, \[callback...\], callback)， app是 express对象的一个实例，method是一个 [HTTP 请求方法](https://link.jianshu.com?t=http://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol)， path是服务器上的路径， callback是当路由匹配时要执行的函数。**

下面展示一个post请求的路由

```
app.post('/', function (req, res) {
  res.send('POST request to the homepage');
});
```

### 2、路由句柄

这里可以为请求提供多个回调函数，行为类似中间件。  
**使用一个回调函数处理路由**：

```
app.get('/example/a', function (req, res) {
  res.send('Hello from A!');
});
```

**使用多个回调函数处理路由**

```
//需要指定 next 对象
app.get('/example/b', function (req, res, next) {
  console.log('response will be sent by the next function ...');
  next();
}, function (req, res) {
  res.send('Hello from B!');
});
```

**使用回调函数数组处理路由**

```
var cb0 = function (req, res, next) {
  console.log('CB0');
  next();
}

var cb1 = function (req, res, next) {
  console.log('CB1');
  next();
}

var cb2 = function (req, res) {
  res.send('Hello from C!');
}

app.get('/example/c', [cb0, cb1, cb2]); 
```

## 3、中间件

_中间件(middleware)_是一个函数，可以访问请求对象(request)，响应对象(respone),与web应用中处于请求-响应循环流程中的中间件，一般命名为next的变量。还是先直接看demo吧

**(1)应用级中间件**

```
var app = express();

// 没有挂载路径的中间件，应用的每个请求都会先执行该中间件，next()会让其进入下一个中间件
app.use(function (req, res, next) {
  console.log('Time:', Date.now());
  next();
});

// 挂载至 /user/:id 的中间件，任何指向 /user/:id 的请求都会执行它，next()后接着进入下一个中间件
app.use('/user/:id', function (req, res, next) {
  console.log('Request Type:', req.method);
  next();
});

// 路由和句柄函数(中间件系统)，处理指向 /user/:id 的 GET 请求
app.get('/user/:id', function (req, res, next) {
  res.send('USER');
});
```

上面我们介绍过路由句柄，这里我们看一个作为中间件系统的路由句柄，来为路径定义多个路由。demo如下

```
// 一个中间件栈，处理指向 /user/:id 的 GET 请求
app.get('/user/:id', function (req, res, next) {
  console.log('ID:', req.params.id);
  next();
}, function (req, res, next) {
  res.send('User Info');
});

// 处理 /user/:id， 打印出用户 id
app.get('/user/:id', function (req, res, next) {
  res.end(req.params.id);
});
```

上面的例子中，为指向 /user/:id 的 GET 请求定义了两个路由。第二个路由虽然不会带来任何问题，但却永远不会被调用，因为**第一个路由已经终止了请求-响应循环。**

**(2)路由级中间件**  
路由级中间件和应用级中间件类似，只是他绑定的对象`express.Router()`，还是直接抛demo吧

```
//引入express.Router()方法
var app = express();
var router = express.Router();

// 没有挂载路径的中间件，通过该路由的每个请求都会执行该中间件
router.use(function (req, res, next) {
  console.log('Time:', Date.now());
  next();
});

// 一个中间件栈，显示任何指向 /user/:id 的 HTTP 请求的信息
router.use('/user/:id', function(req, res, next) {
  console.log('Request URL:', req.originalUrl);
  next();
}, function (req, res, next) {
  console.log('Request Type:', req.method);
  next();
});

// 一个中间件栈，处理指向 /user/:id 的 GET 请求
router.get('/user/:id', function (req, res, next) {
  // 如果 user id 为 0, 跳到下一个路由
  if (req.params.id == 0)  next('route');
  // 负责将控制权交给栈中下一个中间件
  else next(); //
}, function (req, res, next) {
  // 渲染常规页面
  res.render('OK');
});

// 处理 /user/:id， 渲染一个特殊页面
router.get('/user/:id', function (req, res, next) {
  console.log(req.params.id);
  res.render('special');
});

//将路由挂载到应用上
app.use('/',router)
```

### 4、附录参考：响应方法

下表中响应对象（res）的方法向客户端返回响应，终结请求响应的循环。如果在路由句柄中一个方法也不调用，来自客户端的请求会一直挂起。

响应方法

参考链接：[http://www.expressjs.com.cn/guide/routing.html](https://link.jianshu.com?t=http://www.expressjs.com.cn/guide/routing.html)
