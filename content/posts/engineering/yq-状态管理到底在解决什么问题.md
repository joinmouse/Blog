---
title: "状态管理到底在解决什么问题"
date: 2026-06-01
tags: ["语雀"]
source_kind: yuque
---

状态管理是为了解决组件之间引⽤关系复杂之后带来的问题
暂时⽆法在⻜书⽂档外展示此内容
不要修改传⼊函数组件⾥⾯的pr ops(常识)！如果需要改变直接调⽤最近状态传⼊点的⽅法
在线代码（b ase）： https://codesandbox.io/s/epic-raman-t7pc2w?file=/src/App.js
在线代码 (更深的嵌套) : https://codesandbox.io/s/eager-christian-ebbpz1?file=/src/App.js
调⽤o nChange流程
暂时⽆法在⻜书⽂档外展示此内容
1、所有的状态放在⼀个全局的⼤对象中
2、全局提供统⼀的更新状态的⽅式(dispatch⽅法可以理解为Upd ateData)
暂时⽆法在⻜书⽂档外展示此内容
在线代码:  https://codesandbox.io/s/billowing-feather-bkwmuc?file=/src/store.js:367-374组件树 & 单向数据流
Redux
Redux是如何思考的const App = (props) => (&lt;Parent {...props} /&gt;)
const Parent = (props) => {
    return (
        <>
            &lt;ChildOne {...props} /&gt;
            &lt;ChildTwo {...props} /&gt;
        </>
    )
}
const ChildOne = (props) => (&lt;div&gt;{props.data}&lt;/div&gt;)
const ChildTwo = (props) => (&lt;div&gt;{props.data}&lt;/div&gt;)1
3
5
7
9
11
Plain Text

105我们将可以将数据状态可以分为这样⼏个抽象的思考：
1、获取数据
2、更新某个数据，同时通知订阅该数据的组件，你需要更新⾃⼰(发布订阅)
Redux常⽤A PI都是⼲嘛的，
注：A PI命名是⼈设计的，我们不需要过分在乎叫什么，更重要的是理解他做了什么，命名只是是为了统
⼀⼤家在交流时候的沟通成本，为什么我这⾥说这⼀点呢，因为r edux的命名真的很烂（很多时候不容易
理解的）
dispatch：redux提供的统⼀更新数据的 ⽅法名，我们可以理解为up dataData
action: 我们理解等待更新的newData即可
reducer: 规范n ewData更新的过程 (数据不可变)
store: ⼀个超⼤的对象，整个项⽬唯⼀的 数据对象
Provider: 放在最外层，使sto re作为全局的上下⽂的数据对象（re act-redux）
connect: 将全局唯⼀的数据源stor e和组件连接起来，同时当数据更新的时候会 通知组件重新渲染
没有状态管理下的⽅案：https: //codesandbox.io/s/clever-morning-q3dp97?file=/src/App.js
暂时⽆法在⻜书⽂档外展示此内容
Redux下不去c onnect订阅对应的变化的 数据就不会更新
https://codesandbox.io/s/billowing-feather-bkwmuc?file=/src/App.js
暂时⽆法在⻜书⽂档外展示此内容
本身并没有很好的处理⽅法，利⽤的是中间件：r edux-thunk/redux-promise/redux-saga，这⾥不展
开讲了，关于状态管理如何处理异步可以去了解RxJS 的思路
暂时⽆法在⻜书⽂档外展示此内容●
●
●
●
●
●
Redux精准更新的思路
Redux如何处理异步的
Mobx
Mobx是如何思考的

106在线代码：http s://codesandbox.io/s/boring-ritchie-p9hbjr?file=/src/App.js
Mobx API简单总结
@observable 让⼀个普通的变量变成响 应式的(可被m obx内监听的)
@action 更新n ewData时装饰函数⽤的
observer: 类似c onnect的功能，将sto re和组件连接起来，并且当组件内引⽤的响应式变量有更新的
时候会⾃动更新组件，同样可以实现精准更新
思路同r edux⼀样的
1、⽬前a ction更新⽅法⾥⾯，内部定义 ⼀个runInAction，忘记了会导致定义数据更新了组件不会更新
2、autorun，当数据更新的时候，可⾃ 动触发⼀些⽅法（可以是异步的）
问题，当异步嵌套过深/监听的autor un过多，其实并不是很好看出异步之间的联系，再次安利⼤家去了
解RxJS如何处理异步的思路
思考🤔
Q、状态管理mo bx、redux的共性(解决的问题)
A：⾸先将分散的 数据源、改变数据的⽅法从组件中抽出来了，即可以形成纯组件(内部不需要状态和⽅
法)，架构上就是将纯视图和数据状态做了⼀个分层化的处理。●
●
●
Mobx精准更新
Mobx如何处理异步的
总结下Mob x/Redux异同
状态管理
库数据源 更新数据 数据消费( 发布订
阅)处理异步的
⽅式
mobx⻚⾯/组件级对象
（局部）@action装饰的函数⽅
法（可变）observer(mobx-
react)autorun
redux全局唯⼀的对象
（全局）先调⽤d ispatch触发更
新，再在re ducer⾥规范
化的处理( 不可变)connect(react-
redux)中间件

107其次在数据消费端，⼀个⽤obse rver、⼀个⽤c onnect将数据和组件进⾏⼀个串联, 本质上都是发布订阅
模式的思路
Q、全局和局部的状态区别？
A：全局唯⼀的数据源：⽆法从根本上实 现数据源⻚⾯级别的隔离，每个不同的⻚⾯引⽤的时候最好加⼊
⼀个类似命名空间的东⻄来区分不同的数据（可参考d va），c onnect拿到全局的数据源时也应该需要做
⼀个filter处理。
⻚⾯/组件级的数据源：对于局部的状态， 原则上不相关的数据不要放⼀起（低耦合），相关的数据⼀定
要放在⼀起（⾼内聚）。
⽬前如果所有的数据放在⻚⾯，对于复杂⻚⾯会导致S tore内状态和对应更新状态的⽅法过多，且不利于
复⽤和维护；如果放在每个组件内，需要考虑将做好前⾯的原则基础上， 考虑组合/相互调⽤ 的问题，想
⼀下我们组件sto re和rootStore混乱的问题（需要去了解O OP的设计模式）
思考，为什么⽤mo bx⽤class，因为类是 将相关的数据和改变数据对应的⽅法聚合在⼀起的⼀种⽅式，
new⼀下就得到对应的对象，还有其他⽅ 式做到类似的聚合嘛？有，闭包(⾃定义h ooks得到相应的数据
和改变数据的⽅法也是基于此的哦)
在线代码：http s://codesandbox.io/s/vibrant-bhaskara-8nmqey?file=/src/App.js:329-337
对象是穷⼈的闭包，闭包是穷⼈的对象
Q、更新⽅式可变数据和不可变的区别？
A：可变数据更符合我们逻辑上更简单也 符合直觉，m obx每次this.value = newValue。
不可变数据需要我们⾃⼰每次有这样去要求⾃⼰，r edux中的reducer这个A PI就是为了让规范(约束)使⽤
者每次修改数据的时候做到不可变， 如果你要⽤数据不可变，你就必须要遵守他的约定，否则不要⽤ 。
Q、异步数据的处理
我觉得m obx和redux处理的并不好，⼀个需要引⼊额外的中间件，⼀个利⽤a utorun配合runInAction, 再
次推荐去了解Rx JS
基于h ooks的⽅案

108官⽹链接 https://zustand-demo.pmnd.rs/
在线代码：http s://codesandbox.io/s/dawn-leftpad-2rgq1x?file=/src/App.js
zustand采⽤的局部状态管理+不可变数据。基于观察者模式 。A PI 清晰简单，不需要c onnect、
observer做订阅Zustand

109