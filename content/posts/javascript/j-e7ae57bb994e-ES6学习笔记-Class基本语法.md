---
title: "ES6学习笔记—Class基本语法"
date: 2017-07-16
slug_jianshu: e7ae57bb994e
tags: ["ES6"]
state: open
source: "https://www.jianshu.com/p/e7ae57bb994e"
source_kind: jianshu
---
### 1、引言

JavaScript是一门基于原型继承的语法，ES5中我们实现面向对象构造“父类”的写法一般通过构造函数写入基本属性、通过原型prototype写入基本的方法，下面是一个例子  
**demo**

```
function Point(x, y) {
  this.x = x;
  this.y = y;
}

Point.prototype.toString = function () {
  return '(' + this.x + ', ' + this.y + ')';
};

var p =new Point(1,2)
```

ES6的class可以看作一个语法糖，ES6中引入的新属性class，通过class可以让对象原型的写法更加清晰、更像面向对象编程的语法而已，上面的例子通过ES6的class改写,

```
//定义一个Point类
class Point {
  constructor(x,y) {
    this.x = x;
    this.y = y;
  }

  toString() {
    return '(' + this.x + ', ' + this.y + ')';
  }
}
```

-   严格模式  
    类和模块的内部，默认就是严格模式，因而不需要使用use strict指定运行模式。当我们将代码写在类和模块之中，就只有严格模式可用

### 2、类的实例对象

当我们生成类的实例对象的写法，与ES5完全一样，即使用new命令，实例的属性除显式定义在本身（定义this对象），否则定义在原型上（定义在class上），下面写一个例子

```
//定义类
class Point {

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  toString() {
    return '(' + this.x + ', ' + this.y + ')';
  }

}

var point = new Point(2, 3);

point.toString() // (2, 3)

//检验实例的对象继承的属性在本身还是原型对象上
point.hasOwnProperty('x') // true
point.hasOwnProperty('y') // true
point.hasOwnProperty('toString') // false
point.__proto__.hasOwnProperty('toString') // true
```

-   与ES5一样，类的所有实例共享一个原型对象，demo测试如下

```
var p1 = new Point(2,3);
var p2 = new Point(3,2);

p1.__proto__ === p2.__proto__     //true

```

### 3、私有方法和私有属性
