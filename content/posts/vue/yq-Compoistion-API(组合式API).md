---
title: "Compoistion API(组合式API)"
date: 2021-01-01
tags: ["Vue", "Composition API"]
---

动机
- 更好的逻辑复用和代码组织
- 更好的类型推导(TypeScript)

设计细节
1、响应式状态和副作用
创建一个响应式状态
JavaScriptRun CodeCopy9123456import { reactive } from 'vue'
// state 现在是一个响应式的状态const state = reactive({  count: 0,})视图会在响应式状态发生改变的时候去自动更新，状态改变过程中除了视图更新以外的变化我们可以称之为"副作用"，我们可以使用 watchEffect API应用基于响应式状态的副作用
JavaScriptRun CodeCopy9912345678910import { reactive, watchEffect } from 'vue'
const state = reactive({  count: 0,})
// 副作用watchEffect(() => {  document.body.innerHTML = `count is ${state.count}`})
watchEffect接受一个应用预期的副作用，它会立即执行该函数，并在执行过程中将用到的响应式状态property作为依赖进行追踪。

这里的 state.count 会在首次执行后作为依赖被追踪。当 state.count 未来发生变更时，里面这个函数又会被重新执行。(Vue内部处理的)

添加入页面模板内容
JavaScriptRun CodeCopy9912345678910111213141516171819202122import { reactive, watchEffect } from 'vue'
const state = reactive({  count: 0,})
function increment() {  state.count++}
const renderContext = {  state,  increment,}
watchEffect(() => {  // 假设的方法，并不是真实的 API  renderTemplate(    `&lt;button @click="increment"&gt;{{ state.count }}&lt;/button&gt;`,    renderContext  )})
2、计算状态与Ref
Vue提供了computed API直接创建一个计算值，当我们需要一个其他状态的状态时候，就可以通过计算属性来获取
91234567import { reactive, computed } from 'vue'
const state = reactive({  count: 0,})
const double = computed(() => state.count * 2)猜测computed的实现
912345678// 伪代码function computed(getter) {  let value  watchEffect(() => {    value = getter()  })  return value}但是当value是一个基础类型值的时候，比如number，当其被返回的时候，它与这个 computed 内部逻辑之间的关系就丢失了！这是由于 JavaScript 中基础类型是值传递而非引用传递

通过ref包裹成对象返回
9123456789function computed(getter) {  const ref = {    value: null,  }  watchEffect(() => {    ref.value = getter()  })  return ref}
计算属性后的值也是响应式的
91234567const double = computed(() => state.count * 2)
watchEffect(() => {  console.log(double.value)}) // -> 0
state.count++ // -> 2使用ref来实现模板渲染
9912345678910111213141516171819import { ref, watchEffect } from 'vue'
const count = ref(0)
function increment() {  count.value++}
const renderContext = {  count,  increment,}
watchEffect(() => {  renderTemplate(    `&lt;button @click="increment"&gt;{{ count }}&lt;/button&gt;`,    renderContext  )})
3、组件的使用方式
上面的代码只运行一次，无法重用。如果我们想注重逻辑，可以重构一个函数，通过setup返回
9912345678910111213141516171819202122232425262728import { reactive, computed, watchEffect } from 'vue'
function setup() {  const state = reactive({    count: 0,    double: computed(() => state.count * 2),  })
  function increment() {    state.count++  }
  return {    state,    increment,  }}
const renderContext = setup()
watchEffect(() => {  renderTemplate(    `&lt;button @click="increment"&gt;      Count is: {{ state.count }}, double is: {{ state.double }}    &lt;/button&gt;`,    renderContext  )})上面的代码并不依附于组件的实例而存在，这样可以做到逻辑状态和视图之间良好的解耦。现在我们将调用setup、创建响应式对象和渲染模板组合在一起，交给框架去处理，就可以通过setup函数和模板来定义一个组件

4、全局import
Vue2.x里面的data、methos、computed等都是挂载在this上面的，有两个明显的缺点
- 不利于类型推导
- 一个项目中没用到computed功能，代码也会被打包

Vue3使用手动import写法更有利于Tree-shaking

代码组织

![image](https://cdn.nlark.com/yuque/0/2020/png/158659/1602497403401-85865c86-e941-4ba6-88db-cd1b18b8f631.png)

一种颜色代表一个功能，Vue2中我们修改或者新增一个功能，需要在data、methods、computed等地方修改代码，反复的横跳，十分不方便

Vue3中我们只需要修改一个地方的功能逻辑就好了，很好的解耦

[Vue2大组件](https://github.com/vuejs/vue-cli/blob/a09407dd5b9f18ace7501ddb603b95e31d6d93c0/packages/@vue/cli-ui/src/components/folder/FolderExplorer.vue#L198-L404)  Vs [Vue Compoistion API](https://github.com/shengxinjing/vue3-vs-vue2/blob/9ed3b855c55b5b102f75519cc57ea8571525871a/compostion-vs-option/compisition.vue)

逻辑提取与复用
追踪鼠标位置
使用

