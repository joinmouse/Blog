---
title: "React基础—生命周期的演进"
date: 2021-01-01
tags: ["React"]
---

React16之后对之前的生命周期有不少调整，具体变化可以直接查看下面这张大图
![image.png](https://cdn.nlark.com/yuque/0/2020/png/158659/1603267063471-47e713bc-d5ca-4edf-a7c3-18bcea1738ea.png)
图来源：https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/

Mounting 阶段：组件的初始化渲染

![image](https://cdn.nlark.com/yuque/0/2020/png/158659/1603268385204-9a4f59ea-4688-4be1-a114-ab21f4fa1576.png)

通过这张图的对我，我们可以发现变动的地方是废弃了componentWillMount这个API，新增了getDerivedStateFromProps这个API，那么getDerivedStateFromProps是componentWillMount的替代品嘛？

并不是，getDerivedStateFromProps 这个 API，其设计的初衷不是试图替换掉componentWillMount，而是试图替换掉 componentWillReceiveProps，因此它有且仅有一个用途：使用 props 来派生/更新 state。

React 团队为了确保 getDerivedStateFromProps 这个生命周期的纯洁性，直接从命名层面约束了它的用途（getDerivedStateFromProps 直译过来就是"从 Props 里派生 State"）。所以，如果你不是出于这个目的来使用 getDerivedStateFromProps，原则上来说都是不符合规范的。

认识getDerivedStateFromProps
JSXCopy91static getDerivedStateFromProps(props, state)掌握这个API，有三个点需要我们注意的
1、getDerivedStateFromProps是一个静态方法，静态方法不依赖组件实例而存在，因而这个方法内部访问不到this的。

![image](https://cdn.nlark.com/yuque/0/2020/png/158659/1603268733418-1cd4a3d5-9fde-4de8-8e71-23361e4e2f19.png)

2、接受两个参数，分别来自父组件的props和自身的state，我们知道挂载阶段也会受到父组件的props，因为在挂载的生命周期上会触发该方法

![image](https://cdn.nlark.com/yuque/0/2020/png/158659/1603268886582-3f9c7541-ab70-4473-bc9d-eab559f75c47.png)

3、必须要拥有一个对象格式的返回值，如:
返回的字段并不会去覆盖原始的state内容，而是和原始对象内容共存的

Updating 阶段：组件的更新

![image](https://cdn.nlark.com/yuque/0/2020/png/158659/1603269225309-602dec84-7d88-4518-90f1-7eaec8709681.png)

这边我们对比看到的是componentWillReceviceProps被废弃了，前面对getDerivedStateFromProps这个API有了一个了解，我们接下来就问自己一个why

为什么要用 getDerivedStateFromProps 代替 componentWillReceiveProps？

React官方给出的描述如下：
与 componentDidUpdate 一起，这个新的生命周期涵盖过时componentWillReceiveProps 的所有用例。

通过前面我们知道getDerivedStateFromProps主要是 可以代替 componentWillReceiveProps 实现基于 props 派生 state，这也是它唯一应该去做到的事情

从这样我们发现这个API能做的事情更少了，不能访问this，有着唯一需要去完成的事情。这背后是 React 16 在强制推行"只用 getDerivedStateFromProps 来完成 props 到 state 的映射"这一最佳实践。react官方这么推的意思一方面是确保生命周期函数的行为更加可控可预测，从根源上帮开发者避免不合理的编程方式，避免生命周期的滥用。
另一方面就是为了Fiber架构。

认识getSnapshotBeforeUpdate
我们回到最上面的那张大图，看了他的执行时机是在 render 方法之后，真实 DOM 更新之前，知道这个相当重要，也就是在左边对应的pre-commit阶段，在这个阶段同时获取到更新前的真实 DOM 和更新前后的 state&props 信息。

可能平时我们使用这个API不是特别多，但是对于一些特定需求下情况来说非常需要它，试想：实现一个内容会发生变化的滚动列表，要求根据滚动列表的内容是否发生变化，来决定是否要记录滚动条的当前位置

这个需求要求我们前半段需要对比更新前后的数据，后半段需要我们获取真实的DOM信息(位置)，此刻这个API就派上用处了，需要注意的是它的返回值会在componentDidUpdate的第三个参数的

换个角度看生命周期工作流
React新的底层架构是Fiber架构，Fiber 架构的重要特征就是可以被打断的异步渲染模式。但这个“打断”是有原则的，根据“能否被打断”这一标准，React 16 的生命周期被划分为了 render 和 commit 两个阶段，而 commit 阶段又可以被细分为 pre-commit 和 commit(如最上面的大图所示)

- render 阶段：纯净且没有副作用，可能会被 React 暂停、终止或重新启动。
- pre-commit 阶段：可以读取 DOM。
- commit 阶段：可以使用DOM，运行副作用，安排更新。

render 阶段在执行过程中允许被打断，而 commit 阶段则总是同步执行的

为什么这样设计呢？简单来说，由于 render 阶段的操作对用户来说其实是"不可见"的，所以就算打断再重启，对用户来说也是零感知。而 commit 阶段的操作则涉及真实 DOM 的渲染，因而这个过程必须用同步渲染来求稳。

在Fiber 机制下，render 阶段是允许暂停、终止和重启的。那当一个任务执行到一半的时，下一次渲染线程重新得到控制权，任务重启就会重复的执行一次整个任务，这样导致 render 阶段的生命周期都是有可能被重复执行的，
我们看React 16废除的生命周期
它们的特点发现了嘛？就是都处于render阶段的，都可能被重复的去执行，如果开发者去滥用这些阶段导致我们的重复执行的过程不可控，接下来我们看一些可能在componentWill执行的操作吧
1、提前发起请求为例
比如在 componentWillMount 里发起异步请求。很多同学因为太年轻，以为这样做就可以让异步请求回来得“早一点”，从而避免首次渲染白屏。
可惜你忘了，异步请求再怎么快也快不过（React 15 下）同步的生命周期。componentWillMount 结束后，render 会迅速地被触发，所以说首次渲染依然会在数据返回之前执行。这样做不仅没有达到你预想的目的，还会导致服务端渲染场景下的冗余请求等额外问题，得不偿失

2、在 Fiber 带来的异步渲染机制下，可能会导致非常严重的 Bug
试想，假如你在 componentWillxxx 里发起了一个付款请求。由于 render 阶段里的生命周期都可以重复执行，在 componentWillxxx 被打断 + 重启多次后，就会发出多个付款请求。

比如说，这件商品单价只要 10 块钱，用户也只点击了一次付款。但实际却可能因为 componentWillxxx 被打断 + 重启多次而多次调用付款接口，最终付了 50 块钱；又或者你可能会习惯在 componentWillReceiveProps 里操作 DOM（比如说删除符合某个特征的元素），那么 componentWillReceiveProps 若是执行了两次，你可能就会一口气删掉两个符合该特征的元素。

结合上面的分析，我们再去思考 getDerivedStateFromProps 为何会在设计层面直接被约束为一个触碰不到 this 的静态方法，其背后的原因也就更加充分了——避免开发者触碰 this，就是在避免各种危险的骚操作。

总结一下
React16改造生命周期的主要动机就是为了配合Fiber架构带来的异步渲染更新机制，针对长期被滥用的一些API有了强制性的最佳实践，确保Fiber机制下数据和视图安全，也让生命周期方法的行为更为纯粹、可控和可预测。这样一想我们对它的改动是不是就理解的更透彻了，哈哈哈

