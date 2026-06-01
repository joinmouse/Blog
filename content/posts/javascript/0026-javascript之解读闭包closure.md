---
title: "JavaScript之解读闭包(Closure)"
date: 2019-08-21
issue_number: 26
tags: ["JS深入浅出"]
state: open
source: "https://github.com/joinmouse/Blog/issues/26"
---
# JavaScript精进 | 解读闭包(Closure)

看过很多关于关于闭包的博客解释，要么太学术了，要么就是讲的不太清楚。这篇文章主要写什么是闭包？闭包有什么用？

#### 一、JavaScript变量作用域

在我们理解闭包之前，需要先知道JavaScript的变量作用域，在ES6之前JavaScript的变量作用域只有2种：全局作用域和函数作用域，我们看两个例子

```javascript
var local = 123
function foo() {
	console.log(local)
}

foo() // 123
```

函数内部可以访问全局的local变量

```javascript
function foo() {
	var fn_local = 222
  console.log(fn_local)
}

console.log(fn_local) // fn_local is not defined
```

函数外部是无法读取函数内部得变量的

关于JavaScript作用域更多的了解可以参考我篇文章: [https://github.com/joinmouse/Blog/issues/2](/posts/0002-javascript之词法作用域)

#### 二、闭包是什么
我们在第一个例子种看到函数虽然访问到了外部的变量，但是那是一个全局的变量，我们现在想要的是访问一个局部的变量，需要如何做到呢，我们先看一段理解执行函数

```javascript
(function() {
	var local = 123
  function foo() {
    console.log(local)
  }
})()
```

我们把第一个例子中的3行代码用一个立即执行函数包裹起来了，这样我们可以实现这样一个效果：变量local不可以被外部的变量访问，同时可以被foo()函数访问到，这其实就是一个闭包呀。

简单的说闭包就是： **「函数」和「函数内部能访问到的变量」（也叫环境）的总和，就是一个闭包。**
**
我们现在再来看下在《JavaScript语言精粹》和《JavaScrip权威指南》上都那一种返回一个函数来解释闭包的例子，就会发现其实也很好理解的

```javascript
var scope = "global scope";
function checkscope(){
    var scope = "local scope";
    function f(){
        return scope;
    }
    return f;
}

var foo = checkscope();
foo();
```

这里其实也是一个闭包呀，f函数外部的变量scope是可以被f函数访问的，同时checkscope函数为scope变量形成了一个局部访问的空间

#### 三、闭包有什么用

闭包常常用来「间接访问一个变量」，换句话说「隐藏一个变量」。
闭包其实是JavaScript函数作用域的附产品，因为在ES6之前是没有块级作用域的，因此我们想要一个函数可以访问的"局部的变量"的时候，就可以使用闭包，懂了 JS 的作用域，你自然而然就懂了闭包，即使你不知道那就是闭包！

参考:
JavaScrip之词法作用域 [https://github.com/joinmouse/Blog/issues/2](/posts/0002-javascript之词法作用域)
阮一峰学习javascript闭包 [http://www.ruanyifeng.com/blog/2009/08/learning_javascript_closures.html](http://www.ruanyifeng.com/blog/2009/08/learning_javascript_closures.html)
JS中的闭包是什么 [https://zhuanlan.zhihu.com/p/22486908](https://zhuanlan.zhihu.com/p/22486908)

