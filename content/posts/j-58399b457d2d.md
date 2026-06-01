---
title: "ES6学习笔记——Symbol"
date: 2017-07-16
slug_jianshu: 58399b457d2d
tags: ["简书"]
state: open
source: "https://www.jianshu.com/p/58399b457d2d"
source_kind: jianshu
---
### 1、概述

ES5 的对象属性名都是字符串，这样有一个问题是容易造成属性名的冲突。比如，你使用了一个他人提供的对象，但又想为这个对象添加新的方法（mixin 模式），新方法的名字就有可能与现有方法产生冲突。  
如果有一种机制，保证每个属性的名字都是独一无二的就好了，这样就从根本上防止属性名的冲突，这就是 ES6 引入Symbol的原因。

ES6 引入了一种新的原始数据类型Symbol，表示独一无二的值。它是 JavaScript 语言的第七种数据类型，前六种是：undefined、null、布尔值（Boolean）、字符串（String）、数值（Number）、对象（Object）。

一般Symbol 值通过Symbol函数生成。这就是说，对象的属性名现在可以有两种类型，一种是原来就有的字符串，另一种就是新增的 Symbol 类型。**凡是属性名属于 Symbol 类型，就都是独一无二的，可以保证不会与其他属性名产生冲突。**

```
let s = Symbol();

typeof s     // "symbol"
```

在上面代码中，变量s就是一个独一无二的值。typeof运算符的结果，表明变量s是 Symbol 数据类型，而不是字符串之类的其他类型。

-   写一个有参数和无参数的Symbol的比较

```
// 没有参数的情况
var s1 = Symbol();
var s2 = Symbol();

s1 === s2 // false

// 有参数的情况
var s1 = Symbol('foo');
var s2 = Symbol('foo');

s1 === s2 // false
```

上面的代码，Symbol函数的参数只是表示对当前 Symbol 值的描述，因此相同参数的Symbol函数的返回值是不相等的。

### 2、作为属性名的Symbol

由于每一个 Symbol 值都是不相等的，这意味着 Symbol 值可以作为标识符，用于对象的属性名，就能保证不会出现同名的属性。这对于一个对象由多个模块构成的情况非常有用，能防止某一个键被不小心改写或覆盖，下面写出几种常见的使用方法

```
var mySymbol = Symbol();

// 第一种写法
var a = {};
a[mySymbol] = 'Hello!';        

// 第二种写法
var a = {
  [mySymbol]: 'Hello!'
};

// 第三种写法
var a = {};
Object.defineProperty(a, mySymbol, { value: 'Hello!' });
//使用Object.defineProperty，将对象的属性名指定为一个 Symbol 值。

// 以上写法都得到同样结果
a[mySymbol] // "Hello!"
```

-   需要注意的是：Symbol 值作为属性名时，该属性还是公开属性，不是私有属性。

以上只简单的写了一点关于Symbol的知识，[更多参考-阮一峰老师文章](https://link.jianshu.com?t=http://es6.ruanyifeng.com/#docs/symbol)
