---
title: "React生态——Redux核心原则"
date: 2021-01-01
tags: ["React", "Redux"]
---

Redux三大原则：单一数据源、State是只读的、使用纯函数来执行修改(reducers)

1、单一数据源
整个应用的state被存储在一颗Object tree中，并且整个Object tree只存在于唯一的一个store中

这让同构应用开发变得非常容易，来自服务端的 state 可以在无需编写更多代码的情况下被序列化并注入到客户端中。由于是单一的 state tree ，调试也变得非常容易。在开发中，你可以把应用的 state 保存在本地，从而加快开发速度。此外，受益于单一的 state tree ，以前难以实现的如“撤销/重做”这类功能也变得轻而易举。
TypeScriptRun CodeCopy991234567891011121314151617console.log(store.getState())
/* 输出{  visibilityFilter: 'SHOW_ALL',  todos: [    {      text: 'Consider using Redux',      completed: true,    },    {      text: 'Keep all state in a single tree',      completed: false    }  ]}*／2、State是只读的
唯一改变 state 的方法就是触发action，action 是一个用于描述已发生事件的普通对象。

这样确保了视图和网络请求都不能直接修改 state，相反它们只能表达想要修改的意图。因为所有的修改都被集中化处理，且严格按照一个接一个的顺序执行，因此不用担心竞态条件（race condition）的出现。 Action 就是普通对象而已，因此它们可以被日志打印、序列化、储存、后期调试或测试时回放出来。

TypeScriptRun CodeCopy9123456789store.dispatch({	type: "COMPLETE_TODO",  index: 1})
store.dispatch({  type: 'SET_VISIBILITY_FILTER',  filter: 'SHOW_COMPLETED'})
3、使用纯函数来进行修改
为了描述action如何改变state tree，需要编写纯函数reducers

Reducer 只是一些纯函数，它接收先前的 state 和 action，并返回新的 state。

TypeScriptRun CodeCopy99123456789101112131415161718192021222324252627282930function visibilityFilter(state = 'SHOW_ALL', action) {  switch (action.type) {    case 'SET_VISIBILITY_FILTER':      return action.filter    default:      return state  }}
function todos(state = [], action) {  switch (action.type) {    case 'ADD_TODO':      return [        ...state,        {          text: action.text,          completed: false        }      ]    case 'COMPLETE_TODO':      return state.map((todo, index) => {        if (index === action.index) {          return Object.assign({}, todo, {            completed: true          })        }        return todo      })    default:      return state
流程图如下：

![image](https://cdn.nlark.com/yuque/0/2021/webp/158659/1614748599062-6c8f8188-964b-4421-b3c3-ff72b6c85087.webp)
1 like

- ![joinmouse](https://cdn.nlark.com/yuque/0/2019/png/158659/1560488687824-avatar/bfe21c43-8448-4b33-acf8-a70bee99e258.png?x-oss-process=image%2Fresize%2Cm_fill%2Cw_64%2Ch_64%2Fformat%2Cpng)
1