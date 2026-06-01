---
title: "jQuery源码解读-核心机制(1)"
date: 2017-08-08
slug_jianshu: 28fa9a598fa4
tags: ["简书"]
state: open
source: "https://www.jianshu.com/p/28fa9a598fa4"
source_kind: jianshu
---
-   核心机制——对象的构建

### 1、构造函数

面向对象(OOP)的语言都有一个特点，它们都会有类的这一概念，通过类可以抽象出创建具体相同方法与属性的对象。但是，JavaScript是一门基于原型的语言，在ECMAScript中是没有类的概念(之后的ES6中添加了Class)，但是可以通过基于构造函数来实现继承

在JavaScript世界中函数作为“一等公民”，它不仅拥有一切传统函数的使用方式（声明和调用），而且可以做到像简单值一样赋值、传参、返回。不仅如此，而且还可以通过操作符new来充当类的构造器。

但函数充当类的构造器的时候，原型prototype是构造函数的一个重要属性, 该属性指向一个对象。而这个对象将作为该构造函数所创建的所有实例的基引用(base reference), 可以把对象的基引用想像成一个自动创建的隐藏属性。  
当访问对象的一个属性时, 首先查找对象本身, 找到则返回；若不, 则查找基引用指向的对象的属性(如果还找不到实际上还会沿着原型链向上查找, 直至到根)。 关于构造函数和原型更多的知识可以参考我这篇文章 xxxxxxxxxxxxx,

### 2、new操作符

首先我们来看一个构造函数的例子：

```
//这里为了区分构造函数和普通函数，将构造函数的首个字母大写以示区分
function AjQuery() {
    this.name = 'jQuery';
    this.sayName = function(){
      return this.name
   }
}
var a = new AjQuery()
var b = new AjQuery()
var c = new AjQuery()
```

-   在JavaScript中是通过new操作符来实例化对象的，这里我们知道构造函数AjQuery()有一个属性和方法。当通过new操作符实例化对象的时候，构造函数中的this会指向当前实例化对象本身。

除此之外，我们看一下实例化对象是如何实现继承的：

-   上面的这些实例化的对象的属性一模一样，都是对this的引用来处理;每一个实例都会复制sayName方法，每个方法属性都占用一定的内存的空间，所以如果把所有属性方法都声明在构造函数中，就会无形的增大很多开销，并且当其属性和方法比较多的时候看起来结构也比较混乱。那么我们看一下基于原型的写法：

```
function AjQuery() {
    this.name = 'jQuery'
}
AjQuery.prototype = {
    sayName: function(){
        return this.name
    }
}
var a = new AjQuery()
var b = new AjQuery()
var c = new AjQuery()
```

上面这种写法的好处是new产生的a,b,c三个实例对象共享了原型的sayName方法，这样可以节省内存空间，而且逻辑上更清晰了。

### 3、jQuery中不采用new操作符

下面我们直接放一段jQuery中的代码

```
jQuery = function( selector, context ) {
    return  new jQuery.fn.init( selector, context );
}
jQuery.fn=jQuery.prototype = {
    init:function(){
        return this
    },
    jquery: version,
    constructor: jQuery,
    .......
}

var a= $();
```

通过上面的源码，我们可以发现jQuery创建对象并没有采用new操作符，而是通过return返回一个new出来的对象，与上面的new操作符实例化对象的方式还是有很大区别的。  
可能大家看到上面一段源码有点懵逼吧，那么目前对上面大概印象就好了，下面可以进入下一篇文章**核心机制——分离构造器**来了解为什么会这样写源码。
