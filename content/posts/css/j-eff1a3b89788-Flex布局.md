---
title: "Flex布局"
date: 2017-08-17
slug_jianshu: eff1a3b89788
tags: []
state: open
source: "https://www.jianshu.com/p/eff1a3b89788"
source_kind: jianshu
---
在传统的布局方案中，是基于盒模型的，一般使用display+position+float属性，对于一些特殊的布局中，如水平垂直居中就比较麻烦，CSS居中可参考我之前的一篇文章[CSS居中](https://www.jianshu.com/p/0fc76e1b1558)

### 1、Flex布局基本概念

-   Flex 是 Flexible Box 的缩写，意为"弹性布局"，用来为盒状模型提供最大的灵活性。

若要设置一个容器为flex布局只需要在其样式加上`display: flex`就行

flex布局

这里主要注意main axis（水平主轴）和垂直的侧轴（cross axis），中间的三个为flex container容器内的子元素。

### 2 、容器的属性

-   `flex-direction: row | row-reverse | column | column-reverse`; // 决定主轴的方向
-   `flex-wrap: nowrap | wrap | wrap-reverse` //换行
-   flex-flow //上面两者属性综合
-   `justify-content: flex-start | flex-end | center | space-between | space-around` //项目在主轴上的对齐方式
-   `align-items: flex-start | flex-end | center | baseline | stretch;` //定义项目在侧轴上如何对齐。
-   align-content //定义了多根轴线的对齐方式。如果项目只有一根轴线，该属性不起作用。

### 3、项目的属性

-   `order: <integer>` //定义项目的排列顺序。数值越小，排列越靠前，默认为0
-   `flex-grow: <number>` //定义项目的放大比例，默认为0
-   `flex-shrink: /* default 1 */` //flex-shrink属性定义了项目的缩小比例，默认为1，即如果空间不足，该项目将缩小
-   `flex-basis :/* default auto */` //定义了在分配多余空间之前，项目占据的主轴空间(main size)
-   flex //flex-grow, flex-shrink 和 flex-basis的简写
-   align-self //允许单个项目有与其他项目不一样的对齐方式，可覆盖align-items属性

参考资料：  
[http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html](https://link.jianshu.com?t=http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html)  
[http://www.ruanyifeng.com/blog/2015/07/flex-examples.html](https://link.jianshu.com?t=http://www.ruanyifeng.com/blog/2015/07/flex-examples.html)  
[MDN Flex](https://link.jianshu.com?t=https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Flexible_Box_Layout/Using_flexbox_to_lay_out_web_applications)
