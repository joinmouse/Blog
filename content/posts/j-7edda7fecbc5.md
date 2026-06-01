---
title: "对象"
date: 2017-06-03
slug_jianshu: 7edda7fecbc5
tags: ["简书"]
state: open
source: "https://www.jianshu.com/p/7edda7fecbc5"
source_kind: jianshu
---
## 1、OOP 指什么？有哪些特性

> Object Oriented Programming(面向对象编程)  
> 具有三大特性：封装、继承、多态

-   可以将一些属性和方法**_封装_**为**类**
-   **类**可以**_继承_**类（父类与子类）
-   将**类**实例化，就可以创建对象，对象拥有了 **类**的属性和方法、父类的属性和方法、爷爷类的属性和方法...
-   **多态：**不同对象的同一个方法，可以实现不同的功能

## 2、 如何通过构造函数的方式创建一个拥有属性和方法的对象?

```
//创建构造函数
function People(name){
    this.name = name;
    this.method = function(){
        console.log('this.name')
    }
}
//实例化一个对象p1
var p1 = new People('wuqi')
```

console下执行结果

## 3、prototype 是什么？有什么特性

> prototype表示原型，每个对象都会连接一个原型对象(通过隐藏的`__proto__`属性)

console测试结果

> 当我们通过对象字面量的形式创建一个obj对象的时候，它通过隐藏的属性`obj.__proto__`和原型对象`Object.prototype`建立连接，从而可以继承其属性  
> 原型连接只有在检索某个值的时候才会用到，当我们尝试去获取对象的某一个属性值的时候，但在索引中没有发现该对象拥有此属性名，那么JavaScript会试着从原型对象中获取属性值；若该原型对象也没有该属性，那么就再向上级原型查找...

下面p1,p2为Person构造函数实例化的对象

## 4、绘制原型图

原型图

## 5、创建一个 Car 对象，拥有属性name、color、status；拥有方法run，stop，getStatus

```
//创建构造函数，并通过原型为其添加方法
function Car(name,color,status){
  this.name = name;
  this.color = color;
  this.status = status;
}
Car.prototype.run = function(){
  console.log(this.name);
}
Car.prototype.stop = function(){
  console.log(this.color);
}
Car.prototype.getStatus = function(){
  console.log(this.status);
}
//实例化对象
var myCar = new Car('wuqi','red','ok')
```
