---
title: "关于不可变数据的思考"
date: 2020-02-10
tags: ["语雀"]
source_kind: yuque
---

## 可变数据

直接上一个例子：有一个存储 h1、h2、h3 值的变量 rooms，我们将最后一个 rooms 里面的值改为 h4，然后 rooms 就发生了改变，新的值 h1、h2、h4 就存在变量 rooms 中。

```javascript
// Mutation
var rooms = ["h1", "h2", "h3"]
rooms[2] = "h4"
console.log(rooms) // ["h1", "h2", "h4"]
```

这种改变数据的操作在我们平时的写代码中很常见，但假如我们用到 rooms 的地方很多，有时候这个地方需要这样改变，那个地方又需要那样的去做改变，这样就容易乱七八糟的，因此我们想能不能每次用到 rooms 的时候不去改变 rooms，而是"复制一份 rooms"，去改变复制的值，其实这就是不可变数据啦。

## 不可变数据

我们来看看上面的一个例子用不可变数据，该去怎样做调整：

```javascript
// Immutation (good!)
var rooms = ["h1", "h2", "h3"]
var newRooms = rooms.map(room => {
  if (room === "h3") {
    return "h4"
  } else {
    return room
  }
})
console.log(newRooms) // ["h1", "h2", "h4"]
console.log(rooms)    // ["h1", "h2", "h3"]
```

我们可以看到这里我们运用了 map，给 map 传入一个函数，遍历数组中的每一个值，如果是 h3 就返回一个 h4，其他就正常返回，这样新的数组就是我们希望得到的 h1、h2、h4，同时原数组并未发生改变。

## 不可变数据的好处

可变数据应该是更符合我们的编程习惯一些，那么有没有什么不太好的地方呢？我们知道在一个复杂的前端项目中肯定会涉及到数据共享。

```javascript
const options = [{
  a: 1,
  b: 2
}]
init_person(options)
console.log(options)
```

上面的 demo 中我们并不知道 `init_person` 会不会去改变 options 里面的数据（假设这是别人写的一个模块的代码），那么等我第 6 行自己需要使用的时候，就不知道 options 有没有被改过，另外我如果改变了 options 也不知道会不会影响到别人，那么数据不可变这里就可以发挥作用了，就是对 options 拷贝一份再传给 `init_person`。

如果这里是用深拷贝又会涉及到一个性能的问题，我们知道 React 的 `shouldComponentUpdate` 对比新旧 state 的时候采用的其实是浅拷贝，也就是说如果团队可以约定我们不会改变深层的数据，实际上也是可以用浅拷贝来替代数据的复制过程的。
