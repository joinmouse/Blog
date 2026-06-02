---
title: "异步(promise)"
date: 2017-12-02
slug_jianshu: 16f85a8c2f63
tags: []
state: open
source: "https://www.jianshu.com/p/16f85a8c2f63"
source_kind: jianshu
---
#### 1、Promise基本介绍

在传统的异步调用：回调函数(callback)和事件，在ES6中将promise纳入新的语法标准中作为解决方案。

Promise对象有两个特点：  
一、对象的状态不受外界影响，Promise对象代表一个异步操作，有三种状态：pending（进行中）、fulfilled（已成功）和rejected（已失败）。**只有异步操作的结果，可以决定当前是哪一种状态，任何其他操作都无法改变这个状态**

二、一旦状态改变，就不会再变，任何时候都可以得到这个结果。promise对象的状态改变，**只有两种可能：从pending变为fulfilled(resolve)和从pending变为rejected**。只要这样的两种情况发生，状态就凝固了不会再改变了,会一直保持这样的一个结果。改变发生后，再对promise对，象添加回调函数，会立刻得到这个结果。**这与事件(Event)完全不同，事件的特点是：若你错过了再去监听，是得不到结果的**

-   基本用法  
    ES6中规定，promise对象是一个构造函数，用来生成promise实例

```
const promise = new Promise((resolve, reject) => {
  // ... some code
  if (/* 异步操作成功 */){
    resolve(value);
  }else {
    reject(error);
  }
});
```

**Promise构造函数接受一个函数作为参数，该函数的两个参数分别是resolve和reject**，它们是两个函数，由 JavaScript 引擎提供。

-   resolve函数的作用是，将Promise对象的状态从“未完成”变为“成功”（即从 pending 变为 resolved），在异步操作成功时调用，并将异步操作的结果，作为参数传递出去；
-   reject函数的作用是，将Promise对象的状态从“未完成”变为“失败”（即从 pending 变为 rejected），在异步操作失败时调用，并将异步操作报出的错误，作为参数传递出去。

**promise实例生成后，可用then方法分别指定resolved状态和rejected状态的回调函数**。

```
promise.then((value) => {
  // success
}, (error) => {
  // failure
})
```

then方法可以接受两个回调函数作为参数。

-   第一个回调函数是Promise对象的状态变为resolved时调用。
-   第二个回调函数是Promise对象的状态变为rejected时调用。

看一个Promise对象的实例

```
let promise = new Promise((resolve, reject) => {
  console.log('Promise')
  resolve()
})

promise.then( () => {
  console.log('resolve')
})

console.log('Hi !')

// Promise
// Hi!
// resolved
```

#### 2、promise的方法

-   Promise.prototype.then()  
    **then方法是定义在原型对象Promise.prototype上的,它的作用是为 Promise 实例添加状态改变时的回调函数**

```
//首先假设(定义)getJSON为一个ｐｒｏｍｉｓｅ对象
getJSON("/post/1.json").then(
  post => getJSON(post.commentURL)
).then(
  comments => console.log("resolved: ", comments),
  err => console.log("rejected: ", err)
);
```

第一个then方法指定的回调函数，返回的是另一个Promise对象。  
这时，第二个then方法指定的回调函数，就会等待这个新的Promise对象状态发生变化。如果变为resolved，就调用funcA，如果状态变为rejected，就调用funcB。

-   Promise.prototype.catch()  
    `Promise.prototype.catch()`方法是`then(null, rejection)`的别名，用于指定发生错误时的回调函数。

```
getJSON('/posts.json').then(function(posts) {
  // ...
}).catch(function(error) {
  // 处理 getJSON 和 前一个回调函数运行时发生的错误
  console.log('发生错误！', error);
});
```

需要补充注意的一点是，当Ｐｒｏｍｉｓｅ状态已经变为了`resolved`,再抛出错误是无效的

```
const promise = new Promise(function(resolve, reject) {
  resolve('ok');
  throw new Error('test');
});
promise.then(function(value) { console.log(value) })
       .catch(function(error) { console.log(error) });

// ok
```

参考链接：[http://www.ituring.com.cn/article/66566](https://link.jianshu.com?t=http://www.ituring.com.cn/article/66566)  
[http://es6.ruanyifeng.com/#docs/promise#Promise-prototype-then](https://link.jianshu.com?t=http://es6.ruanyifeng.com/#docs/promise#Promise-prototype-then)
