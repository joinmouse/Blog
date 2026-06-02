---
title: "React基础—生命周期"
date: 2021-01-01
tags: ["React"]
---

其实整个React中最核心的就是组件和虚拟DOM，组件的阶段一般可以分为挂载(初始化)、更新、卸载这三个阶段，对应的也就是一个组件的生命周期，我们先看下组件的初始化和更新阶段
上面说到组件的生命周期可以分为: 挂载、更新、卸载三个阶段，下图所示：

![image](https://cdn.nlark.com/yuque/0/2020/png/158659/1603207768518-c09fc5e8-ba99-4a4c-adc6-579120dd24ed.png)

相信其他的阶段都很好理解，我们这边重点看一下componentWillReceiveProps、shouldComponentUpdate这两个API

componentWillReceiProps 到底是由什么触发的？
从图中我们知道，父组件触发的更新和组件自身的更新相比多个一个这个方法
JSXCopy91componentWillReceiveProps(nextProps)nextProps表示父组件传入的新的props，通过和现有的props（我们可以通过this.props拿到）对比就可以去感知props的变化了，需要注意的是父组件可以修改了其他的内部state(与传入子组件的props无关)，也会触发这个API，因而我们需要去合适的对比，避免子组件被重复的渲染

![image](https://cdn.nlark.com/yuque/0/2020/png/158659/1603208625644-43ac85c3-f6a3-4e96-a80b-777d39532d4f.png)

总结：componentReceiveProps 并不是由 props 的变化触发的，而是由父组件的更新触发的

render与性能：初识shouldComponentUpdate
render 方法由于伴随着对虚拟 DOM 的构建和对比，过程可以说相当耗时，而在 React 当中，很多时候我们会不经意间就频繁地调用了 render。

为了避免不必要的 render 操作带来的性能开销，React 为我们提供了shouldComponentUpdate 这个API
React 组件会根据 shouldComponentUpdate 的返回值，来决定是否执行该方法之后的生命周期，进而决定是否对组件进行re-render（重渲染）。shouldComponentUpdate 的默认值为 true，也就是说“无条件 re-render”。在实际的开发中，我们往往通过手动往 shouldComponentUpdate 中填充判定逻辑，或者直接在项目中引入 PureComponent 等最佳实践，来实现“有条件的 re-render”。

组件更新
我们可以组件的更新分为两种类型，一种是组件内部的状态变化导致的更新，这个阶段主要触发的流程是：
![image.png](https://cdn.nlark.com/yuque/0/2020/png/158659/1603262897314-fadc267e-6558-41e3-8baf-9d524071debf.png)

还有一种是外部父组件内部状态变化导致的组件更新：
![image.png](https://cdn.nlark.com/yuque/0/2020/png/158659/1603262995614-aa904893-547a-4a29-a3c7-9a6b2293055a.png)

