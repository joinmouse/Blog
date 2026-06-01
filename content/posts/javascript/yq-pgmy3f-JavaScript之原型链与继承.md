---
title: "JavaScript之原型链与继承"
date: 2026-06-01
slug_yuque: pgmy3f
tags: ["语雀"]
source: "https://www.yuque.com/joinmouse/blog/pgmy3f"
source_kind: yuque
---

返回文档当谈到继承时，JavaScript 只有一种结构：对象。每个实例对象都有一个私有属性（称之为 __proto__ ）指向它的构造函数的原型对象(prototype)。原型对象也有一个自己的原型对象(__proto__ ) ，层层向上直到一个对象的原型对象为null。根据定义，null没有原型，并作为这个原型链中的最后一个环节。

JavaScript中的对象都是位于原型链顶端Object的实例，尽管这种原型链时候有也会被认为是JS的弱点之一，但原型继承模型本身实际上也是一种优秀的设计。

一、hasOwnProperty
hasOwnProperty是用来检测对象自身属性中是否具有某个属性，且不是来自"继承"原型链的属性，用法如下
​JavaScript运行代码复制代码991234567891011const object1 = {	a: 42}
console.log(object1.hasOwnProperty('a'))  //true
console.log(object1.hasOwnProperty('toString'))  //false, toString来自原型链Object.prototype 上的属性// 原型链关系如下:// object1 ---> Object.prototype ---> nullhasOwnProperty是 JavaScript 中唯一一个处理属性并且不会遍历原型链的方法(节省性能)

二、使用不同的方法创建对象和生成原型链
1、使用语法结构创建对象
​JavaScript运行代码复制代码9912345678910111213141516var o = {a: 1}// o 这个对象继承了 Object.prototype 上面的所有属性// 原型链如下:// o ---> Object.prototype ---> null
var a = ["yo", "whadup", "?"]// 数组都继承于Array.prototype, Array.prototype 中包含 indexOf, forEach 等方法// 原型链如下:// a ---> Array.prototype ---> Object.prototype ---> null
function f(){  return 2}// 函数都继承于 Function.prototype, Function.prototype 中包含 call, bind等方法// 原型链如下:// f ---> Function.prototype ---> Object.prototype ---> null
2、使用构造器创建对象
在 JavaScript 中，构造器其实就是一个普通的函数。当使用 [new 操作符](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/new) 来作用这个函数时，它就可以被称为构造方法（构造函数）
​JavaScript运行代码复制代码9912345678910111213141516function Graph() {  this.vertices = []  this.edges = []}
Graph.prototype = {  addVertex: function(v){    this.vertices.push(v);  }}
var g = new Graph()// g 是生成的对象，他的自身属性有 'vertices' 和 'edges'。// g 被实例化时，g.[[Prototype]] 指向了 Graph.prototype// 原型链如下：// g ---> Object.prototype ---> null
3、使用Object.create创建对象
ES5中，我们可以通过Object.create()来创建一个新对象
​991234567891011121314var a = {x: 1}; // a ---> Object.prototype ---> null
var b = Object.create(a);// b ---> a ---> Object.prototype ---> nullconsole.log(b.x); // 1 (继承而来)
var c = Object.create(b);// c ---> b ---> a ---> Object.prototype ---> null
var d = Object.create(null)// d ---> nullconsole.log(d.hasOwnProperty); // undefined, 因为d没有继承Object.prototype
4、使用class关键字来创建对象
ECMAScript6 引入了一套新的关键字用来实现 [class](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Classes)。使用基于类语言的开发人员会对这些结构感到熟悉，但它们是不同的。JavaScript 仍然基于原型。这些新的关键字包括class、constructor、static、extends和super
​9912345678910111213141516171819202122232425"use strict";
class Polygon {  constructor(height, width) {    this.height = height    this.width = width  }}
class Square extends Polygon {  constructor(sideLength) {    super(sideLength, sideLength)  }  get area() {    return this.height * this.width  }  set sideLength(newLength) {    this.height = newLength    this.width = newLength  }}
var square = new Square(2)// 原型链如下：// square ---> Square ---> Polygon ---> Object.prototype ---> null
三、使用不同的方法拓展原型链
有了上面的基础，我们接下来看拓展原型链常用到的四种方法
1、New-initialization
​991234567891011121314151617181920function Foo(){}Foo.prototype = {  foo_prop: "foo val"}
var proto = new Foo()proto.bar_prop = "bar val"// proto ---> Foo ---> Object.prototype ---> null
function Bar() {}// *将Bar的原型对象赋值为protoBar.prototype = proto// Bar原型链为proto ---> Foo ---> Object.prototype ---> null
let inst = new Bar()// inst ---> Bar(proto) ---> Foo --> Object.prototype ---> null
console.log(inst.foo_prop)  // foo_valconsole.log(inst.bar_prop)  // bar_val支持目前以及所有可想象到的浏览器，方法非常快，非常符合标准，并且充分利用JIT优化

2、__proto__
支持所有现代非微软版本以及 IE11 以上版本的浏览器，但是生产环境中并不推荐使用__proto__，实际上其也不是JS标准的属性

3、Object.create()方法
object.create支持是ES5的方法，支持IE8以上的浏览器

4、Object.setPrototypeOf
ES6的方法，这个方式表现并不好，应该被弃用。如果你在生产环境中使用这个方法，那么快速运行 Javascript 就是不可能的，因为许多浏览器优化了原型，尝试在调用实例之前猜测方法在内存中的位置，但是动态设置原型干扰了所有的优化，甚至可能使浏览器为了运行成功，使用完全未经优化的代码进行重编译。 不支持 IE8 及以下的浏览器版本。

四、Class方法下的继承代码转换
需要注意的是其实JavaScript和传统的面向对象(Java/C++)还是有本质的不同的，因为它是完全动态的，都是运行时，不存在类(class)，即使我们模拟的"类"实际上也只是一个函数对象
当执行new Foo的时候，JavaScript实际上操作如下
当执行o.do的时候(实际上没有整个方法，只有doSomeThing)，会沿着原型链一层层的找，值得注意的是Prototype这个属性是作用于”类“的，_ proto__或者说Object.getPrototypeOf()是作用于"实例"的，接下来我们看继承的实现。

使用原型链来封装一个继承函数也可以

拷贝继承写法如下：

参考：[https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create)
​若有收获，就点个赞吧