---
title: "JavaScript之Promise对象"
date: 2019-04-30
issue_number: 8
tags: ["JS深入浅出"]
state: open
source: "https://github.com/joinmouse/Blog/issues/8"
---
### 一、Promise是什么
Promise是JavaScript 的异步操作解决方案, 已经是ES6标准中的一员。Promise的 可以让异步操作写起来，就像在写同步操作的流程，而不必一层层地嵌套回调函数。

**Promise 的设计思想是，所有异步任务都返回一个 Promise 实例。Promise 实例有一个then方法，用来指定下一步的回调函数**

首先Promise是一个对象，也是一个构造函数
```
function fn(resolve, reject) {
  // 异步代码...
}
let promise = new Promise(fn)
promise.then(fnDo)
```
new Promise接受一个函数fn作为参数，fn里面操作的是异步的代码，promise是一个new Promise的实例，等fn里面的异步代码执行完成，就会执行fnDo.

### 二、Promise对象的状态
Promise 对象通过自身的状态，来控制异步操作。Promise 实例具有三种状态：
- 异步操作未完成（pending）
- 异步操作成功（fulfilled）
- 异步操作失败（rejected)

三种状态中fulfilled和rejected合在一起称为resolved（已定型），一旦状态发生改变就成型了，不会再改变了，这也是Promise找个词的由来。

Promise 的最终结果只有两种：
- 异步操作成功，Promise 实例传回一个值（value），状态变为fulfilled
- 异步操作失败，Promise 实例抛出一个错误（error），状态变为rejected

### 三、Promise构造函数
```
let promise = new Promise(function (resolve, reject) {
  if (/* 异步操作成功 */){
    resolve(value);
  } else { /* 异步操作失败 */
    reject(new Error());
  }
})
```
Promise构造函数接受一个函数作为参数，该函数的两个参数分别是resolve和reject
- resolve函数的作用是，将Promise实例的状态从“未完成”变为“成功”（即从pending变为fulfilled），在异步操作成功时调用，并将异步操作的结果，作为参数传递出去。
- reject函数的作用是，将Promise实例的状态从“未完成”变为“失败”（即从pending变为rejected），在异步操作失败时调用，并将异步操作报出的错误，作为参数传递出去。

### 四、Promise.prototype.then()
then方法可以接受两个回调函数：
- 第一个是异步操作成功时（变为fulfilled状态）时的回调函数，
- 第二个是异步操作失败（变为rejected）时的回调函数（该参数可以省略）

一旦状态改变，就调用相应的回调函数。

```
var p1 = new Promise(function (resolve, reject) {
  resolve('成功');
});
p1.then(console.log, console.error);
// "成功"

var p2 = new Promise(function (resolve, reject) {
  reject(new Error('失败'));
});
p2.then(console.log, console.error);
// Error: 失败
```
then方法的链式调用
```
p.then(step1).then(step2).then(step3).then(console.log, console.error);
```
p1后面有四个then，意味依次有四个回调函数。只要前一步的状态变为fulfilled，就会依次执行紧跟在后面的回调函数。

最后一个then方法，回调函数是console.log和console.error，用法上有一点重要的区别。console.log只显示step3的返回值，而console.error可以显示p1、step1、step2、step3之中任意一个发生的错误。举例来说，如果step1的状态变为rejected，那么step2和step3都不会执行了（因为它们是resolved的回调函数）。Promise 开始寻找，接下来第一个为rejected的回调函数，在上面代码中是console.error

### 五、Promise实例
这里写一个promise封装ajax请求的实例
```
function search(query) {
  let url = 'http://example.com/search?q=' + query;
  let xhr = new XMLHttpRequest();
  let result;

  let p = new Promise(function (resolve, reject) {
    xhr.open('GET', url, true);
    xhr.onload = function (e) {
      if (this.status === 200) {
        result = JSON.parse(this.responseText);
        resolve(result);
      }
    };
    xhr.onerror = function (e) {
      reject(e);
    };
    xhr.send();
  });
  return p;
}
search('join').then(console.log, console.error)
```


### 六、小结
Promise 的优点在于，让回调函数变成了规范的链式写法, 但并未真正的解决回调地狱，社区的最终方案是aysnc/await
 
