---
title: "jQuery动画与ajax"
date: 2017-05-26
slug_jianshu: c286c5287d50
tags: ["jQuery", "源码解读", "Vue"]
state: open
source: "https://www.jianshu.com/p/c286c5287d50"
source_kind: jianshu
---
### 1、 jQuery 中， $(document).ready()是什么意思？

主要用来加载DOM，替代原生JavaScript的window.onload方法。通过该方法，可以在DOM载入就绪时就对其进行操作并调用执行它所绑定的函数  
$(document).ready()与window.onload的区别  
**1、执行时机：**假设网页中图片添加某些行为，window.onload必须等到每一幅图片加载完毕之后才可以进行操作；而jQuery中的$(document).ready()方法设置，只需要DOM就绪可以操作，而无需等到所有图片下载完毕。  
**2、使用覆盖：**同时执行多个时，window.onload会覆盖前面的，而jQuery中的$(document).ready不会  
$(document).ready()书写方式

```
$(document).ready(function(){
      //do something
});
//简写方式
$(function(){
      //do something
})
```

### 2、$node.html()和$node.text()区别

```
$node.html()       //获取选择节点元素的html内容，包含html标签和文本内容

$node.html()       //获取选择节点元素的文本内容，不包含html标签，仅文本内容

```

### 3、$.extend 的作用和用法?

作用：当我们提供两个或多个对象给$.extend()，对象的所有属性都添加到目标对象（target参数）  
jQuery.extend(\[deep\],target \[,object1\] \[,objectN\])

-   deep  
    类型：boolean  
    如果是true，合并为递归（又为深拷贝）
    
-   target  
    类型：object  
    对象扩展，这里接受新的属性
    

```
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>jQuery extend demo</title>
  <script src="https://code.jquery.com/jquery-3.1.0.js"></script>
</head>
<body>
  <div class="obj1"></div>
  <div class="obj2"></div>
  <div class="log1"></div>
  <div class="log2"></div>
  <div class="log3"></div>

  <script>
    var obj1={
      apple: 0,
      ban: {weight: 20},
      che: 100
    }
    var obj2={
      ban: {height: 30},
      durian: 100
    }
    var arr1 = {}
    var arr2 = {}
    
    $('.obj1').append(JSON.stringify(obj1))
    $('.obj2').append(JSON.stringify(obj2))

//merge obj2 into obj1
//obj1,obj2的属性将被浅拷贝到目标对象(arr1)
$.extend(arr1,obj1,obj2);
$('.log1').append(JSON.stringify(arr1))

//obj2所有属性值都被融合到了obj1中
$.extend( true, obj1, obj2 );
$( ".log2" ).append( JSON.stringify(obj1))

//obj1,obj2所有的属性值都被融合进了目标对象（合并递归->深拷贝）
$.extend(true,arr2,obj1,obj2);
$('.log3').append(JSON.stringify(arr2))

  </script>
</body>
</html>
```

### 4、jquery链式调用

-   举例：  
    `$(node).addClass('add').removerClass('remove').next()`  
    //链式调用就是将使选中元素的单个方法执行后返回本身，即$(node).addClass 调用后return $(node),其他方法调用同理

### 5、jQuery 中 data 函数的作用？

jQuery的data函数主要用于方便用户给标签绑定数据，可以传递两个参数key和value或者一个object对象更新数值对

```
$("body").data("day":02)
//两种写法功能是一样的，只不过传参不一样 
var obj = {"day":02}
$("body").data(obj)
```
