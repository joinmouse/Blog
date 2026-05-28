---
title: "JavaScript之Promise问答"
date: 2019-04-30
issue_number: 9
tags: []
state: open
source: "https://github.com/joinmouse/Blog/issues/9"
---
Promise的基本概念和知识上一篇文章已经写过了，这里记录一篇Promise的一些使用上值得我们注意的点

### 问： Promise 中 .then 的第二参数与 .catch 有什么区别?
我这里直接举一个例子
```
somePromise().then(function () {
  throw new Error('oh noes');
}).catch(function (err) {
  // I caught your error! :)
});

somePromise().then(function () {
  throw new Error('oh noes');
}, function (err) {
  // I didn't catch your error! :(
});
```
then里的第二个参数，是就近捕获的原则
而catch是全局的异常捕获，所有流程异常都捕获

[We have a problem with promises](https://pouchdb.com/2015/05/18/we-have-a-problem-with-promises.html)
在这篇文章中作者甚至直接说自己从不用then的第二个参数，使用catch来捕获异常，我觉得这一点值得我们借鉴

### 问: 如下代码,  分析下打印的顺序
```
setTimeout(function() {
  console.log(1)
}, 0);
new Promise(function executor(resolve) {
  console.log(2);
  for( var i=0 ; i<10000 ; i++ ) {
    i == 9999 && resolve();
  }
  console.log(3);
}).then(function() {
  console.log(4);
});
console.log(5);
```
找个主要考察的其实还是对事件循环的理解，具体分析的步骤如下:
- 首先全部代码算一个macro-task
- 浏览器执行macro-task, 执行的过程发现一个macro-task(setTimeout)， 和一个micro-task(new Promise())，将他们挂起，依次打印2、3、5
- 浏览器执行micro-task， 即new Promise.then()里面的内容，打印出4
- 重复，浏览器再执行一个macro-task,将macro-task队列中的任务取出执行，打印出1
- 所有队列为空，代码执行完毕


### 问: 如下代码, setTimeout 到 10s 之后再 .then 调用, 那么 hello 是会在 10s 之后在打印吗, 还是一开始就打印?
```
let doSth = new Promise((resolve, reject) => {
  console.log('hello');
  resolve();
});

setTimeout(() => {
  doSth.then(() => {
    console.log('over');
  })
}, 10000);
```
参考上面的理解过程，按照事件循环执行的过程：
- 浏览器挂起一个doSth实例Promise的mirco-task和setTimeout的macro-task
- 执行doSth实例Promise的mirco-task,打印出hello
- 10秒后打印出over

所以我们是一开始就回打印出hello滴


