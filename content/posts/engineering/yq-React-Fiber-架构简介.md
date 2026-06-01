---
title: "React | Fiber 架构简介"
date: 2026-06-01
tags: ["语雀"]
source_kind: yuque
---

不能中断
执⾏栈太深
导致⽤户输⼊或者交互可能会卡顿
2.1 fiber是⼀个执⾏单元1、fiber之前是怎么样的，为什么需要fiber
●
●
2、fiber是什么

2852.2 fiber是⼀种数据结构
每次渲染有两个阶段： 协调阶段、提交阶段
协调阶段：可以认为是Diff阶段，这个阶段可以被中断的，这个阶段所有节点变更，例如节点的增、
删、属性变更，这些也都是React的副作⽤(effect)
提交阶段：将上⼀个阶段计算出来的需要处理的effect⼀次性执⾏，这个阶段必须同步执⾏，不能被打
断
React Fiber 的思想和协程的概念是契合的：React 渲染的过程可以被中断，可以将控制权交回浏览
器，让位给⾼优先级的任务，浏览器空闲后再恢复渲染。
流程图3、fiber执⾏阶段
4、fiber解决的问题type fiber {
type: any,
   return Fiber  //指向⽗元素
    child Fiber //指向第⼀个⼦元素
    sibling Fiber //指向下⼀个弟弟
}1
3
5
JavaScript

286参考⽂档：
https://juejin.im/post/5dadc6045188255a270a0f85#heading-3

288requestIdleCallback 和  requestAnimationFrame
详解
我们可以从知乎上⼀个很有意思的问题上⼊⼿https://www.zhihu.com/question/47911480，之所以觉
得很有意思是因为很多刚开始⼊⻔的新⼿可能会以为我们的⽹⻚是⼀直以fps=60帧的频率在刷新的，实
际上⼤部分时刻我们看到的是静态的⽹⻚，这个时候基本fps的刷新率很低，⽽当滚动⽹⻚或者⽹⻚有动
画执⾏的时候，才是以fps=60的频率去刷新⽹⻚，带给我们流畅的体验。
我们先来看下⼀帧在浏览器中包含哪些内容
从上图我们可以发现⼀帧可以分为⼀下⼏个部分
处理⽤的交互
JS执⾏
Begin frame：窗⼝尺⼨的变更、⻚⾯滚动处理、媒体查询改变、动画事件
requestAnimationFrame和IntersectionObserver⾥⾯回调的执⾏
计算布局和重新绘制
假设某⼀帧执⾏的任务不多，在不到16.6ms的时间就完成了上⾯的任务，那么就会有剩余时间来执⾏
requestIdleCallback的回调了，如果没有时间不会执⾏了。1、Frame
●
●
●
●
●
2、requestAnimationFrame和requestIdleCallback介绍

289从这⾥我们知道：requestAnimationFrame的回调会在每⼀帧确定执⾏，属于⾼优先级任务；⽽
requestIdleCallback的回调则不⼀定会执⾏，属于低优先级任务。
当⻚⾯精致的时候，浏览器处于空闲状态，fps的刷新率也会很低。这个时候留给requestIdleCallback
执⾏的时间就可以适当拉⻓，最⻓可达到50ms。为什么是50ms呢，因为给⽤户相应的交互时间
最佳状态是在100ms以内，假设现在浏览器处于空闲状态，我们⽤户50ms去执⾏
requestIdleCallback回调中的任务，那么还可以留下50ms去响应⽤户的事件。
在requestAnimationFrame这个API出现之前，⽤JS实现动画我们都是⽤的setTimeout或setInterval，通过传
⼊时间间隔参数来模拟动画的效果。但是它们实际上由于内在运⾏机制决定了时间间隔参数实际上只是指定了3、JS动画神器requestAnimationFrame

290把动画代码添加到浏览器UI线程队列中以等待执⾏的时间，队列前⾯已经加⼊了其他任务，那动画代码就要等
前⾯的任务完成后再执⾏，这样其实并不是⼗分的精确。
⽽使⽤requestAnimationFrame优势如下：
1、requestAnimationFrame会把每⼀帧中的所有DOM操作集中起来，在⼀次重绘或回流中就完成，并
且重绘或回流的时间间隔紧紧跟随浏览器的刷新频率
2、在隐藏或不可⻅的元素中，requestAnimationFrame将不会进⾏重绘或回流，这当然就意味着更少
的CPU、GPU和内存使⽤量
3、requestAnimationFrame是由浏览器专⻔为动画提供的API，在运⾏时浏览器会⾃动优化⽅法的调
⽤，并且如果⻚⾯不是激活状态下的话，动画会⾃动暂停，有效节省了CPU开销
当执⾏上⾯的调⽤的时候，浏览器会在下次重绘前传⼊callback回调函数，callbackl的执⾏次数是每秒60次。
在每次回调函数执⾏的时候，会被传⼊ DOMHighResTimeStamp 参数， DOMHighResTimeStam
p 指示当前被  requestAnimationFrame()  排序的回调函数被触发的时间
返回值是⼀个请求ID，作为标识，没有其他的意义，可以传⼊这个值给 window.cancelAnimat
ionFrame()  以取消回调函数语法
window.requestAnimationFrame (callback ) 1
JavaScript
// 请求ID
requestID  = requestAnimationFrame (callback ); 
// 控制台输出 1 和 0
var timer = requestAnimationFrame (function (){
    console.log(0);
}); 
console.log(timer); //1
// 控制台什么都不输出
var timerCancel  = requestAnimationFrame (function (){
    console.log(0);
}); 
cancelAnimationFrame (timerCancel );1
3
5
7
9
11
13
JavaScript

291使⽤requestAnimationFrame来实现⼀个进度条
由于requestIdleCallback利⽤的是帧的空闲时间，那么浏览器就可能⼀直处于繁忙的状态，导致回调⼀
直⽆法执⾏(饿死问题)，有时候这并不是我们所期待的结果(⽐如上报丢失)，在这种情况下，我们可以在
调⽤requestIdlecallback的时候传⼊第⼆个参数timeout了，简单的说就是到了这个时间callback还没执
⾏，就会强制让其执⾏，当然如果此刻正在执⾏动画之类的，requestIdleCallback在强制执⾏的任务⽐
较耗时就会给⽤户感觉⼀丝卡顿。
强烈建议不要，从上⾯⼀帧的构成⾥⾯可以看到，requestIdleCallback回调的执⾏说明前⾯的⼯作（包
括样式变更以及布局计算）都已完成。如果我们在callback⾥⾯做DOM修改的话，之前所做的布局计算
都会失效，⽽且如果下⼀帧⾥有获取布局（如getBoundingClientRect、clientWidth）等操作的话，浏
览器就不得不执⾏强制重排⼯作,这会极⼤的影响性能，另外由于修改dom操作的时间是不可预测的，因
此很容易超出当前帧空闲时间的阈值，故⽽不推荐这么做。
推荐的做法是在requestAnimationFrame⾥⾯做dom的修改，可以在requestIdleCallback⾥⾯构建
Document Fragment，然后在下⼀帧的requestAnimationFrame⾥⾯应⽤Fragment
除了不推荐DOM修改操作外，Promise的resolve/reject操作也不建议放在⾥⾯，因为Promise的回调会
在idle的回调执⾏完成后⽴刻执⾏，会拉⻓当前帧的耗时，所以不推荐。实际例⼦
4、空闲时间合理利⽤：requestIdleCallback
5、requestIdleCallback⾥⾯可以执⾏DOM修改操作吗？https://codepen.io/wuqi/embed/KKdVxXb?editors=1010
requestIdleCallback (handleUploadWork , { timeout: 2000 })
function  handleUploadWork (deadline ) {
  // 当回调函数是由于超时才得以执⾏的话， deadline.didTimeout 为 true
while(deadline .timeRemaining () > 0 || deadline .didTimeout ) {
  // do something...
  }
  requestIdleCallback (handleUploadWork )
}1
3
5
7
9
JavaScript

292