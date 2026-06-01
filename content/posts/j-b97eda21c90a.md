---
title: "CSS常见样式（一）"
date: 2017-04-29
slug_jianshu: b97eda21c90a
tags: ["简书"]
state: open
source: "https://www.jianshu.com/p/b97eda21c90a"
source_kind: jianshu
---
## 1、块级元素和行内元素分别有哪些，有什么区别？

-   常见block：  
    div、h1~h6、p  
    from/ul/dl/ol/table  
    li/dd/dt/tr/td/th
    
-   常见inline：  
    span、em、a、br、img、button  
    input、labbel、textarea、select
    
-   区别：  
    1、block包含块级和行内，而行内只包含文本和行内  
    2、block占据一整行空间，行内占据自身宽度空间  
    3、宽高设置只对块级元素（block）生效、行内元素（inline）设置无效  
    4、块级元素可设置4个方向的内外边距，而块级元素只对设置左右内外边距有效。
    

## 2、什么是CSS继承，哪些属性可以，哪些不行？

-   **CSS继承**：应用样式的元素后代会继承样式的某些特性
-   **能继承的元素**：letter-spacing、word-spacing、white-space、line-height、color、font、font-family、font-size、font-style、font-variant、font-weight、text-decoration、text-transform、direction、list-style、list-style-type、list-style-position、list-style-image、text-indent和text-align
-   **不能继承**：display、margin、border、padding、background、height、min-height、max-height、width、min-width、max-width、overflow、position、left、right、top、bottom、z-index、float、clear、table-layout、vertical-align、page-break-after和page-bread-before

## 3、如何让块级元素居中？如何让行内元素水平居中？

-   块级元素居中：`margin：0 auto`
-   行内元素居中：`text-align : center`

## 4、用CSS绘制三角形、圆角边框

[https://joinmouse.github.io/border/index.html](https://link.jianshu.com?t=https://joinmouse.github.io/border/index.html)

## 5、单行文本溢出加 ...如何实现

主要运用下面三句语法：

-   `white-space:nowrap` //告诉文本不换行
-   `overflow:hidden` //将文本溢出的需要隐藏掉
-   `text-overflow:ellipsis` //将溢出部分变为三个**...**

## 6、 px、em、rem有什么区别？

-   px实际上就是像素，用px设置字体大小时，比较稳定和精确。但是这种方法存在一个问题，当用户在浏览器中浏览我们制作的Web页面时，如果改变了浏览器的缩放，这时会使用我们的Web页面布局被打破。这样对于那些关心自己网站可用性的用户来说，就是一个大问题了。因此，这时就提出了使用“em”来定义Web页面的字体。
-   em就是根据基准来缩放字体的大小。em实质是一个相对值，而非具体的数值。这种技术需要一个参考点，一般都是以的“font-size”为基准。
-   rem，em是相对于其父元素来设置字体大小的，这样就会存在一个问题，进行任何元素设置，都有可能需要知道他父元素的大小。而rem是相对于根元素，这样就意味着，我们只需要在根元素确定一个参考值。

## 7、解释下面代码的作用?为什么要加引号? 字体里\\5b8b\\4f53代表什么?

image.png

回答：设置font-family字体，由于字体中间有空格加引号是为了识别成两个元素。在我们编写网页时候、css 编码是 utf8 时，某些情况下直接写：宋体、微软雅黑之类的中文字体名字，会出现不能识别导致字体设置失效的问题，如果把字体名字转成对应编码‘\\5b8b\\4f53’，就不会出现这个问题
