---
title: "jQuery基础-jQuery对象和DOM对象"
date: 2017-07-20
slug_jianshu: 9812f805a2b3
tags: ["简书"]
state: open
source: "https://www.jianshu.com/p/9812f805a2b3"
source_kind: jianshu
---
### 1、jQuery对象转化成DOM对象

jQuery库在本质上还是JavaScript代码，它只是对JavaScript语言进行包装处理，为的是提供更好更方便快捷的DOM处理与开发中经常使用的功能。我们使用jQuery的同时也能混合JavaScript原生代码一起使用。在很多场景中，我们需要jQuery与DOM能够相互的转换，它们都是可以操作的DOM元素，**jQuery是一个类数组对象，而DOM对象就是一个单独的DOM元素**

jQuery是一个类数组对象，因此我们可以利用数组下标的方式读取到jQuery中的DOM对象：

-   HTML代码

```
<div>1</div>
<div>2</div>
<div>3</div>
```

-   JavaScript代码

```
var $div = $('div')         //jQuery对象,找到所有的div元素（三个）
var div1 = $div[0]           //转化成DOM对象，通过数组下标索取到第一个div元素
div1.style.color = 'red'    //操作dom对象的属性，修改第一个div元素的颜色
```

查看效果:[Github Page](https://link.jianshu.com?t=https://joinmouse.github.io/jQuery-reading/jQuery%E5%9F%BA%E7%A1%80-%E5%B1%9E%E6%80%A7%E5%92%8C%E6%A0%B7%E5%BC%8F/jquery-dom%E5%AF%B9%E8%B1%A1%E8%BD%AC%E5%8C%96/index1.html)  
查看源码： [Github](https://link.jianshu.com?t=https://github.com/joinmouse/jQuery-reading/blob/master/jQuery%E5%9F%BA%E7%A1%80-%E5%B1%9E%E6%80%A7%E5%92%8C%E6%A0%B7%E5%BC%8F/jquery-dom%E5%AF%B9%E8%B1%A1%E8%BD%AC%E5%8C%96/index1.html)

### 2、DOM对象转化成jQuery对象

对于一个DOM对象，只需要用$()把DOM对象包装起来，便可以获得一个jQuery对象，方法：$(DOM对象)，就可以调用jQuery的方法啦

-   HTML代码

```
<div>1</div>
<div>2</div>
<div>3</div>
```

-   JavaScript代码

```
var div = document.querySelector('div') //DOM获取对象
var $div = $(div)        //通过$(dom对象)转换为jQuery对象
var $first = $div.first();       //调用jQuery方法，找到第一个div元素
$first.css('color','red')       //为第一个元素设置颜色
```

查看效果：[Github Page](https://link.jianshu.com?t=https://joinmouse.github.io/jQuery-reading/jQuery%E5%9F%BA%E7%A1%80-%E5%B1%9E%E6%80%A7%E5%92%8C%E6%A0%B7%E5%BC%8F/jquery-dom%E5%AF%B9%E8%B1%A1%E8%BD%AC%E5%8C%96/index2.html)  
查看源码：[Github](https://link.jianshu.com?t=https://github.com/joinmouse/jQuery-reading/blob/master/jQuery%E5%9F%BA%E7%A1%80-%E5%B1%9E%E6%80%A7%E5%92%8C%E6%A0%B7%E5%BC%8F/jquery-dom%E5%AF%B9%E8%B1%A1%E8%BD%AC%E5%8C%96/index2.html)

### 3、jQuery选择器之特殊选择器this

以前刚接触jQuery的时候，对$(this)和this的区别模糊不清，那么这两者有什么区别呢？  
我们知道在JavaScript中this是指当前上下文的对象，同时这个上下文的对象是可以被动态的改变的（call、apply等方法），同样在原生的DOM中this指向的也是当前的html元素对象。下面看一个例子：

-   给元素p绑定一个点击事件

```
p.addEventListener('click',function(){
    this.style.color = 'red'  //这里的this就是当前的元素对象p
},false)
```

-   jquery的处理方法

```
$('p').on('click',function(){
    var $this = $(this)   
    $this.css('color','red')   //将this转换为jquery对象，这样可以调用jQuery的方法和属性值。
})
```

查看效果：[Github Page](https://link.jianshu.com?t=https://joinmouse.github.io/jQuery-reading/jQuery%E5%9F%BA%E7%A1%80-%E5%B1%9E%E6%80%A7%E5%92%8C%E6%A0%B7%E5%BC%8F/jquery%E7%89%B9%E6%AE%8A%E9%80%89%E6%8B%A9%E5%99%A8-this/index.html)  
查看源码：[Github](https://link.jianshu.com?t=https://github.com/joinmouse/jQuery-reading/blob/master/jQuery%E5%9F%BA%E7%A1%80-%E5%B1%9E%E6%80%A7%E5%92%8C%E6%A0%B7%E5%BC%8F/jquery%E7%89%B9%E6%AE%8A%E9%80%89%E6%8B%A9%E5%99%A8-this/index.html)

> 总结：  
> |--this，表示当前的上下文对象是一个html对象，可以调用html对象所拥有的属性和方法。  
> |--$(this),代表的上下文对象是一个jquery的上下文对象，可以调用jQuery的方法和属性值。
