---
title: "关于不可变数据的思考"
date: 2020-02-10
tags: ["语雀"]
source_kind: yuque
---

直接上一个例子
有一个存储h1、h2、h3值得变量rooms，我们将最后一个rooms里面的值改为h4，然后rooms就发生了
改变，新的值h1、h2、h4就存在变量rooms中
这种改变的数据的操作在我们平时的写代码中很常见，但假如我们用到rooms的地方很多，有时候这个
地方需要这样改变，那个地方⼜需要那样的去做改变，这样就容易乱七八糟的，因此我们想能不能每次
用到rooms的时候不去改变rooms，而是"复制一份rooms"，去改变复制的值，其实这就是不可变数据
啦
我们来看看上面的一个例子用不可变数据，该去怎样做调整可变数据
不可变数据// Mutation
var rooms = ["h1", "h2", "h3"]
rooms[2] = "h4"
console.log(rooms)  // ["h1", "h2", "h4"]1
JavaScript

293我们可以看到这里我们运用了map，给map传入一个函数，遍历数组中的每一个值，如果是h3, 就返回
一个h4,其他就正常返回，这样新的数组就是我们希望得到的h1、h2、h4，同时原数组并未发生改变。
可变数据应该是更符合我们的编程习惯一些，那么有没有什么不太好的地方呢？我们知道在一个复杂的
前端的项目中肯定会涉及到数据共享
上面的demo中我们并不知道init_person会不会去改变option里面的数据(假设这是别人写的一个模块的
代码)，那么等我第6行我自己需要使用的时候，就不知道options有没有被改过，另外我如果改变了
options也不知道会不会影响到别人，那么数据不可变这里就可以发挥作用了，就是对options拷贝一份
再传给init_person。
如果这里是用深拷贝⼜会涉及到一个性能的问题，我们知道react的shouldComponetUpdate对比新旧
state的时候采用的其实是浅拷贝，也就是说如果团队可以约定我们不会改变深层的数据，实际上也是可
以用浅拷贝来替代数据的复制过程的。不可变数据的好处// Immutation(good!)
var rooms = ["h1", "h2", "h3"]
var newRooms  = rooms.map(room => {
if(room === "h3") {
    return "h4"
  }else {
  return room
  }
})
console.log(newRooms )  // ["h1", "h2", "h4"]
console.log(rooms)  // ["h1", "h2", "h3"]1
JavaScript
const options = [{
a: 1,
  b: 2
}]
init_person (options)
console.log(options)1
JavaScript
