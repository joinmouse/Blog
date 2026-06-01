---
title: "四、深入之函数调用(Invocation)"
date: 2017-06-13
slug_jianshu: db2439d80feb
tags: ["简书"]
state: open
source: "https://www.jianshu.com/p/db2439d80feb"
source_kind: jianshu
---
#### 0x00、引言

当调用一个函数的时候会暂停当前函数的执行，传递控制权和参数给被调用函数。此时除了声明定义的形式参数。每个函数还会接收两个附加的参数：this和arguments，参数this在面向对象编程中很重要，它的值取决与调用模式，这里在深入之作用链域已经分析过this的特性。在JavaScript一共有四种调用模式：函数调用模式、方法调用模式、apply调用模式、构造器调用模式，下面将分别介绍

#### 0x01、从方法调用模式说起

**方法：** 当一个函数被保存为对象的一个属性的时候，就称它为方法。当一个方法被调用的时候，this就绑定到该对象。如

```
var myObject = {
  value：0，
  increment: function(){
    this.value += 2;
  }
}

myObject.increment();       //此时this指向myObject对象
document.writeln(myObject.value);    //2
```

> 方法的好处之一是可以使用this访问自己所属的对象，所以它可以从对象中取值或对对象进行修改。通过this可以获取它们所属对象上下文的方法称为公共方法(public method)

补充：使用call的角度`myObject.increment();`可以看作`myObject.increment.call(myObject);`

#### 0x02、函数调用模式

`var sum = add(3,4) //sum的值为7`  
使用此模式调用函数时，在非严格模式下this被绑定到window,这样当内部的函数的this指向window的时候，不能共享该方法对对象的访问，如：

```
document.addEventListener('click', function(e){
    console.log(this);
    setTimeout(function(){
        console.log(this);              //这里this指向window
    }, 200);
}, false);
```

下面提供一种解决思路：定义一个变量并将外部函数的this赋值给它，那么内部函数可以通过变量访问到this

```
document.addEventListener('click', function(e){
    var that = this
    setTimeout(function(){
        console.log(that);              //此刻通过that绑定到外部函数的his
    }, 200);
}, false);
```

#### 0x03、构造器调用模式

JavaScript是一门基于**原型继承**的语言，这样意味着对象可以直接从其他对象继承属性。  
对于构造函数，在该构造函数前面带上new来调用，那么**首先会创建一个连接到构造函数prototype的新对象，同时this会绑定到新对象上**，如：

```
//创建一个名为Que的构造函数，构造一个带有status属性的对象
var Que = function(str) {
  this.status = str
}
//给 Que的所有实例提供一个名为get_status的公共方法
Que.prototype.get_status = function() {
  return this.status
}
//构造一个Que实例
var  myQue = new Que('confused')
document.writeln(myQue.get_status())          //'confused'
```

#### 0x04、Apply/call调用模式

JavaScript是一门函数式的**面向对象**的编程语言，故函数可以拥有方法。  
apply方法可以构建一个参数数组传递给调用函数，该方法接受两个参数：第一个参数绑定给this的值，第二个就是一个参数数组，如：

```
//构造一个包含两个数组的数组，并将其相加
var array = [3,4];
var sum = add.apply(null,array)    //sum的值为7
```
