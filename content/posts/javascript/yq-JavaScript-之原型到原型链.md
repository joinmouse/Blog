---
title: "JavaScript 之原型到原型链"
date: 2022-02-20
tags: ["语雀"]
source_kind: yuque
---

通过上篇的文章我们已经对原型设计的动机有了一个认识，接下来接完整的说下原型到原型链的整个完整图。

JavaScript 是一门基于原型的语言，这点和基于类的语言经验（如 Java 或 C++）来说在语言特性层面是不一样的，它本身并不提供一个 class 的实现（尽管在 ES2015/ES6 中引入了 class 关键字，但只是语法糖，JavaScript 仍然是基于原型的），从一个例子出发：

```javascript
// 在JS 中一般默认大写的函数名是一个构造函数
function Person() {
  //
}
Person.prototype.name = 'joinmouse';
// 实例化
var person1 = new Person();
var person2 = new Person();
console.log(person1.name)  // joinmouse
console.log(person2.name)  // joinmouse
```

通过这个例子我们可以发现经过实例化的对象 person1 和 person2 都有一个 name 属性，"继承"自 Person 的 name，这里 `Person.prototype` 也就是 person1 和 person2 的原型。

## 一、原型（prototype）

原型：每一个 JavaScript 对象（null 除外）在创建的时候就会与之关联另一个对象，这个对象就是我们所说的原型，每一个对象都会从原型"继承"属性。

## 二、\_\_proto\_\_

每一个 JavaScript 对象（除了 null）都具有的一个属性叫 `__proto__`，这个属性会指向该对象的原型，这个属性并不是 JS 标准而是许多浏览器实现的一个属性，我们在编程过程中一般并不会使用该属性（隐藏属性）。从 ES6 开始，我们可以通过 `Object.getPrototypeOf()` 和 `Object.setPrototypeOf()` 访问器去访问了。

这里我们可以理解为每一个实例化的对象就是通过 `__proto__` 来指向它的原型的：

```javascript
function Person() {
   //代码
}
var person = new Person();
console.log(person.__proto__ === Person.prototype);  // true
```

## 三、constructor

每个原型都有一个 constructor 属性指向对应的构造函数：

```javascript
function Person() {
  // 业务...
}
console.log(Person === Person.prototype.constructor); // true
```

上面这张图就可以完整的反映出来构造函数、实例原型、和实例的关系，这个关系很重要，可以说后面的原型链和 JS 的面向对象的实现都是基于这一块的知识的。

## 四、原型和实例

我们现在对第一个例子进行下调整：

```javascript
function Person() {
  //
}
Person.prototype.name = 'joinmouse';
// 实例化
var person1 = new Person();
var person2 = new Person();
person1.name = 'cloud'
console.log(person1.name)  // cloud
console.log(person2.name)  // joinmouse
```

我们这里分析下，person1 因为自己声明了一个 name 属性，所以 person1 这个对象就直接取自己的 name，但是 person2 本身是没有 name 这个属性的，它是如何获取的呢？

`person2.__proto__.name === Person.prototype.name`，这里面的关键就是如果对象发现自己身上没有对应的属性或者方法，就会去查找自己的原型的属性（通过 `__proto__` 这个属性），没错这就是原型链的概念，那么原型的原型又是什么呢？

原型本身也是一个对象，对象就是通过 Object 构造函数生成的，即 `Person.__proto__ === Object.prototype`，那么这里我们更新下关系图。

## 五、原型链

那么 `Object.prototype` 的原型呢？是 null：

```javascript
console.log(Object.prototype.__proto__ === null) // true
// person -> Person -> Object.prototype -> null
```

关于 null 和 undefined 的区别，我们可以参考阮一峰的文章《undefined 与 null 的区别》。
