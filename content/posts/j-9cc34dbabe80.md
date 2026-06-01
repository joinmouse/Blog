---
title: "jQuery源码解读-理解架构"
date: 2017-08-01
slug_jianshu: 9cc34dbabe80
tags: ["简书"]
state: open
source: "https://www.jianshu.com/p/9cc34dbabe80"
source_kind: jianshu
---
### 1、jQuery设计理念

正如jQuery的标题：The Write Less,Do More，无疑这就是jQuery的核心理念,这里面让人激动的设计有简洁的API、优雅的链式、强大的查询与便捷的操作。  
**简洁的API**

```
$.on
$.css
$.ajax
….
```

**优雅的链式**

```
var  xhr = $.ajax( "./example.php" )
    .done(function() { alert("success"); })
    .fail(function() { alert("error"); })
```

**类CSS的选择器**

```
$("div, span, p.myClass" )
$("div span:first-child")
...
```

**便捷的操作**

```
$("p").removeClass("myClass noClass").addClass("yourClass");
$("ul li:last").addClass(function(index) {
   return "item-" + index;
});
$('.container').append($('h2'));
…
```

### 2、立即调用表达式

任何库或者框架设计的第一个需要考虑的点就是解决命名空间和全局变量污染的问题，jQuery利用了JavaScript函数作用域的特性，采用**立即执行函数**包裹了自身的方法来解决这个问题。建议在下面的阅读前，如果对立即执行函数不是很理解的小伙伴们，先阅读下我写的另一篇文章：[JavasSript-立即执行函数](https://www.jianshu.com/p/d0ff9e2f6e79)

jQuery的立即调用函数表达式的写法吧  
**one**

```
(function(window, factory) {
    factory(window)
}(this, function() {
    return function() {
       //jQuery的调用
    }
}))
```

相必很多同学看到这里，和我当时一样都很懵逼吧，其实不用着急，对于复杂的代码我们学会将其拆分为我们熟悉的知识结构，然后简化它就好了。这里我们可以开始剖解它

```
//相信这样大家很容易理解，对啊就是一个简单的匿名函数执行函数的两种写法
(function() {
    /*code*/
})()
or
(function() {
    /*code*/
}())
```

下面我们再看一个传参的立即执行函数

```
(function(a,b) {
    /*code*/
}(c,d))
```

我们知道在javascript中函数作为一等公民，我们可以将一个函数作为参数传入另一个函数中

```
//这里的factory是一个形参函数
(function(window, factory) {
    factory(window)
}(this, function() {    
    return function() {
       //jQuery的调用
    }
}))
//整个这样一段就是给上面的匿名函数传入第一个实参this，第二个实参一个function，并立即执行
(this, function() {    
    return function() {
       //jQuery的调用
    }
})
```

相比上面的经过简化分析后，大家都应该看的懂，那么想必大家肯定有一个疑问为什么要搞得怎么复杂，其实我前面已经说过了**任何库或者框架设计的第一个需要考虑的点就是解决命名空间和全局变量污染的问题**，下面我们接着看第二种简单点的写法

**two**

```
var factory = function(){
    return function(){
        //执行方法
    }
}
var jQuery = factory();
```

其实上面的代码效果和第一种写法是等同的，纳尼？想必写道这里很多人会说那你前面搞的那么复杂干嘛，故作高深的装逼，哈哈，请接着看。  
上面的factory函数有点变成了简单的工厂方法模式，需要自己调用，当时我们需要的是一个“自执行”的啊，并不是另外调用的，而且上面的写法虽然简单，却很容易造成全局变量的污染，这是一种魔鬼。这里顺便安利一下《JavaScript语言精粹》这本书哈，这本书将告诉那些是JS中优雅的特性和尽量避免使用的特性。

下面我们再看一下最后一种写法吧  
**three**

```
(function(window, undefined) {
    var jQuery = function() {}
    // ...
    window.jQuery = window.$ = jQuery;
})(window);
```

从上面的代码可看出，自动初始化这个函数，让其只构建一次。详细说一下这种写法的优势：

-   window和undefined都是为了减少变量查找所经过的scope作用域。当window通过传递给闭包内部之后，在闭包内部使用它的时候，可以把它当成一个局部变量，显然比原先在window scope下查找的时候要快一些
-   undefined也是同样的道理，其实这个undefined并不是JavaScript数据类型的undefined，而是一个普普通通的变量名。只是因为没给它传递值，它的值就是undefined，undefined并不是JavaScript的保留字。

可能会有疑问，为什么要传递一个undefined啊？这里我们可以这样理解：**Javascript 中的 undefined 并不是作为关键字，因此可以允许用户对其赋值 ，简单点就是如果函数调用不传递，参数默认就是undefined**

最后总结一下jQuery为什么要创建这样的一个外层包裹，其原理又是如何？

-   首先我们分析下写法2，其实这就可以理解为一个简单的工厂函数啊，我们可以在下面执行n次调用。
-   那么写法3，首先我们这里需要区分2个概念一个是匿名函数，一个是自执行。顾名思义，匿名函数，就是没有函数名的函数，也就是不存在外部引用了。这样匿名函数可以有效的保证在页面上写入JavaScript，而不会造成全局变量的污染，之后通过小括号，让其加载的时候立即初始化，这样就形成了**一个单例模式的效果从而只会执行一次**。

其实这里就是已经再进一步就涉及了设计模式中的工厂模式和单例模式，需要了解的可以参考下我的github：[https://github.com/joinmouse/Design-Mode-](https://link.jianshu.com?t=https://github.com/joinmouse/Design-Mode-)
