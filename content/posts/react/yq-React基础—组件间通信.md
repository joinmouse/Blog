---
title: "React基础—组件间通信"
date: 2021-01-01
tags: ["React"]
---

1、基于Props单向数据流
组件，从概念上将类似于JavaScript函数，它接受任意的入参(props)，并返回用于描述页面展示内容的React元素(React Eelment)

单向数据流是指的： 当前组件的state以props形式流动时，只能流向组件数比自己层级更低的组件。比如在父-子组件这种嵌套关系中，只能由父组件传 props 给子组件

2、父子组件通信
我们知道父组件给子组件传值可以通过props流下去就好，子组件给父组件传值如下：
JSXCopy9912345678910111213141516171819202122232425262728293031323334// Childclass Child extends React.Component {  // 初始化子组件的 state  state = {    text: '子组件的文本'  }  	// 子组件的按钮监听函数  changeText = () => {    //changeText中，调用了父组件传入的 changeFatherText 方法    this.props.changeFatherText(this.state.text)  }
  render() {    return (      <div className="child">        {/* 注意这里把修改父组件文本的动作放在了 Child 里 */}        <button onClick={this.changeText}>          点击更新父组件的文本        </button>      </div>    )  }}
// Father.jsclass Father extends React.Component {  // 初始化父组件的 state  state = {    text: "初始化的父组件的文本"  }	  // 这个方法会作为 props 传给子组件，  //用于更新父组件 text 值。newText 正是开放给子组件的数据通信入口
3、兄弟组件通信
有了前面的父子组件通信的逻辑后，对于兄弟组件的传值我们思路可以如下：

![image](https://cdn.nlark.com/yuque/0/2020/png/158659/1603438470753-6aced891-4859-42d7-8d6d-843a19a19c33.png)

9912345678910111213141516171819202122232425262728293031// NewChild.jsclass NewChild extends React.Component {  state = {    text: "来自 newChild 的文本"  }  	// NewChild 组件的按钮监听函数  changeText = () => {  	// changeText 中，调用了父组件传入的 changeFatherText 方法    this.props.changeFatherText(this.state.text);  }    render() {    return (      <div className="child">        {/* 注意这里把修改父组件文本（同时也是 Child 组件的文本）的动作放在了NewChild里 */}        <button onClick={this.changeText}>点击更新 Child 组件的文本</button>      </div>    )  }}
// Father.jsclass Father extends React.Component {  // 初始化父组件的 state  state = {    text: "初始化的父组件的文本"  }  	// 传给 NewChild 组件按钮的监听函数,	// 用于更新父组件 text 值（这个 text 值同时也是 Child 的 props）对于兄弟组件我们还可以使用props去传递值，但是如果嵌套的层级很深，用props一层层传递下去的话就会显的很乱。

4、利用“发布-订阅”模式驱动数据流
"发布-订阅"模式在解决通信类问题上十分的常见，比如
- socket.io 模块，它就是一个典型的跨端发布-订阅模式的实现
- Node.js 中，许多原生模块也是以 EventEmitter 为基类实现的
- Vue.js 中作为常规操作被推而广之的"全局事件总线"EventBus

发布-订阅的有点在于：监听事件的位置和触发事件的位置是不受限的，这样对于我们跨组件之前的通信就显的十分的方便，逻辑上也很清晰

出发布-订阅模式中有两个关键的动作：事件的监听（订阅）和事件的触发（发布），这两个动作自然而然地对应着两个基本的 API 方法
- on：负责注册事件的监听器，指定事件触发时的回调函数
- emit：负责触发事件，可以通过传参使其在触发的时候携带数据
- off：负责监听器的删除

使用到组件中逻辑关系如下：

![image](https://cdn.nlark.com/yuque/0/2020/png/158659/1603440884025-4016f94b-c956-43ae-9281-13e4e4dc396b.png)

5、总结
- 使用基于 Props 的单向数据流串联父子、兄弟组件
- 利用“发布-订阅”模式驱动 React 数据在任意组件间流动
