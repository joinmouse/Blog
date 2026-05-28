---
title: "JavaScript之Event Loop"
date: 2019-04-17
issue_number: 5
tags: ["JS深入浅出"]
state: open
source: "https://github.com/joinmouse/Blog/issues/5"
---
### 一、堆栈、队列
#### 1、栈
栈的特点是先进后出，在JS中一般对函数的调用就会创建一个新的栈帧，例如
```
function foo(b) {
  var a = 10;
  return a + b + 11;
}

function bar(x) {
  var y = 3;
  return foo(x * y);
}

console.log(bar(7)); // 返回 42
```
在这个过程中，栈的执行过程可以分为以下几步:
- 当调用 bar 时，创建了第一个帧 ，帧中包含了 bar 的参数和局部变量。
- 当 bar 调用 foo 时，第二个帧就被创建，并被压到第一个帧之上，帧中包含了 foo 的参数和局部变量。
- 当 foo 返回时，最上层的帧就被弹出栈（剩下 bar 函数的调用帧 ）。
- 当 bar 返回的时候，栈就空了。

2、堆
堆这个结构在我们这次事件循环中关联度不大，一般是对象被分配在一个堆中，属于一种非结构化的内存区域。

3、队列
队列的结构是先进先出，在事件循环中最重要的一个概念之一。
一个 JavaScript 运行时包含了一个待处理的消息队列。每一个消息都关联着一个用以处理这个消息的函数。
在事件循环期间的某个时刻，运行时从最先进入队列的消息开始处理队列中的消息。为此，这个消息会被移出队列，并作为输入参数调用与之关联的函数。正如前面所提到的，调用一个函数总是会为其创造一个新的栈帧。
函数的处理会一直进行到执行栈再次为空为止；然后事件循环将会处理队列中的下一个消息（如果还有的话）

### 二 、任务执行过程
对JavaScript有一些了解的都知道它一个门单线程的语言，单线程语言意味着所有任务需要排队执行，这样就有引出了任务队列的概念。
一般，我们可以将所有任务可以分为两种，一种是同步任务（synchronous），另一种是异步任务（asynchronous）。
同步任务：在线程上排队执行的任务，只有前一个任务执行完毕，才能执行后一个任务；
异步任务：不进入线程、而进入"任务队列"（task queue）的任务，只有"任务队列"通知线程，某个异步任务可以执行了，该任务才会进入主线程执行。

### 三、macro task与micro task
一般我们将异步的任务分为两类，macro task与micro task
常见的宏任务有
```
setInterval()
setTimeout()
```
常见的微任务有
```
new Promise()
new MutaionObserver()
```
我们这里只需要记住: 当当前执行栈执行完毕时会立刻先处理所有微任务队列中的事件，然后再去宏任务队列中取出一个事件。**同一次事件循环中，微任务永远在宏任务之前执行** 下面我们通过一个例子来看执行过程
```
setTimeout(function () {
    console.log(1);
}, 0);

console.log(2)

new Promise(function(resolve,reject){
    console.log(3)
    resolve(4)
}).then(function(val){
    console.log(val);
})
```

根据上面的结论，这里附上在浏览器执行的结果
![image](https://user-images.githubusercontent.com/18349016/56262539-a7db0d80-6111-11e9-84b8-60861afc3ed9.png)

关于setTimeout和Promise的用法和具体细节可参考mdn 文档


参考:
[JavaScript 运行机制详解：再谈Event Loop](http://www.ruanyifeng.com/blog/2014/10/event-loop.html)
[并发模型与事件循环](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/EventLoop#%E6%A0%88)
[详解JavaScript中的Event Loop（事件循环）机制](https://zhuanlan.zhihu.com/p/33058983)




