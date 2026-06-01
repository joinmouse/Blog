---
title: "JavaScript 之原型到原型链"
date: 2026-06-01
tags: ["语雀"]
source_kind: yuque
---

通过上篇的⽂章我们已经对原型设计的动机有了⼀个认识，接下来接完整的说下原型到原型链的整个完
整图
JavaScript是⼀⻔基于原型的语⾔，这点和基于类的语⾔经验 (如 Java 或 C++) 来说在语⾔特性层⾯是不⼀
样的，它本身并不提供⼀个class的实现（尽管在ES2015/ES6 中引⼊了 class 关键字，但只是语法糖，
JavaScript 仍然是基于原型的），从⼀个例⼦出发
通过这个例⼦我们可以发现经过实例化的对象person1和person2都有⼀个name属性，"继承"⾃Person
的name，这⾥Person.prototype也就是person1 和 person2 的原型
原型: 每⼀个JavaScript对象(null除外)在创建的时候就会与之关联另⼀个对象，这个对象就是我们所说
的原型，每⼀个对象都会从原型"继承"属性。⼀、原型(prototype)
// 在JS 中⼀般默认⼤写的函数名是⼀个构造函数
function  Person() {
  //
}
Person.prototype .name = 'joinmouse' ;
// 实例化
var person1 = new Person();
var person2 = new Person();
console.log(person1.name)  // joinmouse
console.log(person2.name)  // joinmouse1
3
5
7
9
JavaScript

124每⼀个JavaScript对象(除了 null )都具有的⼀个属性叫__proto__，这个属性会指向该对象的原型，这个
属于并不是JS标准⽽是许多浏览器实现的的⼀个属性，我们在编程过程中⼀般并不会使⽤该属性(隐藏属
性)。从ES6开始，我们可以通过Object.getPrototypeOf()和Object.setPrototypeOf()访问器去访问了
这⾥我们可以理解为每⼀个实例化的对象就是通过__proto__来指向它的原型的⼆、__proto__
function  Person() {
   //代码
}
var person = new Person();
console.log(person.__proto__  === Person.prototype );  // true1
3
5
JavaScript

125每个原型都有⼀个 constructor 属性指向对应的构造函数三、constructor
function  Person() {
  // 业务...
}
console.log(Person === Person.prototype .constructor ); // true1
3
JavaScript

126上⾯这张图就就可以完整的反映出来构造函数、实例原型、和实例的关系，这个关系很重要，可以说后
⾯的原型链和js的⾯向对象的实现都是基于这⼀块的知识的
我们现在对第⼀个例⼦进⾏下调整合
我们这⾥分析下，person1因为⾃⼰声明了⼀个name属性，所以person1这个对象就直接取⾃⼰的
name, 但是person2本身是们没有name这个属性的，它是如何获取的呢？
person2.__proto__ .name === Person.prototype.name ，这⾥⾯的关键就是如果对象发
现⾃⼰身上没有对应的属性或者⽅法，就会去查找⾃⼰的原型的属性(通过__proto__这个属性), 没错这
就是原型链的概念，那么原型的原型⼜是什么呢？
原型本身也是⼀个对象，对象就是通过 Object 构造函数⽣成的，即 Person.__proto__ === Obje
ct.prototype  那么这⾥我们更新下关系图应该是四、原型和实例
五、原型链function  Person() {
  //
}
Person.prototype .name = 'joinmouse' ;
// 实例化
var person1 = new Person();
var person2 = new Person();
person1.name = 'cloud'
console.log(person1.name)  // cloud
console.log(person2.name)  // joinmouse1
3
5
7
9
JavaScript

127那么那 Object.prototype 的原型呢？是null
关于null和undefine的区别，我们可以参考阮⼀峰的⽂章《undefined与null的区别》
console.log(Object.prototype .__proto__  === null) // true
// person -> Person -> Object.prototype  -> null1
3
JavaScript

128