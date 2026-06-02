---
title: "JavaScript 运行机制 (): this"
date: 2021-06-20
tags: []
source_kind: yuque
---

之前的文章写了词法作用域、作用域链以及闭包，这篇将写另外一个很重要的点就是 this，关于 this 其实之前也写了不少文章，这次还是从执行上下文的视角去看待 this。

还是先从一段代码说起：

```javascript
var bar = {
    myName: "demo1",
    printName: function () {
        console.log(myName)
    }
}
function foo() {
    let myName = "demo2"
    return bar.printName
}
let myName = "demo3"
let _printName = foo()
_printName()  // demo3
let _getName = bar.printName
_getName() // demo3
```

结合之前的文章，我们知道最后打印出来的结果是"demo3"，这是因为 JavaScript 语言的作用域是由词法作用域决定的，而词法作用域是由于代码结构来确定的。

但是有时候在对象内部的方法中使用内部的属性是一个非常常见的需求，但是 JavaScript 的作用域机制并不支持这样的一点，基于这个需求，JavaScript 于是创立了 this 机制。

对于 this，还是需要从执行上下文说起，前面的文章中分别介绍了执行上下文中包含变量环境、词法环境、外部环境，今天补上最后一环 this。

## 1、为什么需要 this

## 2、JavaScript 中的 this 是什么

this 是和执行上下文绑定的，也就是说每个执行上下文中都含有一个 this，执行上下文一般分为：全局执行上下文、函数执行上下文和 eval 执行上下文（用的不多，不会做过多介绍）。

### 2.1、全局执行上文中的 this

我们在控制台的环境中输入 `console.log(this)`，会发现最终输出的是 window 对象，也就是全局执行上下文的 this 是指向 window 对象的。

这也是 this 和作用域链的唯一交点，作用域链的最底端包含了 window 对象，全局执行上下文中的 this 也是指向 window 对象。

### 2.2、函数执行上文中的 this

接下来，我们就来重点分析函数执行上下文中的 this。还是先看下面这段代码：

```javascript
function foo(){
  console.log(this)
}
foo()
```

执行上面的代码我们会发现，打印的是 window 对象。这说明在默认情况下调用一个函数，其执行上下文中的 this 也是指向 window 对象的，那么我们是否可以改变 this 的指向呢？

## 3、通过 call 来彻底的理解 this 指向

理解 call 调用，我们先需要去看下 MDN 上关于 call 的文档：
https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/call

我们是可以通过 call 方法来设置函数执行上下文中的 this 指向的，比如：

### 3.1、全局环境下改变 this 指向

```javascript
let bar = {
  myName: "demo1",
  test1: 1
}
function foo(){
  console.log(this.myName)
}
foo()  // undefined
foo.call(bar)  // demo1
```

执行这段代码我们，发现使用 call 后 foo 函数内部的 this 已经指向了 bar 对象。

同时通过读 call 的文档我们知道，其实将第一个程序改写一下：

```javascript
function foo() {
  console.log(this)
}
foo()
foo.call()
foo.call(window)
```

通过在控制台打印的结果我们发现 `foo()` 函数的实际调用是 `foo.call(window)`，默认的话是将 this 指向了 window。

### 3.2、对象调用方法的 this 指向

```javascript
var myObj = {
  name: "demo1",
  showThis: function(){
    console.log(this)
  }
}
myObj.showThis()  // myObj
let obj = myObj.showThis
obj() // window
```

指向上面的代码我们会发现 this 指向的是 myObj，使用对象来调用内部的一个方法的时候，该方法的 this 是指向对象本身的，上面的代码等价于：

```javascript
myObj.showThis.call(myObj)
```

在全局环境中调用一个函数，比如 `obj()` 的时候，函数内部的 this 是指向全局变量 window 的：

```javascript
obj.call(window)
```

### 3.3、构造函数中 this 的指向

```javascript
function CreateObj(){
  this.name = "joinmouse"
}
var myObj = new CreateObj()
```

在这段代码中我们使用 new 创建了对象，但是此时构造函数 CreateObj 中的 this 到底指向了那里了？

其实当执行 `new CreateObj()` 的时候，JavaScript 引擎做了如下四件事：

1. 首先创建了一个空对象 tempObj
2. 调用 `CreateObj.call` 方法，并将 tempObj 作为 call 方法的参数，这样当 CreateObj 的执行上下文创建时，它的 this 就指向了 tempObj 对象
3. 然后执行 CreateObj 函数，此时的 CreateObj 函数执行上下文中的 this 指向了 tempObj 对象
4. 返回 tempObj 对象

```javascript
var tempObj = {}
CreateObj.call(tempObj)
return tempObj
```

这样通过一个 new 关键字创建了一个新对象，并且构造函数中的 this 其实就是新对象本身，具体可以参考下 MDN 上的 new 关键词文档：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/new

### 3.4、通过 this 来实现 JS 的继承机制

在一个子构造函数中，你可以通过调用父构造函数的 call 方法来实现继承，类似于 Java 中的写法。下例中，使用 Food 和 Toy 构造函数创建的对象实例都会拥有在 Product 构造函数中添加的 name 属性和 price 属性，但 category 属性是在各自的构造函数中定义的。

```javascript
function Product(name, price) {
  this.name = name;
  this.price = price;
}
function Food(name, price) {
  Product.call(this, name, price);
  this.category = 'food';
}
function Toy(name, price) {
  Product.call(this, name, price);
  this.category = 'toy';
}
var cheese = new Food('feta', 5);
var fun = new Toy('robot', 40);
```

## 4、this 的设计缺陷以及应对方案

this 是为了解决函数调用灵活性不足的问题，但是有些地方却有不少的坑。

### 4.1、嵌套函数中的 this 不会从外层函数继承

```javascript
var myObj = {
  name: 'demo',
  show: function() {
    console.log(this)
    function bar() {
      console.log(this)
    }
  }
}
myObj.show()
```

这段代码的 showThis 方法里面添加了一个 bar 方法，然后接着在 showThis 函数中调用了 bar 函数，那么现在的问题是：bar 函数中的 this 是什么？

我们会觉得 this 应该和其外层 show 函数中的 this 是一致的，都是指向 myObj 对象的，这很符合人的直觉。但是实际上，执行这段代码后，我们会发现函数 bar 中的 this 指向的是全局 window 对象，而函数 show 中的 this 指向的是 myObj 对象。这一点是非常让人迷惑的地方，需要我们注意。

解决的方式比较简单，我们可以在 show 函数声明一个变量 self 用来保存 this，然后 bar 函数中使用 self，代码如下：

```javascript
var myObj = {
  name: 'demo',
  show: function() {
    console.log(this)
    let self = this
    function bar() {
      self.name = 'demo2'
    }
    bar()
  }
}
myObj.show()
console.log(myObj.name) // demo2
```

执行这段代码，我们可以将外部的 this 传入到 bar 内部得到我们想要的结果。其实这个方式的本质是将 this 体系转化为作用域体系。

ES6 中我们使用箭头函数也可以解决这个问题：

```javascript
var myObj = {
  name: 'demo',
  show: function() {
    console.log(this)
    var bar = () => {
      this.name = 'demo2'
    }
    bar()
  }
}
myObj.show()
console.log(myObj.name) // demo2
```

ES6 的箭头函数并不会创建其自身的执行上下文，所以箭头函数中的 this 取决于它的外部函数，非常符合我们的预期，因而现在也被广泛的使用。

### 4.2、普通函数中的 this 默认指向全局对象 window

上面我们已经知道了，默认调用一个函数的时候，其执行上下文中的 this 是默认指向全局对象的 window。但是这样设计也有一种缺陷，因为实际的工作中我们并不希望函数执行上下文中的 this 默认指向全局对象，因为这样会打破数据的边界，造成一些误操作。如果要让函数执行上下文中的 this 指向某个对象，最好的方式是通过 call 方法来显示调用。

可以通过设置 JavaScript 在严格模式下解决这个问题，在严格模式下，默认执行一个函数，其函数的执行上下文中的 this 值是 undefined，就解决了上面的问题。
