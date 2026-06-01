---
title: "jQuery基础-DOM篇"
date: 2017-07-23
slug_jianshu: a88aeb6cc42c
tags: ["简书"]
state: open
source: "https://www.jianshu.com/p/a88aeb6cc42c"
source_kind: jianshu
---
jQuery对DOM的操作上，在原生的JS的基础上封装和简化出对节点的创建、删除、插入、替换和复制，还有jQuery中丰富的遍历操作。

### 1、从创建DOM节点写起

通过JavaScript可以很方便的获取DOM节点，从而进行一系列的DOM操作一般而言我们都是先定义好HTML结构，但是想想一下当我们过AJAX获取到数据之后然后才能确定结构的话，这种情况就需要动态的处理节点了，而动态的处理节点就是常见的一个DOM操作，下面先列举一个DOM创建节点及节点属性的例子  
HTML

```
<div class="left">
    点击当前区域会动态创建元素节点
</div>

<script type="text/javascript">
    var body = document.querySelector('body')
    var div = document.querySelector('.left')

  
    div.addEventListener('click',function(){
      //创建一个div元素，为其设置一个class=right的属性
      var rightDiv = document.createElement('div')
      rightDiv.setAttribute('class','right')
      //动态的为创建的节点添加内容,将节点添加到body上
      rightDiv.innerText = "动态的创建DIV节点" 
      body.appendChild(rightDiv)
    })
</script>
```

CSS样式

```
.left,.right {
        width: 100px;
        height: 90px;
        padding: 5px;
        margin: 5px;
        float: left;
        border: 1px solid #ccc;
    }
    
    .left {
        background: red;
    }
    
    .right {
        background: yellow;
    }
```

[代码演示](https://link.jianshu.com?t=https://joinmouse.github.io/jQuery-reading/jQuery%E5%9F%BA%E7%A1%80-DOM%E7%AF%87/creatNode.html)  
[查看源码](https://link.jianshu.com?t=https://github.com/joinmouse/jQuery-reading/blob/master/jQuery%E5%9F%BA%E7%A1%80-DOM%E7%AF%87/creatNode.html)

在上面例子HTML中引入jQuery后，script部分可以这样写

```
  let $body = $('body');
  $('div').on('click',function(){
    let div = $("<div class='right'>动态创建DIV节点</div>")
    $body.append(div)
  })
```

通过上面实现同样的功能，但是DOM操作经过jQuery封装后比使用原生JS简洁很多，这里常见就是将操作的节点的结构给通过HTML标记字符串描述出来，通过$()函数处理，$("html结构")

```
$("<div class='right'>动态创建DIV节点</div>")
```

这就是jQuery创建节点的方式，让我们保留HTML的结构书写方式，非常的简单、方便和灵活。

### 2、DOM节点的删除

在jQuery中常见的对DOM节点删除操作的是empty()和remove()方法，下面直接通过一个demo说明

```
<style>
    .test {
      width: 100px;
      height: 100px;
      background: red;
    }
    .test1 {
        background: #bbffaa;
    }
    
    .test2 {
        background: yellow;
    }
    </style>
</head>

<body>
    <h2>通过jQuery empty方法移除元素</h2>
    <div class="test">
        <p>p元素1</p>
        <p>p元素2</p>
    </div>
    <button>通过点击jQuery的empty移除元素</button>

    <h2>通过jQuery remove方法移除元素</h2>
    <div class="test1">
        <p>p元素3</p>
        <p>p元素4</p>
    </div>
    <div class="test2">
        <p>p元素5</p>
        <p>p元素6</p>
    </div>
    <button>通过点击jQuery的remove移除元素</button>
    <button>通过点击jQuery的remove移除指定元素</button>

    <script type="text/javascript">
    $("button:first").on('click',function(){
      //只删除div节点中的节点
      $(".test").empty()
    })

    $("button:eq(1)").on('click', function() {
        //删除整个 class=test1的div节点
        $(".test1").remove()
    })

    $("button:last").on('click', function() {
        //找到所有p元素中，包含了3的元素
        //这个也是一个过滤器的处理
        $("p").remove(":contains('5')")
    })
    </script>
```

[代码演示](https://link.jianshu.com?t=https://joinmouse.github.io/jQuery-reading/jQuery%E5%9F%BA%E7%A1%80-DOM%E7%AF%87/remove.html)

需要注意的是使用remove方法删除div节点的时候，remove内部会自动销毁操作事件的方法，这样可防止"内存泄漏"，下面我们通过上面的例子来总结下empty()和remove()删除节点的区别：

**empty()**

-   严格地讲，empty()方法并不是删除节点，而是清空节点，它能清空元素中的所有后代节点
-   empty不能删除自己本身这个节点

**remove()**

-   该节点与该节点所包含的所有后代节点将同时被删除
-   提供传递一个筛选的表达式，删除指定合集中的元素

### 3、DOM节点的插入

前面已经写过如何的去动态创建元素，但这样是不够的，只是将其临时的存放在内存中，最终我们需要的时候将动态创建的元素放到页面文档中并呈现出来，那么问题来了，如何操作了？  
这里就涉及到一个位置关系，常见的就是把这个新创建的元素，当作页面某一个元素的子元素放到其内部。针对这样的处理，jQuery就定义2个操作的方法：

-   append :这个操作就是指定的元素执行原生appendChild方法
-   appendTo：实际上，使用这个方法是颠倒了常规的$(A).append(B)的操作，即不是把B追加到A中，而是把A追加到B中。

其实这里的append()和appendTo()两种方法功能相同，主要的不同是语法——内容和目标的位置不同，除了以上两种方法还有prepend()和prependTo()，只不过后两种是将匹配的元素前置内容当中

### 4、DOM节点的复制和替换

-   复制节点：clone()  
    复制节点是DOM常见的操作，clone()复制所有匹配的元素集合，包括所有匹配元素、匹配元素的下级元素、文字节点;当我们在clone(ture)传入一个布尔值ture时，不仅复制了节点结构，还将其绑定的事件和数据一并克隆了，下面看一个例子：  
    HTML

```
<div class="clone">
    <h3>仅复制节点结构 => clone()</h3>
    <p>你喜欢的水果是?</p>
    <ul>
      <li>苹果</li>
      <li>橘子</li>
      <li>菠萝</li>
    </ul> 
  </div>
  
  <div class="cloneTrue">
    <h3>复制节点结构、绑定的事件、数据 => clone(true)</h3>
    <p>你喜欢的水果是?</p>
    <ul>
      <li>苹果</li>
      <li>橘子</li>
      <li>菠萝</li>
    </ul> 
  </div>
```

jQuery的clone()方法

```
    $('.clone ul li').on('click',function(){
      $(this).clone().appendTo('ul:first')  //复制当前点击的节点，并将其追加到ul中
    })

    $('.cloneTrue ul li').on('click',function(){
      console.log(this)
      //复制当前点击的节点元素和其所绑定的点击事件，并将其追加到ul中
      $(this).clone(true).appendTo('ul:last')  
    })
```

[代码演示](https://link.jianshu.com?t=https://joinmouse.github.io/jQuery-reading/jQuery%E5%9F%BA%E7%A1%80-DOM%E7%AF%87/clone.html)

-   替换节点：replaceWith()和replaceAll()  
    replaceWith(newContent):使用$()选择节点A，调用replaceWith方法，传入一个新的内容B(HTML字符串、DOM元素或jQuery对象)，用来提花选中的节点A。  
    replaceAll(target):功能与replaceWith()类似，但目标和源相反。  
    下面我们举一个例子来对上面两个替换方法进行说明  
    HTML

```
<div class="left">
        <button class="bt1">点击,通过replaceWith替换内容</button>
        <button class="bt2">点击,通过rreplaceAll替换内容</button>
    </div>
    <div>
        <div class=oneDiv>
            <p>第一段</p>
            <p>第二段</p>
            <p>第三段</p>
        </div>
        <div>
            <p>第四段</p>
            <p>第五段</p>
            <p>第六段</p>
        </div>
    </div>
    
<script>
   $(".bt1").on('click', function() {
        //找到内容为第二段的p元素
        //通过replaceWith删除并替换这个节点
        $(".right > div:first p:eq(1)").replaceWith('<a style="color:red">replaceWith替换第二段的内容</a>')
    })

        //找到内容为第六段的p元素
        //通过replaceAll删除并替换这个节点
    $(".bt2").on('click', function() {
        $('<a style="color:red">replaceAll替换第六段的内容</a>').replaceAll('.right > div:last p:last');
    })
</script>
```

这里我们需要注意的是，replaceWith()与replaceAll() 方法替换的同时删除掉被替换节点相关联的数据和事件绑定

-   包裹节点:wrap()  
    若需要讲元素用其他元素包裹起来，即给它增加一个父元素，jQuery提供了一个wrap方法。先看一段代码

```
<p>p元素</p>
```

给P增加一个div包裹

```
$('p').wrap('<div></div>')      //为p元素增加一个父div结构
```

需要注意的是wrap(fn)可以传入一个回调函数，返回用于包裹元素的HTML内容或jQuery对象

```
$('p').wrap(function(){
  return '<div></div>'       //同上面类似，但写法不一样
})
```

与wrap()相反的是，unwrap()方法用来给选择的元素删除父节点，这个与remove()方法不同的是，它只是删除父节点而保留子节点。

### 5、DOM节点的查找和遍历

-   find()、children()方法  
    理解节点查找关系：

```
<div class="div">
  <ul class="son">
    <li class="grandson">open</li>
  </ul>
</div>
```

我们可以通过`$('div').find('li')`来查找出li元素节点，若使用`$('div').children()`查找的只能是ul元素节点，其实这里我们依据定义方法的单词就可以判断出find()查找方法更为广泛，而children()只可以查找出自己的子元素节点

-   parent()、parents()方法  
    与上面的children()查找方法相反，parent()是用来查找父元素的`$('li').parnet()` ,这样我们查找的也是ul元素节点 。也类似find与children的区别，parent只会查找一级，parents则会往上一直查到查找到祖先节点，也就是说可以`$('li').parnets()`再上面查找到的就是祖辈元素div
    
-   next()、pre()方法  
    这里其实很好理解next()就是查找某个节点的下一个兄弟元素，而pre()就是查找某个节点的上一个兄弟元素，下面还是举一个简单的例子
    

```
        <div class="div">
            <ul class="level-1">
                <li class="item-1">1</li>
                <li class="item-2">2</li>
                <li class="item-3">3</li>
            </ul>
        </div>

        <div class="div">
            <ul class="level-2">
                <li class="item-1">1</li>
                <li class="item-2">2</li>
                <li class="item-3">3</li>
            </ul>
        </div>

        <div class="div">
            <ul class="level-3">
                <li class="item-1">1</li>
                <li class="item-2">2</li>
                <li class="item-3">3</li>
            </ul>
        </div>
        <button>点击：next()查找</button>
        <button>点击：pre()查找</button>
```

jQuery的next()和pre方法

```
//点击第一个button,触发回调函数;找到所有class=item-2的li
//然后给每个li加上红色的边框
$('button:first').on('click',function(){
  $('item-1').next().css('border','1px solid red')
})

$('button:first').on('click',function(){
  $('item-2').pre().css('border','1px solid blue')
})
```

-   siblings()方法  
    与next()和pre()不同，siblings()方法是取得匹配的元素中其他兄弟节点的集合

> 上面讲的这些方法都是如何去查找匹配元素节点的，而遍历一般用的是jQuery中的each()方法

-   each()方法  
    each() 方法就是一个for循环的迭代器，它会迭代jQuery对象合集中的每一个DOM元素。每次回调函数执行时，会传递当前循环次数作为参数(从0开始计数)。  
    上面的一段介绍中有总结出来就是3个重点：  
    1、each是一个for循环的包装迭代器  
    2、each通过回调的方式出来，并且有两个固定的实参，索引和元素  
    3、each回调方法中的this指向当前迭代的dom元素

语法：`$('xxx').each(function(index element))`

完！

其实和数据库操作类似，主要的DOM操作也无非就是增、删、改、查，外加一个遍历，通过这篇总结希望有时候忘了一些操作方法的时候可以随时来查看
