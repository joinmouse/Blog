---
title: "Vue 3.0 响应式系统的实现"
date: 2021-01-01
tags: ["Vue", "响应式"]
---

![image](https://cdn.nlark.com/yuque/0/2019/jpeg/158659/1575448996857-110cfc85-78a4-49a3-a144-a32a9230bcaa.jpeg)

Vue3.0中响应式是一个独立的模块，完全可以脱离Vue而使用，上面这张图就是Vue3.0响应式系统的一个简版的流程，主要分为三个阶段：初始化阶段、依赖收集阶段和响应阶段

## 1、初始化阶段

从上图的初始化阶段我们可以看出主要就做了两件事情
- 将origin对象转换为响应式的Proxy实例化的对象state
- 将函数fn作为一个响应式的effect()函数

Vue3.0中使用了Proxy代替过去的Object.defineProperty(), 关于Proxy不懂的地方可以看我上面的两篇文章或参考mdn文档上的一些例子。

```javascript
import handler from './handler'
export function reactive(target) {
  const observed = new Proxy(target, handler)
  return observed
}
```

handler是改造getter和setter的关键，后面会分析的，这里我们先简单的知道如果将目标对象变为响应式对象就好了。

接下来就是函数fn()被effect()包裹后，会变成一个"响应式"effect()函数，而且同时fn()也会被立即执行一次。由于在 fn() 里面有引用到 Proxy 对象的属性，所以这一步会触发对象的 getter，从而启动依赖收集。对应的就是上图run执行时完成的动作

```javascript
// 传入函数fn作为参数
export function effect (fn) {
  // 构造一个 effect
  const effect = function effect(...args) {
    return run(effect, fn, args)
  }
  // 立即执行一次，会触发run函数
  effect()
  return effect
}

// effectStack是一个effect栈，是供后续的依赖收集使用的
export function run(effect, fn, args) {
  if (effectStack.indexOf(effect) === -1) {
    try {
      // 往池子里放入当前 effect
      effectStack.push(effect)
      // 立即执行一遍fn(), 执行过程会完成依赖收集，会用到 effect
      return fn(...args)
    } finally {
      // 完成依赖收集后从池子中扔掉这个 effect
      effectStack.pop()
    }
  }
}
```

## 2、依赖收集

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Tiny Reactive</title>
</head>
<body>
  <script type="module">
    import { reactive } from './src/reactive.js'
    import { effect } from './src/effect.js'

    window.state = reactive({
      count: 0,
      age: 18
    })

    const effect1 = effect(() => {
      console.log('effect1: ' + state.count)
    })

    const effect2 = effect(() => {
      console.log('effect2: ' + state.age)
    })

    const effect3 = effect(() => {
      console.log('effect3: ' + state.count, state.age)
    })
  </script>
</body>
</html>
```

这个阶段被触发的时间点，就是effect被立即执行后(run函数调用)，内部的fn()触发了Proxy对象的getter时候。

通过上面的代码我们知道fn其实就是

```javascript
() => {
  console.log('effect1: ' + state.count)
}
```

其实就是当执行state.count的语句的时候，就会触发state的getter。

依赖收集最重要的目的就是建立一份"依赖收集表"，对应上图的也就是"targetMap"，targetMap其实就是一个WeakMap， 关于WeakMap不熟悉的朋友可以去mdn上看看，其Key值是当前的Proxy对象state，value是depsMap

depsMap 是一个 Map，key 值为触发 getter 时的属性值（此处为 count），而 value 则是触发过该属性值所对应的各个 effect。

对应上面的例子就是下图这样的样子

![image](https://cdn.nlark.com/yuque/0/2019/webp/158659/1575525858259-7ff8c1e0-1449-49d5-b4a1-e7151ae0c2bd.webp)

核心就是target > key > dep 这样的一条链路

上图，依赖收集的建立就是通过track构造的targetMap，我们来分析下上面代码内部执行逻辑：

当getter触发的时候，会去createGetter函数 > track函数，"依赖收集表targetMap"是我们整个响应式系统的核心中的核心，弄明白十分的重要

## 3、响应阶段

上面的例子中，我们获取了{count: 0, age: 18}的Proxy，并构造了3个effect，运行的效果如下

![image](https://cdn.nlark.com/yuque/0/2019/webp/158659/1575527187321-31131125-3627-41ae-8fe5-6bbcc740ad12.webp)

整个运行的流程从上面的流程图我们可以看出是通过effects和computedEffects(计算属性)队列中，最后通过scheduleRun()执行里面的effect，也就有了上面的结果。

当我们修改某个属性的时候，会触发对应的setter。

当setter触发的时候，我们执行的顺序是setter > createSetter > trigger(target, 'set'/'add', key)。由于已经建立了依赖收集表，然后将他们推入effects和cumputedEffects计算属性的队列中，最后执行每个effect。

## 4、总结

Vue3.0的设计，让我对其新特性的运用和思路惊艳到了，这里参考的精简版Vue3.0的响应式系统的源码在下面。

https://github.com/jrainlau/tiny-reactive
