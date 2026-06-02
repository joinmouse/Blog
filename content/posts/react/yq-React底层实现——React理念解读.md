---
title: "React底层实现——React理念解读"
date: 2021-01-01
tags: ["React"]
---

我们认为，React 是用 JavaScript 构建快速响应的大型 Web 应用程序的首选方式。它在 Facebook 和 Instagram 上表现优秀。
    — React官网

快速响应
软件的设计是为了服务理念的，懂了设计的理念才明白为啥要这样架构。我们需要如何去理解快速响应呢？从使用者的角度而言主要是响应自然，体验流畅不卡顿

我们日常使用App，浏览网页时，有两类场景会制约快速响应
- 当遇到大计算量的操作或者设备性能不足使页面掉帧或者不能即使响应用户输入，导致卡顿。
- 发送网络请求后，由于需要等待数据返回才能进一步操作导致不能快速响应。

这两类场景可以概括为：
- CPU的瓶颈
- IO的瓶颈

CPU的瓶颈
当项目变得庞大、组件数量繁多时，就容易遇到CPU的瓶颈。考虑如下Demo，我们向视图中渲染3000个li
JSXCopy991234567891011function App() {  const len = 3000;  return (    <ul>      {Array(len).fill(0).map((_, i) => <li>{i}</li>)}    </ul>  );}
const rootEl = document.querySelector("#root");ReactDOM.render(<App/>, rootEl); 主流浏览器刷新频率为60Hz，即每（1000ms / 60Hz）16.6ms浏览器刷新一次。

我们知道，JS可以操作DOM，GUI渲染线程与JS线程是互斥的。所以JS脚本执行和浏览器布局、绘制不能同时执行。

在每16.6ms时间内，需要完成如下工作：

Plain TextCopy91JS脚本执行 -----  样式布局 ----- 样式绘制
当JS执行时间过长，超出了16.6ms，这次刷新就没有时间执行样式布局和样式绘制了。

在Demo中，由于组件数量繁多（3000个），JS脚本执行时间过长，页面掉帧，造成卡顿。

可以从打印的执行堆栈图看到，JS执行时间为73.65ms，远远多于一帧的时间。

![image](https://cdn.nlark.com/yuque/0/2020/png/158659/1604587742035-8bd4e8c5-8a58-4ac0-bf73-eb62176aae95.png)

如何解决这个问题呢？
答案是：在浏览器每一帧的时间中，预留一些时间给JS线程，React利用这部分时间更新组件（可以看到，在[源码](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/scheduler/src/forks/SchedulerHostConfig.default.js#L119)中，预留的初始时间是5ms）。

当预留的时间不够用时，React将线程控制权交还给浏览器使其有时间渲染UI，React则等待下一帧时间到来继续被中断的工作。

这种将长任务分拆到每一帧中，像蚂蚁搬家一样一次执行一小段任务的操作，被称为时间切片（time slice）

接下来我们开启Concurrent Mode（后续章节会讲到，当前你只需了解开启后会启用时间切片）：
此时我们的长任务被拆分到每一帧不同的task中，JS脚本执行时间大体在5ms左右，这样浏览器就有剩余时间执行样式布局和样式绘制，减少掉帧的可能性。

![image](https://cdn.nlark.com/yuque/0/2020/png/158659/1604587811683-790af889-aee9-45b6-86c4-cdf3695663ca.png)

所以，解决CPU瓶颈的关键是实现时间切片，而时间切片的关键是：将同步的更新变为可中断的异步更新。

IO的瓶颈
网络延迟是前端开发者无法解决的。如何在网络延迟客观存在的情况下，减少用户对网络延迟的感知？以iOS为例

点击“设置”面板中的“通用”，进入“通用”界面：

![image](https://cdn.nlark.com/yuque/0/2020/gif/158659/1604588103798-b75c8344-405c-4b24-81b8-d9c5e22cdeb4.gif)

作为对比，再点击“设置”面板中的“Siri与搜索”，进入“Siri与搜索”界面：

![image](https://cdn.nlark.com/yuque/0/2020/gif/158659/1604588117122-3bb1d08e-2385-4a3c-8563-45adde09dfa5.gif)

事实上，点击“通用”后的交互是同步的，直接显示后续界面。而点击“Siri与搜索”后的交互是异步的，需要等待请求返回后再显示后续界面。但从用户感知来看，这两者的区别微乎其微。

这里的窍门在于：点击“Siri与搜索”后，先在当前页面停留了一小段时间，这一小段时间被用来请求数据。

当“这一小段时间”足够短时，用户是无感知的。如果请求时间超过一个范围(这就需要Cuncurrent的支持)，再显示loading的效果。

试想如果我们一点击“Siri与搜索”就显示loading效果，即使数据请求时间很短，loading效果一闪而过。用户也是可以感知到的。

为此，React实现了[Suspense](https://zh-hans.reactjs.org/docs/concurrent-mode-suspense.html)功能及配套的hook——[useDeferredValue](https://zh-hans.reactjs.org/docs/concurrent-mode-reference.html#usedeferredvalue)。

而在源码内部，为了支持这些特性，同样需要将同步的更新变为可中断的异步更新

响应自然
React给出的答案是[将人机交互研究的结果整合到真实的 UI 中](https://zh-hans.reactjs.org/docs/concurrent-mode-intro.html#putting-research-into-production)

![image](https://cdn.nlark.com/yuque/0/2020/jpeg/158659/1601201070467-c7f92910-4585-42a7-a76c-b2acb5a502e7.jpeg)

有一个地址搜索框，在输入字符时会实时显示地址匹配结果

![image](https://cdn.nlark.com/yuque/0/2020/gif/158659/1601201107395-8a428f51-f52d-41bf-88ea-39b7221ac921.gif)

当用户输入过快时可能输入变得不是那么流畅。这是由于下拉列表的更新会阻塞线程。我们一般是通过debounce或 throttle来减少输入内容时触发回调的次数来解决这个问题。

但这是治标不治本的，只要组件的更新操作是同步，那么当更新到开始渲染完毕之前，组件中总会有一定数量的工作占用线程，浏览器主线程就没有空闲时间绘制UI，造成卡顿。在React看来用户输入响应的优先级高于渲染列表的优先级，因而组件的渲染必须是可中断异步更新的

总结
通过以上内容，我们可以看到，React为了践行“构建快速响应的大型 Web 应用程序”理念做出的努力。

其中的关键是解决CPU的瓶颈与IO的瓶颈。而落实到实现上，则需要将同步的更新变为可中断的异步更新。接下来我们就可以很方便的去理解Fiber架构的诞生

参考：https://react.iamkasong.com/preparation/idea.html
