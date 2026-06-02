---
title: "模拟bind"
date: 2021-01-01
tags: ["JS深入浅出"]
---

## 1、bind介绍

按照MDN文档对bind的描述 [bind文档](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)
bind() 方法会创建一个新函数。当这个新函数被调用时，bind() 的第一个参数将作为它运行时的this，之后的一序列参数将会在传递的实参前传入作为它的参数。

bind函数有如下两个特点：
1、返回一个函数
2、传入的第一个参数就是调用函数的运行时this

## 2、基本版本模拟实现

先从一个例子看下bind的运行

```javascript
var foo = {
    value: 1
}
function bar() {
    console.log(this.value)
}
// 返回了一个函数
var bindFoo = bar.bind(foo)
bindFoo()  // 1
```

this的指向，我们可以通过call或者apply来实现，基础版本如下

```javascript
// 基础版本
Function.prototype.myBind = function(context) {
    // 此时this指向的是外部的d调用函数bar
    var self = this
    console.log(self)
    return function() {
        return self.call(context)
    }
}

// 测试代码
var foo = {
    value: 1
}
function bar() {
    console.log(this.value)
}
// 返回了一个函数
var bindFoo = bar.myBind(foo)
bindFoo()
```

## 3、考虑传参的处理

上面的基础版本没有考虑传入参数的时候该如何去处理，但是执行bind的时候我们是可能会传入函数参数的

```javascript
var foo = {
    value: 1
};
function bar(name, age) {
    console.log(this.value);
    console.log(name);
    console.log(age);
}

var bindFoo = bar.bind(foo, 'daisy')
bindFoo('18') // 1, daisy, 18
```

函数可能传入name和age两个参数，而且可能在bind的时候传入一个，在执行返回函数的时候，再传入另外一个参数.

```javascript
// 参数版本的处理
Function.prototype.myBind = function(context){
    // 1、通过获取外部调用函数
    var self = this
    // 2、获取bind函数的第二个参数到最后一个参数
    var args = Array.prototype.slice.call(arguments, 1)
    return function() {
        // 3、用apply将this指向传入的context, 合并参数
        let bindArgs = Array.prototype.slice.call(arguments)
        return self.apply(context, args.concat(bindArgs))
    }
}
```

## 4、完整版

完整版本中我们需要考虑下异常的处理情况

```javascript
Function.prototype.myBind = function(context){
    // 考虑异常处理
    if (typeof this !== "function") {
      throw new Error("Function.prototype.bind - what is trying to be bound is not callable")
    }
    // 1、通过获取外部调用函数
    var self = this
    // 2、获取bind函数的第二个参数到最后一个参数
    var args = Array.prototype.slice.call(arguments, 1)
    return function() {
        // 3、用apply将this指向传入的context, 合并参数
        let bindArgs = Array.prototype.slice.call(arguments)
        return self.apply(context, args.concat(bindArgs))
    }
}
```
