---
title: "JavaScript 之原型链与继承"
date: 2026-06-01
tags: ["语雀"]
source_kind: yuque
---

当谈到继承时，JavaScript 只有⼀种结构：对象。每个实例对象都有⼀个私有属性（称之为 
__proto__ ）指向它的构造函数的原型对象(prototype)。原型对象也有⼀个⾃⼰的原型对象
(__proto__ ) ，层层向上直到⼀个对象的原型对象为null。根据定义，null没有原型，并作为这个
原型链中的最后⼀个环节。
JavaScript中的对象都是位于原型链顶端Object的实例，尽管这种原型链时候有也会被认为是JS的弱点
之⼀，但原型继承模型本身实际上也是⼀种优秀的设计。
hasOwnProperty是⽤来检测对象⾃身属性中是否具有某个属性，且不是来⾃"继承"原型链的属性，⽤
法如下
hasOwnProperty是 JavaScript 中唯⼀⼀个处理属性并且不会遍历原型链的⽅法(节省性能)⼀、hasOwnProperty
⼆、使⽤不同的⽅法创建对象和⽣成原型链
1、使⽤语法结构创建对象const object1 = {
a: 42
}
console.log(object1.hasOwnProperty ('a'))  
//true
console.log(object1.hasOwnProperty ('toString' ))  
//false, toString 来⾃原型链 Object.prototype 上的属性
// 原型链关系如下 :
// object1 ---> Object.prototype ---> null1
3
5
7
9
11
JavaScript

114在 JavaScript 中，构造器其实就是⼀个普通的函数。当使⽤ new 操作符 来作⽤这个函数时，它
就可以被称为构造⽅法（构造函数）2、使⽤构造器创建对象var o = {a: 1}
// o 这个对象继承了  Object.prototype 上⾯的所有属性
// 原型链如下 :
// o ---> Object.prototype ---> null
var a = ["yo", "whadup" , "?"]
// 数组都继承于 Array.prototype, Array.prototype 中包含  indexOf, forEach 等⽅法
// 原型链如下 :
// a ---> Array.prototype ---> Object.prototype ---> null
function  f(){
  return 2
}
// 函数都继承于  Function.prototype, Function.prototype 中包含  call, bind 等⽅法
// 原型链如下 :
// f ---> Function.prototype ---> Object.prototype ---> null1
3
5
7
9
11
13
15
JavaScript
function  Graph() {
  this.vertices  = []
  this.edges = []
}
Graph.prototype  = {
  addVertex : function (v){
    this.vertices .push(v);
  }
}
var g = new Graph()
// g 是⽣成的对象，他的⾃身属性有  'vertices' 和  'edges' 。
// g 被实例化时， g.[[Prototype]] 指向了  Graph.prototype
// 原型链如下：
// g ---> Object.prototype ---> null1
3
5
7
9
11
13
15
JavaScript

115ES5中，我们可以通过Object.create()来创建⼀个新对象
ECMAScript6 引⼊了⼀套新的关键字⽤来实现 class。使⽤基于类语⾔的开发⼈员会对这些结构
感到熟悉，但它们是不同的。JavaScript 仍然基于原型。这些新的关键字包括class、
constructor、static、extends和super3、使⽤Object.create创建对象
4、使⽤class关键字来创建对象var a = {x: 1}; 
// a ---> Object.prototype ---> null
var b = Object.create(a);
// b ---> a ---> Object.prototype ---> null
console.log(b.x); // 1 (继承⽽来 )
var c = Object.create(b);
// c ---> b ---> a ---> Object.prototype ---> null
var d = Object.create(null)
// d ---> null
console.log(d.hasOwnProperty ); 
// undefined, 因为 d 没有继承 Object.prototype1
3
5
7
9
11
13
JavaScript

116有了上⾯的基础，我们接下来看拓展原型链常⽤到的四种⽅法三、使⽤不同的⽅法拓展原型链
1、New-initialization"use strict" ;
class Polygon {
  constructor (height, width) {
    this.height = height
    this.width = width
  }
}
class Square extends Polygon {
  constructor (sideLength ) {
    super(sideLength , sideLength )
  }
  get area() {
    return this.height * this.width
  }
  set sideLength (newLength ) {
    this.height = newLength
    this.width = newLength
  }
}
var square = new Square(2)
// 原型链如下：
// square ---> Square ---> Polygon ---> Object.prototype ---> null1
3
5
7
9
11
13
15
17
19
21
23
25
JavaScript

117⽀持⽬前以及所有可想象到的浏览器，⽅法⾮常快，⾮常符合标准，并且充分利⽤JIT优化
2、__proto__function  Foo(){}
Foo.prototype  = {
  foo_prop : "foo val"
}
var proto = new Foo()
proto.bar_prop  = "bar val"
// proto ---> Foo ---> Object.prototype ---> null
function  Bar() {
}
// *将Bar 的原型对象赋值为 proto
Bar.prototype  = proto
// Bar原型链为 proto ---> Foo ---> Object.prototype ---> null
let inst = new Bar()
// inst ---> Bar(proto) ---> Foo --> Object.prototype ---> null
console.log(inst.foo_prop )  // foo_val
console.log(inst.bar_prop )  // bar_val1
3
5
7
9
11
13
15
17
19
JavaScript

118⽀持所有现代⾮微软版本以及 IE11 以上版本的浏览器，但是⽣产环境中并不推荐使⽤
__proto__，实际上其也不是JS标准的属性
3、Object.create()⽅法// ⽅式1
function  Foo(){}
Foo.prototype  = {
  foo_prop : "foo val"
}
function  Bar(){}
var proto = {
  bar_prop : "bar val" ,
  __proto__ : Foo.prototype
}
Bar.prototype  = proto
var inst = new Bar()
console.log(inst.foo_prop )
console.log(inst.bar_prop )
// ⽅式⼆ , 完全模拟过程
var inst = {
  __proto__ : {
    bar_prop : "bar val" ,
    __proto__ : {
      foo_prop : "foo val" ,
      __proto__ : Object.prototype
    }
  }
};
console.log(inst.foo_prop )
console.log(inst.bar_prop )1
3
5
7
9
11
13
15
17
19
21
23
25
27
29
JavaScript

119object.create⽀持是ES5的⽅法，⽀持IE8以上的浏览器
4、Object.setPrototypeOffunction  Foo(){}
Foo.prototype  = {
  foo_prop : "foo val"
}
var proto = Object.create(
  Foo.prototype
)
proto.bar_prop  = "bar val"
/* 或者这样的⽅式
  var proto = Object.create(
  Foo.prototype, {
    bar_prop: {
      value: "bar val"
    }
  })
*/
function  Bar(){}
Bar.prototype  = proto
var inst = new Bar()
console.log(inst.foo_prop )
console.log(inst.bar_prop )1
3
5
7
9
11
13
15
17
19
21
23
25
JavaScript

120ES6的⽅法，这个⽅式表现并不好，应该被弃⽤。如果你在⽣产环境中使⽤这个⽅法，那么快速运⾏ 
Javascript 就是不可能的，因为许多浏览器优化了原型，尝试在调⽤实例之前猜测⽅法在内存中的位
置，但是动态设置原型⼲扰了所有的优化，甚⾄可能使浏览器为了运⾏成功，使⽤完全未经优化的代码
进⾏重编译。 不⽀持 IE8 及以下的浏览器版本。
需要注意的是其实JavaScript和传统的⾯向对象(Java/C++)还是有本质的不同的，因为它是完全动态
的，都是运⾏时，不存在类(class)，即使我们模拟的"类"实际上也只是⼀个函数对象
当执⾏new Foo的时候，JavaScript实际上操作如下四、Class⽅法下的继承代码转换function  Foo(){}
Foo.prototype  = {
  foo_prop : "foo val"
}
function  Bar(){}
var proto = {
  bar_prop : "bar val"
}
Object.setPrototypeOf (
  proto, Foo.prototype
)
Bar.prototype  = proto
var inst = new bar;
console.log(inst.foo_prop )
console.log(inst.bar_prop )1
3
5
7
9
11
13
15
17
JavaScript
function  Foo() {
}
Foo.prototype .doSomeThing  = function () {
//...
}
var o = new Foo()1
3
5
7
JavaScript

121当执⾏o.do的时候(实际上没有整个⽅法，只有doSomeThing)，会沿着原型链⼀层层的找，值得注意的
是Prototype这个属性是作⽤于”类“的，_ proto__或者说Object.getPrototypeOf()是作⽤于"实
例"的，接下来我们看继承的实现。var o = new Object()
o.__proto__   = Foo.prototype
Foo.call(o)1
3
JavaScript
// Shape - ⽗类 (superclass)
function  Shape() {
  this.x = 0
  this.y = 0
}
// ⽗类的⽅法
Shape.prototype .move = function (x, y) {
  this.x += x
  this.y += y
  console.info('Shape moved.' )
}
// Rectangle - ⼦类 (subclass)
function  Rectangle () {
Shape.call(this)  // call super constructor, ⼦类实例化的时候 this 指向的是⽗
类的实例化
}
// ⼦类继承⽗类 , ⼦类原型链上⽗类的原型
Rectangle .prototype  = Object.create(Shape.prototype )
// 指定constructor ，不指定的话 Rectangle.prototype.constructor === Shape
Rectangle .prototype .constructor  = Rectangle
// 实例化
var rect = new Rectangle ();
console.log('Is rect an instance of Rectangle?' , rect instanceof  Rectangl
e); // true
console.log('Is rect an instance of Shape?' , rect instanceof  Shape); // tr
ue
rect.move(1, 1);  // 'Shape moved.' 继承⽗类的⽅法1
3
5
7
9
11
13
15
17
19
21
23
25
27
JavaScript

122使⽤原型链来封装⼀个继承函数也可以
拷⻉继承写法如下：
参考：https://developer.mozilla.org/zh-
CN/docs/Web/JavaScript/Reference/Global_Objects/Object/createfunction  extend(Child, Parent) {
　　var F = function (){}
　　F.prototype  = Parent.prototype
　　　　
  Child.prototype  = new F()
　　Child.prototype .constructor  = Child
  
  // 意思是为⼦对象设⼀个 uber 属性，这个属性直接指向⽗对象的 prototype 属性。
    //（uber 是⼀个德语词，意思是 " 向上 " 、 " 上⼀层 " 。）这等于在⼦对象上打开⼀条通道，
    // 可以直接调⽤⽗对象的⽅法。这⼀⾏放在这⾥，只是为了实现继承的完备性，纯属备⽤性质
　　Child.uber = Parent.prototype
}1
3
5
7
9
11
JavaScript
function  extend2(Child, Parent) {
   var p = Parent.prototype
   var c = Child.prototype
   for (var i in p) {
      c[i] = p[i]
   }
   c.uber = p
}1
3
5
7
9
JavaScript

123