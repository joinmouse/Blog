---
title: "React基础—Hooks动机"
date: 2021-01-01
tags: ["React", "Hooks"]
---

现在React API现在有两套，类(class) API和基于函数的钩子(hooks) API，分别对应的是以继承的方式去组织代码(class)or以组合的方式(hooks)，目前官方比较推荐的是使用组合的方式去组织代码

1、类组件和函数组件简介
类class是数据和逻辑的封装，也就是说组件的状态和操作是封装在一起的，选择类的写法那么相关的数据和操作都写在一个class里面

![image](https://cdn.nlark.com/yuque/0/2020/jpeg/158659/1601186072298-e3adbdab-4e5b-4c15-8adb-0b8f19cdafdf.jpeg)

类组件是面向对象编程思想的一种表征

封装： 将一类的属性和方法，聚拢到一个Class里面去
继承： 新的class可以通过现有的Class实现对某一类的属性和方法的复用
JavaScriptRun CodeCopy9912345678910111213141516171819202122import React from 'react'
class ClassComponent extends React.Component {	state = { number: 0 }		componentDidMount() {  	this.setState({    	number: 10    })  }
	render() {  	const { number } = this.state    return (    	<div>      	<p>Class Component State is {number}</p>      </div>    )  }}
export default ClassComponent
函数一般来说，只应该做一件事，就是返回一个值。如果你有多个操作，每个操作应该写成一个单独的函数。同时数据的状态与操作方法应该分离，React的函数组件应该就只做一件事件：获取数据返回HTML代码

![image](https://cdn.nlark.com/yuque/0/2020/jpeg/158659/1601186232614-eea35be0-0307-4d89-9879-14e3bd8e82ac.jpeg)

9912345678910111213function welcomeComponent(props) {	return <h1>Hello, {props.name}</h1>	}
const FunctionalComponent = ({ number = 10 }) => {	return (  	<div>     	<p>Class Component State is {number}</p>    </div>  )}
export default FunctionalComponent
props 和组合为你提供了清晰而安全地定制组件外观和行为的灵活方式。注意：组件可以接受任意props，包括基本数据类型，React元素以及函数。

如果你想要在组件间复用非 UI 的功能，我们建议将其提取为一个单独的 JavaScript 模块，如函数、对象或者类。组件可以直接引入（import）而无需通过 extend 继承它们

2、类组件和函数组件有何不同
相比类组件，函数组件肉眼可见的特质自然包括轻量、灵活、易于组织和维护、较低的学习成本等。但是更具 React 作者 Dan写过的一篇文章[函数式组件与类组件有何不同？](https://overreacted.io/zh-hans/how-are-function-components-different-from-classes/)的核心函数组件最大的特点在于
函数式组件捕获了渲染所用的值。（Function components capture the rendered values.）

可能这句话有点抽象，我们通过例子来看
这个组件返回的是一个按钮，交互内容也很简单：点击按钮后，过 3s，界面上会弹出“Followed value”的文案，为什么不是key呢，点击前传入的是key啊？

因为虽然 props 本身是不可变的，但 this 却是可变的，this 上的数据是可以被修改的，this.props 的调用每次都会获取最新的 props，而这正是 React 确保数据实时性的一个重要手段。

接下来我们来看函数组件
这是点击后发现还是key，props 会在 ProfilePage 函数执行的一瞬间就被捕获，而 props 本身又是一个不可变值，因此我们可以充分确保从现在开始，在任何时机下读取到的 props，都是最初捕获到的那个 props。

完整的例子可以直接参考这个在线demo:  [codeboxsand](https://codesandbox.io/s/classdifffunction-2mri4)

当父组件传入新的props来尝试渲染ProfilePage时，本质上是基于新的 props 入参发起了一次全新的函数调用，并不会影响上一次调用对一个props的捕获，这样一来，我们便确保了渲染结果确实能够符合预期。

现在我们可能更加的理解blog中Dan的这句话的含义，函数组件是一个更加匹配其设计理念、也更有利于逻辑拆分与重用的组件表达形式

2、副效应(作用)是什么？
如果纯函数只能进行计算，那么不涉及计算的操作(如生成日志、存储数据、改变应用状态)应该怎么处理？函数式编程将那些与数据无关的操作，都称为副效应(side effect)。

纯函数内部只有通过间接的手段(即通过其他函数调用，react中的hooks)，才能产生副效应

我们可以看到react希望用纯函数组件只做这样的一件事：将数据直接渲染到视图上

![image](https://cdn.nlark.com/yuque/0/2020/jpeg/158659/1601188615064-2de00bdb-758d-4b22-a530-8f9bd81688b2.jpeg)

在这个过程中和视图渲染无关的状态统一称之为副作用，引入hooks就是为了解决函数组件中对副效应的处理

总结下在React中：hooks(钩子)就是React函数组件的副效应解决方案，用来为函数组件引入副效应。函数组件的主体应该只用来返回组件的HTML代码，其他所有的操作都必须通过钩子引入

3、常见的钩子(hook)
由于副效应很多，对应的钩子也有很多种，React为许多常见的操作，都提供了专用的钩子

- useState()   保存状态
- useContext()  保存上下文
- useRef()  保存引用
- useEffect()  通用的副效应钩子

参考文章
组合 vs 继承：https://react.docschina.org/docs/composition-vs-inheritance.html
轻松学会React钩子：http://www.ruanyifeng.com/blog/2020/09/react-hooks-useeffect-tutorial.html
函数组件和类组件有何不同：https://overreacted.io/zh-hans/how-are-function-components-different-from-classes/
