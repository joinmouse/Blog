---
title: "React生态——Redux设计理念"
date: 2021-01-01
tags: ["React", "Redux"]
---

Redux是React的主流数据状态管理库之一，整个设计理念是源于Flux的，那我们看下Flux的架构是咋样的

认识Flux架构
Flux起源于Facebook技术团队提出的一种应用架构，或者说数据的处理模式，可以将一个应用拆分为4个部分：
- View视图层：用户界面。该用户界面可以是以任何形式实现出来的，React 组件是一种形式，Vue、Angular 也完全可以

- Action： 动作，可以理解为视图层发出"消息"(如用户交互事件)，会触发去应用状态的改变

- Dispatcher：派发器(调度器)，负责对action进行分发

- Store(数据层)：它是存储应用数据的状态，此外还会修改状态的逻辑，store最终的变化会映射到view层

![image](https://cdn.nlark.com/yuque/0/2020/png/158659/1608192229392-247034a2-155e-409e-8550-585d43059d12.png)

一个典型的 Flux 工作流是这样的：
用户与 View 之间产生交互，通过 View 发起一个 Action；Dispatcher 会把这个 Action 派发给 Store，通知 Store 进行相应的状态更新。Store 状态更新完成后，会进一步通知 View 去更新界面。这个过程我们会发现上面的都是单向的，因而也称之为数据单向流

Redux架构
整个Redux架构和Flux架构师非常相似的，只不过在Redux中，我们将Dispatcher改为了Reducer的函数，性质是类似的，都是负责对变化进行分发和处理，最终将数据返回给Store。Redux三部分如下：
- Store：它是一个单一的数据源，而且是只读的。

- Action 人如其名，是“动作”的意思，它是对变化的描述。

- Reducer 是一个函数，它负责对变化进行分发和处理，最终将新的数据返回给 Store。

![image](https://cdn.nlark.com/yuque/0/2020/png/158659/1608194864373-2f00fb72-bcb4-4321-9df9-017da67d4912.png)

在 Redux 的整个工作过程中，数据流是严格单向的。如果你想对数据进行修改，只有一种途径：派发 Action。Action 会被 Reducer 读取，Reducer 将根据 Action 内容的不同执行不同的计算逻辑，最终生成新的 state（状态），这个新的 state 会更新到 Store 对象里，进而驱动视图层面作出对应的改变。

这里其实Action和Store我们都很好理解，那么为啥需要一个Reducer层处理呢？不可以直接让action去改变store嘛？

我们看下redux官方文档对reducer命名的解释：
It's called a reducer because it's the type of function you would pass to [Array.prototype.reduce(reducer, ?initialValue)](https://link.zhihu.com/?target=https%3A//developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce)

这里想表达的应该是reducer和Array.prototype.reduce(reducer, ?initialValue)的回调属于相同的类型，关于reduce我们可以去看下[mdn reduce 文档](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce) 对其的介绍，reduce属于一种高阶函数，它将回调函数reducer递归到应用数组的所有元素上并返回一个独立的值，那么Redux的reducer在这里面的作用应该也是类似的，对传入的数据进行多次迭代的处理，后面会具体在分析下。
