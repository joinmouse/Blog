---
title: "模拟new"
date: 2021-01-01
tags: ["JS深入浅出"]
---

## 1、构造函数

我们只知道在JS中普通函数和构造函数语法上几乎没有区别(为了更好的辨认我们一般规定构造函数的命名是首字母是大写的，实际上小写也是Ok的)，真正的区别还是在使用函数前面加了一个new这个关键字，就是构造函数啦。

举个例子：

```javascript
function Animal(name) {
  this.name = name;
}

Animal.prototype.sayName = function() {
  console.log("I am " + this.name)
}

var cat = new Animal('Tom')
console.log(cat.name) // Tom
console.log(cat.__proto__ === Animal.prototype) // true
cat.sayName() // I am Tom
```

## 2、实现一个基本的版本

通过上面的例子我们可以发现一下调用new会发现以下几个点

1. new操作符实例化了一个对象
2. 这个对象可以访问构造函数的属性
3. 这个对象可以访问构造函数原型上的方法(这个对象的_ proto_ 属性指向了构造函数的原型)

现在我们自己写一个newFunction方法来实现一下new做的事情，我们规定该函数传的第一个参数是构造函数的方法名，后面的参数是实例化传入的n个参数

```javascript
// new实现
// @param1: Function name
// @param2: ...arrayAny: any[]
function newFunction() {
  // 1、创建空对象
  let res = {}
  // 解析参数, 取第一个参数为构造函数名, 剩下的是传入的参数
  let constructor = Array.prototype.shift.call(arguments)
  // 2、使用apply执行构造函数，将构造函数的属性挂载到新对象res上
  constructor.apply(res, arguments)
  // 3、新的对象原型链链接到构造函数的原型上的方法
  res.__proto__ = constructor.prototype
  return res
}
```

上面的代码我们可以发现：`let constructor = Array.prototype.shift.call(arguments)` 是很巧妙的，关于call的使用我们可以去查看MDN上的文档 [Function.prototype.call](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/call) 可以发现第一个参数是this的指向，具体看下面这个例子

```javascript
var a = function(){
  console.log(this)       // 'littledu'
  console.log(typeof this)      //  Object
  console.log(this instanceof String)    // true
}
a.call('littledu')
```

可以看到call之后，将函数传入的第一个参数作为context传入到作用域中去了，改变了this的指向，我们可以推测下shift这个方法内部的实现

```javascript
Array.prototype.shift = function() {
  let res = new Array()
  // 取第1个的值
  res = this[0]
  // 原数组位置对调
  for(var i=1; i<this.length; i++) {
    this[i-1] = this[i]
  }
  this.length--
  return res
}
```

结合这两块内容，我们可以发现shift函数的内部通过call调用之后this的指向就是arguments了，这样就调用数组上的方法很好的对arguments做了一个切分取值

## 3、没考虑到构造函数return一个对象

首先我们还是看下new中对构造函数中return一个对象的的处理，其实我们也可以思考下为啥会构造函数为啥可以return一个对象呢，其实我们前面已经提到过构造函数本质上和普通函数在语法上没啥区别，那普通函数能return一个对象，构造函数当然也可以的呢。

```javascript
function Animal(name) {
  this.name = name
  return {
    prop: 'test'
  }
}

Animal.prototype.sayName = function() {
  console.log("I'm " + this.name)
}

var cat = new Animal('Tom')
console.log(cat.name)  //undefined
console.log(cat.prop)  //test
console.log(cat.__proto__ === Animal.prototype)  // false
console.log(cat.__proto__ === Object.prototype)  // true
```

接着我们翻下mdn上关于new在文档上的介绍：new 关键字会进行如下的操作

1. 创建一个空的简单JavaScript对象（即{}）
2. 链接该对象（设置该对象的constructor）到另一个对象
3. 将步骤1新创建的对象作为this的上下文
4. 如果该函数没有返回对象，则返回this

可以看到我们是需要在上面这块代码的基础上判断上构造函数是否返回了一个对象

## 4、处理构造函数return一个对象的情况

```javascript
function newFunction() {
  // 1、创建空对象
  let res = {}
  // 2、解析参数
  let constructor = Array.prototype.shift.call(arguments)
  // 3、链接构造函数内部的属性,其实就是执行下这个构造函数，但是把this指向res, 返回一个值
  let mayObj = constructor.apply(res, arguments)
  // 4、原型链上的挂载
  result.__proto__ = constructor.prototype
  // 判断是否返回了对象
  return mayObj instanceof Object ? mayObj : result
}

// 测试代码
function Animal(name) {
  this.name = name
  return {
    prop: 'demo'
  }
}

Animal.prototype.sayName = function() {
  console.log("I'm " + this.name)
}

var cat = newFunction(Animal, 'Tom')
console.log(cat.name)  //undefined
console.log(cat.prop)  //demo
console.log(cat.__proto__ === Animal.prototype)  // false
```

不过我们这里还有有点好奇，如果return返回的不是对象，而是一个基本类型，比如数字1会咋样，通过对new的测试发现是不用去处理的哈，毕竟new这边的定义也只是返回的是对象才处理，因而上面的代码基本是ok的

## 5、最终版

上面虽然都已经实现了，但是我们还有更好的一个优化的点，就是在第一个创建空对象的时候使用 `Object.create` 这个方法

## 6、总结

new的实现其实是基于JS里面的函数、this、原型/原型链的几个特性与一声，还是很值得我们去掌握它的，主要其实就是以下几个点

1. 创建一个新对象
2. 新对象要去链接到构造函数内部的属性
3. 新对象的原型链要挂载到构造函数的原型上
4. 判断构造函数是否返回的是对象，若是就返回该对象，否则返回新的对象
