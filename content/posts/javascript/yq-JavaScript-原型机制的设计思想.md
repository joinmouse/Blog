---
title: "JavaScript 原型机制的设计思想"
date: 2021-12-15
tags: ["语雀"]
source_kind: yuque
---

经典的蝴蝶书《JavaScript 语言精粹》中告诉我们 JS 是一门基于原型的面向对象语言，这与基于类特性的语言有着本质的不同。它没有"类"和"实例化"的区分，全靠一种"原型链"的机制去实现继承。

<Callout type="info">
这里有两个关键的名词：**原型**、**原型链**。理解它们的设计动机，才能真正理解 JavaScript 的面向对象。
</Callout>

## 1、从面向对象编程说起

在 Brendan Eich（JS 之父）创造 JS 的时候，当时面向对象编程的思想很兴盛，我们知道 JS 里面的复杂数据结构都是对象（Object），因为有了对象，就必须要用一种机制将对象联系起来，Brendan Eich 选择了"继承"，但是他又不想引入"类"概念，因为一旦有了"类"，JavaScript 就是一种完整的面向对象编程语言了，这样对初学者增加了门槛。

Java 当时实例化一个类是这样的：

```java
Foo foo = new Foo()
```

他就引入了 `new` 命令到 JavaScript，同时做了一个简化的设计，`new` 后面的不是类，而是构造函数（大写的函数名），如下：

```javascript
function DOG(name) {
  this.name = name
}
// 对这个构造函数使用 new，就可以实例化他
var dogA = new Dog('二哈')
alert(dogA.name) // 二哈
```

## 2、new 的缺陷

用构造函数生成实例对象，有个问题就是**无法共享属性和方法**，比如：

```javascript
function DOG(name) {
  this.name = name;
  this.species = '犬科'
}
// 生成两个实例化对象
var dogA = new DOG('大毛')
var dogB = new DOG('二毛')
// 两个对象的 species 是独立的，修改其中一个不影响另一个
dogA.species = '猫科';
alert(dogB.species); // 显示"犬科"，不受 dogA 的影响
```

<Callout type="warning">
每个实例对象都有自己的属性和方法的副本，这样就没法做到数据共享，浪费内存资源。
</Callout>

## 3、prototype 属性的引入

考虑到上面这点，Brendan Eich 决定为构造函数设置一个 `prototype` 属性，这个属性包含一个 prototype 对象，所有的实例对象需要共享的属性和方法放在这个里面，不需要共享的属性和方法就放在构造函数里面。

实例对象一旦被创建，将自动引入 prototype 对象的属性和方法，换句话说实例对象的属性和方法分为两种：一种是通过构造函数获取的，一种是引入的。

```javascript
function DOG(name) {
  this.name = name
}
// 可共用的属性
DOG.prototype = {
  species: '犬科'
}
// 生成两个实例化对象
var dogA = new DOG('大毛')
var dogB = new DOG('二毛')
// 共用引入的 species 属性
alert(dogA.species) // 显示"犬科"
alert(dogB.species) // 显示"犬科"
// 修改原型上的 prototype 对象属性
DOG.prototype.species = '猫科'
alert(dogA.species); // 猫科
alert(dogB.species); // 猫科
```

<Callout type="tip">
`species` 属性放在 prototype 对象中，两个实例对象是共享的。修改 prototype 对象就会影响到所有实例化后的对象。这就是"原型"的核心思想。
</Callout>

由于所有的实例对象共享一个 prototype 对象，那么在外界看来，prototype 对象就好像是实例对象的原型，而实例对象像"继承"了 prototype 对象一样。但实际上是这样的吗？下篇分享原型 & 原型链的知识。

---

**参考：**

<LinkCard title="JavaScript 面向对象编程 — 阮一峰" url="http://www.ruanyifeng.com/blog/2010/05/object-oriented_javascript_encapsulation.html" description="封装、继承、多态的 JavaScript 实现方式" />

<LinkCard title="How Prototypal Inheritance Really Works" url="http://blog.vjeux.com/2011/javascript/how-prototypal-inheritance-really-works.html" description="深入理解 JavaScript 原型继承的真正工作机制" />
