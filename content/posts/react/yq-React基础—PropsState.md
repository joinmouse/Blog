---
title: "React基础—Props/State"
date: 2021-01-01
tags: ["React"]
---

在React中，我们通过组件将UI拆分为独立可服用的代码片段，State我们可以理解为组件内部的唯一表示状态，Props为外部传入组件内部的值。组件从概念类似于JavaScript函数，可以接入外部参数"Props"，"State"就是函数内部声明的变量由我们去维护

1、Props
定义组件最简单的方式就是编写 JavaScript 函数
JSXCopy912345import React from 'react'
function welCome(props){	return <h1>Hello, {props.name}</h1>}上面就是一个简单的函数组件，接受参数Props，就可以生成一个UI，我们也可以用类组件来定义上面的组件
JSXCopy9912345678910import React from 'react'
class WelCome extends React.Component {  constructor(props) {  	super(props)  }	render() {  	return  <h1>Hello, {this.props.name}</h1>  }}需要注意的一个点是组件无论是函数组件还是类组件，都不能去修改Props，也就是应该是一个"纯函数"
JSXCopy9123456789// sum不改变自己的入参function sum(a, b) {  return a + b;}
// 试图内部去修改自己的传入的参数function withdraw(account, amount) {  account.total -= amount;}下面是React官网对Props限制的描述

React非常灵活，但是它也有一个严格的限制：所有 React 组件都必须像纯函数一样保护它们的 props 不被更改

2、State
上面提到外部传入组件的Props不能被修改，那么我们要动态的处理UI，就是通过State这个状态管理的，State 允许 React 组件随用户操作、网络响应或者其他变化而动态更改输出内容

JSXCopy9912345678910111213141516171819202122232425262728// 定义一个时钟组件, 每隔1s刷新class Clock extends React.Component {  constructor(props) {    super(props)    this.state = {      date: new Date()    }    this.handleClick = this.handleClick.bind(this)  }	  // 获取当前时间  handleClick() {  	this.setState({    	data: new Date()    })  }  	render() {    let { data } = this.state    return (      <div>        <h1>Hello, world!</h1>        <h2>It is {date.toLocaleTimeString()}.</h2>        <button onClick={this.handleClick}>获取当前时间</button>      </div>    )  }}
正确的使用State
1、不要直接修改State，使用setState
91234567//wrongthis.state.comment = 'hello'
//correctthis.setState({  {comment: 'hello'}})2、state更新可能是异步的
出于性能考虑，React 可能会把多个setState调用合并成一个调用。

因为 this.props 和 this.state 可能会异步更新，所以你不要依赖他们的值来更新下一个状态。

可以让setState()接受一个函数而不是一个对象，函数用上一个 state 作为第一个参数，将此次更新被应用时的 props 做为第二个参数
9123456789// Wrongthis.setState({  counter: this.state.counter + this.props.increment,})
// Correctthis.setState((state, props) => ({  counter: state.counter + props.increment}));
3、state的更新会被合并

3、Form & 受控组件
React中，表单Form和其他DOM元素有所不同，表单元素中通常会保存一些内部的state，例如常用的input输入框自己可以定义一个内部的value，value值是依据用户输入来进行更新的。而React中内部的状态只能保存在State中，并且只能通过setState来更新。

我们可以把两者结合起来，使 React 的 state 成为“唯一数据源”。渲染表单的 React 组件还控制着用户输入过程中表单发生的操作。被 React 以这种方式控制取值的表单输入元素就叫做"受控组件"。

在HTML中，表单元素还需要注意的有<textarea> 和 <select>

