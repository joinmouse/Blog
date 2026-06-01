---
title: "JavaScript数组笔记1：检测数组的方法"
date: 2017-06-18
slug_jianshu: 73607e1392f7
tags: ["简书"]
state: open
source: "https://www.jianshu.com/p/73607e1392f7"
source_kind: jianshu
---
#### 1、0x00引言

很多时候我们需要对JavaScript中数据类型(Function、String、Number、Undefined、Boolean和Object)做判断。在JavaScript中提供了\*\*typeof  
\*\*操作符可以对这些常用的数据类型做判断。  
可是当我们使用typeof来判断数据是不是一个数组，就不起作用了。那在实际生产中需要怎么样来检测数据是不是一个数组呢？

这里使用\*\*typeof\*\*检测的数组是一个对象（数组本身也为对象嘛）

#### 0x02、检测数组的方法

我们知道数组并不属于JavaScript中的数据类型，在上面的检测出数组是一个对象，下面将列举一些常见的数组检测方法

> ECMAScript 5的isArray函数

console测试结果

> 对象自身的constructor属性

检测构造函数时使用对象自身的constructor属性，此时constructor属性返回一个指向了该对象原型的函数引用，使用该属性也可以检测数组的类型

> instanceof操作符

instanceof操作符用来判断某个构造函数的prototype属性是否在另一个检测对象的原型链上

instanceof操作符判断

#### 0x03、总结

其实目前大多生产环境对ES5都有比较好的支持，故使用isArray方法和常见的instanceof对于我们判断一个对象是否为数组比较便捷
