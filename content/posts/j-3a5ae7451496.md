---
title: "jQuery基础问答"
date: 2017-05-20
slug_jianshu: 3a5ae7451496
tags: ["简书"]
state: open
source: "https://www.jianshu.com/p/3a5ae7451496"
source_kind: jianshu
---
#### 1、库和框架的区别

-   库：是一个被封装的原生DOM操作和各种浏览器版本兼容的仓库，内部封装好了各种可调用的API，通过这些API的接口来实现我们所需要的功能，而不需要我们重复的写多余的代码，使得效率提高和程序简化
    
-   框架：可以理解为一个模版，通过这个基础的模版我们可以依据不同的项目需求写入不同程序
    

#### 2、jQuery 的作用

jQuery 强调的理念是写的少，做的多（write less,do more）。jQuery的作用主要在于通过对DOM操作出色的封装，简化之前复杂的DOM操作；且拥有出色的浏览器兼容性，让我们在调用中减少对浏览器兼容处理的麻烦。

#### 3、Jquery对象和DOM原生对象的区别，转换

-   DOM对象：每一份DOM都可以表示为“一棵树”，通常用`getElementById`或`querySelector`等方法来获取DOM元素节点，这样获取的DOM元素通常称之为DOM对象。
    
-   jQuery对象：通过jQuery包装DOM对象后产生的对象，jQuery对象是jQuery独有的。在jQuery对象中无法使用DOM对象的任何方法，这一点需要特别注意。
    
-   **转换：**  
    1、jQuery对象转成DOM对象
    

```
var $ct = $('#transform')           //jQuery对象
var ct = $ct[0]           //通过[index]方法转换相应DOM对象
```

2、DOM对象转换为jQuery对象

```
var ct = document.querySelector('#ct')       //DOM对象
var $ct = $(ct)        //通过$()将DOM对象包装起来，即可获得jQuery对象
```

#### 4、jquery中如何绑定事件？bind、unbind、delegate、live、on、off都有什么作用？推荐使用哪种？使用on绑定事件使用事件代理的写法？

-   jquery提供了四种事件监听的方式，分别为bind、delegate、live和on
-   **bind**  
    `bind(type,[data],function(eventObject))`  
    在选择的元素上绑定特定事件类型的监听函数，其中data为可选参数

```
//定位找出所有的div元素给其添加click事件的函数
$('div').bind('click',function(){
     console.log(this)
})
```

-   **unbind**  
    bind()的反向操作，从匹配的元素中解除绑定的事件,unbind(type)删除指定类型的事件
-   **delegate**  
    `delegate(selector,type,[data],fn)`  
    selector用来指定触发的元素目标，监听器被绑定在调用该方法的元素上
-   **live**  
    `live(type,[data],fn)`  
    live方法将监听绑定在document上，而不是元素
-   **on**  
    `on(type,[selector],[data],fn)`  
    当忽略可选元素selector的时候，方法和bind一样  
    当忽略可选元素data的时候，方法和delegate一样
-   **off**  
    on事件的解绑方法

_推荐使用：_ **on,on可以实现其他几种方法的效果**

#### 5、jquery 如何展示/隐藏元素

```
.show([speed],[callback])       //显示元素
.hide([speed],[callback])       //隐藏元素
.fadeIn([speed], [callback]      //淡入显示隐藏元素
.fadeOut([speed], [callback])：  //淡出隐藏显示元素
.slideUp([speed],[callback])     //以滑动的方式隐藏显示元素
.slideDown([speed],[callback])     //以滑动的方式隐藏显示元素

.toggle([speed], [callback])        //显示隐藏元素，隐藏显示元素
fade.toggle([speed], [callback])    //淡入淡出显示隐藏元素，隐藏显示元素

- speed：  规定速度，取值：'slow', 'normal', 'fast'或毫秒
- callback：显示或隐藏后执行的函数
```

#### 6、 jquery 动画如何使用？

```
animate(properties, [options])
- properties是一个CSS属性和值的对象，动画将根据这组对象移动
- optioins  规定动画的额外选项
取值：
speed 设置动画速度
easing 规定在不同动画结点要使用的动画速度函数
callback animate函数执行完后，要执行的函数
step 规定动画的每一步完成后要执行的函数
queue 布尔值 指示是否在效果队列中放置动画，如果为false，则动画立即开始
specialEasing 来自properties参数的一个或多个CSS属性映射，以及他们对应的easing函数
```

#### 7、如何设置和获取元素内部 HTML 内容？如何设置和获取元素内部文本？

```
$('xxx').html()           //无参数，用于返回元素的innerHTML
$('xxx').html(string)       //有参数，设置元素为内部HTML内容

$('xxx').text()           //无参数，用于返回元素的innerText
$('xxx').text(string)       //有参数，设置元素的内部文本
```

#### 8、如何设置和获取表单用户输入或者选择的内容？如何设置和获取元素属性？

```
.val([string])
无参数时，获取表单用户的输入值
有参数时，设置表单的输入值

.attr('name')
获取元素特定属性的值
.attr('name','your name')     //传递两个参数，即属性名称和对应的值
设置单个的属性值
```
