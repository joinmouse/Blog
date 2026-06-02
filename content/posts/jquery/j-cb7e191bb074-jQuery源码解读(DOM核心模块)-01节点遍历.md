---
title: "jQuery源码解读(DOM核心模块)-01节点遍历"
date: 2017-07-31
slug_jianshu: cb7e191bb074
tags: []
state: open
source: "https://www.jianshu.com/p/cb7e191bb074"
source_kind: jianshu
---
### 1、遍历简介

在数据结构中有遍历这个概念，简单的说就是将数据的所有节点查询一遍，不同的数据结构有不同的遍历方法，同一种数据结构也有不同的遍历方法，jQuery的遍历函数包含了筛选、查找元素等方法。

可以想看一个DOM树：

DOM节点

-   <div> 元素是 <ul> 的父元素，同时是其中所有内容的祖先。
-   <ul> 元素是 <li> 元素的父元素，同时是 <div> 的子元素
-   左边的 <li> 元素是 <span> 的父元素，<ul> 的子元素，同时是 <div> 的后代。
-   <span> 元素是 <li> 的子元素，同时是 <ul> 和 <div> 的后代。
-   两个 <li> 元素是同胞（拥有相同的父元素）。
-   右边的 <li> 元素是 <b> 的父元素，<ul> 的子元素，同时是 <div> 的后代。
-   <b> 元素是右边的 <li> 的子元素，同时是 <ul> 和 <div> 的后代。

这里写一个例子  
HTML

```
<h2>文档遍历处理</h2>
<button id="test1">文档筛选eq</button>
<button id="test2">文档筛选filter</button>
<button id="test3">文档筛选not</button>
<button id="test4">树遍历children</button>
<button id="test5">树遍历closest</button>
<button id="test6">树遍历find</button>

<h2>节点树</h2>
<ul class="level-1">
  <li class="item-i">I</li>
  <li class="item-ii">II
    <ul class="level-2">
      <li class="item-a">A</li>
      <li class="item-b">B
        <ul class="level-3">
          <li class="item-1">1</li>
          <li class="item-2">2</li>
          <li class="item-3">3</li>
        </ul>
      </li>
      <li class="item-c">C</li>
    </ul>
  </li>
  <li class="item-iii">III</li>
</ul>
```

jQuery的一些遍历方法

```
    //通过eq()查找对应的序列的第三个li元素
    $('#test1').on('click',function(){
        $('li').eq(2).css('background','red')  
    })
    //通过filter()方法来进行筛选奇数的li元素
    $("#test2").click(function() {
        $('li').filter(':even').css('background-color', 'blue');
    })
    //通过not()方法进行否定的筛选，既除xxx外，仅查找同胞元素
    $("#test3").click(function() {
        $('li').not(':even').css('background-color', 'red');
    })
    //childern()查找儿子元素
    $("#test4").click(function() {
        $('ul.level-2').children().css('background-color', 'yellow');
    })
    //closest()方法是取得最近的匹配元素，从元素本身开始逐级向上
    $("#test5").click(function() {
        $('li.item-a').closest('ul').css('background-color', 'red');
    })
    //find()就不必说了，常用的查找方法
    $("#test6").click(function() {
        $('li.item-ii').find('li').css('background-color', 'blue');
    })
```

效果测试预览：[点击我](https://link.jianshu.com?t=https://joinmouse.github.io/jQuery-reading/%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB\(DOM%E6%A0%B8%E5%BF%83\)-%E8%8A%82%E7%82%B9%E9%81%8D%E5%8E%86/index.html)

### 2、jQuery的遍历结构设计

上面我们已经发现jQuery的提供了各种遍历的接口,同时这些遍历的接口很多都是具有相似或者说是一类的处理功能，那么这种接口的设计我们不能就事论事的一个一个去实现，这样代码就会显得非常累赘也不容易维护，丰富的接口可以让高层的设计更为简单,但是框架内部的却要简练。那么针对这种类似功能的接口，jQuery内部就会做更多的抽象处理了。

接口的遍历我们可以分为下面几大类：

-   1 祖先
-   2 同胞兄弟
-   3 后代
-   4 过滤
