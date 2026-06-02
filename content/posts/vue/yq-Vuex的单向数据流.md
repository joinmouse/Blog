---
title: "Vuex的单向数据流"
date: 2021-01-01
tags: ["Vue", "Vuex"]
---

![image](https://cdn.nlark.com/yuque/0/2019/png/158659/1575614685165-4dd1c207-3576-42f3-8b9f-e31f54c4503a.png)

Vuex和全局对象管理的不同：
1、Vuex的状态存储是响应式的，当Vue组件从store中读取状态的时候，若store中的状态发生变化，那么对应的组件也会相应的得到高效更新

2、你不可以直接改变store中的状态。改变store中的状态唯一的途径是显示的提交(commit)mutation。这样方便跟踪每一个状态的变化，从而实现一些工具帮助我们更好的理解应用

JavaScriptRun CodeCopy99123456789101112131415161718192021222324252627const store = new Vuex.Store({	state: {  	count: 0  },  // 提交必须经过mutations  mutations: {  	increment(state){      // 变更状态    	state.count += 1    }  },  // Action可以包含任何异步操作  actions: {  	increment(context) {      setTimeout(() => {      	context.commit('increment')      }, 1000)    }  }})
// 同步store.commit('increment')console.log(store.state.count)  // 1
// 异步store.dispatch('increment')
同步操作
view ——> commit ——> mutations ——> state变化 ——> view变化

异步操作
view ——> dispatch ——> actions ——> mutations ——> state变化 ——> view变化
