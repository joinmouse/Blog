---
title: "JavaScript之词法作用域"
date: 2018-12-03
issue_number: 2
tags: ["JS深入浅出"]
state: open
source: "https://github.com/joinmouse/Blog/issues/2"
---
### 作用域
在JS中作用域是一个相当重要的概念，我们一般把作用域分为两类：即静态作用域和动态作用域，JS采用的就是静态作用域(词法作用域)

对于静态作用域有一个相当重要的点是:  **函数的作用域在函数定义的时候就决定了**, 这个相当重要哦，接下来我们直接看一个例子:
```
var value = 100;

function foo() {
    console.log(value);
}

function bar() {
    var value = 1;
    foo();
}

bar();
```
我们先看下在控制台的执行结果 => 
![default](https://user-images.githubusercontent.com/18349016/49356796-e72b3380-f707-11e8-9537-faacdf301376.png)

接下来相必有些人这里有些疑问了，为什么这里的console.log的结果是100而不是1哈，其实是这样的
当我们调用bar()的时候会在函数内部调用foo()函数，但是还记得我们上面说了**函数的作用域在函数定义的时候就决定了**。
也就是说当我们在定义foo这个函数的时候，根据作用域链的查找: foo内部没有申明value变量，我们就到全局查找到value的值是100(这个是在函数定义的时候已经被决定了)，当我们调用foo()的时候，打印的结果自然就是100。

假设JS这门语言在设计的时候采用的是动态作用域(函数的作用域是在函数调用的时候才决定的)，那么这里的执行结果就是1了。




