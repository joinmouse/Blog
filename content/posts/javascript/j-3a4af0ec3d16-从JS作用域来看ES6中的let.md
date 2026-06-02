---
title: "从JS作用域来看ES6中的let"
date: 2018-03-26
slug_jianshu: 3a4af0ec3d16
tags: ["作用域", "ES6"]
state: open
source: "https://www.jianshu.com/p/3a4af0ec3d16"
source_kind: jianshu
---
#### 简介

关于ES6中let的介绍网上已经有相当多的博客都写到了，比如支持块级作用域、不存在变量提升等等特性，我这里就从变量的作用域角度来写一篇文章。

#### 作用域

我们现在来看一段代码需求，我们需要只暴露一个b的全局变量，但这个b又会使用到变量a，在ES6之前我们很容易想到用立即执行函数来解决

```
(function (){
  var a = 1
  window.b = function() {
    console.log(a)
  }
}())
b()
```

这是一段匿名的立即执行函数，通过执行这段代码可以实现只暴露一个b的全局变量，而变量a是这块函数的自有化变量。

下面我们来看ES6中有了let后，我们可以怎么重构上面的这段代码，来实现同样的功能

```
{
  let a = 1
  window.b = function() {
    console.log(a) 
  }
}
b()
```

#### 总结

如果我们观察这两个片段后可以发现，在ES6中引入let后支持块级作用域后，可以使编写的代码更简洁更易读，小伙伴有什么问题欢迎私信我。。。
