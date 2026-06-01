---
title: "jQuery基础-事件篇"
date: 2017-07-23
slug_jianshu: e5d08b3d2337
tags: ["简书"]
state: open
source: "https://www.jianshu.com/p/e5d08b3d2337"
source_kind: jianshu
---
### 1、鼠标事件

常见的click等事件这里不做详细介绍

-   1、mousemove: 用来监听用户移动的操作，基于移动的机制可以做出拖动、拖拽等一系列的效果出来。  
    下面写一个监听鼠标移动的X位置的事件：  
    HTML

```
<style>
    .content {
      width: 300px;
      height: 200px;
      background: red;
    }
  </style>

  <div class="test">
    <div class="content">
      <p>鼠标在红色区域移动的事件</p>
      <p>移动的X的位置：</p>
    </div>
  </div>
```

mousemove()方法

```
$('.content').mousemove(function(e){
      $(this).find('p:last').html('移动的X的位置：'+e.pageX)
})
```

-   2、mouseover与mouseout事件  
    jQuery当中提供了这样两个事件来监听用户的移入移出操作  
    用法其实与上面的mousemove类似，这里就不写例子说明了，主要是为了总结鼠标常用的监听事件

### 2、表单事件

-   1、focus和blur事件  
    分别是对获取焦点和失去焦点的监听，常用于表单的input标签中  
    HTML

```
<div class="test">
    点击触发焦点
    <input type="text" value="hello">
  </div>
```

focus和blur事件

```
    let valText = $('.test input').val()
    //获取焦点的时候，清空input的值
    $('.test input').focus(function(){
      if(valText == 'hello') {
        $(this).val('')
      }
    })
    
    //失去焦点的时候input的占位值是'请输入'
    $('.test input').blur(function(){
      $(this).val('请输入')
    })
```

-   2、change事件  
    input元素、textarea和select元素的值都可以发生改变，当前改变的时候，我们可以通过change事件去监听这个改变的动作。

input元素:

> 监听value值的变化，当有改变时，失去焦点后触发change事件。对于单选按钮和复选框，当用户用鼠标做出选择时，该事件立即触发。

select元素:

> 对于下拉选择框，当用户用鼠标作出选择时，该事件立即触发

textarea元素:

> 多行文本输入框，当有改变时，失去焦点后触发change事件

下面用一个例子说明：  
HTML

```
    <div class="left">
        <div class="aaron1">input：
            <input class="target1" type="text" value="监听input的改变" />
        </div>
        <div class="aaron2">select：
            <select class="target2">
                <option value="option1" selected="selected">Option 1</option>
                <option value="option2">Option 2</option>
            </select>
        </div>
        <div class="aaron3">textarea：
            <textarea class="target2" rows="3" cols="20">多行的文本输入控件</textarea>
        </div>
    </div>
    <p>输出结果：</p>
    <div id="result"></div>
```

jQuery的change事件

```
//监听input值的改变
$('.target1').change(function(e) {
        $("#result").html(e.target.value)
});
//监听select
$('.target2').change(function(e) {
        $("#result").html(e.target.value)
});
//监听textarea
$('.target3').change(function(e) {
        $("#result").html(e.target.value)
});
```

[代码演示](https://link.jianshu.com?t=https://joinmouse.github.io/jQuery-reading/jQuery%E5%9F%BA%E7%A1%80-%E4%BA%8B%E4%BB%B6/change.html)

### 3、事件的绑定和解绑

jQuery on()是官方推荐的绑定事件的一个方法

基本用法：`on(events,[selector],[data],handler(eventObject))`  
先可以看一个简单的用法，绑定一个点击事件:

```
$('element').on('click',function(){
   //do something
})
```

多个事件绑定同一个函数：

```
$('element').on("mouseover mouseout" ,function(){
    //do something
})
```

多个事件绑定不同的函数:

```
$('element').on({
  mouseover:function(){},
  mouseout:function(){}
})
```

on还有高级的用法就是实现事件委托，下面我们举一个例子来说明  
HTML

```
<div class="left">
  <div class="content">
     <a>点击这里</a>
  </div>
</div>
```

事件委托

```
//事件的绑定在最上层的body上，当用户触发a元素上，事件将向上冒泡，一直到body上。
//但是但我们提供了第二个参数（这里是a）,那么事件在冒泡过程遇到选择器匹配元素（a），就触发回调函数的处理。
$('body').on('click', 'a', function(e) {
       alert(e.target.textContent)
    })
```

总结一下上面的事件委托：  
首先给body绑定一个click事件  
其次没有直接a元素绑定点击事件  
通过委托机制，点击a元素的时候，事件触发；点击其他地方事件并不会被触发

[代码演示](https://link.jianshu.com?t=https://joinmouse.github.io/jQuery-reading/jQuery%E5%9F%BA%E7%A1%80-%E4%BA%8B%E4%BB%B6/on%E4%BA%8B%E4%BB%B6%E5%A7%94%E6%89%98.html)

-   卸载事件off()方法  
    通过offIO方法移除该绑定

### 4、事件对象的使用

事件中的Event对象比较容易被我们所忽略，但有时候掌握它对我们也是很有用的  
一个标准的'click'点击事件:

```
$(elem).on("click",function(event){
   event //事件对象
})
```

下面在来通过一个小例子来了解事件对象的作用  
HTML

```
<ul>
    <li class="even1"></li>
    <li class="even2"></li>
    <li class="even3"></li>
</ul>
```

上面的ul有3个子元素，若需要响应每一个li事件，那么我们按照常规方法需要给所有的li都单独绑定一个事件监听，这样就显得很复杂。同时我们注意到所有的li都有一个共同的父元素，所有的事件都是一致的，那么我们可以用到on()绑定事件中的高级用法'事件委托'

> 事件没直接和li元素发生关系，而且绑定父元素了。由于浏览器有事件冒泡的这个特性，我们可以在触发li的时候把这个事件往上冒泡到ul上，因为ul上绑定事件响应所以就能够触发这个动作了,那么我们需要如何才知道是触发了哪一个li元素了？

这里就可以引出事件对象了：

-   事件对象是用来记录一些事件发生时的相关信息的对象。事件对象只有事件发生时才会产生，并且只能是事件处理函数内部访问，在所有事件处理函数运行结束后，事件对象就被销毁

上面的定义说的有点复杂，简单的我们需要记住事件的event.target这个属性，**event.target代表当前触发事件的元素，可以通过当前元素对象的一系列属性来判断是不是我们想要的元素**

还是通过一段代码例子来演示说明,这里的代码就是上面拓展，大家运行以下就明白了event.target的用法：[代码](https://link.jianshu.com?t=https://github.com/joinmouse/jQuery-reading/blob/master/jQuery%E5%9F%BA%E7%A1%80-%E4%BA%8B%E4%BB%B6/event.html)

其实到了这里我们会发现这不是和this的功能有点像吗？其实this和event.target还是有区别的：js中事件是会冒泡的，所以this是可以变化的，但event.target不会变化，它永远是直接接受事件的目标DOM元素；

总结以下常用的事件对象的属性和方法：

-   event.type：获取事件的类型  
    触发元素的事件类型

```
$("element").click(function(event) {
      alert(event.type); // "click"事件
});
```

-   event.pageX 和 event.pageY：获取鼠标当前相对于页面的坐标
-   event.preventDefault() 方法：阻止默认行为  
    这个用的很多,如点击一个链接（a标签），浏览器不会跳转到新的 URL 去了。

```
$("a").click(function(event){
    event.preventDefault();
});
```

-   event.stopPropagation() 方法：阻止事件冒泡  
    事件是可以冒泡的，为防止事件冒泡到DOM树上，也就是不触发的任何前辈元素上的事件处理函数

完！
