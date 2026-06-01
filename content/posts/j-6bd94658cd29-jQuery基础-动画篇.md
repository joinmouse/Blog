---
title: "jQuery基础-动画篇"
date: 2017-07-28
slug_jianshu: 6bd94658cd29
tags: ["简书"]
state: open
source: "https://www.jianshu.com/p/6bd94658cd29"
source_kind: jianshu
---
动画效果是jQuery库中很吸引人的地方，通过jQuery的动画方法，可以很方便的为网页添加视觉效果，给用户一些更棒的体验

### 1、基础方法：hide()和show()

基础语法：`$('element').hide([duration ] [,easing ] [,complete ])`

通过hide方法可以隐藏元素，当这里没有出现参数的时候等同于设置display属性: `$('element').css("display","none")`

这里的三个参数分别表示：  
1、duration：动画持续时间  
2、easing：表示过渡动画使用那种缓动函数，jQuery自身提供"linear" 和 "swing"  
3、complete：在动画完成时执行的函数

使用

```
$('.target').hide();                   //直接隐藏，不使用可选参数

 $('.target').hide(300, function() {      //300ms后元素被隐藏，并执行匿名函数
    alert('Animation complete');
 }
```

**show()方法**  
基础语法：`$('element').show([duration ] [,easing ] [,complete ])`  
用于显示元素，用法与hide类似，这里就不展开了

这里我们可以看出来show与hide是一对互斥的方法。需要对元素进行显示隐藏的互斥切换，通常情况是需要先判断元素的display状态，然后调用其对应的处理方法。对于这样的操作行为，jQuery提供了一个便捷方法toggle用于切换显示或隐藏匹配元素

**toggle( \[duration \] \[, easing \] \[, complete \] )**  
这里补充的一个方法是toggle()，用来切换元素的隐藏、显示，类似于toggleClass，用法和show、hide类似,举个例子，当发现选取元素被隐藏，调用toggle()方法就由隐藏到出现；当发现选取元素是显示的，调用toggle()方法就由隐藏到出现。  
HTML

```
  <style>
    div {
        width: 500px;
        height: 50px;
        padding: 5px;
        margin: 5px;
        float: left;
        border: 1px solid #ccc;
    }
    
    .left {
        background: #bbffaa;
    }
    
    .right {
        background: yellow;
        display: none;
    }
    </style>

      
    <div class="left">显示到隐藏</div>
    <div class="right">隐藏到显示</div>
    <button>直接show-hide动画</button>
    <button>直接hide-show动画</button>
```

toggle()方法切换

```
 <script type="text/javascript">
    $("button:first").click(function() {
          $(".left").toggle(3000)     //显示到隐藏的切换
    });

    $("button:last").click(function() {
        $(".right").toggle(3000)           //隐藏到显示的切换
    });
    </script>
```

### 2、渐变效果

**fadeIn、fadeOut**  
同show()方法不同的是，fadeIn()和fadeOut()方法**只改变元素的不透明度**，fadeOut()在指定的一段时间内降低元素的不透明度，知道元素完全消失（display：none）,fadeIn()则反之。

语法：`fadeOut([duration ] [, easing ] [, complete ])`，fadeIn用法同理

**fadeToggle**  
用法与上面的toggle类似，切换淡入和淡出方法

### 3、滑动效果

**slideDown()**  
语法：`slideDown( [duration ] [, easing ] [, complete ] )`  
用滑动动画显示一个匹配元素，方法将给匹配元素的高度的动画，这会导致页面的下面部分滑下去，弥补了显示的方式

**slideUp()**  
语法：`slideUp( [duration ] [, easing ] [, complete ] )`  
用滑动动画隐藏一个匹配元素，方法将给匹配元素的高度的动画，这会导致页面的下面部分滑上去，当一个隐藏动画后，高度值达到0的时候，display 样式属性被设置为none，以确保该元素不再影响页面布局。

**slideToggle()**  
用滑动动画显示或隐藏一个匹配元素，用法与toggle、fadeToggle方法类似

### 4、自定义动画animate

语法：`.animate(properties,options)`  
参数分析：  
**properties:**是一个或多个css属性的键值对所构成的Object对象。要特别注意所有用于**动画的属性必须是数字的**，比如常见的border、margin、padding、width、height、left、top、font等等都是可以产生动画效果的，下面给一个简单的写法

```
.animate({
  left: 50
  width: 50
  opactity: 'show'       //每一个属性可以使用show/hide/toggle来控制元素的显示或者隐藏
  fontSize: "10em"   
},500)
```

**options:** 参数options是一组包含动画选项的值的集合。 常用的选项:  
1、duration (default: 400)：一个字符串或者数字决定动画将运行多久。默认值: "normal"， 三种预定速度的字符串("slow", "normal", 或 "fast"或表示动画时长的毫秒数值(如：1000) ）  
2、easing (default: swing)：一个字符串，表示过渡使用哪种缓动函数。jQuery自身提供"linear" 和 "swing"，其他效果可以使用jQuery Easing Plugin插件  
3、step：每个动画元素的每个动画属性将调用的函数。这个函数为修改Tween 对象提供了一个机会来改变设置中得属性值。  
4、complete：在动画完成时执行的函数

下面举一个例子来演示  
HTML

```
    <style>
        .div {
           width:80px;
           height:80px;
           background-color:red;
           position:relative
        }
    </style>

    <button id="btn1">变宽</button>
    <button id="btn2">复原</button>
    <button id="btn3">变宽变大移动</button>
    <button id="btn4">多个动画</button>
    <button id="btn5">停止动画</button>

    <div class="div"></div>
```

animate动画的使用

```
        $div = $('.div')
        $("#btn1").on('click', function(e){
            $div.animate({width: '200px'});
        });
        $("#btn2").on('click', function(){
            $div.animate({
                width:'80px',
                height: '80px',
                left: '0px',
                top: '0px',
                opacity: 1
            }, 500);
        });
        $("#btn3").on('click', function(){
            $div.animate({
                width:'150px',
                height: '150px',
                left: '100px',
                top: '100px',
                opacity: 0
            }, 500);

   $('#btn4').on('click',function(){
        $div.animate({width:'150',height:'150px'})   //采用jQuery的链式调用写法，简化代码
          .animate({left:'200px'})
          .animate({top:'200px'})
          .animate({left:'0px'})
          .animate({top:'0px'})
          .animate({width:'80px',height:'80px'})
      })

 $('#btn5').on('click',function(){     //点击对应按钮可停止动画
        $div.stop(true)
      })
```

[代码运行效果](https://link.jianshu.com?t=https://joinmouse.github.io/jQuery-reading/jQuery%E5%9F%BA%E7%A1%80-%E5%8A%A8%E7%94%BB/animate.html)  
[查看源码](https://link.jianshu.com?t=https://github.com/joinmouse/jQuery-reading/blob/master/jQuery%E5%9F%BA%E7%A1%80-%E5%8A%A8%E7%94%BB/animate.html)

**stop()方法**\--停止动画  
语法：

```
.stop( [clearQueue ], [ jumpToEnd ] )
```

当一个元素调用.stop()，当前正在运行的动画（如果有的话）立即停止，如果同一元素调用多个动画方法，尚未被执行的动画被放置在元素的效果队列中。这些动画不会开始，直到第一个完成。  
当调用.stop()的时候，队列中的下一个动画立即开始。如果clearQueue参数提供true值,那么在队列中的动画其余被删除并永远不会运行；如果提供jumpToEnd参数，并且值为true时，当前动画将停止，但该元素上的 CSS 属性会被立刻修改成动画的目标值。

我知道上面的可能有点抽线难以理解，简单使用就是：  
1、stop()：只会停止第一个动画，第二个第三个继续...  
2、stop(true)：停止第一个、第二个和第三个动画...  
3、stop(true ture)：停止动画，直接跳到第一个动画的最终状态
