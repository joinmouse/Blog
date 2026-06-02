---
title: "React基础—setState & batchUpdate"
date: 2021-01-01
tags: ["React"]
---

setState流程图
是否处于batch update
保存组件与dirtyComponents中
遍历所有的dirtyComponents调用updateComponent
更新 pending state or propsyesno
JavaScriptRun CodeCopy991234567891011121314151617181920212223242526272829// 异步更新class listDemo extends React.Component {	constructor(props){...}  render(){...}  increase = () => {  		// 开始: 处于batchUpdate      // isBatchUpdates = true    	this.setState({      		count: this.state.count + 1      })      // 结束      // isBatchUpdates = false  }}
// 同步更新, setTimeout逃逸              class listDemo extends React.Component {	constructor(props){...}  render(){...}  increase = () => {  		// 开始: 处于batchUpdate      // isBatchUpdates = true      setTimeout(() => {          // 此时: isBatchUpdates = false          this.setState({              count: this.state.count + 1          })      })      // 结束
1、setState 异步还是同步？

- setState无所谓异步还是同步，看是否命中的batchUpdate机制
- 依据：判断isBatchingUpdates

2、那些可以命中batchUpdate机制?

React可以"管理"的入口：
- 生命周期(和其调用的函数)
- React中注册的事件(和其调用的函数)

React"不能管理"的入口
- setTimeout
- 自定义事件

transaction 事务机制
![image.png](https://cdn.nlark.com/yuque/0/2021/png/158659/1613801045523-57303020-6a1f-4ec1-a827-ca701f15caf9.png)

- initialize对应的isBatchUpdate = false
- close 对应的isBatchUpdate = true
