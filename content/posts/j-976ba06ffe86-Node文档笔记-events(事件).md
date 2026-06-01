---
title: "Node文档笔记-events(事件)"
date: 2017-09-24
slug_jianshu: 976ba06ffe86
tags: ["简书"]
state: open
source: "https://www.jianshu.com/p/976ba06ffe86"
source_kind: jianshu
---
### 1、events(事件)

对于大多数的Node.js核心API采用的是异步事件驱动的架构，其中某些类型的对象(触发器)会周期性的触发命名事件来调用函数对象(监听器)，**下面看一个例子：**

```
//引入events事件模块，myEmitter对象继承EventEmitter类
const EventEmitter = require('events');
class MyEmitter extends EventEmitter {}

//eventEmitter.on() 方法用于注册监听器，eventEmitter.emit() 方法用于触发事件，这两个事件一般配合使用
const myEmitter = new MyEmitter();
myEmitter.on('event', () => {
  console.log('触发了一个事件！');
});
myEmitter.emit('event');
```

### 2、监听器传入参数与this

`eventEmitter.emit()方法`允许将任意参数传给监听器函数`eventEmitter.on()`.当一个普通的监听函数被EventEmitter调用时，标准的this关键词将被设置指定监听器所附加的 EventEmitter.

```
const myEmitter = new MyEmitter()

myEmitter.on('event', function(a, b) {
   console.log(a, b, this);
});
myEmitter.emit('event', 'a', 'b');

console打印：
       a b MyEmitter {
         domain: null,
         _events: { event: [Function] },
         _eventsCount: 1,
         _maxListeners: undefine   //最大监听器数目为10个
       }
```

使用ES6的箭头函数作为监听器，此时this不再指向EventEmitter实例

```
const myEmitter = new MyEmitter();

myEmitter.on('event', (a, b) => {
  console.log(a, b, this);
   // 打印: a b {}
});
myEmitter.emit('event', 'a', 'b');
```

### 3、异步与同步

EventListener会按照监听器的顺序同步的调用所有监听器，所以可确保事件的正确顺序且避免竞争条件或逻辑错误。监听器函数可以使用 `setImmediate()`或者`process.nextTick()` 方法切换到异步操作模式：

```
const myEmitter = new MyEmitter();

myEmitter.on('event', (a, b) => {
  setImmediate(() => {
    console.log('这个是异步发生的');
  });
});

myEmitter.emit('event', 'a', 'b');
```

### 4、只处理事件一次

当使用`eventEmitter.on()`方法注册监听器的时候，监听器会在每次触发命名事件时被调用。

```
const myEmitter = new MyEmitter();
let m = 0;
myEmitter.on('event', () => {
  console.log(++m);
});
myEmitter.emit('event');
// 打印: 1
myEmitter.emit('event');
// 打印: 2
```

使用eventEmitter.once() 方法时可以注册一个对于特定事件最多被调用一次的监听器。 当事件被触发时，监听器会被注销，然后再调用。

```
const myEmitter = new MyEmitter();
let m = 0;
myEmitter.once('event', () => {
  console.log(++m);
});
myEmitter.emit('event');
// 打印: 1
myEmitter.emit('event');
// 忽略
```

### 5、错误事件

当EventEmitter实例中发生错误时，将触发一个 'error' 事件。**如果 EventEmitter 没有为 'error' 事件注册至少一个监听器，则当 'error' 事件触发时，会抛出错误、打印堆栈跟踪、且退出 Node.js 进程。**故而最佳实践为，应该始终为'error'事件注册监听器。

```
const myEmitter = new MyEmitter()

myEmitter.on('error', (err) = > {
  console.error('have error')
})

myEmitter.emit('error',new Error( 'whoop!' ))
//打印: have error
```
