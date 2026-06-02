---
title: "状态管理到底在解决什么问题"
date: 2022-08-20
tags: []
source_kind: yuque
---

状态管理是为了解决组件之间引用关系复杂之后带来的问题。

## 组件树 & 单向数据流

不要修改传入函数组件里面的 props（常识）！如果需要改变直接调用最近状态传入点的方法。

在线代码（base）：https://codesandbox.io/s/epic-raman-t7pc2w?file=/src/App.js
在线代码（更深的嵌套）：https://codesandbox.io/s/eager-christian-ebbpz1?file=/src/App.js

```text
const App = (props) => (&lt;Parent {...props} /&gt;)
const Parent = (props) => {
    return (
        <>
            &lt;ChildOne {...props} /&gt;
            &lt;ChildTwo {...props} /&gt;
        </>
    )
}
const ChildOne = (props) => (&lt;div&gt;{props.data}&lt;/div&gt;)
const ChildTwo = (props) => (&lt;div&gt;{props.data}&lt;/div&gt;)
```

调用 onChange 流程：

## Redux

### Redux 是如何思考的

1. 所有的状态放在一个全局的大对象中
2. 全局提供统一的更新状态的方式（dispatch 方法可以理解为 UpdateData）

在线代码：https://codesandbox.io/s/billowing-feather-bkwmuc?file=/src/store.js:367-374

我们将可以将数据状态可以分为这样几个抽象的思考：

1. 获取数据
2. 更新某个数据，同时通知订阅该数据的组件，你需要更新自己（发布订阅）

### Redux 常用 API 都是干嘛的

注：API 命名是人设计的，我们不需要过分在乎叫什么，更重要的是理解他做了什么，命名只是为了统一大家在交流时候的沟通成本，为什么我这里说这一点呢，因为 Redux 的命名真的很烂（很多时候不容易理解的）。

- **dispatch：** Redux 提供的统一更新数据的方法名，我们可以理解为 updateData
- **action：** 我们理解等待更新的 newData 即可
- **reducer：** 规范 newData 更新的过程（数据不可变）
- **store：** 一个超大的对象，整个项目唯一的数据对象
- **Provider：** 放在最外层，使 store 作为全局的上下文的数据对象（react-redux）
- **connect：** 将全局唯一的数据源 store 和组件连接起来，同时当数据更新的时候会通知组件重新渲染

### Redux 精准更新的思路

没有状态管理下的方案：https://codesandbox.io/s/clever-morning-q3dp97?file=/src/App.js

Redux 下不去 connect 订阅对应的变化的数据就不会更新：https://codesandbox.io/s/billowing-feather-bkwmuc?file=/src/App.js

### Redux 如何处理异步的

本身并没有很好的处理方法，利用的是中间件：redux-thunk / Redux-promise / Redux-saga，这里不展开讲了，关于状态管理如何处理异步可以去了解 RxJS 的思路。

## Mobx

### Mobx 是如何思考的

在线代码：https://codesandbox.io/s/boring-ritchie-p9hbjr?file=/src/App.js

### Mobx API 简单总结

- **@observable：** 让一个普通的变量变成响应式的（可被 mobx 内监听的）
- **@action：** 更新 newData 时装饰函数用的
- **observer：** 类似 connect 的功能，将 store 和组件连接起来，并且当组件内引用的响应式变量有更新的时候会自动更新组件，同样可以实现精准更新

### Mobx 精准更新

思路同 Redux 一样的。

### Mobx 如何处理异步的

1. 目前 action 更新方法里面，内部定义一个 `runInAction`，忘记了会导致定义数据更新了组件不会更新
2. `autorun`，当数据更新的时候，可自动触发一些方法（可以是异步的）

问题：当异步嵌套过深 / 监听的 autorun 过多，其实并不是很好看出异步之间的联系，再次安利大家去了解 RxJS 如何处理异步的思路。

## 总结下 Mobx/Redux 异同

| 状态管理库 | 数据源 | 更新数据 | 数据消费（发布订阅） | 处理异步的方式 |
|-----------|--------|---------|-------------------|-------------|
| Mobx | 页面/组件级对象（局部） | @action 装饰的函数方法（可变） | observer (mobx-react) | autorun |
| Redux | 全局唯一的对象（全局） | 先调用 dispatch 触发更新，再在 reducer 里规范化的处理（不可变） | connect (react-redux) | 中间件 |

## 思考

**Q、状态管理 Mobx、Redux 的共性（解决的问题）**

A：首先将分散的数据源、改变数据的方法从组件中抽出来了，即可以形成纯组件（内部不需要状态和方法），架构上就是将纯视图和数据状态做了一个分层化的处理。其次在数据消费端，一个用 observer、一个用 connect 将数据和组件进行一个串联，本质上都是发布订阅模式的思路。

**Q、全局和局部的状态区别？**

A：全局唯一的数据源——无法从根本上实现数据源页面级别的隔离，每个不同的页面引用的时候最好加入一个类似命名空间的东西来区分不同的数据（可参考 dva），connect 拿到全局的数据源时也应该需要做一个 filter 处理。

页面/组件级的数据源——对于局部的状态，原则上不相关的数据不要放一起（低耦合），相关的数据一定要放在一起（高内聚）。

目前如果所有的数据放在页面，对于复杂页面会导致 Store 内状态和对应更新状态的方法过多，且不利于复用和维护；如果放在每个组件内，需要考虑将做好前面的原则基础上，考虑组合/相互调用的问题，想一下我们组件 store 和 rootStore 混乱的问题（需要去了解 OOP 的设计模式）。

思考：为什么用 Mobx 用 class，因为类是将相关的数据和改变数据对应的方法聚合在一起的一种方式，new 一下就得到对应的对象，还有其他方式做到类似的聚合嘛？有，闭包（自定义 hooks 得到相应的数据和改变数据的方法也是基于此的哦）。

> 对象是穷人的闭包，闭包是穷人的对象

在线代码：https://codesandbox.io/s/vibrant-bhaskara-8nmqey?file=/src/App.js:329-337

**Q、更新方式可变数据和不可变的区别？**

A：可变数据更符合我们逻辑上更简单也符合直觉，Mobx 每次 `this.value = newValue`。不可变数据需要我们自己每次有这样去要求自己，Redux 中的 reducer 这个 API 就是为了让规范（约束）使用者每次修改数据的时候做到不可变，如果你要用数据不可变，你就必须要遵守他的约定，否则不要用。

**Q、异步数据的处理**

我觉得 Mobx 和 Redux 处理的并不好，一个需要引入额外的中间件，一个利用 autorun 配合 runInAction，再次推荐去了解 RxJS。

## 基于 hooks 的方案

### Zustand

官网链接：https://zustand-demo.pmnd.rs/

在线代码：https://codesandbox.io/s/dawn-leftpad-2rgq1x?file=/src/App.js

Zustand 采用的局部状态管理 + 不可变数据，基于观察者模式。API 清晰简单，不需要 connect、observer 做订阅。
