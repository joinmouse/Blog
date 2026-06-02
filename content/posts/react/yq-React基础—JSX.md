---
title: "React基础—JSX"
date: 2021-01-01
tags: ["React", "JSX"]
---

JSX等同于Vue模板，Vue模板不是HTML，JSX也不是JS

## 一、JSX的本质
JSX到底是什么，引用React官网给出的定义
JSX 是 JavaScript 的一种语法扩展，它和模板语言很接近，但是它充分具备 JavaScript 的能力。

React给JSX 的定位是 JavaScript 的“扩展”，而非 JavaScript 的“某个版本”，这就直接决定了浏览器并不会像天然支持 JavaScript 一样地支持 JSX。那么，JSX 的语法是如何在 JavaScript 中生效的呢？React官方给出的是：
JSX 会被编译为 React.createElement()， React.createElement() 将返回一个叫作“React Element”的 JS 对象

这里提到JSX 在被编译后，会变成一个针对 React.createElement 的调用，这里编译的过程是由Babel去完成的，可以通过babel官方写入一段JSX代码，右边是编译后的内容

![image.png](https://cdn.nlark.com/yuque/0/2020/png/158659/1602603982949-7f8e1ed8-49e5-4006-96d2-5d4cadd511c9.png)

可以看到，所有的 JSX 标签都被转化成了 React.createElement 调用，这也就意味着，我们写的 JSX 其实写的就是 React.createElement，虽然它看起来有点像 HTML，但也只是“看起来像”而已。

JSX 的本质是React.createElement这个 JavaScript 调用的语法糖，这也就完美地呼应上了 React 官方给出的“JSX 充分具备 JavaScript 的能力”这句话

## 二、React选用JSX语法的动机
这里我们将说明为什么React要选用JSX?

其实回答这个问题并不难，前面说到JSX等价于React.createElement的调用，如果我们遇到一个相对复杂的的组件使用JSX和React.createElement调用区别如下：

![image](https://cdn.nlark.com/yuque/0/2020/png/158659/1602689798807-ab37c07f-9167-448e-b2f4-f43670f3eadc.png)

在功能一致的前提下，使用JSX更符合web开发的编码习惯(类HTML语法结构)，总结下：JSX 语法糖允许前端开发者使用我们最为熟悉的类 HTML 标签语法来创建虚拟 DOM，在降低学习成本的同时，也提升了研发效率与研发体验

## 三、JSX如何映射DOM(深入)
1、createElement解读
上面我们知道JSX是可以通过babel转化为createElement方法的，那么我们来看一下createElement干了什么
JavaScriptRun CodeCopy991234567891011121314151617181920212223242526272829/** 	React的创建元素方法*/
export function createElement(type, config, children) {  // propName 变量用于储存后面需要用到的元素属性  let propName; 
  // props 变量用于储存元素属性的键值对集合  const props = {}; 
  // key、ref、self、source 均为 React 元素的属性，此处不必深究  let key = null;  let ref = null;   let self = null;   let source = null; 
  // config 对象中存储的是元素的属性  if (config != null) {     // 进来之后做的第一件事，是依次对 ref、key、self 和 source 属性赋值    if (hasValidRef(config)) {      ref = config.ref;    }    // 此处将 key 值字符串化    if (hasValidKey(config)) {      key = '' + config.key;     }    self = config.__self === undefined ? null : config.__self;    source = config.__source === undefined ? null : config.__source;
我们先观察createElement函数的入参和出参数
可以发现入参的三个参数分别是：
- type：用于标识节点的类型。它可以是类似“h1”“div”这样的标准 HTML 标签字符串，也可以是 React 组件类型或 React fragment 类型。
- config：以对象形式传入，组件所有的属性都会以键值对的形式存储在 config 对象中。
- children：以对象形式传入，它记录的是组件标签之间嵌套的内容，也就是所谓的“子节点”“子元素”。

上面的流程可以总结出下面这样的一张图

![image](https://cdn.nlark.com/yuque/0/2020/png/158659/1602690874877-613c2e5e-7b51-4f22-a7ca-408a88b8ad09.png)

2、虚拟DOM节点：ReactElement解读
上面的过程我们知道createElement 执行到最后会 return 一个针对 ReactElement 的调用。
可以发现这段代码是很精减的，我们直接观察return element是一堆什么就好了
![image](https://cdn.nlark.com/yuque/0/2020/png/158659/1602691252848-0a2169dd-4c17-4a24-9bb7-6f05696d357d.png)

上面的就是element元素的信息，本质上以 JavaScript 对象形式存在的对 DOM 的描述，也就是我们常说的虚拟DOM节点，那么虚拟DOM又是如何到达DOM的呢，这就要引出ReactDOM整个库

3、从虚拟DOM到真实DOM
上面说到了虚拟DOM，那就意味着和渲染到页面上的真实 DOM 之间还有一些距离，这个“距离”，就是由大家喜闻乐见的ReactDOM.render方法实现的
我们可以看到只要提供一个虚拟DOM元素，和一个目标容器，然后去调用ReactDOM.render这个方法就可以将虚拟的DOM映射为真实的DOM
4、总结
