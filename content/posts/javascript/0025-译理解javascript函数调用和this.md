---
title: "(译)理解JavaScript函数调用和\"this\""
date: 2019-08-07
issue_number: 25
tags: ["JS深入浅出"]
state: open
source: "https://github.com/joinmouse/Blog/issues/25"
---
### 介绍
最近在学习TypeScript的时候，看到一篇关于JavaScript函数调用和"this"的文章，文后会附上链接，总结关于this的角度很棒。

### 核心思想
在原本的函数调用中，函数是有一个call方法，call方法遵从下面的原则：
1、函数的第一次参数是thisValue
2、构造参数列表(argList)是从1到最后一个
3、把this的值赋值给thisValue，argList作为参数列表调用函数


### 简单函数
以一个最简单的函数为例子
```
function hello(thing) {
  console.log(`${this}say hello ${thing}`);
}
```
当我们调用`hello('world')`的时候，按照上面的核心思想，在非严格模式下等价于`hello.call(window, "world")`，严格模式下为`hello.call(undefined, "world")`。
这里的第一个参数是为this的值，而从第二个参数开始才是传入的参数值。这就是JavaScript函数核心调用的思想，你能想象所有其他的函数调用都是对这个原语包装。

### 成员函数
```
var person = {
  name: "Brendan Eich",
  hello: function(thing) {
    console.log(`${this}say hello ${thing}`);
  }
}
```

当我们调用`person.hello('world')`的时候，其实是`person.call(person, 'world')`, 这里的this指向的就是person这个对象，接下来我们接着看
```
function hello(thing) {
  console.log(this + " says hello " + thing);
}
 
person = { name: "Brendan Eich" }
person.hello = hello;
 
person.hello("world") // 相当于person.hello.call(person, "world")
 
hello("world")  // 非严格模式下相当于hello.call(window, "world")
```

### 使用`Function.prototype.bind`
关于上面的例子，其实可以接着衍生，假如我们想让`hello("world")`实现和person.hello("world")一样的效果，其实这个时候，只需要在调用的时候写成`hello.call(person,"world") `, 这里我们将this指定为对象person，其实这样就很像hello.bind(person, "world")。

我们看下mdn上`Function.prototype.bind`的语法
```
function.bind(thisArg[, arg1[, arg2[, ...]]])
```
- thisArg
调用绑定函数时作为this参数传递给目标函数的值。 如果使用new运算符构造绑定函数，则忽略该值。当使用bind在setTimeout中创建一个函数（作为回调提供）时，作为thisArg传递的任何原始值都将转换为object。如果bind函数的参数列表为空，执行作用域的this将被视为新函数的thisArg。
- arg1, arg2, ...
当目标函数被调用时，预先添加到绑定函数的参数列表中的参数。
- 返回值
 返回一个原函数的拷贝，并拥有指定的this值和初始参数

这里我们可以通过bind这个方法来改变this的指向问题


### 箭头函数
说到this， 这里就有必要指出一下箭头函数了，一句话总结下就是: **箭头函数的this是在定义的时候确定的, 普通函数的this是在其调用的时候才确定的**


参考链接: https://yehudakatz.com/2011/08/11/understanding-javascript-function-invocation-and-this/，







