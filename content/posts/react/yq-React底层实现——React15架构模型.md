---
title: "React底层实现——React15架构模型"
date: 2021-01-01
tags: ["浏览器", "React", "Fiber"]
---

React15架构
- Reconciler(协调器)： 负责找出变化的组件
- Renderer(渲染器)： 负责将变化的组件渲染到页面上

Reconciler(协调器)
前面的基础部分我们知道，React可以通过this.setState、this.forceUpdate、ReactDOM.render等API触发更新，每当有更新发生的时候，Reconciler都会做如下的工作：

- 调用函数组件、或class组件的render方法，将返回的JSX转化为虚拟DOM(babel)
- 将虚拟DOM和上次更新时的虚拟DOM对比，通过对比找出本次更新中变化的虚拟DOM(diff算法)
- 通知Renderer将变化的虚拟DOM渲染到页面上(通知)

Reconciler(渲染器)
React支持跨平台，因而不同平台拥有不同的Renderer

- ReactDOM：渲染Web平台
- ReactNative：渲染App原生组件
- ReactTest：渲染出纯JS对象用于测试
- ReactArt：渲染Canvas, svg

当每次更新发生的时候，Renderer接收到Reconciler的通知，将变化的组件渲染到当前的宿主环境

React15架构的缺点
在Reconciler中，挂载的组件会调用mountComponent，更新的组件会调用updateComponent，这两个方法都会递归的去更新子组件。

递归的方式去执行一个组件的时候，更新一开始，中途就无法中断。这样当层级很深的时候，递归更新的时间过长(JS执行时间过长)就会导致用户交互上的卡顿，因而在React 16的架构中提出的解决办法是用——可中断的异步更新替代递归的同步更新

举例更新步骤如下：

![image](https://cdn.nlark.com/yuque/0/2020/png/158659/1604996026039-573425b5-8978-49ef-8bac-4d7258b53761.png)

Reconciler和Renderer交替工作，当页面第一个li发生变化时，第二个li再进入Reconciler，整个过程是同步的，因而用户看到的所有DOM是同时更新的。

现在模拟下中断更新(实际上React 15的架构并不会中断更新)：

![image](https://cdn.nlark.com/yuque/0/2020/png/158659/1604996244722-84f189a0-b22f-4b39-8b82-fbdde50add14.png)

当第一个li完成更新时中断更新，后面的步骤都没执行，这个时候用户期望是从123变成246，但是却看到的是不完整的DOM(即223)，因而有了16的Fiber架构。
