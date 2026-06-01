---
title: "JavaScript 原型机制的设计思想"
date: 2026-06-01
tags: ["语雀"]
source_kind: yuque
---

经典的蝴蝶书 JavaScript 语言精粹中告诉我们JS是一门基于原型的面向对象语言，这与基于类特性的
语言有着本质的不同。它没有"类"和"实例化"的区分，全靠一种"原型链"的机制去实现继承。
这里有两个关键的名词： 原型、原型链
在Brendan Eich(JS之父)创造JS的时候，当时面向对象编程的思想很兴盛，我们知道JS里面的复杂数
据结构都是对象(Object)，因为有个对象，就必须要用一种机制将对象联系起来，Brendan Eich选择
了"继承"，但是他⼜不想引入"类"概念，因为一旦有了"类"，Javascript就是一种完整的面向对象编程语
言了，这样对初学者增加了门槛。
Java当时实例化一个类是这样的
他就引入了new命令到JavaScript，同时做了一个简化的设计，new后面的不是类，而是构造函数(大写
的函数名)，如下
用构造函数生存实例对象，有个问题就是无法共享属性和方法，比如1、从面向对象编程说起
2、new的缺陷　Foo foo = new Foo() 1
Java
function  DOG(name) {
this.name = name
}
// 对这个构造函数使用 new ，就可以实例化他
var dogA = new Dog('二哈')
alert(dogA.name)   //二哈1
3
5
7
JavaScript

129每个实例对象都有自己的属性和方法的副本，这当然是没问题的，但是这样就没法做到数据共享，浪费
内存资源
考虑到上面这点，Brendan Eich决定为构造函数设置一个prototype属性，这个属性包含一个protptype
对象，所有的实例对象需要共享的属性和方法放在这个里面，不需要共享的属性和方法就放在构造函数
里面。
实例对象一旦被创建，将自动引入prototype对象的属性和方法，换句话说实例对象的属性和方法分为
两种：一种是通过构造函数获取的，一种是引入的3、prototype属性的引入function  DOG(name){
　　this.name = name;
　　this.species = '犬科'
}
// 生成两个实例化对象
var dogA = new DOG('大毛')
var dogB = new DOG('二毛')
//两个对象的 species 是独立的，当我们修改其中一个，不会影响到另外一个
dogA.species = '猫科';
alert(dogB.species); // 显示" 犬科 " ，  不受 dogA 的影响1
3
5
7
9
11
JavaScript

130我们可以发现species属性放在prototype对象中，两个实例对象是共享的。修改prototype对象就会影
响到两实例化后的对象。
由于所有的实例对象共享一个prototype对象，那么在外界看来，prototype对象就好像是实例对象的原
型，而实例对象像"继承"了prototype对象一样。但实际上是这样的嘛？下篇分享原型 & 原型链的知识
参考： 
http://www.ruanyifeng.com/blog/2010/05/object-oriented_javascript_encapsulation.html
http://blog.vjeux.com/2011/javascript/how-prototypal-inheritance-really-works.htmlfunction  DOG(name){
　　this.name = name
}
// 可共用的属性
DOG.prototype  = { 
  species: '犬科' 
}
// 生成两个实例化对象
var dogA = new DOG('大毛')
var dogB = new DOG('二毛')
// 共用引入的 species 属性
alert(dogA.species) // 显示" 犬科 "
alert(dogB.species) // 显示" 犬科 "
// 修改原型上的 prototype 对象属性
DOG.prototype .species = '猫科'
alert(dogA.species); // 猫科
alert(dogB.species); // 猫科1
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
JavaScript

131