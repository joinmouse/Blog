---
title: "JavaScript之原型到原型链"
date: 2019-04-18
issue_number: 6
tags: ["JS深入浅出"]
state: open
source: "https://github.com/joinmouse/Blog/issues/6"
---
### 一、原型(prototype)
首先我们需要明确知道的一点是，**JavaScript是一门基于原型的语言**，这点和基于类的语言经验 (如 Java 或 C++) 来说在语言特性层面是不一样的，它本身并不提供一个class的实现（尽管在ES2015/ES6 中引入了 class 关键字，但只是语法糖，JavaScript 仍然是基于原型的）

每个函数都有一个 prototype 属性，下面我们从一个例子出发
```
// 在JS中一般默认大写的函数名是一个构造函数
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

通过这个例子我们可以发现经过实例化的对象person1和person2都有一个name属性，"继承"自Person的name，这里Person.prototype也就是person1 和 person2 的原型
原型: **每一个JavaScript对象(null除外)在创建的时候就会与之关联另一个对象，这个对象就是我们所说的原型，每一个对象都会从原型"继承"属性。**
![prototype1](https://user-images.githubusercontent.com/18349016/56335154-f948d280-61cd-11e9-97f6-fd36e66b8f55.png)

### 二、__proto__
每一个JavaScript对象(除了 null )都具有的一个属性叫__proto__，这个属性会指向该对象的原型，这个属于语法层面创造的，我们在编程过程中一般并不会使用该属性
```
function Person() {
}
var person = new Person();
console.log(person.__proto__ === Person.prototype);  // true
```
这里我们可以理解为每一个实例化的对象就是通过__proto__来指向它的原型的
![prototype2](https://user-images.githubusercontent.com/18349016/56335321-9ad02400-61ce-11e9-9446-d110c55691a9.png)

### 三、constructor
每个原型都有一个 constructor 属性指向对应的构造函数
```
function Person() {
}
console.log(Person === Person.prototype.constructor); // true
```
![prototype3](https://user-images.githubusercontent.com/18349016/56335479-3b264880-61cf-11e9-913e-161842b73e1f.png)

上面这张图就就可以完整的反映出来构造函数、实例原型、和实例的关系，这个关系很重要，可以说后面的原型链和js的面向对象的实现都是基于这一块的知识的

### 四、原型和实例
我们现在对第一个例子进行下调整合
```
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
我们这里分析下，person1因为自己声明了一个name属性，所以person1这个对象就直接取自己的name, 但是person2本身是们没有name这个属性的，它是如何获取的呢？
`person2.__proto__ .name ===  Person.prototype.name`，这里面的关键就是如果对象发现自己身上没有对应的属性或者方法，就会去查找自己的原型的属性(通过__proto__这个属性), 没错这就是原型链的概念，那么原型的原型又是什么呢？

### 五、原型链
原型本身也是一个对象，对象就是通过 Object 构造函数生成的，即`Person.__proto__ === Object.prototype` 那么这里我们更新下关系图应该是:
![prototype4](https://user-images.githubusercontent.com/18349016/56336140-ca346000-61d1-11e9-8dc0-236506cfc644.png)
那么那 Object.prototype 的原型呢？是null
```
console.log(Object.prototype.__proto__ === null) // true
```
关于null和undefine的区别，我们可以参考阮一峰的文章[《undefined与null的区别》](http://www.ruanyifeng.com/blog/2014/03/undefined-vs-null.html)



