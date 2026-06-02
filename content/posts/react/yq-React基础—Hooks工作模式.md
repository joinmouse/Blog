---
title: "React基础—Hooks工作模式"
date: 2021-01-01
tags: ["React", "Hooks"]
---

react官方文档对hooks说道，最基础的两个API是useState，useEffect这两个，一个处理函数组件的内部状态(可以理解为代替class组件中的state内部状态)，useEffect是处理副作用的，关于副作用上篇文章已经有写过，这是一种函数式编程的思想下的产物

1、useState：为函数组件引入状态
类组件
JSXCopy9912345678910111213141516171819202122232425import React, { Component } from "react";export default class TextButton extends Component {  constructor() {    super();    this.state = {      text: "初始文本"    };  }  changeText = () => {    this.setState(() => {      return {        text: "修改后的文本"      };    });  };  render() {    const { text } = this.state;    return (      <div className="textButton">        <p>{text}</p>        <button onClick={this.changeText}>点击修改文本</button>      </div>    );  }}函数组件
JSXCopy99123456789101112131415import React, { useState } from "react";export default function Button() {  const [text, setText] = useState("初始文本")    function changeText() {    return setText("修改后的文本")  }    return (    <div className="textButton">      <p>{text}</p>      <button onClick={changeText}>点击修改文本</button>    </div>  )}函数组件更简化，useState传入一个参数，返回两个参数(状态和修改状态的函数)，需要注意的是：状态和修改状态的 API 名都是可以自定义的

2、useEffect()：处理函数组件执行副作用
首先我们需要明确的一点是，当我们使用函数组件去编写组件的时候，就需要去忘记生命周期这样的一个概念，生命周期是class组件的产物。

还是先来看useEffect的API
JSXCopy9912345678910111213141516171819// 仅在挂载阶段执行useEffect(()=>{  // 这里是业务逻辑 }, [])
// 挂载阶段执行A的逻辑，卸载阶段执行B的return里面的内容useEffect(()=>{  // 这里是 A 的业务逻辑  // 返回一个函数记为 B  return ()=>{  }}, [])
// 第二个参数是一个数组(依赖项)，当数组某项内容发生改变时，会重新出发callback执行useEffect(()=>{  // 这是回调函数的业务逻辑   // 若 xxx 是一个函数，则 xxx 会在组件卸载时被触发  return xxx}, [num1, num2, num3])useEffect 的执行规决定：useEffect 回调中返回的函数被称为“清除函数”，当 React 识别到清除函数时，会在卸载时执行清除函数内部的逻辑。这个规律不会受第二个参数或者其他因素的影响，只要你在 useEffect 回调中返回了一个函数，它就会被作为清除函数来处理。

3、Why React-Hooks
为什么使用hooks，首先需要明确的是hooks是为了对函数组件的增强，那么why hooks？实际上对比的是函数组件+hooks同类组件+生命周期比起来的优缺点在那里

- 告别难以理解的 Class；
- 解决业务逻辑难以拆分的问题；
- 使状态逻辑复用变得简单可行；
- 函数组件从设计思想上来看，更加契合 React 的理念

3.1、告别难以理解的 Class
class的痛点在于： this指向
99123456789101112131415class Example extends Component {  state = {    name: '修言',    age: '99';  };  changeAge() {    // 这里会报错    this.setState({      age: '100'    });  }  render() {    return <button onClick={this.changeAge}>{this.state.name}的年龄是{this.state.age}</button>  }}this的指向十分的灵活，上面的代码我们一般通过bind或者ES6的箭头函数去解决这个问题，但本质上都是在用实践层面的约束来解决设计层面的问题，使用hooks我们就不需要考虑this的问题了

3.2、Hooks 如何实现更好的逻辑拆分
class中我们的逻辑会和生命周期有比较强的绑定关系
991234567891011121314componentDidMount() {  // 1. 这里发起异步调用  // 2. 这里从 props 里获取某个数据，根据这个数据更新 DOM    // 3. 这里设置一个订阅    // 4. 这里随便干点别的什么   // ...}componentWillUnMount() {  // 在这里卸载订阅}  componentDidUpdate() {  // 1. 在这里根据 DidMount 获取到的异步数据更新 DOM  // 2. 这里从 props 里获取某个数据，根据这个数据更新 DOM（和 DidMount 的第2步一样）}像这样的生命周期函数，它的体积过于庞大，做的事情过于复杂，会给阅读和维护者带来很多麻烦。最重要的是，这些事情之间看上去毫无关联，逻辑就像是被“打散”进生命周期里了一样。

而hooks，我们可以按照逻辑上的关联拆分进不同的函数组件里：我们可以有专门管理订阅的函数组件、专门处理 DOM 的函数组件、专门获取数据的函数组件等。Hooks 能够帮助我们实现业务逻辑的聚合，避免复杂的组件和冗余的代码。

3.3、状态复用：Hooks 将复杂的问题变简单
过去我们复用状态逻辑，靠的是 HOC（高阶组件）和 Render Props 这些组件设计模式，这是因为 React 在原生层面并没有为我们提供相关的途径。

Hooks 可以视作是 React 为解决状态逻辑复用这个问题所提供的一个原生途径。现在我们可以通过自定义 Hook，达到既不破坏组件结构、又能够实现逻辑复用的效果。

3.4、Hooks不足之处？
在认识到 Hooks 带来的利好的同时，还需要认识到它的局限性。React 仅仅是推崇函数组件，并没有“拉踩”类组件，甚至还官宣了“类组件和函数组件将继续共存”这件事情

- Hooks 暂时还不能完全地为函数组件补齐类组件的能力：比如 getSnapshotBeforeUpdate、componentDidCatch 这些生命周期，目前都还是强依赖类组件的。官方虽然立了“会尽早把它们加进来”的 Flag，但是说真的，这个 Flag 真的立了蛮久了……

- “轻量”几乎是函数组件的基因，这可能会使它不能够很好地消化“复杂”：我们有时会在类组件中见到一些方法非常繁多的实例，如果用函数组件来解决相同的问题，业务逻辑的拆分和组织会是一个很大的挑战。我个人的感觉是，从头到尾都在“过于复杂”和“过度拆分”之间摇摆不定，耦合和内聚的边界，有时候真的很难把握，函数组件给了我们一定程度的自由，却也对开发者的水平提出了更高的要求。

- 正是由于使用上的灵活，因而我们在Hooks 在使用层面需要有着严格的规则约束。

