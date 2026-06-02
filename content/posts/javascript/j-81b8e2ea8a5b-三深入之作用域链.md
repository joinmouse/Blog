---
title: "三、深入之作用域链"
date: 2017-06-08
slug_jianshu: 81b8e2ea8a5b
tags: []
state: open
source: "https://www.jianshu.com/p/81b8e2ea8a5b"
source_kind: jianshu
---
#### 0x00、引言

其实在分析JS的作用链域我们可以采取一个思想就是：就近原则，下面我们通过一些例子来分析

### 0x01、从一个demo说起

先看一个之前变量提升中的例子

```
var a 
function b(){
  console.log(a)       //很明显我们通过变量提升知道，a为函数作用域内的a
  var a
}
```

> 那么就近原则又是指的什么了？其实我们只要理解这里的就近是**作用域的就近**就好了。很明显在上面的demo中有全局作用域的a和函数作用域的a,由于console.log(a)在函数的作用域内，所以这里的a就指的函数作用域弄内声明的变量a。  
> 那么如果上面的代码改成下面这样又该如何了?

```
var a 
function b(){
  console.log(a)       //函数作用域内没有声明a,就会在全局作用域去查找，那么这里的a指的就是全局作用域的变量a
}
```

#### 0x02、引入一个概念：词法作用域

我们还是接着上面的例子说起

```
var a 
function b(){
  console.log(a)       //这里我们并没有调用函数b，仅通过函数的声明就可以判断出这里待执行a是函数作用域内的a
  var a
}

```

> 其实上面已经把词法作用域的核心说透了，所谓词法作用域就是JS引擎在编译的时候通过词法分析，不需要等到后面的调用或执行操作，就可以判断出a是什么，且a不会被改变，这就是词法作用域,下面举一个a不会被改变的例子。

```
var  a 
function b(){
  var a =1 
  c();
  function c(){
    var a
    console.log(a)         //通过词法作用域我们知道a是函数c中的变量a
  }
}
b()        //undefined，调用b的时候虽然console.log(a)执行，但是a已经在词法作用域内被确定了，不需要在访问函数b中的变量a
```

那么我们这里就有一个疑问了，有没有那种需要等待后面的调用才可以确定自己是谁的了？当然有，我们这里的答案是：this  
还是从一个demo说起

```
var a 
function b(){
  console.log(this)       //这里进行函数声明的时候我们并不知道this指向谁？
}
```

-   调用的demo1

```
var a 
function b(){
  console.log(this)       
}
b()      //在非严格模式下，以函数调用模式时this指向window
```

-   调用的demo2

```
var a 
function b(){
  console.log(this)       
}
b.call({name:qi})      //通过call调用，此时this指向对象{name:qi}
```

从上面两个例子中我们可以发现：1、不同的函数调用，this将指向不同的东西（这和词法作用域不同）；2、this指向谁，只有在函数的调用之时才可以发现

#### 0x03、作用域链总结

1、就近原则  
2、词法作用域：词法分析，不需要调用或执行就知道普通变量是什么，且不随调用而被改变  
3、this不是词法作用域，必须在调用之后才可以确定this
