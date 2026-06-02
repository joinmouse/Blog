---
title: "Vue组件中的data为什么必须是一个函数"
date: 2018-11-14
slug_jianshu: f3e774c57356
tags: []
state: open
source: "https://www.jianshu.com/p/f3e774c57356"
source_kind: jianshu
---
##### 1、从声明式渲染说起

vue文档在声明式渲染这一节中给了我们这样的一个[demo](https://cn.vuejs.org/v2/guide/index.html):

```
<div id="app">
  {{ message }}
</div>

var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!'
  }
})
```

在这个demo中data是一个对象，通过 new Vue 创建的 Vue 实例中，我们直接把data上的message属性通过模板渲染到页面上去了。

但是在文档上[Vue组件基础](https://cn.vuejs.org/v2/guide/components.html)这一节中却告诉我们：**一个组件的 data 选项必须是一个函数**  

data必须是一个函数

#### 2、为什么data必须是函数

为什么组件中data必须是一个函数了而不是对象, 我们首先来看一下第一个声明式渲染的demo中data我们只在当前页面的挂载的div#app这个点上使用，但是对于**组件**有一个很明显的特性是在于它是可以被复用的，好了知道了这一点我们以一个全局注册一个组件来分析

我们先假设将data作为一个对象:  
我们前面说组件是可以被复用的，那么注册了一个组件本质上就是创建了一个组件构造器的引用，而真正当我们使用组件的时候才会去将组件实例化，

```
// 创建一个组件
var Component= function() {
}
Component.prototype.data = {
  a: 1,
  b: 2
}

// 使用组件
var component1 = new Component()
var component2 = new Component()
component1.data.b = 3
component2.data.b   // 3
```

2018-11-14 11-56-56屏幕截图.png

我们可以发现当我们使用组件的时候，虽然data是在构造器的原型链上被创建的，但是实例化的component1和component2确是共享同样的data对象,当你修改一个属性的时候，data也会发生改变，这明显不是我们想要的效果。

```
var Component= function() {
}
Component.prototype.data = function() {
  return {
     a: 1,
     b: 2
  }
}

// 使用组件
var component1 = new Component()
var component2 = new Component()
component1.data.b = 3
component2.data.b   // 2
```

当我们的data是一个函数的时候，每一个实例的data属性都是独立的，不会相互影响了。你现在知道为什么vue组件的data必须是函数了吧。这都是因为js本身的特性带来的，跟vue本身设计无关

js本身的面向对象编程也是基于原型链和构造函数，应该会注意原型链上添加一般都是一个函数方法而不会去添加一个对象了
