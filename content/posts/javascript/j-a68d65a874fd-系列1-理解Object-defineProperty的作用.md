---
title: "系列1-理解Object.defineProperty的作用"
date: 2017-11-20
slug_jianshu: a68d65a874fd
tags: ["JS深入浅出"]
state: open
source: "https://www.jianshu.com/p/a68d65a874fd"
source_kind: jianshu
---
### 1、简介

我们知道对象是由多个名/值对组成的无序集合，对象的每个属性可以有任何类型的值，如：

```
var obj = new Object
obj.name = "wu"  //添加描述
obj.say = function() {} //添加行为
```

按照mdn的定义，`Object.defineProperty()`直接在一个对象上定义一个新的属性或修改一个对象的现有属性，并返回这个对象。

语法： `Object.defineProperty(obj, prop, descriptor)`

-   obj = > 定义属性的对象
-   prop = > 定义或修改属性的名
-   descriptor = > 定义或修改属性描述符

### 2、描述

对象中属性描述符就两种主要的形式：数据描述符和存取描述符

在详细写这两种描述符之前，我们先回想一下当通过普通的赋值来为一个对象添加普通的属性时，会创建在属性枚举期间显示其属性(使用`for...in`或者`Object.keys`方法)，这些属性的值可以被**改变或删除**(而`Object.defineProperty()`方法在默认情况下属性值是不可变的)

-   数据描述符和存取描述符均具有以下可选键值：  
    **configurable**  
    当且仅当该属性的 configurable 为 true 时，该属性描述符才能够被改变，同时该属性也能从对应的对象上被删除。**默认为 false**  
    **enumerable**  
    当且仅当该属性的enumerable为true时，该属性才能够出现在对象的枚举属性中()。默认为 false。
    
-   数据描述符同时具有以下可选键值：  
    **value**  
    该属性的值，可以是任何有效的JavaScript的值。**默认为undefined**  
    **writable**  
    当且仅当该属性writable为true时，该属性才可以被赋值的运算符改变。**默认为false**
    
-   存取描述符同时具有以下可选键值：  
    **get**  
    一个给属性提供 getter 的方法，如果没有 getter 则为 undefined。**该方法的返回值作为属性的值，默认为undefined**  
    **set**  
    一个给属性提供 setter 的方法，如果没有 setter 则为 undefined。**该方法将接受唯一的参数，并将该参数的新值分配给该属性。默认的是undefined**
    

### 3、Demo

前面的基础概念有一定的了解后我们可以通过demo来更好的认识`Object.definePorperty()`这个方法

-   创建属性

```
var obj = {}

//对象obj拥有属性a,值为37
Object.defineProperty(obj, "a", {
  value : 37,
  writable : true,
  enumerable : true,
  configurable : true
});

var bValue
//对象中添加一个属性(有关存取描述符的）
Object.defineProperty(obj,"b",{
  get: function() {
    return bValue
  }
  set: function(newValue) {
    return bValue = newValue
  }
  enumerable : true,
  configurable : true
})

// 对象o拥有了属性b，值为38
o.b = 38  // o.b的值现在总是与bValue相同，除非重新定义o.b
```

-   修改属性

```
//writable
var obj = {}

Object.defineProperty(obj, 'a', {
  value: 37,
  writable: false
});
console.log(obj.a)  //37
o.a = 25
console.log(obj.a)  //37,The assignment didn't work.
```

Enumerable 特性:  
`enumerable`定义了对象的属性是否可以在 [`for...in`](https://link.jianshu.com?t=https://developer.mozilla.org/zhCN/docs/Web/JavaScript/Reference/Statements/for...in) 循环和[`Object.keys()`](https://link.jianshu.com?t=https://developer.mozilla.org/zhCN/docs/Web/JavaScript/Reference/Global_Objects/Object/keys) 中被枚举。

```
var o = {};
Object.defineProperty(o, "a", { value : 1, enumerable:true });
Object.defineProperty(o, "b", { value : 2, enumerable:false });
Object.defineProperty(o, "c", { value : 3 }); // enumerable defaults to false
o.d = 4; // 如果使用直接赋值的方式创建对象的属性，则这个属性的enumerable为true

for (var i in o) {    
  console.log(i);  
}
// 打印 'a' 和 'd' (in undefined order)

Object.keys(o); // ["a", "d"]

o.propertyIsEnumerable('a'); // true
o.propertyIsEnumerable('b'); // false
o.propertyIsEnumerable('c'); // false
```

Setters 和 Getters  
下面的例子展示了如何实现一个自存档对象

```
function Archiver() {
  var temperature = null;
  var archive = [];

  Object.defineProperty(this, 'temperature', {
    get: function() {
      console.log('get!');
      return temperature;
    },
    set: function(value) {
      temperature = value;
      archive.push({ val: temperature });
    }
  })

  this.getArchive = function() { return archive; };
}

var arc = new Archiver();
arc.temperature; // 'get!'
arc.temperature = 11;
arc.temperature = 13;
arc.getArchive();   // [{ val: 11 }, { val: 13 }]
```

参考链接：[https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global\_Objects/Object/defineProperty](https://link.jianshu.com?t=https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)
