---
title: "JavaScript 运行机制 — 执行上下文"
date: 2021-02-15
tags: ["JS深入浅出"]
---

这篇文章主要介绍执行上下文相关的内容，只有理解了 JavaScript 的执行上下文，才能更好的理解 JavaScript 语言本身，比如后面的变量提升、作用域和闭包等。

使用过 JavaScript 开发的程序员应该都知道，JavaScript 是按顺序执行的。若按照这个逻辑来理解的话，那么：

1. 当执行到第 1 行的时候，由于函数 showName 还没有定义，所以执行应该会报错；
2. 同样执行第 2 行的时候，由于变量 myname 函数也未定义，所以同样也会报错。

但是实际的执行结果并非如此。

## 1、变量提升 (Hoisting)

```javascript
showName()
console.log(myname)
var myname = '极客时间'
function showName() {
    console.log('函数 showName 被执行');
}
```

之所以是上面这种情况是因为我们知道 JavaScript 中对函数声明和变量声明会有一个提升。

```javascript
var myname = '极客时间'
// 将上面的代码拆分成 2 行
var myname    // 声明部分
myname = '极客时间'  // 赋值部分
```

上面是变量的声明和赋值，下面我们来理解下函数的声明和赋值：

```javascript
function foo(){
  console.log('foo')
}

var bar = function(){
  console.log('bar')
}
```

第一个函数 foo 是一个完整的函数声明，也就是说没有涉及到赋值操作；第二个函数是先声明变量 bar，再把 `function(){console.log('bar')}` 赋值给 bar。

总结下：所谓的变量提升，是指在 JavaScript 代码执行过程中，JavaScript 引擎把变量的声明部分和函数的声明部分提升到代码开头的"行为"。变量被提升后，会给变量设置默认值，这个默认值就是我们熟悉的 undefined。

我们将最上面的代码可以分为声明部分和执行部分：

```javascript
/*
 * 变量提升部分
 */
// 把变量 myname 提升到开头，
// 同时给 myname 赋值为 undefined
var myname = undefined
// 把函数 showName 提升到开头
function showName() {
    console.log('showName 被调用');
}

/*
 * 可执行代码部分
 */
showName()  // showName 被调用
console.log(myname)   // undefined
// 去掉 var 声明部分，保留赋值语句
myname = '极客时间'
```

## 2、JavaScript 代码的执行流程

那么我们这里可能会好奇，为什么要把代码分为声明阶段和执行阶段，这就要从 JS 代码执行说起了，JS 代码在浏览器执行是先被编译，编译完成后再执行，大致流程如下：

"变量提升"意味着变量和函数的声明会在物理层面移动到代码的最前面，正如我们所模拟的那样。但，这并不准确。实际上变量和函数声明在代码里的位置是不会改变的，而且是在编译阶段被 JavaScript 引擎放入内存中。

我们前面将代码分为了声明阶段和执行阶段其实对应的就是 JS 引擎的编译阶段和执行阶段，以上面的代码为例，在 JS 引擎中执行如下所示：

从上图可以看出，输入一段代码，经过编译后，会生成两部分内容：执行上下文（Execution Context）和可执行代码。

### 2.1、编译阶段

执行上下文是 JavaScript 执行一段代码时的运行环境，比如调用一个函数，就会进入这个函数的执行上下文，确定该函数在执行期间用到的诸如 this、变量、对象以及函数等。

执行上下文中会存在一个变量环境对象（Viriable Environment），该对象中保存了变量提升的内容，比如上面代码中的变量 myname 和函数 showName，都保存在该对象中，可以简单的如下所示：

```javascript
VariableEnvironment:
     myname -> undefined,
     showName -> function: {console.log(myname)}
```

### 2.2、执行阶段

执行阶段就比较好理解了，就是依据编译阶段形成的执行上下文，去一行行的执行代码。

## 3、出现相同的变量或者函数

我们来分析上面的运行流程：

```javascript
function showName() {
    console.log('极客邦');
}
showName();
function showName() {
    console.log('极客时间');
}
showName();
```

1. 首先是编译阶段。遇到了第一个 showName 函数，会将该函数体存放到变量环境中。接下来是第二个 showName 函数，继续存放至变量环境中，但是变量环境中已经存在一个 showName 函数了，此时，第二个 showName 函数会将第一个 showName 函数覆盖掉。这样变量环境中就只存在第二个 showName 函数了。
2. 执行阶段。先执行第一个 showName 函数，但由于是从变量环境中查找 showName 函数，而变量环境中只保存了第二个 showName 函数，所以最终调用的是第二个函数，打印的内容是"极客时间"。

第二次执行 showName 函数也是走同样的流程，所以输出的结果也是"极客时间"。

总结：一段代码如果定义了两个相同名字的函数，那么最终生效的是最后一个函数。

站在 JS 引擎编译和执行的阶段去看变量/函数的声明和赋值对应起来，我们会发现对 JS 运行机制的理解更加深刻了。
