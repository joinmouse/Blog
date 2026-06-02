---
title: "ES6学习笔记——Promise"
date: 2017-07-11
slug_jianshu: 6624c5c80be6
tags: ["异步编程", "ES6"]
state: open
source: "https://www.jianshu.com/p/6624c5c80be6"
source_kind: jianshu
---
#### 1、前言 callback

ES6之前通常的异步编程通过回调函数和事件来处理，但是这样就容易有时候会形callback回调地狱，下面以一个例子为验证，需要实现功能如下：

-   读取a.md文件,得到内容
-   将内容转换成HTML字符串
-   将HTML字符串写入b.html

**coding**

```
const fs = require('fs')
const markdown = require( 'markdown' ).markdown
//一层
fs.readFile('a.md','utf-8',(err,str) => {
  if(err){
    return console.log(err)
  }
  var html = markdown.toHTML(str)
  //二层
  fs.writeFile('b.html',html,(err) => {
    if(err){
      return console.log(err)
    }
    console.log('write success')
  })
})
```

这里的回调只有两层，但是若待处理的函数比较多（一个接一个），那么回调函数的代码就会很臃肿，难以阅读了。

#### 2、Promise简介

Promise是ES6原生中提供的一个对象，从它可以获取异步操作的消息。Promise 提供统一的 API，各种异步操作都可以用同样的方法进行处理。  
Promise对象代表一个异步操作，有三种状态：Pending（进行中）、Resolved（已完成）和Rejected（已失败）。在状态的改变中只有两种可能Pending => Resolved 、Pending => Rejected。  
通过Promise对象，就可以将异步操作以同步操作的流程表达出来，避免了层层嵌套的回调函数。此外，Promise对象提供统一的接口，使得控制异步操作更加容易。

#### 3、基本使用

ES6中 规定，Promise对象是一个构造函数，用来生成Promise实例。  
**coding**

```
var promise = new Promise(function(resolve,reject){
  if (/* 异步操作成功 */){
    resolve(value);
  } else {
    reject(error);
  }
})
```

Promise构造函数接受一个函数作为参数，该函数的两个参数分别是resolve和reject。

-   resolve函数的作用是：将Promise对象的状态从“未完成”变为“成功”（即从 Pending 变为 Resolved），在异步操作成功时调用，并将异步操作的结果，作为参数传递出去。
-   reject函数的作用是，将Promise对象的状态从“未完成”变为“失败”（即从 Pending 变为 Rejected），在异步操作失败时调用，并将异步操作报出的错误，作为参数传递出去。

Promise实例化之后，可以使用then方法分别指定Resolved状态和Reject状态的回调函数:  
**coding**

```
promise.then(function(value){
    //success
}),function(error){
    //fail
}
```

下面举一个Promise对象实现Ajax操作例子  
**coding**

```
//getJSON是对XMLHttpRequest对象的封装，用于发出一个JSON数据的HTTP请求，且返回一个Promise对象
var getJSON = function(url) {

  var promise = new Promise(function(resolve, reject){
    var client = new XMLHttpRequest();
    client.open("GET", url);
    client.onreadystatechange = handler;
    client.responseType = "json";
    client.setRequestHeader("Accept", "application/json");
    client.send();

    function handler() {
      if (this.readyState !== 4) {
        return;
      }
      if (this.status === 200) {
        resolve(this.response);
      } else {
        reject(new Error(this.statusText));
      }
    };
  });

  return promise;
};

//调用
getJSON("/posts.json").then(function(json) {
  console.log('Contents' + json);
}, function(error) {
  console.log('error');
})
```
