---
title: "React | Fiber 架构简介"
date: 2020-03-15
tags: ["语雀"]
source_kind: yuque
---

## 1、fiber 之前是怎么样的，为什么需要 fiber

- 不能中断
- 执行栈太深
- 导致用户输入或者交互可能会卡顿

## 2、fiber 是什么

### 2.1 fiber 是一个执行单元

### 2.2 fiber 是一种数据结构

```javascript
type fiber {
    type: any,
    return Fiber   // 指向父元素
    child Fiber    // 指向第一个子元素
    sibling Fiber  // 指向下一个弟弟
}
```

## 3、fiber 执行阶段

每次渲染有两个阶段：协调阶段、提交阶段。

- **协调阶段：** 可以认为是 Diff 阶段，这个阶段可以被中断的，这个阶段所有节点变更，例如节点的增、删、属性变更，这些也都是 React 的副作用（effect）。
- **提交阶段：** 将上一个阶段计算出来的需要处理的 effect 一次性执行，这个阶段必须同步执行，不能被打断。

## 4、fiber 解决的问题

React Fiber 的思想和协程的概念是契合的：React 渲染的过程可以被中断，可以将控制权交回浏览器，让位给高优先级的任务，浏览器空闲后再恢复渲染。

参考文档：https://juejin.im/post/5dadc6045188255a270a0f85#heading-3

---

## requestIdleCallback 和 requestAnimationFrame 详解

我们可以从知乎上一个很有意思的问题上入手 https://www.zhihu.com/question/47911480 ，之所以觉得很有意思是因为很多刚开始入门的新手可能会以为我们的网页是一直以 fps=60 帧的频率在刷新的，实际上大部分时刻我们看到的是静态的网页，这个时候基本 fps 的刷新率很低，而当滚动网页或者网页有动画执行的时候，才是以 fps=60 的频率去刷新网页，带给我们流畅的体验。

### 1、Frame

我们先来看下一帧在浏览器中包含哪些内容。从上图我们可以发现一帧可以分为以下几个部分：

- 处理用户的交互
- JS 执行
- Begin frame：窗口尺寸的变更、页面滚动处理、媒体查询改变、动画事件
- requestAnimationFrame 和 IntersectionObserver 里面回调的执行
- 计算布局和重新绘制

假设某一帧执行的任务不多，在不到 16.6ms 的时间就完成了上面的任务，那么就会有剩余时间来执行 requestIdleCallback 的回调了，如果没有时间不会执行了。

### 2、requestAnimationFrame 和 requestIdleCallback 介绍

从这里我们知道：requestAnimationFrame 的回调会在每一帧确定执行，属于高优先级任务；而 requestIdleCallback 的回调则不一定会执行，属于低优先级任务。

当页面静止的时候，浏览器处于空闲状态，fps 的刷新率也会很低。这个时候留给 requestIdleCallback 执行的时间就可以适当拉长，最长可达到 50ms。为什么是 50ms 呢，因为给用户响应的交互时间最佳状态是在 100ms 以内，假设现在浏览器处于空闲状态，我们用 50ms 去执行 requestIdleCallback 回调中的任务，那么还可以留下 50ms 去响应用户的事件。

### 3、JS 动画神器 requestAnimationFrame

在 requestAnimationFrame 这个 API 出现之前，用 JS 实现动画我们都是用的 setTimeout 或 setInterval，通过传入时间间隔参数来模拟动画的效果。但是它们实际上由于内在运行机制决定了时间间隔参数实际上只是指定了把动画代码添加到浏览器 UI 线程队列中以等待执行的时间，队列前面已经加入了其他任务，那动画代码就要等前面的任务完成后再执行，这样其实并不是十分的精确。

而使用 requestAnimationFrame 优势如下：

1. requestAnimationFrame 会把每一帧中的所有 DOM 操作集中起来，在一次重绘或回流中就完成，并且重绘或回流的时间间隔紧紧跟随浏览器的刷新频率
2. 在隐藏或不可见的元素中，requestAnimationFrame 将不会进行重绘或回流，这当然就意味着更少的 CPU、GPU 和内存使用量
3. requestAnimationFrame 是由浏览器专门为动画提供的 API，在运行时浏览器会自动优化方法的调用，并且如果页面不是激活状态下的话，动画会自动暂停，有效节省了 CPU 开销

#### 语法

当执行上面的调用的时候，浏览器会在下次重绘前传入 callback 回调函数，callback 的执行次数是每秒 60 次。在每次回调函数执行的时候，会被传入 `DOMHighResTimeStamp` 参数，`DOMHighResTimeStamp` 指示当前被 `requestAnimationFrame()` 排序的回调函数被触发的时间。

返回值是一个请求 ID，作为标识，没有其他的意义，可以传入这个值给 `window.cancelAnimationFrame()` 以取消回调函数。

```javascript
window.requestAnimationFrame(callback)
```

```javascript
// 请求ID
requestID = requestAnimationFrame(callback);

// 控制台输出 1 和 0
var timer = requestAnimationFrame(function(){
    console.log(0);
});
console.log(timer); //1

// 控制台什么都不输出
var timerCancel = requestAnimationFrame(function(){
    console.log(0);
});
cancelAnimationFrame(timerCancel);
```

#### 实际例子

使用 requestAnimationFrame 来实现一个进度条：https://codepen.io/wuqi/embed/KKdVxXb?editors=1010

### 4、空闲时间合理利用：requestIdleCallback

由于 requestIdleCallback 利用的是帧的空闲时间，那么浏览器就可能一直处于繁忙的状态，导致回调一直无法执行（饿死问题），有时候这并不是我们所期待的结果（比如上报丢失），在这种情况下，我们可以在调用 requestIdleCallback 的时候传入第二个参数 timeout 了，简单的说就是到了这个时间 callback 还没执行，就会强制让其执行，当然如果此刻正在执行动画之类的，requestIdleCallback 在强制执行的任务比较耗时就会给用户感觉一丝卡顿。

```javascript
requestIdleCallback(handleUploadWork, { timeout: 2000 })

function handleUploadWork(deadline) {
  // 当回调函数是由于超时才得以执行的话，deadline.didTimeout 为 true
  while (deadline.timeRemaining() > 0 || deadline.didTimeout) {
    // do something...
  }
  requestIdleCallback(handleUploadWork)
}
```

### 5、requestIdleCallback 里面可以执行 DOM 修改操作吗？

强烈建议不要。从上面一帧的构成里面可以看到，requestIdleCallback 回调的执行说明前面的工作（包括样式变更以及布局计算）都已完成。如果我们在 callback 里面做 DOM 修改的话，之前所做的布局计算都会失效，而且如果下一帧里有获取布局（如 getBoundingClientRect、clientWidth）等操作的话，浏览器就不得不执行强制重排工作，这会极大的影响性能，另外由于修改 DOM 操作的时间是不可预测的，因此很容易超出当前帧空闲时间的阈值，故而不推荐这么做。

推荐的做法是在 requestAnimationFrame 里面做 DOM 的修改，可以在 requestIdleCallback 里面构建 Document Fragment，然后在下一帧的 requestAnimationFrame 里面应用 Fragment。

除了不推荐 DOM 修改操作外，Promise 的 resolve/reject 操作也不建议放在里面，因为 Promise 的回调会在 idle 的回调执行完成后立刻执行，会拉长当前帧的耗时，所以不推荐。
