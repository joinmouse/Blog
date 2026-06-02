---
title: "从另一个角度思考JS中的new"
date: 2018-11-15
slug_jianshu: ab89bbac9041
tags: ["JS深入浅出"]
state: open
source: "https://www.jianshu.com/p/ab89bbac9041"
source_kind: jianshu
---
最近看下了方方大佬在知乎上一篇将new的文章很有启发，没有从面向对象的角度去思考，但却有着更底层的思考，我给自己总结记录一下。

#### 1、那个经典的例子开始说起

首先我们创建一个包含人类对象，它包含一些属性和方法

```
// person 对象
var person = {
  name: 'join',
  age: 12,
  say: function(){
    console.log('say')
  },
  jump: function(){
    console.log('jump')
  }
}
```

#### 2、现在我们需要一百个这样的person对象

下面用最笨的一个方法来实现以下

```
var  persons = []
var  person

for(var i=0; i<100; i++){
  person = {
    name: 'join',
    age: 12,
    say: function(){
      console.log('say')
    },
    jump: function(){
      console.log('jump')
    }
  }
  persons.push(pseron)
}
```

这样写看着很傻是吧，如果你对原型链有一个了解的话，那么这些方法可以用挂在原型链上，来解决重新创建的问题,来看一下改进版本。

```
var  persons = []
var  personShare = {
  say: function(){
    console.log('say')
  },
  jump: function(){
    console.log('jump')
  }
}

for(var i=0; i<100; i++){
  person = {
    // 每个人的name和age都是不一样的，所以写在这里了
    name: 'join',
    age: 12,
  }
  person.__proto__ = personShare
  // __proto__是一个隐藏属性，平时并不建议这么使用
  // person.__proto__.say = person.say = personShare.say
  // person.__proto__.jump = person.jump = personShare.jump
  
   persons.push(pseron)
}
```

#### 3、优雅的改进一下

然后这边可以发现的是不是将person分成两部分写起来不太优雅，接下来在进行一点优雅版本的改进,用一个函数将两部分合起来

```
person.prototype = {
  say: function(){
    console.log('say')
  },
  jump: function(){
    console.log('jump')
  }
}

function person(name, age) {
  //先来创建一个临时对象
  var temp = {}

  // 加上属性
  temp.name = name
  temp.age = age

  //加上方法
  temp.__proto__ =  person.prototype

  return temp
}

// 这样看起来起来是不是就很简洁了
var persons = []
var name = ['a','b','c', ...]
var age = [1,2,3, ...]
for(var i=0; i<100; i++){
  persons.push(person(name[i], age[i]))
}
```

#### 4、new 出来啦！！！

上面有这样一句代码

```
persons.push(person(name, age))
```

这里我们可以把`person(name, age)` 当作`new Person(name ,age)`来看的话，在出来理解下是不是感觉出其的相似，就是这样的,站在这个视角上，new 帮我们做了这几个事情

-   不用创建临时对象，因为 new 会帮你做（你使用「this」就可以访问到临时对象）；
-   不用绑定原型，因为 new 会帮你做（new 为了知道原型在哪，所以指定原型的名字为 prototype）；
-   不用 return 临时对象，因为 new 会帮你做；
-   不要给原型想名字了，因为 new 指定名字为 prototype。

我们这一次用new来写

```
function Person(name, age){
  this.age = age
  this.name = name
}
Person.prototype = {
  say: function(){
    console.log('say')
  },
  jump: function(){
    console.log('jump')
  }
}

var persons = []
for(var i=0; i<100; i++){
  persons.push(new Person(name, age))
}
```

我们可以从3中的代码看到4中代码，发现其实new本质上是JS之父发明给我们的语法糖，帮我们少些一些代码(一般new都是和构造函数在一起的，后面的函数一般用首字母大写用来区分和其他的普通函数的区别)

#### 5、 constructor属性

new 操作为了记录「临时对象是由哪个函数创建的」，会预先在person.prototype加一个constructor 属性，

```
person.prototype = {
  constructor: person
}
```

如果我们从新对person.prototype赋值就会覆盖掉constructor这个属性，所以我们应该这样写

```
person.prototype.say = function(){
  console.log('say')
}
person.prototype.jump = function(){
  console.log('jump')
}
```

哇，感觉自己现在对new的理解更透彻了，开心，耶

参考链接: [https://zhuanlan.zhihu.com/p/23987456](https://zhuanlan.zhihu.com/p/23987456)
