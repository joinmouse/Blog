---
title: "jQuery源码解读-核心机制(2)"
date: 2017-08-12
slug_jianshu: c7084300bcf0
tags: ["简书"]
state: open
source: "https://www.jianshu.com/p/c7084300bcf0"
source_kind: jianshu
---
-   核心机制——分离构造器

### 1、new操作符构建对象

通过new操作符构建一个对象，一般经过四步：

-   创建一个新对象
-   将构造函数的作用域赋给新对象（this就指向了这个新对象）
-   执行构造函数中的代码
-   返回这个新对象

其实new操作符主要是把原型链跟实例的this关联起来，这才是最关键的一点，所以我们如果需要原型链就必须要new操作符来进行处理。否则this则变成window对象了。

下面直接来jQuery这个结构中，常见的"类式写法"

```
var $ = AjQuery = function(selector) {
    this.selector = selector;
    return this
}

AjQuery.fn = AjQuery.prototype = {
    selectorName:function(){
        return this.selector;
    },
    constructor: AjQuery
}

var a = new $('abc')      //实例化创建一个对象
a.selectorName()         //abc ,获得选择器的名字
```
